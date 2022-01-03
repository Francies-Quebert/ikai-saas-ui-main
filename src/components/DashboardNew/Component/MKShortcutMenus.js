import React, { useEffect, useState } from "react";
import { DatePicker, Row, Col, Button, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const MKShortcutMenus = (props) => {
  const [size, setSize] = useState("large");
  const history = useHistory();
  return (
    <Row
      style={{
        width: "100%",
      }}
    >
      <Col
        xl={4}
        lg={6}
        sm={12}
        xs={24}
        style={{
          paddingRight: 5,
          paddingBottom: 5,
        }}
      >
        <Button
          type="primary"
          // icon={<DownloadOutlined />}
          style={{
            width: "100%",
          }}
          size={size}
          onClick={() => {
            history.push(`${process.env.PUBLIC_URL}/inventory/purchaseNew`);
          }}
        >
          Purchase
        </Button>
      </Col>
      <Col
        xl={4}
        lg={6}
        sm={12}
        xs={24}
        style={{
          paddingRight: 5,
          paddingBottom: 5,
        }}
      >
        <Button
          type="primary"
          // icon={<DownloadOutlined />}
          style={{
            // marginRight: 5,
            // marginBottom: 5,
            width: "100%",
          }}
          size={size}
          onClick={() => {
            history.push(`${process.env.PUBLIC_URL}/inventory/adjustmentNew`);
          }}
        >
          Adjustments
        </Button>
      </Col>
      <Col
        xl={4}
        lg={6}
        sm={12}
        xs={24}
        style={{
          paddingRight: 5,
          paddingBottom: 5,
        }}
      >
        <Button
          type="primary"
          // icon={<DownloadOutlined />}
          style={{
            // marginRight: 5,
            // marginBottom: 5,
            width: "100%",
          }}
          size={size}
          onClick={() => {
            history.push(`${process.env.PUBLIC_URL}/inventory/stockOut`);
          }}
        >
          Stock Out
        </Button>
      </Col>
      <Col
        xl={4}
        lg={6}
        sm={12}
        xs={24}
        style={{
          paddingRight: 5,
          paddingBottom: 5,
        }}
      >
        <Button
          type="primary"
          // icon={<DownloadOutlined />}
          style={{
            // marginRight: 5,
            // marginBottom: 5,
            width: "100%",
          }}
          size={size}
          onClick={() => {
            history.push(`${process.env.PUBLIC_URL}/inventory/stockSummary`);
          }}
        >
          Stock Summary
        </Button>
      </Col>
      <Col
        xl={4}
        lg={6}
        sm={12}
        xs={24}
        style={{
          paddingRight: 5,
          paddingBottom: 5,
        }}
      >
        <Button
          type="primary"
          // icon={<DownloadOutlined />}
          style={{
            // marginRight: 5,
            // marginBottom: 5,
            width: "100%",
          }}
          size={size}
          onClick={() => {
            history.push(`${process.env.PUBLIC_URL}/receipts-payments/dayBook`);
          }}
        >
          Day Book
        </Button>
      </Col>
      <Col
        xl={4}
        lg={6}
        sm={12}
        xs={24}
        style={{
          paddingRight: 5,
          paddingBottom: 5,
        }}
      >
        <Button
          type="primary"
          // icon={<DownloadOutlined />}
          style={{
            // marginRight: 5,
            // marginBottom: 5,
            width: "100%",
          }}
          size={size}
          onClick={() => {
            history.push(
              `${process.env.PUBLIC_URL}/receipts-payments/partyOutStanding`
            );
          }}
        >
          Party Outstanding
        </Button>
      </Col>
      {/* <Col
        xl={4}
        lg={6}
        sm={12}
        xs={24}
        style={{
          paddingRight: 5,
          paddingBottom: 5,
        }}
      >
        <Button
          type="primary"
          // icon={<DownloadOutlined />}
          style={{
            // marginRight: 5,
            // marginBottom: 5,
            width: "100%",
          }}
          size={size}
          // onClick={() => {
          //     history.push(`${process.env.PUBLIC_URL}/receipts-payments/partyOutStanding`);
          //   }}
        >
          Reports
        </Button>
      </Col> */}
    </Row>
  );
};

export default MKShortcutMenus;
