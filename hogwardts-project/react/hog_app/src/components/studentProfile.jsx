import React, {useState, useEffect, useContext} from "react";
import Axios from "axios";
import Modal from "./modal";
import Collapse from "./collapse";
import TeacherContext from "../teacherContext";
import UpdateStudent from "./updateStudent";

const StudentPage = (props) => {
  const [student, setStudent] = useState("");

  const getStudent = async () => {
    const response = await Axios.get(
      `http://127.0.0.1:5000/${window.location.pathname}`
    );
    const student = response.data.student;
    setStudent(student);
  };

  useEffect(() => {
    const id = localStorage.getItem("token");
    const token = localStorage.getItem("id");
    getStudent();
  }, []);

  return (
    <div className="background-orange p-2 pt-2">
      {!localStorage.token && (
        <div className="container justify-content-center">
          <div className="row justify-content-center">
            <div className="col-10">
              <ul className="list-group">
                <li className="list-group-item bg-secondary text-white rounded-pill mt-5">
                  <div className="row">
                    <h4 className="col-6 m-4">ID: </h4>
                    <h4 className="m-4"> {student._id}</h4>
                  </div>
                </li>
                <li className="list-group-item rounded-pill mt-2">
                  <div className="row ">
                    <h4 className="col-8 m-4">First Name: </h4>
                    <h4 className="m-4">{student.first_name}</h4>
                  </div>
                </li>
                <li className="list-group-item rounded-pill mt-2 pt-4">
                  <div className="row">
                    <h4 className="col-8 m-4">Last Name: </h4>
                    <h4 className="m-4">{student.last_name}</h4>
                  </div>
                </li>
                <li className="list-group-item rounded-pill mt-2">
                  <div className="row">
                    <h4 className="col-8 m-4">Age: </h4>
                    <h4 className="m-4"> {student.age}</h4>
                  </div>
                </li>
                {student.existing_magic_skills && (
                  <li className="list-group-item rounded-pill mt-2">
                    <div className="row">
                      <h4 className="col-4 m-4">Existing Skills: </h4>
                      <Collapse
                        skills={student.existing_magic_skills}
                        id="existing"
                        title="Existing Skills"
                      />
                    </div>
                  </li>
                )}
                {student.desired_magic_skills && (
                  <li className="list-group-item rounded-pill mt-2">
                    <div className="row">
                      <h4 className="col-4 m-4">Desired Skills: </h4>
                      <Collapse
                        skills={student.desired_magic_skills}
                        id="desired"
                        title="Desired Skills"
                      />
                    </div>
                  </li>
                )}
                {student.interested_courses && (
                  <li className="list-group-item rounded-pill mt-2">
                    <div className="row">
                      <h4 className="col-4 m-4">Interested courses:</h4>
                      <Modal
                        courses={student.interested_courses}
                        id="courses"
                        title="Interested in Courses"
                      />
                    </div>
                  </li>
                )}
                {student.created_at && (
                  <li className="list-group-item rounded-pill mt-2 mb-5">
                    <div className="row">
                      <h4 className="col-6 m-4">Joined on: </h4>
                      <h4 className="m-4"> {student.created_at}</h4>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
      {localStorage.token && <UpdateStudent />}
    </div>
  );
};

export default StudentPage;
