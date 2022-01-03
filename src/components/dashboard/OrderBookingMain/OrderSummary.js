import React, { Fragment, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import moment from "moment";
import { Descriptions } from "antd";
const OrderViewDetail = (props) => {
  return (
    <div
      style={{
        padding: " 42px 24px 50px",
        color: "rgba(0,0,0,.85)",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* <div className="col-sm-12 p-10">
        <div className="blog-box blog-list row">
          <div className="col-sm-11">
            <div className="blog-details">
              <div className="blog-date digits">
                <span>{props.orderTitle}</span> &nbsp;&nbsp;
                {props.orderSubTitle} &nbsp;{" "}
                {props.orderPackDesc ? `/  ${props.orderPackDesc}` : null}{" "}
                &nbsp;
              </div>
              <h6>
                {props.userName} (+91 {props.mobile})
              </h6>
              <div>
                <ul className="blog-social">
                  {/* <h6>{props.PaymentStatus}</h6> */}
      {/* <li>
                    Scheduled For:{" "}
                    {`${moment(props.ScheduledFrom).format("DD-MMM-YYYY")} ${
                      props.ScheduledFrom === props.ScheduledTo
                        ? ""
                        : moment(props.ScheduledTo).format("DD-MMM-YYYY")
                    }`}
                    {props.slotName} /{props.slot} /{props.City}
                  </li>
                  <li>{props.orderSubTitle}</li>
                  <li>
                    {"\u20B9" + " " + parseFloat(props.NetPayable).toFixed(2)}
                  </li>
                </ul>
                <hr />
                {`${props.add1} ${props.add2}  ${props.geoLocationName} (${props.City} - ${props.Pin})`}
                <hr />
                <div className="card-body btn-showcase p-0 p-b-15"></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <Descriptions title={props.orderTitle} bordered size="small">
        <Descriptions.Item label="Service type & Package">
          {props.orderSubTitle}{" "}
          {props.orderPackDesc ? `( ${props.orderPackDesc})` : null}
        </Descriptions.Item>
        <Descriptions.Item label="Customer">
          {props.userName} (+91 {props.mobile})
        </Descriptions.Item>
        <Descriptions.Item label="Scheduled">
          {`${
            props.ScheduledFrom === props.ScheduledTo
              ? `${moment(props.ScheduledFrom).format("DD-MMM-YYYY")}`
              : `${props.ScheduledFrom} to ${props.ScheduledTo}`
          } `}
        </Descriptions.Item>
        <Descriptions.Item label="Location">
          {props.City} / {props.slot}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {`${props.add1} ${props.add2}  ${
            props.geoLocationName ? `${props.geoLocationName}` : ``
          } (${props.City} - ${props.Pin})`}
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          {"\u20B9" + " " + parseFloat(props.NetPayable).toFixed(2)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default OrderViewDetail;
