import React, { Fragment, useState } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";

const PromoMasterCard = () => {
    const [showSuccess, setShowSuccess] = useState();


    const formik = useFormik({
        initialValues: {
          Promotitle: "",
          Promoimageurl: "",
          SysOption1:"",
          SysOption2:"",
          SysOption3:"",
          SysOption4:"",
          SysOption5:"",
          IsActive: "",
          // rememberme: false
        },
        validationSchema: Yup.object({
            Promotitle: Yup.string().trim().required('Enter Proper title'),
            Promoimageurl: Yup.string().required("Required"),
            IsActive: Yup.string().required("Required"),
        }),
        onSubmit: (values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
            resetForm();
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
                    Promo Title:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="Promotitle"
                      type="text"
                      placeholder="Enter Title"
                      name="Promotitle"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Promotitle}
                    />
                    {formik.touched.Promotitle &&
                      formik.errors.Promotitle ? (
                        <span className="validationError">
                          {formik.errors.Promotitle}
                        </span>
                      ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Promo Image URL:
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
                      name="Promoimageurl"
                      id="Promoimageurl"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Promoimageurl}
                    />
                    {formik.touched.Promoimageurl &&
                      formik.errors.Promoimageurl ? (
                        <span className="validationError">
                          {formik.errors.Promoimageurl}
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

                   />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption2
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="SysOption2"
                      type="text"
                      placeholder="Enter Title"
                      name="SysOption2"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption3
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="SysOption3"
                      type="text"
                      placeholder="Enter Title"
                      name="SysOption3"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption4
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id=" SysOption4"
                      type="text"
                      placeholder="Enter Title"
                      name=" SysOption4"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    SysOption5
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id=" SysOption5"
                      type="text"
                      placeholder="Enter Title"
                      name=" SysOption5"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Status
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
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            checked={formik.values.IsActive === "true"}
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
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            checked={formik.values.IsActive === "false"}
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
              <button type="reset"onClick={formik.handleReset} className="btn btn-secondary">
                Cancel
              </button>
              <button type="button" className="btn btn-secondary ml-1">
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
