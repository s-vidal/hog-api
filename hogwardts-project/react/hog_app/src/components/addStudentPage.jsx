import React, {useState} from "react";
import Axios from "axios";

const AddStudentPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  const handleAddStudent = async () => {
    const response = await Axios.post(
      `http://127.0.0.1:5000/students`,
      {first_name: firstName, last_name: lastName, age: age},
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.token,
          _id: localStorage.id,
        },
      }
    );
    if (response.status === 200) {
      setPostSuccess(true);
      setTimeout(() => {
        setPostSuccess(false);
      }, 2000);
    }
    setFirstName("");
    setLastName("");
    setAge("");
  };

  return (
    <div className="background-orange">
      <div className="container text-white">
        <div className="row">
          <div className="col-8">
            <h1 className="text-white">Add Student:</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <ul className="list-group">
              <li className="list-group-item rounded-pill mt-5 p-0 bg-secondary">
                <div className="row">
                  <h4 className="col-3 m-4 ml-5">First Name: </h4>
                  <input
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    type="text"
                    placeholder=" First name.."
                    className="rounded-pill input-width"
                  ></input>
                </div>
              </li>
              <li className="list-group-item rounded-pill mt-5 p-0 bg-secondary">
                <div className="row">
                  <h4 className="col-3 m-4 ml-5">Last Name: </h4>
                  <input
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    type="text"
                    placeholder=" Last name.."
                    className="rounded-pill input-width"
                  ></input>
                </div>
              </li>
              <li className="list-group-item rounded-pill mt-5 p-0 bg-secondary">
                <div className="row">
                  <h4 className="col-3 m-4 ml-5">Age: </h4>
                  <input
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                    type="text"
                    placeholder=" Age.."
                    className="rounded-pill input-width"
                  ></input>
                </div>
              </li>
              <li className="list-group-item rounded-pill mt-5 p-0 ">
                <button
                  onClick={handleAddStudent}
                  className="btn btn-outline-secondary rounded-pill send-btn-width"
                >
                  <span>Send</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-4"></div>
          <div className="col-8 text-white">
            <div>{postSuccess && <h1>Student Added Succesfully</h1>}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentPage;
