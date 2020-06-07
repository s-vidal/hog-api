import React from "react";

const Modal = (props) => {
  return (
    <React.Fragment>
      <div>
        <button
          type="button"
          className="btn btn-outline-secondary rounded-pill mt-3"
          data-toggle="modal"
          data-target="#exampleModalCenter"
        >
          Interested courses
        </button>
      </div>
      <div></div>
      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <ul className={"list-group"}>
                {props.courses.map((course) => {
                  return (
                    <li key={course} className={"list-group-item"}>
                      {course}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Modal;
