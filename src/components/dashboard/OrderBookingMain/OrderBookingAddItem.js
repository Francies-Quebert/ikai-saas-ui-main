import React from "react";
import { PlusCircle } from "react-feather";
import CountUp from "react-countup";
import { hasRight } from "../../../shared/utility";
import { useSelector } from "react-redux";
const OrderBookingAddItem = (props) => {
  const currTran = useSelector((state) => state.currentTran);

  return (
    <div
      className="col-sm-6 col-xl-3 col-lg-6 p-1 p-l-10"
      onClick={
        hasRight(currTran.moduleRights, "ADD") ? 
        // () => {}
        props.onAddClick 
        : props.onAddClick
      }
      style={{
        cursor: `${
          hasRight(currTran.moduleRights, "ADD") ? `not-allowed` : `pointer`
        }`,marginLeft:13
      }}
    >
      <div className="card m-b-10">
        <div className="bg-primary b-r-4 card-body">
          <div className="media static-top-widget">
            <div className="align-self-center text-center">
              <PlusCircle />
            </div>
            <div
              className="media-body"
              style={{ height: 50, display: "flex", alignItems: "center" }}
            >
              <strong>
                <span className="m-0">Add New Booking</span>
              </strong>
              <PlusCircle className="icon-bg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBookingAddItem;
