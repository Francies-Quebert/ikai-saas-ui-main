import React, { useState, useEffect } from "react";
import { Input, Row, Col, message } from "antd";

const Quantity = (props) => {
  const [from, setFrom] = useState(props.data.FromQty);
  const [to, setTo] = useState(props.data.ToQty);

  useEffect(() => {
    props.OnSaveClick(from, to);
  }, [from, to]);

  useEffect(() => {
    setFrom(props.data.FromQty);
    setTo(props.data.ToQty);
  }, [props.valuereset]);

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
          style={{ padding: "5px 7px", borderRight: "1px solid #d9d9d9" }}
        >
          <Input
            type="number"
            step="0.01"
            placeholder="From Quantity"
            value={from}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setFrom(e.target.value);
              } else {
                message.error("Quantity cannot be less than 0");
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
          style={{ padding: "5px 7px" }}
        >
          <Input
            type="number"
            step="0.01"
            placeholder="To Quantity"
            value={to}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setTo(e.target.value);
              } else {
                message.error("Quantity cannot be less than 0");
              }

              // console.log(e.target.value);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Quantity;
