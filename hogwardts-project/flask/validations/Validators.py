import jwt

from model.Skills import Skills
from model.Courses import Courses
from util import decode_auth_token


class Validators:

    __student_mandatory_properties = ['first_name', 'last_name', 'age']

    def __init__(self, dataLayer):
        self.dataLayer = dataLayer

    def validate_student(self, student):
        try:
            for prop in Validators.__student_mandatory_properties:
                if prop not in student:
                    raise ValueError("Student missing mandatory property: " + prop)

        except Exception as e:
            raise e

    def validate_student_id(self, student_id):
        try:
            students = self.dataLayer.get_students()
            is_id_valid = False
            for student in students:
                if str(student["_id"]) == student_id:
                    is_id_valid = True
            if is_id_valid:
                return is_id_valid
            else:
                raise Exception("Invalid id provided")
        except Exception as e:
            raise e

    def validate_password(self, given_password):
        try:
            password = self.dataLayer.get_password()
            if password == given_password:
                return True
            else:
                raise ValueError("Invalid password provided")
        except Exception as e:
            raise e

    def validate_student_name(self, first_name):
        try:
            if 1 > len(first_name) > 30:
                raise ValueError("Invalid input provided")
            return True
        except Exception as e:
            raise e

    def validate_filter_by(self, filter_by, value):
        try:
            if filter_by not in self.__student_mandatory_properties or len(value) < 1:
                raise ValueError("Invalid fields provided")
            return True
        except Exception as e:
            raise e

    def validate_update_fields(self, student_id, update_fields):
        try:
            student = self.dataLayer.get_student_by_id(student_id)
            for field in update_fields:
                if field not in student:
                    raise ValueError("Invalid fields provided")
            return True
        except Exception as e:
            raise e

    def validate_skills_type(self, skills_type):
        try:
            skills_types = Skills.get_skills_types()
            if skills_type in skills_types:
                return True
            else:
                raise ValueError("Invalid fields provided")
        except Exception as e:
            raise e

    def validate_skills_update_request(self, content):
        try:
            if content["skill_type"] in Skills.get_skills_types() and content["skill_name"] in Skills.get_skills_list():
                if 0 <= int(content["skill_level"]) <= 5:
                    return True
            else:
                raise ValueError("Invalid input")
        except Exception as e:
            raise e

    def validate_skill_to_delete(self, content):
        try:
            if content["skill_type"] in Skills.get_skills_types() and content["skill_name"] in Skills.get_skills_list():
                return True
            else:
                raise ValueError("Invalid input")
        except Exception as e:
            raise e

    def validate_courses_to_add(self, courses_to_add, student_id):
        try:
            existing_courses = self.dataLayer.get_courses_by_student_id(student_id)
            for course in courses_to_add["courses"]:
                if course not in existing_courses and course in Courses.get_courses_list():
                    return True
            raise ValueError("Invalid input")
        except Exception as e:
            raise e

    def validate_courses_to_delete(self, courses_to_delete, student_id):
        try:
            existing_courses = self.dataLayer.get_courses_by_student_id(student_id)
            for course in courses_to_delete["courses"]:
                if course not in existing_courses["interested_courses"]:
                    raise ValueError("Invalid input")
            return True
        except Exception as e:
            raise e

    def validate_sign_up(self, email):
        pass

    def validate_token(self, token, user_id):
        try:
            token = str.encode(token)
            user_id_from_token = decode_auth_token(token)
            if user_id != user_id_from_token:
                raise ValueError('Invalid token. Log in again.')
        except jwt.ExpiredSignatureError:
            raise ValueError('Signature expired. Please log in again.')
        except Exception as e:
            raise e

