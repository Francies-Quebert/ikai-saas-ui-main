import React, { useState, useEffect } from "react";
import { getRPTPurchase } from "../../../services/inventory-viewable-trans";
import { Descriptions, Button, Skeleton, Card, Table, Row } from "antd";
import { VerticalAlignBottomOutlined, CloseOutlined } from "@ant-design/icons";
import fileDownload from "js-file-download";
import { getStockSummaryPurchasePdf } from "../../../services/stock-summary";

import { useSelector } from "react-redux";
import { PrintPdfOrFromElectron } from "../../../shared/utility";
const PurchaseTranView = (props) => {
  const [currTranData, setcurrTranData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setIsLoading(true);
    getRPTPurchase(CompCode, props.VoucherId).then((ss) => {
      setcurrTranData(ss);
    });
    setIsLoading(false);
  }, []);

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
      width: "250px",
    },
    {
      title: "Qty",
      dataIndex: "TotalPurQty",
      key: "3",
      width: "100px",
      align: "right",
    },
    // {
    //   title: "Sale Price",
    //   dataIndex: "SalePrice",
    //   key: "4",
    //   width: "100px",
    //   align: "right",
    // },
    {
      title: "Cost Price",
      dataIndex: "CostPrice",
      key: "5",
      width: "100px",
      align: "right",
    },
    // {
    //   title: "MRP",
    //   dataIndex: "MRP",
    //   key: "6",
    //   width: "100px",
    //   align: "right",
    // },
    {
      title: "Discount",
      dataIndex: "DiscAmount",
      key: "7",
      width: "100px",
      align: "right",
    },
    {
      title: "Tax Amt.",
      dataIndex: "TaxAmount",
      key: "8",
      width: "100px",
      align: "right",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "9",
      width: "100px",
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
              <Descriptions.Item label="Voucher No.">
                {currTranData.PurchaseHdr.VoucherNo}
              </Descriptions.Item>
              <Descriptions.Item label="Voucher Date">
                {currTranData.PurchaseHdr.VoucherDate}
              </Descriptions.Item>
              <Descriptions.Item
                label="Gross Amount"
                className="sales-description"
              >
                {currTranData.PurchaseHdr.GrossAmount}
              </Descriptions.Item>
              <Descriptions.Item label="Discount" className="sales-description">
                {currTranData.PurchaseHdr.DiscAmount}
              </Descriptions.Item>
              <Descriptions.Item
                label="Tax Amount"
                className="sales-description"
              >
                {currTranData.PurchaseHdr.TaxAmount}
              </Descriptions.Item>
              <Descriptions.Item
                label="Net Amount"
                className="sales-description"
              >
                {currTranData.PurchaseHdr.NetAmount}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Net Amt.">
                {currTranData.PurchaseHdr.NetAmount}
              </Descriptions.Item> */}
              <Descriptions.Item label="Supplier Info">
                {currTranData.PurchaseHdr.suppName}(
                {currTranData.PurchaseHdr.mobileNo})
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card bodyStyle={{ padding: "5px" }}>
            <Row style={{ display: "flex" }}>
              <Table
                size="small"
                columns={columns}
                dataSource={currTranData.PurchaseDtl}
                pagination={false}
                bordered
                rowKey={"SrNo"}
                style={{ flex: 1 }}
              />
            </Row>
            <Row style={{ padding: "2px 0px" }}>
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
                onClick={() => {
                  let dataType = "pdf";
                  if (window.electron) {
                    dataType = "html";
                  }
                  getStockSummaryPurchasePdf(
                    CompCode,
                    props.VoucherId,
                    dataType
                  ).then((res) => {
                    if (res) {
                      PrintPdfOrFromElectron(
                        res,
                        `${currTranData.PurchaseHdr.VoucherNo}`,
                        dataType
                      );
                    }
                  });
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

export default PurchaseTranView;
