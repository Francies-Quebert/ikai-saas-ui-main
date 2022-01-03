import React, { useState, useEffect } from "react";
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
  InputNumber,
} from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { InsUpdtPayModeMaster } from "../../../../store/actions/paymodemaster";
import { useDispatch, useSelector } from "react-redux";
import PaymodeMaster from "../../../../models/PaymentMode";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const PayMentModeCard = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);

  const initialValues = {
    PayCode: props.formData ? props.formData.PayCode : "",
    PayDesc: props.formData ? props.formData.PayDesc : "",
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new PaymodeMaster(
      values.PayCode,
      values.PayDesc,
      values.IsActive === "true" ? true : false
    );
    dispatch(InsUpdtPayModeMaster(props.formData ? "U" : "I", val));
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

  return (
    <div>
      <CardHeader title={"Add Configuration"} />
      <Row>
        <Col flex={1}>
          <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
            <Form
              labelAlign="left"
              name="userbody"
              {...formItemLayout}
              initialValues={initialValues}
              form={form}
              onFinish={onFinish}
            >
              <Form.Item
                name="PayCode"
                style={{ marginBottom: 5 }}
                label="Payment Code :"
                rules={[{ required: true, message: "Please Enter Code" }]}
              >
                <Input
                  disabled={props.formData ? true : false}
                  maxLength={10}
                />
              </Form.Item>
              <Form.Item
                name="PayDesc"
                style={{ marginBottom: 5 }}
                label="Payment Description :"
                rules={[
                  { required: true, message: " Description is required!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="IsActive"
                label="Status :"
                style={{ marginBottom: 5 }}
                // rules={[{ required: true, message: "Please select Status!" }]}
              >
                <Radio.Group>
                  <Radio value="true">Active</Radio>
                  <Radio value="false">InActive</Radio>
                </Radio.Group>
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
                  icon={<RetweetOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={onReset}
                >
                  Reset
                </Button>

                <Button
                  type="primary"
                  icon={<Icon component={RollbackOutlined} />}
                  style={{ marginRight: 5 }}
                  onClick={props.onBackPress}
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
    </div>
  );
};

export default PayMentModeCard;
