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
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";

import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import SweetAlert from "react-bootstrap-sweetalert";
import RecieptTableCard from "./RecieptTable";
import moment from "moment";
import RecieptHdr from "../../../../models/recieptHdr";
import { InsUpdtRcpt } from "../../../../services/reciept";
import { toast } from "react-toastify";

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

const RecieptCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [recieptDtlData, setRecieptDtlData] = useState();
  const [amount, setAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    props.data ? moment(props.data.ReceiptDate)._d : moment(new moment())._d
  );
  const [iCodeDisable, setICodeDisable] = useState(props.data ? true : false);
  const l_configDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const Autocode = useSelector(
    (state) => state.sysSequenceConfig.SequenceNextVal
  );
  const customer = useSelector((state) => state.userMaster.customerMasters);

  const initialValues = {
    ReceiptId: props.data ? props.data.ReceiptId : 0,
    ReceiptType: props.data ? props.data.ReceiptType : "CUST",
    Value1: props.data ? parseInt(props.data.Value1) : "",
    Value2: props.data ? props.data.Value2 : "",
    Value3: props.data ? props.data.Value3 : "",
    Value4: props.data ? props.data.Value4 : "",
    Value5: props.data ? props.data.Value5 : "",
    ReceiptDate: moment(props.data ? selectedDate : selectedDate),
    ReceiptNo: props.data ? props.data.ReceiptNo : "",
    Amount: props.data ? parseFloat(props.data.Amount).toFixed(2) : 0,
    BalAmount: props.data ? props.data.BalAmount : 0,
    Remark: props.data ? props.data.Remark : "",
  };

  // console.log(initialValues)

  const onReset = () => {
    form.setFieldsValue({
      ReceiptType: "CUST",
      Value1: "",
      Value2: "",
      Value3: "",
      Value4: "",
      Value5: "",
      Remark: "",
    });
  };

  const onFinish = (values) => {
    const val = new RecieptHdr(
      values.ReceiptId ? values.ReceiptId : initialValues.ReceiptId,
      values.ReceiptType ? values.ReceiptType : initialValues.ReceiptType,
      values.Value1,
      values.Value2 ? values.Value2 : initialValues.Value2,
      values.Value3 ? values.Value3 : initialValues.Value3,
      values.Value4 ? values.Value4 : initialValues.Value4,
      values.Value5 ? values.Value5 : initialValues.Value5,
      moment(values.ReceiptDate).format("YYYY-MM-DD"),
      values.ReceiptNo,
      parseFloat(amount).toFixed(2),
      values.BalAmount === amount
        ? parseFloat(values.BalAmount).toFixed(2)
        : parseFloat(amount).toFixed(2),
      values.Remark
    );
    if (props.data && props.data.BalAmount > amount) {
      message.error("your balance amount could not be less");
    } else {
      setIsLoading(true);
      dispatch(InsUpdtRcpt(val, recieptDtlData));
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
        form.setFieldsValue({ ReceiptNo: Autocode[0].NextVal });
        setICodeDisable(true);
      }
    } else if (props.entryMode === "E") {
      form.setFieldsValue({
        ReceiptNo: props.data.ReceiptNo,
      });
      setICodeDisable(true);
    }
  }, [Autocode]);

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
                            name="ReceiptNo"
                            style={{
                              marginBottom: 5,
                              width: "calc(50% - 8px)",
                              // display: "inline-block",
                            }}
                            label="Reciept No"
                            rules={[
                              {
                                required: true,
                                message: "Please input your reciept number",
                              },
                            ]}
                            labelCol={12}
                            wrapperCol={12}
                          >
                            <Input
                              placeholder="Reciept number"
                              disabled={iCodeDisable}
                              style={{
                                textTransform: "uppercase",
                                marginLeft: 10,
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            labelCol={12}
                            wrapperCol={12}
                            name="ReceiptDate"
                            style={{
                              marginBottom: 5,
                              width: "calc(50% - 8px)",
                              // display: "inline-block",
                              marginLeft: 8,
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Please input your reciept date",
                              },
                            ]}
                            label="Receipt Date"
                          >
                            <DatePicker
                              style={{
                                marginLeft: 7,
                                width: "100%",
                              }}
                              disabled={props.data}
                              format={l_configDateFormat.value1}
                            />
                          </Form.Item>
                        </div>

                        <Form.Item
                          name="Value1"
                          style={{ marginBottom: 5 }}
                          label="Customer"
                          rules={[
                            {
                              required: true,
                              message: "Please select your customer",
                            },
                          ]}
                          className="receipt-value"
                        >
                          <Select
                            showSearch
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
                        <Form.Item
                          name="Remark"
                          style={{ marginBottom: 5 }}
                          label="Remark"
                          className="receipt-value"
                        >
                          <TextArea
                            rows={5}
                            placeholder="please enter your remark"
                          />
                        </Form.Item>
                        <Divider
                          type="horizontal"
                          style={{ marginBottom: 5, marginTop: 5 }}
                        />
                        <div>
                          <RecieptTableCard
                            recieptId={props.data ? props.data.ReceiptId : 0}
                            TotalAmount={(amount) => setAmount(amount)}
                            dtlData={(data) => setRecieptDtlData(data)}
                            disable={
                              props.data ? amount > props.data.BalAmount : false
                            }
                          />
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
                            disabled={
                              props.data ? amount > props.data.BalAmount : false
                            }
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
                              setAmount(0);
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

export default RecieptCard;
