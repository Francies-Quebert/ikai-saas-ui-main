import React, { useEffect, useState, useRef } from "react";
import { getDataRPTReprocessing } from "../../../services/inventory-viewable-trans";
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
import { useSelector, useDispatch } from "react-redux";
import { VerticalAlignBottomOutlined, CloseOutlined } from "@ant-design/icons";

const StockReprocessingViewTran = (props) => {
  const [currTranData, setCurrTranData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setIsLoading(true);
    getDataRPTReprocessing(CompCode, props.VoucherId).then((rr) => {
      setCurrTranData(rr);
    });
    setIsLoading(false);
  }, []);

  const columns = [
    {
      title: "Sr.No",
      dataIndex: "SrNo",
      key: "1",
      width: "100px",
      align: "center",
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      key: "2",
      width: "500px",
    },
    {
      title: "R.I. Type",
      dataIndex: "RIType",
      key: "9",
      width: "150px",
      align: "left",
    },
    {
      title: "Qty",
      dataIndex: "Qty",
      key: "3",
      width: "100px",
      align: "right",
    },
    {
      title: "Sale Price",
      dataIndex: "SalePrice",
      key: "4",
      width: "120px",
      align: "right",
    },
    {
      title: "Cost Price",
      dataIndex: "CostPrice",
      key: "5",
      width: "120px",
      align: "right",
    },
    {
      title: "MRP",
      dataIndex: "MRP",
      key: "6",
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
              title={`#${props.VoucherId}`}
              size={"small"}
              // extra={<Button type="primary">Edit</Button>}
            >
              <Descriptions.Item
                className="adjustment-description"
                label="Voucher No."
              >
                {currTranData.ReprocessingHdr.VoucherNo}
              </Descriptions.Item>
              <Descriptions.Item
                className="adjustment-description"
                label="Voucher Date"
              >
                {currTranData.ReprocessingHdr.VoucherDate}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions bordered size={"small"}>
              <Descriptions.Item
                className="adjustment-description"
                label="Reason"
              >
                {currTranData.ReprocessingHdr.Reason}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card bodyStyle={{ padding: "5px" }}>
            <Table
              columns={columns}
              dataSource={currTranData.ReprocessingDtl}
              pagination={false}
              bordered
              size={"small"}
              rowKey={"SrNo"}
            />
            <Row style={{ padding: "10px" }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CloseOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  props.onClose();
                }}
              >
                Close
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<VerticalAlignBottomOutlined />}
                style={{ marginRight: 5 }}
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

export default StockReprocessingViewTran;
