import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Col,
  Button,
  Skeleton,
  Avatar,
  Card,
  Table,
  Row,
} from "antd";
import {
  VerticalAlignBottomOutlined,
  CloseOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { getReportServiceInvoice } from "../../../../services/inventory-viewable-trans";
import { useSelector } from "react-redux";
const GenericInvoiceViewComponent = (props) => {
  const [currTranData, setCurrTranData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setIsLoading(true);
    getReportServiceInvoice(CompCode, props.data, "JSON").then((rr) => {
      setCurrTranData(rr.data.data);
    });
    setIsLoading(false);
  }, []);
  const columns = [
    {
      title: "Sr.No",
      dataIndex: "SrNo",
      key: "1",
      width: "80px",
      align: "center",
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      key: "2",
      width: "250px",
    },
    {
      title: "Qty",
      dataIndex: "Qty",
      key: "3",
      width: "100px",
      align: "right",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "4",
      width: "120px",
      align: "right",
    },
  ];

  return (
    <div>
      {isLoading && <Skeleton active />}
      {!isLoading && currTranData && (
        <>
          <Card bodyStyle={{ padding: "5px" }}>
            <Descriptions
              bordered
              title={`#${currTranData.InvoiceHdr.InvoiceId}`}
              // (${
              //   currTranData.InvoiceHdr ? currTranData.InvoiceHdr.InvoiceDate : ""
              // })`}
              size={"small"}
              className="description-primary-header"
            >
              <Descriptions.Item
                span={1}
                className="adjustment-description"
                label="Invoice No."
              >
                {currTranData.InvoiceHdr.InvoiceNo}
              </Descriptions.Item>
              <Descriptions.Item
                span={2}
                className="adjustment-description"
                label="Invoice Date"
              >
                {currTranData.InvoiceHdr.InvoiceDate}
              </Descriptions.Item>
              <Descriptions.Item
                // span={1}
                span={3}
                className="adjustment-description"
                label="Amount"
              >
                {currTranData.InvoiceHdr.InvoiceAmount}
              </Descriptions.Item>
              <Descriptions.Item
                span={3}
                className="adjustment-description"
                label="Remark"
              >
                {currTranData.InvoiceHdr.InvoiceRemark}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card bodyStyle={{ padding: "2px 3px" }}>
            <Table
              columns={columns}
              dataSource={
                currTranData.InvoiceDtl.length > 0
                  ? currTranData.InvoiceDtl
                  : []
              }
              pagination={false}
              bordered
              // size={"small"}
              rowKey={"SrNo"}
              className="primary-color-head"
            />

            <Row style={{ padding: "10px" }}>
              <Button
                danger
                htmlType="submit"
                icon={<CloseOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  props.onClose();
                }}
                size="small"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  props.onPrintClick();
                }}
                loading={props.PrintStatus}
                htmlType="submit"
                icon={<VerticalAlignBottomOutlined />}
                style={{
                  marginRight: 5,
                  borderColor: "var(--app-theme-color)",
                  color: "var(--app-theme-color)",
                }}
                size="small"
              >
                Print
              </Button>
            </Row>
          </Card>
        </>
      )}
    </div>
  );
};

export default GenericInvoiceViewComponent;
