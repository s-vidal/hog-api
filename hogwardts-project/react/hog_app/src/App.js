import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "./App.css";
import StudentsList from "./components/studentsList";
import StudentProfile from "./components/studentProfile";
import NavBar from "./components/NavBar";
import HomePage from "./components/homePage";
import TeacherLoginPage from "./components/teacherLoginPage";
import TeacherContext from "./teacherContext";
import AddStudentPage from "./components/addStudentPage";

function App() {
  const [studentId, setStudentId] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const handleClick = (studentId) => {
    setStudentId(studentId);
  };

  const values = {
    setToken: (token) => {
      setToken(token);
    },
    setUserId: (id) => {
      setUserId(id);
    },
    token: {token},
    userId: {userId},
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    setToken(token);
    setUserId(id);
  });

  return (
    <TeacherContext.Provider value={values}>
      <Router>
        <div className="background-navBar">
          <NavBar token={token} id={userId} />
        </div>
        <div>
          <Switch>
            <Route path={`/students/student/${studentId}`}>
              <StudentProfile studentId={studentId} />
            </Route>
            <Route path="/students">
              <StudentsList onClick={handleClick} />
            </Route>
            {userId && (
              <Route path="/add-student">
                <AddStudentPage />
              </Route>
            )}
            <Route path="/teacher-login">
              <TeacherLoginPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </div>
      </Router>
    </TeacherContext.Provider>
  );
}

export default App;
