import React, { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InsUpdtUserMaster } from "../../../../store/actions/usermaster";
import { reInitialize } from "../../../../store/actions/currentTran";
import UserMaster from "../../../../models/usermaster";
import Cryptr from "cryptr";
import _ from "lodash";
import ColumnPropertiesAnt from "../../../../models/columnPropertiesAnt.js";
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
  Card,
  Input,
  Spin,
  DatePicker,
} from "antd";

import moment from "moment";
import { fetchEmployeeMasters } from "../../../../store/actions/employeemaster";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import AntDataTable from "../../../common/AntDataTable";
import { SaveOutlined, RetweetOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import PrinterOutlined from "@ant-design/icons/PrinterOutlined";
import RollbackOutlined from "@ant-design/icons/RollbackOutlined";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getHashPassword } from "../../../../shared/utility";
import {
  fetchUserAccess,
  fetchUserGroup,
} from "../../../../store/actions/usermaster";
import { fetchUserRightsMapp } from "../../../../store/actions/userRights";
import Pdf from "react-to-pdf";
import bcrypt from "bcryptjs";

const ref = React.createRef();
// console.log(object)

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 10,
  },
};
const month = [
  { display: "January", value: "01" },
  { display: "February", value: "02" },
  { display: "March", value: "03" },
  { display: "April", value: "04" },
  { display: "May", value: "05" },
  { display: "June", value: "06" },
  { display: "July", value: "07" },
  { display: "August", value: "08" },
  { display: "September", value: "09" },
  { display: "October", value: "10" },
  { display: "November", value: "11" },
  { display: "December", value: "12" },
];
const day = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

