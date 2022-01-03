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
  Select,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtStateMaster } from "../../../../store/actions/StateMaster";
import StateMaster from "../../../../models/StateMaster";

const { Option } = Select;
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
  const Country = useSelector((state) => state.countryMaster.countryMasters);
  const [isDefault, setIsDefault] = useState(
    props.formData ? props.formData.IsDefault : true
  );

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    CountryName: props.formData
      ? Country.find((ii) => ii.CountryCode === props.formData.CountryCode)
          .CountryCode
      : "",
    StateCode: props.formData ? props.formData.StateCode : "",
    StateName: props.formData ? props.formData.StateName : "",
    StateShortCode: props.formData ? props.formData.StateCode2Char : "",
    IsDefault: props.formData ? props.formData.IsDefault.toString() : "true",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
    GSTStateCode: props.formData ? props.formData.GSTStateCode : "",
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new StateMaster(
      values.StateCode,
      values.StateName,
      values.CountryName,
      values.StateShortCode,
      isDefault,
      values.Status === "true" ? true : false,
      values.GSTStateCode
    );

    // console.log(val, values.Status);
    dispatch(InsUpdtStateMaster(props.formData ? "U" : "I", val));
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
                  name="CountryName"
                  style={{ marginBottom: 5 }}
                  label="Country Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your country!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a country"
                    optionFilterProp="children"
                    allowClear={true}
                  >
                    {Country.map((ii) => (
                      <Option key={ii.CountryCode} value={ii.CountryCode}>
                        {ii.CountryName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="StateCode"
                  style={{ marginBottom: 5 }}
                  label="State Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your state code!",
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
                  name="StateName"
                  style={{ marginBottom: 5 }}
                  label="State Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your state  name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="StateShortCode"
                  style={{ marginBottom: 5 }}
                  label="State Short Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your state short code!",
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
                  name="GSTStateCode"
                  style={{ marginBottom: 5 }}
                  label="GST State Code"
                >
                  <Input maxLength={5} />
                </Form.Item>
                <Form.Item
                  name="IsDefault"
                  style={{ marginBottom: 5 }}
                  label="Default State"
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
