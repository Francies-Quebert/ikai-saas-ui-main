import React, { Fragment, useEffect, useState } from "react";
import { controllers } from "chart.js";
import { CheckCircle, Circle } from "react-feather";

const SelectableItem = props => {
  const SelectComponent = props.IsSelected ? CheckCircle : Circle;
  return (
    <Fragment>

      <div className="col-md-12 p-2" onClick={props.OnServiceSelect}>
        <div
          className={`card clickable-card${props.IsSelected ? "-true" : ""} m-b-10`}
        >
          <div className="blog-box blog-list row">
            {/* <div className="col-sm-5">
              <img
                className="img-fluid sm-100-w"
                src={props.ServiceImg}
                alt=""
              />
            </div> */}
            <div className="col-2 pad-custom  justify-content-center align-items-center">
              <SelectComponent
                className={props.IsSelected ? "font-primary" : null}
              />
            </div>
            <div className="col-10 blog-details">
              {/* <div className=""> */}
                <h6 className="m-0">{props.ServiceTitle} </h6>

                {props.ServiceDesc && <div className="blog-date digits">{props.ServiceDesc}</div>}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default SelectableItem;
