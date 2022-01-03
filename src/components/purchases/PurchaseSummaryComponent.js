import {
  CloseCircleOutlined,
  CloseOutlined,
  FileDoneOutlined,
  PercentageOutlined,
  PlusOutlined,
  PrinterOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Divider, Button } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
const PurchaseSummaryComponent = (props) => {
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );

  return (
    <div
      className="card-sales"
      style={{
        flex: 1,
        padding: 0,
        margin: "0px 0px 5px 0px",
        fontSize: 14,
        height: "100%",
        // maxHeight: 300,
        // minHeight: 300,
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
        Summary
      </div>
      <div
        style={{
          display: "flex",
          height: "calc(100% - 25px)",
          //   height: "100%",
        }}
      >
        <div style={{ width: "calc(100%)" }}>
          <div
            style={{ height: "calc(100% - 34px)", overflowY: "auto" }}
            className="style-2"
          >
            {/* <Divider className="op-additional-info" style={{ margin: 0 }} /> */}
            <div
              className="sales-item-input-label sales-summary-label"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 8px",
              }}
            >
              <div>
                <div className="sales-summary-icon">{currency.value1}</div>
                Gross Total
              </div>
              <div className="sales-summary-value" style={{ fontWeight: 600 }}>
                {_.truncate(
                  `${currency.value1} ${
                    props.GrossAmount
                      ? parseFloat(props.GrossAmount).toFixed(2)
                      : 0
                  }`,
                  {
                    length: 15,
                  }
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 8px",
              }}
              className="sales-item-input-label sales-summary-label"
            >
              <div>
                <div className="sales-summary-icon">
                  <PercentageOutlined />
                </div>
                Discount
              </div>
              <div style={{ fontWeight: 600 }} className="sales-summary-value">
                {_.truncate(
                  `${currency.value1} ${
                    props.DiscountAmount
                      ? parseFloat(props.DiscountAmount).toFixed(2)
                      : 0
                  }`,
                  {
                    length: 15,
                  }
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 8px",
              }}
              className="sales-item-input-label sales-summary-label"
            >
              <div>
                <div className="sales-summary-icon">
                  <RiseOutlined />
                </div>
                Tax Amount
              </div>
              <div style={{ fontWeight: 600 }} className="sales-summary-value">
                {_.truncate(
                  `${currency.value1} ${
                    props.TaxAmount ? parseFloat(props.TaxAmount).toFixed(2) : 0
                  }`,
                  {
                    length: 15,
                  }
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 8px",
              }}
              onClick={props.onAddIECLick}
              className="sales-item-input-label sales-summary-label show-pointer"
            >
              <div>
                <div className="sales-summary-icon">
                  <PlusOutlined />
                </div>
                Additional Incomes /Expenses
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: props.AddIncomeAndExpenses >= 0 ? "green" : "red",
                }}
                className="sales-summary-value"
              >
                {_.truncate(
                  `${currency.value1} ${
                    props.AddIncomeAndExpenses
                      ? Math.abs(
                          parseFloat(props.AddIncomeAndExpenses).toFixed(2)
                        )
                      : 0
                  }`,
                  { length: 15 }
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 8px",
              }}
              className="sales-item-input-label sales-summary-label"
            >
              <div>
                <div className="sales-summary-icon">
                  <span className="sales-summary-round-off">
                    {currency.value1}
                  </span>
                </div>
                Round off
              </div>
              <div style={{ fontWeight: 600 }} className="sales-summary-value">
                {_.truncate(
                  `${currency.value1} ${
                    props.RoundOff ? parseFloat(props.RoundOff).toFixed(2) : 0
                  }`,
                  {
                    length: 15,
                  }
                )}
              </div>
            </div>
            {/* <div
                className="sales-summary-net-pay"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "2px 8px",
                  fontWeight: 600,
                  // fontSize: 15,
                  
                  // lineHeight: "1",
                }}
              >
                <div style={{color: "#FFF",}}>Net Payable</div>
                <div style={{ fontWeight: 600 }} className="sales-summary-value">
                  {currency.value1} 820
                </div>
              </div> */}
          </div>
          <div style={{ height: 34 }}>
            <Divider className="op-additional-info" style={{ margin: 0 }} />
            <div
              className="sales-summary-net-pay"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 8px",
                fontWeight: 600,
                fontSize: 15,
                // lineHeight: "1",
              }}
            >
              <div style={{ color: "#FFF" }}>Net Payable</div>
              <div style={{ fontWeight: 600 }} className="sales-summary-value">
                {_.truncate(
                  `${currency.value1} ${
                    props.NetAmount ? parseFloat(props.NetAmount).toFixed(2) : 0
                  }`,
                  {
                    length: 15,
                  }
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div style={{ width: 160 }} className="sales-summary-card-right">
          <Button
            type="primary"
            style={{
              borderRadius: 0,
              width: "100%",
              borderColor: "#FFF",
              height: "25%",
              fontSize: 17,
            }}
            icon={<FileDoneOutlined style={{ fontWeight: 600 }} />}
          >
            Save
          </Button>
          <Button
            icon={<PrinterOutlined style={{ fontWeight: 600 }} />}
            type="primary"
            style={{
              borderRadius: 0,
              width: "100%",
              borderColor: "#FFF",
              height: "50%",
              fontSize: 17,
            }}
          >
            Save &amp; Print
          </Button>
          <Button
            icon={<CloseCircleOutlined style={{ fontWeight: 600 }} />}
            type="primary"
            style={{
              borderRadius: 0,
              width: "100%",
              borderColor: "#FFF",
              height: "25%",
              fontSize: 17,
            }}
          >
            Back
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default PurchaseSummaryComponent;
