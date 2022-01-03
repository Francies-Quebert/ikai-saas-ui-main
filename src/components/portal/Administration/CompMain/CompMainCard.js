import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Radio, Button, Row, Col, Card, Input, Spin } from "antd";
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
import { UpdtCompMain } from "../../../../store/actions/compmain";
import CompMain from "../../../../models/compmain";
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const CompMainCard = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [compCode, setCompCode] = useState(
    props.formData ? props.formData.compCode : ""
  );
  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    compCode: props.formData ? props.formData.compCode : "",
    compShortName: props.formData ? props.formData.compShortName : "",
    compName: props.formData ? props.formData.compName : "",
    validity: props.formData ? props.formData.validity : "",
    address1: props.formData ? props.formData.address1 : "",
    address2: props.formData ? props.formData.address2 : "",
    address3: props.formData ? props.formData.address3 : "",
    City: props.formData ? props.formData.City : "",
    Pin: props.formData ? props.formData.Pin : "",
    Country: props.formData ? props.formData.Country : "",
    GST: props.formData ? props.formData.GST : "",
    PAN: props.formData ? props.formData.PAN : "",
    ContantPerson: props.formData ? props.formData.ContantPerson : "",
    Directors: props.formData ? props.formData.Directors : "",
    tel: props.formData ? props.formData.tel : "",
    tel2: props.formData ? props.formData.tel2 : "",
    mobile: props.formData ? props.formData.mobile : "",
    email: props.formData ? props.formData.email : "",
    website: props.formData ? props.formData.website : "",
  };

  //   console.log(initialValues, "Hey");
  const onFinish = (values) => {
    setIsLoading(true);

    const val = new CompMain(
      values.compCode,
      values.compShortName,
      values.compName,
      values.validity,
      values.address1,
      values.address2,
      values.address3,
      values.City,
      values.Pin,
      values.Country,
      values.GST,
      values.PAN,
      values.ContantPerson,
      values.Directors,
      values.tel,
      values.tel2,
      values.mobile,
      values.email,
      values.website
    );

    // console.log(val, "jeey");
    dispatch(UpdtCompMain(val));
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
                labelAlign="left"
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="compCode"
                  style={{ marginBottom: 5 }}
                  label="Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your company code!",
                    },
                  ]}
                >
                  <Input disabled={compCode ? true : false} maxLength={10} />
                </Form.Item>
                <Form.Item
                  name="compShortName"
                  style={{ marginBottom: 5 }}
                  label="Short Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your company short name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="compName"
                  style={{ marginBottom: 5 }}
                  label="Company Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your company name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="address1"
                  style={{ marginBottom: 5 }}
                  label="Flat / Building"
                  rules={[
                    {
                      required: true,
                      message: "Please input your company address!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="address2"
                  style={{ marginBottom: 5 }}
                  label="Area / Locality"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="address3"
                  style={{ marginBottom: 5 }}
                  label="LandMark"
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
                      message: "Please input your city!",
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
                      message: "Please input your pincode!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Country"
                  style={{ marginBottom: 5 }}
                  label="Country"
                  rules={[
                    {
                      required: true,
                      message: "Please input your country!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="GST"
                  style={{ marginBottom: 5 }}
                  label="GST No."
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="PAN"
                  style={{ marginBottom: 5 }}
                  label="PAN No."
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="ContantPerson"
                  style={{ marginBottom: 5 }}
                  label="Contant Person"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Directors"
                  style={{ marginBottom: 5 }}
                  label="Directors"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="tel"
                  style={{ marginBottom: 5 }}
                  label="Telephone Number"
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
                  label="Mobile Number"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input your pincode!",
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
                  <Input />
                </Form.Item>
                <Form.Item
                  name="website"
                  style={{ marginBottom: 5 }}
                  label="Website"
                >
                  <Input />
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

export default CompMainCard;
