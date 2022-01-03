import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Radio, Button, Row, Col, Card, Input, Spin, Select } from "antd";
import { Divider } from "antd";
import {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import Cash from "../../../../assets/IconSVG/cash.svg";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const { TextArea } = Input;

const RecieptDtlCard = (props) => {
  const [form] = Form.useForm();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const paymentmode = useSelector((state) => state.paymodeMaster.paymodeMaster);

  const initialValues = {
    Id: props.data ? props.data.Id : 0,
    ReceiptId: props.data ? props.data.ReceiptId : props.RecieptId,
    PaymentMode: props.data ? props.data.PaymentMode : "",
    Amount: props.data ? props.data.Amount : 0,
    Remark: props.data ? props.data.Remark : "",
    SysOption1: props.data ? props.data.SysOption1 : null,
    SysOption2: props.data ? props.data.SysOption2 : null,
    SysOption3: props.data ? props.data.SysOption3 : null,
    SysOption4: props.data ? props.data.SysOption4 : null,
    SysOption5: props.data ? props.data.SysOption5 : null,
  };

  const onFinish = (values) => {
    if (props.entrymode === "A") {
      let newData = {
        ...props.data,
        Id: 0,
        key: props.data
          ? props.data.key
          : props.dataSource.length > 0
          ? parseInt(props.dataSource[props.dataSource.length - 1].key) + 1
          : 0,
        PaymentMode: values.PaymentMode,
        Amount: values.Amount,
        Remark: values.Remark,
        RecieptId: props.RecieptId ? props.RecieptId : null,
        SysOption1: null,
        SysOption2: null,
        SysOption3: null,
        SysOption4: null,
        SysOption5: null,
      };
      props.onDialogSave(newData);
    } else {
      let newData = {
        ...props.data,
        Id: props.data.Id,
        key: props.data
          ? props.data.key
          : props.dataSource.length > 0
          ? parseInt(props.dataSource[props.dataSource.length - 1].key) + 1
          : 0,
        PaymentMode: values.PaymentMode,
        Amount: values.Amount,
        Remark: values.Remark,
        RecieptId: props.recieptId ? props.recieptId : 0,
        SysOption1: props.data.SysOption1,
        SysOption2: props.data.SysOption2,
        SysOption3: props.data.SysOption3,
        SysOption4: props.data.SysOption4,
        SysOption5: props.data.SysOption5,
      };
      props.onDialogSave(newData);
    }
  };

  return (
    <div>
      <Row>
        <Col flex={1}>
          <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
            <Form
              form={form}
              initialValues={initialValues}
              name="userbody"
              labelAlign="left"
              {...formItemLayout}
              onFinish={onFinish}
            >
              <Form.Item
                name="PaymentMode"
                label="Payment Mode"
                style={{ marginBottom: 5 }}
                rules={[
                  {
                    required: true,
                    message: "Please input your payment mode",
                  },
                ]}
              >
                <Radio.Group buttonStyle="solid" style={{ marginBottom: 5 }}>
                  {paymentmode.map((item) => {
                    return (
                      <Radio
                        style={{ marginBottom: 5, marginRight: 5 }}
                        value={item.PayCode}
                        key={item.PayCode}
                      >
                        {item.PayDesc}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="Amount"
                style={{ marginBottom: 5 }}
                label="Amount"
                rules={[
                  {
                    required: true,
                    message: "Please input your amount ",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="please enter amount"
                  step="0.01"
                />
              </Form.Item>
              <Form.Item
                name="Remark"
                style={{ marginBottom: 5 }}
                label="Remark"
              >
                <TextArea rows={5} placeholder="please enter your remark" />
              </Form.Item>
              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
              <Form.Item noStyle={true}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  style={{ marginRight: 5 }}
                >
                  Save
                </Button>
                <Button
                  type="primary"
                  icon={<RollbackOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => props.onBackPress()}
                >
                  Back
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RecieptDtlCard;
