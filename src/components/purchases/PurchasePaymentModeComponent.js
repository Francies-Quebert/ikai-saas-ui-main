import React, { useState, useEffect } from "react";
import { Col } from "antd";
import { fetchPaymodeMaster } from "../../services/payModeMaster";
import AmountInputComponent from "./AmountInputComponent";
import { useSelector } from "react-redux";
import _ from "lodash";
const PurchasePaymentModeComponent = (props) => {
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  return (
    <div
      className="card-sales"
      style={{
        height: "100%",

        padding: 0,
        margin: "0px 3px 5px 0px",
      }}
    >
      <div
        className="card-sales-inner"
        style={{
          padding: "2px 8px 0px",
          fontSize: 15,
          fontWeight: 600,
          height: 25,
        }}
      >
        Payment Mode
      </div>
      <div
        style={{ height: "calc(100% - 55px)" }}
        className="border-bottom-style-color"
      >
        <div
          style={{
            display: "flex",
            //   height: "calc(100% - 25px)",
            flexFlow: "row wrap",
            padding: 5,
          }}
        >
          {props.paymentMode
            .sort((a, b) => (a.key > b.key ? 1 : -1))
            .map((pp) => {
              // console.log(pp, "pp");
              return (
                <Col key={pp.PayCode} span={8} style={{}}>
                  <AmountInputComponent
                    title={pp.PayDesc}
                    data={pp}
                    onCheckChange={props.onCheckChange}
                    onValueChange={props.onValueChange}
                  />
                </Col>
              );
            })}
        </div>
      </div>
      <div
        className="sales-item-input-label"
        style={{
          fontSize: 15,
          display: "flex",
          justifyContent: "space-between",
          padding: "2px 8px",
        }}
      >
        <div className="color-style">
          {/* <div className="sales-summary-icon">{currency.value1}</div> */}
          Total Paid
        </div>
        <div
          className="sales-summary-value border-color-style"
          style={{ fontWeight: 600, height: 25 }}
        >
          {_.truncate(`${currency.value1} ${props.totalPaid}`, { length: 15 })}
        </div>
      </div>
    </div>
  );
};

export default PurchasePaymentModeComponent;
