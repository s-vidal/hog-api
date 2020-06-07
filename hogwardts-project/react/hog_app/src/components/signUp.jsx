import React, {useState, useContext, useEffect} from "react";
import {signUp} from "../lib/api";
import TeacherContext from "../teacherContext";

const SignUpForm = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const teacherContext = useContext(TeacherContext);

  const doSignUp = async (e) => {
    e.preventDefault();
    const response = await signUp(userName, email, password);
    if (response) {
      const {token, _id} = response.data;
      teacherContext.setToken(token);
      teacherContext.setUserId(_id);
      localStorage.setItem("token", token);
      localStorage.setItem("id", _id);
      setUserName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-9 mt-5 p-0">
            <h1 className="text-white ">Teacher's Sing-up: </h1>
          </div>
          <div className="col-3 mt-5">
            <button
              type="button"
              className="btn btn-secondary rounded-pill mt-2"
              data-toggle="modal"
              data-target="#exampleModalCenter"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{color: "black"}}
                className="modal-title"
                id="exampleModalLongTitle"
              >
                Sign Up:
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {
                <form onSubmit={(e) => doSignUp(e)} style={{color: "black"}}>
                  <div className="form-group">
                    <input
                      value={userName}
                      type="text"
                      className="form-control rounded-pill"
                      placeholder="User Name"
                      onChange={(e) => setUserName(e.target.value)}
                    ></input>
                  </div>
                  <div className="form-group ">
                    <input
                      value={email}
                      type="email"
                      className="form-control rounded-pill"
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    ></input>
                  </div>
                  <div className="form-group">
                    <input
                      value={password}
                      type="password"
                      className="form-control rounded-pill"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    ></input>
                  </div>
                  <div className="form-check"></div>
                  <button
                    type="submit"
                    className="btn btn-warning rounded-pill"
                  >
                    Submit
                  </button>
                </form>
              }
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary rounded-pill"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