const UserMasterCardNew = (props) => {
  const dateFormatList = "DD/MM/YYYY";
  const cryptr = new Cryptr(process.env.REACT_APP_CRYPTOKEY);
  const [form] = Form.useForm();
  const currentTran = useSelector((state) => state.currentTran);
  const l_AppConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "DTFORMAT")
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const employees = useSelector(
    (state) => state.employeeMaster.employeeMasters
  );
  const userAccess = useSelector((state) => state.userMaster.userAccess);
  const [selectedDate, setSelectedDate] = useState(
    props.formData ? moment(props.formData.DOB)._d : moment(new moment())._d
  );
  const [selectedAnniversary, setSelectedAnniversary] = useState(
    props.formData
      ? moment(props.formData.Anniversary)._d
      : moment(new moment())._d
  );

  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [anniversary, setAnniversary] = useState({
    day:
      props.formData && props.formData.AnniversaryMMDD !== null
        ? props.formData.AnniversaryMMDD.substring(2, 4)
        : null,
    month:
      props.formData && props.formData.AnniversaryMMDD !== null
        ? props.formData.AnniversaryMMDD.substring(0, 2)
        : null,
    year:
      props.formData && props.formData.AnniversaryYYYY !== null
        ? props.formData.AnniversaryYYYY
        : null,
    isEdited: false,
  });
  const [DOB, setDOB] = useState({
    day:
      props.formData && props.formData.DOBmmdd !== null
        ? props.formData.DOBmmdd.substring(2, 4)
        : null,
    month:
      props.formData && props.formData.DOBmmdd !== null
        ? props.formData.DOBmmdd.substring(0, 2)
        : null,
    year:
      props.formData && props.formData.DOByyyy !== null
        ? props.formData.DOByyyy
        : null,
    isEdited: false,
  });
  const [accessType, setAccessType] = useState();
  const userGroup = useSelector((state) => state.AppMain.otherMasterUserGroup);

  // userRightsMapp.length > 0 && userRightsMapp[0].UserAccessType

  // let pass = "";
  // if (props.trnType === "A") {
  //   pass =
  //     props.formData && props.formData.password.length > 0
  //       ? cryptr.decrypt(props.formData.password)
  //       : "";
  // }

  const initialValues = {
    userType: props.formData ? props.formData.userType : "",
    userId: props.formData ? props.formData.userId : 0,
    userName: props.formData ? props.formData.userName : null,
    userTypeRef: props.formData
      ? props.formData.userTypeRef
        ? parseInt(props.formData.userTypeRef)
        : 0
      : 0,
    gender: props.formData ? props.formData.Gender : "",
    email: props.formData ? props.formData.email : "",
    mobile: props.formData ? props.formData.mobile : "",
    password: null,
    repassword: null,
    RegisterFrom: props.formData ? props.formData.RegisterFrom : "",
    hasDemographyInfo: props.formData ? props.formData.hasDemographyInfo : "",
    Name: props.formData ? props.formData.Name : "",
    GstNo: props.formData ? props.formData.GstNo : "",
    User_Group: props.formData ? props.formData.User_Group : null,
    IsActive: props.formData
      ? props.formData.IsActive === "Y"
        ? true
        : false
      : true,
    Show_Cashier_Alert: props.formData
      ? props.formData.Show_Cashier_Alert === "Y"
        ? true
        : false
      : false,
    Show_Kitchen_Alert: props.formData
      ? props.formData.Show_Kitchen_Alert === "Y"
        ? true
        : false
      : false,
    Show_Admin_Alert: props.formData
      ? props.formData.Show_Admin_Alert === "Y"
        ? true
        : false
      : false,
    Show_Waiter_Alert: props.formData
      ? props.formData.Show_Waiter_Alert === "Y"
        ? true
        : false
      : false,
  };

  const tabList = [
    {
      key: "tab1",
      tab: "Individual",
    },
    {
      key: "tab2",
      tab: "Group Access",
    },
  ];

  useEffect(() => {
    // dispatch(fetchUserAccess(props.formData ? props.formData.userId : 0));
    // dispatch(fetchUserRightsMapp(props.formData ? props.formData.userId : 0));
  }, []);

  useEffect(() => {
    if (currentTran.isSuccess) {
      form.resetFields();
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
    // console.log('hari',props.route.trnType)
  }, [currentTran.error, currentTran.isSuccess]);

  const onFinish = (values) => {
    setIsLoading(true);
    if (values.password && values.password !== "") {
      getHashPassword(values.password).then((newHash) => {
        const val = new UserMaster(
          0,
          props.trnType,
          values.userId ? values.userId : initialValues.userId,
          values.userTypeRef ? values.userTypeRef : initialValues.userTypeRef,
          values.userName ? values.userName : initialValues.userName,
          values.gender ? values.gender : initialValues.gender,
          values.email ? values.email : initialValues.email,
          values.mobile ? values.mobile : initialValues.mobile,
          props.trnType === "A" ? newHash : null,
          "portal",
          "Y",
          values.Name ? values.Name : initialValues.Name,
          `${DOB.month !== null ? DOB.month : ""}${
            DOB.day !== null ? DOB.day : ""
          }`,
          `${DOB.year !== null ? DOB.year : ""}`,
          `${anniversary.month !== null ? anniversary.month : ""}${
            anniversary.day !== null ? anniversary.day : ""
          }`,
          `${anniversary.year !== null ? anniversary.year : ""}`,
          values.Add1 ? values.Add1 : initialValues.Add1,
          values.Add2 ? values.Add2 : initialValues.Add2,
          values.Add3 ? values.Add3 : initialValues.Add3,
          values.GstNo ? values.GstNo : initialValues.GstNo,
          values.User_Group,
          values.IsActive === true ? "Y" : "N",
          values.Show_Cashier_Alert === true ? "Y" : "N",
          values.Show_Kitchen_Alert === true ? "Y" : "N",
          values.Show_Admin_Alert === true ? "Y" : "N",
          values.Show_Waiter_Alert === true ? "Y" : "N"
        );
        // console.log(val, "if");
        dispatch(InsUpdtUserMaster(props.formData ? "U" : "I", val));
      });
    } else {
      const val = new UserMaster(
        0,
        props.trnType,
        values.userId ? values.userId : initialValues.userId,
        values.userTypeRef ? values.userTypeRef : initialValues.userTypeRef,
        values.userName ? values.userName : initialValues.userName,
        values.gender ? values.gender : initialValues.gender,
        values.email ? values.email : initialValues.email,
        values.mobile ? values.mobile : initialValues.mobile,
        props.trnType === "A" ? props.formData.password : null,
        "portal",
        "Y",
        values.Name ? values.Name : initialValues.Name,
        `${DOB.month !== null ? DOB.month : ""}${
          DOB.day !== null ? DOB.day : ""
        }`,
        `${DOB.year !== null ? DOB.year : ""}`,
        `${anniversary.month !== null ? anniversary.month : ""}${
          anniversary.day !== null ? anniversary.day : ""
        }`,
        `${anniversary.year !== null ? anniversary.year : ""}`,
        values.Add1 ? values.Add1 : initialValues.Add1,
        values.Add2 ? values.Add2 : initialValues.Add2,
        values.Add3 ? values.Add3 : initialValues.Add3,
        values.GstNo ? values.GstNo : initialValues.GstNo,
        values.User_Group,
        values.IsActive === true ? "Y" : "N",
        values.Show_Cashier_Alert === true ? "Y" : "N",
        values.Show_Kitchen_Alert === true ? "Y" : "N",
        values.Show_Admin_Alert === true ? "Y" : "N",
        values.Show_Waiter_Alert === true ? "Y" : "N"
      );
      // console.log(val, "Else");
      // setIsLoading(false);
      dispatch(InsUpdtUserMaster(props.formData ? "U" : "I", val));
    }
    // const val = new UserMaster(
    //   0,
    //   props.trnType,
    //   values.userId ? values.userId : initialValues.userId,
    //   values.userTypeRef ? values.userTypeRef : initialValues.userTypeRef,
    //   values.userName ? values.userName : initialValues.userName,
    //   values.gender ? values.gender : initialValues.gender,
    //   values.email ? values.email : initialValues.email,
    //   values.mobile ? values.mobile : initialValues.mobile,
    //   values.password && props.trnType === "A"
    //     ? cryptr.encrypt(values.password)
    //     : null,
    //   "portal",
    //   "Y",
    //   values.Name ? values.Name : initialValues.Name,
    //   values.DOB ? moment(values.DOB).format("YYYY-MM-DD") : null,
    //   values.Anniversary
    //     ? moment(values.Anniversary).format("YYYY-MM-DD")
    //     : null,
    //   values.Add1 ? values.Add1 : initialValues.Add1,
    //   values.Add2 ? values.Add2 : initialValues.Add2,
    //   values.Add3 ? values.Add3 : initialValues.Add3,
    //   values.GstNo ? values.GstNo : initialValues.GstNo
    // );
  };

  const onReset = () => {
    // console.log('on reset click', form)
    form.resetFields();
  };

  const filterData = () => {
    let temp = [...new Set(userAccess.map((data) => data.ModGroupDesc))];
    let filteredData = [];
    for (const key in temp) {
      filteredData.push({
        text: temp[key],
        value: temp[key],
      });
    }
    return filteredData;
  };

  const columns = [
    // new ColumnPropertiesAnt("ModGroupId", "Mod Group Id", false, true, 100),
    {
      title: "Module Group",
      dataIndex: "ModGroupDesc",
      key: "ModGroupDesc",
      filters: filterData(),
      onFilter: (value, record) => record.ModGroupDesc.indexOf(value) === 0,
    },
    new ColumnPropertiesAnt("ModGroupDesc", "Module Group", true, true, 200),
    // new ColumnPropertiesAnt("ModuleId", "Module Id", false, true, 0),
    new ColumnPropertiesAnt("ModuleName", "Module", false, true, 200),
    // new ColumnPropertiesAnt("Rights", "Rights", true, true),
    {
      title: "Access Rights",
      dataIndex: "Rights",
      render: (text, record, index) => {
        // console.log(text, record, index)
        let hh = _.split(record.Rights, ",");

        return (
          <span>
            {hh &&
              hh.map((right) => {
                let vals = _.split(right, "#");
                return (
                  <Switch
                    key={vals[1]}
                    checkedChildren={vals[2]}
                    unCheckedChildren={vals[2]}
                    defaultChecked={vals[0] === "Y" ? true : false}
                    onChange={(checked) => {
                      record.isDirty = true;
                      let rowIndex = userAccess.findIndex(
                        (row) => row.key === record.key
                      );
                      // console.log(
                      //   rowIndex,
                      //   "extracted value",
                      //   userAccess[rowIndex].rights
                      // );
                      userAccess[rowIndex].Rights.split(",").map((item) => {
                        if (item.includes(vals[1])) {
                          // console.log(item);
                          let tmp = _.replace(
                            userAccess[rowIndex].Rights,
                            item,
                            (checked === true ? "Y" : "N") +
                              "#" +
                              vals[1] +
                              "#" +
                              vals[2]
                          );
                          userAccess[rowIndex].Rights = tmp;
                          // console.log(userAccess);
                        }
                      });

                      // let tmp = _.replace(
                      //   record.rights,
                      //   right,
                      //   (checked === true ? "Y" : "N") +
                      //     "#" +
                      //     vals[1] +
                      //     "#" +
                      //     vals[2]
                      // );
                      // console.log("onSwitch", checked,record.rights, tmp);
                      // record.rights = tmp;
                    }}
                  />
                );
              })}
          </span>
        );
      },
    },
  ];

  // const contentList = {
  //   tab1: (
  //     <div>
  //       {userAccess.length > 0 && (
  //         <AntDataTable data={userAccess} columns={columns}  pagination={false}/>
  //       )}
  //     </div>
  //   ),
  //   tab2: <p>content2</p>,
  // };
  const options = {
    orientation: "landscape",
    // unit: "in",
    // format: [4, 2],
  };

  return (
    <div ref={ref}>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={3}>
            <CardHeader
              title={
                props.trnType === "U"
                  ? "Customer Master"
                  : props.trnType === "A"
                  ? "User Master"
                  : props.trnType === "G"
                  ? "User Role Master"
                  : null
              }
            />
            <Card bordered={true} bodyStyle={{ padding: "7px 12px" }}>
              <Form
                labelAlign="left"
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                {/* <Row>
                  <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <Card bordered={false} bodyStyle={{ padding: "7px 12px" }}> */}
                <Form.Item
                  name="Name"
                  style={{ marginBottom: 5 }}
                  label="Display Name"
                  value={props.formData ? props.formData.Name : ""}
                  rules={[
                    {
                      required: true,
                      message: "Please input your display name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {props.showUserCredentials && (
                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="userName"
                    label="User Name"
                    value={props.formData ? props.formData.userName : ""}
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input maxLength="10" />
                  </Form.Item>
                )}
                {props.showUserCredentials && (
                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="password"
                    label="Password"
                    rules={[
                      !props.formData
                        ? {
                            required: true,
                            message: "Please input your password!",
                          }
                        : {},
                      {
                        pattern:
                          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                        message: "Password not good enough",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                )}
                {props.showUserCredentials && (
                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="repassword"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      !props.formData
                        ? {
                            required: true,
                            message: "Please confirm your password!",
                          }
                        : {},
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "The two passwords that you entered do not match!"
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      value={props.formData ? props.formData.password : ""}
                    />
                  </Form.Item>
                )}

                {props.trnType !== "G" && (
                  <>
                    <Form.Item
                      name="gender"
                      label="Gender"
                      style={{ marginBottom: 5 }}
                      rules={[
                        {
                          required: true,
                          message: "Please select gender!",
                        },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value="M">Male</Radio>
                        <Radio value="F">Female</Radio>
                        <Radio value="O">Others</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      style={{ marginBottom: 5 }}
                      name="email"
                      label="E-mail"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      style={{ marginBottom: 5 }}
                      name="mobile"
                      label="Mobile Number"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please input mobile number!",
                      //   },
                      // ]}
                    >
                      <Input addonBefore={"+91"} style={{ width: "100%" }} />
                    </Form.Item>

                    {/* NewColoum */}
                    {props.trnType === "U" && (
                      <>
                        {/* <Form.Item
                          style={{ marginBottom: 5 }}
                          label="Date Of Birth"
                          name="DOB"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Please input Date of Birth!",
                          //   },
                          // ]}
                        >
                          <DatePicker
                            // defaultValue={moment(new moment())}
                            format={
                              l_AppConfigDateFormat &&
                              l_AppConfigDateFormat.value1
                            }
                          />
                        </Form.Item> */}
                        {/* <Form.Item
                          style={{ marginBottom: 5 }}
                          label="Anniversary"
                          name="Anniversary"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Please input Date of Birth!",
                          //   },
                          // ]}
                        >
                          <DatePicker
                            // defaultValue={moment(new moment())}
                            // format={dateFormatList}
                            format={
                              l_AppConfigDateFormat &&
                              l_AppConfigDateFormat.value1
                            }
                          />
                        </Form.Item> */}
                        <Row style={{ marginBottom: 5, padding: 5 }}>
                          <Col
                            sm={6}
                            // flex="90px"
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            Date of Birth :
                          </Col>
                          <Col sm={14} style={{ display: "flex" }}>
                            <Select
                              value={DOB.day}
                              // disabled={disabled.DOBday}
                              onChange={(e) => {
                                let tempDOB = { ...DOB };
                                setDOB({
                                  ...tempDOB,
                                  day: e,
                                  isEdited: true,
                                });
                              }}
                              placeholder="Select Day"
                              style={{ minWidth: 110 }}
                            >
                              {day.map((i) => {
                                return (
                                  <Option name="dobDay" key={i} value={i}>
                                    {i}
                                  </Option>
                                );
                              })}
                            </Select>
                            <Select
                              value={DOB.month}
                              // disabled={disabled.DOBmonth}
                              name="dobMonth"
                              placeholder="Select Month"
                              style={{ marginLeft: 10, minWidth: 125 }}
                              onChange={(e) => {
                                let tempDOB = { ...DOB };
                                setDOB({
                                  ...tempDOB,
                                  month: e,
                                  isEdited: true,
                                });
                              }}
                            >
                              {month.map((i) => {
                                return (
                                  <Option key={i.value} value={i.value}>
                                    {i.display}
                                  </Option>
                                );
                              })}
                            </Select>
                            <DatePicker
                              // disabled={disabled.DOByear}
                              value={
                                DOB.year !== "" && DOB.year !== null
                                  ? moment(DOB.year)
                                  : null
                              }
                              name="dobYear"
                              onChange={(val, val2) => {
                                let tempDOB = { ...DOB };
                                setDOB({
                                  ...tempDOB,
                                  year: val2,
                                  isEdited: true,
                                });
                              }}
                              picker="year"
                              style={{ marginLeft: 10 }}
                            />
                          </Col>
                        </Row>
                        <Row style={{ marginBottom: 5 }}>
                          <Col
                            sm={6}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 5,
                            }}
                          >
                            Anniversary :
                          </Col>
                          <Col sm={14} style={{ display: "flex" }}>
                            <Select
                              // disabled={disabled.ANVIday}
                              value={anniversary.day}
                              onChange={(e) => {
                                let tempDOB = { ...anniversary };
                                setAnniversary({
                                  ...tempDOB,
                                  day: e,
                                  isEdited: true,
                                });
                              }}
                              name="anvDay"
                              placeholder="Select Day"
                              style={{ minWidth: 110 }}
                            >
                              {day.map((i) => {
                                return (
                                  <Option key={i} value={i}>
                                    {i}
                                  </Option>
                                );
                              })}
                            </Select>
                            <Select
                              // disabled={disabled.ANVImonth}
                              value={anniversary.month}
                              name="anvMonth"
                              placeholder="Select Month"
                              style={{ marginLeft: 10, minWidth: 125 }}
                              onChange={(e) => {
                                let tempDOB = { ...anniversary };
                                setAnniversary({
                                  ...tempDOB,
                                  month: e,
                                  isEdited: true,
                                });
                              }}
                            >
                              {month.map((i) => {
                                return (
                                  <Option key={i.value} value={i.value}>
                                    {i.display}
                                  </Option>
                                );
                              })}
                            </Select>
                            <DatePicker
                              // disabled={disabled.ANVIyear}
                              name="anvYear"
                              value={
                                anniversary.year !== "" &&
                                anniversary.year !== null
                                  ? moment(anniversary.year)
                                  : null
                              }
                              onChange={(val, val2) => {
                                let tempDOB = { ...anniversary };
                                setAnniversary({
                                  ...tempDOB,
                                  year: val2,
                                  isEdited: true,
                                });
                              }}
                              picker="year"
                              style={{ marginLeft: 10 }}
                            />
                          </Col>
                        </Row>
                        <Form.Item
                          name="Add1"
                          style={{ marginBottom: 5, display: "none" }}
                          label="Street :"
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="Add2"
                          style={{ marginBottom: 5, display: "none" }}
                          label="Locality :"
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="Add3"
                          style={{ marginBottom: 5, display: "none" }}
                          label="Landmark :"
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name="GstNo"
                          style={{ marginBottom: 5 }}
                          label="GSTNO :"
                        >
                          <Input maxLength={10} />
                        </Form.Item>
                      </>
                    )}
                    {/* end coloumn */}
                    {props.trnType === "A" && (
                      <Form.Item
                        name="userTypeRef"
                        label="Employee Reference"
                        style={{ marginBottom: 5 }}
                      >
                        <Select
                          showSearch
                          placeholder="Select an employee"
                          optionFilterProp="children"
                          allowClear={true}
                        >
                          {employees.map((item) => {
                            return (
                              <Option
                                key={item.Id}
                                value={item.Id}
                              >{`${item.Name} (+91 ${item.mobile1})`}</Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    )}
                    <Form.Item
                      name="IsActive"
                      label="Status"
                      style={{ marginBottom: 5 }}
                      valuePropName="checked"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please Select User Group !",
                      //   },
                      // ]}
                    >
                      <Switch
                        checkedChildren="Active"
                        unCheckedChildren="InActive"
                      />
                    </Form.Item>
                  </>
                )}

                {props.trnType === "A" &&
                  process.env.REACT_APP_PROJECT_TYPE === "RESTAURANT" && (
                    <>
                      <Form.Item
                        name="User_Group"
                        label="User Group"
                        style={{ marginBottom: 5 }}
                        rules={[
                          {
                            required: true,
                            message: "Please Select User Group !",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Select an User Group"
                          optionFilterProp="children"
                          allowClear={true}
                        >
                          {userGroup
                            .filter((i) => i.IsActive)
                            .map((item) => {
                              return (
                                <Option key={item.Id} value={item.ShortCode}>
                                  {item.MasterDesc}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>

                      <Row>
                        <Col
                          style={{ alignSelf: "center" }}
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={24}
                        >
                          Enable Alert For :
                        </Col>
                        <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                          <div style={{ display: "flex" }}>
                            {console.log("addded")}
                            <Form.Item
                              name="Show_Cashier_Alert"
                              style={{
                                display: "inline-block",
                                // width: "calc(25% - 8px)",
                                marginRight: 5,
                                marginBottom: -3,
                              }}
                              valuePropName="checked"
                              labelCol={15}
                            >
                              <Switch
                                checkedChildren="Cashier"
                                unCheckedChildren="Cashier"
                              />
                            </Form.Item>
                            <Form.Item
                              name="Show_Waiter_Alert"
                              style={{
                                display: "inline-block",
                                // width: "calc(25% - 8px)",
                                marginRight: 5,
                                marginBottom: -3,
                              }}
                              valuePropName="checked"
                              labelCol={15}
                            >
                              <Switch
                                checkedChildren="Waiter"
                                unCheckedChildren="Waiter"
                              />
                            </Form.Item>
                            <Form.Item
                              name="Show_Kitchen_Alert"
                              style={{
                                display: "inline-block",
                                // width: "calc(25% - 8px)",
                                marginRight: 5,
                                marginBottom: -3,
                              }}
                              valuePropName="checked"
                              labelCol={15}
                            >
                              <Switch
                                checkedChildren="Kitchen"
                                unCheckedChildren="Kitchen"
                              />
                            </Form.Item>
                            <Form.Item
                              name="Show_Admin_Alert"
                              style={{
                                display: "inline-block",
                                // width: "calc(25% - 8px)",
                                marginRight: 5,
                                marginBottom: -3,
                              }}
                              valuePropName="checked"
                              labelCol={15}
                            >
                              <Switch
                                checkedChildren="Admin"
                                unCheckedChildren="Admin"
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>

                      {/* <Form.Item
                          name="Show_Cashier_Alert"
                          label="Enable Cashier Alert"
                          style={{ marginBottom: 5 }}
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="Show_Waiter_Alert"
                          label="Enable Waiter Alert"
                          valuePropName="checked"
                          style={{ marginBottom: 5 }}
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="Show_Kitchen_Alert"
                          label="Enable Kitchen Alert"
                          style={{ marginBottom: 5 }}
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="Show_Admin_Alert"
                          label="Enable Admin Alert"
                          style={{ marginBottom: 5 }}
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item> */}
                    </>
                  )}

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

                  <Pdf
                    targetRef={ref}
                    options={options}
                    // x={0.5}
                    // y={0.5}
                    filename={`${_.replace(
                      currentTran.formTitle,
                      " ",
                      "_"
                    )}.pdf`}
                  >
                    {({ toPdf }) => (
                      <Button
                        type="primary"
                        icon={<Icon component={PrinterOutlined} />}
                        style={{ marginRight: 5 }}
                        onClick={toPdf}
                      >
                        Print
                      </Button>
                    )}
                  </Pdf>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};
console.log("notifi");
export default UserMasterCardNew;
