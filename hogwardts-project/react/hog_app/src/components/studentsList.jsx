import React, {useEffect, useState} from "react";
import Axios from "axios";
import {Link} from "react-router-dom";
import "./studentsList.css";
import SearchForStudent from "./searchForStudent";

const StudentsList = (props) => {
  const [students, setStudents] = useState("");

  const getStudents = async () => {
    const response = await Axios.get("http://127.0.0.1:5000/students");
    const students_list = response.data.students;
    setStudents(students_list);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const filterStudentsList = (students) => {
    setStudents(students);
  };

  useEffect(() => {
    getStudents();
    const studentsInterval = setInterval(getStudents, 500000);
    return () => {
      clearInterval(studentsInterval);
    };
  }, []);

  return (
    <div className="background-orange p-2">
      <SearchForStudent onFilter={filterStudentsList} />
      <div className="container mt-5">
        <div className="row">
          <div className="col-4">
            <h1 className="m-5 text-white students-text">Students</h1>
          </div>
          <div className="col-7 ml-5">
            <button
              onClick={(e) => handleRefresh(e)}
              className="btn btn-secondary float-right rounded-pill"
            >
              Reset filter
            </button>
          </div>
        </div>
        <ul className="list group">
          <li className="list-group-item bg-secondary rounded-pill text-white">
            <div className="row">
              <div className="col-3">
                <h4>First Name</h4>
              </div>
              <div className="col-3">
                <h4>Last Name</h4>
              </div>
              <div className="col-3">
                <h4>Age</h4>
              </div>
            </div>
          </li>
          {students &&
            students.map((student) => (
              <li
                className={
                  "list-group-item rounded-pill student-li m-2 pt-4 pl-5"
                }
                key={student._id}
              >
                <Link
                  onClick={() => props.onClick(student._id)}
                  to={`/students/student/${student._id}`}
                  className="text-dark student-row"
                >
                  <div className="row">
                    <div className="col-3">
                      <h5>{student.first_name}</h5>
                    </div>
                    <div className="col-3">
                      <h5>{student.last_name}</h5>
                    </div>
                    <div className="col-3">
                      <h5>{student.age}</h5>
                    </div>
                    <div className="col-3">
                      <h5>
                        <span className="badge  badge-pill badge-outline-secondary">
                          Click for more info
                        </span>
                      </h5>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentsList;
