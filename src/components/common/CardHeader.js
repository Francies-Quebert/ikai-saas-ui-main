import React from "react";
import { Typography } from "antd";

const CardHeader = (props) => {
  const { Title } = Typography;

  return (
    <div
      style={{
        padding: "8px 10px",
        fontSize: 15,
        background: "#FFFFFF",
        border: "1px solid #f0f0f0",
      }}
    >
      <Title level={4} style={{margin:0,fontSize: 16,}}>{props.title}</Title>
    </div>
  );
};

export default CardHeader;
