import React, { useState } from "react";
import { CheckCircle, Circle } from "react-feather";

const SelectLocationItem = props => {
  const SelectComponent = props.IsSelected ? CheckCircle : Circle;

  return (
    <div
      className="col-sm-3"
      style={{ height: 60 }}
      onClick={props.onLocationClick}
    >
      <div className={`col-sm-12 m-5 card clickable-card${props.IsSelected ? "-true" : ""}`}>
        <div className="blog-box blog-list row">
          <div className="col-sm-2 p-10">
            <SelectComponent className={props.IsSelected ? "font-primary" : null} />
          </div>
          <div className="col-sm-10">
            <div className="blog-details">
              <div className="blog-date digits">
                <span>{props.LocationName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectLocationItem;
