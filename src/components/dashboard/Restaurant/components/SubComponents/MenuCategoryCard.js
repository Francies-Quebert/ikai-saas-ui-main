import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const MenuCategoryCard = (props) => {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderWidth: 1,
        borderColor: "black",
        borderStyle: "solid",
        width: "100%",
      }}
    >
      <Title level={4}>{props.Title}</Title>

      {/* <div
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: "black",
          borderStyle: "solid",
          // padding: 5,
          alignContent: "center",
          justifyContent: "center",
        
          width: "100%",
          margin: 2,
        }}
      >
        
      </div> */}
    </div>
  );
};

export default MenuCategoryCard;
