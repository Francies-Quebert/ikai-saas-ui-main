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
  Select,
  Tooltip,
  Modal,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import CompanyMasterCard from "../CompMain/CompMainCardNew";
import { fetchCompanyMaster } from "../../../../services/company-master";
import { InsUpdtBranchMaster } from "../../../../services/branch-master";
import swal from "sweetalert";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const { Option } = Select;

const BranchMasterCardNew = (props) => {
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState();
  const [isDisable, setIsDisable] = useState({
    add: false,
    edit: !props.formData ? true : false,
  });
  const currentTran = useSelector((state) => state.currentTran);
  const [companymaster, setCompanyMaster] = useState([]);
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    fetchCompanyMaster(CompCode).then((res) => {
      setCompanyMaster(res);
    });
  }, []);

  const initialValues = {
    CompCode: props.formData ? props.formData.CompCode : null,
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
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    const data = {
      InsUpdtType: props.formData ? "U" : "I",
      CompCode: values.CompCode,
      BranchCode: values.BranchCode,
      BranchName: values.BranchName,
      Add1: values.Add1,
      Add2: values.Add2,
      Add3: values.Add3,
      City: values.City,
      Pin: values.Pin,
      tel1: values.tel1,
      tel2: values.tel2,
      mobile: values.mobile,
      email: values.email,
      website: values.website,
      BranchType: values.BranchType,
      IsActive: values.IsActive,
      updt_usr: l_loginUser,
    };
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtBranchMaster(CompCode, data).then((res) => {
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
      <CardHeader title={props.title ? props.title : currentTran.formTitle} />
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
                  <span style={{ color: "red" }}>*</span>Company Code :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="CompCode"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="Section Code"
                      rules={[
                        {
                          required: true,
                          message: "Please select your company !",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        allowClear={true}
                        style={{ width: "100%" }}
                        optionFilterProp="children"
                        placeholder="Please Select Company"
                        disabled={props.formData}
                        onChange={(val) => {
                          if (val) {
                            setIsDisable({
                              ...isDisable,
                              add: false,
                              edit: false,
                            });
                          } else {
                            setIsDisable({
                              ...isDisable,
                              add: false,
                              edit: true,
                            });
                          }
                        }}
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
                    {/* <Tooltip title="Add New Company">
                      <Button
                        icon={<FileAddOutlined />}
                        style={{ margin: "3px 3px" }}
                        type="primary"
                        size="small"
                        shape="circle-outline"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 49).Rights.find(
                            (i) => i.RightCode === "ADD"
                          ).RightVal === "N" || isDisable.add
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "COMP",
                            entryMode: "A",
                          });
                        }}
                      />
                    </Tooltip> */}
                    <Tooltip title="Edit this Company">
                      <Button
                        icon={<EditOutlined />}
                        style={{ margin: "3px 3px" }}
                        size="small"
                        type="primary"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 49).Rights.find(
                            (i) => i.RightCode === "EDIT"
                          ).RightVal === "N" || isDisable.edit
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "COMP",
                            entryMode: "E",
                            formData: companymaster.find(
                              (i) =>
                                i.compCode === form.getFieldValue("CompCode")
                            ),
                          });
                        }}
                      />
                    </Tooltip>
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
                  <span style={{ color: "red" }}>*</span> Branch Code :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="BranchCode"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="TableShort Code :"
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Branch Code!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Please Enter Branch Code!"
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
                  <span style={{ color: "red" }}>*</span> Branch Name :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="BranchName"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="TableShort Code :"
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Branch Name!",
                        },
                      ]}
                    >
                      <Input placeholder="Please Enter Branch Name!" />
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
                  Flat / Building :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="Add1"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter Flat/Building !" />
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
                  Area / Locality :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="Add2"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Area / Locality !" />
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
                  Landmark :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="Add3"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Landmark !" />
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
                  City :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="City"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  City !" />
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
                          message: "Please input your pincode !",
                        },
                      ]}
                    >
                      <Input placeholder="Please Enter  Pincode !" />
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
                  Telephone :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="tel1"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input placeholder="Please Enter  Telephone !" />
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
                      <Input type="email" placeholder="Please Enter Email !" />
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
                      <Input placeholder="Please Enter Website !" />
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
                  Branch Type :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="BranchType"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Input
                        placeholder="Please Enter Branch Type !"
                        disabled
                      />
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
                  Status :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="IsActive"
                      // label="Status :"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Radio.Group>
                        <Radio value={true}>Active</Radio>
                        <Radio value={false}>InActive</Radio>
                      </Radio.Group>
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
                  onClick={props.onBackPress}
                >
                  Back
                </Button>
              </Form.Item>
            </Form>{" "}
            {isShowModal && (
              <Modal
                visible={isShowModal}
                onCancel={() => {
                  setIsShowModal();
                }}
                footer={null}
                bodyStyle={{ padding: 0 }}
                closable={true}
                width={750}
                destroyOnClose={true}
              >
                <CompanyMasterCard
                  title="Company Master"
                  onBackPress={() => setIsShowModal()}
                  formData={isShowModal.formData}
                  onSavePress={(val) => {
                    if (val) {
                      fetchCompanyMaster(CompCode).then((res) => {
                        setCompanyMaster(res);
                        form.setFieldsValue({ CompCode: val.compCode });
                        setIsDisable({
                          ...isDisable,
                          edit: false,
                        });
                      });
                    } else {
                      fetchCompanyMaster(CompCode).then((res) => {
                        setCompanyMaster(res);
                        form.setFieldsValue({
                          CompCode: initialValues
                            ? initialValues.CompCode
                            : null,
                        });
                        setIsDisable({
                          ...isDisable,
                          edit: true,
                        });
                      });
                    }
                  }}
                />
              </Modal>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BranchMasterCardNew;
