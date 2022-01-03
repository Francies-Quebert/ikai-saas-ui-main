import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { InsUpdtOtherMaster } from "../../../../store/actions/othermaster";
import OtherMaster from "../../../../models/othermaster";
import { reInitialize } from "../../../../store/actions/currentTran";

const OtherMasterCard = props => {
  const [Status, setStatus] = useState("false");
  const currentTran = useSelector(state => state.currentTran);
  const MasterType = useSelector(state => state.AppMain.serviceTypes);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(props.formData ? `"asdsd", ${props.formData.MasterType}` :"")
    // console.log("OtherMasterCard  TrnType Props", props.trnType);
    if (currentTran.isSuccess) {
      formik.resetForm(formInitialValues);
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);

  const formInitialValues = {
    Id: props.formData ? props.formData.Id : 0,
    MasterType: props.formData ? props.formData.MasterType : "",
    ShortCode: props.formData ? props.formData.ShortCode : "",
    MasterDesc: props.formData ? props.formData.MasterDesc : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
    SysOption1: props.formData ? props.formData.SysOption1 : "",
    SysOption2: props.formData ? props.formData.SysOption2 : "",
    SysOption3: props.formData ? props.formData.SysOption3 : "",
    SysOption4: props.formData ? props.formData.SysOption4 : "",
    SysOption5: props.formData ? props.formData.SysOption5 : ""
  };
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      // MasterType: Yup.string()
      //   .trim("Spaces are Restricted")
      //   .required("Required"),
      ShortCode: Yup.string().required("Required"),
      MasterDesc: Yup.string().required("Required"),
      Status: Yup.string().required("Required")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));
        const val = new OtherMaster(
          values.Id,
          props.trnType,
          values.ShortCode,
          values.MasterDesc,
          values.Status === "true" ? true : false,
          values.SysOption1,
          values.SysOption2,
          values.SysOption3,
          values.SysOption4,
          values.SysOption5,
          props.trnType
        );
        dispatch(InsUpdtOtherMaster(props.formData ? "U" : "I", val));
        // console.log(val, "insert");
        setSubmitting(false);
        props.onBackPress();
      }, 400);
    }
  });

  return (
    <Fragment>
      <form
        onSubmit={formik.handleSubmit}
        // onSubmit={e => {
        //     e.preventDefault();
        //   }}
      >
        <div className="col-sm-12">
          <div className="card">
            {/* <div className="card-header">
              <h5 className="fa fa-edit">Edit Info.</h5>
            </div> */}
            <div className="card-body">
              <form className="theme-form">
                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                   * Short Code:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="ShortCode"
                      style={{textTransform:"uppercase"}}
                      maxLength={10}
                      type="text"
                      placeholder="Enter Short Code"
                      name="ShortCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.ShortCode}
                      disabled={props.formData ? true : false}
                    />
                    {formik.touched.ShortCode && formik.errors.ShortCode ? (
                      <span className="validationError">
                        {formik.errors.ShortCode}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    * Master Desc:
                  </label>
                  <div className="col-sm-9">
                    <textarea
                      className="form-control"
                      rows="3"
                      id="MasterDesc"
                      placeholder="Enter Description"
                      name="MasterDesc"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.MasterDesc}
                    />
                    {formik.touched.MasterDesc && formik.errors.MasterDesc ? (
                      <span className="validationError">
                        {formik.errors.MasterDesc}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption1:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="SysOption1"
                      type="text"
                      placeholder="Enter Title"
                      name="SysOption1"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SysOption1}
                    />
                    {formik.touched.SysOption1 && formik.errors.SysOption1 ? (
                      <span className="validationError">
                        {formik.errors.SysOption1}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption2:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="SysOption2"
                      type="text"
                      placeholder="Enter Title"
                      name="SysOption2"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SysOption2}
                    />
                    {formik.touched.SysOption2 && formik.errors.SysOption2 ? (
                      <span className="validationError">
                        {formik.errors.SysOption2}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption3:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="SysOption3"
                      type="text"
                      placeholder="Enter Title"
                      name="SysOption3"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SysOption3}
                    />
                    {formik.touched.SysOption3 && formik.errors.SysOption3 ? (
                      <span className="validationError">
                        {formik.errors.SysOption3}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption4:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="SysOption4"
                      type="text"
                      placeholder="Enter Title"
                      name="SysOption4"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SysOption4}
                    />
                    {formik.touched.SysOption4 && formik.errors.SysOption4 ? (
                      <span className="validationError">
                        {formik.errors.SysOption4}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption5:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="SysOption5"
                      type="text"
                      placeholder="Enter Title"
                      name="SysOption5"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SysOption5}
                    />
                    {formik.touched.SysOption5 && formik.errors.SysOption5 ? (
                      <span className="validationError">
                        {formik.errors.SysOption5}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Status:
                  </label>
                  <div className="col-sm-9">
                    <div className="row pt-2">
                      <div className="col-md-4">
                        <label className="d-block" for="radio-active">
                          <input
                            className="radio_animated"
                            id="radio-active"
                            type="radio"
                            name="Status"
                            value="true"
                            checked={formik.values.Status === "true"}
                            onClick={() => setStatus("true")}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          Active
                        </label>
                      </div>
                      <div className="col-md-4">
                        <label className="d-block" for="radio-inactive">
                          <input
                            className="radio_animated"
                            id="radio-inactive"
                            type="radio"
                            name="Status"
                            value="false"
                            checked={formik.values.Status === "false"}
                            onClick={() => setStatus("false")}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          InActive
                        </label>
                        {formik.touched.Status && formik.errors.Status ? (
                          <span className="validationError">
                            {formik.errors.Status}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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
      </form>
    </Fragment>
  );
};

export default OtherMasterCard;
