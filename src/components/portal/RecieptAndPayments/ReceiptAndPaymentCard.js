import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Radio,
  message,
} from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  RollbackOutlined,
  RetweetOutlined,
  SaveOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  fetchReceiptAndPaymentsWithDetails,
  fetchReceiptAndPaymentReferenceHelp,
  fetchPayModeMaster,
  saveInsReceiptAndPayments,
} from "../../../services/receipts-payments";
import _ from "lodash";
import swal from "sweetalert";

const ReceiptAndPaymentCard = (props) => {
  const { Option } = Select;
  const { Text } = Typography;
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [formData, setFormData] = useState({
    TranType: props.TranType,
    TranId: 0,
    TranNo: "",
    TranDate: moment(),
    RefCode: null,
    Remark: "",
    Amount: 0,
    BalAmount: 0,
    DetailData: [],
  });
  const [dtlFormData, setDtlFormData] = useState({
    key: 0,
    TranId: 0,
    Id: 0,
    PaymentMode: null,
    PayDesc: null,
    Remark: null,
    TranType: props.TranType,
    Amount: 0,
  });

  const [payModes, setPayModes] = useState([]);
  const [helpRef, setHelpRef] = useState([]);
  const [Isloading, setIsloading] = useState(false);
  const [seqConfig, setSeqConfig] = useState({
    AutoGenerate: false,
    GeneratedValue: "",
  });
  const [defParty, setDefParty] = useState(
    props.TranType === "RCT" ? "U" : props.TranType === "PMT" ? "P" : "0"
  );
  const sequenceConfig = useSelector(
    (state) => state.sysSequenceConfig.sysSequenceConfig
  );

  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  useEffect(() => {
    let cc;
    if (props.TranType === "RCT") {
      cc = sequenceConfig.find((ff) => ff.TranType === "RCPT");
    } else if (props.TranType === "PMT") {
      cc = sequenceConfig.find((ff) => ff.TranType === "PYMNT");
    } else if (props.TranType === "EXPS") {
      cc = sequenceConfig.find((ff) => ff.TranType === "EXP");
    } else if (props.TranType === "INC") {
      cc = sequenceConfig.find((ff) => ff.TranType === "INC");
    } else if (props.TranType === "GNRCIN") {
      cc = sequenceConfig.find((ff) => ff.TranType === "GNRCIN");
    } else if (props.TranType === "GNRCOUT") {
      cc = sequenceConfig.find((ff) => ff.TranType === "GNRCOUT");
    }

    // console.log(cc, "seqenc");
    if (cc) {
      setSeqConfig({
        AutoGenerate: cc.ConfigType === "M" ? false : true,
        GeneratedValue: cc.Value,
      });
      // setFormData({ ...formData, TranNo: cc.Value });
    }

    setIsloading(true);
    try {
      fetchPayModeMaster(CompCode).then((res) => {
        setPayModes(res.filter((rr) => rr.IsActive.data[0] === 1));
      });

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

      if (props.TranId !== 0) {
        fetchReceiptAndPaymentsWithDetails(
          CompCode,
          props.TranType,
          props.TranId
        ).then((res) => {
          // console.log(res, "initial");
          let tmpData = [];
          res.DtlData.forEach((rr, idx) => {
            tmpData.push({
              key: idx + 1,
              TranType: rr.TranType,
              Id: rr.Id,
              TranId: rr.TranId,
              PaymentMode: rr.PaymentMode,
              PayDesc: rr.PayDesc,
              Amount: parseFloat(rr.Amount).toFixed(2),
              Remark: rr.Remark,
              fromDatabase: true,
              isDeleted: false,
            });
          });
          setFormData({
            TranType: res.HdrData[0].TranType,
            TranId: res.HdrData[0].TranId,
            TranNo: res.HdrData[0].TranNo,
            TranDate: moment(res.HdrData[0].TranDate),
            RefCode: res.HdrData[0].RefNo,
            Remark: res.HdrData[0].Remark,
            Amount: parseFloat(res.HdrData[0].Amount).toFixed(2),
            BalAmount: parseFloat(res.HdrData[0].BalAmount).toFixed(2),
            DetailData: tmpData,
          });
        });
      } else {
      }
    } catch (error) {
    } finally {
      setIsloading(false);
    }
  }, []);

  let columns = [
    {
      title: "Sr.No.",
      dataIndex: "key",
      width: 80,
    },
    {
      title: "Payment Mode",
      dataIndex: "PayDesc",
      width: 100,
    },

    {
      title: "Remark",
      dataIndex: "Remark",
    },
    {
      align: "right",
      title: "Amount",
      dataIndex: "Amount",
      width: 120,
      render: (value, record) => {
        return <Text>{parseFloat(record.Amount).toFixed(2)}</Text>;
      },
    },
    {
      align: "center",
      dataIndex: "",
      key: "x",
      width: 50,
      render: (text, record) => {
        return (
          <>
            <a
              href="#"
              style={{ marginRight: 5 }}
              onClick={() => {
                setDtlFormData({
                  key: record.key,
                  TranId: record.TranId,
                  PaymentMode: record.PaymentMode,
                  Remark: record.Remark,
                  TranType: props.TranType,
                  Amount: record.Amount,
                  PayDesc: record.PayDesc,
                  isDeleted: false,
                });
              }}
            >
              <EditTwoTone />
            </a>
            <a
              href="#"
              style={{}}
              onClick={() => {
                record.isDeleted = true;
                const newData = [...formData.DetailData];
                newData[newData.findIndex((ii) => ii.key === record.key)] =
                  record;
                setFormData({ ...formData, DetailData: [...newData] });
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
          <Card bordered bodyStyle={{ padding: 5 }}>
            <Col
              className="card-receipt-payment"
              lg={24}
              md={24}
              sm={24}
              xs={24}
            >
              <div className="card-receipt-payment card-receipt-payment-inner">
                <Row style={{ display: "flex", marginBottom: 5 }}>
                  <Col
                    xl={12}
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    style={{ flex: 1, marginRight: 5 }}
                  >
                    <Row className="">
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
                        className="receipt-payment-label"
                      >
                        <span style={{ color: "red" }}>* </span>
                        <span>
                          {props.TranType === "PMT"
                            ? "Payment"
                            : props.TranType === "EXPS"
                            ? "Expense"
                            : props.TranType === "RCT"
                            ? "Receipt"
                            : props.TranType === "INC"
                            ? "Income"
                            : // : props.TranType === "GNRCIN"
                              // ? "Generic In"
                              // : props.TranType === "GNRCOUT"
                              // ? "Generic Out"
                              "Tran"}
                          &nbsp; No. :
                        </span>
                      </Col>
                      <Col
                        style={{ flex: 1 }}
                        xl={16}
                        lg={16}
                        md={16}
                        sm={24}
                        xs={24}
                        className="receipt-payment-search-input"
                      >
                        <Input
                          placeholder={
                            seqConfig.AutoGenerate
                              ? "* Auto Generated *"
                              : props.TranType === "PMT"
                              ? "Payment No."
                              : props.TranType === "EXPS"
                              ? "Expense No."
                              : props.TranType === "RCT"
                              ? "Receipt No."
                              : props.TranType === "INC"
                              ? "Income No."
                              : // : props.TranType === "GNRCIN"
                                // ? "Generic In No."
                                // : props.TranType === "GNRCOUT"
                                // ? "Generic Out No."
                                "Tran No."
                          }
                          onChange={(val) => {
                            setFormData({
                              ...formData,
                              TranNo: val.target.value,
                            });
                          }}
                          disabled={
                            props.EntryMode !== "A" || seqConfig.AutoGenerate
                          }
                          value={formData.TranNo}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xl={12}
                    lg={24}
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
                        className="receipt-payment-label"
                      >
                        <span style={{ color: "red" }}>* </span>
                        <span>
                          {props.TranType === "PMT"
                            ? "Payment"
                            : props.TranType === "EXPS"
                            ? "Expense"
                            : props.TranType === "RCT"
                            ? "Receipt"
                            : props.TranType === "INC"
                            ? "Income"
                            : // : props.TranType === "GNRCIN"
                              // ? "Generic In"
                              // : props.TranType === "GNRCOUT"
                              // ? "Generic Out"
                              "Tran"}{" "}
                          Date :
                        </span>
                      </Col>
                      <Col
                        xl={16}
                        lg={16}
                        md={16}
                        sm={24}
                        xs={24}
                        style={{ flex: 1 }}
                        className="receipt-payment-search-input"
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format={l_ConfigDateFormat.value1}
                          onChange={(date, dateString) => {
                            setFormData({ ...formData, TranDate: date });
                          }}
                          value={formData.TranDate}
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
                    className="receipt-payment-label"
                  >
                    <span style={{ color: "red" }}>* </span>
                    <span>
                      {props.TranType === "PMT" ||
                      props.TranType === "RCT" ||
                      props.TranType === "GNRCIN" ||
                      props.TranType === "GNRCOUT"
                        ? "Party"
                        : "Category"}
                    </span>
                  </Col>
                  <Col
                    xl={20}
                    lg={20}
                    md={20}
                    sm={24}
                    xs={24}
                    style={{ flex: 1 }}
                    className="receipt-payment-search-input"
                  >
                    <Row>
                      <Col flex={1} style={{}}>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder={`Select ${
                            props.TranType === "PMT" ||
                            props.TranType === "RCT" ||
                            props.TranType === "GNRCIN" ||
                            props.TranType === "GNRCOUT"
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
                        >
                          {helpRef
                            .filter(
                              (i) => defParty === "0" || i.UserType === defParty
                            )
                            .map((pp) => {
                              return (
                                <Option key={pp.RefId} value={pp.RefId}>
                                  {`${pp.RefName} ${
                                    pp.DataSetType === "PARTY"
                                      ? `(${pp.AddInfo})`
                                      : ""
                                  }`}
                                </Option>
                              );
                            })}
                        </Select>
                      </Col>
                      {props.TranType === "PMT" ||
                      props.TranType === "RCT" ||
                      props.TranType === "GNRCIN" ||
                      props.TranType === "GNRCOUT" ? (
                        <Col style={{ marginLeft: 5 }}>
                          <Radio.Group
                            buttonStyle="solid"
                            value={defParty}
                            onChange={(e) => {
                              setDefParty(e.target.value);
                            }}
                          >
                            <Radio.Button value={"0"}>All</Radio.Button>
                            <Radio.Button value={"U"}>Customers</Radio.Button>
                            <Radio.Button value={"P"}>Suppliers</Radio.Button>
                          </Radio.Group>
                        </Col>
                      ) : (
                        // props.TranType === "INC" ||
                        //   props.TranType === "EXPS" ? (
                        //   <>
                        //     <Button
                        //       icon={<PlusCircleOutlined />}
                        //       onClick={() => {}}
                        //       type="link"
                        //     />
                        //     <Button
                        //       icon={<EditOutlined />}
                        //       onClick={() => {}}
                        //       type="link"
                        //     />
                        //   </>
                        // ) :
                        ""
                      )}
                    </Row>
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
                    className="receipt-payment-label"
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
                    className="receipt-payment-search-input"
                  >
                    <Input.TextArea
                      placeholder="Remark"
                      value={formData.Remark}
                      rows={4}
                      onChange={(e) => {
                        setFormData({ ...formData, Remark: e.target.value });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
              <Row style={{ marginBottom: 5 }} className="card-payments">
                <Col
                  xl={6}
                  lg={6}
                  md={6}
                  sm={24}
                  xs={24}
                  style={{ marginBottom: 2, paddingRight: 5 }}
                  className="sales-item-input-outer"
                >
                  <Row className="sales-item-input-inner">
                    <Col
                      span={24}
                      className="sales-item-input-label"
                      style={{ alignSelf: "center", paddingRight: 8 }}
                    >
                      <span style={{ color: "red" }}>* </span> Payment Mode
                    </Col>
                    <Col span={24} style={{ display: "flex" }}>
                      <Select
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        placeholder="Payment Mode"
                        style={{
                          width: "calc(100% - 24px)",
                          flex: 1,
                          alignSelf: "center",
                        }}
                        size="small"
                        value={dtlFormData.PaymentMode}
                        onChange={(val, data) => {
                          setDtlFormData({
                            ...dtlFormData,
                            PaymentMode: val,
                            PayDesc: data ? data.desc : "",
                          });
                        }}
                      >
                        {payModes.map((rr) => (
                          <Option
                            key={rr.PayCode}
                            desc={rr.PayDesc}
                            value={rr.PayCode}
                          >
                            {rr.PayDesc}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                </Col>
                <Col
                  xl={6}
                  lg={6}
                  md={6}
                  sm={24}
                  xs={24}
                  style={{
                    paddingRight: 5,
                    marginBottom: 2,
                  }}
                  className="sales-item-input-outer"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>Amount
                    </div>
                    <Input
                      type="number"
                      step={0.1}
                      className="bill-input"
                      placeholder="Amount"
                      style={{ width: "100%", textAlign: "end" }}
                      size="small"
                      value={dtlFormData.Amount}
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          setDtlFormData({
                            ...dtlFormData,
                            Amount: e.target.value,
                          });
                        } else {
                          message.error("Value must be greater than 0");
                        }
                      }}
                    />
                  </Row>
                </Col>
                <Col
                  xl={6}
                  lg={6}
                  md={6}
                  sm={24}
                  xs={24}
                  style={{
                    paddingRight: 5,
                    marginBottom: 2,
                  }}
                  className="sales-item-input-outer"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        paddingRight: 5,

                        width: "100%",
                      }}
                    >
                      Remark
                    </div>
                    <Input
                      value={dtlFormData.Remark}
                      className="bill-input"
                      placeholder="Remark"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        setDtlFormData({
                          ...dtlFormData,
                          Remark: e.target.value,
                        });
                      }}
                    />
                  </Row>
                </Col>
                <Col
                  xl={6}
                  lg={6}
                  md={6}
                  sm={24}
                  xs={24}
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      marginRight: 5,
                      height: "100%",

                      fontSize: "16px",
                      fontWeight: "600",
                      flex: 1,
                    }}
                    icon={<PlusCircleOutlined style={{ fontSize: 25 }} />}
                    size="small"
                    onClick={async () => {
                      if (
                        _.includes([null, ""], dtlFormData.Amount) ||
                        _.includes([null, ""], dtlFormData.PaymentMode)
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
                          duration: 1,
                        });
                      } else {
                        // console.log(dtlFormData, "else");
                        if (dtlFormData.key) {
                          let hh = formData.DetailData;

                          hh[hh.findIndex((kk) => kk.key === dtlFormData.key)] =
                            dtlFormData;

                          setFormData({
                            ...formData,
                            DetailData: [...hh],
                          });
                        } else {
                          let tempDtlData = formData.DetailData;
                          tempDtlData.push({
                            key: formData.DetailData.length + 1,
                            Id: 0,
                            TranId: 0,
                            TranType: props.TranType,
                            PaymentMode: dtlFormData.PaymentMode,
                            PayDesc: dtlFormData.PayDesc,
                            Amount: dtlFormData.Amount,
                            Remark: dtlFormData.Remark,
                            isDeleted: false,
                          });

                          setFormData({
                            ...formData,
                            DetailData: [...tempDtlData],
                          });
                        }
                        setDtlFormData({
                          key: 0,
                          TranId: 0,
                          Id: 0,
                          PaymentMode: null,
                          PayDesc: "",
                          Remark: null,
                          TranType: props.TranType,
                          Amount: 0,
                        });
                      }
                    }}
                  />
                  <Button
                    type="primary"
                    style={{
                      height: "100%",

                      fontSize: "16px",
                      fontWeight: "600",
                      flex: 1,
                    }}
                    icon={<RetweetOutlined style={{ fontSize: 22 }} />}
                    size="small"
                    onClick={() => {
                      setDtlFormData({
                        key: 0,
                        TranId: 0,
                        Id: 0,
                        PaymentMode: null,
                        PayDesc: "",
                        Remark: null,
                        TranType: props.TranType,
                        Amount: 0,
                      });
                    }}
                  />
                </Col>
                <Row style={{ marginTop: 5 }}>
                  <Col style={{ height: 230, flex: 1 }}>
                    <Table
                      loading={Isloading}
                      className="receipt-payment-table"
                      columns={columns}
                      dataSource={formData.DetailData.filter(
                        (i) => i.isDeleted !== true
                      )}
                      pagination={false}
                      bordered={true}
                      scroll={{ y: "calc(100% - 30px)", x: "max-content" }}
                      key={(data) => {
                        return data.key;
                      }}
                      size="small"
                      summary={(pageData) => {
                        let totalAmount = 0;
                        if (pageData.length > 0) {
                          pageData.forEach(({ Amount, repayment }) => {
                            totalAmount += parseFloat(Amount);
                          });
                        }
                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell></Table.Summary.Cell>
                              <Table.Summary.Cell></Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text strong>
                                  Total{" "}
                                  {props.TranType === "PMT"
                                    ? "Payment"
                                    : props.TranType === "EXPS"
                                    ? "Expense"
                                    : props.TranType === "RCT"
                                    ? "Receipt"
                                    : props.TranType === "INC"
                                    ? "Income"
                                    : "Amount"}{" "}
                                  ({l_ConfigCurrency.value1})
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell className="custom-table-summary-amount">
                                <span>
                                  <Text strong>{totalAmount.toFixed(2)}</Text>
                                </span>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell></Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
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
                    // disabled={props.allowModify && props.allowModify}
                    onClick={() => {
                      let totalAmount = 0;
                      formData.DetailData.length > 0 &&
                        formData.DetailData.filter((i) => !i.isDeleted).forEach(
                          (i) => {
                            totalAmount += parseFloat(i.Amount);
                          }
                        );
                      if (
                        (!seqConfig.AutoGenerate &&
                          formData.TranNo.length === 0) ||
                        _.includes([null, ""], formData.TranDate) ||
                        _.includes([null, ""], formData.RefCode)
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
                          duration: 1,
                        });
                      } else if (_.includes([null, "", 0], totalAmount)) {
                        notification.warning({
                          message: "Amount Required",
                          description: (
                            <span>Amount should be greater than 0</span>
                          ),
                          duration: 1,
                        });
                      } else {
                        if (totalAmount > 0) {
                          let finalData = {
                            hdrData: {
                              TranType: props.TranType,
                              TranId: formData.TranId,
                              TranNo: formData.TranNo,
                              TranDate: moment(formData.TranDate).format(
                                "YYYY-MM-DD"
                              ),
                              RefCode: formData.RefCode,
                              Remark: formData.Remark,
                              Amount: totalAmount,
                              BalAmount: totalAmount,
                              UpdtUsr: l_loginUser,
                            },
                            dtlData: [
                              ...formData.DetailData.filter(
                                (aa) => aa.isDeleted === false
                              ),
                            ],
                          };
                          // console.log(finalData);

                          swal("Are you sure you want to save this ..!", {
                            buttons: ["Cancel", "Yes!"],
                          }).then((val) => {
                            if (val) {
                              saveInsReceiptAndPayments(
                                CompCode,
                                finalData
                              ).then((res) => {
                                if (
                                  res.message &&
                                  res.message === "successful"
                                ) {
                                  swal({
                                    title: "Succesfully Saved!",
                                    icon: "success",
                                  });
                                  props.onSavePress();
                                } else if (
                                  res.message &&
                                  res.message === "unsuccessfull"
                                ) {
                                  swal({
                                    title:
                                      "Something Went Wrong Try Again Later...!",
                                    icon: "error",
                                  });
                                }
                              });
                            }
                          });
                        }
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

export default ReceiptAndPaymentCard;
