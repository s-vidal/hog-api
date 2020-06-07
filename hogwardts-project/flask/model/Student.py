import json
from datetime import datetime


class Student:

    def __init__(self, student_content):
        super().__init__()
        self.first_name = student_content["first_name"]
        self.last_name = student_content["last_name"]
        self.age = str(student_content["age"])
        self.created_at = datetime.now().strftime("%d-%m-%Y")
        # self.existing_magic_skills = self.set_existing_magic_skills(student_content)
        # self.desired_magic_skills = self.set_desired_magic_skills(student_content)
        # self.interested_courses = self.set_interested_courses(student_content)
        # self.last_updated = str(last_updated)

    def set_id(self, _id):
        self.id = str(_id)

    def set_existing_magic_skills(self, student_content):
        if "existing_magic_skills" in student_content:
            return student_content["existing_magic_skills"]
        return {}

    def set_desired_magic_skills(self, student_content):
        if "desired_magic_skills" in student_content:
            return student_content["desired_magic_skills"]
        return {}

    def set_interested_courses(self, student_content):
        if "interested_courses" in student_content:
            return student_content["interested_courses"]
        return []

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__)


