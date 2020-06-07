import React, {useState} from "react";
import {Link} from "react-router-dom";
import "./navBar.css";

const NavBar = (props) => {
  return (
    <div className="navbar-height background-orange">
      <ul className="nav custom-nav">
        <li className="nav-item">
          <Link className="nav-link nav-text" to="/">
            <h4>HomePage</h4>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link nav-text" to="/students">
            <h4>Student List</h4>
          </Link>
        </li>
        {props.token && (
          <li className="nav-item mr-5 pr-5">
            <Link className="nav-link nav-text" to="/add-student">
              <h4>Add student</h4>
            </Link>
          </li>
        )}
        <li className="nav-item ml-5 pl-5">
          <Link className="nav-link nav-text" to="/teacher-login">
            {props.token && <h4 className="ml-5 pl-5">Logout</h4>}
            {!props.token && <h4>Teacher Login</h4>}
          </Link>
        </li>
        <li className="nav-item ml-5">
          <span>
            {props.id && (
              <h4 className="">{`Teacher-Id: ${localStorage.id}`}</h4>
            )}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
