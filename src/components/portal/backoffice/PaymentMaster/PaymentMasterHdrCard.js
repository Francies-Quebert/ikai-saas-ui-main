import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  notification,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import { useSelector } from "react-redux";
import CardHeader from "../../../common/CardHeader";
import {
  DeleteTwoTone,
  EditTwoTone,
  RollbackOutlined,
  SaveOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import Modal from "antd/lib/modal/Modal";
import PaymentMasterDtlCard from "./PaymentMasterDtlCard";
import { getPaymentDtlData } from "../../../../services/payment-master";

const PaymentMasterHdrCard = (props) => {
  const l_ExpenseMaster = useSelector((state) => state.AppMain.expenseMaster);
  const { Option } = Select;
  const { Text } = Typography;
  const [hdrForm, setHdrForm] = useState({
    paymentNo: null,
    paymentDate: "",
    category: null,
    remark: null,
  });
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT").value1
  );
  const paymentmode = useSelector((state) => state.paymodeMaster.paymodeMaster);
  const [dtlData, setDtlData] = useState();
  const [labele, setLabele] = useState("Category");
  const [dtlDatasource, setDtlDatasource] = useState(false);

  useEffect(() => {

    if (props.data && props.data.PaymentId) {
      getPaymentDtlData(props.data.PaymentId).then((res) => {
        setDtlDatasource(res);
        setHdrForm({
          paymentNo: props.data.PaymentNo,
          paymentDate: moment(props.data.PaymentDate),
          category: props.data.Value1,
          remark: props.data.Remark,
        });
      });
    }
  }, []);

  const disableAction = (record) => {
    return moment(new moment()).format("YYYY-MM-DD") !==
      moment(record.ReceiptDate).format("YYYY-MM-DD")
      ? true
      : false;
  };

  let columns = [
    {
      title: "Payment Mode",
      dataIndex: "PaymentMode",
      width: "20%",
      editable: true,
      render: (value, record) => {
        return (
          paymentmode &&
          paymentmode
            .filter((ii) => ii.PayCode === record.PaymentMode)
            .map((i) => {
              return <Text key={i.PayCode}>{i.PayDesc}</Text>;
            })
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      width: "10%",
      render: (value, record) => {
        return <Text>{parseFloat(record.Amount).toFixed(2)}</Text>;
      },
    },

    {
      title: "Remark",
      dataIndex: "Remark",
    },
    {
      width: "10%",
      align: "center",
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => {
        return (
          <>
            <a
              className={`edit-btn ${
                disableAction(record) ? `disabled` : `edit-btn`
              }`}
              disabled={disableAction(record)}
              style={{ marginRight: 10 }}
              onClick={() => {
                setDtlData({ entryMode: "E", data: record });
              }}
            >
              <EditTwoTone />
            </a>
            <a
              className={`edit-btn ${
                disableAction(record) ? `disabled` : `edit-btn`
              }`}
              disabled={disableAction(record)}
              onClick={() => {
                record.isDeleted = true;
                // handleDelete(record);
              }}
            >
              <DeleteTwoTone />
            </a>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Col flex={1}>
          <CardHeader
            title={props.entryMode === "E" ? "Edit Payment" : "Create Payments"}
          />
        </Col>
      </Row>
      <Row>
        <Col flex={1}>
          <Card bordered bodyStyle={{ padding: 5 }}>
            <Col
              style={{
                border: `1px solid #34626c`,
                padding: 5,
              }}
              span={14}
            >
              <Row style={{ display: "flex", marginBottom: 5 }}>
                <Col
                  xl={12}
                  lg={12}
                  md={24}
                  sm={24}
                  xs={24}
                  style={{ flex: 1, marginRight: 5 }}
                >
                  <Row>
                    <Col
                      xl={8}
                      lg={8}
                      md={8}
                      sm={24}
                      xs={24}
                      style={{
                        alignSelf: "center",
                        marginRight: 5,
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>
                      <span>Payment No. :</span>
                    </Col>
                    <Col
                      style={{ flex: 1 }}
                      xl={16}
                      lg={16}
                      md={16}
                      sm={24}
                      xs={24}
                    >
                      <Input
                        placeholder={"* Auto Generated *"}
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  xl={12}
                  lg={12}
                  md={24}
                  sm={24}
                  xs={24}
                  style={{ flex: 1 }}
                >
                  <Row>
                    <Col
                      xl={8}
                      lg={8}
                      md={8}
                      sm={24}
                      xs={24}
                      style={{
                        alignSelf: "center",
                        marginRight: 5,
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>
                      <span>Payment Date :</span>
                    </Col>
                    <Col
                      xl={16}
                      lg={16}
                      md={16}
                      sm={24}
                      xs={24}
                      style={{ flex: 1 }}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        value={hdrForm.paymentDate}
                        format={l_ConfigDateFormat}
                        onChange={(date, dateString) => {
                          setHdrForm({ ...hdrForm, paymentDate: dateString });
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginBottom: 5 }}>
                <Col
                  xl={4}
                  lg={4}
                  md={4}
                  sm={24}
                  xs={24}
                  style={{
                    alignSelf: "center",
                    marginRight: 5,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: "red" }}>* </span>
                  <span>{labele}</span>
                </Col>
                <Col
                  xl={20}
                  lg={20}
                  md={20}
                  sm={24}
                  xs={24}
                  style={{ flex: 1 }}
                >
                  <Select
                    style={{ width: "100%" }}
                    value={hdrForm.category}
                    placeholder="Expense Type"
                    onChange={(val) => {
                      setHdrForm({ ...hdrForm, category: val });
                    }}
                  >
                    {l_ExpenseMaster.length > 0 &&
                      l_ExpenseMaster
                        .filter((i) => i.IsActive)
                        .map((item) => {
                          return (
                            <Option key={item.ShortCode} value={item.ShortCode}>
                              {item.MasterDesc}
                            </Option>
                          );
                        })}
                  </Select>
                </Col>
              </Row>
              <Row>
                <Col
                  xl={4}
                  lg={4}
                  md={4}
                  sm={24}
                  xs={24}
                  style={{
                    alignSelf: "center",
                    marginRight: 5,
                    fontWeight: 600,
                  }}
                >
                  <span>Remark :</span>
                </Col>
                <Col
                  xl={20}
                  lg={20}
                  md={20}
                  sm={24}
                  xs={24}
                  style={{ flex: 1 }}
                >
                  <Input.TextArea
                    value={hdrForm.remark}
                    onChange={(e) => {
                      setHdrForm({ ...hdrForm, remark: e.target.value });
                    }}
                    placeholder="Remark"
                    rows={4}
                  />
                </Col>
              </Row>
              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
              <Row style={{ display: "block" }}>
                <Row style={{ marginBottom: 5 }}>
                  <PaymentMasterDtlCard
                    data={dtlData ? dtlData.data : null}
                    onAddClick={(values) => {
                      // if (values) {
                      //   let tempDtlData = [...dtlDatasource];
                      //   tempDtlData.push({
                      //     key: dtlDatasource.length + 1,
                      //     PaymentMode: values.mode,
                      //     Amount: values.amount,
                      //     Remark: values.remark,
                      //   });
                      //   console.log(tempDtlData, "ss");
                      //   setDtlDatasource(tempDtlData);
                      // }
                    }}
                  />
                </Row>
                <Row>
                  <Col flex={1}>
                    <Table
                      columns={columns}
                      dataSource={dtlDatasource}
                      pagination={false}
                      bordered={true}
                      key={(data) => {
                        return data.key;
                      }}
                      size="small"
                    />
                  </Col>
                </Row>
              </Row>
              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
              <Row>
                <Col>
                  <Button
                    style={{ marginRight: 5 }}
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={async () => {
                      if (
                        _.includes([null, ""], hdrForm.paymentDate) ||
                        _.includes([null, ""], hdrForm.category)
                      ) {
                        notification.error({
                          message: "Required Fields are Empty",
                          description: (
                            <span>
                              Input's with (
                              <span style={{ color: "red" }}> * </span> ) cannot
                              be empty
                            </span>
                          ),
                          duration: 3,
                        });
                      } else {
                        // onAddClick();
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    icon={<RollbackOutlined />}
                    onClick={() => props.onBackPress()}
                  >
                    Back
                  </Button>
                </Col>
              </Row>
            </Col>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PaymentMasterHdrCard;
