import { Checkbox, InputNumber } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const AmountInputComponent = (props) => {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  return (
    <div
      style={{
        // display: "inline-block",
        // padding: "3px 0px",
        //border: `1px solid ${process.env.REACT_APP_PRIMARY_COLOR}`,
        // backgroundColor: process.env.REACT_APP_PRIMARY_  COLOR,
        display: "flex",
        borderRadius: 3,
        margin: "0px 2px 5px 0px",
      }}
      className="btn-custom-style border-style"
    >
      <div
        style={{
          width: 25,

          textAlign: "center",
          // margin: "2px 0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="bg-color-style"
      >
        <Checkbox
          //   defaultChecked={checked}
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
            props.onCheckChange(e, props);
          }}
        />
      </div>
      <div
        style={{
          padding: "0px 5px",
          backgroundColor: "#FFF",
          display: "flex",
          alignItems: "center",
          color: "#000",
          minWidth: 75,
          fontWeight: 600,
          fontSize: 11,
        }}
      >
        {props.title}
      </div>
      <div
        style={{
          textAlign: "center",
          margin: "0px 0px",
          marginLeft: 1,
          background: "#F1f1f1",
        }}
      >
        <div
          style={{
            textAlign: "center",
            paddingLeft: 1,
            display: "flex",
          }}
        >
          <div
            style={{
              color: "rgb(0,0,0,0.6)",
              padding: " 0px 6px",
              display: "inline-block",
              margin: "auto",
            }}
          >
            {currency.value1}
          </div>
          <InputNumber
            placeholder="Amount"
            defaultValue={value}
            min={0}
            style={{ width: "calc(100% - 19px)" }}
            onChange={(value) => {
              setValue(value);
              if (value !== null) {
                props.onValueChange(value, props, true);
                setChecked(true);
              } else {
                props.onValueChange(value, props, false);
                setChecked(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AmountInputComponent;
