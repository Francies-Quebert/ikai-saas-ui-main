import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Row,
  Table,
  Typography,
  Checkbox,
  message,
  Tooltip,
  Drawer,
  DatePicker,
} from "antd";
import { useSelector } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { fetchDataPartyOutstandingDetail } from "../../../../services/party-outstanding";
import {
  EyeOutlined,
  FileDoneOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { getReceiptAndPaymentPdf } from "../../../../services/receipts-payments";
import fileDownload from "js-file-download";
import {
  getStockSummaryPurchasePdf,
  getStockSummarySalesPdf,
} from "../../../../services/stock-summary";
import { getInvoicePdf } from "../../../../services/service-managment/service-management";
import PurchaseNonInward from "../../../purchases/NewPurchase/PurchaseNonInward";
import ViewableDayBookComp from "./ViewableDayBookComp";

const PartyOutstandingDtlComp = (props) => {
  const [dataPartyOutstandingDtl, setDataPartyOutstandingDtl] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const l_ConfigDocSettlement = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DOC_STLMNT")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const { RangePicker } = DatePicker;
  // const [selectedRow, setselectedRow] = useState();
  const [settlementSelectionLeft, setSettlementSelectionLeft] = useState([]);
  // const [settlementSelectionRight, setSettlementSelectionRight] = useState([]);
  const [settlementSummary, setSettlemntSummary] = useState({
    Show: false,
    PrimarySettlementAmount: 0,
    SettlementAmount: 0,
    RemainingSettlementAmount: 0,
  });
  const [DateRange, setDateRange] = useState([null, null]);
  const [reCalculateAdjustment, setReCalculateAdjustment] = useState(false);
  const [tranDrawer, setTranDrawer] = useState({
    TranType: null,
    VoucherId: null,
    visible: false,
  });

  const [PrintStatus, setPrintStatus] = useState(false);
  const { Text } = Typography;

  useEffect(() => {
    setIsloading(true);
    fnDefault();
  }, []);

  useEffect(() => {
    let l_totalSettlementAmount = 0;
    let l_primarySettlementAmount = 0;
    let l_remainingSettlementAmount = 0;
    let l_tmpSettlementSummary = settlementSummary;

    if (settlementSelectionLeft.length > 0) {
      l_primarySettlementAmount = parseFloat(
        settlementSelectionLeft[0].BalanceAmount
      );
      l_remainingSettlementAmount = parseFloat(
        settlementSelectionLeft[0].BalanceAmount
      );

      l_tmpSettlementSummary = {
        ...l_tmpSettlementSummary,
        Show: true,
        PrimarySettlementAmount: parseFloat(
          settlementSelectionLeft[0].BalanceAmount
        ),
      };
    } else {
      // setSettlementSelectionRight([])
      l_tmpSettlementSummary = {
        ...l_tmpSettlementSummary,
        Show: false,
        PrimarySettlementAmount: 0,
      };
    }

    dataPartyOutstandingDtl
      .filter((kk) => kk.AdjustedAmount > 0)
      .forEach((row) => {
        l_totalSettlementAmount += parseFloat(row.AdjustedAmount);
        l_remainingSettlementAmount -= parseFloat(row.AdjustedAmount);
      });

    l_tmpSettlementSummary = {
      ...l_tmpSettlementSummary,
      SettlementAmount: l_totalSettlementAmount,
      RemainingSettlementAmount: l_remainingSettlementAmount,
    };
    setSettlemntSummary(l_tmpSettlementSummary);
  }, [settlementSelectionLeft, reCalculateAdjustment]);

  const fnDefault = () => {
    try {
      if (props.partyId) {
        fetchDataPartyOutstandingDetail(
          CompCode,
          props.partyId,
          props.FromDate,
          props.ToDate
          // DateRange[0] !== null
          //   ? moment(DateRange[0]).format("YYYY-MM-DD")
          //   : null,
          // DateRange[1] !== null
          //   ? moment(DateRange[1]).format("YYYY-MM-DD")
          //   : null
        ).then((res) => {
          if (res.length > 0) {
            setDataPartyOutstandingDtl(res);
            setIsloading(false);
          } else {
            setDataPartyOutstandingDtl([]);
            setIsloading(false);
          }
        });
      }
    } catch (error) {}
  };

  // useEffect(() => {
  //   setIsloading(true);
  //   fnDefault();
  // }, [DateRange]);

  const downloadPartyOutstandingPdf = (pRecordData) => {
    let res;
    let dataType = "pdf";
    if (window.electron) {
      dataType = "html";
    }

    if (pRecordData.TranType === "RCT" || pRecordData.TranType === "PMT") {
      getReceiptAndPaymentPdf(
        CompCode,
        pRecordData.TranType,
        pRecordData.TranId,
        dataType
      ).then((res) => {
        if (res) {
          let fileName = `${pRecordData.TranType}-${pRecordData.TranId}`;
          if (window.electron) {
            window.electron.ipcRenderer.send("store-data", {
              pdf: res.data,
              name: `${fileName}.${dataType}`,
              type: dataType,
            });
            window.electron.ipcRenderer.on("data-stored", (event, arg) => {
              console.log("data stored", arg);
            });
          } else {
            fileDownload(res.data, `${fileName}.${dataType}`);
          }
        }
      });
    } else if (pRecordData.TranType === "SALE") {
      getStockSummarySalesPdf(CompCode, pRecordData.TranId, dataType).then(
        (res) => {
          if (res) {
            let fileName = `${pRecordData.TranType}-${pRecordData.TranId}`;
            if (window.electron) {
              window.electron.ipcRenderer.send("store-data", {
                pdf: res.data,
                name: `${fileName}.${dataType}`,
                type: dataType,
              });
              window.electron.ipcRenderer.on("data-stored", (event, arg) => {
                console.log("data stored", arg);
              });
            } else {
              fileDownload(res.data, `${fileName}.${dataType}`);
            }
          }
        }
      );
    } else if (pRecordData.TranType === "PUR") {
      getStockSummaryPurchasePdf(CompCode, pRecordData.TranId, dataType).then(
        (res) => {
          if (res) {
            let fileName = `${pRecordData.TranType}-${pRecordData.TranId}`;
            if (window.electron) {
              window.electron.ipcRenderer.send("store-data", {
                pdf: res.data,
                name: `${fileName}.${dataType}`,
                type: dataType,
              });
              window.electron.ipcRenderer.on("data-stored", (event, arg) => {
                console.log("data stored", arg);
              });
            } else {
              fileDownload(res.data, `${fileName}.${dataType}`);
            }
          }
        }
      );
    } else if (pRecordData.TranType === "INVOICE") {
      getInvoicePdf(CompCode, true, pRecordData.TranId, dataType).then(
        (res) => {
          if (res) {
            let fileName = `${pRecordData.TranType}-${pRecordData.TranId}`;
            if (window.electron) {
              window.electron.ipcRenderer.send("store-data", {
                pdf: res.data,
                name: `${fileName}.${dataType}`,
                type: dataType,
              });
              window.electron.ipcRenderer.on("data-stored", (event, arg) => {
                console.log("data stored", arg);
              });
            } else {
              fileDownload(res.data, `${fileName}.${dataType}`);
            }
          }
        }
      );
    }

    // console.log(pRecordData);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSettlementSelectionLeft(selectedRows);
      setReCalculateAdjustment(!reCalculateAdjustment);
      let tmp = [];
      dataPartyOutstandingDtl.forEach((ooo) => {
        tmp.push({ ...ooo, isRightSelected: false, AdjustedAmount: 0 });
      });
      setDataPartyOutstandingDtl(tmp);
      // console.log(selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled:
        settlementSelectionLeft && settlementSelectionLeft.length > 0
          ? settlementSelectionLeft.filter((ii) => ii.key !== record.key)[0]
          : false,
    }),
  };

  const onViewDocument = (record) => {
    if (record.TranType !== "INVOICE") {
      setTranDrawer({
        TranType: record.TranType,
        VoucherId: record.TranId,
        visible: true,
      });
    } else {
      let dataType = "pdf";
      if (window.electron) {
        dataType = "html";
      }
      getInvoicePdf(CompCode, true, record.TranId, dataType).then((res) => {
        if (res) {
          let fileName = record.TranNo;
          if (window.electron) {
            window.electron.ipcRenderer.send("store-data", {
              pdf: res.data,
              name: `${fileName}.${dataType}`,
              type: dataType,
            });
            window.electron.ipcRenderer.on("data-stored", (event, arg) => {
              console.log("data stored", arg);
            });
          } else {
            fileDownload(res.data, `${fileName}.${dataType}`);
          }
        }
      });
    }
  };

  const ListOfBillsColumns = [
    { title: "Tran Type", dataIndex: "TranTypeDesc", width: 80, fixed: "left" },
    { title: "Tran No.", dataIndex: "TranNo", width: 120, fixed: "left" },
    { title: "Ref No.", dataIndex: "RefNo", width: 80, fixed: "left" },
    {
      title: "Tran Date",
      dataIndex: "TranDate",
      fixed: "left",
      width: 90,

      render: (text, record) => {
        // console.log("sss", record, record.TranDate, l_ConfigDateFormat.value1);
        return (
          <span>
            {moment(record.TranDate).format(l_ConfigDateFormat.value1)}
          </span>
        );
      },
    },
    { title: "Remark", dataIndex: "Remark", ellipsis: true },

    {
      title: "Amount",
      dataIndex: "Amount",
      align: "right",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            {record.Nature === "+" ? (
              <Text style={{ color: "green", fontWeight: 600 }}>
                {Math.abs(parseFloat(record.Amount)).toFixed(2)}
              </Text>
            ) : (
              <Text type="danger" style={{ fontWeight: 600, color: "red" }}>
                {Math.abs(parseFloat(record.Amount)).toFixed(2)}
              </Text>
            )}
          </>
        );
      },
    },
    {
      title: "Running Amount",
      dataIndex: "Amount",
      width: 100,
      align: "right",
      render: (txt, record, idx) => {
        let l_tmpRunningTotal = 0;
        dataPartyOutstandingDtl.forEach((ee, ridx) => {
          if (ridx <= idx) {
            l_tmpRunningTotal += parseFloat(ee.Amount);
          }
        });
        return (
          <span className="text-blue-500 font-semibold">
            {l_tmpRunningTotal.toFixed(2)}{" "}
          </span>
        );
      },
    },
    {
      width: 25,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <span style={{}}>
              <Tooltip title="View">
                <EyeOutlined
                  className="custom-day-book-icon"
                  onClick={() => {
                    // downloadPartyOutstandingPdf(record);
                    onViewDocument(record);
                  }}
                />
              </Tooltip>
            </span>
          </>
        );
      },
    },
  ];

  const columns = [
    { title: "Tran Type", dataIndex: "TranTypeDesc", fixed: "left", width: 80 },
    { title: "Tran No.", dataIndex: "TranNo", fixed: "left", width: 80 },
    {
      title: "Tran Date",
      dataIndex: "TranDate",
      width: 90,
      fixed: "left",
      render: (text, record) => {
        return (
          <span>
            {moment(record.TranDate).format(l_ConfigDateFormat.value1)}
          </span>
        );
      },
    },
    { title: "Remark", dataIndex: "Remark", ellipsis: true },
    {
      title: "Tran Amount",
      dataIndex: "Amount",
      width: 100,
      align: "right",

      render: (text, record) => {
        return (
          <>
            {record.Nature === "+" ? (
              <Text style={{ color: "green", fontWeight: 600 }}>
                {Math.abs(parseFloat(record.Amount)).toFixed(2)}
              </Text>
            ) : (
              <Text type="danger" style={{ fontWeight: 600, color: "red" }}>
                {Math.abs(parseFloat(record.Amount)).toFixed(2)}
              </Text>
            )}
          </>
        );
      },
    },
    {
      title: "Bal Amount",
      dataIndex: "BalanceAmount",
      width: 100,
      align: "right",
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            {record.Nature === "+" ? (
              <Text style={{ color: "green", fontWeight: 600 }}>
                {Math.abs(parseFloat(record.BalanceAmount)).toFixed(2)}
              </Text>
            ) : (
              <Text type="danger" style={{ fontWeight: 600, color: "red" }}>
                {Math.abs(parseFloat(record.BalanceAmount)).toFixed(2)}
              </Text>
            )}
          </>
        );
      },
    },
    {
      dataIndex: "isRightSelected",
      width: 150,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <span style={{ marginRight: 5 }}>
              <Checkbox
                disabled={
                  settlementSelectionLeft.length === 0 ||
                  (settlementSelectionLeft.length > 0 &&
                    settlementSelectionLeft[0].key === record.key) ||
                  (settlementSelectionLeft.length > 0 &&
                    settlementSelectionLeft[0].Nature === record.Nature)
                }
                checked={record.isRightSelected}
                // value={false}
                onChange={(e) => {
                  if (
                    e.target.checked &&
                    settlementSummary.RemainingSettlementAmount <= 0
                  ) {
                    message.error("Remaining settlement amount is zero.");
                    record.isRightSelected = false;
                    record.AdjustedAmount = 0;
                  } else if (!e.target.checked) {
                    record.isRightSelected = false;
                    record.AdjustedAmount = 0;
                  } else {
                    if (
                      settlementSummary.RemainingSettlementAmount <
                      record.BalanceAmount
                    ) {
                      record.AdjustedAmount =
                        settlementSummary.RemainingSettlementAmount;
                    } else {
                      record.AdjustedAmount = record.BalanceAmount;
                    }
                    record.isRightSelected = e.target.checked;
                  }
                  setReCalculateAdjustment(!reCalculateAdjustment);
                }}
              />
            </span>
            <span style={{ marginRight: 5 }}>
              <Tooltip title="View">
                <EyeOutlined
                  className="custom-day-book-icon"
                  onClick={() => {
                    // downloadPartyOutstandingPdf(record);
                    onViewDocument(record);
                  }}
                />
              </Tooltip>
            </span>
            <span style={{ marginRight: 5 }}>
              {" "}
              {record.AdjustedAmount > 0 &&
                // <Text type="success">{record.AdjustedAmount}</Text>
                record.AdjustedAmount}
            </span>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Row style={{ padding: 5 }}>
        <Col
          style={{
            padding: "0px 3px",
            width: l_ConfigDocSettlement.value1 === "Y" ? "50%" : "100%",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--app-theme-color)",
              fontSize: 14,
              width: "100%",
              color: "#FFF",
              padding: "3px 3px 3px 8px",
              fontWeight: "600",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>List of Transactions</div>
            {/* <div>
              <RangePicker
                size="small"
                onChange={(val, aa) => {
                  setDateRange(val !== null ? [...val] : [null, null]);
                }}
                format={l_ConfigDateFormat.value1}
                defaultValue={DateRange}
              />
            </div> */}
          </div>
          <Table
            bordered
            className="receipt-payment-table"
            showHeader={true}
            loading={isLoading}
            scroll={{ y: 300 }}
            pagination={false}
            dataSource={dataPartyOutstandingDtl}
            columns={ListOfBillsColumns}
            summary={(pageData) => {
              let totalOutstanding = 0;
              if (pageData.length > 0) {
                pageData.forEach(({ Amount }) => {
                  totalOutstanding += parseFloat(Amount);
                });
              }

              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong={true}>
                        Total ({l_ConfigCurrency.value1})
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>{" "}
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell className="custom-table-summary-amount">
                      <Text strong={true}>{totalOutstanding.toFixed(2)}</Text>
                    </Table.Summary.Cell>{" "}
                    <Table.Summary.Cell></Table.Summary.Cell>
                    <Table.Summary.Cell></Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </Col>
        {l_ConfigDocSettlement.value1 === "Y" && (
          <Col style={{ width: "50%" }}>
            <div
              style={{
                backgroundColor: "var(--app-theme-color)",
                fontSize: 14,
                width: "100%",
                color: "#FFF",
                padding: "3px 0px 3px 8px",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              UnSettled Transactions
            </div>
            <Table
              bordered
              showHeader={true}
              loading={isLoading}
              scroll={{ y: 300 }}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
                hideSelectAll: true,
                // selectedRowKeys: selectedRow,
              }}
              dataSource={dataPartyOutstandingDtl.filter(
                (gg) => parseFloat(gg.BalanceAmount) > 0
              )}
              pagination={false}
              key={(data) => {
                return data.key;
              }}
              columns={columns}
            />
            <Divider
              type="horizontal"
              style={{ marginBottom: 5, marginTop: 5 }}
            />
            {settlementSummary.Show === true && (
              <Row style={{ justifyContent: "flex-end", display: "flex" }}>
                <Col flex={1}>
                  <div>
                    Primary : {settlementSummary.PrimarySettlementAmount}
                  </div>
                </Col>
                <Col flex={1}>
                  <div>Settled : {settlementSummary.SettlementAmount}</div>
                </Col>
                <Col flex={1}>
                  <div>
                    Remaining : {settlementSummary.RemainingSettlementAmount}
                  </div>
                </Col>

                <Col>
                  <Button
                    style={{ marginRight: 5 }}
                    type="primary"
                    icon={<FileDoneOutlined />}
                    onClick={() => {}}
                  >
                    Settle
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        )}
        {/* {console.log(":as")} */}
        {/* {tranDrawer.visible && tranDrawer.data && ( */}
        <>
          <Drawer
            placement="right"
            closable={true}
            width={"50%"}
            bodyStyle={{ padding: 0 }}
            onClose={() => {
              setTranDrawer({
                TranType: null,
                VoucherId: null,
                visible: false,
              });
            }}
            visible={tranDrawer.visible}
          >
            {/* {tranDrawer.TranType === "PUR" ? ( */}

            {tranDrawer.TranType === "PUR" ? (
              <PurchaseNonInward
                VoucherId={tranDrawer.VoucherId}
                onClose={() => {
                  setTranDrawer({
                    TranType: null,
                    VoucherId: null,
                    visible: false,
                  });
                }}
              />
            ) : tranDrawer.TranType === "RCT" ||
              tranDrawer.TranType === "PMT" ? (
              <ViewableDayBookComp
                VoucherId={tranDrawer.VoucherId}
                TranType={tranDrawer.TranType}
                onClose={() => {
                  setTranDrawer({
                    TranType: null,
                    VoucherId: null,
                    visible: false,
                  });
                }}
                PrintStatus={PrintStatus}
                onPrintClick={() => {
                  setPrintStatus(true);
                  let dataType = "pdf";
                  if (window.electron) {
                    dataType = "html";
                  }
                  getReceiptAndPaymentPdf(
                    CompCode,
                    tranDrawer.TranType,
                    tranDrawer.VoucherId,
                    dataType
                  ).then((res) => {
                    if (res) {
                      let fileName = `${tranDrawer.TranType}-${tranDrawer.VoucherId}`;
                      if (window.electron) {
                        window.electron.ipcRenderer.send("store-data", {
                          pdf: res.data,
                          name: `${fileName}.${dataType}`,
                          type: dataType,
                        });
                        window.electron.ipcRenderer.on(
                          "data-stored",
                          (event, arg) => {
                            console.log("data stored", arg);
                          }
                        );
                      } else {
                        fileDownload(res.data, `${fileName}.${dataType}`);
                      }

                      setPrintStatus(false);
                    }
                  });
                }}
              />
            ) : (
              ""
            )}

            {/* ) : (
              ""
            )} */}
          </Drawer>
        </>
        {/* )} */}
      </Row>
    </>
  );
};

export default PartyOutstandingDtlComp;
