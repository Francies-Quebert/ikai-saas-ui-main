import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  DatePicker,
  Button,
  Table,
  Typography,
  message,
  Tooltip,
  Dropdown,
  Menu,
  Col,
  Modal,
  Drawer,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  SettingOutlined,
  PlusCircleOutlined,
  CloudDownloadOutlined,
  SecurityScanFilled,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import { setFormCaption } from "../../../store/actions/currentTran";
import {
  hasRightToBeUsedNext,
  PrintPdfOrFromElectron,
} from "../../../shared/utility";
import {
  fetchDataDayBookDetails,
  fetchDataCashBookDetails,
} from "../../../services/day-book";
import {
  deleteReceiptAndPayments,
  getReceiptAndPaymentPdf,
  getTransferPdf,
} from "../../../services/receipts-payments";
import { getDayBookPdf } from "../../../services/day-book";

import ReceiptAndPaymentCard from "./ReceiptAndPaymentCard";
import fileDownload from "js-file-download";
import swal from "sweetalert";
import ViewableDayBookComp from "./Components/ViewableDayBookComp";
import DayBookClosingBalance from "./Components/DayBookClosingBalance";
import { object } from "yup";
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const DayBookPage = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_ConfigDateTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTTMFORMAT")
  );
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  const l_ConfigDayBookValueDivisibleBy = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "ZBN_DB_CB")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  //DCB_DAY_GROUP
  const l_ConfigEnableDayBookDayWiseGrouping = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DCB_DAY_GROUP")
  );
  const [DateRange, setDateRange] = useState([moment(), moment()]);

  const currentTran = useSelector((state) => state.currentTran);
  const userAccessIncome = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 100)[0]
  );
  const userAccessExpense = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 99)[0]
  );
  const userAccessReciept = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 98)[0]
  );
  const userAccessPayment = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 97)[0]
  );
  const userAccessGenericIn = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 123)[0]
  );
  const userAccessGenericOut = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 124)[0]
  );

  const [modal, setModal] = useState({
    EntryMode: "",
    TranType: "",
    TranId: 0,
  });
  const [data, setData] = useState([]);
  const [dataGroupByDay, setDataGroupByDay] = useState([]);
  const [isRefreshRequired, setIsRefreshRequired] = useState(false);
  const [DrawerShow, setDrawerShow] = useState({
    TranType: props.TranType,
    VoucherId: null,
    visible: false,
  });
  const [isClosingBalanceRefresh, setIsClosingBalanceRefresh] = useState(false);

  const [PrintStatus, setPrintStatus] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    //Set Form Caption
    dispatch(
      setFormCaption(
        props.TranType === "DAY" ? 101 : props.TranType === "CASH" ? 102 : ""
      )
    );
    //Fetch Data
    fnDefault();
  }, []);

  useEffect(() => {
    if (isRefreshRequired === true) {
      setIsLoading(true);
      fnDefault();
      setIsRefreshRequired(false);
    }
  }, [isRefreshRequired]);

  const fnDefault = async () => {
    try {
      if (props.TranType === "DAY") {
        fetchDataDayBookDetails(
          CompCode,
          moment(DateRange[0]).format("YYYY-MM-DD"),
          moment(DateRange[1]).format("YYYY-MM-DD")
        ).then(async (res) => {
          let tempArray = [];
          await res.forEach((row) => {
            let pSource = Object.keys(
              _.groupBy(row.PaymentSource.split(","))
            ).toString();
            tempArray.push({
              ...row,
              PaymentSource: pSource,
            });
          });

          let tmpData = [];
          tempArray.forEach((zz, idx) => {
            let zIndex = tmpData.findIndex((ll) => ll.TranDate === zz.TranDate);
            if (zIndex > -1) {
              tmpData[zIndex].dtlData.push({ ...zz, key: idx + 1 });
            } else {
              tmpData.push({ TranDate: zz.TranDate, dtlData: [] });
              tmpData[tmpData.length - 1].dtlData.push({
                ...zz,
                key: idx + 1,
              });
            }
          });

          let l_ClosingBal = 0;
          tmpData.forEach((gg) => {
            if (!gg.dtlData.find((lk) => lk.DType === "OPN")) {
              gg.dtlData = [
                {
                  AllowModify: "N",
                  Credit: l_ClosingBal > 0 ? Math.abs(l_ClosingBal) : 0,
                  DType: "OPN",
                  Debit: l_ClosingBal < 0 ? Math.abs(l_ClosingBal) : 0,
                  LastModifiedBy: null,
                  LastModifiedOn: null,
                  RefDesc: "Opening Balance",
                  RefNo: "PleaseIgnore",
                  Remark: `Opening Balance as of ${moment(gg.TranDate).format(
                    l_ConfigDateFormat.value1
                  )}`,
                  TranDate: gg.TranDate,
                  TranId: "OPN",
                  TranNo: "0",
                  TranType: "OPNBAL",
                  key: gg.key,
                },
                ...gg.dtlData,
              ];
            }

            gg.dtlData.forEach((rr) => {
              if (rr.RefNo !== "PleaseIgnore") {
                l_ClosingBal += parseFloat(rr.Credit) - parseFloat(rr.Debit);
              }
            });
          });
          setData([...tempArray]);
          setDataGroupByDay([...tmpData]);
        });
      } else if (props.TranType === "CASH") {
        fetchDataCashBookDetails(
          CompCode,
          moment(DateRange[0]).format("YYYY-MM-DD"),
          moment(DateRange[1]).format("YYYY-MM-DD")
        ).then(async (res) => {
          let tempArray = [];
          await res.forEach((row) => {
            let pSource = Object.keys(
              _.groupBy(row.PaymentSource.split(","))
            ).toString();
            tempArray.push({
              ...row,
              PaymentSource: pSource,
            });
          });

          let tmpData = [];
          tempArray.forEach((zz, idx) => {
            let zIndex = tmpData.findIndex((ll) => ll.TranDate === zz.TranDate);
            if (zIndex > -1) {
              tmpData[zIndex].dtlData.push({ ...zz, key: idx + 1 });
            } else {
              tmpData.push({ TranDate: zz.TranDate, dtlData: [] });
              tmpData[tmpData.length - 1].dtlData.push({ ...zz, key: idx + 1 });
            }
          });

          let l_ClosingBal = 0;
          tmpData.forEach((gg, idx) => {
            if (!gg.dtlData.find((lk) => lk.DType === "OPN")) {
              gg.dtlData = [
                {
                  AllowModify: "N",
                  Credit: l_ClosingBal > 0 ? Math.abs(l_ClosingBal) : 0,
                  DType: "OPN",
                  Debit: l_ClosingBal < 0 ? Math.abs(l_ClosingBal) : 0,
                  LastModifiedBy: null,
                  LastModifiedOn: null,
                  RefDesc: "Opening Balance",
                  RefNo: "PleaseIgnore",
                  Remark: `Opening Balance as of ${moment(gg.TranDate).format(
                    l_ConfigDateFormat.value1
                  )}`,
                  TranDate: gg.TranDate,
                  TranId: "OPN",
                  TranNo: "0",
                  TranType: "OPNBAL",
                  key: gg.key,
                },
                ...gg.dtlData,
              ];
            }

            gg.dtlData.forEach((rr) => {
              if (rr.RefNo !== "PleaseIgnore") {
                l_ClosingBal += parseFloat(rr.Credit) - parseFloat(rr.Debit);
              }
            });
          });
          setData(tempArray);
          setDataGroupByDay(tmpData);
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const menu = (record) => {
    return (
      <>
        <Menu>
          <Menu.Item
            disabled={
              record.AllowModify === "N" ||
              (record.TranType === "RCT"
                ? !hasRightToBeUsedNext(userAccessReciept.Rights, "EDIT")
                : record.TranType === "INC"
                ? !hasRightToBeUsedNext(userAccessIncome.Rights, "EDIT")
                : record.TranType === "PMT"
                ? !hasRightToBeUsedNext(userAccessPayment.Rights, "EDIT")
                : record.TranType === "EXPS"
                ? !hasRightToBeUsedNext(userAccessExpense.Rights, "EDIT")
                : record.TranType === "GNRCIN"
                ? !hasRightToBeUsedNext(userAccessGenericIn.Rights, "EDIT")
                : record.TranType === "GNRCOUT"
                ? !hasRightToBeUsedNext(userAccessGenericOut.Rights, "EDIT")
                : "")
            }
            onClick={() => {
              setModal({
                EntryMode: "E",
                TranType: record.TranType,
                TranId: record.TranId,
              });
            }}
          >
            <EditOutlined
              className={`custom-day-book-icon ${
                record.AllowModify === "N" ||
                (record.TranType === "RCT"
                  ? !hasRightToBeUsedNext(userAccessReciept.Rights, "EDIT")
                  : record.TranType === "INC"
                  ? !hasRightToBeUsedNext(userAccessIncome.Rights, "EDIT")
                  : record.TranType === "PMT"
                  ? !hasRightToBeUsedNext(userAccessPayment.Rights, "EDIT")
                  : record.TranType === "EXPS"
                  ? !hasRightToBeUsedNext(userAccessExpense.Rights, "EDIT")
                  : record.TranType === "GNRCIN"
                  ? !hasRightToBeUsedNext(userAccessGenericIn.Rights, "EDIT")
                  : record.TranType === "GNRCOUT"
                  ? !hasRightToBeUsedNext(userAccessGenericOut.Rights, "EDIT")
                  : "")
                  ? "disabled"
                  : "edit-btn"
              } 
              `}
            />{" "}
            Edit
          </Menu.Item>
          <Menu.Item
            disabled={
              record.AllowModify === "N" ||
              (record.TranType === "RCT"
                ? !hasRightToBeUsedNext(userAccessReciept.Rights, "DELETE")
                : record.TranType === "INC"
                ? !hasRightToBeUsedNext(userAccessIncome.Rights, "DELETE")
                : record.TranType === "PMT"
                ? !hasRightToBeUsedNext(userAccessPayment.Rights, "DELETE")
                : record.TranType === "EXPS"
                ? !hasRightToBeUsedNext(userAccessExpense.Rights, "DELETE")
                : record.TranType === "GNRCIN"
                ? !hasRightToBeUsedNext(userAccessGenericIn.Rights, "DELETE")
                : record.TranType === "GNRCOUT"
                ? !hasRightToBeUsedNext(userAccessGenericOut.Rights, "DELETE")
                : false)
            }
            onClick={() => {
              swal("Are you sure you want to delete this record ?", {
                buttons: ["Cancel", "Yes!"],
              }).then(async (val) => {
                if (val) {
                  deleteReceiptAndPayments(
                    CompCode,
                    record.TranType,
                    record.TranId
                  ).then((res) => {
                    setIsRefreshRequired(true);
                  });
                }
              });
            }}
          >
            <DeleteOutlined
              className={`custom-day-book-icon ${
                record.AllowModify === "N" ||
                (record.TranType === "RCT"
                  ? !hasRightToBeUsedNext(userAccessReciept.Rights, "EDIT")
                  : record.TranType === "INC"
                  ? !hasRightToBeUsedNext(userAccessIncome.Rights, "EDIT")
                  : record.TranType === "PMT"
                  ? !hasRightToBeUsedNext(userAccessPayment.Rights, "EDIT")
                  : record.TranType === "EXPS"
                  ? !hasRightToBeUsedNext(userAccessExpense.Rights, "EDIT")
                  : record.TranType === "GNRCIN"
                  ? !hasRightToBeUsedNext(userAccessGenericIn.Rights, "EDIT")
                  : record.TranType === "GNRCOUT"
                  ? !hasRightToBeUsedNext(userAccessGenericOut.Rights, "EDIT")
                  : "")
                  ? "disabled"
                  : "edit-btn"
              } `}
            />
            Delete
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              let dataType = "pdf";
              if (window.electron) {
                dataType = "html";
              }

              getReceiptAndPaymentPdf(
                CompCode,
                record.TranType,
                record.TranId,
                dataType
              ).then((res) => {
                if (res) {
                  PrintPdfOrFromElectron(
                    res,
                    `${record.TranType}-${record.TranId}`,
                    dataType
                  );
                }
              });
            }}
          >
            <DownloadOutlined className="custom-day-book-icon" />
            Download
          </Menu.Item>
        </Menu>
      </>
    );
  };

  const columns = [
    {
      align: "center",
      title: "Tran No.",
      dataIndex: "TranNo",
      width: 120,
      render: (text, record) => {
        return <Text>{record.TranType === "OPNBAL" ? "" : record.TranNo}</Text>;
      },
    },
    {
      align: "left",
      title: "Tran Date",
      dataIndex: "TranDate",
      width: 120,
      render: (text, record) => {
        return (
          <Text>
            {record.DType === "OPN"
              ? ""
              : moment(record.TranDate).format(l_ConfigDateFormat.value1)}
          </Text>
        );
      },
    },
    {
      align: "left",
      title: "Payment Source",
      dataIndex: "PaymentSource",
      width: 180,
      ellipsis: true,
      render: (PaymentSource, record) => {
        return (
          <Text ellipsis={true} className="w-full">
            {PaymentSource}
          </Text>
        );
      },
    },
    {
      align: "left",
      title: "Particulars",
      dataIndex: "RefDesc",
      render: (text, record) => {
        // console.log(record, "daybok");
        return (
          <Text>
            {record.RefDesc} {record.Remark ? `(${record.Remark})` : ""}
          </Text>
        );
      },
    },
    {
      align: "right",
      title: `Credit (${l_ConfigCurrency.value1})`,
      dataIndex: "Credit",
      width: 100,
      render: (text, record) => {
        return (
          <Text type="success" strong>
            {parseFloat(record.Credit) !== 0
              ? (
                  record.Credit /
                  parseFloat(l_ConfigDayBookValueDivisibleBy.value1)
                ).toFixed(2)
              : "-"}
          </Text>
        );
      },
    },
    {
      align: "right",
      title: `Debit (${l_ConfigCurrency.value1})`,
      dataIndex: "Debit",
      width: 100,
      render: (text, record) => {
        return (
          <Text type="danger" strong>
            {parseFloat(record.Debit) !== 0
              ? (
                  record.Debit /
                  parseFloat(l_ConfigDayBookValueDivisibleBy.value1)
                ).toFixed(2)
              : "-"}
          </Text>
        );
      },
    },
    {
      align: "center",
      dataIndex: "",
      key: "x",
      width: 100,
      render: (text, record) => {
        return (
          <>
            {record.TranType !== "OPNBAL" && (
              <>
                <Tooltip title="VIEW">
                  <Button
                    icon={<EyeOutlined className="custom-day-book-icon" />}
                    style={{
                      marginRight: 3,
                      height: 22,
                      width: 22,
                      borderRadius: "50%",
                      fontSize: 12,
                    }}
                    type="secondary"
                    size="small"
                    onClick={() => {
                      setDrawerShow({
                        TranType: record.TranType,
                        VoucherId: record.TranId,
                        visible: true,
                      });
                      // getReceiptAndPaymentPdf(
                      //   record.TranType,
                      //   record.TranId,
                      //   "json"
                      // ).then((res) => {
                      //   if (res) {
                      //   }
                      // });
                    }}
                  />
                </Tooltip>
                <Tooltip title="PRINT">
                  <Button
                    icon={<DownloadOutlined className="custom-day-book-icon" />}
                    style={{
                      marginRight: 3,
                      height: 22,
                      width: 22,
                      borderRadius: "50%",
                      fontSize: 12,
                    }}
                    type="secondary"
                    size="small"
                    onClick={() => {
                      let dataType = "pdf";
                      if (window.electron) {
                        dataType = "html";
                      }
                      if (record.TranType === "TRNFR") {
                        getTransferPdf(
                          CompCode,
                          record.TranType,
                          record.TranId,
                          "PDF"
                        ).then((res) => {
                          if (res) {
                            PrintPdfOrFromElectron(
                              res,
                              `${record.TranType}-${record.TranId}`,
                              dataType
                            );
                          }
                        });
                      } else {
                        getReceiptAndPaymentPdf(
                          CompCode,
                          record.TranType,
                          record.TranId,
                          "PDF"
                        ).then((res) => {
                          if (res) {
                            PrintPdfOrFromElectron(
                              res,
                              `${record.TranType}-${record.TranId}`,
                              dataType
                            );
                          }
                        });
                      }
                    }}
                  />
                </Tooltip>
                <Dropdown overlay={menu(record)} placement="bottomLeft" arrow>
                  <Button
                    className="custom-day-book-setting"
                    icon={
                      <SettingOutlined className="custom-day-book-icon custom-day-book-setting" />
                    }
                    style={{
                      marginRight: 3,
                      height: 22,
                      width: 22,
                      borderRadius: "50%",
                      fontSize: 12,
                    }}
                    type="secondary"
                    size="small"
                    onClick={() => {}}
                  />
                </Dropdown>
              </>
            )}
          </>
        );
      },
    },
  ];

  const CardHeader = (props) => {
    return (
      <>
        <div
          className="custom-day-book-card-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 10px",
            fontSize: 15,
            background: "#FFFFFF",
            border: "1px solid #f0f0f0",
          }}
        >
          <span style={{}}>
            <Title level={4} style={{ margin: 0, fontSize: 16 }}>
              {props.title}
            </Title>
          </span>
        </div>
      </>
    );
  };

  return (
    <>
      <CardHeader title={currentTran.formTitle} />
      <Card bodyStyle={{ padding: 5 }} style={{ height: "50%" }}>
        <div
          className="card-receipt-payment"
          style={{
            display: "flex",
            // justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <div
              style={{
                padding: "0px 0px 0px 0px",
                color: "#000",
                alignSelf: "center",
              }}
              className="hidden"
            >
              Select Date :
            </div>
            <RangePicker
              size="small"
              style={{ marginRight: 5 }}
              onChange={(val, aa) => {
                setDateRange(val !== null ? [...val] : [null, null]);
              }}
              format={l_ConfigDateFormat.value1}
              defaultValue={DateRange}
            />
            <Button
              type="primary"
              size="small"
              icon={<SearchOutlined />}
              onClick={() => {
                if (
                  _.includes([null, ""], DateRange[0]) ||
                  _.includes([null, ""], DateRange[1])
                ) {
                  message.error("Please Select Date Range");
                } else {
                  setIsLoading(true);
                  fnDefault();
                }
              }}
            >
              Search
            </Button>
            <Button
              type="primary"
              size="small"
              style={{ marginLeft: 5 }}
              icon={<CloudDownloadOutlined />}
              onClick={() => {
                if (
                  _.includes([null, ""], DateRange[0]) ||
                  _.includes([null, ""], DateRange[1])
                ) {
                  message.error("Please Select Date Range");
                } else {
                  setIsLoading(true);
                  let dataType = "pdf";
                  if (window.electron) {
                    dataType = "html";
                  }
                  getDayBookPdf(
                    CompCode,
                    moment(DateRange[0]).format("YYYY-MM-DD"),
                    moment(DateRange[1]).format("YYYY-MM-DD"),
                    dataType
                  ).then((res) => {
                    PrintPdfOrFromElectron(
                      res,
                      `DayBook-${moment(DateRange[0]).format(
                        "YYYY-MM-DD"
                      )}-${moment(DateRange[1]).format("YYYY-MM-DD")}`,
                      dataType
                    );
                    setIsLoading(false);
                  });
                }
              }}
            >
              Download
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              padding: "0px 3px",
              flex: 1,
              // marginTop: 2,
            }}
          >
            <Button
              icon={<PlusCircleOutlined />}
              style={{ marginRight: 5 }}
              disabled={!hasRightToBeUsedNext(userAccessIncome.Rights, "ADD")}
              size="small"
              type="primary"
              onClick={() => {
                setModal({ EntryMode: "A", TranType: "INC", TranId: 0 });
              }}
            >
              Add Income
            </Button>
            <Button
              icon={<PlusCircleOutlined />}
              disabled={!hasRightToBeUsedNext(userAccessExpense.Rights, "ADD")}
              size="small"
              type="primary"
              style={{ marginRight: 5 }}
              onClick={() => {
                setModal({ EntryMode: "A", TranType: "EXPS", TranId: 0 });
              }}
            >
              Add Expense
            </Button>
            <Button
              icon={<PlusCircleOutlined />}
              disabled={!hasRightToBeUsedNext(userAccessReciept.Rights, "ADD")}
              size="small"
              type="primary"
              style={{ marginRight: 5 }}
              onClick={() => {
                setModal({ EntryMode: "A", TranType: "RCT", TranId: 0 });
              }}
            >
              Add Reciept
            </Button>
            <Button
              icon={<PlusCircleOutlined />}
              disabled={!hasRightToBeUsedNext(userAccessPayment.Rights, "ADD")}
              size="small"
              type="primary"
              style={{ marginRight: 5 }}
              onClick={() => {
                setModal({ EntryMode: "A", TranType: "PMT", TranId: 0 });
              }}
            >
              Add Payment
            </Button>
            {/* </Col> */}
            {/* <Col flex={1} style={{ marginRight: 5 }}> */}
            <Button
              icon={<PlusCircleOutlined />}
              disabled={
                !hasRightToBeUsedNext(userAccessGenericIn.Rights, "ADD")
              }
              size="small"
              type="primary"
              style={{ marginRight: 5 }}
              onClick={() => {
                setModal({ EntryMode: "A", TranType: "GNRCIN", TranId: 0 });
              }}
            >
              Add Generic-In
            </Button>
            <Button
              icon={<PlusCircleOutlined />}
              disabled={
                !hasRightToBeUsedNext(userAccessGenericOut.Rights, "ADD")
              }
              size="small"
              type="primary"
              style={{ marginRight: 5 }}
              onClick={() => {
                setModal({ EntryMode: "A", TranType: "GNRCOUT", TranId: 0 });
              }}
            >
              Add Generic-Out
            </Button>
          </div>
        </div>

        {l_ConfigEnableDayBookDayWiseGrouping.value1 === "Y" &&
          dataGroupByDay.map((dataWiseData, idx) => {
            return (
              <div
                key={idx}
                style={{
                  border: "2px inset var(--app-theme-color)",
                  padding: "5px 5px",
                  margin: "0px 0px 5px 0px",
                  backgroundColor: "#fff",
                }}
              >
                <Table
                  key={idx}
                  loading={isLoading}
                  columns={columns}
                  bordered={true}
                  dataSource={dataWiseData.dtlData}
                  className="receipt-payment-table"
                  pagination={false}
                  summary={(pageData) => {
                    let totalCreditAmount = 0;
                    let totalDebitAmount = 0;
                    let closingBalDebit = 0;
                    let closingBalCredit = 0;

                    if (pageData.length > 0) {
                      pageData.forEach(({ Credit, Debit }) => {
                        totalCreditAmount += parseFloat(Credit);
                        totalDebitAmount += parseFloat(Debit);
                      });
                    }

                    if (totalCreditAmount - totalDebitAmount > 0) {
                      closingBalCredit = totalCreditAmount - totalDebitAmount;
                    } else {
                      closingBalDebit = totalDebitAmount - totalCreditAmount;
                    }

                    return (
                      <>
                        <Table.Summary.Row>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Text strong>
                              Total ({l_ConfigCurrency.value1})
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell className="custom-table-summary-amount">
                            <Text strong>
                              {(
                                totalCreditAmount /
                                parseFloat(
                                  l_ConfigDayBookValueDivisibleBy.value1
                                )
                              ).toFixed(2)}
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell className="custom-table-summary-amount">
                            <Text strong>
                              {(
                                totalDebitAmount /
                                parseFloat(
                                  l_ConfigDayBookValueDivisibleBy.value1
                                )
                              ).toFixed(2)}
                            </Text>
                          </Table.Summary.Cell>{" "}
                          <Table.Summary.Cell></Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Text strong>
                              Closing Balance ({l_ConfigCurrency.value1})
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell className="custom-table-summary-amount">
                            <Text strong>
                              {(
                                closingBalCredit /
                                parseFloat(
                                  l_ConfigDayBookValueDivisibleBy.value1
                                )
                              ).toFixed(2)}
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell className="custom-table-summary-amount">
                            <Text strong>
                              {(
                                closingBalDebit /
                                parseFloat(
                                  l_ConfigDayBookValueDivisibleBy.value1
                                )
                              ).toFixed(2)}
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    );
                  }}
                />

                <DayBookClosingBalance
                  key={idx}
                  TranDate={dataWiseData.TranDate}
                  IsRefresh={isClosingBalanceRefresh}
                />
              </div>
            );
          })}

        {l_ConfigEnableDayBookDayWiseGrouping.value1 === "N" && (
          <div
            style={{
              border: "2px inset var(--app-theme-color)",
              padding: "5px 5px",
              margin: "0px 0px 5px 0px",
              backgroundColor: "#fff",
            }}
          >
            <Table
              loading={isLoading}
              columns={columns}
              bordered={true}
              dataSource={data}
              className="receipt-payment-table"
              pagination={false}
              summary={(pageData) => {
                let totalCreditAmount = 0;
                let totalDebitAmount = 0;
                let closingBalDebit = 0;
                let closingBalCredit = 0;

                if (pageData.length > 0) {
                  pageData.forEach(({ Credit, Debit }) => {
                    totalCreditAmount += parseFloat(Credit);
                    totalDebitAmount += parseFloat(Debit);
                  });
                }

                if (totalCreditAmount - totalDebitAmount > 0) {
                  closingBalCredit = totalCreditAmount - totalDebitAmount;
                } else {
                  closingBalDebit = totalDebitAmount - totalCreditAmount;
                }

                return (
                  <>
                    <Table.Summary.Row>
                      {/* total */}
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong>Total ({l_ConfigCurrency.value1})</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell className="custom-table-summary-amount">
                        <Text strong>
                          {(
                            totalCreditAmount /
                            parseFloat(l_ConfigDayBookValueDivisibleBy.value1)
                          ).toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell className="custom-table-summary-amount">
                        <Text strong>
                          {(
                            totalDebitAmount /
                            parseFloat(l_ConfigDayBookValueDivisibleBy.value1)
                          ).toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    {/* CB */}
                    <Table.Summary.Row>
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell></Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong>
                          Closing Balance ({l_ConfigCurrency.value1})
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell className="custom-table-summary-amount">
                        <Text strong>
                          {(
                            closingBalCredit /
                            parseFloat(l_ConfigDayBookValueDivisibleBy.value1)
                          ).toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell className="custom-table-summary-amount">
                        <Text strong>
                          {(
                            closingBalDebit /
                            parseFloat(l_ConfigDayBookValueDivisibleBy.value1)
                          ).toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
            <DayBookClosingBalance
              TranDate={DateRange[0]}
              IsRefresh={isClosingBalanceRefresh}
            />
          </div>
        )}

        <Drawer
          placement="right"
          closable={true}
          width={window.innerWidth > 800 ? "50%" : "100%"}
          bodyStyle={{ padding: 0 }}
          destroyOnClose={true}
          onClose={() => {
            setDrawerShow({
              TranType: props.TranType,
              VoucherId: null,
              visible: false,
            });
          }}
          visible={DrawerShow.visible}
        >
          <ViewableDayBookComp
            VoucherId={DrawerShow.VoucherId}
            TranType={DrawerShow.TranType}
            onClose={() => {
              setDrawerShow({
                TranType: props.TranType,
                VoucherId: null,
                visible: false,
              });
            }}
            PrintStatus={PrintStatus}
            onPrintClick={() => {
              let dataType = "pdf";
              if (window.electron) {
                dataType = "html";
              }
              setPrintStatus(true);
              if (DrawerShow.TranType === "TRNFR") {
                getTransferPdf(
                  CompCode,
                  DrawerShow.TranType,
                  DrawerShow.VoucherId,
                  dataType
                ).then((res) => {
                  if (res) {
                    PrintPdfOrFromElectron(
                      res,
                      `${DrawerShow.TranType}-${DrawerShow.TranId}`,
                      dataType
                    );

                    setPrintStatus(false);
                  }
                });
              } else {
                getReceiptAndPaymentPdf(
                  CompCode,
                  DrawerShow.TranType,
                  DrawerShow.VoucherId,
                  dataType
                ).then((res) => {
                  if (res) {
                    PrintPdfOrFromElectron(
                      res,
                      `${DrawerShow.TranType}-${DrawerShow.TranId}`,
                      dataType
                    );
                    setPrintStatus(false);
                  }
                });
              }
            }}
          />
        </Drawer>

        {modal.EntryMode && (
          <Modal
            closable={true}
            visible={modal}
            onCancel={() =>
              setModal({
                EntryMode: "",
                TranType: "",
                TranId: 0,
              })
            }
            maskClosable={false}
            footer={null}
            width={"75%"}
            bodyStyle={{ padding: 0 }}
            destroyOnClose={true}
          >
            <div style={{ height: 40 }}> </div>
            <ReceiptAndPaymentCard
              EntryMode={modal.EntryMode}
              TranType={modal.TranType}
              TranId={modal.TranId}
              onBackPress={() => {
                setModal({
                  EntryMode: "",
                  TranType: "",
                  TranId: 0,
                });
              }}
              onSavePress={() => {
                setModal({
                  EntryMode: "",
                  TranType: "",
                  TranId: 0,
                });
                fnDefault();
                setIsClosingBalanceRefresh(!isClosingBalanceRefresh);
              }}
            />
          </Modal>
        )}
      </Card>
    </>
  );
};

export default DayBookPage;
