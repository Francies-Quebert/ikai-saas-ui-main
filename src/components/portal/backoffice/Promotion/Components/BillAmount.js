import React, { useState } from "react";
import { Switch, Input, Row, Col, message } from "antd";
import { useEffect } from "react";

const BillAmount = (props) => {
  const [from, setFrom] = useState(parseFloat(props.data.FromAmount));
  const [to, setTo] = useState(parseFloat(props.data.ToAmount));

  useEffect(() => {
    props.OnSaveClick(from, to);
  }, [from, to]);

  useEffect(() => {
    setFrom(parseFloat(props.data.FromAmount));
    setTo(parseFloat(props.data.ToAmount));
  }, [props.valuereset]);

  // console.log(from, to, props.data.FromAmount, props.data.ToAmount, "je");
  return (
    <div style={{ border: "1px solid #d9d9d9", flex: "1" }}>
      <div
        style={{
          padding: "5px 13px",
          fontWeight: "600",
          borderBottom: "1px solid #d9d9d9",
        }}
        className="header-title-promo"
      >
        {props.Title}
      </div>
      <Row style={{ display: "flex" }}>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          md={24}
          sm={24}
          xs={24}
          style={{
            padding: "5px 7px",
            borderRight: "1px solid #d9d9d9",
            display: "flex",
          }}
        >
          <Input
            type="number"
            step="0.01"
            placeholder="From Amount"
            value={from}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setFrom(e.target.value);
              } else {
                message.error("Amount value cannot be less than 0");
              }
              // console.log(e.target.value);
            }}
          />
        </Col>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          md={24}
          sm={24}
          xs={24}
          style={{ padding: "5px 7px", display: "flex" }}
        >
          <Input
            type="number"
            step="0.01"
            placeholder="To Amount"
            value={to}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setTo(e.target.value);
              } else {
                message.error("Amount value cannot be less than 0");
              }
              // console.log(e.target.value);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BillAmount;
