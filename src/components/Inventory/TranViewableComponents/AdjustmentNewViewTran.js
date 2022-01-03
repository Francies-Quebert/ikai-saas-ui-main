import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getRPTDataAdjustment } from "../../../services/inventory-viewable-trans";
import {
  Descriptions,
  Radio,
  Button,
  Skeleton,
  Avatar,
  Card,
  Table,
  Row,
} from "antd";

import { VerticalAlignBottomOutlined, CloseOutlined } from "@ant-design/icons";

const AdjustmentNewViewTran = (props) => {
  const [currTranData, setCurrTranData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setIsLoading(true);
    getRPTDataAdjustment(CompCode, props.VoucherId).then((rr) => {
      setCurrTranData(rr);
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
      width: "250",
    },
    {
      title: "R.I. Type",
      dataIndex: "RIType",
      key: "9",
      width: "100px",
      align: "left",
      render: (text) => {
        return (
          <span style={{ color: text === "Issue" ? "red" : "green" }}>
            {text}
          </span>
        );
      },
    },
    {
      title: "Qty",
      dataIndex: "Qty",
      key: "3",
      width: "100px",
      align: "right",
      render: (text) => {
        return <>{Math.abs(text)}</>;
      },
    },
    // {
    //   title: "Sale Price",
    //   dataIndex: "SalePrice",
    //   key: "4",
    //   width: "120px",
    //   align: "right",
    // },
    {
      title: "Cost Price",
      dataIndex: "CostPrice",
      key: "5",
      width: "120px",
      align: "right",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "3",
      width: "100px",
      align: "right",
      render: (text, record) => {
        return (
          <>
            {(
              Math.abs(parseFloat(record.Qty)) * parseFloat(record.CostPrice)
            ).toFixed(2)}
          </>
        );
      },
    },
    // {
    //   title: "MRP",
    //   dataIndex: "MRP",
    //   key: "6",
    //   width: "120px",
    //   align: "right",
    // },
  ];

  return (
    <div>
      {isLoading && <Skeleton active />}
      {!isLoading && currTranData && (
        <>
          <Card bodyStyle={{ padding: "5px" }}>
            <Descriptions
              bordered
              title={`#${props.VoucherId} ${currTranData.AdjustmentsHdr.LastModifiedBy} (${currTranData.AdjustmentsHdr.LastModifiedOn})`}
              size={"small"}
              className="description-primary-header"
              // extra={<Button type="primary">Edit</Button>}
            >
              <Descriptions.Item
                span={1}
                className="adjustment-description"
                label="Voucher No."
              >
                {currTranData.AdjustmentsHdr.VoucherNo}
              </Descriptions.Item>
              <Descriptions.Item
                span={2}
                className="adjustment-description"
                label="Voucher Date"
              >
                {currTranData.AdjustmentsHdr.VoucherDate}
              </Descriptions.Item>
              {/* </Descriptions>
            <Descriptions bordered size={"small"}> */}
              <Descriptions.Item
                span={1}
                className="adjustment-description"
                label="Reason"
              >
                {currTranData.AdjustmentsHdr.Reason}
              </Descriptions.Item>
              <Descriptions.Item
                span={2}
                className="adjustment-description"
                label="Remark"
              >
                {currTranData.AdjustmentsHdr.Remark}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card bodyStyle={{ padding: "5px 10px" }}>
            <Row style={{ display: "flex" }}>
              {" "}
              <Table
                columns={columns}
                dataSource={currTranData.AdjustmentsDtl}
                pagination={false}
                bordered
                // size={"small"}
                style={{ flex: 1 }}
                rowKey={"SrNo"}
                className="primary-color-head"
              />
            </Row>

            <Row style={{ padding: "10px" }}>
              <Button
                // type="primary"
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
                // type="primary"
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

export default AdjustmentNewViewTran;
