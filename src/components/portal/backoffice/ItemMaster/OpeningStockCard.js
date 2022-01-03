import { DeleteOutlined } from "@ant-design/icons";
import { InputNumber, Form, Col, Row, Button } from "antd";
import React, { useEffect } from "react";

const OpeningStockCard = (props) => {
  // console.log(props.INVTYPE, "edit right");
  return (
    <Col
      key={props.datasource.key}
      xs={18}
      sm={12}
      md={6}
      lg={6}
      xl={4}
      style={{
        // minWidth: "15%",
        border: "1px solid #d9d9d9",
        marginRight: 12,
        backgroundColor: "#f5f5f5",
      }}
      className="shadow-custom"
    >
      <div className="os-card-header">
        {props.datasource.InwardSeq
          ? `Inward Seq No #${props.datasource.InwardSeq}`
          : "New Opening Stock"}
      </div>
      <div
        style={{
          display: "flex",
          padding: "0px 0px 0px 10px",
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
                defaultValue={props.datasource.Qty}
                placeholder="Quantity"
                // disabled={iCodeDisable}
                style={{ width: "100%" }}
                // onKeyDown={handleKeyDown}
                onChange={(val) => {
                  props.onQtyChange(val);
                }}
                disabled={props.editRights}
              />
              {/* <div style={{ width: "20%" }}>
            <Button
              size="small"
              type="primary"
              icon={<DeleteOutlined />}
            ></Button>
          </div> */}
            </Col>
          </Row>
          {props.INVTYPE.value1 === "Y" && (
            <>
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
                    defaultValue={props.datasource.MRP}
                    placeholder="MRP"
                    // disabled={iCodeDisable}
                    style={{ width: "100%" }}
                    // onKeyDown={handleKeyDown}
                    onChange={(val) => {
                      props.onMrpChange(val);
                    }}
                    disabled={props.editRights}
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
                    defaultValue={props.datasource.Sale}
                    placeholder="Sale Price"
                    // disabled={iCodeDisable}
                    style={{ width: "100%" }}
                    // onKeyDown={handleKeyDown}
                    onChange={(val) => {
                      props.onSaleChange(val);
                    }}
                    disabled={props.editRights}
                  />
                </Col>
              </Row>
            </>
          )}

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
                defaultValue={props.datasource.Cost}
                placeholder="Cost Price"
                // disabled={iCodeDisable}
                style={{ width: "100%" }}
                // onKeyDown={handleKeyDown}
                onChange={(val) => {
                  props.onCostChange(val);
                }}
                disabled={props.editRights}
              />
            </Col>
          </Row>
        </div>
        {props.showDeleteButton &&
          props.showDeleteButton === true &&
          props.INVTYPE.value1 === "Y" && (
            <div
              onClick={() => {
                if (!props.deleteRights) {
                  props.onDeleteCLick();
                }
              }}
              style={{ width: "30px" }}
              className={`os-delete`}
            >
              <DeleteOutlined
                style={{}}
                className={`delete-icon-custom ${
                  props.deleteRights ? "disabled" : ""
                }`}
              />
            </div>
          )}
      </div>
    </Col>
  );
};

export default OpeningStockCard;
