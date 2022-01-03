import React, { useState, Fragment, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
// import "react-bootstrap-typeahead/css/Typeahead.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import OrdersCard from "./OrdersCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import {
  fetchOrdersPortal,
  acceptOrderPortal,
  rejectOrderPortal,
  cancelOrderPortal,
  sendScheduleSms
} from "../../../store/actions/ordersPortal";
import OrderItem from "./OrderItem";
import OrderViewDetail from "./OrderViewDetail";
import { toast } from "react-toastify";
const OrdersDashboardOrder = props => {
  const dispatch = useDispatch();
  const portalOrders = useSelector(state => state.ordersPortal.ordersPortal);
  const [fromDate, setFromDate] = useState(moment(new moment())._d);
  const [toDate, setToDate] = useState(moment(new moment())._d);
  const statusColor = useSelector(
    state => state.AppMain.otherMasterOrderStatus
  );
  const [viewDetailData, setViewDetailData] = useState();
  const [foreColor, setForeColor] = useState();
  const [backColor, setBackColor] = useState();
  const [showViewDetails, setShowViewDetail] = useState(false);
  const [onSearch, setOnSearch] = useState();
  const currTran = useSelector(state => state.currentTran);
  useEffect(() => {
    dispatch(fetchUserMasters("A"));
    dispatch(
      fetchOrdersPortal(
        moment(fromDate).format("YYYY-MM-DD"),
        moment(toDate).format("YYYY-MM-DD")
      )
    );
    // dispatch(setFormCaption("Admin", "User Master"));
  }, []);
  useEffect(() => {
    if (currTran.isSuccess) {
      toast.success("Action Completed successfully...!");
    }
  }, [currTran.isSuccess]); 

  useEffect(() => {
    dispatch(fetchUserMasters("A"));
    dispatch(
      fetchOrdersPortal(
        moment(fromDate).format("YYYY-MM-DD"),
        moment(toDate).format("YYYY-MM-DD")
      )
    );
    // dispatch(setFormCaption("Admin", "User Master"));
  }, [onSearch,viewDetailData, showViewDetails]);

  return (
    <Fragment>
      {!showViewDetails && (
        <div className="tab-content active default" id="tab-1">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="d-flex justify-content-center align-items-center">
                        <label className="col-form-label ">
                          <strong>From:</strong>
                        </label>
                      </div>
                      <div className="col-sm-2 P-0">
                        <DatePicker
                          className="form-control digits date-style"
                          name="date"
                          id="date"
                          format="MM/DD/YYYY"
                          selected={fromDate}
                          onChange={evt => {
                            setFromDate(evt);
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-center align-items-center">
                        <label className="col-form-label">
                          <strong>To:</strong>
                        </label>
                      </div>
                      <div className="col-sm-2 P-0">
                        <DatePicker
                          className="form-control digits date-style"
                          name="date"
                          id="date"
                          format="MM/DD/YYYY"
                          selected={toDate}
                          onChange={evt => {
                            setToDate(evt);
                          }}
                        />
                      </div>
                      <div className="col-sm-2">
                        <button
                          className="btn btn-primary "
                          type="submit"
                          onClick={() => {
                            setOnSearch(!onSearch);
                            // dispatch(
                            //   fetchOrdersPortal(
                            //     moment(fromDate).format("YYYY-MM-DD"),
                            //     moment(toDate).format("YYYY-MM-DD")
                            //   )
                            // );
                          }}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {portalOrders &&
                  portalOrders.map(item => {
                    const colVal = statusColor
                      ? statusColor.find(
                          col => col.ShortCode === item.OrderStatus
                        )
                      : null;
                    return (
                      <div>
                        <OrderItem
                          data={item}
                          statusForeColor={colVal ? colVal.SysOption2 : ""}
                          statusBackColor={colVal ? colVal.SysOption1 : ""}
                          onViewDetailClick={() => {
                            setViewDetailData([item]);
                            setShowViewDetail(!showViewDetails);
                            setForeColor(colVal ? colVal.SysOption2 : "");
                            setBackColor(colVal ? colVal.SysOption1 : "");
                          }}
                        />
                      </div>
                    );
                  })}
                {/* <OrdersCard/> */}
              </div>
            </div>
          </div>
        </div>
      )}
      {viewDetailData && showViewDetails && (
        <OrderViewDetail
          data={viewDetailData[0]}
          OrderId={viewDetailData[0].orderid}
          statusBackColor={backColor}
          statusForeColor={foreColor}
          OnBookingAccepted={() => {
            dispatch(acceptOrderPortal(viewDetailData[0].orderid));
            setShowViewDetail(!showViewDetails);
          }}
          OnBookingRejected={() => {
            dispatch(rejectOrderPortal(viewDetailData[0].orderid));
            setShowViewDetail(!showViewDetails);
          }}
          onBookingCanceled={() => {
            dispatch(cancelOrderPortal(viewDetailData[0].orderid));
            setShowViewDetail(!showViewDetails);
          }}
          onBookingRescheduled={() => {
            setShowViewDetail(!showViewDetails);
          }}
          OnBackPress={() => {
            setShowViewDetail(!showViewDetails);
            setViewDetailData();
          }}
          SendSMS={() => {
            dispatch(sendScheduleSms(viewDetailData[0].orderid));
          }}
        />
      )}
    </Fragment>
  );
};

export default OrdersDashboardOrder;
