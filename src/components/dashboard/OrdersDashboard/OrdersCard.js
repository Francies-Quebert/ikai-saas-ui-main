import React from "react";
import moment from "moment";
const OrdersCard = props => {
  return (
    <div className="card col-sm-12 m-5">
      <div className="blog-box blog-list row">
        <div
          className="ribbon ribbon-right ribbon-right ribbon-success"
          style={{
            backgroundColor: props.statusBackColor,
            color: props.statusForeColor
          }}
        >
          {props.data.statusDesc}
        </div>

        <div className="col-sm-11">
          <div className="blog-details">
            <div className="blog-date digits">
              <span># {props.data.orderid}</span> &nbsp;&nbsp;{" "}
              {props.data.orderTitle} &nbsp; / &nbsp;
              {moment(props.data.orderdate).format("DD-MMM-YYYY")}
            </div>
            <h6>
              {props.data.userName} (+91 {props.data.mobile})
            </h6>

            {
              <div>
                <ul className="blog-social">
                  <h6>{props.data.PaymentStatus}</h6>
                  <li>
                    {/* {`${moment(props.data.ScheduledFrom).format(
                      "DD-MMM-YYYY"
                    )} ${
                      props.data.ScheduledFrom === props.data.ScheduledTo
                        ? ""
                        : moment(props.data.ScheduledTo).format("DD-MMM-YYYY")
                    }`} */}
                    {`${moment(props.data.UpComingScheduleDate).format(
                      "DD-MMM-YYYY"
                    )}`}
                    {props.data.slotName} / {props.data.City}
                  </li>
                  <li>{props.data.orderTitle}</li>
                  <li>
                    {"\u20B9" +
                      " " +
                      parseFloat(props.data.NetPayable).toFixed(2)}
                  </li>
                </ul>
                <hr />
                {`${props.data.add1} ${props.data.add2}  ${
                  props.data.geoLocationName !== null
                    ? props.data.geoLocationName
                    : ""
                } (${props.data.City} - ${props.data.Pin})`}
                <hr />
                {props.showViewDetail && (
                  <div className="card-body btn-showcase p-0 p-b-15">
                    <button
                      className="btn btn-square btn-outline-primary btn-sm m-5"
                      type="button"
                      onClick={props.onViewDetailClick}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;
