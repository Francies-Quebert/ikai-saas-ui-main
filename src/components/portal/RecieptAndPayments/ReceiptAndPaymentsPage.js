import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  DatePicker,
  Button,
  Empty,
  Table,
  Spin,
  Input,
  Typography,
  Popconfirm,
  Row,
  Col,
  message,
  Select,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditTwoTone,
  DeleteTwoTone,
  PrinterOutlined,
} from "@ant-design/icons";
import moment from "moment";
import fileDownload from "js-file-download";
import CardHeader from "../../common/CardHeader";
import _ from "lodash";
import ReceiptAndPaymentsCard from "./ReceiptAndPaymentCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import {
  fetchReceiptAndPayments,
  deleteReceiptAndPayments,
  getReceiptAndPaymentPdf,
} from "../../../services/receipts-payments";
import {
  hasRight,
  hasRightToBeUsedNext,
  PrintPdfOrFromElectron,
} from "../../../shared/utility";
import swal from "sweetalert";
import { fetchReceiptAndPaymentReferenceHelp } from "../../../services/receipts-payments";
const { RangePicker } = DatePicker;
const ReceiptAndPaymentsPage = (props) => {
  const { Option } = Select;
  const { Text, Paragraph } = Typography;
  const dispatch = useDispatch();
  const [aeData, setAEData] = useState({
    EntryMode: "",
    TranType: props.TranType,
    TranId: 0,
  });
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
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [DateRange, setDateRange] = useState([
    moment(new Date()),
    moment(new Date()),
  ]);
  // const [isAllowModification, setIsAllowModification] = useState();
  const currentTran = useSelector((state) => state.currentTran);
  const [helpRef, setHelpRef] = useState([]);

  const [formData, setFormData] = useState({
    RefCode: null,
  });
  const [data, setData] = useState([]);
  const [isRefreshRequired, setIsRefreshRequired] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    //Set Form Caption
    dispatch(
      setFormCaption(
        props.TranType === "PMT"
          ? 97
          : props.TranType === "EXPS"
          ? 99
          : props.TranType === "RCT"
          ? 98
          : props.TranType === "INC"
          ? 100
          : props.TranType === "GNRCIN"
          ? 123
          : props.TranType === "GNRCOUT"
          ? 124
          : 0
      )
    );
    //Fetch Data
    fetchReceiptAndPaymentReferenceHelp(CompCode).then((res) => {
      setHelpRef(
        res.filter((rr) =>
          props.TranType === "RCT" ||
          props.TranType === "PMT" ||
          props.TranType === "GNRCIN" ||
          props.TranType === "GNRCOUT"
            ? rr.DataSetType === "PARTY"
            : props.TranType === "EXPS"
            ? rr.UserType === "EXPS"
            : props.TranType === "INC"
            ? rr.UserType === "INC"
            : rr.DataSetType !== "PARTY"
        )
      );
    });
    fetchReceiptAndPayments(
      CompCode,
      props.TranType,
      moment(DateRange[0]).format("YYYY-MM-DD"),
      moment(DateRange[1]).format("YYYY-MM-DD")
    ).then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchReceiptAndPayments(
      CompCode,
      props.TranType,
      moment(DateRange[0]).format("YYYY-MM-DD"),
      moment(DateRange[1]).format("YYYY-MM-DD")
    ).then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, [isRefreshRequired]);

  const columns = [
    {
      align: "center",
      title:
        props.TranType === "PMT"
          ? "Payment Id"
          : props.TranType === "EXPS"
          ? "Expense Id"
          : props.TranType === "RCT"
          ? "Receipt Id"
          : props.TranType === "INC"
          ? "Income Id"
          : "#",
      dataIndex: "TranId",
      key: "TranId",
      width: 80,
      render: (text, record, idx) => {
        return <Text>{idx + 1}</Text>;
      },
    },
    {
      align: "left",
      title: "Tran No",
      dataIndex: "TranNo",
      width: 80,
    },
    {
      align: "center",
      title:
        props.TranType === "PMT"
          ? "Payment Date"
          : props.TranType === "EXPS"
          ? "Expense Date"
          : props.TranType === "RCT"
          ? "Receipt Date"
          : props.TranType === "INC"
          ? "Income Date"
          : "Tran Date",
      dataIndex: "TranDate",
      width: 100,
      render: (text, record) => {
        return (
          <Text>
            {moment(record.TranDate).format(l_ConfigDateFormat.value1)}
          </Text>
        );
      },
    },
    {
      align: "left",
      title:
        props.TranType === "PMT"
          ? "Party Name"
          : props.TranType === "EXPS"
          ? "Expense Group"
          : props.TranType === "RCT"
          ? "Customer Name"
          : props.TranType === "INC"
          ? "Income Group"
          : "Party",
      dataIndex: "RefDesc",
      width: 120,
    },
    {
      align: "left",
      title: "Remarks",
      dataIndex: "Remark",

      render: (text, record) => {
        return <span style={{}}>{record.Remark}</span>;
      },
    },
    {
      align: "right",
      title: `Amount (${l_ConfigCurrency.value1})`,
      dataIndex: "Amount",
      width: 100,
      render: (text, record) => {
        return <Text strong>{record.Amount}</Text>;
      },
    },
    {
      align: "left",
      title: "Last Modified By",
      dataIndex: "LastModifiedBy",
      width: 150,
    },
    {
      align: "left",
      title: "Last Modified On",
      dataIndex: "LastModifiedOn",
      width: 180,
      render: (text, record) => {
        return (
          <Text code>
            {moment(record.LastModifiedOn).format(
              l_ConfigDateTimeFormat.value1
            )}
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
            <a
              href="#"
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
              style={{ marginRight: 5 }}
            >
              <PrinterOutlined />
            </a>

            <a
              href="#"
              onClick={() => {
                //   setAEData({ entryMode: "E", data: record });
                setAEData({
                  EntryMode: "E",
                  TranType: props.TranType,
                  TranId: record.TranId,
                });
                // setIsAllowModification(
                //   record.AllowModify === "Y" ? false : true
                // );
              }}
              style={{ marginRight: 5 }}
              className={`              ${
                !hasRightToBeUsedNext(currentTran.moduleRights, "EDIT") ||
                record.AllowModify !== "Y"
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={
                !hasRightToBeUsedNext(currentTran.moduleRights, "EDIT") ||
                record.AllowModify !== "Y"
              }
            >
              <EditTwoTone />
            </a>
            <a
              href="#"
              style={{}}
              onClick={() => {
                swal("Are you sure you want to delete this record ?", {
                  buttons: ["Cancel", "Yes!"],
                }).then(async (val) => {
                  if (val) {
                    // await mapData(resp);
                    // setIsLoadingData(false);
                    deleteReceiptAndPayments(
                      CompCode,
                      record.TranType,
                      record.TranId
                    ).then((res) => {
                      setIsRefreshRequired(!isRefreshRequired);
                    });
                  }
                });
              }}
              className={`${
                !hasRightToBeUsedNext(currentTran.moduleRights, "DELETE") ||
                record.AllowModify !== "Y"
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={
                !hasRightToBeUsedNext(currentTran.moduleRights, "DELETE") ||
                record.AllowModify !== "Y"
              }
            >
              <DeleteTwoTone />
            </a>
          </>
        );
      },
    },
  ];

  const size = "small";
  function sum() {
    let total = 0;
    data.forEach((aa) => {
      total = parseFloat(aa.Amount) + parseFloat(total);
    });
    return total.toFixed(3);
  }
  return (
    <>
      {aeData.EntryMode === "" && (
        <>
          <CardHeader
            title={
              props.TranType === "PMT"
                ? "Payments"
                : props.TranType === "EXPS"
                ? "Expenses"
                : props.TranType === "RCT"
                ? "Receipt"
                : props.TranType === "INC"
                ? "Income"
                : props.TranType === "GNRCIN"
                ? "Generic In"
                : props.TranType === "GNRCOUT"
                ? "Generic Out"
                : ""
            }
          />
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
                <Select
                  showSearch
                  style={{ minWidth: "180px", margin: "0px 5px" }}
                  placeholder={`Select ${
                    props.TranType === "PMT" || props.TranType === "RCT"
                      ? "Party"
                      : "Category"
                  }`}
                  onChange={(val) => {
                    setFormData({ ...formData, RefCode: val });
                  }}
                  value={formData.RefCode}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  size="small"
                >
                  <Option value={null}>All</Option>
                  {helpRef.map((pp) => {
                    return (
                      <Option key={pp.RefId} value={pp.RefId}>
                        {`${pp.RefName} ${
                          pp.DataSetType === "PARTY" ? `(${pp.AddInfo})` : ""
                        }`}
                      </Option>
                    );
                  })}
                </Select>
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
                      fetchReceiptAndPayments(
                        CompCode,
                        props.TranType,
                        moment(DateRange[0]).format("YYYY-MM-DD"),
                        moment(DateRange[1]).format("YYYY-MM-DD")
                      ).then((res) => {
                        setData(
                          res.filter((aa) => {
                            return formData.RefCode === null
                              ? true
                              : aa.RefNo === formData.RefCode;
                          })
                        );
                        setIsLoading(false);
                      });
                    }
                  }}
                >
                  Search
                </Button>
              </div>
              <div style={{ display: "flex", padding: "0px 3px" }}>
                <Button
                  icon={<PlusOutlined />}
                  disabled={hasRight(currentTran.moduleRights, "ADD")}
                  size="small"
                  type="primary"
                  onClick={() => {
                    setAEData({
                      EntryMode: "A",
                      TranType: props.TranType,
                      TranId: 0,
                    });
                  }}
                >
                  Add &nbsp;
                  {props.TranType === "PMT"
                    ? "Payments"
                    : props.TranType === "EXPS"
                    ? "Expenses"
                    : props.TranType === "RCT"
                    ? "Receipt"
                    : props.TranType === "INC"
                    ? "Income"
                    : props.TranType === "GNRCIN"
                    ? "Generic In"
                    : props.TranType === "GNRCOUT"
                    ? "Generic Out"
                    : ""}
                </Button>
              </div>
            </div>
            {aeData.EntryMode === "" && (
              <div className="relative">
                <Table
                  loading={isLoading}
                  columns={columns}
                  bordered={true}
                  dataSource={data}
                  className="custom-pagination"
                  pagination={true}
                  pagination={{
                    defaultPageSize: 20,
                    size: "small",
                    showSizeChanger: true,
                  }}
                />
                {data.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 7,
                      left: 10,
                      display: "flex",
                    }}
                  >
                    <div className="mr-4">
                      Count :{" "}
                      <span className="font-semibold">{data.length}</span>
                    </div>
                    <div>
                      Total Amount :{" "}
                      <span className="font-semibold">
                        {l_ConfigCurrency.value1} {sum()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </>
      )}

      {aeData.EntryMode !== "" && (
        <Col lg={14} xs={24}>
          <ReceiptAndPaymentsCard
            EntryMode={aeData.EntryMode}
            TranType={aeData.TranType}
            TranId={aeData.TranId}
            onBackPress={() => {
              setAEData({
                EntryMode: "",
                TranType: props.TranType,
                TranId: 0,
              });
            }}
            // allowModify={isAllowModification}
            onSavePress={() => {
              setAEData({
                EntryMode: "",
                TranType: props.TranType,
                TranId: 0,
              });
              fetchReceiptAndPayments(
                CompCode,
                props.TranType,
                moment(DateRange[0]).format("YYYY-MM-DD"),
                moment(DateRange[1]).format("YYYY-MM-DD")
              ).then((res) => {
                setData(res);
                setIsLoading(false);
              });
            }}
          />
        </Col>
      )}
    </>
  );
};

export default ReceiptAndPaymentsPage;
