import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { InsUpdtCountryMaster } from "../../../../store/actions/CountryMaster";
import CountryMaster from "../../../../models/CountryMaster";

const CountryMasterCard = props => {
  const [Status, setStatus] = useState("false");
  const [Default, setDefault] = useState("false");
  const currentTran = useSelector(state => state.currentTran);

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
    CountryCode: props.formData ? props.formData.CountryCode : "",
    CountryName: props.formData ? props.formData.CountryName : "",
    MobCode: props.formData ? props.formData.MobileCode : "",
    CurrencySymbolChar: props.formData ? props.formData.CurrencySymbolChar : "",
    CountryShortCode: props.formData ? props.formData.CountryCode2Char : "",
    CurrencyCode: props.formData ? props.formData.CurrencyCode : "",
    IsDefault: props.formData ? props.formData.IsDefault.toString() : "true",
    Status: props.formData ? props.formData.IsActive.toString() : "true"
  };

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      CountryCode: Yup.string().required("Required"),
      CountryName: Yup.string().required("Required"),
      MobCode: Yup.string().required("Required"),
      CountryShortCode: Yup.string().required("Required"),
      Status: Yup.string().required("Required")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        const val = new CountryMaster(
          values.CountryCode,
          values.CountryName,
          values.MobCode,
          null,
          values.CountryShortCode,
          null,
          values.IsDefault === "true" ? true : false,
          values.Status === "true" ? true : false
        );
        dispatch(InsUpdtCountryMaster(props.formData ? "U" : "I", val));
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
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Country Code:
                  </label>
                  <div className="col-sm-3">
                    <input
                      className="form-control"
                      id="CountryCode"
                      type="text"
                      placeholder="Country Code"
                      name="CountryCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.CountryCode}
                      disabled={props.formData ? true : false}
                    />
                    {formik.touched.CountryCode && formik.errors.CountryCode ? (
                      <span className="validationError">
                        {formik.errors.CountryCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Country Name:
                  </label>
                  <div className="col-sm-8">
                    <input
                      className="form-control"
                      id="CountryName"
                      type="text"
                      placeholder="Enter Country Name"
                      name="CountryName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.CountryName}
                    />
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
                    Country Short Code:
                  </label>
                  <div className="col-sm-2">
                    <input
                      className="form-control"
                      id="CountryShortCode"
                      type="text"
                      placeholder="Short Code"
                      name="CountryShortCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.CountryShortCode}
                      disabled={props.formData ? true : false}
                    />
                    {formik.touched.CountryShortCode &&
                    formik.errors.CountryShortCode ? (
                      <span className="validationError">
                        {formik.errors.CountryShortCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Mobile Code:
                  </label>
                  <div className="col-sm-4">
                    <input
                      className="form-control"
                      id="MobCode"
                      type="text"
                      placeholder="Enter Mobile Code"
                      name="MobCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.MobCode}
                    />
                    {formik.touched.MobCode && formik.errors.MobCode ? (
                      <span className="validationError">
                        {formik.errors.MobCode}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Default Country:
                  </label>
                  <div className="col-md-3">
                    <div className="form-group m-checkbox-inline">
                      <div className="checkbox checkbox-dark ml-2">
                        <input
                          id="inline-1"
                          type="checkbox"
                          value="true"
                          name="IsDefault"
                          checked={formik.values.IsDefault === "false"}
                          onClick={() => {
                            setStatus("true");
                          }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
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

export default CountryMasterCard;
