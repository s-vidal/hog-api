import React, {useState, useEffect, useContext} from "react";
import Axios from "axios";
import Modal from "./modal";
import Collapse from "./collapse";
import TeacherContext from "../teacherContext";

const UpdateStudent = () => {
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [student, setStudent] = useState("");
  const [update, setUpdate] = useState("");

  const getStudent = async () => {
    const response = await Axios.get(
      `http://127.0.0.1:5000/${window.location.pathname}`
    );
    const student = response.data.student;
    setStudent(student);
  };

  const handleUpdate = async () => {
    if (update === true) {
      setUpdate(false);
    } else {
      setUpdate(true);
    }
  };

  const sendUpdates = async () => {
    let data = {};
    if (newFirstName.length !== 0) {
      data.first_name = newFirstName;
    }
    if (newLastName.length !== 0) {
      console.log(newLastName);
      data["last_name"] = newLastName;
    }
    if (newAge.length !== 0) {
      data["age"] = newAge;
    }

    const response = await Axios.put(
      `http://127.0.0.1:5000/${window.location.pathname}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.token,
          _id: localStorage.id,
        },
      }
    );
    setNewFirstName("");
    setNewLastName("");
    setNewAge("");
    setUpdate(false);
    await getStudent();
  };

  useEffect(() => {
    const id = localStorage.getItem("token");
    const token = localStorage.getItem("id");
    getStudent();
  }, []);

  return (
    <div className="container justify-content-center">
      <div className="row">
        <div className="col-2"></div>
        <div className="col-3">
          <h2 className="text-white">Update Student:</h2>
        </div>
        <div className="col-1 mr-2">
          <button
            onClick={handleUpdate}
            className="btn rounded-pill btn-secondary"
          >
            Update
          </button>
        </div>
        <div className="col-3">
          {update && (
            <button
              onClick={sendUpdates}
              className="btn rounded-pill btn-success"
            >
              Send updates
            </button>
          )}
        </div>
      </div>
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
                <h4 className="col-6 m-4">First Name: </h4>
                {!update && <h4 className="m-4">{student.first_name}</h4>}
                {update && (
                  <input
                    onChange={(e) => {
                      setNewFirstName(e.target.value);
                    }}
                    type="text"
                    placeholder={student.first_name}
                    className="rounded-pill"
                  ></input>
                )}
              </div>
            </li>
            <li className="list-group-item rounded-pill mt-2 pt-4">
              <div className="row">
                <h4 className="col-6 m-4">Last Name: </h4>
                {!update && <h4 className="m-4">{student.last_name}</h4>}
                {update && (
                  <input
                    onChange={(e) => {
                      setNewLastName(e.target.value);
                    }}
                    type="text"
                    placeholder={student.last_name}
                    className="rounded-pill"
                  ></input>
                )}
              </div>
            </li>
            <li className="list-group-item rounded-pill mt-2">
              <div className="row">
                <h4 className="col-6 m-4">Age: </h4>
                {!update && <h4 className="m-4"> {student.age}</h4>}
                {update && (
                  <input
                    onChange={(e) => {
                      setNewAge(e.target.value);
                    }}
                    type="text"
                    placeholder={student.age}
                    className="rounded-pill"
                  ></input>
                )}
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
  );
};

export default UpdateStudent;
