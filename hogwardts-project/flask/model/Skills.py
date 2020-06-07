class Skills:

    __skills_type = ["existing_magic_skills", "desired_magic_skills"]
    __skills = ["skill_1", "skill_2", "skill_3", "skill_4", "skill_5"]

    @staticmethod
    def get_skills_list():
        return Skills.__skills

    @staticmethod
    def get_skills_types():
        return Skills.__skills_type

    @staticmethod
    def delete_skill(skill_name):
        try:
            for skill in Skills.__skills:
                if skill == skill_name:
                    Skills.__skills.remove(skill)
        except Exception as e:
            raise e

    @staticmethod
    def add_skill(skill_name):
        if skill_name not in Skills.__skills and len(skill_name) > 1:
            try:
                Skills.__skills.append(skill_name)
            except Exception as e:
                raise e



