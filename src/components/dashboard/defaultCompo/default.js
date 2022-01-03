import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../common/breadcrumb";
import BookingCard from "../../common/booking-card/BookingCard";
// import { Typeahead } from "react-bootstrap-typeahead";
import "react-datepicker/dist/react-datepicker.css";
// import "react-bootstrap-typeahead/css/Typeahead.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOrdersPortal,
  acceptOrderPortal,
  rejectOrderPortal,
} from "../../../store/actions/ordersPortal";
import { setFormCaption } from "../../../store/actions/currentTran";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const Default = () => {
  const portalOrders = useSelector((state) => state.ordersPortal);
  const dispatch = useDispatch();

  // const [selectedDate, setSelectedDate] = useState(moment(new moment())._d);
  const [fromDate, setFromDate] = useState(moment(new moment())._d);
  const [toDate, setToDate] = useState(moment(new moment())._d);

  useEffect(() => {
    dispatch(setFormCaption("Dashboard", "Orders"));
    dispatch(
      fetchOrdersPortal(
        moment(fromDate).format("YYYY-MM-DD"),
        moment(toDate).format("YYYY-MM-DD")
      )
    );
  }, []);

  useEffect(() => {});

  let options = [
    { name: "New Booking" },
    { name: "Accepted" },
    { name: "Rejected" },
    { name: "Pending" },
    { name: "Deleted" },
  ];

  useEffect(() => {
    // if (portalOrders.isLoading === false) {
    // fetchOrdersPortal(
    //   moment(fromDate).format("YYYY-MM-DD"),
    //   moment(toDate).format("YYYY-MM-DD")
    // );
    // }
  }, [portalOrders.isLoading]);

  let renderItem = null;
  if (portalOrders.isLoading) {
    renderItem = <div>Loading....</div>;
  } else if (portalOrders.error) {
    renderItem = <div>Error:{portalOrders.error}</div>;
  } else {
    renderItem =
      portalOrders.ordersPortal &&
      portalOrders.ordersPortal.map((item) => {
        return (
          <BookingCard
            // key={item.orderId}
            Status={item.statusDesc}
            ScheduleStatus={item.OrderStatus}
            ServiceType={item.orderTitle}
            OrderId={`#${item.orderid}`}
            CustomerName={item.userName}
            OrderDate={moment(item.orderdate).format("DD-MM-YYYY")}
            Service={item.orderTitle}
            ScheduleDate={moment(item.ScheduledFrom).format("DD-MM-YYYY")}
            ScheduleTime={item.slotName}
            Address={`${item.add1}\n${item.add2}\n${item.geoLocationName}`}
            MobileNo={item.mobile}
            NetPayable={item.NetPayable}
            onBookingAcceptClick={() => {
              dispatch(acceptOrderPortal(item.orderid));
              dispatch(
                fetchOrdersPortal(
                  moment(fromDate).format("YYYY-MM-DD"),
                  moment(toDate).format("YYYY-MM-DD")
                )
              );
            }}
            onBookingRejectClick={() => {
              dispatch(rejectOrderPortal(item.orderid));
              dispatch(
                fetchOrdersPortal(
                  moment(fromDate).format("YYYY-MM-DD"),
                  moment(toDate).format("YYYY-MM-DD")
                )
              );
            }}
            onViewDetailClick={() => {}}
            onAssignAttendantClick={() => {}}
            // Gender={item.gender}
          />
        );
      });
  }
  return (
    <Fragment>
      <div className="container-fluid ">
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
                        onChange={(evt) => {
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
                        onChange={(evt) => {
                          setToDate(evt);
                        }}
                      />
                    </div>
                    <div className="col-sm-2">
                      <button
                        className="btn btn-primary "
                        type="submit"
                        onClick={() => {
                          dispatch(
                            fetchOrdersPortal(
                              moment(fromDate).format("YYYY-MM-DD"),
                              moment(toDate).format("YYYY-MM-DD")
                            )
                          );
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 m-5">
                <div className="row ">{renderItem}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Default;
