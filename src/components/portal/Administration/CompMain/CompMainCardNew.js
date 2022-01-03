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
  Modal,
  Tooltip,
} from "antd";
import { Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CardHeader from "../../../common/CardHeader";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  EditOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import swal from "sweetalert";
import { UpdtCompanyMaster } from "../../../../services/company-master";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const { Option } = Select;

const CompMainCardNew = (props) => {
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState();
  const currentTran = useSelector((state) => state.currentTran);
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const [isDisable, setIsDisable] = useState({ add: false, edit: false });
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

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
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    const data = {
      compCode: values.compCode,
      compShortName: values.compShortName,
      compName: values.compName,
      validity: values.validity,
      address1: values.address1,
      address2: values.address2,
      address3: values.address3,
      City: values.City,
      Pin: values.Pin,
      Country: values.Country,
      GST: values.GST,
      PAN: values.PAN,
      ContantPerson: values.ContantPerson,
      Directors: values.Directors,
      tel: values.tel,
      tel2: values.tel2,
      mobile: values.mobile,
      email: values.email,
      website: values.website,
      updt_usr: l_loginUser,
    };

    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        UpdtCompanyMaster(CompCode, data).then((res) => {
          if (res.data.message === "successful") {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress(values);
            props.onBackPress();
          } else if (res.data.message === "unsuccessful") {
            swal(
              `${
                res.data.data.code === "ER_DUP_ENTRY"
                  ? "Duplicate Entry"
                  : "Something Went Wrong Try Again Later...."
              }`,
              {
                icon: "error",
              }
            );
          }
        });
      }
    });
  };

  return (
    <div>
      <CardHeader title={currentTran.formTitle} />
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
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> Company Code :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="compCode"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="TableShort Code :"
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Company Code!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Please Enter Company Code!"
                        disabled={props.formData ? true : false}
                        maxLength={10}
                        onInput={(e) => {
                          e.target.value = ("" + e.target.value).toUpperCase();
                        }}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> Short Name :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="compShortName"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="TableShort Code :"
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Short Name!",
                        },
                      ]}
                    >
                      <Input placeholder="Please Enter Short Name!" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span>Company Name :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="compName"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="TableShort Code :"
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Company Name!",
                        },
                      ]}
                    >
                      <Input placeholder="Please Enter Company Name!" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> Flat / Building :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="address1"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Flat / Building!",
                        },
                      ]}
                    >
                      <Input placeholder="Please Enter Flat / Building!" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Area / Locality :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="address2"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter Area / Locality!" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  LandMark :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="address3"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter LandMark !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>{" "}
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> City :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="City"
                      style={{ marginBottom: 5, flex: 1 }}
                      rules={[
                        {
                          required: true,
                          message: "Please input your city!",
                        },
                      ]}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter City !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> Pincode :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="Pin"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Pincode !",
                        },
                      ]}
                    >
                      <Input placeholder="Please Enter Pincode !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> Country :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="Country"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Country !",
                        },
                      ]}
                    >
                      <Input placeholder="Please Enter Country !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>{" "}
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  GST No. :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="GST"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter GST No. !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  PAN No. :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="PAN"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter PAN No. !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Contact Person :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="ContantPerson"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Contact Person !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Directors :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="Directors"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Directors !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Telephone Number :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="tel"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Telephone Number !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Alternate Number :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="tel2"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Alternate Number !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Mobile Number :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="mobile"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Mobile Number !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Email :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="email"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter Email !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Website :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="website"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Website !" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
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
                  onClick={() => {
                    props.onBackPress();
                  }}
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

export default CompMainCardNew;
