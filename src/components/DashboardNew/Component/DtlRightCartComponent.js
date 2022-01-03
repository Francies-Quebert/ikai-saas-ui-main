import React from "react";
import { Typography, Divider } from "antd";

const { Title } = Typography;

const DtlRightCartComponent = () => {
  return (
    <div style={{ display: "flex", flex: 1 }}>
      <div
        style={{
          margin: "10px 10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div>
          <Title
            level={4}
            style={{
              marginBottom: 0,
              
            }}
           className="color-style">
            Sample Text
          </Title>
        </div>
        <div style={{  }}>
          <p style={{ fontSize: 12 }}>
            Sample text description,this text is a sample text it can be
            changed. Sample text description,this text is a sample text it can
            be changed. Sample text description,this text is a sample text it
            can be changed.
          </p>
        </div>
      </div>
      <div className="image-test"></div>
    </div>
  );
};

export default DtlRightCartComponent;
