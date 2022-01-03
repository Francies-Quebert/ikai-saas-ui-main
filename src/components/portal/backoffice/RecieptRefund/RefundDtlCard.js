import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Radio, Button, Row, Col, Card, Input, Spin, Select } from "antd";
import { Divider } from "antd";
import {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
} from "@ant-design/icons";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const { TextArea } = Input;

const RefundDtlCard = (props) => {
  const [form] = Form.useForm();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const paymentmode = useSelector((state) => state.paymodeMaster.paymodeMaster);

  const initialValues = {
    Id: props.data.data ? props.data.data.Id : 0,
    RefundId: props.data.data ? props.data.data.RefundId : "",
    PaymentMode: props.data.data ? props.data.data.PaymentMode : "",
    Amount: props.data.data ? props.data.data.Amount : props.refundableAmount,
    Remark: props.data.data ? props.data.data.Remark : "",
  };

  const onFinish = (values) => {
    if (props.data.entryMode === "A") {
      let newData = {
        // ...props.data.data,
        Id: 0,
        key:
          props.dataSource.length > 0
            ? parseInt(props.dataSource[props.dataSource.length - 1].key) + 1
            : 0,
        PaymentMode: values.PaymentMode,
        Amount: values.Amount,
        Remark: values.Remark,
        RefundId: props.refundId ? props.refundId : null,
      };
      props.onDialogSave(newData);

      // console.log(newData, "dtl add data");
    } else {
      let newData = {
        ...props.data.data,
        Id: props.data.data.Id,
        key: props.data.data
          ? props.data.data.key
          : props.dataSource.length > 0
          ? parseInt(props.dataSource[props.dataSource.length - 1].key) + 1
          : 0,
        PaymentMode: values.PaymentMode,
        Amount: values.Amount,
        Remark: values.Remark,
        RefundId: props.data.data ? props.data.data.RefundId : null,
      };
      props.onDialogSave(newData);
      // console.log(newData, "dtl edit data");
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

export default RefundDtlCard;
