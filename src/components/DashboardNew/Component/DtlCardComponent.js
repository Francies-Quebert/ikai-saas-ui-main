import React from "react";
import { MehOutlined } from "@ant-design/icons";
import { Typography, Divider } from "antd";

const { Title } = Typography;
const DtlCardComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <div style={{ textAlign: "center", padding: "10px 5px 0px" }}>
        <MehOutlined
          style={{ fontSize: 18,  }}
        className="color-style"/>
      </div>
      <Divider style={{ margin: "3px 0px 15px" }} />
      <div style={{ textAlign: "center", padding: "7px 5px 0px" }}>
        <Title level={3} style={{ marginBottom: 0 }}>
          1516
        </Title>
      </div>
      <div
        className="card-small-header"
        style={{
          textAlign: "center",
          padding: "5px 5px",
          fontWeight: 500,
          fontSize: 12,
        }}
      >
        <strong> No. of Users</strong>
      </div>
      <Divider style={{ margin: "15px 0px 0px" }} />
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 0.5,
            textAlign: "center",
            borderRight: "1px solid #f0f0f0",
            fontSize: 10,
            padding: "10px 0px",
          }}
        >
          <strong style={{ color: "#28a745" }}>1000</strong>
          <strong style={{ fontFamily: "Noto Color Emoji" }}>
            &nbsp;&nbsp;Active
          </strong>
        </div>
        <div
          style={{
            flex: 0.5,
            textAlign: "center",
            fontSize: 10,
            padding: "10px 0px",
          }}
        >
          <strong style={{ color: "#dc3545" }}>516</strong>
          <strong style={{ fontFamily: "Noto Color Emoji" }}>
            &nbsp;&nbsp;In Active
          </strong>
        </div>
      </div>
    </div>
  );
};

export default DtlCardComponent;
