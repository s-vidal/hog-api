import React, {useState, useContext, useEffect} from "react";
import {login} from "../lib/api";
import SignUpForm from "./signUp";
import TeacherContext from "../teacherContext";

const TeacherLoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const teacherContext = useContext(TeacherContext);

  const doLogin = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response) {
      const {token, _id} = response.data;
      teacherContext.setToken(token);
      teacherContext.setUserId(_id);
      localStorage.setItem("token", token);
      localStorage.setItem("id", _id);
    }
    setEmail("");
    setPassword("");
  };

  const handleLogout = () => {
    teacherContext.setToken("");
    teacherContext.setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
  };

  return (
    <>
      <div className="background-orange">
        {localStorage.token && (
          <div className="container">
            <div className="row">
              <div className="col-3"></div>
              <div className="col-6 mt-5">
                <h2 className="">Logged-In as:</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-3"></div>
              <div className="col-8 mt-3 mb-4">
                <h3 className="">Teacher-id: {localStorage.id}</h3>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-6 m-5">
                <h1 className="text-white">Sign-Out: </h1>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-6">
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary rounded-pill send-btn-width"
                >
                  <h4>Log-out</h4>
                </button>
              </div>
            </div>
          </div>
        )}
        {!localStorage.token && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-6">
                <div>
                  <h1 className="mb-5 mt-5 text-white">Teacher's Log-in:</h1>
                </div>
                <form onSubmit={(e) => doLogin(e)}>
                  <div className="form-group">
                    <h4 className="text-black m-2 p-2">Email address:</h4>
                    <input
                      value={email}
                      type="email"
                      className="form-control rounded-pill"
                      placeholder="Enter email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="form-group">
                    <h4 className="text-black m-2 p-2">Password:</h4>
                    <input
                      value={password}
                      type="password"
                      className="form-control rounded-pill"
                      placeholder="Enter password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    ></input>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-secondary btn-large mt-2 rounded-pill"
                  >
                    Submit
                  </button>
                </form>
                <SignUpForm />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherLoginPage;
