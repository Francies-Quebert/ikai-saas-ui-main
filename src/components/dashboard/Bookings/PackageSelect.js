import React, { Fragment, useEffect, useState } from "react";
import { CheckCircle, Circle } from "react-feather";
const PackageSelect = props => {
  const [selected, setIsSelected] = useState(false);
  const SelectComponent = selected ? CheckCircle : Circle;
  return (
    <div
      className="card col-sm-12 m-5"
      onClick={() => {
        setIsSelected(!selected);
      }}
    >
      <div className="blog-box blog-list row">
        <div className="col-sm-1 p-l-15">
          <SelectComponent />
        </div>
        <div className="col-sm-11">
          <div className="blog-details ">
            <div className="blog-date digits">
              <h5>{props.title}</h5>
            </div>
            {selected && (
              <div>
                <ul className="blog-social" style={{fontSize:14,color:"#777777"}}>
                 
                    {"\u20B9" + " " + parseFloat(props.amount).toFixed(2)}
                  
                </ul>
                <hr />
                <h6>{props.desc}</h6>
                {/* <hr /> */}
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="m-t-5 m-b-5" />
    </div>
  );
};

export default PackageSelect;
