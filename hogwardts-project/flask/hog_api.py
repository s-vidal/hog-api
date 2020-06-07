import os

from flask import Flask, json, request
from db.DataLayer import DataLayer
from validations.Validators import Validators
from model.Student import Student
from flask_cors import CORS
from flask_caching import Cache

app = Flask(__name__)
cors = CORS(app)

dataLayer = DataLayer(app)
validators = Validators(dataLayer)

cache = Cache(config={'CACHE_TYPE': 'simple'})
cache.init_app(app)


def create_response(resp_obj, status_code):
    response = app.response_class(
        response=resp_obj,
        status=int(status_code),
        mimetype="application/json")
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route("/")
@cache.cached(timeout=30)
def welcome():
    return "hog api"


@app.route("/students")
# @cache.cached(timeout=30)
def get_students():
    try:
        # content = request.json
        # token = request.headers.get("auth_token")
        # validators.validate_token(token, content["user_id"])
        students = dataLayer.get_students()
        return create_response(json.dumps({"students": students}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students", methods=['POST'])
def add_student():
    student_content = request.json
    try:
        token = request.headers.get('auth-token')
        teacher_id = request.headers.get('_id')
        validators.validate_token(token, teacher_id)
        validators.validate_student(student_content)
        student = Student(student_content)
        student_id = dataLayer.add_student(student.to_json())
        student.set_id(str(student_id))
        return create_response(student.to_json(), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>")
# @cache.cached(timeout=30)
def get_student_by_id(student_id):
    try:
        validators.validate_student_id(student_id)
        student = dataLayer.get_student_by_id(student_id)
        return create_response(json.dumps({"student": student}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>", methods=["DELETE"])
def delete_students_by_id(student_id):
    try:
        # password = request.json
        # validators.validate_password(password)
        token = request.headers.get('auth-token')
        teacher_id = request.headers.get('_id')
        validators.validate_token(token, teacher_id)
        validators.validate_student_id(student_id)
        result = dataLayer.delete_student_by_id(student_id)
        return create_response(json.dumps({"deleted_student": student_id}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/name/<first_name>")
@cache.cached(timeout=30)
def get_student_by_first_name(first_name):
    try:
        validators.validate_student_name(first_name)
        students = dataLayer.get_student_by_first_name(first_name)
        return create_response(json.dumps({"students": students}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/filter/<filter_by>/value/<value>")
@cache.cached(timeout=30)
def get_students_by_value(filter_by, value):
    try:
        validators.validate_filter_by(filter_by, value)
        students = dataLayer.get_students_by_value(filter_by, value)
        return create_response(json.dumps({"students": students}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>", methods=["PUT"])
def update_student(student_id):
    update_fields = request.json
    try:
        token = request.headers.get('auth-token')
        teacher_id = request.headers.get('_id')
        validators.validate_token(token, teacher_id)
        validators.validate_student_id(student_id)
        validators.validate_update_fields(student_id, update_fields)
        result = dataLayer.update_student(student_id, update_fields)
        return create_response(json.dumps({"status": "ok"}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>/skills", methods=["GET"])
def get_student_skills(student_id):
    # query has to look like this: /skills?type=existing_magic_skills
    try:
        # pass existing_magic_skills or desired_magic_skills
        skills_type = request.args["type"]
        validators.validate_student_id(student_id)
        validators.validate_skills_type(skills_type)
        skills = dataLayer.get_student_skills(student_id, skills_type)
        return create_response(json.dumps(skills), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>/skills", methods=["PUT"])
def update_student_skills(student_id):
    # content needs 3 properties: skill_type, skill_name, skill_level
    content = request.json
    try:
        token = request.headers.get('auth-token')
        teacher_id = request.headers.get('_id')
        validators.validate_token(token, teacher_id)
        validators.validate_student_id(student_id)
        validators.validate_skills_update_request(content)
        result = dataLayer.update_student_skills(student_id, content)
        return create_response(json.dumps({"status": "ok"}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>/skills", methods=["DELETE"])
def delete_student_skills(student_id):
    # content needs 2 properties: skill_type and skill_name
    content = request.json
    try:
        token = request.headers.get('auth-token')
        teacher_id = request.headers.get('_id')
        validators.validate_token(token, teacher_id)
        validators.validate_student_id(student_id)
        validators.validate_skill_to_delete(content)
        result = dataLayer.delete_student_skill(student_id, content)
        return create_response(json.dumps({"status": "ok"}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>/courses", methods=["GET"])
@cache.cached(timeout=30)
def get_student_interested_courses(student_id):
    try:
        validators.validate_student_id(student_id)
        courses = dataLayer.get_courses_by_student_id(student_id)
        return create_response(json.dumps(courses), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>/courses", methods=["PUT"])
def add_student_interested_courses(student_id):
    # requires a property called courses equal to an array
    courses_to_add = request.json
    try:
        token = request.headers.get('auth-token')
        teacher_id = request.headers.get('_id')
        validators.validate_token(token, teacher_id)
        validators.validate_courses_to_add(courses_to_add, student_id)
        result = dataLayer.add_to_list(student_id, courses_to_add["courses"], "interested_courses")
        return create_response(json.dumps({"status": "ok"}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/student/<student_id>/courses", methods=["DELETE"])
def delete_student_interested_course(student_id):
    courses_to_delete = request.json
    try:
        token = request.headers.get('auth-token')
        teacher_id = request.headers.get('_id')
        validators.validate_token(token, teacher_id)
        validators.validate_courses_to_delete(courses_to_delete, student_id)
        result = dataLayer.remove_from_list(student_id, courses_to_delete["courses"], "interested_courses")
        return create_response(json.dumps({"status": "ok"}), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/students/count/per_day")
@cache.cached(timeout=30)
def get_count_students_added_per_day():
    try:
        student_count = dataLayer.get_count_students_added_per_day()
        return create_response(json.dumps(student_count), 200)
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/sign-up", methods=["POST"])
def sign_up():
    try:
        content = request.json
        validators.validate_sign_up(content["email"])
        user_dict = dataLayer.sign_up(content["name"], content["email"], content["password"])
        resp = app.response_class(response=json.dumps(user_dict),
                                  status=200, mimetype='application/json')
        return resp
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


@app.route("/login", methods=["POST"])
def login():
    try:
        content = request.json
        # add validator
        user_dict = dataLayer.login(content["email"], content["password"])
        resp = app.response_class(response=json.dumps(user_dict),
                                  status=200, mimetype='application/json')
        return resp
    except Exception as e:
        # Logger.log(e)
        return create_response(json.dumps({"err": str(e)}), 400)


if __name__ == "__main__":
    # gets the environmental variables provided by Heroku
    port = os.environ.get('PORT')

    if port:
        app.run(host='0.0.0.0', port=int(port))
    else:
        app.run()

