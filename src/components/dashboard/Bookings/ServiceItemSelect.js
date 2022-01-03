import React, { Fragment, useState } from "react";
import { CheckCircle, Circle } from "react-feather";

const ServiceItem = props => {
  const [isSelect, setIsSelect] = useState();
  const SelectComponent = isSelect ? CheckCircle : Circle;
  return (
    <Fragment>
      <div
        className={`card col-sm-12 m-5 `}
        onClick={() => {
          setIsSelect(!isSelect);
        }}
      >
        <div className="blog-box blog-list row">
          <div className="col-sm-1 p-l-15">
            <SelectComponent />
          </div>
          <div className="col-sm-11">
            <div className="blog-details">
              <div className="blog-date digits">
                <span>{props.title}</span>
                {/* &nbsp;&nbsp; Water Purifier &nbsp; / &nbsp;
              15-Jan-2018 */}
              </div>
              <h5>{props.desc}</h5>

              {isSelect && (
                <div>
                  <hr />
                  {"\u20B9" + " " + parseFloat(props.amount).toFixed(2)}
                  {/* <hr /> */}
                </div>
              )}
            </div>
          </div>
        </div>
        <hr className="m-t-5 m-b-5"/>
      </div>
    </Fragment>
  );
};
export default ServiceItem;
