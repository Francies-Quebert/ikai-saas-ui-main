import React, { Fragment, useEffect, useState } from "react";
import { controllers } from "chart.js";

const ServiceSelect = props => {
  return (
    <Fragment>
      <div className={`card ${props.isSelected ? "card-click" : ""}`}>
        <div className="blog-box blog-list row" onClick={props.OnServiceSelect}>
          <div className="col-sm-5">
            <img className="img-fluid sm-100-w" src={props.ServiceImg} alt="" />
          </div>
          <div className="col-sm-7">
            <div className="blog-details">
              <h6>{props.ServiceTitle} </h6>
              <div className="blog-date digits">{props.ServiceDesc}</div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default ServiceSelect;
