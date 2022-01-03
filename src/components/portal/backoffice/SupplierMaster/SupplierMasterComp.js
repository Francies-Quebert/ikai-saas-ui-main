import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Select,
  Card,
  Radio,
  Modal,
  Input,
  Divider,
  Row,
  Col,
  Tabs,
  InputNumber,
  notification,
} from "antd";
import Icon, {
  SaveOutlined,
  RetweetOutlined,
  RollbackOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { InsUpdtSupplierMaster } from "../../../../services/supplier-master-comp";
import { fetchSequenceNextVal } from "../../../../services/sys-sequence-config";
import _ from "lodash";
const { Option } = Select;
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SupplierMasterComp = (props) => {
  const [form] = Form.useForm();
  const cityMaster = useSelector((state) => state.cityMaster);
  const countryMaster = useSelector((state) => state.countryMaster);
  const stateMaster = useSelector((state) => state.stateMaster);
  const supplierMaster = useSelector(
    (state) => state.AppMain.otherMasterSupplierType
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [resident, setResident] = useState({
    country: null,
    state: null,
    city: null,
  });

  const dispatch = useDispatch();
  const sys_seq = useSelector((state) =>
    state.AppMain.sysSequenceConfig.find((aa) => aa.TranType === "SUPP")
  );
  const initialValues = {
    IsActive: props.formData ? props.formData.IsActive : true,
    accountHolderName: props.formData ? props.formData.accountHolderName : null,
    accountNo: props.formData ? props.formData.accountNo : null,
    add1: props.formData ? props.formData.add1 : null,
    add2: props.formData ? props.formData.add2 : null,
    add3: props.formData ? props.formData.add3 : null,
    chequeName: props.formData ? props.formData.chequeName : null,
    city: props.formData
      ? props.formData.city
      : cityMaster.cityMasters.find((cc) => cc.IsDefault === true)
      ? cityMaster.cityMasters.find((cc) => cc.IsDefault === true).CityCode
      : null,
    country: props.formData
      ? props.formData.country
      : countryMaster.countryMasters.find((cc) => cc.IsDefault === true)
      ? countryMaster.countryMasters.find((cc) => cc.IsDefault === true)
          .CountryCode
      : null,
    creditDays: props.formData ? props.formData.creditDays : null,
    creditLimit: props.formData ? props.formData.creditLimit : null,
    emailId: props.formData ? props.formData.emailId : null,
    gstNo: props.formData ? props.formData.gstNo : null,
    ifscCode: props.formData ? props.formData.ifscCode : null,
    mobileNo: props.formData ? props.formData.mobileNo : null,
    panNo: props.formData ? props.formData.panNo : null,
    pinCode: props.formData ? props.formData.pinCode : null,
    state: props.formData
      ? props.formData.state
      : stateMaster.stateMasters.find((cc) => cc.IsDefault === true)
      ? stateMaster.stateMasters.find((cc) => cc.IsDefault === true).StateCode
      : null,
    suppCode: props.formData ? props.formData.suppCode : null,
    suppName: props.formData ? props.formData.suppName : null,
    suppType: props.formData ? props.formData.suppType : "DTRD",
    updt_usr: l_loginUser,
    upiId: props.formData ? props.formData.upiId : null,
  };

  useEffect(() => {}, [resident]);

  const onFinish = async (values) => {
    let tsuppCode;
    if (!props.formData && sys_seq.ConfigType === "A") {
      await fetchSequenceNextVal(CompCode, {
        TranType: "SUPP",
        updt_usr: l_loginUser,
      }).then((res) => {
        console.log(res,"comp code supplier")
        tsuppCode = res[0].NextVal;
      });
    } else {
      tsuppCode = values.suppCode;
    }

    let data = {
      ...values,
      updt_usr: l_loginUser,
      suppCode: _.capitalize(tsuppCode),
    };

    swal("Are you sure you want to save", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtSupplierMaster(CompCode, data).then((res) => {
          if (res.data.message === "successful") {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onBackPress(res);
            form.resetFields();
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
    <>
      <Row>
        <Col span={24}>
          <CardHeader title={"Supplier Master"} />
          <Card
            bodyStyle={{
              padding: "0px 5px 5px",
            }}
          >
            <Form
              form={form}
              name="userbody"
              labelAlign="left"
              {...formItemLayout}
              initialValues={initialValues}
              size="middle"
              onFinish={onFinish}
            >
              <Row>
                <Col
                  xl={12}
                  lg={12}
                  md={24}
                  sm={24}
                  xs={24}
                  style={{ borderRight: "1px solid #f0f0fo" }}
                >
                  <Card bordered={false} bodyStyle={{ padding: "7px 12px" }}>
                    <Row style={{ margin: "0px 0px 5px 0px" }}>
                      <Col
                        style={{ alignSelf: "center" }}
                        xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={24}
                      >
                        {props.formData
                          ? true
                          : sys_seq.ConfigType === "A"
                          ? false
                          : true && <span></span>}
                        {<span style={{ color: "red" }}>*</span>}
                        Supplier Code :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="suppCode"
                            style={{ marginBottom: 0, flex: 1 }}
                            wrapperCol={24}
                            rules={[
                              {
                                required: props.formData
                                  ? true
                                  : sys_seq.ConfigType === "A"
                                  ? false
                                  : true,
                                message: "Please Enter Supplier Code",
                              },
                            ]}
                          >
                            <Input
                              onBlur={(e) => {
                                if (
                                  props.datasource.find(
                                    (ff) => ff.suppCode === e.target.value
                                  )
                                ) {
                                  notification.error({
                                    message: `${e.target.value} already exists please enter a new code`,
                                    description:
                                      "The Supplier code your trying to enter already exist please try again with a new supplier code.",
                                  });
                                  form.setFieldsValue({ suppCode: null });
                                }
                              }}
                              disabled={
                                props.formData
                                  ? true
                                  : sys_seq.ConfigType === "A"
                                  ? true
                                  : false
                              }
                              placeholder={`${
                                sys_seq.ConfigType !== "A"
                                  ? "Supplier Code"
                                  : "*Auto Generated*"
                              }`}
                              style={{ textTransform: "uppercase" }}
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
                        <span style={{ color: "red" }}>*</span>
                        Supplier Name :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="suppName"
                            style={{ marginBottom: 0, flex: 1 }}
                            wrapperCol={24}
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Supplier Name",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Supplier Name"
                              // style={{ textTransform: "uppercase" }}
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
                        <span style={{ color: "red" }}>*</span>
                        Supplier Type :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="suppType"
                            style={{ marginBottom: 0, flex: 1 }}
                            wrapperCol={24}
                            rules={[
                              {
                                required: true,
                                message: "Please Select Supplier Type",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Please Select Supplier Type"
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                            >
                              {supplierMaster.length > 0 &&
                                supplierMaster.map((i) => {
                                  return (
                                    <Option
                                      key={i.ShortCode}
                                      value={i.ShortCode}
                                    >
                                      {i.MasterDesc}
                                    </Option>
                                  );
                                })}
                            </Select>
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
                        {/* <span style={{ color: "red" }}>*</span>  */}
                        Cheque Name :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="chequeName"
                            style={{ marginBottom: 0, flex: 1 }}
                            wrapperCol={24}
                            rules={[
                              {
                                required: false,
                                message: "Please Enter Cheque Name",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Cheque Name"
                              // style={{ textTransform: "uppercase" }}
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
                        <span style={{ color: "red" }}></span> GST No :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="gstNo"
                            style={{ marginBottom: 0, flex: 1 }}
                            wrapperCol={24}
                            rules={[
                              {
                                required: false,
                                message: "Please Enter Supplier Name",
                              },
                            ]}
                          >
                            <Input
                              placeholder="GST No"
                              // style={{ textTransform: "uppercase" }}
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
                        <span style={{ color: "red" }}></span> PAN No :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="panNo"
                            style={{ marginBottom: 0, flex: 1 }}
                            wrapperCol={24}
                            rules={[
                              {
                                required: false,
                                // message: "Please Enter Supplier Name",
                              },
                            ]}
                          >
                            <Input
                              placeholder="PAN No"
                              // style={{ textTransform: "uppercase" }}
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
                        <span style={{ color: "red" }}></span> Credit Days :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="creditDays"
                            style={{ marginBottom: 0, flex: 1 }}
                            wrapperCol={24}
                            rules={[
                              {
                                required: false,
                                // message: "Please Enter Supplier Name",
                              },
                            ]}
                          >
                            <InputNumber
                              min={1}
                              placeholder="Credit Days"
                              style={{ width: "100%", maxWidth: "100%" }}
                            />
                            {/* <Input
                            placeholder="Credit Limit"
                            // style={{ textTransform: "uppercase" }}
                          /> */}
                          </Form.Item>
                          <Col
                            style={{
                              alignSelf: "center",
                              flex: 1,
                              textAlign: "center",
                            }}
                            // xl={6}
                            // lg={6}
                            // md={6}
                            // sm={6}
                            // xs={24}
                          >
                            <span style={{ color: "red" }}></span> Credit Limit
                            :
                          </Col>
                          <Col
                          // xl={6} lg={6} md={6} sm={6} xs={24}
                          >
                            {/* <div style={{ display: "flex", flex: 1 }}> */}
                            <Form.Item
                              name="creditLimit"
                              style={{ marginBottom: 0, flex: 1 }}
                              wrapperCol={24}
                              rules={[
                                {
                                  required: false,
                                  // message: "Please Enter Supplier Name",
                                },
                              ]}
                            >
                              <InputNumber
                                min={1}
                                placeholder="Credit Limit"
                                style={{ width: "100%", maxWidth: "100%" }}
                              />
                              {/* <Input
                              placeholder="Credit Days"
                              // style={{ textTransform: "uppercase" }}
                            /> */}
                            </Form.Item>
                            {/* </div> */}
                          </Col>
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
                        <span style={{ color: "red" }}></span> Status :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <Form.Item
                            name="IsActive"
                            style={{ marginBottom: 0, flex: 1 }}
                            wrapperCol={24}
                            // style={{ marginBottom: 5 }}
                            rules={[
                              {
                                required: true,
                                message: "Please Select Status",
                              },
                            ]}
                          >
                            <Radio.Group>
                              <Radio value={true}>Active</Radio>
                              <Radio value={false}>InActive</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col
                  xl={12}
                  lg={12}
                  md={24}
                  sm={24}
                  xs={24}
                  style={{ borderLeft: "1px solid #f0f0fo" }}
                >
                  <Card bordered={false} bodyStyle={{ padding: "7px 12px" }}>
                    <Row style={{ margin: "0px 0px 5px 0px" }}>
                      <Col
                        style={{ alignSelf: "center" }}
                        xl={6}
                        lg={6}
                        md={6}
                        sm={6}
                        xs={24}
                      >
                        <span style={{ color: "red" }}></span> Address :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex", width: "100%" }}>
                            <Form.Item
                              name="add1"
                              style={{
                                marginBottom: 0,
                                flex: 1,
                                width: "70%",
                              }}
                              wrapperCol={24}
                              rules={[
                                {
                                  required: false,
                                  message: "Please Enter Supplier Address",
                                },
                              ]}
                            >
                              <Input placeholder="Shop No / Flat No"></Input>
                            </Form.Item>
                          </div>
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
                      ></Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex", width: "100%" }}>
                            <Form.Item
                              name="add2"
                              style={{
                                marginBottom: 0,
                                flex: 1,
                                width: "70%",
                              }}
                              wrapperCol={24}
                              rules={[
                                {
                                  required: false,
                                  message: "Please Enter Supplier Address",
                                },
                              ]}
                            >
                              <Input placeholder="Village / Area / Road"></Input>
                            </Form.Item>
                          </div>
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
                      ></Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex", width: "100%" }}>
                            <Form.Item
                              name="add3"
                              style={{
                                marginBottom: 0,
                                flex: 1,
                                width: "70%",
                              }}
                              wrapperCol={24}
                              rules={[
                                {
                                  required: false,
                                  message: "Please Enter Supplier Address",
                                },
                              ]}
                            >
                              <Input placeholder="Taluka / Town"></Input>
                            </Form.Item>
                          </div>
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
                        <span style={{ color: "red" }}></span> Country :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex", width: "50%" }}>
                            <Form.Item
                              name="country"
                              style={{
                                marginBottom: 0,
                                flex: 1,
                                width: "70%",
                              }}
                              wrapperCol={24}
                              rules={[
                                {
                                  required: false,
                                  message: "Please Enter Supplier Country",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Country"
                                onChange={(val) => {
                                  setResident((oldData) => {
                                    return {
                                      ...oldData,
                                      country: val,
                                      state: null,
                                      city: null,
                                    };
                                  });

                                  form.setFieldsValue({
                                    state: null,
                                    city: null,
                                  });
                                }}
                                allowClear={true}
                                showSearch
                                optionFilterProp="children"
                              >
                                {countryMaster.countryMasters.map((country) => {
                                  return (
                                    <Option
                                      key={country.CountryCode}
                                      value={country.CountryCode}
                                    >
                                      {country.CountryName}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </div>
                          <Col
                            style={{
                              alignSelf: "center",
                              textAlign: "center",
                            }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}></span> State :
                          </Col>
                          <Col xl={10} lg={10} md={10} sm={10} xs={24}>
                            <div style={{ display: "flex" }}>
                              <div style={{ display: "flex", width: "100%" }}>
                                <Form.Item
                                  name="state"
                                  style={{
                                    marginBottom: 0,
                                    flex: 1,
                                    width: "70%",
                                  }}
                                  wrapperCol={24}
                                  rules={[
                                    {
                                      required: false,
                                      message: "Please Enter Supplier State",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="State"
                                    onChange={(val) => {
                                      setResident((oldData) => {
                                        return { ...oldData, state: val };
                                      });
                                      form.setFieldsValue({ city: null });
                                    }}
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear={true}
                                  >
                                    {stateMaster.stateMasters
                                      .filter((sf) => {
                                        return (
                                          sf.CountryCode === resident.country ||
                                          !resident.country ||
                                          resident.country === null
                                        );
                                      })
                                      .map((state) => {
                                        return (
                                          <Option
                                            key={state.StateCode}
                                            value={state.StateCode}
                                          >
                                            {state.StateName}
                                          </Option>
                                        );
                                      })}
                                  </Select>
                                </Form.Item>
                              </div>
                            </div>
                          </Col>
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
                        <span style={{ color: "red" }}></span> City :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex", width: "50%" }}>
                            <Form.Item
                              name="city"
                              style={{
                                marginBottom: 0,
                                flex: 1,
                                width: "70%",
                              }}
                              wrapperCol={24}
                              rules={[
                                {
                                  required: false,
                                  message: "Please Enter City",
                                },
                              ]}
                            >
                              <Select
                                placeholder="City"
                                allowClear={true}
                                showSearch
                                optionFilterProp="children"
                              >
                                {cityMaster.cityMasters
                                  .filter(
                                    (sf) =>
                                      (sf.CountryCode === resident.country &&
                                        sf.StateCode === resident.state) ||
                                      !resident.country ||
                                      resident.country === null ||
                                      !resident.state ||
                                      resident.state === null
                                  )
                                  .map((city) => {
                                    return (
                                      <Option
                                        key={city.CityCode}
                                        value={city.CityCode}
                                      >
                                        {city.CityName}
                                      </Option>
                                    );
                                  })}
                              </Select>
                            </Form.Item>
                          </div>
                          <Col
                            style={{
                              alignSelf: "center",
                              textAlign: "center",
                            }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            <span style={{ color: "red" }}></span> Pin Code :
                          </Col>
                          <Col xl={10} lg={10} md={10} sm={10} xs={24}>
                            <div style={{ display: "flex" }}>
                              <div style={{ display: "flex", width: "100%" }}>
                                <Form.Item
                                  name="pinCode"
                                  style={{
                                    marginBottom: 0,
                                    flex: 1,
                                    width: "70%",
                                  }}
                                  wrapperCol={24}
                                  rules={[
                                    {
                                      required: false,
                                      message: "Please Enter Pin Code",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Pin Code"></Input>
                                </Form.Item>
                              </div>
                            </div>
                          </Col>
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
                        <span style={{ color: "red" }}></span> Tel.No/Mobile No
                        :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex", width: "100%" }}>
                            <Form.Item
                              name="mobileNo"
                              style={{
                                marginBottom: 0,
                                flex: 1,
                                width: "70%",
                              }}
                              wrapperCol={24}
                              rules={[
                                {
                                  required: false,
                                  message: "Please Enter Supplier Mobile No",
                                },
                              ]}
                            >
                              <Input
                                placeholder="Enter Mobile No."
                                style={{ width: "100%", maxWidth: "100%" }}
                              />
                            </Form.Item>
                          </div>
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
                        <span style={{ color: "red" }}></span> Email Id :
                      </Col>
                      <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                        <div style={{ display: "flex" }}>
                          <div style={{ display: "flex", width: "100%" }}>
                            <Form.Item
                              name="emailId"
                              style={{
                                marginBottom: 0,
                                flex: 1,
                                width: "70%",
                              }}
                              wrapperCol={24}
                              rules={[
                                {
                                  required: false,
                                  message: "Please Enter Email",
                                },
                              ]}
                            >
                              <Input placeholder="Email Id"></Input>
                            </Form.Item>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Tabs type="card" tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="Bank Information" key="1" forceRender={true}>
                  {/* <Col xs={24} style={{ padding: "7px 0px 7px 12px" }}> */}
                  <div style={{ padding: "7px 12px" }}>
                    <Form.Item
                      name="upiId"
                      style={{
                        marginBottom: 0,
                        // flex: 1,
                        // width: "70%",
                      }}
                      // labelCol={6}
                      // wrapperCol={14}
                      rules={[
                        {
                          required: false,
                          message: "Please Enter UPI Id",
                        },
                      ]}
                      label="UPI Id"
                    >
                      <Input placeholder="UPI Id"></Input>
                    </Form.Item>
                    {/* </Col> */}
                    {/* <Col
                    xl={12}
                    xs={24}
                    style={{ padding: "7px 0px 7px 12px" }}
                  > */}
                    <Form.Item
                      name="accountNo"
                      style={{
                        marginBottom: 0,
                        // flex: 1,
                        // width: "70%",
                      }}
                      // wrapperCol={24}
                      rules={[
                        {
                          required: false,
                          message: "Please Enter Account No",
                        },
                      ]}
                      label="Account No"
                    >
                      <Input placeholder="Account No"></Input>
                    </Form.Item>
                    <Form.Item
                      name="accountHolderName"
                      style={{
                        marginBottom: 0,
                        // flex: 1,
                        // width: "70%",
                      }}
                      // wrapperCol={24}
                      rules={[
                        {
                          required: false,
                          message: "Please Enter Account Holder Name",
                        },
                      ]}
                      label="Account Holder Name"
                    >
                      <Input placeholder="Account Holder Name"></Input>
                    </Form.Item>
                    <Form.Item
                      name="ifscCode"
                      style={{
                        marginBottom: 0,
                        // flex: 1,
                        // width: "70%",
                      }}
                      // wrapperCol={24}
                      rules={[
                        {
                          required: false,
                          message: "Please Enter IFSC Code",
                        },
                      ]}
                      label="IFSC Code"
                    >
                      <Input placeholder="IFSC Code"></Input>
                    </Form.Item>
                    {/* </Col> */}
                  </div>
                </TabPane>
                {/* <TabPane tab="Opening Balance" key="2" forceRender={true}>
                  Content of Tab Pane 2
                </TabPane> */}
              </Tabs>
              <Form.Item noStyle={true}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  style={{ marginRight: 5 }}
                >
                  Save
                </Button>

                {/* {props.entryMode == "A" && ( */}
                <Button
                  type="primary"
                  icon={<RetweetOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    form.resetFields();
                  }}
                >
                  Reset
                </Button>
                {/* )} */}
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
    </>
  );
};

export default SupplierMasterComp;
