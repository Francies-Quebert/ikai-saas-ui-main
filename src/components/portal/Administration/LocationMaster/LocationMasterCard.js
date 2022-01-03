import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from 'react-bootstrap-sweetalert';
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import {InsUpdtLocationMaster} from "../../../../store/actions/locationmaster";
import LocationMaster from "../../../../models/locationmaster";


const LocationMasterCard = props => {
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

  const formInitialValues = {
    LocationId: props.formData ? props.formData.LocationId : 0,
    LocationName: props.formData ? props.formData.LocationName : "",
    Status: props.formData ? props.formData.IsActive.toString():"true",
  };

  const [showSuccess, setShowSuccess] = useState();
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
        LocationName: Yup.string().required("Required"),
      Status: Yup.string().required("Required")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));
        const val = new LocationMaster(
            values.LocationId,
             values.LocationName,	
            values.Status === "true" ? true : false
          );
          dispatch(InsUpdtLocationMaster(props.formData ? "U" : "I", val))
          setSubmitting(false);
        resetForm();
      }, 400);
    }
  });

  return (
    <Fragment>
      <form
        onSubmit={formik.handleSubmit}>
        <div className="col-sm-9">
        {showSuccess && <SweetAlert
            show={showSuccess}
            type={"success"}
            title={'Data Saved Successfully'}
            onConfirm={() => setShowSuccess(!showSuccess)}
          />}
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
                   * Location Name:
                  </label>
                  <div className="col-sm-9">
                    <input
                    readOnly={props.formData ? true : false}
                      className="form-control"
                      id="inputPassword3"
                      type="text"
                      placeholder="Enter Location Name"
                      name="LocationName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.LocationName}
                    />
                    {formik.touched.LocationName &&
                      formik.errors.LocationName ? (
                        <span className="validationError">
                          {formik.errors.LocationName}
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
                            onClick={() => setStatus("true")}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            checked={formik.values.Status === "true"}

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
                            onClick={() => setStatus("false")}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            checked={formik.values.Status === "false"}
                          />
                          In Active
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
              <button onClick={formik.handleReset} type="reset" className="btn btn-secondary">Cancel</button>
              <button onClick={() => {
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

export default LocationMasterCard;



