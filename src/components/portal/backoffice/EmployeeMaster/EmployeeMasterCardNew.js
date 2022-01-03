import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Select,
  Radio,
  Button,
  Upload,
  Cascader,
  Row,
  Col,
  Card,
  Input,
  DatePicker,
  Spin,
  message,
} from "antd";
import moment from "moment";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
// import  from "@ant-design/icons";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";
import CardHeader from "../../../common/CardHeader";
import CKEditors from "react-ckeditor-component";
import { Divider } from "antd";
import { reInitialize } from "../../../../store/actions/currentTran";
import EmployeeMaster from "../../../../models/emloyeemaster";
import { InsUpdtEmployeeMaster } from "../../../../store/actions/employeemaster";
import { fetchCountryMasters } from "../../../../store/actions/CountryMaster";
import { fetchCityMasters } from "../../../../store/actions/CityMaster";
import { fetchStateMasters } from "../../../../store/actions/StateMaster";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 14,
  },
};

const EmployeeMasterCardNew = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const dateFormatList = "DD/MM/YYYY";
  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    props.formData ? moment(props.formData.DOB)._d : moment(new moment())._d
  );
  const [ChkEditContent, setChkEditContent] = useState(
    props.formData ? props.formData.bio : ""
  );
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState();

  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );

  //useSelector
  const currentTran = useSelector((state) => state.currentTran);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const grade = useSelector((state) => state.AppMain.otherMasterGrade);
  const Qualification = useSelector((state) => state.AppMain.otherMasterQLF);
  const Category = useSelector((state) => state.AppMain.otherMasterCategory);
  const City = useSelector((state) => state.cityMaster.cityMasters);
  const Country = useSelector((state) => state.countryMaster.countryMasters);
  const State = useSelector((state) => state.stateMaster.stateMasters);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const Experience = useSelector(
    (state) => state.AppMain.otherMasterExperience
  );
  const Designations = useSelector(
    (state) => state.AppMain.otherMasterDesignations
  );

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  //Address option
  const addressOption = () => {
    let temp = [];
    for (const key in Country) {
      temp.push({
        value: Country[key].CountryCode,
        label: Country[key].CountryName,
        children: stateOption(Country[key].CountryCode),
      });
    }
    return temp;
  };
  const stateOption = (CountryCode) => {
    let state = [];
    State.filter((ii) => ii.CountryCode === CountryCode).map((item) => {
      state.push({
        value: item.StateCode,
        label: item.StateName,
        children: cityOption(CountryCode, item.StateCode),
      });
    });
    return state;
  };

  const cityOption = (CountryCode, StateCode) => {
    let city = [];
    City.filter(
      (ii) => ii.CountryCode === CountryCode && ii.StateCode === StateCode
    ).map((item) => {
      city.push({
        value: item.CityCode,
        label: item.CityName,
      });
    });
    return city;
  };

  //onReset
  const onReset = () => {
    form.resetFields();
  };

  const handleblur = (evt) => {
    // console.log(evt);
    var newContent = evt.editor.getData();
    setChkEditContent(newContent);
  };

  const onChange = (evt) => {
    var newContent = evt.editor.getData();
  };
  useEffect(() => {
    dispatch(fetchCountryMasters());
    dispatch(fetchCityMasters());
    dispatch(fetchStateMasters());
    // console.log("onload", props.formData);
  }, []);

  useEffect(() => {
    setUrl({
      url: props.formData
        ? props.formData.pathType === "C"
          ? `${FileUploadPath.value1}/${props.formData.ProfilePicture}`
          : props.formData.ProfilePicture
        : null,
      path: props.formData ? `${props.formData.ProfilePicture}` : null,
      pathType: props.formData ? props.formData.pathType : null,
    });
  }, []);

  useEffect(() => {
    // console.log(ChkEditContent);
  }, [ChkEditContent]);

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

  const initialValues = {
    Id: props.formData ? props.formData.Id : 0,
    EmpType: props.formData ? props.formData.EmpType : "A",
    FirstName: props.formData ? props.formData.FirstName : "",
    MiddleName: props.formData ? props.formData.MiddleName : "",
    LastName: props.formData ? props.formData.LastName : "",
    bio: props.formData ? ChkEditContent : ChkEditContent,
    CategoryCode: props.formData ? props.formData.CategoryCode : "",
    QualificationCode: props.formData ? props.formData.QualificationCode : "",
    ExperienceCode: props.formData ? props.formData.ExperienceCode : "",
    GradeCode: props.formData ? props.formData.GradeCode : "",
    DOB: moment(props.formData ? selectedDate : selectedDate),
    Gender: props.formData ? props.formData.Gender : "",
    Address1: props.formData ? props.formData.Address1 : "",
    Address2: props.formData ? props.formData.Address2 : "",
    Address3: props.formData ? props.formData.Address3 : "",
    City: props.formData ? props.formData.City : "",
    PinCode: props.formData ? props.formData.PinCode : "",
    State: props.formData ? props.formData.State : "",
    Country: props.formData ? props.formData.Country : "",
    tel: props.formData ? props.formData.tel : "",
    mobile1: props.formData ? props.formData.mobile1 : "",
    mobile2: props.formData ? props.formData.mobile2 : "",
    email: props.formData ? props.formData.email : "",
    AadharNo: props.formData ? props.formData.AadharNo : "",
    PanNo: props.formData ? props.formData.PanNo : "",
    IsActive: props.formData ? props.formData.IsActive : "true",
    DesignationCode: props.formData ? +props.formData.DesignationCode : "",
    ProfilePicture: props.formData ? props.formData.ProfilePicture : "",
    residence: props.formData
      ? [props.formData.Country, props.formData.State, props.formData.City]
      : [],
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new EmployeeMaster(
      values.Id ? values.Id : initialValues.Id,
      values.EmpType ? values.EmpType : initialValues.EmpType,
      values.FirstName ? values.FirstName : initialValues.FirstName,
      values.MiddleName ? values.MiddleName : initialValues.MiddleName,
      values.LastName ? values.LastName : initialValues.LastName,
      values.bio ? ChkEditContent : initialValues.bio,
      values.CategoryCode ? values.CategoryCode : initialValues.CategoryCode,
      values.QualificationCode
        ? values.QualificationCode
        : initialValues.QualificationCode,
      values.ExperienceCode
        ? values.ExperienceCode
        : initialValues.ExperienceCode,
      values.GradeCode ? values.GradeCode : initialValues.GradeCode,
      moment(values.DOB).format("YYYY-MM-DD")
        ? moment(values.DOB).format("YYYY-MM-DD")
        : moment(initialValues.DOB).format("YYYY-MM-DD"),
      values.Gender ? values.Gender : initialValues.Gender,
      values.Address1 ? values.Address1 : initialValues.Address1,
      values.Address2 ? values.Address2 : initialValues.Address2,
      values.Address3 ? values.Address3 : initialValues.Address3,
      values.residence[2],
      values.PinCode ? values.PinCode : initialValues.PinCode,
      values.residence[1],
      values.residence[0],
      values.tel ? values.tel : initialValues.tel,
      values.mobile1 ? values.mobile1 : initialValues.mobile1,
      values.mobile2 ? values.mobile2 : initialValues.mobile2,
      values.email ? values.email : initialValues.email,
      values.AadharNo ? values.AadharNo : initialValues.AadharNo,
      values.PanNo ? values.PanNo : initialValues.PanNo,
      values.IsActive,
      values.DesignationCode
        ? values.DesignationCode
        : initialValues.DesignationCode,
      url ? url.path : null,
      url ? url.pathType : "U"
    );
    // console.log(val);
    dispatch(InsUpdtEmployeeMaster(props.formData ? "U" : "I", val));
  };

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Form
          labelAlign="left"
          form={form}
          initialValues={initialValues}
          name="userbody"
          {...formItemLayout}
          onFinish={onFinish}
        >
          <Row justify="center">
            <Col flex={0.6}>
              <CardHeader title={currentTran.formTitle} />
              <Card bordered={true}>
                <Form.Item
                  label="Name"
                  style={{ marginBottom: 0, maxHeight: 45 }}
                  rules={[{ required: true }]}
                >
                  <Form.Item
                    name="FirstName"
                    rules={[
                      { required: true, message: "Please input first name!" },
                    ]}
                    style={{
                      display: "inline-block",
                      width: "calc(30% - 8px)",
                    }}
                  >
                    <Input placeholder="First name" />
                  </Form.Item>
                  <Form.Item
                    name="MiddleName"
                    rules={[
                      { required: true, message: "Please input middle name!" },
                    ]}
                    style={{
                      display: "inline-block",
                      width: "calc(30% - 8px)",
                      margin: "0 5px",
                    }}
                  >
                    <Input placeholder="Middle name" />
                  </Form.Item>
                  <Form.Item
                    name="LastName"
                    rules={[
                      { required: true, message: "Please input last name!" },
                    ]}
                    style={{
                      display: "inline-block",
                      width: "calc(30% - 8px)",
                    }}
                  >
                    <Input placeholder="Last name" />
                  </Form.Item>
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  label="Date Of Birth"
                  name="DOB"
                  rules={[
                    {
                      required: true,
                      message: "Please input Date of Birth!",
                    },
                  ]}
                >
                  <DatePicker
                    defaultValue={moment(new moment())}
                    format={dateFormatList}
                  />
                </Form.Item>
                <Form.Item
                  name="Gender"
                  label="Gender"
                  style={{ marginBottom: 5, maxHeight: 44 }}
                  rules={[{ required: true, message: "Please select gender!" }]}
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
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input placeholder="E-mail" />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="mobile1"
                  label="Mobile Number"
                  rules={[
                    { required: true, message: "Please input mobile number!" },
                  ]}
                >
                  <Input
                    placeholder="Mobile Number"
                    addonBefore={"+91"}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="Address1"
                  label="Flat / Buiding"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Flat / Buiding!",
                    },
                  ]}
                >
                  <Input placeholder="Flat No : / Building No" />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="Address2"
                  label="Area / Locality"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Area / Locality!",
                    },
                  ]}
                >
                  <Input placeholder="Area / Locality" />
                </Form.Item>

                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="Address3"
                  label="Landmark"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Landmark!",
                    },
                  ]}
                >
                  <Input placeholder="Landmark" />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="PinCode"
                  label="Pincode"
                  type="tel"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Pincode!",
                    },
                  ]}
                >
                  <Input placeholder="Pincode" />
                </Form.Item>
                <Form.Item
                  name="residence"
                  label="City/State/Country"
                  style={{ marginBottom: 0, maxHeight: 44 }}
                  rules={[
                    {
                      type: "array",
                      required: true,
                      message: "Please select your habitual residence!",
                    },
                  ]}
                >
                  <Cascader options={addressOption()} />
                </Form.Item>
                <Form.Item
                  name="CategoryCode"
                  label="Category"
                  style={{ marginBottom: 5 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select Category!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a Category"
                    optionFilterProp="children"
                    allowClear={true}
                  >
                    {Category.map((item) => {
                      return (
                        <Option
                          key={item.Id}
                          value={item.Id}
                        >{`${item.MasterDesc}`}</Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="QualificationCode"
                  label="Qualification"
                  style={{ marginBottom: 5 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select Qualification!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a Qualification"
                    optionFilterProp="children"
                    allowClear={true}
                  >
                    {Qualification.map((item) => {
                      return (
                        <Option
                          key={item.Id}
                          value={item.Id}
                        >{`${item.MasterDesc}`}</Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="DesignationCode"
                  label="Designation"
                  style={{ marginBottom: 5 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select Designation!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a Designation"
                    optionFilterProp="children"
                    allowClear={true}
                  >
                    {Designations.map((item) => {
                      return (
                        <Option
                          key={item.Id}
                          value={item.Id}
                        >{`${item.MasterDesc}`}</Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="ExperienceCode"
                  label="Experience"
                  style={{ marginBottom: 5 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select Experience!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a Experience"
                    optionFilterProp="children"
                    allowClear={true}
                  >
                    {Experience.map((item) => {
                      return (
                        <Option
                          key={item.Id}
                          value={item.Id}
                        >{`${item.MasterDesc}`}</Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="GradeCode"
                  label="Grade"
                  style={{ marginBottom: 5 }}
                  rules={[
                    {
                      required: true,
                      message: "Please select Grade!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a grade"
                    optionFilterProp="children"
                    allowClear={true}
                  >
                    {grade.map((item) => {
                      return (
                        <Option
                          key={item.Id}
                          value={item.Id}
                        >{`${item.MasterDesc}`}</Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="ProfilePicture"
                  label="Profile Picture"
                >
                  <Upload
                    style={{ width: "128px", height: "128px" }}
                    beforeUpload={(file) => {
                      return new Promise(function (resolve, reject) {
                        if (file.size / 1024 <= 3000) {
                          return resolve(true);
                        } else {
                          message.error("Image must smaller than 3MB!");
                          return reject(false);
                        }
                      });
                    }}
                    action={(file) => {
                      setImageLoading(true);
                      return new Promise(function (resolve, reject) {
                        // EmployeesProfile
                        if (DefaultUplodConfig.value1 === "FIREBASE") {
                          UploadImageFirebase(
                            `${CompCode}/EmployeesProfile`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: res.url,
                              path: res.url,
                              pathType: "U",
                            });
                            setImageLoading(false);
                          });
                        } else {
                          UploadImageOwnWebServer(
                            `${CompCode}/${"EmployeesProfile"}/`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: `${
                                FileUploadPath.value1
                              }/${CompCode}/${"EmployeesProfile"}/${
                                res.fileName
                              }`,
                              path: `${CompCode}/${"EmployeesProfile"}/${
                                res.fileName
                              }`,
                              pathType: "C",
                            });
                          });
                        }
                      });
                    }}
                    listType="picture-card"
                    multiple={false}
                  >
                    {url ? (
                      <img src={url.url} style={{ width: "100%" }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="mobile2"
                  label="Alternate Mobile No."
                >
                  <Input placeholder=" Alternate Number" />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="tel"
                  label="Telephone"
                >
                  <Input placeholder="Telephone Number" />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="AadharNo"
                  label="Aadhar Number"
                >
                  <Input placeholder=" Aadhar Number" />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="PanNo"
                  label="Pan Card Number"
                >
                  <Input placeholder="Pan Card Number" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 5 }} name="bio" label="Bio">
                  <CKEditors
                    // value={ChkEditContent}
                    content={ChkEditContent}
                    events={{
                      blur: handleblur,
                      change: onChange,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="IsActive"
                  label="Status"
                  style={{ marginBottom: 5 }}
                  value={props.formData ? props.formData.Gender : ""}
                  rules={[{ required: true, message: "Please select Status!" }]}
                >
                  <Radio.Group>
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>InActive</Radio>
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
              </Card>
            </Col>
          </Row>
        </Form>
      </Spin>
    </div>
  );
};

export default EmployeeMasterCardNew;
