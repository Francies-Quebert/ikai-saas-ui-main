import {
  CloseCircleOutlined,
  CloseOutlined,
  FileDoneOutlined,
  PercentageOutlined,
  PlusOutlined,
  PrinterOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Divider, Button, Radio, InputNumber } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
const SalesSummaryComponent = (props) => {
  const [discountType, setDiscountType] = useState({
    Fvalue: null,
    Pvalue: null,
  });
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  // useEffect(() => {
  //   console.log(props);
  // }, [props]);
  return (
    <div
      className="card-sales"
      style={{
        flex: 1,
        padding: 0,
        margin: "0px 0px 5px 0px",
        fontSize: 14,
        height: "100%",
        // fontFamily: "Cairo",
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
        }}
      >
        <div style={{ width: "calc(100% - 160px)" }}>
          {/* <div style={{ height: "calc(100% - 34px)" }}> */}
          <div style={{ height: "calc(100% - 40px)" }}>
            {/* <Divider className="op-additional-info" style={{ margin: 0 }} /> */}
            <div
              className="sales-item-input-label sales-summary-label"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "2px 8px",
              }}
            >
              <div className="show-context">
                <div className="sales-summary-icon">{currency.value1}</div>
                Gross Total
              </div>
              <div className="sales-summary-value" style={{ fontWeight: 600 }}>
                {_.truncate(
                  `${currency.value1} ${
                    props.GrossAmount ? props.GrossAmount.toFixed(2) : 0
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
              // onClick={props.onDiscCLick}
              className="sales-item-input-label sales-summary-label " //show-pointer
            >
              <div
                style={{ margin: "auto 0px" }}
                //  className="show-pointer"
              >
                <div className="sales-summary-icon">
                  <PercentageOutlined />
                </div>
                Discount
              </div>
              <div
                style={{
                  fontWeight: 600,
                  display: "flex",
                  paddingRight: 0,
                  width: 230,
                }}
                className="sales-summary-value"
              >
                <div style={{ display: "flex", width: "40%" }}>
                  <div
                    style={{
                      backgroundColor: "var(--app-theme-color)",
                      padding: "0px 4px",
                      color: "#FFF",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    %
                  </div>
                  <InputNumber
                    className="bill-input hide-arrow"
                    placeholder="Percentage"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      // console.log(e);
                      props.onDiscountPercentageChange(e);
                      // setDiscountType({ ...discountType, Pvalue: e });
                    }}
                    // size="small"
                    value={props.Pvalue}
                    max={100}
                    min={0}
                    // precision={discountType.type === "P" ? 2 : undefined}
                    // precision={2}
                  />
                </div>
                <div style={{ display: "flex", width: "60%" }}>
                  <div
                    style={{
                      backgroundColor: "var(--app-theme-color)",
                      padding: "0px 5px",
                      color: "#FFF",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {currency.value1}
                  </div>
                  <InputNumber
                    className="bill-input hide-arrow"
                    placeholder="Fixed"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      props.onDiscountFixedChange(e);
                      // setDiscountType({ ...discountType, Fvalue: e });
                    }}
                    // size="small"
                    value={props.Fvalue}
                    // max={discountType.type === "P" ? 100 : undefined}
                    min={0}
                    // precision={discountType.type === "P" ? 2 : undefined}
                    // precision={2}
                  />
                </div>
                {/* {_.truncate(
                  `${currency.value1} ${
                    _.includes([null, "", undefined], props.DiscountAmount)
                      ? 0.0
                      : props.DiscountAmount.toFixed(2)
                  }`,
                  {
                    length: 15,
                  }
                )} */}
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
              <div className="show-context">
                <div className="sales-summary-icon">
                  <RiseOutlined />
                </div>
                Tax Amount{" "}
                <span
                  style={{ color: props.TaxType === "I" ? "green" : "red" }}
                >
                  ({props.TaxType === "I" ? "Inclusive" : "Exclusive"})
                </span>
              </div>
              <div
                style={{
                  fontWeight: 600,
                  // color: props.TaxType === "I" ? "green" : "red",
                }}
                className="sales-summary-value"
              >
                {_.truncate(
                  `${currency.value1} ${
                    props.TaxAmount ? props.TaxAmount.toFixed(2) : 0
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
              <div className="show-pointer">
                <div
                  className="sales-summary-icon"
                  // onClick={props.onAddIECLick}
                >
                  <PlusOutlined />
                </div>
                Add. Income / Exps.
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
                    _.includes(
                      [null, "", undefined, []],
                      props.AddIncomeAndExpenses
                    )
                      ? 0.0
                      : Math.abs(props.AddIncomeAndExpenses.toFixed(2))
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
              <div className="show-context">
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
                    props.RoundOff ? props.RoundOff.toFixed(2) : 0
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
                fontSize: 20,
                // lineHeight: "1",
              }}
            >
              <div style={{ color: "#FFF" }}>Net Payable</div>
              <div style={{ fontWeight: 700 }} className="sales-summary-value">
                {_.truncate(
                  `${currency.value1} ${
                    props.NetAmount ? props.NetAmount.toFixed(2) : 0
                  }`,
                  {
                    length: 15,
                  }
                )}
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: 160 }} className="sales-summary-card-right">
          <Button
            type="primary"
            style={{
              borderRadius: 0,
              width: "100%",
              borderColor: "#FFF",
              height: "50%",
              fontSize: 24,
            }}
            ref={props.saveRef}
            icon={<FileDoneOutlined style={{ fontWeight: 600 }} />}
            onClick={props.onSaveClick}
            disabled={props.disableSave}
          >
            Save
          </Button>
          {/* <Button
            icon={<PrinterOutlined style={{ fontWeight: 600 }} />}
            type="primary"
            style={{
              borderRadius: 0,
              width: "100%",
              borderColor: "#FFF",
              height: "50%",
              fontSize: 17,
            }}
            onClick={props.onSaveAndPrintClick}
            disabled={props.disableSave}
          >
            Save &amp; Print
          </Button> */}
          <Button
            icon={<CloseCircleOutlined style={{ fontWeight: 600 }} />}
            type="primary"
            style={{
              borderRadius: 0,
              width: "100%",
              borderColor: "#FFF",
              height: "50%",
              fontSize: 24,
            }}
            ref={props.backSummaryRef}
            onClick={props.onBackClick}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesSummaryComponent;
