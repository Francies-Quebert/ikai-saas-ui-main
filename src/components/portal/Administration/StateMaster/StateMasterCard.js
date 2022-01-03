import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { InsUpdtStateMaster } from "../../../../store/actions/StateMaster";
import StateMaster from "../../../../models/StateMaster";

const StateMasterCard = props => {
  const [Status, setStatus] = useState("false");
  const currentTran = useSelector(state => state.currentTran);
  const Country = useSelector(state => state.countryMaster.countryMasters);

  useEffect(() => {
    if (currentTran.isSuccess) {
      formik.resetForm(formInitialValues);
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);

  const formInitialValues = {
    CountryName: props.formData
    ? Country.find(ii => ii.CountryCode === props.formData.CountryCode).CountryCode
    : "",
    StateCode: props.formData ? props.formData.StateCode : "",
    StateName: props.formData ? props.formData.StateName : "",
    StateShortCode: props.formData ? props.formData.StateCode2Char : "",
    IsDefault: props.formData ? props.formData.IsDefault.toString() : "true",
    Status: props.formData ? props.formData.IsActive : ""
  };

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      CountryName: Yup.string().required("Required"),
      StateCode: Yup.string().required("Required"),
      StateName: Yup.string().required("Required"),
      StateShortCode: Yup.string().required("Required"),
      Status: Yup.string().required("Required")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));

        const val = new StateMaster(
          values.CountryName,
          values.StateCode,
          values.StateName,
          values.StateShortCode,
          values.Status === "true" ? true : false,
        );
        dispatch(InsUpdtStateMaster(props.formData ? "U" : "I", val));
        setSubmitting(false);
        // setShowSuccess(!showSuccess)
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
                  <label className="col-md-3 col-form-label">* Country:</label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      id="CountryName"
                      style={{ height: 35 }}
                      name="CountryName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.CountryName}
                      disabled={props.formData ? true : false}
                    >
                      <option>--Select--</option>
                      {Country &&
                        Country.map(ii => (
                          <option key={ii.CountryCode} value={ii.CountryCode}>
                            {ii.CountryName}
                          </option>
                        ))}
                    </select>

                    {formik.touched.CountryName && formik.errors.CountryName ? (
                      <span className="validationError">
                        {formik.errors.CountryName}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                   * State Code:
                  </label>
                  <div className="col-sm-3">
                    <input
                      className="form-control"
                      id="StateCode"
                      type="text"
                      placeholder="State Code"
                      name="StateCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.StateCode}
                      disabled={props.formData ? true : false}
                    />
                    {formik.touched.StateCode && formik.errors.StateCode ? (
                      <span className="validationError">
                        {formik.errors.StateCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                   * State Name:
                  </label>
                  <div className="col-sm-8">
                    <input
                      className="form-control"
                      id="StateName"
                      type="text"
                      placeholder="Enter State Name"
                      name="StateName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.StateName}
                    />
                    {formik.touched.StateName && formik.errors.StateName ? (
                      <span className="validationError">
                        {formik.errors.StateName}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    State Short Code:
                  </label>
                  <div className="col-sm-2">
                    <input
                      className="form-control"
                      id="StateShortCode"
                      type="text"
                      placeholder="Short Code"
                      name="StateShortCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.StateShortCode}
                      disabled={props.formData ? true : false}
                    />
                    {formik.touched.StateShortCode &&
                    formik.errors.StateShortCode ? (
                      <span className="validationError">
                        {formik.errors.StateShortCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row mb-0">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                   * Default State:
                  </label>
                  <div className="col-md-3">
                    <div className="form-group m-checkbox-inline">
                      <div className="checkbox checkbox-dark ml-2">
                        <input id="inline-1" type="checkbox" />
                        <label for="inline-1">
                          Is Default<span className="digits"></span>
                        </label>
                      </div>
                    </div>
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

export default StateMasterCard;
