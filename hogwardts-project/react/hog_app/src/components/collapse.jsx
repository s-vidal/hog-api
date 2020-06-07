import React from "react";

const Collapse = (props) => {
  return (
    <div>
      <p>
        <button
          className="btn btn-outline-secondary rounded-pill mt-3"
          type="button"
          data-toggle="collapse"
          data-target={`#${props.id}`}
        >
          See {props.title}
        </button>
      </p>
      <div className="collapse" id={props.id}>
        {props.skills.length === 0 && `No ${props.title}`}
        <ul className="list-group list-group-horizontal">
          {Object.keys(props.skills).map((skill) => {
            return (
              <li key={skill} className="list-group-item">
                <span>{skill}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Collapse;
