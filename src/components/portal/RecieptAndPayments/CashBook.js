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
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import { setFormCaption } from "../../../store/actions/currentTran";
import {
  hasRightToBeUsedNext,
  PrintPdfOrFromElectron,
} from "../../../shared/utility";
import { fetchDataCashBookDetails } from "../../../services/day-book";
import {
  deleteReceiptAndPayments,
  getReceiptAndPaymentPdf,
} from "../../../services/receipts-payments";
import { getCashBookPdf } from "../../../services/day-book";

import ReceiptAndPaymentCard from "./ReceiptAndPaymentCard";
import fileDownload from "js-file-download";
import swal from "sweetalert";
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const CashBook = () => {
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
  const [DateRange, setDateRange] = useState([
    // moment("2020-12-28"),
    // moment("2020-12-28"),
    moment(),
    moment(),
  ]);
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

  const [modal, setModal] = useState({
    EntryMode: "",
    TranType: "",
    TranId: 0,
  });
  const [data, setData] = useState([]);
  const [isRefreshRequired, setIsRefreshRequired] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    //Set Form Caption
    dispatch(setFormCaption(102));
    //Fetch Data
    fetchDataCashBookDetails(
      moment(DateRange[0]).format("YYYY-MM-DD"),
      moment(DateRange[1]).format("YYYY-MM-DD")
    ).then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchDataCashBookDetails(
      moment(DateRange[0]).format("YYYY-MM-DD"),
      moment(DateRange[1]).format("YYYY-MM-DD")
    ).then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, [isRefreshRequired]);

  const menu = (record) => {
    return (
      <>
        <Menu>
          <Menu.Item
            disabled={
              record.TranType === "RCT"
                ? !hasRightToBeUsedNext(userAccessReciept.Rights, "EDIT")
                : record.TranType === "INC"
                ? !hasRightToBeUsedNext(userAccessIncome.Rights, "EDIT")
                : record.TranType === "PMT"
                ? !hasRightToBeUsedNext(userAccessPayment.Rights, "EDIT")
                : record.TranType === "EXPS"
                ? !hasRightToBeUsedNext(userAccessExpense.Rights, "EDIT")
                : ""
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
                record.TranType === "RCT"
                  ? !hasRightToBeUsedNext(userAccessReciept.Rights, "EDIT")
                    ? `disabled`
                    : `edit-btn`
                  : record.TranType === "INC"
                  ? !hasRightToBeUsedNext(userAccessIncome.Rights, "EDIT")
                    ? `disabled`
                    : `edit-btn`
                  : record.TranType === "PMT"
                  ? !hasRightToBeUsedNext(userAccessPayment.Rights, "EDIT")
                    ? `disabled`
                    : `edit-btn`
                  : record.TranType === "EXPS"
                  ? !hasRightToBeUsedNext(userAccessExpense.Rights, "EDIT")
                    ? `disabled`
                    : `edit-btn`
                  : ""
              } `}
            />{" "}
            Edit
          </Menu.Item>
          <Menu.Item
            disabled={
              record.TranType === "RCT"
                ? !hasRightToBeUsedNext(userAccessReciept.Rights, "DELETE")
                : record.TranType === "INC"
                ? !hasRightToBeUsedNext(userAccessIncome.Rights, "DELETE")
                : record.TranType === "PMT"
                ? !hasRightToBeUsedNext(userAccessPayment.Rights, "DELETE")
                : record.TranType === "EXPS"
                ? !hasRightToBeUsedNext(userAccessExpense.Rights, "DELETE")
                : ""
            }
            onClick={() => {
              swal("Are you sure you want to delete this record ?", {
                buttons: ["Cancel", "Yes!"],
              }).then(async (val) => {
                if (val) {
                  deleteReceiptAndPayments(record.TranType, record.TranId).then(
                    (res) => {
                      setIsRefreshRequired(!isRefreshRequired);
                    }
                  );
                }
              });
            }}
          >
            <DeleteOutlined
              className={`custom-day-book-icon ${
                record.TranType === "RCT"
                  ? !hasRightToBeUsedNext(userAccessReciept.Rights, "DELETE")
                    ? `disabled`
                    : `edit-btn`
                  : record.TranType === "INC"
                  ? !hasRightToBeUsedNext(userAccessIncome.Rights, "DELETE")
                    ? `disabled`
                    : `edit-btn`
                  : record.TranType === "PMT"
                  ? !hasRightToBeUsedNext(userAccessPayment.Rights, "DELETE")
                    ? `disabled`
                    : `edit-btn`
                  : record.TranType === "EXPS"
                  ? !hasRightToBeUsedNext(userAccessExpense.Rights, "DELETE")
                    ? `disabled`
                    : `edit-btn`
                  : ""
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
      title: "Particulars",
      dataIndex: "RefDesc",
      width: 0,
      render: (text, record) => {
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
            {parseFloat(record.Credit) !== 0 ? record.Credit : "-"}
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
            {parseFloat(record.Debit) !== 0 ? record.Debit : "-"}
          </Text>
        );
      },
    },
    {
      align: "center",
      dataIndex: "",
      key: "x",
      width: 80,
      render: (text, record) => {
        return (
          <>
            {record.TranType !== "OPNBAL" && (
              <>
                <Tooltip title="View">
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
                      let dataType = "pdf";
                      if (window.electron) {
                        dataType = "html";
                      }

                      getReceiptAndPaymentPdf(
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
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                padding: "0px 8px 0px 0px",
                color: "#000",
                alignSelf: "center",
              }}
            >
              Select Date Range :
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
                  fetchDataCashBookDetails(
                    moment(DateRange[0]).format("YYYY-MM-DD"),
                    moment(DateRange[1]).format("YYYY-MM-DD")
                  ).then((res) => {
                    setData(res);
                    setIsLoading(false);
                  });
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
                  getCashBookPdf(
                    moment(DateRange[0]).format("YYYY-MM-DD"),
                    moment(DateRange[1]).format("YYYY-MM-DD"),
                    dataType
                  ).then((res) => {
                    PrintPdfOrFromElectron(
                      res,
                      `Cash Book-${moment(DateRange[0]).format(
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
          <div style={{ display: "flex", padding: "0px 3px" }}>
            <Col flex={1} style={{ marginRight: 5 }}>
              <Button
                icon={<PlusCircleOutlined />}
                style={{}}
                disabled={!hasRightToBeUsedNext(userAccessIncome.Rights, "ADD")}
                size="small"
                type="primary"
                onClick={() => {
                  setModal({ EntryMode: "A", TranType: "INC", TranId: 0 });
                }}
              >
                Add Income
              </Button>
            </Col>
            <Col flex={1} style={{ marginRight: 5 }}>
              <Button
                icon={<PlusCircleOutlined />}
                disabled={
                  !hasRightToBeUsedNext(userAccessExpense.Rights, "ADD")
                }
                size="small"
                type="primary"
                onClick={() => {
                  setModal({ EntryMode: "A", TranType: "EXPS", TranId: 0 });
                }}
              >
                Add Expense
              </Button>
            </Col>
            <Col flex={1} style={{ marginRight: 5 }}>
              <Button
                icon={<PlusCircleOutlined />}
                disabled={
                  !hasRightToBeUsedNext(userAccessReciept.Rights, "ADD")
                }
                size="small"
                type="primary"
                onClick={() => {
                  setModal({ EntryMode: "A", TranType: "RCT", TranId: 0 });
                }}
              >
                Add Reciept
              </Button>
            </Col>
            <Col flex={1} style={{ marginRight: 5 }}>
              <Button
                icon={<PlusCircleOutlined />}
                disabled={
                  !hasRightToBeUsedNext(userAccessPayment.Rights, "ADD")
                }
                size="small"
                type="primary"
                onClick={() => {
                  setModal({ EntryMode: "A", TranType: "PMT", TranId: 0 });
                }}
              >
                Add Payment
              </Button>
            </Col>
            <Col></Col>
          </div>
        </div>
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
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>Total ({l_ConfigCurrency.value1})</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className="custom-table-summary-amount">
                    <Text strong>{totalCreditAmount.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className="custom-table-summary-amount">
                    <Text strong>{totalDebitAmount.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>
                      Closing Balance ({l_ConfigCurrency.value1})
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className="custom-table-summary-amount">
                    <Text strong>{closingBalCredit.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className="custom-table-summary-amount">
                    <Text strong>{closingBalDebit.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
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
                fetchDataCashBookDetails(
                  moment(DateRange[0]).format("YYYY-MM-DD"),
                  moment(DateRange[1]).format("YYYY-MM-DD")
                ).then((res) => {
                  setData(res);
                  setIsLoading(false);
                });
              }}
            />
          </Modal>
        )}
      </Card>
    </>
  );
};

export default CashBook;
