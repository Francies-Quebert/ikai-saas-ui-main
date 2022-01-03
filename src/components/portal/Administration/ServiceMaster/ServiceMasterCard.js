import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ServiceMaster from "../../../../models/servicemaster";
import SweetAlert from "react-bootstrap-sweetalert";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { InsUpdtServiceMaster } from "../../../../store/actions/servicemaster";

const ServiceMasterCard = (props) => {
  const ServiceType = useSelector((state) => state.AppMain.serviceTypes);
  const [Status, setStatus] = useState("false");
  const currentTran = useSelector((state) => state.currentTran);

  useEffect(() => {
    if (currentTran.isSuccess) {
      formik.resetForm(formInitialValues);
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);
  // console.log(props.formData);
  const formInitialValues = {
    ServiceId: props.formData ? props.formData.ServiceId : 0,
    ServiceType: props.formData ? props.formData.ServiceType : "",
    ServiceTitle: props.formData ? props.formData.ServiceTitle : "",
    ServiceDesc: props.formData ? props.formData.ServiceDesc : "",
    ServiceImageURI: props.formData ? props.formData.ServiceImageURI : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const [showSuccess, setShowSuccess] = useState();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      // ServiceType: Yup.string().required("Required"),
      ServiceTitle: Yup.string().required("Required"),
      ServiceDesc: Yup.string().required("Required"),
      // ServiceImageURI: Yup.string().required("Required"),
      Status: Yup.string().required("Required"),
    }),

    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));

        const val = new ServiceMaster(
          values.ServiceId,
          values.ServiceType,
          values.ServiceTitle,
          values.ServiceDesc,
          values.ServiceImageURI,
          values.Status === "true" ? true : false
        );
        dispatch(InsUpdtServiceMaster(props.formData ? "U" : "I", val));
        setSubmitting(false);
        // setShowSuccess(!showSuccess)
      }, 400);
    },
  });
  return (
    <Fragment>
      <form
        onSubmit={formik.handleSubmit}
        // onSubmit={e => {
        //     e.preventDefault();
        //     console.log(formik.errors);
        //   }}
      >
        <div className="col-sm-12">
          {showSuccess && (
            <SweetAlert
              show={showSuccess}
              type={"success"}
              title={"Data Saved Successfully"}
              onConfirm={() => setShowSuccess(!showSuccess)}
            />
          )}
          <div className="card">
            {/* <div className="card-header">
              <h5 className="fa fa-edit">Edit Info.</h5>
            </div> */}

            <div className="card-body">
              <div className="form-group row">
                <label
                  className=" col-sm-3 col-form-label"
                  htmlFor="inputEmail3"
                >
                  * Service Type:
                </label>
                <div className="col-sm-9">
                  <select
                    disabled={props.formData ? true : false}
                    className="form-control"
                    id="exampleFormControlSelect17"
                    name="ServiceType"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ServiceType}
                  >
                    <option value="">--Select--</option>
                    {ServiceType &&
                      ServiceType.map((ii) => (
                        <option key={ii.Id} value={ii.serviceTypeCode}>
                          {ii.serviceTypeTitle}
                        </option>
                      ))}
                  </select>

                  {formik.touched.ServiceType && formik.errors.ServiceType ? (
                    <span className="validationError">
                      {formik.errors.ServiceType}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                  * Service Title:
                </label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    id="inputPassword3"
                    type="text"
                    placeholder="Enter Title"
                    name="ServiceTitle"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ServiceTitle}
                  />
                  {formik.touched.ServiceTitle && formik.errors.ServiceTitle ? (
                    <span className="validationError">
                      {formik.errors.ServiceTitle}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                  * Service Desc:
                </label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter Description"
                    name="ServiceDesc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ServiceDesc}
                  ></textarea>
                  {formik.touched.ServiceDesc && formik.errors.ServiceDesc ? (
                    <span className="validationError">
                      {formik.errors.ServiceDesc}
                    </span>
                  ) : null}
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
                    name="ServiceImageURI"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ServiceImageURI}
                  />
                  {formik.touched.ServiceImageURI &&
                  formik.errors.ServiceImageURI ? (
                    <span className="validationError">
                      {formik.errors.ServiceImageURI}
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
                          // checked={formik.values.Status === "InActive"}
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
              {/* </form> */}
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
                onClick={formik.handleReset}
                type="reset"
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

export default ServiceMasterCard;
