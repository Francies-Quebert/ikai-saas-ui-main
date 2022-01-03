import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
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
} from "antd";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { hasRight } from "../../../shared/utility";
import CardHeader from "../../common/CardHeader";
import { getPaymentHdrData } from "../../../services/payment-master";
import PaymentMasterHdrCard from "./PaymentMaster/PaymentMasterHdrCard";
import { fetchPaymodeMaster } from "../../../store/actions/paymodemaster";

const PaymentMasterPage = () => {
  const dispatch = useDispatch();
  const { Text } = Typography;
  const [isLoading, setIsLoading] = useState(false);
  const [paramData, setParamData] = useState({
    fromDate: null,
    toDate: null,
    paymentNo: null,
  });
  const [tableData, setTableData] = useState([]);
  const [aeData, setAEData] = useState();
  const l_IncomeMaster = useSelector((state) => state.AppMain.incomeMaster);
  const l_ExpenseMaster = useSelector((state) => state.AppMain.expenseMaster);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const currentTran = useSelector((state) => state.currentTran);

  useEffect(() => {
    dispatch(setFormCaption(96));
    dispatch(fetchPaymodeMaster());
    fnDefault();
  }, []);

  const disableAction = (record) => {
    return moment(new moment()).format("YYYY-MM-DD") !==
      moment(record.ReceiptDate).format("YYYY-MM-DD")
      ? true
      : false;
  };

  const fnDefault = (values) => {
    try {
      setIsLoading(true);
      getPaymentHdrData(
        paramData.fromDate
          ? paramData.fromDate.format("YYYY-MM-DD")
          : "2020-12-01",
        paramData.toDate
          ? paramData.toDate.format("YYYY-MM-DD")
          : moment(new moment()).format("YYYY-MM-DD"),
        paramData.paymentNo ? paramData.paymentNo : null
      ).then((res) => {
        if (res.length > 0) {
          setTableData(res);
        } else {
          setTableData([]);
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      align: "center",
      title: "Payment Id",
      dataIndex: "PaymentId",
      width: "8%",
    },
    {
      title: "Payment No.",
      dataIndex: "PaymentNo",
      width: "12%",
      align: "center",
    },
    {
      title: "Payment Date",
      dataIndex: "PaymentDate",
      align: "center",
      width: "10%",
      render: (value, record) => {
        return (
          <Text>
            {moment(record.PaymentDate).format(l_ConfigDateFormat.value1)}
          </Text>
        );
      },
    },
    {
      title: "Transaction Type",
      align: "center",
      width: "20%",
      render: (value, record) => {
        return record.PaymentType === "EXPS" ? (
          <div>
            <span style={{ marginRight: 5 }}>
              {
                l_ExpenseMaster.find((i) => i.ShortCode === record.Value1)
                  .MasterDesc
              }
            </span>
          </div>
        ) : null;
      },
    },
    {
      title: "Remark",
      dataIndex: "Remark",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      align: "center",
      width: "10%",
    },
    {
      align: "center",
      dataIndex: "",
      key: "x",
      width: "5%",
      render: (text, record) => {
        return (
          <>
            <a
              href="#"
              className={`edit-btn ${
                hasRight(currentTran.moduleRights, "EDIT")
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={hasRight(currentTran.moduleRights, "EDIT")}
              style={{ marginRight: 10 }}
            >
              <span
                onClick={() => {
                  setAEData({ entryMode: "E", data: record });
                }}
              >
                <EditTwoTone />
              </span>
            </a>
            <Popconfirm
              title="Are you sure delete ?"
              onConfirm={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <a
                className={`edit-btn ${
                  hasRight(currentTran.moduleRights, "DELETE") ||
                  disableAction(record)
                    ? `disabled`
                    : `edit-btn`
                }`}
                disabled={
                  hasRight(currentTran.moduleRights, "DELETE") ||
                  disableAction(record) ||
                  record.Amount !== record.BalAmount
                }
              >
                <DeleteTwoTone />
              </a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const size = "small";

  return (
    <>
      {!aeData && (
        <>
          <CardHeader title={currentTran.formTitle} />
          <Card bodyStyle={{ padding: 5 }} style={{ height: "50%" }}>
            <Row
              className="card-payments"
              style={{ justifyContent: "space-between" }}
            >
              <Row>
                <Col style={{ marginRight: 5 }}>
                  <Row>
                    <Col style={{ alignSelf: "center", marginRight: 5 }}>
                      <div className="sales-item-input-label">From Date:</div>
                    </Col>
                    <Col style={{ alignSelf: "center" }}>
                      <DatePicker
                        size={size}
                        value={paramData.fromDate}
                        format={l_ConfigDateFormat.value1}
                        onChange={(date, dateString) => {
                          setParamData({ ...paramData, fromDate: date });
                        }}
                        placeholder="Select From Date"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col style={{ marginRight: 5 }}>
                  <Row>
                    <Col style={{ alignSelf: "center", marginRight: 5 }}>
                      <div className="sales-item-input-label">To Date:</div>
                    </Col>
                    <Col style={{ alignSelf: "center" }}>
                      <DatePicker
                        size={size}
                        value={paramData.toDate}
                        format={l_ConfigDateFormat.value1}
                        onChange={(date, dateString) => {
                          setParamData({ ...paramData, toDate: date });
                        }}
                        placeholder="Select To Date"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col style={{ marginRight: 5 }}>
                  <Row>
                    <Col style={{ alignSelf: "center", marginRight: 5 }}>
                      <div className="sales-item-input-label">Payment No:</div>
                    </Col>
                    <Col style={{ alignSelf: "center" }}>
                      <Input
                        size={size}
                        allowClear
                        value={paramData.paymentNo}
                        placeholder="Payment no."
                        onChange={(e) =>
                          setParamData({
                            ...paramData,
                            paymentNo: e.target.value,
                          })
                        }
                      />
                    </Col>
                  </Row>
                </Col>
                <Col style={{ marginRight: 5 }}>
                  <Button
                    size={size}
                    type="primary"
                    htmlType="submit"
                    disabled={
                      (!paramData.fromDate || !paramData.toDate) &&
                      !paramData.paymentNo
                    }
                    icon={<SearchOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      fnDefault();
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    size={size}
                    type="primary"
                    icon={<RetweetOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      setParamData({
                        fromDate: null,
                        toDate: null,
                        paymentNo: null,
                      });
                    }}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    size={size}
                    disabled={hasRight(currentTran.moduleRights, "ADD")}
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      setAEData({ entryMode: "A" });
                    }}
                  >
                    Create New Payment
                  </Button>
                </Col>
              </Row>
            </Row>
            {!aeData && (
              <Table
                loading={isLoading}
                columns={columns}
                bordered={true}
                dataSource={tableData.length > 0 ? tableData : null}
                className="custom-pagination"
                pagination={
                  (tableData.length > 15 ? true : false,
                  {
                    pageSize: 15,
                    size: "small",
                  })
                }
              />
            )}
          </Card>
        </>
      )}

      {aeData && (
        <PaymentMasterHdrCard
          cardType={"PAY"}
          entryMode={aeData.entryMode}
          data={aeData.data ? aeData.data : null}
          onBackPress={() => {
            setAEData();
          }}
        />
      )}
    </>
  );
};

export default PaymentMasterPage;
