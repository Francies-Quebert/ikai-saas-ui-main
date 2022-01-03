import React, { useState, useEffect } from "react";
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
  Checkbox,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import { InsUpdtLocationMaster } from "../../../../store/actions/locationmaster";
import LocationMaster from "../../../../models/locationmaster";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtCountryMaster } from "../../../../store/actions/CountryMaster";
import CountryMaster from "../../../../models/CountryMaster";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const CountryMasterCardNew = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const [isDefault, setIsDefault] = useState(
    props.formData ? props.formData.IsDefault : true
  );
  const initialValues = {
    CountryCode: props.formData ? props.formData.CountryCode : "",
    CountryName: props.formData ? props.formData.CountryName : "",
    MobCode: props.formData ? props.formData.MobileCode : "",
    CurrencySymbolChar: props.formData ? props.formData.CurrencySymbolChar : "",
    CountryShortCode: props.formData ? props.formData.CountryCode2Char : "",
    CurrencyCode: props.formData ? props.formData.CurrencyCode : "",
    IsDefault: props.formData ? props.formData.IsDefault.toString() : "true",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new CountryMaster(
      values.CountryCode,
      values.CountryName,
      values.MobCode,
      null,
      values.CountryShortCode,
      null,
      isDefault,
      values.Status === "true" ? true : false
    );

    // console.log(val, "sa");
    dispatch(InsUpdtCountryMaster(props.formData ? "U" : "I", val));
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
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={0.37}>
            <CardHeader title={currentTran.formTitle} />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="CountryCode"
                  style={{ marginBottom: 5 }}
                  label="Country Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your country code!",
                    },
                  ]}
                >
                  <Input
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                    maxLength={3}
                  />
                </Form.Item>
                <Form.Item
                  name="CountryName"
                  style={{ marginBottom: 5 }}
                  label="Country Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your country name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="CountryShortCode"
                  style={{ marginBottom: 5 }}
                  label="Country Short Code"
                  
                  rules={[
                    {
                      required: true,
                      message: "Please input your country short code!",
                    },
                  ]}
                >
                  <Input
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                    maxLength={2}
                  />
                </Form.Item>
                <Form.Item
                  name="MobCode"
                  style={{ marginBottom: 5 }}
                  label="Mobile Code"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="IsDefault"
                  style={{ marginBottom: 5 }}
                  label="Default Country"
                >
                  <Checkbox
                    checked={isDefault}
                    onChange={(e) => {
                      setIsDefault(e.target.checked);
                    }}
                  ></Checkbox>
                </Form.Item>

                <Form.Item
                  name="Status"
                  label="Status"
                  style={{ marginBottom: 5 }}
                  rules={[{ required: true, message: "Please select Status!" }]}
                >
                  <Radio.Group>
                    <Radio value="true">Active</Radio>
                    <Radio value="false">InActive</Radio>
                  </Radio.Group>
                </Form.Item>
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
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
                    onClick={() => {
                      dispatch(reInitialize());
                      props.onBackPress();
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    type="primary"
                    icon={<Icon component={PrinterOutlined} />}
                    style={{ marginRight: 5 }}
                    onClick={props.OnPrint}
                  >
                    Print
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default CountryMasterCardNew;
