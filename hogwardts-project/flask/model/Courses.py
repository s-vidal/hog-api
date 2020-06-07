class Courses:

    __courses = ["course_1", "course_2", "course_3", "course_4", "course_5"]

    @staticmethod
    def get_courses_list():
        return Courses.__courses

    @staticmethod
    def delete_course(course_name):
        try:
            for course in Courses.__courses:
                if course == course_name.lower():
                    Courses.__courses.remove(course)
        except Exception as e:
            raise e

    @staticmethod
    def add_course(course_name):
        if course_name.lower() not in Courses.__courses and len(course_name) > 1:
            try:
                Courses.__courses.append(course_name)
            except Exception as e:
                raise e