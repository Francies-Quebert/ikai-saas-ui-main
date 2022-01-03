import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Input,
  Radio,
  Table,
  DatePicker,
  Select,
  Modal,
} from "antd";
import moment from "moment";
import _ from "lodash";
import { SaveOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  getUserByMobile,
  InsUpdtPOSUserMaster,
  getUserDetails,
} from "../../../../../services/user-master";
import { getCustomerAddress } from "../../../../../services/customer-address";
import { useDispatch, useSelector } from "react-redux";
import CustomerAddressCard from "../../../../portal/backoffice/CustomerAddress/CustomerAddressCard";

const { Option } = Select;
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
];
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
const initialDisable = {
  mobileNo: false,
  email: true,
  customerName: true,
  gender: true,
  GSTNo: true,
  address: true,
  DOBday: true,
  DOBmonth: true,
  DOByear: true,
  ANVIday: true,
  ANVImonth: true,
  ANVIyear: true,
};
const initialForm = {
  userId: null,
  mobileNo: "",
  email: "",
  customerName: "",
  gender: null,
  GSTNo: "",
  address: [],
  isEdited: false,
};
const CustomerSelectionComponent = (props) => {
  const currTran = useSelector((state) => state.currentTran);
  const user = useSelector((state) => state.LoginReducer.userData);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState(initialForm);
  const [isNotValid, setIsNotValid] = useState([]);
  const [DOB, setDOB] = useState({
    day: null,
    month: null,
    year: "",
    isEdited: false,
  });
  const [anniversary, setAnniversary] = useState({
    day: null,
    month: null,
    year: "",
    isEdited: false,
  });
  const [disabled, setDisabled] = useState(initialDisable);
  const [addressData, setAddressData] = useState([]);
  const [existingCustomer, setExistingCustomer] = useState({
    check: false,
    data: [],
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const dispatch = useDispatch();
  const userMenu = useSelector((state) => state.AppMain.userMenu);
  const [moduleDtl, setmoduleDtl] = useState();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    if (currTran.isSuccess === true) {
      // console.log(customerForm, "existingCustomer");
      getCustomerAddress(CompCode, "U", customerForm.userId).then(
        (addressRes) => {
          setAddressData(addressRes);
          let tempDef = addressRes.find((add) => add.IsDefault === "1");
          if (tempDef) {
            setCustomerForm({
              ...customerForm,
              address: [tempDef.key],
            });
          }
        }
      );
    }
    // console.log('sad')
  }, [currTran.isSuccess]);

  useEffect(() => {
    if (existingCustomer.data.length > 0) {
      // console.log(existingCustomer, "existingCustomer");
      getCustomerAddress(CompCode, "U", existingCustomer.data[0].UserId).then(
        (addressRes) => {
          setAddressData(addressRes);
          let tempDef = addressRes.find((add) => add.IsDefault === "1");
          if (tempDef) {
            setCustomerForm({
              ...customerForm,
              address: [tempDef.key],
            });
          }
        }
      );
    }
  }, [showAddAddress === false]);

  useEffect(() => {
    userMenu.map((modGroups) => {
      let modDetail;
      // userRights =  modGroups.children.find((item) => item.Id === pModuleId)
      let rIndex = modGroups.children.findIndex((item) => item.Id === 5);
      if (rIndex >= 0) {
        modDetail = {
          ...modGroups.children[rIndex],
          ModGroupName: modGroups.title,
        };
        setmoduleDtl(modDetail);

        // dispatch({ type: SET_FORM_CAPTION, modDetail });
      }
    });

    if (
      props.data.customer &&
      props.data.customer.userId &&
      props.data.customer.userId !== null
    ) {
      getUserDetails(CompCode, "U", props.data.customer.userId).then((res) => {
        if (res.length > 0) {
          setExistingCustomer({
            check: true,
            data: res,
          });
          getCustomerAddress(CompCode, "U", props.data.customer.userId).then(
            (addressRes) => {
              setAddressData(addressRes);
              let tempDef = addressRes.find((add) => add.IsDefault === "1");
              setDOB({
                ...DOB,
                day:
                  res[0].DOBmmdd !== null ? res[0].DOBmmdd.substring(2, 4) : "",
                month:
                  res[0].DOBmmdd !== null ? res[0].DOBmmdd.substring(0, 2) : "",
                year: res[0].DOByyyy !== null ? res[0].DOByyyy : "",
              });
              setAnniversary({
                ...anniversary,
                day:
                  res[0].AnniversaryMMDD !== null
                    ? res[0].AnniversaryMMDD.substring(2, 4)
                    : "",
                month:
                  res[0].AnniversaryMMDD !== null
                    ? res[0].AnniversaryMMDD.substring(0, 2)
                    : "",
                year:
                  res[0].AnniversaryYYYY !== null ? res[0].AnniversaryYYYY : "",
              });
              if (tempDef) {
                setCustomerForm({
                  ...customerForm,
                  userId: res[0].UserId,
                  email: res[0].email,
                  customerName: res[0].Name,
                  gender: res[0].gender,
                  GSTNo: res[0].GstNo,
                  mobileNo: res[0].mobile,
                  address:
                    props.data.customer.address &&
                    (props.data.customer.address !== null ||
                      props.data.customer.address.length >= 0)
                      ? [parseInt(props.data.customer.address)]
                      : [tempDef.key],
                });
              } else {
                setCustomerForm({
                  ...customerForm,
                  userId: res[0].UserId,
                  email: res[0].email,
                  customerName: res[0].Name,
                  gender: res[0].gender,
                  GSTNo: res[0].GstNo,
                  mobileNo: res[0].mobile,
                  address:
                    props.data.customer.address &&
                    (props.data.customer.address !== null ||
                      props.data.customer.address.length >= 0)
                      ? props.data.customer.address
                      : [],
                });
              }
              setDisabled({
                mobileNo: true,
                email: false,
                customerName: false,
                gender: false,
                GSTNo: false,
                address: false,
                DOBday: false,
                DOBmonth: false,
                DOByear: false,
                ANVIday: false,
                ANVImonth: false,
                ANVIyear: false,
              });
            }
          );
        }
      });
    }
  }, []);
  const columns = [
    {
      key: "AddressId",
      title: "Address Tag",
      dataIndex: "AddressTag",
      width: 150,
    },
    {
      title: "Address",
      dataIndex: "add1",
      render: (value, value1) => {
        return `${value}, ${value1.add2}, ${value1.add3}`;
      },
    },
  ];

  const validateMobile = (value) => {
    const mobRegEx = new RegExp("^([0|+[0-9]{1,5})?([0-9]{10})$");
    let TempisNotValid = [...isNotValid];
    let tempCustomer = { ...customerForm };
    if (value !== "") {
      if (isNotValid.includes("mobile")) {
        setIsNotValid([...isNotValid.filter((ii) => ii !== "mobile")]);
      }
      if (mobRegEx.test(value) === false) {
        setIsNotValid([...TempisNotValid, "mobile"]);
      }
    } else {
      setIsNotValid([...TempisNotValid, "mobile"]);
    }
    setCustomerForm({
      ...tempCustomer,
      mobileNo: value,
    });
  };
  return (
    <>
      <div style={{ padding: "5px 15px" }}>
        <Row>
          <Col flex="50%">
            <Row style={{ marginBottom: 5, padding: 5 }}>
              <Col
                flex="90px"
                style={{ display: "flex", alignItems: "center" }}
              >
                <span style={{ color: "red" }}>*&nbsp;</span>Mobile No:
              </Col>
              <Col flex="1 0 auto" style={{ display: "flex" }}>
                <Input
                  // addonBefore="+91"
                  name="mobile"
                  required
                  placeholder="Enter Mobile No"
                  style={{
                    borderColor: isNotValid.includes("mobile")
                      ? "red"
                      : "#d9d9d9",
                  }}
                  disabled={disabled.mobileNo}
                  value={customerForm.mobileNo}
                  onChange={(e) => {
                    validateMobile(e.target.value);
                  }}
                  onBlur={(e) => {
                    validateMobile(e.target.value);
                  }}
                />
                <Button
                  disabled={disabled.check}
                  onClick={() => {
                    if (
                      customerForm.mobileNo !== "" &&
                      !isNotValid.includes("mobile")
                    ) {
                      validateMobile(customerForm.mobileNo);
                      getUserByMobile(
                        CompCode,
                        "U",
                        customerForm.mobileNo
                      ).then((res) => {
                        if (res.length > 0) {
                          setExistingCustomer({
                            check: true,
                            data: res,
                          });
                          // console.log(res, "data of customer");
                          getCustomerAddress(CompCode, "U", res[0].UserId).then(
                            (addressRes) => {
                              setAddressData(addressRes);
                              let tempDef = addressRes.find(
                                (add) => add.IsDefault === "1"
                              );
                              setDOB({
                                ...DOB,
                                day:
                                  res[0].DOBmmdd !== null &&
                                  res[0].DOBmmdd !== ""
                                    ? res[0].DOBmmdd.substring(2, 4)
                                    : undefined,
                                month:
                                  res[0].DOBmmdd !== null &&
                                  res[0].DOBmmdd !== ""
                                    ? res[0].DOBmmdd.substring(0, 2)
                                    : undefined,
                                year:
                                  res[0].DOByyyy !== null ? res[0].DOByyyy : "",
                              });
                              setAnniversary({
                                ...anniversary,
                                day:
                                  res[0].AnniversaryMMDD !== null &&
                                  res[0].AnniversaryMMDD !== ""
                                    ? res[0].AnniversaryMMDD.substring(2, 4)
                                    : undefined,
                                month:
                                  res[0].AnniversaryMMDD !== null &&
                                  res[0].AnniversaryMMDD !== ""
                                    ? res[0].AnniversaryMMDD.substring(0, 2)
                                    : undefined,
                                year:
                                  res[0].AnniversaryYYYY !== null
                                    ? res[0].AnniversaryYYYY
                                    : "",
                              });
                              if (tempDef) {
                                setCustomerForm({
                                  ...customerForm,
                                  userId: res[0].UserId,
                                  email: res[0].email,
                                  customerName: res[0].Name,
                                  gender: res[0].gender,
                                  GSTNo: res[0].GstNo,
                                  address: [tempDef.key],
                                });
                              } else {
                                setCustomerForm({
                                  ...customerForm,
                                  userId: res[0].UserId,
                                  email: res[0].email,
                                  customerName: res[0].Name,
                                  gender: res[0].gender,
                                  GSTNo: res[0].GstNo,
                                });
                              }
                            }
                          );
                        } else {
                          setExistingCustomer({
                            check: true,
                            data: [],
                          });
                        }
                        setDisabled({
                          mobileNo: true,
                          email: false,
                          customerName: false,
                          gender: false,
                          GSTNo: false,
                          address: false,
                          DOBday: false,
                          DOBmonth: false,
                          DOByear: false,
                          ANVIday: false,
                          ANVImonth: false,
                          ANVIyear: false,
                        });
                      });
                    }
                  }}
                  type="primary"
                >
                  Check
                </Button>
              </Col>
            </Row>
          </Col>
          <Col flex="50%">
            <Row style={{ marginBottom: 5, padding: 5 }}>
              <Col
                flex="90px"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Email :
              </Col>
              <Col flex="1 0 auto">
                <Input
                  disabled={disabled.email}
                  name="email"
                  placeholder="Enter E-mail"
                  value={customerForm.email}
                  onChange={(e) => {
                    let tempCustomer = { ...customerForm };
                    setCustomerForm({
                      ...tempCustomer,
                      email: e.target.value,
                      isEdited: true,
                    });
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginBottom: 5, padding: 5 }}>
          <Col flex="90px" style={{ display: "flex", alignItems: "center" }}>
            Name :
          </Col>
          <Col flex="1 0 auto">
            <Input
              disabled={disabled.customerName}
              name="name"
              placeholder="Enter Name"
              value={customerForm.customerName}
              onChange={(e) => {
                let tempCustomer = { ...customerForm };
                setCustomerForm({
                  ...tempCustomer,
                  customerName: e.target.value,
                  isEdited: true,
                });
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 5, padding: 5 }}>
          <Col flex="90px" style={{ display: "flex", alignItems: "center" }}>
            Date of Birth :
          </Col>
          <Col flex="1 0 auto" style={{ display: "flex" }}>
            <Select
              value={DOB.day}
              disabled={disabled.DOBday}
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
              disabled={disabled.DOBmonth}
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
              disabled={disabled.DOByear}
              value={DOB.year !== "" && moment(DOB.year)}
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
        <Row style={{ marginBottom: 5, padding: 5 }}>
          <Col flex="90px" style={{ display: "flex", alignItems: "center" }}>
            Anniversary :
          </Col>
          <Col flex="1 0 auto" style={{ display: "flex" }}>
            <Select
              disabled={disabled.ANVIday}
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
              disabled={disabled.ANVImonth}
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
              disabled={disabled.ANVIyear}
              name="anvYear"
              value={anniversary.year !== "" && moment(anniversary.year)}
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
        <Row style={{ marginBottom: 5, padding: 5 }}>
          <Col flex="90px" style={{ display: "flex", alignItems: "center" }}>
            Gender :
          </Col>
          <Col flex="1 0 auto">
            <Radio.Group
              disabled={disabled.gender}
              value={customerForm.gender}
              name="gender"
              onChange={(e) => {
                let tempCustomer = { ...customerForm };
                setCustomerForm({
                  ...tempCustomer,
                  gender: e.target.value,
                  isEdited: true,
                });
              }}
              defaultValue={"O"}
            >
              <Radio value="M">Male</Radio>
              <Radio value="F">Female</Radio>
              <Radio value="O">Other</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row style={{ marginBottom: 5, padding: 5 }}>
          <Col flex="90px" style={{ display: "flex", alignItems: "center" }}>
            GSTNO :
          </Col>
          <Col flex="1 0 auto">
            <Input
              disabled={disabled.GSTNo}
              value={customerForm.GSTNo}
              onChange={(e) => {
                let tempCustomer = { ...customerForm };
                setCustomerForm({
                  ...tempCustomer,
                  GSTNo: e.target.value,
                  isEdited: true,
                });
              }}
              name="gst"
              placeholder="Enter GSTNO."
            />
          </Col>
        </Row>
        {existingCustomer.data.length <= 0 && existingCustomer.check && (
          <div style={{ color: "red", fontSize: 12 }}>
            * Customer Does Not Exist Please Add The Customer
          </div>
        )}

        <div style={{ marginBottom: 5, display: "flex" }}>
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            style={{ marginRight: 5 }}
            disabled={
              disabled.address ||
              isNotValid.includes("mobile") ||
              customerForm.mobile === "" ||
              existingCustomer.data.length <= 0
            }
            onClick={() => {
              setShowAddAddress(true);
            }}
          >
            Add Address
          </Button>
          <Button
            style={{ marginRight: 5 }}
            onClick={() => {
              setCustomerForm(initialForm);
              setDisabled(initialDisable);
              setAddressData([]);
              setDOB({
                day: null,
                month: null,
                year: "",
                isEdited: false,
              });
              setAnniversary({
                day: null,
                month: null,
                year: "",
                isEdited: false,
              });
              setExistingCustomer({
                check: false,
                data: [],
              });
            }}
          >
            Reset
          </Button>

          {existingCustomer.check && (
            <Button
              type="primary"
              disabled={
                moduleDtl === undefined ||
                moduleDtl.Rights.find((ii) => ii.RightCode === "ADD")
                  .RightVal === "N" ||
                (customerForm.isEdited === false &&
                  DOB.isEdited === false &&
                  anniversary.isEdited === false)
              }
              loading={loadingCustomer}
              onClick={() => {
                setLoadingCustomer(true);
                if (existingCustomer.data.length <= 0) {
                  let data = {
                    UserType: "U",
                    UserId: null,
                    gender: customerForm.gender,
                    email: customerForm.email,
                    mobile: customerForm.mobileNo,
                    UpdtUsr: user.username,
                    hasDemographyInfo: "N",
                    Name: customerForm.customerName,
                    DOBmmdd: `${DOB.month ? DOB.month : ""}${
                      DOB.day ? DOB.day : ""
                    }`,
                    DOByyyy: DOB.year ? `${DOB.year}` : null,
                    AnniversaryMMDD: `${
                      anniversary.month ? anniversary.month : ""
                    }${anniversary.day ? anniversary.day : ""}`,
                    AnniversaryYYYY: anniversary.year
                      ? `anniversary.year`
                      : null,
                    GstNo: customerForm.GSTNo,
                  };
                  InsUpdtPOSUserMaster(CompCode, data).then(() => {
                    getUserByMobile(CompCode, "U", data.mobile).then((res) => {
                      setExistingCustomer({ ...existingCustomer, data: res });
                      setCustomerForm({
                        ...customerForm,
                        userId: res[0].UserId,
                        isEdited: false,
                      });
                      setDOB({ ...DOB, isEdited: false });
                      setAnniversary({ ...anniversary, isEdited: false });
                      setLoadingCustomer(false);
                    });
                  });
                } else {
                  let data = {
                    UserType: "U",
                    UserId: existingCustomer.data[0].UserId,
                    gender: customerForm.gender,
                    email: customerForm.email,
                    mobile: customerForm.mobileNo,
                    UpdtUsr: user.username,
                    hasDemographyInfo: "N",
                    Name: customerForm.customerName,
                    DOBmmdd: `${DOB.month ? DOB.month : ""}${
                      DOB.day ? DOB.day : ""
                    }`,
                    DOByyyy: DOB.year ? `${DOB.year}` : null,
                    AnniversaryMMDD: `${
                      anniversary.month ? anniversary.month : ""
                    }${anniversary.day ? anniversary.day : ""}`,
                    AnniversaryYYYY: anniversary.year ? anniversary.year : null,
                    GstNo: customerForm.GSTNo,
                  };
                  InsUpdtPOSUserMaster(CompCode, data).then((res) => {
                    setLoadingCustomer(false);
                  });
                }
                setCustomerForm({ ...customerForm, isEdited: false });
                setDOB({ ...DOB, isEdited: false });
                setAnniversary({ ...anniversary, isEdited: false });
              }}
            >
              {existingCustomer.data.length > 0
                ? "Save Changes"
                : "Add Customer"}
            </Button>
          )}
        </div>
        <div>
          <Table
            rowSelection={{
              type: "radio",
              selectedRowKeys: customerForm.address,
              onChange: (selectedRowKeys, selectedRows) => {
                // console.log(
                //   `selectedRowKeys: ${selectedRowKeys}`,
                //   "selectedRows: ",
                //   selectedRows,
                // );
                let tempCustomer = { ...customerForm };
                setCustomerForm({
                  ...tempCustomer,
                  address: selectedRowKeys,
                });

                // console.log(customerForm);
              },
            }}
            columns={columns}
            dataSource={addressData}
            bordered={true}
            pagination={false}
          />
        </div>
      </div>
      <div
        style={{
          padding: "5px 15px",
          textAlign: "end",
          border: "1px solid #f0f0f0",
          marginTop: 5,
        }}
      >
        <Button
          style={{ marginRight: 7 }}
          onClick={() => {
            props.onBackPress();
          }}
        >
          Cancel
        </Button>
        <Button
          icon={<SaveOutlined />}
          type="primary"
          // disabled={props.disabledSave}
          onClick={() => {
            let data = {
              customer: customerForm,
              dob: DOB,
              anniversary: anniversary,
            };
            props.onCustomerSet(data);
            props.onBackPress();
            // console.log(
            //   "custome",
            //   customerForm,
            //   "dob",
            //   DOB,
            //   "annivisary",
            //   anniversary
            // );
            // console.log(moment.utc([2020, 11, 30]).isValid());
          }}
        >
          Set
        </Button>
      </div>
      <Modal
        destroyOnClose={true}
        visible={showAddAddress}
        onCancel={() => {
          setShowAddAddress(false);
        }}
        footer={null}
        bodyStyle={{ padding: "0px 0px" }}
      >
        <CustomerAddressCard
          onSaveAddress={() => {
            setShowAddAddress(false);
          }}
          onBackPress={() => {
            setShowAddAddress(false);
          }}
          // formData={}
          userId={
            existingCustomer.data.length > 0 && existingCustomer.data[0].UserId
          }
        />
      </Modal>
    </>
  );
};

export default CustomerSelectionComponent;
