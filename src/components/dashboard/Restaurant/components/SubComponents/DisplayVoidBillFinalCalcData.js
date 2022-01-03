import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const DisplayVoidBillFinalCalcData = (props) => {
  const appconfigs = useSelector((state) => state.AppMain.appconfigs);

  // useEffect(() => {
  //   // console.log(props.data,"final bill data");
  // }, [props.data]);

  // console.log(props.data,"final bill data");
  return (
    <div className="final-bill">
      <div className="void-bill-calc-title">{props.title}</div>
      <div className="void-bill-calc-row">
        <div className="void-bill-row-title">Sub Total</div>
        <div className="void-bill-row-desc">
          {appconfigs.find((ac) => ac.configCode === "CURRENCY").value1}{" "}
          {props.data ? props.data.SubTotal.toFixed(2) : 0}
        </div>
      </div>

      <div className="void-bill-calc-row">
        <div className="void-bill-row-title">Quantity</div>
        <div className="void-bill-row-desc">
          {props.data ? props.data.Qty : 0}
        </div>
      </div>

      <div className="void-bill-calc-row">
        <div className="void-bill-row-title">Discount</div>
        <div className="void-bill-row-desc">
          {appconfigs.find((ac) => ac.configCode === "CURRENCY").value1}{" "}
          {props.data ? props.data.Disc.toFixed(2) : 0}
        </div>
      </div>
      <div className="void-bill-calc-row">
        <div className="void-bill-row-title">Tax Amount</div>
        <div className="void-bill-row-desc">
          {appconfigs.find((ac) => ac.configCode === "CURRENCY").value1}{" "}
          {props.data ? props.data.TaxAmount.toFixed(2) : 0}
        </div>
      </div>
      <div className="void-bill-calc-row">
        <div className="void-bill-row-title">Round Off.</div>
        <div className="void-bill-row-desc">
          {appconfigs.find((ac) => ac.configCode === "CURRENCY").value1}{" "}
          {props.data ? props.data.RoundOff : 0}
        </div>
      </div>
      <div className="void-bill-calc-row">
        <div className="void-bill-row-title">Final Invoice Amount</div>
        <div
          className="void-bill-row-desc"
          style={{ fontWeight: "600", fontSize: 20 }}
        >
          {appconfigs.find((ac) => ac.configCode === "CURRENCY").value1}{" "}
          {props.data ? props.data.NetPayable.toFixed(2) : 0}
        </div>
      </div>
    </div>
  );
};

export default DisplayVoidBillFinalCalcData;
