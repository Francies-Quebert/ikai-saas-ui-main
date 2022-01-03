import React, { useEffect, useState } from "react";
import { Button, Col, Input, notification, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { PlusCircleOutlined, RetweetOutlined } from "@ant-design/icons";

const PaymentMasterDtlCard = (props) => {
  const Option = Select;
  const paymentmode = useSelector((state) => state.paymodeMaster.paymodeMaster);
  const [data, setData] = useState({
    id: 0,
    mode: null,
    amount: 0.0,
    remark: null,
  });

  useEffect(() => {
    if (props.data) {
      setData({
        // id: props.data.Id,
        mode: props.data.PaymentMode,
        amount: props.data.Amount,
        remark: props.data.Remark,
      });
    }
  }, [props.data]);

  return (
    <>
      <Row style={{ flex: 1 }} className="card-payments">
        <Col span={6} style={{}} className="sales-item-input-outer">
          <Row className="sales-item-input-inner">
            <Col
              span={24}
              className="sales-item-input-label"
              style={{ alignSelf: "center", paddingRight: 8 }}
            >
              <span style={{ color: "red" }}>* </span> Payment Mode
            </Col>
            <Col span={24} style={{ display: "flex" }}>
              <Select
                onChange={(value) => {
                  setData({ ...data, mode: value });
                }}
                allowClear
                value={data.mode}
                showSearch
                optionFilterProp="children"
                placeholder="Payment Mode"
                style={{
                  width: "calc(100% - 24px)",
                  flex: 1,
                  alignSelf: "center",
                }}
                size="small"
              >
                {paymentmode.length > 0 &&
                  paymentmode
                    .filter((i) => i.IsActive)
                    .map((item) => {
                      return (
                        <Select.Option
                          style={{ marginBottom: 5, marginRight: 5 }}
                          value={item.PayCode}
                          key={item.PayCode}
                        >
                          {item.PayDesc}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Col>
          </Row>
        </Col>

        <Col
          span={6}
          style={{
            paddingRight: 5,
          }}
          className="sales-item-input-outer"
        >
          <Row className="sales-item-input-inner">
            <div
              className="sales-item-input-label"
              style={{
                paddingRight: 5,
                textAlign: "end",
                width: "100%",
              }}
            >
              <span style={{ color: "red" }}>* </span>Amount
            </div>
            <Input
              type="number"
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  // ItemAddRef.current.focus();
                }
              }}
              step={0.1}
              className="bill-input"
              placeholder="Amount"
              style={{ width: "100%", textAlign: "end" }}
              size="small"
              onChange={(e) => {
                setData({ ...data, amount: e.target.value });
              }}
              value={data.amount}
            />
          </Row>
        </Col>
        <Col
          span={6}
          style={{
            paddingRight: 5,
          }}
          className="sales-item-input-outer"
        >
          <Row className="sales-item-input-inner">
            <div
              className="sales-item-input-label"
              style={{
                paddingRight: 5,
                // textAlign: "center",
                width: "100%",
              }}
            >
              Remark
            </div>
            <Input
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  // ItemAddRef.current.focus();
                }
              }}
              value={data.remark}
              className="bill-input"
              placeholder="Remark"
              style={{ width: "100%" }}
              size="small"
              onChange={(e) => {
                setData({ ...data, remark: e.target.value });
              }}
            />
          </Row>
        </Col>
        <Col
          span={6}
          style={{
            display: "flex",
          }}
        >
          <Button
            type="primary"
            style={{
              marginRight: 5,
              height: "100%",
              // padding: "0 12px",
              fontSize: "16px",
              fontWeight: "600",
              flex: 1,
            }}
            icon={<PlusCircleOutlined style={{ fontSize: 25 }} />}
            size="small"
            onClick={async () => {
              if (
                _.includes([null, ""], data.mode) ||
                _.includes([null, ""], data.amount)
              ) {
                notification.error({
                  message: "Required Fields are Empty",
                  description: (
                    <span>
                      Input's with (<span style={{ color: "red" }}> * </span> )
                      cannot be empty
                    </span>
                  ),
                  duration: 1,
                });
              } else {
                props.onAddClick(data);
                setData({
                  id: 0,
                  mode: null,
                  amount: 0.0,
                  remark: null,
                });
              }
            }}
          />
          <Button
            type="primary"
            style={{
              height: "100%",
              // padding: "0 12px",
              fontSize: "16px",
              fontWeight: "600",
              flex: 1,
            }}
            icon={<RetweetOutlined style={{ fontSize: 22 }} />}
            size="small"
            onClick={() => {
              setData({ id: 0, mode: null, amount: 0, remark: null });
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default PaymentMasterDtlCard;
