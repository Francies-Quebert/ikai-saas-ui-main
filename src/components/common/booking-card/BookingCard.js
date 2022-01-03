import React, { Fragment, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";

const BookingCard = props => {
  const [ssAleart, setSsAlert] = useState();
  const showAlert = (actiontype, message) => {
    setSsAlert(
      <SweetAlert
        showCancel
        confirmBtnText="Continue"
        // confirmBtnBsStyle={"default"}
        // type={"default"}
        title="Are you sure?"
        onCancel={() => setSsAlert()}
        onConfirm={() => {
          setSsAlert();
          if (actiontype === "accept") {
            props.onBookingAcceptClick();
          } else if (actiontype === "reject") {
            props.onBookingRejectClick();
          }
        }}
      >
        {message}
      </SweetAlert>
    );
  };
  return (
    <Fragment>
      {ssAleart}
      <div className="col-sm-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 p-0">
              <div
                className="card"
                style={{
                  borderBottomRightRadius: 4,
                  borderBottomLeftRadius: 4
                }}
              >
                <div
                  className="card-header bg-primary  p-t-10 p-b-10"
                  style={{ borderTopRightRadius: 4, borderTopLeftRadius: 4 }}
                >
                  <div className="row">
                    <div className="col-12 p-l-5 typography">
                      <h6 className="f-w-700">
                        {/* <h5 className="f-w-100 m-0" style={{ fontWeight:100 }}> */}
                        {props.ServiceType}
                        {/* </h5> */}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="card-body p-t-10 p-b-10 p-2">
                  <div className="row">
                    {props.ScheduleStatus === "BKD" || props.ScheduleStatus === "NWB" ? (
                      <div
                        class="ribbon ribbon-right ribbon-success"
                        style={{ top: 6, right: 10 }}
                      >
                        {props.Status}
                      </div>
                    ) : props.ScheduleStatus === "CNL" || props.ScheduleStatus === "REJ" ? (
                      <div
                        class="ribbon ribbon-right  ribbon-danger"
                        style={{ top: 6, right: 10 }}
                      >
                        {props.Status}
                      </div>
                    ) : props.ScheduleStatus === "SCH" ? (
                      <div
                        class="ribbon ribbon-right  ribbon-warning"
                        style={{ top: 6, right: 10 }}
                      >
                        {props.Status}
                      </div>
                    ) : null}

                    <div className="col-sm-5">
                      <label className="f-w-700">Order Id/ Date</label>
                    </div>

                    <div className="col-sm-7">
                      <p className="f-w-400">
                        {props.OrderId} / {props.OrderDate}
                      </p>
                    </div>
                    <div className="col-sm-5">
                      <label className="f-w-700">Customer Name</label>
                    </div>

                    <div className="col-sm-7">
                      <p className="f-w-400">{props.CustomerName}</p>
                    </div>
                    {/* <div className="col-sm-5">
                    <label className="f-w-700">Order Date</label>
                  </div>
                  <div className="col-sm-7">
                    <p className="f-w-400">{props.OrderDate}</p>
                  </div> */}
                    <div className="col-sm-5">
                      <label className="f-w-700">Service</label>
                    </div>
                    <div className="col-sm-7">
                      <p className="f-w-400">{props.Service}</p>
                    </div>
                    <div className="col-sm-5">
                      <label className="f-w-700">Schedule Date</label>
                    </div>
                    <div className="col-sm-7">
                      <p className="f-w-400">{props.ScheduleDate}</p>
                    </div>
                    <div className="col-sm-5">
                      <label className="f-w-700">Schedule Time</label>
                    </div>
                    <div className="col-sm-5">
                      <p className="f-w-400">{props.ScheduleTime}</p>
                    </div>
                    <div className="col-sm-5">
                      <label className="f-w-700">Contact No.</label>
                    </div>
                    <div className="col-sm-7">
                      <p className="f-w-400">{props.MobileNo}</p>
                    </div>
                    <div className="col-sm-5">
                      <label className="f-w-700">Net Payable</label>
                    </div>
                    <div className="col-sm-7">
                      <p className="f-w-400">{"\u20B9" + " " + parseFloat(props.NetPayable).toFixed(2)}</p>
                    </div>

                    {/* <div className="col-sm-5">
                    <label className="f-w-700">Gender</label>
                  </div>
                  <div className="col-sm-7">
                    <p className="f-w-400">{props.Gender==="M" ? "Male":"Female"}</p>
                  </div> */}
                    <div className="col-sm-5">
                      <label className="f-w-700">Customer Address</label>
                    </div>
                    <div className="col-sm-7">
                      <p className="f-w-400">{props.Address}</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer p-3 p-t-0 p-b-0">
                  <div className="row">
                    <button
                      className="btn btn-success p-t-0 p-b-0"
                      style={{ flex: 1, borderRadius: 0 }}
                      onClick={() =>
                        showAlert(
                          "accept",
                          "Do you want to accept this booking"
                        )
                      }
                      disabled={props.ScheduleStatus==="BKD" ||props.ScheduleStatus === "CNL" || props.ScheduleStatus === "REJ" }                    >
                      ACCEPT
                    </button>
                    <button
                      className="btn btn-danger p-t-0 p-b-0"
                      style={{ flex: 1, borderRadius: 0 }}
                      onClick={props.onBookingRejectClick}
                      onClick={() =>
                        showAlert(
                          "reject",
                          "Do you want to reject this booking"
                        )
                      }
                      disabled={props.ScheduleStatus==="BKD" ||props.ScheduleStatus === "CNL" || props.ScheduleStatus === "REJ" }
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BookingCard;

// onBookingAcceptClick={() => {}}
// onBookingRejectClick={() => {}}
// onViewDetailClick={() => {}}
// onAssignAttendantClick={() => {}}
