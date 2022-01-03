import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Spin,
  Select,
  message,
  DatePicker,
  Modal,
  Typography,
  Table,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import {
  getRecieptRefundDtlData,
  getRecieptBalAmountData,
  InsUpdtRefund,
} from "../../../../services/reciept-refund";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PlusCircleOutlined,
  EditTwoTone,
  SaveTwoTone,
  DeleteTwoTone,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import moment from "moment";
import { toast } from "react-toastify";
import RefundDtlCard from "./RefundDtlCard";
import Refund from "../../../../models/refund";
import _ from "lodash";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};
const { TextArea } = Input;
const { Text } = Typography;

const RefundHdrCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [dtlDataSource, setDtlDataSource] = useState([]);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );
  const [customerDisable, setCustomerDisable] = useState(false);
  const [receipt, setReciept] = useState();
  const [selectedReceipt, setSelectedReceipt] = useState({
    ReceiptId: props.formData ? props.formData.ReceiptId : null,
    ReceiptDate: props.formData ? props.formData.ReceiptDate : null,
    BalAmount: 0,
  });
  const [dtlEditedData, setDtlEditedData] = useState();
  const [dtlModal, setDtlModal] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const l_configDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const Autocode = useSelector(
    (state) => state.sysSequenceConfig.SequenceNextVal
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const PaymentMode = useSelector((state) => state.paymodeMaster.paymodeMaster);
  const [tempTotalAmount, setTempTotalAmount] = useState(0);
  // console.log(props.formData, "data");

  // useEffect(() => {
  //   setSelectedReceipt({
  //     ...selectedReceipt,
  //     BalAmount: selectedReceipt.BalAmount - tempTotalAmount,
  //   });
  // }, [dtlDataSource]);

  let totalAmount = 0;

  const initialValues = {
    RefundId: props.formData ? props.formData.RefundId : 0,
    RefundType: props.formData ? props.formData.RefundType : "CUST",
    Value1: props.formData
      ? parseInt(props.formData.Value1)
      : selectedReceipt.ReceiptId,
    Value2: props.formData ? props.formData.Value2 : "",
    Value3: props.formData ? props.formData.Value3 : "",
    Value4: props.formData ? props.formData.Value4 : "",
    Value5: props.formData ? props.formData.Value5 : "",
    RefundDate: props.formData
      ? moment(props.formData.RefundDate)
      : moment(new moment()),
    RefundNo: props.formData ? props.formData.RefundNo : "",
    Amount: props.formData ? props.formData.Amount : "",
    ReceiptId: props.formData ? props.formData.ReceiptId : null,
    ReceiptDate: props.formData ? props.formData.ReceiptDate : null,
    Remark: props.formData ? props.formData.Remark : "",
  };

  const onReset = () => {
    if (props.entryMode === "A")
      form.setFieldsValue({
        RefundType: "CUST",
        Value1: "",
        Value2: "",
        Value3: "",
        Value4: "",
        Value5: "",
        Remark: "",
      });
  };

  const onFinish = (values) => {
    // console.log(selectedReceipt && selectedReceipt.BalAmount);
    const val = new Refund(
      values.RefundId ? values.RefundId : initialValues.RefundId,
      values.RefundType ? values.RefundType : initialValues.RefundType,
      values.Value1,
      values.Value2 ? values.Value2 : initialValues.Value2,
      values.Value3 ? values.Value3 : initialValues.Value3,
      values.Value4 ? values.Value4 : initialValues.Value4,
      values.Value5 ? values.Value5 : initialValues.Value5,
      moment(values.RefundDate).format("YYYY-MM-DD"),
      values.RefundNo,
      totalAmount,
      selectedReceipt && selectedReceipt.ReceiptId
        ? selectedReceipt.ReceiptId
        : initialValues.ReceiptId,
      selectedReceipt && selectedReceipt.ReceiptDate
        ? moment(selectedReceipt.ReceiptDate).format("YYYY-MM-DD")
        : initialValues.ReceiptDate,
      values.Remark
    );

    if (
      selectedReceipt.ReceiptId &&
      tempTotalAmount > selectedReceipt.BalAmount
    ) {
      message.error("Please check your refund amount");
    } else {
      setIsLoading(true);
      dispatch(
        InsUpdtRefund(
          val,
          dtlDataSource,
          selectedReceipt.ReceiptId
            ? selectedReceipt.BalAmount - tempTotalAmount
            : 0,
          true
        )
      );
    }
  };

  useEffect(() => {
    if (currentTran.isSuccess) {
      form.resetFields();
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);

  useEffect(() => {
    if (props.entryMode === "A") {
      if (Autocode.length > 0) {
        form.setFieldsValue({ RefundNo: Autocode[0].NextVal });
        setICodeDisable(true);
      }
    } else if (props.entryMode === "E") {
      form.setFieldsValue({
        RefundNo: props.formData.RefundNo,
      });
      setICodeDisable(true);
    }
  }, [Autocode]);

  useEffect(() => {
    getRecieptRefundDtlData(
      CompCode,
      props.formData ? props.formData.RefundId : 0
    ).then((res) => {
      let tempAmount = 0;
      if (res) {
        setDtlDataSource(res);
        res.map((ii) => (tempAmount += parseInt(ii.Amount)));
      }
      setTempTotalAmount(res ? tempAmount : 0);
    });

    getRecieptBalAmountData(CompCode).then((res) => {
      setReciept(res);
      if (props.formData && props.formData.ReceiptId) {
        setSelectedReceipt({
          ...selectedReceipt,
          BalAmount: res.find(
            (ii) => ii.ValueMember === props.formData.ReceiptId
          ).BalAmount,
        });
      } else {
        setSelectedReceipt({ ...selectedReceipt, BalAmount: 0 });
      }
    });
  }, []);

  const disableAction = (record) => {
    return moment(new moment()).format("YYYY-MM-DD") !==
      moment(record.ReceiptDate).format("YYYY-MM-DD")
      ? true
      : false;
  };

  const handleDelete = (record) => {
    const newData = [...dtlDataSource];
    newData[newData.findIndex((ii) => ii.key === record.key)] = record;
    setDtlDataSource([...newData]);
  };

  let columns = [
    {
      title: "Sr.No.",
      width: 10,
      dataIndex: "key",
      align: "center",
      render: (value, record) => {
        return <Text>{parseInt(value) + 1}</Text>;
      },
    },
    {
      title: "Payment Mode",
      dataIndex: "PaymentMode",
      width: "20%",
      editable: true,
      render: (value, record) => {
        return (
          PaymentMode &&
          PaymentMode.filter((ii) => ii.PayCode === record.PaymentMode).map(
            (i) => {
              return <Text key={i.PayCode}>{i.PayDesc}</Text>;
            }
          )
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
      editable: true,
    },
    {
      width: "5%",
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
                setDtlModal(true);
                setDtlEditedData({ entryMode: "E", data: record });
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
                handleDelete(record);
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
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        {!isLoading && (
          <Row>
            <Col flex={1}>
              <CardHeader
                title={props.title ? props.title : currentTran.formTitle}
              />
              <Card bordered={true} bodyStyle={{ padding: 5 }}>
                <Row>
                  <Col
                    xl={12}
                    lg={12}
                    md={12}
                    sm={24}
                    xs={24}
                    style={{ borderRight: "1px solid #f0f0fo" }}
                  >
                    <Card bordered={true} bodyStyle={{ padding: "7px 12px" }}>
                      <Form
                        form={form}
                        initialValues={initialValues}
                        name="userbody"
                        labelAlign="left"
                        {...formItemLayout}
                        onFinish={onFinish}
                      >
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="RefundNo"
                            style={{
                              width: "calc(50% - 8px)",
                              marginBottom: 5,
                            }}
                            label="Refund No"
                            rules={[
                              {
                                required: true,
                                message: "Please input your refund number",
                              },
                            ]}
                            labelCol={12}
                            wrapperCol={12}
                          >
                            <Input
                              placeholder="Refund number"
                              disabled={iCodeDisable}
                              style={{
                                textTransform: "uppercase",
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            labelCol={12}
                            wrapperCol={12}
                            name="RefundDate"
                            style={{
                              marginBottom: 5,
                              width: "calc(50% - 8px)",
                              marginLeft: 15,
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Please input your refund date",
                              },
                            ]}
                            label="Refund Date"
                          >
                            <DatePicker
                              style={{
                                width: "100%",
                              }}
                              disabled={props.formData}
                              format={l_configDateFormat.value1}
                            />
                          </Form.Item>
                        </div>
                        <Form.Item
                          name="ReceiptId"
                          style={{ marginBottom: 5 }}
                          label="Reciept"
                          className="receipt-value"
                          labelCol={12}
                          wrapperCol={12}
                        >
                          <Select
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a reciept"
                            optionFilterProp="children"
                            allowClear={true}
                            disabled={props.formData}
                            onChange={(value, record) => {
                              if (record) {
                                let data = record.data.toString().split(",");
                                setSelectedReceipt({
                                  ReceiptId: value,
                                  ReceiptDate: data.length > 0 ? data[0] : null,
                                  BalAmount:
                                    data.length > 0 ? parseFloat(data[2]) : 0,
                                });
                                form.setFieldsValue({
                                  Value1: parseInt(data[1]),
                                });
                                setCustomerDisable(true);
                              } else {
                                setSelectedReceipt({
                                  ReceiptId: null,
                                  ReceiptDate: null,
                                  BalAmount: 0,
                                });
                                form.setFieldsValue({
                                  Value1: null,
                                });
                                setCustomerDisable(false);
                              }
                            }}
                          >
                            {receipt &&
                              receipt.map((item) => {
                                return (
                                  <Option
                                    value={item.ValueMember}
                                    key={item.ValueMember}
                                    data={` ${item.ReceiptDate}, ${item.Customer},${item.BalAmount}`}
                                  >
                                    {item.DisplayMember}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name="Value1"
                          style={{
                            marginBottom: 5,
                          }}
                          label="Customer"
                          rules={[
                            {
                              required: true,
                              message: "Please select your customer",
                            },
                          ]}
                          className="reciept-item"
                          labelCol={12}
                          wrapperCol={12}
                        >
                          <Select
                            style={{ width: "100%" }}
                            showSearch
                            disabled={
                              customerDisable || props.formData ? true : false
                            }
                            placeholder="Select a customer"
                            optionFilterProp="children"
                            allowClear={true}
                          >
                            {customer.map((item) => {
                              return (
                                <Option key={item.userId} value={item.userId}>
                                  {`${item.Name} (${item.mobile})`}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                        {/* </div> */}
                        <Form.Item
                          name="Remark"
                          className="receipt-value"
                          style={{ marginBottom: 5 }}
                          label="Remark"
                          labelCol={12}
                          wrapperCol={12}
                        >
                          <TextArea
                            rows={5}
                            placeholder="please enter your remark"
                          />
                        </Form.Item>
                        <Form.Item
                          style={{ marginBottom: 5, width: "calc(50% - 8px)" }}
                          label="Refundable Amount"
                          labelCol={12}
                          wrapperCol={12}
                          className="reciept-item"
                        >
                          <Input
                            disabled
                            style={{
                              textAlign: "right",
                              marginLeft: 5,
                            }}
                            value={
                              selectedReceipt.ReceiptId
                                ? selectedReceipt.BalAmount - tempTotalAmount
                                : 0
                            }
                          />
                        </Form.Item>
                        <Divider
                          type="horizontal"
                          style={{ marginBottom: 5, marginTop: 5 }}
                        />
                        {/* Start Detail Card                         */}
                        <div>
                          <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            style={{ marginBottom: 5 }}
                            onClick={() => {
                              setDtlModal(true);
                              setDtlEditedData({ entryMode: "A" });
                            }}
                          >
                            New Row
                          </Button>
                          <Modal
                            title="Refund Mode"
                            bodyStyle={{ padding: "0px 0px", height: "auto" }}
                            width="50%"
                            onCancel={() => {
                              setDtlModal(false);
                            }}
                            visible={dtlModal}
                            footer={null}
                            destroyOnClose={true}
                          >
                            <RefundDtlCard
                              dataSource={dtlDataSource}
                              data={dtlEditedData}
                              totalAmount={tempTotalAmount}
                              refundableAmount={
                                selectedReceipt.ReceiptId !== null
                                  ? selectedReceipt.BalAmount - tempTotalAmount
                                  : 0
                              }
                              refundId={initialValues.RefundId}
                              onBackPress={() => {
                                setDtlModal(false);
                              }}
                              onDialogSave={(newData) => {
                                // setDtlEditedData();
                                setDtlModal(false);
                                if (dtlEditedData.entryMode === "A") {
                                  let {
                                    Amount,
                                    Remark,
                                    PaymentMode,
                                    key,
                                    Id,
                                    RefundId,
                                  } = newData;
                                  setDtlDataSource([
                                    ...dtlDataSource,
                                    {
                                      Amount,
                                      Remark,
                                      PaymentMode,
                                      key,
                                      Id,
                                      RefundId,
                                    },
                                  ]);
                                } else if (dtlEditedData.entryMode === "E") {
                                  let hh = dtlDataSource;
                                  hh[
                                    hh.findIndex((kk) => kk.key === newData.key)
                                  ] = newData;
                                  setDtlDataSource([...hh]);
                                }
                                // setTempTotalAmount(
                                //   tempTotalAmount + newData.Amount
                                // );
                              }}
                            />
                          </Modal>

                          <Table
                            dataSource={dtlDataSource.filter(
                              (i) => !i.isDeleted
                            )}
                            columns={columns}
                            bordered={true}
                            pagination={false}
                            summary={(pageData) => {
                              if (pageData.length > 0) {
                                pageData.forEach(({ Amount, repayment }) => {
                                  totalAmount += parseFloat(Amount);
                                });
                                setTempTotalAmount(totalAmount);
                              } else {
                                setTempTotalAmount(0);
                              }
                              return (
                                <>
                                  <Table.Summary.Row>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                      <Text strong>Total Amount</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                      <Text strong>
                                        {totalAmount.toFixed(2)}
                                      </Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                  </Table.Summary.Row>
                                </>
                              );
                            }}
                          />

                          {/* End detail card */}
                        </div>
                        <Divider
                          type="horizontal"
                          style={{ marginBottom: 5, marginTop: 5 }}
                        />
                        <Form.Item noStyle={true}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            // disabled={}
                            style={{ marginRight: 5 }}
                          >
                            Save
                          </Button>

                          <Button
                            type="primary"
                            icon={<RetweetOutlined />}
                            style={{ marginRight: 5 }}
                            onClick={onReset}
                          >
                            Reset
                          </Button>

                          <Button
                            type="primary"
                            icon={<RollbackOutlined />}
                            style={{ marginRight: 5 }}
                            onClick={() => {
                              props.onBackPress();
                            }}
                          >
                            Back
                          </Button>

                          <Button
                            type="primary"
                            icon={<Icon component={PrinterOutlined} />}
                            style={{ marginRight: 5 }}
                          >
                            Print
                          </Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default RefundHdrCard;
