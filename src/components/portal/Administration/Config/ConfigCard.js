import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { reInitialize } from "../../../../store/actions/currentTran";
import Config from "../../../../models/config";
import SweetAlert from "react-bootstrap-sweetalert";
import { UpdtConfig } from "../../../../store/actions/config";

const ConfigCard = (props) => {
  const [Status, setStatus] = useState("false");
  const currentTran = useSelector((state) => state.currentTran);

  const [showSuccess, setShowSuccess] = useState();
  const dispatch = useDispatch();

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
    id: props.formData ? props.formData.id : 0,
    ConfigCode: props.formData ? props.formData.ConfigCode : "",
    ConfigAccessLevel: props.formData ? props.formData.ConfigAccessLevel : "",
    ConfigType: props.formData ? props.formData.ConfigType : "",
    ConfigName: props.formData ? props.formData.ConfigName : "",
    Value1: props.formData ? props.formData.Value1 : "",
    Value2: props.formData ? props.formData.Value2 : "",
    ConfigDesc: props.formData ? props.formData.ConfigDesc : "",
    SysOption1: props.formData ? props.formData.SysOption1 : "",
    SysOption2: props.formData ? props.formData.SysOption2 : "",
  };

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      ConfigName: Yup.string().required("Required"),
      ConfigDesc: Yup.string().required("Required"),
      Value1: Yup.string().required("Required"),
      Value2: Yup.string().required("Required"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));
        const val = new Config(
          0,
          values.ConfigCode,
          "U",
          "string",
          null,
          values.Value1,
          values.Value2,
          null,
          null,
          null
        );

        dispatch(UpdtConfig(val));
        setSubmitting(false);
      }, 400);
    },
  });
  return (
    <Fragment>
      <form
        onSubmit={formik.handleSubmit}
        // onSubmit={e => {
        //   e.preventDefault();
        //   console.log(formik.errors);
        // }}
      >
        <div className="col-sm-9">
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
              <form className="theme-form">
                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Config Name
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      readOnly="true"
                      id="ConfigName"
                      type="text"
                      placeholder="Enter ConfigName"
                      name="ConfigName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.ConfigName}
                    />
                    {formik.touched.ConfigName && formik.errors.ConfigName ? (
                      <span className="validationError">
                        {formik.errors.ConfigName}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Config Desc
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      readOnly="true"
                      id="ConfigDesc"
                      type="text"
                      placeholder="Enter ConfigDesc"
                      name="ConfigDesc"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.ConfigDesc}
                    />
                    {formik.touched.ConfigDesc && formik.errors.ConfigDesc ? (
                      <span className="validationError">
                        {formik.errors.ConfigDesc}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Value 1
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="Value1"
                      type="text"
                      placeholder="Enter Value1"
                      name="Value1"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Value1}
                    />
                    {formik.touched.Value1 && formik.errors.Value1 ? (
                      <span className="validationError">
                        {formik.errors.Value1}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Value 2
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="Value2"
                      type="text"
                      placeholder="Enter Value2"
                      name="Value2"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Value2}
                    />
                    {formik.touched.Value2 && formik.errors.Value2 ? (
                      <span className="validationError">
                        {formik.errors.Value2}
                      </span>
                    ) : null}
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
                onClick={formik.handleReset}
                type="reset"
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // dispatch(reInitialize());
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

export default ConfigCard;
