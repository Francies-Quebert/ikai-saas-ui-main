import React from "react";

const BankAndCashBookLegends = (props) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginRight: 7 }}>
      <div
        style={{
          height: 10,
          width: 10,
          backgroundColor: props.color ? props.color : "red",
          marginRight: 5,
          borderRadius: 2,
        }}
      ></div>
      <div>{props.name}</div>
    </div>
  );
};

export default BankAndCashBookLegends;
