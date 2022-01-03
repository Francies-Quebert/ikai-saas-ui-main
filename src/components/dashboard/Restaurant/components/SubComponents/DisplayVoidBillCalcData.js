import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const DisplayVoidBillCalcData = (props) => {
  const appconfigs = useSelector((state) => state.AppMain.appconfigs);

  useEffect(() => {
    // console.log(props.data);
  }, [props.data]);

  return (
    <div className="return-bill">
      <div className="void-bill-calc-title return">{props.title}</div>
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
      <div className="void-bill-calc-row" style={{ borderBottom: 0 }}>
        <div className="void-bill-row-title">Total Return</div>
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

export default DisplayVoidBillCalcData;
