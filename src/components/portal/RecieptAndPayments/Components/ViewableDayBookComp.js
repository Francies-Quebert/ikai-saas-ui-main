import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getReceiptAndPaymentPdf } from "../../../../services/inventory-viewable-trans";
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

const ViewableDayBookComp = (props) => {
  const [currTranData, setCurrTranData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const lConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((ac) => ac.configCode === "CURRENCY")
  );

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setIsLoading(true);
    getReceiptAndPaymentPdf(
      CompCode,
      props.TranType,
      props.VoucherId,
      "JSON"
    ).then((rr) => {
      console.log(rr, "aa");
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
      title: "Payment Mode",
      dataIndex: "PayDesc",
      key: "2",
      width: "",
      render: (text, record) => {
        return (
          <span>
            {text} ({record.PaymentMode})
          </span>
        );
      },
    },
    {
      title: "Remark",
      dataIndex: "DtlRemark",
      key: "3",
      width: "100px",
      align: "right",
    },
    {
      title: "Amount",
      dataIndex: "DtlAmount",
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
              title={`#${props.VoucherId} ${
                currTranData.TranHdr ? currTranData.TranHdr.LastModifiedBy : ""
              } (${
                currTranData.TranHdr ? currTranData.TranHdr.LastModifiedOn : ""
              })`}
              size={"small"}
              className="description-primary-header"
            >
              <Descriptions.Item
                span={1}
                className="adjustment-description"
                label="Voucher No."
              >
                {currTranData.TranHdr.TranNo}
              </Descriptions.Item>
              <Descriptions.Item
                span={2}
                className="adjustment-description"
                label="Voucher Date"
              >
                {currTranData.TranHdr.TranDate}
              </Descriptions.Item>
              {currTranData.TranHdr.TranType !== "TRNFR" ? (
                <Descriptions.Item
                  // span={1}
                  span={3}
                  className="adjustment-description"
                  label="Amount"
                >
                  {currTranData.TranHdr.Amount}
                </Descriptions.Item>
              ) : null}
              <Descriptions.Item
                span={3}
                className="adjustment-description"
                label="Remark"
              >
                {currTranData.TranHdr.Remark}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card bodyStyle={{ padding: "5px" }}>
            {console.log(currTranData.TranDtl, "ss")}
            {currTranData.TranHdr.TranType === "TRNFR" &&
            currTranData.TranDtl.length > 0 ? (
              <Row style={{ display: "flex", flexDirection: "row" }}>
                <Card
                  bodyStyle={{ padding: "10px", textAlign: "center" }}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    transition: "0.3s",
                  }}
                >
                  <Col>
                    <h6>Transfer From</h6>
                  </Col>
                  <Col>
                    {
                      currTranData.TranDtl.find(
                        (oo) => parseFloat(oo.DtlAmount) < 0
                      ).PayDesc
                    }
                  </Col>
                  <Col>
                    {lConfigCurrency.value1}
                    <span style={{ color: "red", padding: 5 }}>
                      {Math.abs(
                        currTranData.TranDtl.find((oo) => oo.DtlAmount < 0)
                          .DtlAmount
                      ).toFixed(2)}
                    </span>
                  </Col>
                </Card>
                <Col
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "25px 0px",
                    fontSize: 25,
                  }}
                >
                  <SwapOutlined />
                </Col>
                <Card
                  bodyStyle={{ padding: "10px", textAlign: "center" }}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    transition: "0.3s",
                  }}
                >
                  <Col>
                    <h6>Transfer To</h6>
                  </Col>
                  <Col>
                    {
                      currTranData.TranDtl.find((oo) => oo.DtlAmount > 0)
                        .PayDesc
                    }
                  </Col>
                  <Col>
                    {lConfigCurrency.value1}
                    <span style={{ color: "green", padding: 5 }}>
                      {parseFloat(
                        currTranData.TranDtl.find((oo) => oo.DtlAmount > 0)
                          .DtlAmount
                      ).toFixed(2)}
                    </span>
                  </Col>
                </Card>
              </Row>
            ) : (
              <Table
                columns={columns}
                dataSource={
                  currTranData.TranDtl.length > 0 ? currTranData.TranDtl : []
                }
                pagination={false}
                bordered
                // size={"small"}
                rowKey={"SrNo"}
                className="primary-color-head"
              />
            )}

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

export default ViewableDayBookComp;
