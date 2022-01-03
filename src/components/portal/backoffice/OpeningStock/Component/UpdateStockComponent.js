import React, { useEffect, useState } from "react";
import { InputNumber, Form, Col, Row, Button, Divider, message } from "antd";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";

const UpdateStockComponent = (props) => {
  const [updtData, setUpdtData] = useState(props.data ? props.data : null);

  useEffect(() => {
  }, []);

  return (
    <div>
      {props.data ? (
        <>
          <Col
            key={props.data.ItemCode}
            style={{
              border: "1px solid #d9d9d9",
              padding: "0px 0px 0px 10px",
              display: "flex",
            }}
          >
            <div style={{ flex: 1, padding: "5px 0px", marginRight: 5 }}>
              <Row className="custom-form-item">
                <Col span={9} className="custom-form-label">
                  <label
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      height: 32,
                      lineHeight: 1.5715,
                    }}
                  >
                    Quantity:
                  </label>
                </Col>
                <Col span={15} style={{ lineHeight: 1.5715, paddingLeft: 8 }}>
                  <InputNumber
                    className="bill-input"
                    defaultValue={props.data.Qty}
                    placeholder="Quantity"
                    style={{ width: "100%" }}
                    onChange={(val) => {
                      setUpdtData({ ...updtData, Qty: val, isDirty: true });
                    }}
                  />
                </Col>
              </Row>
              <Row className="custom-form-item">
                <Col span={9} className="custom-form-label">
                  <label
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      height: 32,
                      lineHeight: 1.5715,
                    }}
                  >
                    MRP:
                  </label>
                </Col>
                <Col span={15} style={{ lineHeight: 1.5715, paddingLeft: 8 }}>
                  <InputNumber
                    className="bill-input"
                    defaultValue={props.data.MRP}
                    placeholder="MRP"
                    style={{ width: "100%" }}
                    onChange={(val) => {
                      setUpdtData({ ...updtData, MRP: val, isDirty: true });
                    }}
                  />
                </Col>
              </Row>
              <Row className="custom-form-item">
                <Col span={9} className="custom-form-label">
                  <label
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      height: 32,
                      lineHeight: 1.5715,
                    }}
                  >
                    Sale Price:
                  </label>
                </Col>
                <Col span={15} style={{ lineHeight: 1.5715, paddingLeft: 8 }}>
                  <InputNumber
                    className="bill-input"
                    defaultValue={props.data.SaleRate}
                    placeholder="Sale Price"
                    style={{ width: "100%" }}
                    onChange={(val) => {
                      setUpdtData({
                        ...updtData,
                        SaleRate: val,
                        isDirty: true,
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row className="custom-form-item">
                <Col span={9} className="custom-form-label">
                  <label
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      height: 32,
                      lineHeight: 1.5715,
                    }}
                  >
                    Cost Price:
                  </label>
                </Col>
                <Col span={15} style={{ lineHeight: 1.5715, paddingLeft: 8 }}>
                  <InputNumber
                    className="bill-input"
                    defaultValue={props.data.Rate}
                    placeholder="Cost Price"
                    style={{ width: "100%" }}
                    onChange={(val) => {
                      setUpdtData({ ...updtData, Rate: val, isDirty: true });
                    }}
                  />
                </Col>
              </Row>
              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
              <Row className="custom-form-item">
                <Col className="custom-form-label">
                  <Button
                    icon={<SaveOutlined />}
                    type="primary"
                    onClick={() => {
                      if (
                        updtData.MRP === null ||
                        updtData.Rate === null ||
                        updtData.SaleRate === null ||
                        updtData.Qty === null
                      ) {
                        message.error("Field Cannot Be Empty");
                      } else if (
                        updtData.MRP < 0 ||
                        updtData.Rate < 0 ||
                        updtData.SaleRate < 0 ||
                        updtData.Qty < 0
                      ) {
                        message.error("Values Cannot Be Less Than Zero");
                      } else {
                        props.onSaveClick(updtData);
                        props.onBackPress();
                      }
                    }}
                  >
                    Save
                  </Button>
                </Col>
                <Col style={{ lineHeight: 1.5715, paddingLeft: 8 }}>
                  <Button
                    icon={<RollbackOutlined />}
                    type="primary"
                    onClick={() => {
                      props.onBackPress();
                    }}
                  >
                    Back
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </>
      ) : null}
    </div>
  );
};

export default UpdateStockComponent;
