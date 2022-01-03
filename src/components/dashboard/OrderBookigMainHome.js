import React, { useState, Fragment, useEffect } from "react";
import { Chart } from "react-google-charts";
import { useSelector, useDispatch } from "react-redux";
import OrderBookingShowStatsItem from "./OrderBookingMain/OrderBookingShowStatsItem";
import OrderBookingAddItem from "./OrderBookingMain/OrderBookingAddItem";
import OrderBookingRecentOrders from "./OrderBookingMain/OrderBookingRecentOrders";
import OrderBookingCardNew from "./OrderBookingMain/OrderBookingCardNew";
import OrderBookingCard from "./OrderBookingMain/OrderBookingCard";
import { setFormCaption } from "../../store/actions/currentTran";
import _ from "lodash";

const OrderBookingMainHome = props => {
  const [isNewBooking, setIsNewBooking] = useState(false);
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFormCaption(1));
  }, []);
  return (
    <Fragment>
      <div className="tab-content active default" id="tab-1">
        <div className="row">
          {isNewBooking === false && (
            <Fragment>
              <OrderBookingAddItem
                onAddClick={() => {
                  setIsNewBooking(true);
                }}
              />
              {/* <OrderBookingShowStatsItem />
              <OrderBookingShowStatsItem />
              <OrderBookingShowStatsItem /> */}
              <OrderBookingRecentOrders />
            </Fragment>
          )}
          {isNewBooking === true && (
            <Fragment>
              <OrderBookingCardNew 
              finishClick={()=>setIsNewBooking(false)}
               />
              {/* <OrderBookingCard finishClick={()=>setIsNewBooking(false)} /> */}
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default OrderBookingMainHome;
