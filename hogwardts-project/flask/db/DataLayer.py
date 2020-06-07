import json
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from flask_caching import Cache
from db.BaseDBLayer import BaseDBLayer
from util import encode_auth_token


class DataLayer(BaseDBLayer):

    def __init__(self, app):
        super().__init__()
        self.__client = MongoClient('localhost', 27017)
        self.__db = self.__client["hogwarts"]
        self.__students = self.__db["students"]
        self.__password = self.__db["passwords"]
        self.__teachers = self.__db["users"]
        self.__cache = Cache(config={'CACHE_TYPE': 'simple', 'CACHE_THRESHOLD': 1000})
        self.__cache.init_app(app)

    def sign_up(self, name, email, password):
        try:
            encrypted_password = self.encrypt(password)
            teacher_id = self.__teachers.insert_one(
                {"name": name, "email": email, "password": encrypted_password}).inserted_id
            teacher_id = str(teacher_id)
            token = encode_auth_token(teacher_id)
            self.__teachers.update_one({"_id": ObjectId(teacher_id)}, {"$set": {"token": token}})
            return {"token": token, "_id": teacher_id}
        except Exception as e:
            raise e

    def login(self, email, password):
        try:
            teacher = self.__teachers.find_one({"email": email})
            stored_password = teacher["password"]
            decrypted_password = self.decrypt(stored_password)
            if decrypted_password != password:
                return None
            teacher["_id"] = str(teacher["_id"])
            token = encode_auth_token(teacher["_id"])
            self.__teachers.update_one({"_id": ObjectId(teacher["_id"])}, {"$set": {"token": token}})
            return {"token": token, "_id": teacher["_id"]}
        except Exception as e:
            raise e

    def get_students(self):
        try:
            cached_students = self.__cache.get("students")
            if cached_students:
                return cached_students
            else:
                students_list = self.__students.find()
                students = list(students_list).copy()
                for student in students:
                    student["_id"] = str(student["_id"])
                self.__cache.set("students", students, timeout=30)
            return students
        except Exception as e:
            raise e

    def add_student(self, student_str):
        try:
            student = json.loads(student_str)
            student_id = self.__students.insert_one(student).inserted_id
            self.update_cache(student_id)
            return student_id
        except Exception as e:
            raise e

    def get_student_by_id(self, student_id):
        try:
            cached_student = self.__cache.get(student_id)
            if cached_student:
                return cached_student
            else:
                student = self.__students.find_one({"_id": ObjectId(student_id)})
                student["_id"] = str(student["_id"])
                self.update_cache(student_id)
                return student
        except Exception as e:
            raise e

    def get_student_by_first_name(self, first_name):
        try:
            # cached_student = self.__cache.get(first_name)
            # if cached_student:
            #     return cached_student
            # else:
                students_cursor = self.__students.find({"first_name": first_name})
                students = list(students_cursor)
                for student in students:
                    student["_id"] = str(student["_id"])
                # self.__cache.set(first_name, students, timeout=30)
                return students
        except Exception as e:
            raise e

    def get_students_by_value(self, filter_by, value):
        try:
            students_cursor = self.__students.find({str(filter_by): str(value)})
            students = list(students_cursor)
            for student in students:
                student["_id"] = str(student["_id"])
            return students
        except Exception as e:
            raise e

    def delete_student_by_id(self, student_id):
        try:
            result = self.__students.delete_one({"_id": ObjectId(student_id)})
            self.__cache.delete(student_id)
            self.update_cache()
            return result
        except Exception as e:
            raise e

    def get_password(self):
        try:
            password = self.__password.find()
            return password
        except Exception as e:
            raise e

    def update_student(self, student_id, update_fields):
        try:
            result = self.__students.update_one({"_id": ObjectId(student_id)}, {"$set": update_fields})
            self.set_update_time(student_id)
            self.update_cache(student_id)
            return result
        except Exception as e:
            raise e

    def get_student_skills(self, student_id, skills_type):
        try:
            if skills_type == "existing_magic_skills":
                skills = self.__students.find_one({"_id": ObjectId(student_id)},
                                                  {"_id": 0, "existing_magic_skills": True})
            elif skills_type == "desired_magic_skills":
                skills = self.__students.find_one({"_id": ObjectId(student_id)},
                                                  {"_id": 0, "desired_magic_skills": True})
            return skills
        except Exception as e:
            raise e

    def update_student_skills(self, student_id, content):
        skill_type = content["skill_type"]
        skill = content["skill_name"]
        level = content["skill_level"]
        path = f"{skill_type}.{skill}.level"
        try:
            result = self.__students.update_one({"_id": ObjectId(student_id)},
                                                {"$set": {f"{path}": f"{level}"}})
            self.set_update_time(student_id)
            self.update_cache(student_id)
        except Exception as e:
            raise e

    def delete_student_skill(self, student_id, content):
        skill_type = content["skill_type"]
        skill = content["skill_name"]
        path = f"{skill_type}.{skill}"
        try:
            result = self.__students.update_one({"_id": ObjectId(student_id)},
                                                {"$unset": {f"{path}": ""}})
            self.set_update_time(student_id)
            self.update_cache(student_id)
        except Exception as e:
            raise e

    def get_courses_by_student_id(self, student_id):
        try:
            courses = self.__students.find_one({"_id": ObjectId(student_id)},
                                               {"_id": 0, "interested_courses": True})
            return courses
        except Exception as e:
            raise e

    def add_to_list(self, student_id, items_to_add, list_to_update):
        try:
            result = self.__students.update_one({"_id": ObjectId(student_id)},
                                                {"$push": {list_to_update: {"$each": items_to_add}}})
            self.set_update_time(student_id)
            self.update_cache(student_id)
            return result
        except Exception as e:
            raise e

    def remove_from_list(self, student_id, items_to_remove, list_to_update):
        try:
            result = self.__students.update_one({"_id": ObjectId(student_id)},
                                                {"$pull": {list_to_update: {"$in": items_to_remove}}})
            self.set_update_time(student_id)
            self.update_cache(student_id)
            return result
        except Exception as e:
            raise e

    def get_count_students_added_per_day(self):
        try:
            students_cursor = self.__students.aggregate(
                [{"$group": {"_id": {"$dateFromString": {"dateString": "$created_at", "format": "%d-%m-%Y"}},
                             "count": {"$sum": 1}}}])
            students = list(students_cursor)
            return students
        except Exception as e:
            raise e

    def get_count_students_existing_skills(self):
        try:
            students_cursor = self.__students.aggregate(
                [{"$group": {"_id": "$existing_magic_skills"}, "count": {"$sum": 1}}])
            students = list(students_cursor)
            return students
        except Exception as e:
            raise e

    def set_update_time(self, student_id):
        self.__students.update_one({"_id": ObjectId(student_id)},
                                   {"$set": {"updated_on": datetime.now().strftime("%d-%m-%Y")}})

    def update_cache(self, student_id=False):
        # retrieving from db and not functions because they already include caching
        students_list = self.__students.find()
        students = list(students_list).copy()
        for student in students:
            student["_id"] = str(student["_id"])
        self.__cache.set("students", students, timeout=30)
        if student_id:
            student = self.__students.find_one({"_id": ObjectId(student_id)})
            student["_id"] = str(student["_id"])
            self.__cache.set(student_id, student, timeout=30)




