import React, {useState} from "react";
import "./searchForStudent.css";
import Axios from "axios";

const SearchForStudent = (props) => {
  const [inputText, setInputText] = useState("");
  const [filterBy, setFilterBy] = useState("first_name");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response = await Axios.get(
      `http://127.0.0.1:5000/students/student/filter/${filterBy}/value/${inputText}`
    );
    let students = response.data.students;
    props.onFilter(students);
  };

  return (
    <div className="container mt-2">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="row justify-content-center">
          <div className="pl-4 col-2 mt-3 text-white">
            <h2>Filter by:</h2>
          </div>
          <div className="col-3 mt-3">
            <select
              onChange={(e) => {
                setFilterBy(e.target.value);
              }}
              id="inputState"
              className="form-control rounded-pill"
            >
              <option value="firt_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="age">Age</option>
            </select>
          </div>
          <div className="col-6">
            <div className="input-group">
              <input
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
                type="text"
                placeholder=" Search term"
                className="custon-input rounded-pill"
              />
              <div className="input-group-append">
                <button
                  type="submit"
                  className="btn btn-secondary rounded-pill custom-button"
                  disabled={!inputText}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForStudent;
