import React from "react";
import { Card, Typography } from "antd";

const { Meta } = Card;
const { Text } = Typography;

function MenuOption(props) {
  return (
    <div
      {...props}
      style={{
        textAlign: "center",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        // borderWidth: 2,
        // borderColor: "#828282",
        // borderStyle: "solid",
        height: 60,
        width: 60,
      }}
      ref={props.ref}
      onClick={props.onClick}
    >
      <img src={props.image} height="32" width="32" />
      {/* {props.title} */}
    </div>
  );
}

export default MenuOption;
