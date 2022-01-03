import React, { useEffect, useState, useRef } from "react";
import {
  getRPTSale,
  getRPTSalesReturn,
} from "../../../services/inventory-viewable-trans";
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
import { useSelector } from "react-redux";

const SalesReturnViewTran = (props) => {
  const [currTranData, setCurrTranData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setIsLoading(true);
    getRPTSalesReturn(CompCode, props.VoucherId).then((rr) => {
      setCurrTranData(rr);
      setIsLoading(false);
    });
  }, [props.VoucherId]);

  const columns = [
    {
      title: "Sr.No",
      dataIndex: "SrNo",
      key: "1",
      width: "80",
      align: "center",
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      key: "2",
      width: "",
    },
    {
      title: "Qty",
      dataIndex: "SaleQty",
      key: "3",
      width: "100px",
      align: "right",
    },
    {
      title: "Sale Price",
      dataIndex: "SalePrice",
      key: "4",
      width: "100",
      align: "right",
    },
    // {
    //   title: "Cost Price",
    //   dataIndex: "CostPrice",
    //   key: "5",
    //   width: "120px",
    //   align: "right",
    // },
    {
      title: "MRP",
      dataIndex: "MRP",
      key: "6",
      width: "100",
      align: "right",
    },
    {
      title: "Discount",
      dataIndex: "DiscAmount",
      key: "7",
      width: "100",
      align: "right",
    },
    {
      title: "Tax Amt.",
      dataIndex: "TaxAmount",
      key: "8",
      width: "100",
      align: "right",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "9",
      width: "100",
      align: "right",
    },
  ];
  return (
    <div>
      {isLoading && <Skeleton active />}

      {!isLoading && currTranData && currTranData.SaleReturnHdr && (
        <>
          <Card bodyStyle={{ padding: "5px" }}>
            <Descriptions bordered title={`#${props.VoucherId}`} size={"small"}>
              <Descriptions.Item label="Voucher No.">
                {currTranData.SaleReturnHdr.VoucherNo}
              </Descriptions.Item>
              <Descriptions.Item label="Voucher Date">
                {currTranData.SaleReturnHdr.VoucherDate}
              </Descriptions.Item>
              <Descriptions.Item
                label="Gross Amount"
                className="sales-description"
              >
                {currTranData.SaleReturnHdr.GrossAmount}
              </Descriptions.Item>
              <Descriptions.Item label="Discount" className="sales-description">
                {currTranData.SaleReturnHdr.DiscAmount}
              </Descriptions.Item>
              <Descriptions.Item
                label="Tax Amount"
                className="sales-description"
              >
                {currTranData.SaleReturnHdr.TaxAmount}
              </Descriptions.Item>
              <Descriptions.Item
                label="Net Amount"
                className="sales-description"
              >
                {currTranData.SaleReturnHdr.NetAmount}
              </Descriptions.Item>

              <Descriptions.Item label="Customer Info">
                {currTranData.SaleReturnHdr.CustName}(
                {currTranData.SaleReturnHdr.CustMobile})
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card bodyStyle={{ padding: "5px" }}>
            <Table
              size="small"
              columns={columns}
              dataSource={currTranData.SaleReturnDtl}
              pagination={false}
              bordered
              rowKey={"SrNo"}
            />
            <Row style={{ padding: "5px 0px" }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CloseOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  props.onClose();
                  setCurrTranData();
                }}
              >
                Close
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<VerticalAlignBottomOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  props.onDownloadPdf(currTranData);
                }}
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

export default SalesReturnViewTran;
