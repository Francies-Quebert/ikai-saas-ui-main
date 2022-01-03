import React from "react";
import {
    Row,
    Col,
    Card,
  } from "antd";

const PaymentModeNewPage = (props) => {
  return (
    <>
      <Row>
        <Col span={8}>
          <div className="site-card-border-less-wrapper">
            <Card title="Card title" bordered={false} style={{ width: 300 }}>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default PaymentModeNewPage;
