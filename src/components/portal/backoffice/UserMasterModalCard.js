import React from "react";

const DisplayEmployeeModalCard = props => {
  return (

      <div className="mega-inline plain-style w-100">
        <div className="card" style={{ width: "100%" }}>
          <div className="media p-20">
            <div className="media-body">
              <h6 className="mt-0 mega-title-badge">Assigned Attendant</h6>
              Attendant Name: {props.data.Name}
              <br/>
              Attendant Email: {props.data.email}
              <br />
              Attendant Mobile No.: +91 {props.data.mobile1}
              <br />
              {/* Assigned Date/Time: {props.data.scheduleDate} / {props.data.slot} */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default DisplayEmployeeModalCard;
