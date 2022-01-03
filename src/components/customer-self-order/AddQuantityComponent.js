import React, { useEffect, useState } from "react";

const AddQuantityComponent = (props) => {
  const [quantity, setQuantity] = useState(0);
  return (
    <div
      style={{
        border: "1px solid #000009",
        padding: "0px 0px",
        display: "flex",
        height: 30,
        backgroundColor: "#FFF",
        position: "relative",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      {props.addOn &&
        props.addOn.length <= 0 &&
        props.vars &&
        props.vars.length <= 0 &&
        props.data.Qty > 0 && (
          <div
            className="add-button plus"
            style={{
              borderRight: "1px solid #000009",
              padding: "3px 7px",
              cursor: "pointer",
              userSelect: "none",
              top: 0,
              left: 0,
              position: "absolute",
            }}
            onClick={(vars, addOns) => {
              if (props.data.Qty > 0) {
                if (
                  props.addOn &&
                  props.addOn.length <= 0 &&
                  props.vars &&
                  props.vars.length <= 0
                ) {
                  props.onClickMinus(quantity - 1);
                }
              } else {
                props.onClickPlus(quantity + 1);
              }
            }}
          >
            -
          </div>
        )}

      <div
        className="add-button minus"
        style={{
          padding: "3px 6px",
          textAlign: "center",
          width:
            // props.addOn &&
            // props.addOn.length <= 0 &&
            // props.vars &&
            // props.vars.length <= 0 &&
            // props.data.Qty > 0
            //   ? 39
            //   :
            82.19,
          transition: "all 0.8s",
        }}
        onClick={(vars, addOns) => {
          props.onClickPlus(quantity + 1);
        }}
      >
        {props.data.Qty > 0 ? props.data.Qty : "Add"}
      </div>
      {props.addOn &&
        props.addOn.length <= 0 &&
        props.vars &&
        props.vars.length <= 0 &&
        props.data.Qty > 0 && (
          <div
            className="add-button minus"
            style={{
              borderLeft: "1px solid #000009",
              padding: "3px 5px",
              cursor: "pointer",
              userSelect: "none",
              top: 0,
              right: 0,
              position: "absolute",
            }}
            onClick={(vars, addOns) => {
              // if (quantity > 0) {
              // setQuantity(quantity - 1);
              props.onClickPlus(quantity + 1);

              // }
            }}
          >
            +
          </div>
        )}
    </div>
  );
};

export default AddQuantityComponent;
