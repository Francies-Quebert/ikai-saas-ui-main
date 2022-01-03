import React from "react";

const DisplayCustomerItem = props => {
  return (
    <div className="mega-inline plain-style">
      <div className="card" style={{ minWidth: "50%" }}>
        <div className="media p-20">
          <div className="media-body">
            <h6 className="mt-0 mega-title-badge">
              {props.data.Name}
              {/* {props.data.FirstName}&nbsp;{props.data.LastName} */}
            </h6>
            {/* <p>Email :{props.data.email}</p>
            <p>Mobile No.: +91 {props.data.mobile}</p>
            <span>Gender: {props.data.gender}</span> */}
            Email :{props.data.email}
            <br />
            Mobile Number: +91 {props.data.mobile}
            {props.data.mobile1}
            <br />
            Gender: {props.data.Gender === "M" ? "Male" : "Female"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayCustomerItem;
