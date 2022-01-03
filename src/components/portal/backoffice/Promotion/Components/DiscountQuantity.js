import React, { useState, useEffect } from "react";
import { Input, Row, Col, message } from "antd";

const DiscountQuantity = (props) => {
  const [discQty, setDiscQty] = useState(props.data.DiscQty);
  const [maxDisc, setMaxDisc] = useState(props.data.MaxDiscount);

  useEffect(() => {
    props.OnSaveClick(discQty, maxDisc);
  }, [discQty, maxDisc]);

  useEffect(() => {
    setDiscQty(props.data.DiscQty);
    setMaxDisc(props.data.MaxDiscount);
  }, [props.valuereset]);

  return (
    <div style={{ border: "1px solid #d9d9d9", flex: "1" }}>
      <Row
        style={{
          padding: "5px 13px",
          fontWeight: "600",
          borderBottom: "1px solid #d9d9d9",
        }}
        className="header-title-promo"
      >
        <Col>{props.Title}</Col>
      </Row>
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
            placeholder="Quantity"
            type="number"
            step="0.01"
            value={discQty}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setDiscQty(e.target.value);
              } else {
                message.error("Discount Quantity cannot be less than 0");
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
            placeholder="Max Discount"
            type="number"
            step="0.01"
            value={maxDisc}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setMaxDisc(e.target.value);
              } else {
                message.error("Max Discount value cannot be less than 0");
              }
              // console.log(e.target.value);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DiscountQuantity;
