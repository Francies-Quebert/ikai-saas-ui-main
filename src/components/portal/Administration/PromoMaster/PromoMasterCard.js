import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { InsUpdtPromoMaster } from "../../../../store/actions/promomaster";
import { reInitialize } from "../../../../store/actions/currentTran";
import PromoMaster from "../../../../models/promomaster";

const PromoMasterCard = props => {
  const [Status, setStatus] = useState("false");
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
// console.log(props.formData,"promo")
  const formInitialValues = {
    Id: props.formData ? props.formData.Id : 0,
    PromoTitle: props.formData ? props.formData.PromoTitle : "",
    PromoImageUri: props.formData ? props.formData.PromoImageUri : "",
    SysOption1: props.formData ? props.formData.SysOption1 : "",
    SysOption2: props.formData ? props.formData.SysOption2 : "",
    SysOption3: props.formData ? props.formData.SysOption3 : "",
    SysOption4: props.formData ? props.formData.SysOption4 : "",
    SysOption5: props.formData ? props.formData.SysOption5 : "",
    IsActive: props.formData ? props.formData.IsActive.toString():"true"
   };
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      PromoTitle: Yup.string()
        .trim()
        .required("Enter Proper title"),
      PromoImageUri: Yup.string().required("Required"),
      IsActive: Yup.string().required("Required"),
      // SysOption1: Yup.string().required("Required"),
      // SysOption2: Yup.string().required("Required"),
      // SysOption3: Yup.string().required("Required"),
      // SysOption4: Yup.string().required("Required"),
      // SysOption5: Yup.string().required("Required"),

    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));
        const val = new PromoMaster(
          values.Id,
          values.PromoTitle,
          values.PromoImageUri,
          values.SysOption1,
          values.SysOption2,
          values.SysOption3,
          values.SysOption4,
          values.SysOption5,
          values.IsActive === "true" ? true : false );
        dispatch(InsUpdtPromoMaster(props.formData ? "U" : "I", val));
        setSubmitting(false);
      }, 400);
    }
  });

  return (
    <Fragment>
      <form
        onSubmit={formik.handleSubmit}
        // onSubmit={formik.handleSubmit}
        // onSubmit={e => {
        //     e.preventDefault();
        //     console.log(formik.errors);
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
                    * Promo Title:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="PromoTitle"
                      type="text"
                      placeholder="Enter Title"
                      name="PromoTitle"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.PromoTitle}
                    />
                    {formik.touched.PromoTitle && formik.errors.PromoTitle ? (
                      <span className="validationError">
                        {formik.errors.PromoTitle}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                   * Promo Image URL:
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
                      name="PromoImageUri"
                      id="PromoImageUri"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.PromoImageUri}
                    />
                    {formik.touched.PromoImageUri &&
                    formik.errors.PromoImageUri ? (
                      <span className="validationError">
                        {formik.errors.PromoImageUri}
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
                    {formik.touched.SysOption1 &&
                    formik.errors.SysOption1 ? (
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
                    {formik.touched.SysOption2 &&
                    formik.errors.SysOption2 ? (
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
                    {formik.touched.SysOption3 &&
                    formik.errors.SysOption3 ? (
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
                    {formik.touched.SysOption4 &&
                    formik.errors.SysOption4 ? (
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
                    {formik.touched.SysOption5 &&
                    formik.errors.SysOption5 ? (
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
                        <label className="d-block" for="radio-inactive">
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
              <button type="button" 
              onClick={() => {
                dispatch(reInitialize());
                props.onBackPress();
              }}
              className="btn btn-secondary ml-1">
                Back
              </button>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default PromoMasterCard;
