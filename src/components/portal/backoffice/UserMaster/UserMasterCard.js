import React, { Fragment, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { InsUpdtUserMaster } from "../../../../store/actions/usermaster";
import { reInitialize } from "../../../../store/actions/currentTran";
import UserMaster from "../../../../models/usermaster";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CustomDataTable from "../../../common/CustomDataTable";
import ColumnProperties from "../../../../models/columnProperties";
import { fetchEmployeeMasters } from "../../../../store/actions/employeemaster";
import DisplayEmployeeModalCard from "../UserMasterModalCard";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import Cryptr from "cryptr";
import AntDataTable from "../../../common/AntDataTable";
import { DownOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import _ from "lodash";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
} from "antd";

let ModuleData = [
  {
    key: 1,
    isDirty: false,
    modGroup: "A",
    module: "User Role Master 1",
    rights: "Y#ACCEPT#Accept,N#CANCEL#Cancel",
  },
  {
    key: 2,
    modGroup: "A",
    isDirty: false,
    module: "User Role Master 2",
    rights: "N#REJECT#Reject,N#SCHEDULE#Schedule,Y#VIEW#View",
  },
  {
    key: 3,
    modGroup: "B",
    isDirty: false,
    module: "User Role Master 3",
    rights:
      "N#ACCEPT#Accept,N#CANCEL#Cancel,N#PRINT#Print,N#REJECT#Reject,N#SCHEDULE#Schedule,Y#VIEW#View",
  },
  {
    key: 4,
    modGroup: "C",
    isDirty: false,
    module: "User Role Master 4",
    rights:
      "N#ACCEPT#Accept,N#CANCEL#Cancel,N#PRINT#Print,N#REJECT#Reject,N#SCHEDULE#Schedule,Y#VIEW#View",
  },
];

const UserMasterCard = (props) => {
  const cryptr = new Cryptr(process.env.REACT_APP_CRYPTOKEY);
  const currentTran = useSelector((state) => state.currentTran);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const [assigModal, setAssigModal] = useState(false);
  const employeeMaster = useSelector((state) => state.employeeMaster);
  // const employees = useSelector(state => state.AppMain.employeeMasters);
  const [selectedEmployee, setSelectedEmployee] = useState(
    props.formData
      ? employeeMaster.employeeMasters.filter(
          (ii) => ii.Id == props.formData.userTypeRef
        )[0]
      : null
  );
  const userGroupMaster = useSelector(
    (state) => state.userMaster.userGroupMaster
  );
  useEffect(() => {
    if (currentTran.isSuccess) {
      formik.resetForm(formInitialValues);
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    // console.log('hari',props.route.trnType)
  }, [currentTran.error, currentTran.isSuccess]);
  let pass = "";

  useEffect(() => {
    dispatch(fetchEmployeeMasters("A"));
    // if (props.formData) {
    //    pass = cryptr.decrypt(props.formData.password);

    // }
  }, []);

  const toggle = () => {
    setAssigModal(!assigModal);
  };

  const DispatchModal = () => {
    setAssigModal(!assigModal);
  };

  const formInitialValues = {
    userType: props.formData ? props.formData.userType : "",
    userId: props.formData ? props.formData.userId : 0,
    userName: props.formData ? props.formData.userName : "",
    gender: props.formData ? props.formData.Gender : "",
    email: props.formData ? props.formData.email : "",
    mobile: props.formData ? props.formData.mobile : "",
    password: props.formData ? props.formData.password : "",
    repassword: props.formData ? props.formData.password : "",
    RegisterFrom: props.formData ? props.formData.RegisterFrom : "",
    hasDemographyInfo: props.formData ? props.formData.hasDemographyInfo : "",
    Name: props.formData ? props.formData.Name : "",
  };

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      Name: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      userName: props.showUserCredentials
        ? Yup.string()
            .max(10, "Must be 10 characters or less")
            .matches(/^[a-zA-Z]+$/, "Spaces are restricted")
            .required("Required")
        : null,

      // password: props.showUserCredentials
      //   ? Yup.string()
      //       .required("Required")
      //       .matches(
      //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      //         "Must Contain Minimum 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      //       )
      //   : null,
      // repassword: props.showUserCredentials
      //   ? Yup.string()
      //       .required("Required")
      //       .oneOf([Yup.ref("password"), null], "Passwords must match")
      //       .matches(
      //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      //         "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      //       )
      //   : null,
      email:
        props.trnType !== "G"
          ? Yup.string().required("Required").email("Invalid Email")
          : null,
      mobile:
        props.trnType !== "G"
          ? Yup.string()
              .length(10)
              .required("required")
              .matches(
                /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                "Phone number is not valid"
              )
          : null,
      gender: props.trnType !== "G" ? Yup.string().required("Required") : null,
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      // console.log(selectedEmployee);
      if (props.trnType === "A") {
        if (values.password !== values.repassword) {
          alert("Password should be same");
          return;
        }

        if (
          values.password.toString().length === 0 ||
          values.repassword.toString().length === 0
        ) {
          alert("required");
          return;
        }

        if (values.password.length < 100) {
          const re = new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/
          );
          const isOk = re.test(values.password);

          if (!isOk) {
            alert(
              "Must Contain Minimum 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            );
            return;
          }
        }

        if (values.password.length < 100) {
          let pass = cryptr.encrypt(values.password);
          values.password = pass;
        }
      }

      setTimeout(() => {
        const val = new UserMaster(
          0,
          props.trnType,
          values.userId,
          selectedEmployee ? selectedEmployee.Id : null,
          values.userName,
          values.gender,
          values.email,
          values.mobile,
          values.password,
          "portal",
          "Y",
          values.Name
        );
        dispatch(InsUpdtUserMaster(props.formData ? "U" : "I", val));
        setSubmitting(false);
      }, 400);
    },
  });

  return (
    <Fragment>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        layout="vertical"
        initialValues={{ size: "small" }}
        size="small"
      >
        {/* <div className="col-md-2"></div> */}
        <div className="col-md-6 p-0">
          <div className="card">
            <div
              className="card-header"
              style={{ paddingTop: 8, paddingBottom: 2, fontSize: 15 }}
            >
              <strong> User Profile</strong>
            </div>
            <div className="card-body p-t-10 p-b-10">
              <div className="row">
                <div className="col-md-12">
                  <Form.Item label="Display Name">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Username">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Password">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Re-enter Password">
                    <Input />
                  </Form.Item>
                  <Form.Item label="E-mail">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Mobile">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button>Button</Button>
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
      <form
        className="theme-form row"
        style={props.styleComponentCenter}
        onSubmit={formik.handleSubmit}
      >
        {/* <div className="col-md-2"></div> */}
        <div className="col-md-6 p-0">
          <div className="card">
            <div
              className="card-header"
              style={{ paddingTop: 8, paddingBottom: 2, fontSize: 15 }}
            >
              <strong> User Profile</strong>
            </div>
            <div className="card-body p-t-10 p-b-10">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group row">
                    <label
                      className="col-sm-5 col-form-label"
                      htmlFor="inputPassword3"
                    >
                      * Display Name:
                    </label>
                    <div className="col-sm-7">
                      <input
                        className="form-control"
                        autoComplete="off"
                        id="Name"
                        type="text"
                        name="Name"
                        placeholder="Name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.Name}
                      />
                      {formik.touched.Name && formik.errors.Name ? (
                        <span className="validationError">
                          {formik.errors.Name}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                {props.showUserCredentials === true && (
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label
                        className="col-sm-5 col-form-label"
                        htmlFor="inputPassword3"
                      >
                        * Username:
                      </label>
                      <div className="col-sm-7">
                        <input
                          className="form-control"
                          autoComplete="off"
                          id="userName"
                          type="text"
                          name="userName"
                          placeholder="Username"
                          onInput={(e) => {
                            e.target.value = (
                              "" + e.target.value
                            ).toLowerCase();
                          }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.userName}
                        />
                        {formik.touched.userName && formik.errors.userName ? (
                          <span className="validationError">
                            {formik.errors.userName}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                {props.showUserCredentials === true && (
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label
                        className="col-sm-5 col-form-label"
                        htmlFor="inputPassword3"
                      >
                        * Password:
                      </label>
                      <div className="col-sm-7">
                        <input
                          className="form-control"
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <span className="validationError">
                            {formik.errors.password}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

                {props.showUserCredentials === true && (
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label
                        className="col-sm-5 col-form-label"
                        htmlFor="inputPassword3"
                      >
                        * Re-enter Password:
                      </label>
                      <div className="col-sm-7">
                        <input
                          className="form-control"
                          id="repassword"
                          name="repassword"
                          type="password"
                          placeholder="Password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.repassword}
                        />
                        {formik.touched.repassword &&
                        formik.errors.repassword ? (
                          <span className="validationError">
                            {formik.errors.repassword}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                {props.trnType !== "G" && (
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label
                        className="col-sm-5 col-form-label"
                        htmlFor="inputEmail3"
                      >
                        * Email:
                      </label>
                      <div className="col-sm-7">
                        <input
                          className="form-control "
                          name="email"
                          id="inputEmail3"
                          type="email"
                          placeholder="Email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <span className="validationError">
                            {formik.errors.email}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                {props.trnType !== "G" && (
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label
                        className="col-sm-5 col-form-label"
                        htmlFor="inputPassword3"
                      >
                        * Mobile:
                      </label>
                      <div className="col-sm-7">
                        <input
                          className="form-control"
                          id="mobile"
                          name="mobile"
                          type="tel"
                          placeholder="Mobile Number"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.mobile}
                        />
                        {formik.touched.mobile && formik.errors.mobile ? (
                          <span className="validationError">
                            {formik.errors.mobile}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                {props.trnType !== "G" && (
                  <div className="col-md-12">
                    <fieldset className="form-group">
                      <div className="row">
                        <label className="col-form-label col-sm-5 pt-0">
                          * Gender
                        </label>
                        <div className="col-sm-7">
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="radio radio-primary ml-2">
                                <input
                                  id="radio11"
                                  type="radio"
                                  name="gender"
                                  value="M"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  checked={formik.values.gender === "M"}
                                />
                                <label htmlFor="radio11">Male</label>
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="radio radio-primary ml-2">
                                <input
                                  id="radio22"
                                  type="radio"
                                  name="gender"
                                  value="F"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  checked={formik.values.gender === "F"}
                                />
                                <label htmlFor="radio22">Female</label>
                              </div>
                            </div>
                          </div>

                          {formik.touched.gender && formik.errors.gender ? (
                            <span className="validationError">
                              {formik.errors.gender}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>

              {/* start */}

              <Modal
                isOpen={assigModal}
                toggle={DispatchModal}
                size="lg"
                centered={true}
              ></Modal>

              <Modal isOpen={assigModal} toggle={toggle} size="lg">
                <div className="bg-primary modal-header">
                  Assigned Portal Users
                </div>
                <div className=" col-md-12 dzu-dropzone p-20">
                  {selectedEmployee && selectedEmployee.Name != null && (
                    <DisplayEmployeeModalCard data={selectedEmployee} />
                  )}
                  {!selectedEmployee && "Employee Not Selected"}
                </div>
                <CustomDataTable
                  columnProperties={columnProperties}
                  myData={employeeMaster.employeeMasters}
                  isInvisibleAdd={true}
                  pageDefaultSize={15}
                  allowSingleSelect={true}
                  showViewDetail={true}
                  IsInVisibleAction={true}
                  onRowSelectChange={(ss) => {
                    setSelectedEmployee(ss);
                    // console.log(ss);
                  }}
                />
                <div class="modal-footer p-0">
                  <button
                    className="btn btn-square btn-primary btn-sm m-5"
                    type="button"
                    onClick={() => {
                      toggle();
                    }}
                  >
                    Save
                  </button>
                </div>
              </Modal>
              {props.trnType === "A" ? (
                <div className="col-md-12 dzu-dropzone p-t-5 p-b-5 text-center w-100">
                  {selectedEmployee && selectedEmployee.Name && (
                    <>
                      <div className="d-flex justify-content-center">
                        <DisplayEmployeeModalCard data={selectedEmployee} />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <button
                            className="btn btn-square btn-primary btn-sm m-5 w-100"
                            type="button"
                            name="assignAttendant"
                            onClick={() => {
                              setAssigModal(true);
                              // console.log("clicked");
                            }}
                          >
                            Re-Assign User
                          </button>
                        </div>
                        <div className="col-md-6">
                          <button
                            className="btn btn-square btn-warning btn-sm m-5 w-100"
                            type="button"
                            name="assignAttendant"
                            onClick={() => {
                              setSelectedEmployee(null);
                            }}
                          >
                            Remove User
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {!selectedEmployee && (
                    <>
                      <h4>--Portal Not Assigned--</h4>
                      <div className="btn-sm">
                        <button
                          className="btn btn-square btn-primary btn-sm m-5 "
                          type="button"
                          name="assignAttendant"
                          onClick={() => {
                            setAssigModal(true);
                            // console.log("clicked");
                          }}
                        >
                          Allow Portal Access
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : null}

              {/* end */}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card" style={{ border: "1px solid #f6f7fb" }}>
            <div
              className="card-header"
              style={{ paddingTop: 8, paddingBottom: 2, fontSize: 15 }}
            >
              <strong> Module Access</strong>
            </div>
            <div className="card-body p-t-10 p-b-10">
              <div className="row theme-tab">
                <Tabs className="col-sm-12">
                  <TabList className="tabs tab-title m-b-5">
                    <Tab className="current">Individual</Tab>
                    <Tab>Group Access</Tab>
                  </TabList>
                  <div className="tab-content-cls">
                    <TabPanel>
                      <div>
                        <Switch
                          checkedChildren="View"
                          unCheckedChildren="View"
                          defaultChecked
                        />
                        <AntDataTable
                          data={ModuleData}
                          columns={columns}
                          expandable={(record) => <p>{record.description}</p>}
                          // footer={() => "Here is custom footer"}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div>
                        <select
                          className="form-control"
                          id="LocationId"
                          style={{ height: 35 }}
                          name="LocationId"
                        >
                          <option>---Select---</option>
                          {userGroupMaster &&
                            userGroupMaster.map((ii) => (
                              <option key={ii.userId} value={ii.userId}>
                                {ii.Name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </TabPanel>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 p-0">
          <div className="card">
            <div
              className="card-footer p-l-5 p-t-10 p-b-5"
              style={{ textAlign: "center" }}
            >
              <button
                type="submit"
                name="submit"
                className="btn btn-primary mr-1"
              >
                Save
              </button>
              <button
                type="reset"
                name="reset"
                onClick={() => {
                  dispatch(reInitialize());
                  formik.resetForm(formInitialValues);
                }}
                className="btn btn-info"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(reInitialize());
                  props.onBackPress();
                }}
                className="btn btn-secondary ml-1"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export const columnProperties = [
  new ColumnProperties("Id", false, "Id", true, 50),
  new ColumnProperties("EmpType", false, "EmpType", true, 50),
  new ColumnProperties("Name", true, "Name", true, 250),
  new ColumnProperties("FirstName", false, "First Name", true, 100),
  new ColumnProperties("MiddleName", false, "Middle Name", true, 100),
  new ColumnProperties("LastName", false, "Last Name", true, 100),
  new ColumnProperties("bio", false, "bio", true, 250),
  new ColumnProperties("CategoryCode", false, "CategoryCode", true, 50),
  new ColumnProperties(
    "QualificationCode",
    false,
    "QualificationCode",
    true,
    50
  ),
  new ColumnProperties("ExperienceCode", false, "Experience Code", true, 50),
  new ColumnProperties("GradeCode", false, "Grade Code", true, 50),
  new ColumnProperties("DOB", false, "DOB", true, 150),
  new ColumnProperties("Gender", false, "Gender", true, 150),
  new ColumnProperties("IsGenderComponent", false, "Gender Status", false, 150),
  new ColumnProperties("Address1", false, "Address1", true, 150),
  new ColumnProperties("Address2", false, "Address2", true, 150),
  new ColumnProperties("Address3", false, "Address3", true, 150),
  new ColumnProperties("City", false, "City", true, 150),
  new ColumnProperties("PinCode", false, "PinCode", true, 100),
  new ColumnProperties("State", false, "State", true, 150),
  new ColumnProperties("Country", false, "Country", true, 150),
  new ColumnProperties("tel", false, "tel", true, 100),
  new ColumnProperties("mobile1", true, "Contact No.", true, 130),
  new ColumnProperties("mobile2", false, "mobile2", true, 130),
  new ColumnProperties("email", true, "email", true, 250),
  new ColumnProperties("AadharNo", false, "AadharNo", true, 150),
  new ColumnProperties("PanNo", false, "PanNo", true, 150),
  new ColumnProperties("DesignationCode", false, "DesignationCode", true, 80),
  new ColumnProperties("ProfilePicture", false, "ProfilePicture", true, 150),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("IsActiveComponent", false, "Active Status", false, 150),
  new ColumnProperties("ProfilePicture", false, "Profile Picture", true, 350),
];

const columns = [
  {
    title: "Module Group",
    dataIndex: "modGroup",
  },
  {
    title: "Module",
    dataIndex: "module",
    sorter: (a, b) => a.module - b.module,
  },
  {
    title: "Access Rights",
    dataIndex: "rights",
    render: (text, record, index) => {
      // console.log(text, record, index)
      let hh = _.split(record.rights, ",");

      return (
        <span>
          {hh.map((right) => {
            let vals = _.split(right, "#");
            return (
              <Switch
                key={vals[1]}
                checkedChildren={vals[2]}
                unCheckedChildren={vals[2]}
                defaultChecked={vals[0] === "Y" ? true : false}
                onChange={(checked) => {
                  record.isDirty = true;
                  let rowIndex = ModuleData.findIndex(
                    (row) => row.key === record.key
                  );
                 
                  ModuleData[rowIndex].rights.split(",").map((item) => {
                    if (item.includes(vals[1])) {
                      let tmp = _.replace(
                        ModuleData[rowIndex].rights,
                        item,
                        (checked === true ? "Y" : "N") +
                          "#" +
                          vals[1] +
                          "#" +
                          vals[2]
                      );
                      ModuleData[rowIndex].rights = tmp;
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
  {
    title: "Action",
    key: "action",
    sorter: true,
    filters: [],
    onFilter: () => {},
    render: () => (
      <span>
        <a style={{ marginRight: 16 }}>Delete</a>
        <a className="ant-dropdown-link">
          More actions <DownOutlined />
        </a>
      </span>
    ),
  },
];


export default UserMasterCard;
