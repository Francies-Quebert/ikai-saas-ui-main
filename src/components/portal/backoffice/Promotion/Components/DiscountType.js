import React, { useState, useEffect } from "react";
import { Switch, Input, Row, Col, Radio, Checkbox, message } from "antd";

const DiscountType = (props) => {
  const [discType, setDiscType] = useState(props.data.DiscountType);
  const [discQty, setDiscQty] = useState(props.data.DiscountValue);

  useEffect(() => {
    props.OnSaveClick(discType, discQty);
  }, [discType, discQty]);

  useEffect(() => {
    setDiscType(props.data.DiscountType);
    setDiscQty(props.data.DiscountValue);
  }, [props.valuereset]);

  return (
    <div style={{ border: "1px solid #d9d9d9", flex: "1" }}>
      <div
        // style={{
        //   padding: "5px 13px",
        //   fontWeight: "600",
        //   borderBottom: "1px solid #d9d9d9",
        // }}
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
          <Switch
            unCheckedChildren="%"
            checkedChildren="&#8377;"
            checked={discType === "V" ? true : false}
            onChange={(e) => setDiscType(e === true ? "V" : "P")}
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
            step="0.00"
            placeholder="Enter discount value"
            value={discQty}
            max={discType === "P" ? 100 : ""}
            onChange={(e) => {
              if (discType === "P") {
                if (e.target.value >= 0 && e.target.value <= 100) {
                  setDiscQty(e.target.value);
                } else {
                  message.error(
                    "Discount value must be less than 0 or greater than 100 "
                  );
                }
              } else if (discType === "V") {
                if (e.target.value >= 0) {
                  setDiscQty(e.target.value);
                } else {
                  message.error("Discount value cannot be less than 0");
                }
              }
              // if (discType === "P") {
              //   // console.log(object)
              // } else {
              //   setDiscQty(e.target.value);
              // }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DiscountType;
