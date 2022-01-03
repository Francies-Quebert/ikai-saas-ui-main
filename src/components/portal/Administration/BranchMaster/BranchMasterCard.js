import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Radio, Button, Row, Col, Card, Input, Spin, Select } from "antd";
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
import { InsUpdtBranchMaster } from "../../../../store/actions/branchmaster";
import BranchMaster from "../../../../models/branchmaster";
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const { Option } = Select;

const BranchMasterCard = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [branchCode, setBranchCode] = useState(
    props.formData ? props.formData.BranchCode : ""
  );
  const [compCode, setCompCode] = useState(
    props.formData ? props.formData.CompCode : ""
  );
  const companymaster = useSelector((state) => state.compmain.compMain);

  const onReset = () => {
    form.resetFields();
  };
  const initialValues = {
    CompCode: props.formData ? props.formData.CompCode : "",
    BranchCode: props.formData ? props.formData.BranchCode : "",
    BranchName: props.formData ? props.formData.BranchName : "",
    Add1: props.formData ? props.formData.Add1 : "",
    Add2: props.formData ? props.formData.Add2 : "",
    Add3: props.formData ? props.formData.Add3 : "",
    City: props.formData ? props.formData.City : "",
    Pin: props.formData ? props.formData.Pin : "",
    tel1: props.formData ? props.formData.tel1 : "",
    tel2: props.formData ? props.formData.tel2 : "",
    mobile: props.formData ? props.formData.mobile : "",
    email: props.formData ? props.formData.email : "",
    website: props.formData ? props.formData.website : "",
    BranchType: props.formData ? props.formData.BranchType : "",
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new BranchMaster(
      values.CompCode,
      values.BranchCode,
      values.BranchName,
      values.Add1,
      values.Add2,
      values.Add3,
      values.City,
      values.Pin,
      values.tel1,
      values.tel2,
      values.mobile,
      values.email,
      values.website,
      values.BranchType,
      values.IsActive === "true" ? true : false
    );
    // console.log(props.formData ? "U" : "I", val);
    dispatch(InsUpdtBranchMaster(props.formData ? "U" : "I", val));
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
            <CardHeader
              title={props.title ? props.title : currentTran.formTitle}
            />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                labelAlign="left"
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="CompCode"
                  style={{ marginBottom: 5 }}
                  label="Company Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your company code!",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    disabled={compCode ? true : false}
                  >
                    {companymaster.length > 0 &&
                      companymaster.map((ii) => {
                        return (
                          <Option
                            key={ii.compCode}
                            value={ii.compCode}
                          >{`${ii.compShortName} (${ii.compName})`}</Option>
                        );
                      })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="BranchCode"
                  style={{ marginBottom: 5 }}
                  label="Branch Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your branch code!",
                    },
                  ]}
                >
                  <Input
                    disabled={branchCode ? true : false}
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="BranchName"
                  style={{ marginBottom: 5 }}
                  label="Branch Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your branch name !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Add1"
                  style={{ marginBottom: 5 }}
                  label="Flat / Building"
                  rules={[
                    {
                      required: true,
                      message: "Please input your address !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Add2"
                  style={{ marginBottom: 5 }}
                  label="Area / Locality"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input your address !",
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Add3"
                  style={{ marginBottom: 5 }}
                  label="Landmark"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input your address !",
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="City"
                  style={{ marginBottom: 5 }}
                  label="City"
                  rules={[
                    {
                      required: true,
                      message: "Please input your city !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Pin"
                  style={{ marginBottom: 5 }}
                  label="Pincode"
                  rules={[
                    {
                      required: true,
                      message: "Please input your pincode !",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="tel1"
                  style={{ marginBottom: 5 }}
                  label="Telephone"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="tel2"
                  style={{ marginBottom: 5 }}
                  label="Alternate Number"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="mobile"
                  style={{ marginBottom: 5 }}
                  label="Mobile No."
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input your mobile number !",
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  style={{ marginBottom: 5 }}
                  label="Email"
                >
                  <Input type="email" />
                </Form.Item>
                <Form.Item
                  name="website"
                  style={{ marginBottom: 5 }}
                  label="Website"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="BranchType"
                  style={{ marginBottom: 5 }}
                  label="Branch Type"
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  name="IsActive"
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

export default BranchMasterCard;
