import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { insUpdtServiceTypeMaster } from "../../../../store/actions/servicetype";
import { reInitialize } from "../../../../store/actions/currentTran";

import AppServiceType from "../../../../models/app-servicetypes";

import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const ServiceTypeMasterCard = props => {
  const [Status, setStatus] = useState("false");
  const currentTran = useSelector(state => state.currentTran);

  useEffect(() => {
    if (currentTran.isSuccess) {
      formik.resetForm(formInitialValues);
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
      // alert(serviceTypeTranInfo.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);

  const formInitialValues = {
    ServiceTypeCode: props.formData ? props.formData.serviceTypeCode : "",
    ServiceTypeTitle: props.formData ? props.formData.serviceTypeTitle : "",
    ServiceTypeDesc: props.formData ? props.formData.serviceTypeDesc : "",
    ImageURL: props.formData ? props.formData.serviceTypeImageURI : "",
    Orderby: props.formData ? props.formData.orderby : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true"
  };
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      ServiceTypeCode: Yup.string()
        .trim("Spaces are Restricted")
        .required("Required"),

      ServiceTypeTitle: Yup.string().required("Required"),
      ServiceTypeDesc: Yup.string().required("Required"),
      ImageURL: Yup.string().required("Required"),
      Status: Yup.string().required("Required"),

      Orderby: Yup.number()
        .required("required")
        .max(99, "Must be less than 99")
        .integer("Invaild")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));
        const val = new AppServiceType(
          values.ServiceTypeCode,
          values.ServiceTypeTitle,
          values.ServiceTypeDesc,
          null,
          values.ImageURL,
          values.Status === "true" ? true : false,
          values.Orderby
        );
        // console.log('hey theres',val);

        dispatch(insUpdtServiceTypeMaster(props.formData ? "U" : "I", val));
        setSubmitting(false);
      }, 400);
    }
  });
  return (
    <Fragment>
      <form
        className="theme-form m-t-5"
        onSubmit={formik.handleSubmit}
        // onSubmit={e => {
        //     e.preventDefault();
        //     console.log(formik.errors);
        //   }}
      >
        <div className="col-sm-12">
          <div className="card m-t-2">
            {/* <div className="card-header">
              <h5 className="fa fa-edit">Edit Info.</h5>
            </div> */}
            <div className="card-body">
              <div className="form-group row">
                <label
                  className=" col-sm-3 col-form-label"
                  htmlFor="inputEmail3"
                >
                  * Service Type Code:
                </label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    id="inputEmail3"
                    type="text"
                    name="ServiceTypeCode"
                    readOnly={props.formData ? true : false}
                    placeholder="Enter Code"
                    onInput={e => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ServiceTypeCode}
                  />
                  {formik.touched.ServiceTypeCode &&
                  formik.errors.ServiceTypeCode ? (
                    <span className="validationError">
                      {formik.errors.ServiceTypeCode}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                  * Service Type Title:
                </label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    id="inputPassword3"
                    type="text"
                    name="ServiceTypeTitle"
                    placeholder="Enter Title"
                    name="ServiceTypeTitle"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ServiceTypeTitle}
                  />
                  {formik.touched.ServiceTypeTitle &&
                  formik.errors.ServiceTypeTitle ? (
                    <span className="validationError">
                      {formik.errors.ServiceTypeTitle}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                 * Service Type Desc:
                </label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter Description"
                    name="ServiceTypeDesc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ServiceTypeDesc}
                  ></textarea>
                </div>
              </div>
              <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                  Image URL:
                </label>
                <div className="input-group col-sm-9">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="icofont icofont-download"></i>
                    </span>
                  </div>
                  <input
                    className="form-control input-group-air"
                    type="text"
                    placeholder="Enter URL"
                    name="ImageURL"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ImageURL}
                  />
                  {formik.touched.ImageURL && formik.errors.ImageURL ? (
                    <span className="validationError">
                      {formik.errors.ImageURL}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Orderby:</label>
                <div className="col-sm-9">
                  <input
                    className="form-control digits"
                    type="number"
                    placeholder="Number"
                    name="Orderby"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.Orderby}
                  />
                  {formik.touched.Orderby && formik.errors.Orderby ? (
                    <span className="validationError">
                      {formik.errors.Orderby}
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
                      <label className="d-block" htmlFor="radio-active">
                        <input
                          className="radio_animated"
                          id="radio-active"
                          type="radio"
                          name="Status"
                          checked={formik.values.Status === "true"}
                          onClick={() => setStatus("true")}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value="true"
                        />
                        Active
                      </label>
                    </div>
                    <div className="col-md-4">
                      <label className="d-block" htmlFor="radio-inactive">
                        <input
                          className="radio_animated"
                          id="radio-inactive"
                          type="radio"
                          name="Status"
                          checked={formik.values.Status === "false"}
                          onClick={() => setStatus("false")}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value="false"
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
                // onClick={props.onResetPress}
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

export default ServiceTypeMasterCard;
