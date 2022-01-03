import React from "react";
import CountUp from "react-countup";
import { Box } from "react-feather";

const OrderBookingShowStatsItem = props => {
  return (
    <div className="col-sm-6 col-xl-3 col-lg-6 p-1 p-l-10">
      <div className="card m-b-10">
        <div className="bg-secondary b-r-4 card-body">
          <div className="media static-top-widget">
            <div className="align-self-center text-center">
              <Box />
            </div>
            <div className="media-body">
              <span className="m-0">Products</span>
              <h4 className="mb-0 counter">
                <CountUp className="counter" end={9856} />
              </h4>
              <Box className="icon-bg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBookingShowStatsItem;
