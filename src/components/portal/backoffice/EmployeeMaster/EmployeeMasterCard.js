import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CKEditors from "react-ckeditor-component";
// import seven from "../../../../assets/images/user/7.jpg";
import renderHTML from "react-render-html";
import { InsUpdtEmployeeMaster } from "../../../../store/actions/employeemaster";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import EmployeeMaster from "../../../../models/emloyeemaster";
import { reInitialize } from "../../../../store/actions/currentTran";
//import deaultPersonImg from '../../assets/images/user/deaultPerson.jpg';
import deaultPersonImg from "../../../../assets/images/user/deaultPerson.png";
import { Link } from "react-router-dom";
import { Edit } from "react-feather";
import FileBase64 from "react-file-base64";
import _ from "lodash";

const EmployeeMasterCard = props => {
  const [Status, setStatus] = useState("false");
  const dispatch = useDispatch();
  const [modal8, setModal8] = useState();
  const currentTran = useSelector(state => state.currentTran);
  const [ChkEditContent, setChkEditContent] = useState(
    props.formData ? props.formData.bio : ""
  );
  // date select
  const [selectedDate, setSelectedDate] = useState(
    props.formData ? moment(props.formData.DOB)._d : moment(new moment())._d
  );
  const grade = useSelector(state => state.AppMain.otherMasterGrade);
  const Experience = useSelector(state => state.AppMain.otherMasterExperience);
  const Designations = useSelector(
    state => state.AppMain.otherMasterDesignations
  );
  const Qualification = useSelector(state => state.AppMain.otherMasterQLF);
  const Category = useSelector(state => state.AppMain.otherMasterCategory);

  useEffect(() => {
    formik.values.DOB = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    if (currentTran.isSuccess) {
      formik.resetForm(formInitialValues);
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);

  useEffect(() => {
    formik.values.bio = ChkEditContent;
  }, [ChkEditContent]);

  const toggle8 = () => {
    setModal8(!modal8);
  };
  const handleblur = evt => {
    var newContent = evt.editor.getData();
    setChkEditContent(newContent);
    setModal8(!modal8);
  };

  // useEffect(() => {
  //   if (currentTran.isSuccess) {
  //     formik.resetForm(formInitialValues);
  //     dispatch(reInitialize());
  //     props.onBackPress();
  //   } else if (currentTran.error) {
  //     toast.error(currentTran.error);
  //   }
  // }, [currentTran.error, currentTran.isSuccess]);

  const formInitialValues = {
    Id: props.formData ? props.formData.Id : 0,
    EmpType: props.formData ? props.formData.EmpType : "A",
    FirstName: props.formData ? props.formData.FirstName : "",
    MiddleName: props.formData ? props.formData.MiddleName : "",
    LastName: props.formData ? props.formData.LastName : "",
    bio: props.formData ? props.formData.bio : "",
    CategoryCode: props.formData ? props.formData.CategoryCode : 0,
    QualificationCode: props.formData ? props.formData.QualificationCode : 0,
    ExperienceCode: props.formData ? props.formData.ExperienceCode : 0,
    GradeCode: props.formData ? props.formData.GradeCode : 0,
    DOB: props.formData ? selectedDate : selectedDate,
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
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
    DesignationCode: props.formData ? +props.formData.DesignationCode : 0,
    ProfilePicture: props.formData
      ? props.formData.ProfilePicture
      : deaultPersonImg
  };
  const onChange = evt => {
    var newContent = evt.editor.getData();
  };
  let inputTextConstant = Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Required");
  // let inputTextPhoneConstant = Yup.number()
  //   .required("required")
  //   .max(10, "Entered Number Should not be more than 12")
  //  .integer("Invaild Number");

  let inputTextPhoneConstant = Yup.string()
    .length(10)
    .required("required")
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    );

  // console.log(props.formData);
  const [profilePic, setProfilePic] = useState(
    props.formData ? props.formData.ProfilePicture : deaultPersonImg
  );

  // useEffect(() => {
  //   //props.formData ? props.formData.ProfilePicture : deaultPersonImg
  //   let base64Image = new Buffer(
  //     props.formData.ProfilePicture,
  //     "binary"
  //   ).toString("base64");
  //   setProfilePic(`data:image/jpeg;base64,${base64Image}`);
  //   console.log(base64Image);
  // }, []);
  // const base64Image = new Buffer(
  //   profilePic,
  //   "binary"
  // ).toString("base64");
  // console.log(base64Image)

  let selectConstant = Yup.string().required("Required");
  let AddressValid = Yup.string().max(50, "Must be 50 characters or less ");
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      FirstName: inputTextConstant,
      MiddleName: inputTextConstant,
      LastName: inputTextConstant,
      CategoryCode: selectConstant,
      QualificationCode: selectConstant,
      ExperienceCode: selectConstant,
      GradeCode: selectConstant,
      IsActive: Yup.string().required("Required"),
      Gender: Yup.string().required("Required"),
      email: Yup.string()
        .required("Required")
        .email("Invalid Email"),
      mobile1: inputTextPhoneConstant,
      mobile2: inputTextPhoneConstant,
      tel: inputTextPhoneConstant,
      DOB: Yup.date().max(
        moment(new moment()).add(-18, "years")._d,
        "DOB must be greater than 18 years"
      ),
      Address1: Yup.string()
        .required("Required")
        .max(50, "Must be 50 characters or less "),
      Address2: AddressValid,
      // Address3: Yup.string()
      //   .required("Required")
      //   .max(50, "Must be 50 characters or less "),
      // City: selectConstant,
      // Country: selectConstant,
      // State: selectConstant,
      PinCode: inputTextConstant,
      AadharNo: Yup.string()
        .required("Required")
        .max(15, "Must be 15 characters or less "),

      PanNo: Yup.string()
        .required("Required")
        .max(15, "Must be 15 characters or less "),
      bio: Yup.string().required("Required"),
      DesignationCode: selectConstant
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        //  alert(JSON.stringify(values, null, 2));
        const val = new EmployeeMaster(
          values.Id,
          values.EmpType,
          values.FirstName,
          values.MiddleName,
          values.LastName,
          values.bio,
          values.CategoryCode,
          values.QualificationCode,
          values.ExperienceCode,
          values.GradeCode,
          moment(values.DOB).format("YYYY-MM-DD"),
          values.Gender,
          values.Address1,
          values.Address2,
          values.Address3,
          values.City,
          values.PinCode,
          values.State,
          values.Country,
          values.tel,
          values.mobile1,
          values.mobile2,
          values.email,
          values.AadharNo,
          values.PanNo,
          values.IsActive === "true" ? true : false,
          +values.DesignationCode,
          profilePic
        );

        dispatch(InsUpdtEmployeeMaster(props.formData ? "U" : "I", val));
        setSubmitting(false);
      }, 400);
    }
  });

  return (
    <Fragment>
      <form
        className="form theme-form"
        onSubmit={formik.handleSubmit}
        // onSubmit={e => {
        //     e.preventDefault();
      
        //   }}
      >
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <div className="card">
              {/* <div className="form-group row">
                <div className="col-sm-12 ">
                  <div className="avatar d-flex justify-content-center">
                    <img
                      className="img-200 rounded-circle"
                      src={
                        "https://scontent.fbom7-1.fna.fbcdn.net/v/t1.0-1/p160x160/71087927_2514750531978289_8623084588404572160_o.jpg?_nc_cat=104&_nc_sid=dbb9e7&_nc_ohc=wsjN1PK9RsYAX-41pKV&_nc_ht=scontent.fbom7-1.fna&_nc_tp=6&oh=af273c745cd8b2a9a5d59cfd731cb2b7&oe=5E9527FA"
                      }
                      alt="#"
                    />
                  </div>
                </div>
              </div> */}

              <div className="card-body p-t-10 p-b-10">
                <div className="row ">
                  <div className="col-md-4"></div>
                  <div className="col-md-4 ">
                    <div
                      className="sidebar-user text-center"
                      style={{ textAlign: "center" }}
                    >
                      <img
                        height="100px"
                        width="100px"
                        className="img-100 rounded-circle lazyloaded blur-up"
                        // src={base64Image}
                        src={profilePic}
                        alt="#"
                      />
                    </div>
                  </div>
                  <div className="col-md-4"></div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-md-3 col-form-label"
                    style={{ marginTop: 10 }}
                  >
                    Upload Image
                  </label>
                  <div
                    className="col-md-8 form-control"
                    style={{ marginLeft: 15, marginTop: 5 }}
                  >
                    <FileBase64
                      multiple={false}
                      onDone={obj => {
                        if (obj.type.includes("image") === true) {
                          setProfilePic(obj.base64);
                          // console.log(obj.base64);
                          formik.values.ProfilePicture = obj.base64;
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">* Name</label>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-4">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="First Name"
                          id="FirstName"
                          name="FirstName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.FirstName}
                        />
                        {formik.touched.FirstName && formik.errors.FirstName ? (
                          <span className="validationError">
                            {formik.errors.FirstName}
                          </span>
                        ) : null}
                      </div>
                      <div className="col-md-4">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Middle Name"
                          id="MiddleName"
                          name="MiddleName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.MiddleName}
                        />

                        {formik.touched.MiddleName &&
                        formik.errors.MiddleName ? (
                          <span className="validationError">
                            {formik.errors.MiddleName}
                          </span>
                        ) : null}
                      </div>
                      <div className="col-md-4">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Last Name"
                          id="LastName"
                          name="LastName"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.LastName}
                        />
                        {formik.touched.LastName && formik.errors.LastName ? (
                          <span className="validationError">
                            {formik.errors.LastName}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">* Category</label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      id="CategoryCode"
                      style={{ height: 35 }}
                      name="CategoryCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.CategoryCode}
                    >
                      {Category &&
                        Category.map(ii => (
                          <option key={ii.Id} value={ii.Id}>
                            {ii.MasterDesc}
                          </option>
                        ))}
                    </select>

                    {formik.touched.CategoryCode &&
                    formik.errors.CategoryCode ? (
                      <span className="validationError">
                        {formik.errors.CategoryCode}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    * Qualification
                  </label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      type="text"
                      style={{ height: 35 }}
                      placeholder="Qualification"
                      id="QualificationCode"
                      name="QualificationCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.QualificationCode}
                    >
                      <option value="">--Select--</option>
                      {Qualification &&
                        Qualification.map(ii => (
                          <option key={ii.Id} value={ii.Id}>
                            {ii.MasterDesc}
                          </option>
                        ))}
                    </select>
                    {formik.touched.QualificationCode &&
                    formik.errors.QualificationCode ? (
                      <span className="validationError">
                        {formik.errors.QualificationCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    * Designation
                  </label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      type="text"
                      style={{ height: 35 }}
                      placeholder="qualification"
                      id="DesignationCode"
                      name="DesignationCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.DesignationCode}
                    >
                      <option value="">--Select--</option>
                      {Designations &&
                        Designations.map(ii => (
                          <option key={ii.Id} value={ii.Id}>
                            {ii.MasterDesc}
                          </option>
                        ))}
                    </select>
                    {formik.touched.DesignationCode &&
                    formik.errors.DesignationCode ? (
                      <span className="validationError">
                        {formik.errors.DesignationCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    * Experience
                  </label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      type="text"
                      style={{ height: 35 }}
                      placeholder="Experience"
                      id="ExperienceCode"
                      name="ExperienceCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.ExperienceCode}
                    >
                      <option value="">--Select--</option>
                      {Experience &&
                        Experience.map(ii => (
                          <option key={ii.Id} value={ii.Id}>
                            {ii.MasterDesc}
                          </option>
                        ))}
                    </select>
                    {formik.touched.ExperienceCode &&
                    formik.errors.ExperienceCode ? (
                      <span className="validationError">
                        {formik.errors.ExperienceCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className=" col-md-3 col-form-label">* Grade</label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      style={{ height: 35 }}
                      type="text"
                      placeholder="Grade"
                      id="GradeCode"
                      name="GradeCode"
                      value={formik.values.GradeCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">--Select--</option>
                      {grade &&
                        grade.map(ii => (
                          <option key={ii.Id} value={ii.Id}>
                            {ii.MasterDesc}
                          </option>
                        ))}
                    </select>
                    {formik.touched.GradeCode && formik.errors.GradeCode ? (
                      <span className="validationError">
                        {formik.errors.GradeCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    * Date of Birth
                  </label>
                  <div className="col-md-9 form-group">
                    <DatePicker
                      className="form-control digits"
                      name="DOB"
                      id="DOB"
                      format="DD/YY/MM"
                      selected={selectedDate}
                      // value={selectedDate}
                      maxDate={moment(new moment())._d}
                      showYearDropdown={true}
                      onChange={evt => {
                        setSelectedDate(evt);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.DOB}
                      dropdownMode="select"
                    />
                    {formik.touched.DOB && formik.errors.DOB ? (
                      <span className="validationError">
                        {formik.errors.DOB}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="col-md-12">
                  <fieldset className="form-group">
                    <div className="row">
                      <label className="col-form-label pd-1 col-sm-3 pl-1 pt-0">
                        * Gender:{" "}
                      </label>
                      <div className="col-sm-6">
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="radio radio-primary ml-2">
                              <input
                                id="radio11"
                                type="radio"
                                name="Gender"
                                value="M"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.Gender === "M"}
                              />
                              <label htmlFor="radio11">Male</label>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="radio radio-primary ml-2">
                              <input
                                id="radio22"
                                type="radio"
                                name="Gender"
                                value="F"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.Gender === "F"}
                              />
                              <label htmlFor="radio22">Female</label>
                            </div>
                          </div>
                        </div>

                        {formik.touched.Gender && formik.errors.Gender ? (
                          <span className="validationError">
                            {formik.errors.Gender}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">* Email</label>
                  <div className="col-md-9">
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Email"
                      id="email"
                      name="email"
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

                <div className="form-group row">
                  <label className=" col-md-3 col-form-label">* Address</label>
                  <div className="col-md-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Address"
                      id="Address1"
                      name="Address1"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Address1}
                    />
                    {formik.touched.Address1 && formik.errors.Address1 ? (
                      <span className="validationError">
                        {formik.errors.Address1}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className=" col-md-3 col-form-label"></label>
                  <div className="col-md-9">
                    <input
                      className="form-control"
                      type="text"
                      id="Address2"
                      placeholder="Address Two (optional)"
                      name="Address2"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Address2}
                    />
                    {formik.touched.Address2 && formik.errors.Address2 ? (
                      <span className="validationError">
                        {formik.errors.Address2}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label"></label>
                  <div className="col-md-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Address Three (optional)"
                      id="Address3"
                      name="Address3"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Address3}
                    />
                    {formik.touched.Address3 && formik.errors.Address3 ? (
                      <span className="validationError">
                        {formik.errors.Address3}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* start */}
                {/* <div className="form-group row">
                  <label className="col-md-3 col-form-label">City</label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      type="text"
                      placeholder="City"
                      style={{ height: 35 }}
                      id="City"
                      name="City"
                      value={formik.values.City}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">--Select--</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    {formik.touched.City && formik.errors.City ? (
                      <span className="validationError">
                        {formik.errors.City}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group  row">
                  <label className="col-md-3 col-form-label">State</label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      type="text"
                      placeholder="State"
                      id="State"
                      name="State"
                      value={formik.values.State}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">--Select--</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    {formik.touched.State && formik.errors.State ? (
                      <span className="validationError">
                        {formik.errors.State}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className=" col-md-3 col-form-label">Country</label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      type="text"
                      placeholder="Country"
                      id="Country"
                      name="Country"
                      value={formik.values.Country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">--Select--</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                    {formik.touched.Country && formik.errors.Country ? (
                      <span className="validationError">
                        {formik.errors.Country}
                      </span>
                    ) : null}
                  </div>
                </div> */}

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">* Pin Code</label>
                  <div className="col-md-9">
                    <input
                      className="form-control "
                      type="tel"
                      placeholder="Pin Code"
                      id="PinCode"
                      name="PinCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.PinCode}
                    />
                    {formik.touched.PinCode && formik.errors.PinCode ? (
                      <span className="validationError">
                        {formik.errors.PinCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">Telephone</label>
                  <div className="col-md-9">
                    <input
                      className="form-control"
                      type="tel"
                      placeholder="Telephone"
                      id="tel"
                      name="tel"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.tel}
                    />
                    {formik.touched.tel && formik.errors.tel ? (
                      <span className="validationError">
                        {formik.errors.tel}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    * Mobile Number
                  </label>
                  <div className="col-md-9">
                    <input
                      className="form-control "
                      type="tel"
                      placeholder="Mobile Number"
                      id="mobile1"
                      name="mobile1"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile1}
                    />
                    {formik.touched.mobile1 && formik.errors.mobile1 ? (
                      <span className="validationError">
                        {formik.errors.mobile1}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    Alternate Mobile Number
                  </label>
                  <div className="col-md-9">
                    <input
                      className="form-control "
                      type="tel"
                      id="mobile2"
                      placeholder="Alternate Mobile Number"
                      name="mobile2"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile2}
                    />
                    {formik.touched.mobile2 && formik.errors.mobile2 ? (
                      <span className="validationError">
                        {formik.errors.mobile2}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">Bio</label>
                  <div className="col-md-9">
                    <div
                      className="form-control overflowStyle"
                      style={{
                        borderColor: "#eff0f1",
                        color: "#898989",
                        height: 135,
                        overflowY: "auto"
                      }}
                      onClick={toggle8}
                    >
                      {renderHTML(ChkEditContent)}
                    </div>
                    {formik.touched.bio && formik.errors.bio ? (
                      <span className="validationError">
                        {formik.errors.bio}
                      </span>
                    ) : null}
                    <Modal
                      centered={true}
                      isOpen={modal8}
                      toggle={toggle8}
                      size="lg"
                      backdrop="static"
                    >
                      <ModalHeader toggle={toggle8}>Employee Bio</ModalHeader>
                      <ModalBody>
                        <CKEditors
                          activeclassName="p10"
                          id="bio"
                          name="bio"
                          value={formik.values.bio}
                          content={formik.values.bio}
                          events={{
                            blur: handleblur,
                            change: onChange
                          }}
                        />
                      </ModalBody>
                      <ModalFooter style={{ justifyContent: "end" }}>
                        <button className="btn btn-primary mr-1" type="submit">
                          Submit
                        </button>
                        <button className="btn btn-light" onClick={toggle8}>
                          Cancel
                        </button>
                      </ModalFooter>
                    </Modal>
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    * Aadhar Number
                  </label>
                  <div className="col-md-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Aadhar Number"
                      id="AadharNo"
                      name="AadharNo"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.AadharNo}
                    />
                    {formik.touched.AadharNo && formik.errors.AadharNo ? (
                      <span className="validationError">
                        {formik.errors.AadharNo}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    * PAN Card Number
                  </label>
                  <div className="col-md-9">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="PAN Card number"
                      id="PanNo"
                      name="PanNo"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.PanNo}
                    />
                    {formik.touched.PanNo && formik.errors.PanNo ? (
                      <span className="validationError">
                        {formik.errors.PanNo}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label pl-5"
                  htmlFor="inputPassword3"
                >
                  Status
                </label>
                <div className="col-sm-9">
                  <div className="row pt-2">
                    <div className="col-md-4">
                      <label className="d-block ml-3">
                        <input
                          className="radio_animated"
                          id="radio-active"
                          type="radio"
                          name="IsActive"
                          value="true"
                          checked={formik.values.IsActive === "true"}
                          onClick={() => setStatus("true")}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        Active
                      </label>
                    </div>

                    <div className="col-md-4">
                      <label className="d-block">
                        <input
                          className="radio_animated"
                          id="radio-inactive"
                          type="radio"
                          name="IsActive"
                          value="false"
                          checked={formik.values.IsActive === "false"}
                          onClick={() => setStatus("false")}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        InActive
                      </label>
                      {formik.touched.IsActive && formik.errors.IsActive ? (
                        <span className="validationError">
                          {formik.errors.IsActive}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button
                  disabled={formik.isSubmitting}
                  type="submit"
                  name="submit"
                  className="btn btn-secondary mr-1"
                >
                  Save
                </button>
                <button
                  type="reset"
                  name="reset"
                  onClick={() => {
                    dispatch(reInitialize());
                    formik.resetForm(formInitialValues);
                    setChkEditContent(props.formData ? props.formData.bio : "");
                    setSelectedDate(
                      props.formData
                        ? moment(props.formData.DOB)._d
                        : moment(new moment())._d
                    );
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
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
        </div>
      </form>
    </Fragment>
  );
};

export default EmployeeMasterCard;
