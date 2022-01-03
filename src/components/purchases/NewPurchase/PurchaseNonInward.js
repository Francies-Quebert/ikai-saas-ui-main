import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Button,
  Skeleton,
  Card,
  Table,
  Row,
  Typography,
} from "antd";
import {
  VerticalAlignBottomOutlined,
  CloseOutlined,
  EditOutlined,
  EditTwoTone,
} from "@ant-design/icons";
import { getRPTPurchase } from "../../../services/inventory-viewable-trans";
import fileDownload from "js-file-download";
import { getStockSummaryPurchasePdf } from "../../../services/stock-summary";
import { useSelector } from "react-redux";
import Modal from "antd/lib/modal/Modal";
import NewPurchaseCard from "./NewPurchaseCard";

const PurchaseNonInward = (props) => {
  const [currTranData, setcurrTranData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const l_ConfigCurrency = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((aa) => aa.configCode === "CURRENCY").value1
  );
  const l_ConfigClientCode = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((aa) => aa.configCode === "CLIENT_CODE")
        .value1
  );

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
      width: "75px",
      align: "center",
      render: (txt, record, idxz) => (
        <span style={{ fontWeight: 500 }}>{idxz + 1}</span>
      ),
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      width: "",
      ellipsis: true,
    },
    {
      title: "Pur Qty.",
      dataIndex: "Qty",
      width: "65px",
      align: "right",
      render: (txt, record) => (
        <span style={{ fontWeight: 500 }}>{record.Qty}</span>
      ),
    },
    {
      title: "Stk Qty.",
      dataIndex: "TotalPurQty",
      width: "65px",
      align: "right",
    },
    {
      title: "Cost Price",
      dataIndex: "CostPrice",
      width: "80px",
      align: "right",
    },
    {
      title: "Bill Amount",
      dataIndex: "Amount",
      width: "100px",
      align: "right",
    },
    {
      title: "Actual Amount",
      dataIndex: "ActualAmount",
      width: "116px",
      align: "right",
      render: (txt, record) => {
        let value;
        if (parseInt(record.Qty) > 0) {
          value = (
            (parseFloat(record.Amount) / parseFloat(record.Qty)) *
            parseFloat(record.TotalPurQty)
          ).toFixed(2);
        } else {
          value = (
            parseFloat(record.CostPrice) * parseFloat(record.TotalPurQty)
          ).toFixed(2);
          // console.log(value);
        }
        value = isNaN(value) ? "0.00" : value;
        return <span style={{ fontWeight: 500 }}>{value}</span>;
      },
    },
  ];

  const TotalActualAmount = () => {
    let value = 0;
    currTranData.PurchaseDtl.forEach((record) => {
      let calcValue = 0;
      if (parseInt(record.Qty) > 0) {
        calcValue = (
          (parseFloat(record.Amount) / parseFloat(record.Qty)) *
          parseFloat(record.TotalPurQty)
        ).toFixed(2);
      } else {
        calcValue = (
          parseFloat(record.CostPrice) * parseFloat(record.TotalPurQty)
        ).toFixed(2);
      }
      calcValue = isNaN(calcValue) ? 0 : parseFloat(calcValue);
      value = parseFloat(value) + calcValue;
    });
    return value.toFixed(2);
  };

  return (
    <div>
      {isLoading && <Skeleton active />}
      {!isLoading && currTranData && (
        <>
          <Card bodyStyle={{ padding: "5px" }}>
            <Descriptions
              bordered
              title={`#${props.VoucherId} ${currTranData.PurchaseHdr.LastModifiedBy} (${currTranData.PurchaseHdr.LastModifiedOn})`}
              size={"small"}
            >
              <Descriptions.Item label="Voucher No." span={2}>
                {currTranData.PurchaseHdr.VoucherNo}
              </Descriptions.Item>
              <Descriptions.Item label="Voucher Date" span={2}>
                {currTranData.PurchaseHdr.VoucherDate}
              </Descriptions.Item>
              <Descriptions.Item label="Bill No." span={2}>
                {currTranData.PurchaseHdr.PurchaseBillNo}
              </Descriptions.Item>
              <Descriptions.Item label="Bill Date" span={2}>
                {currTranData.PurchaseHdr.PurchaseBillDate}
              </Descriptions.Item>
              <Descriptions.Item label="Supplier" span={2}>
                {currTranData.PurchaseHdr.suppName}
                {currTranData.PurchaseHdr.mobileNo
                  ? `(
                ${currTranData.PurchaseHdr.mobileNo})`
                  : ""}
              </Descriptions.Item>
              <Descriptions.Item label="Bill Amount" span={2}>
                <span style={{ fontWeight: 500 }}>
                  {l_ConfigCurrency} {currTranData.PurchaseHdr.NetAmount}
                </span>
              </Descriptions.Item>
              <Descriptions.Item
                label="Actual Amount"
                span={2}
                className="d-none"
              >
                <span style={{ fontWeight: 500 }}>
                  {l_ConfigCurrency} <TotalActualAmount />
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Remark" span={4}>
                {currTranData.PurchaseHdr.Remark}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card bodyStyle={{ padding: "5px 5px 2px 5px" }}>
            <Row style={{ display: "flex" }}>
              <Table
                // columns={columns.filter((aa) =>
                //   l_ConfigClientCode &&
                //   props.IsPurchaseScreen &&
                //   l_ConfigClientCode === "MKANTIA"
                //     ? aa.dataIndex !== "Qty"
                //     : true
                // )}
                columns={
                  props.isShowFreeQty
                    ? columns
                    : columns.filter(
                        (ii) =>
                          ii.dataIndex !== "TotalPurQty" &&
                          ii.dataIndex !== "ActualAmount"
                      )
                }
                dataSource={
                  props.isShowFreeQty
                    ? currTranData.PurchaseDtl
                    : currTranData.PurchaseDtl.filter(
                        (ii) => parseFloat(ii.Qty) !== 0
                      )
                }
                pagination={false}
                bordered
                style={{ flex: 1 }}
                rowKey={"SrNo"}
                className="primary-color-head"
              />
            </Row>
            <Row style={{ padding: "5px 0px" }}>
              <Button
                type="primary"
                danger
                size="small"
                ghost
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
                size="small"
                ghost
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
                      if (window.electron) {
                        window.electron.ipcRenderer.send("store-data", {
                          pdf: res.data,
                          name: `${currTranData.PurchaseHdr.VoucherNo}.${dataType}`,
                          type: dataType,
                        });
                        window.electron.ipcRenderer.on(
                          "data-stored",
                          (event, arg) => {
                            console.log("data stored", arg);
                          }
                        );
                      } else {
                        fileDownload(
                          res.data,
                          `${currTranData.PurchaseHdr.VoucherNo}.${dataType}`
                        );
                      }
                    }
                  });
                }}
              >
                Print
              </Button>{" "}
              <Button
                type="primary"
                size="small"
                ghost
                icon={<EditOutlined />}
                style={{ marginRight: 5 }}
                disabled={props.IsEdit}
                onClick={() => {
                  setModal(true);
                }}
              >
                Edit
              </Button>
            </Row>
          </Card>

          <Modal
            width={"90%"}
            visible={modal}
            onCancel={() => {
              setModal(false);
            }}
            footer={false}
            bodyStyle={{ padding: "10px 7px" }}
          >
            <NewPurchaseCard
              onBackPress={() => {
                setModal(false);
              }}
              entryMode={"E"}
              VoucherId={props.VoucherId}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default PurchaseNonInward;
