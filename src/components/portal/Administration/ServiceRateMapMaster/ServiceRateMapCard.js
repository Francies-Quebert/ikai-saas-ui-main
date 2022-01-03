import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtserviceratemapping } from "../../../../store/actions/serviceratemap";
import ServiceRateMap from "../../../../models/serviceratemap";
import SweetAlert from 'react-bootstrap-sweetalert';
import { Lock } from "react-feather";



const ServiceRateMapCard = props => {
  const currentTran = useSelector(state => state.currentTran);
  const Locations = useSelector(state => state.AppMain.locations);
  const Packages = useSelector(state => state.AppMain.packageMasters);
  const Service = useSelector(state => state.serviceMaster.serviceMasters);
 


  useEffect(() => {
    if (currentTran.isSuccess) {
      formik.resetForm(formInitialValues);
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);

  // console.log(props.formData)
  const formInitialValues = {
    ServiceId: props.formData ? props.formData.ServiceId : 0,
    LocationId: props.formData ? props.formData.LocationId : 0,
    PackageId: props.formData ? props.formData.PackageId : 0,
    Rate: props.formData ? props.formData.Rate : 0,
    discType: props.formData ? props.formData.discType : "",
    discValue: props.formData ? props.formData.discValue : "",
  };

  const [showSuccess, setShowSuccess] = useState();
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      LocationId: Yup.string().required("Required"),
      ServiceId: Yup.string().required("Required"),
      PackageId: Yup.string().required("Required"),
      Rate: Yup.string().required("Required"),
      discType: Yup.string().required("Required"),

    }),

    onSubmit: (values, { setSubmitting, resetForm }) => {
      // console.log(props.formData)
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));

        const val = new ServiceRateMap(
          values.ServiceId,
          "",
          values.LocationId,
          "",
          values.PackageId,
          "",
          values.Rate,
          values.discType,
          values.discValue,

        );
        dispatch(InsUpdtserviceratemapping(props.formData ? "U" : "I", val))
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
      //   e.preventDefault();
      //   console.log(formik.errors);
      // }}
      >
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
                    Location Name
                          </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      disabled={props.formData ? true : false}
                      id="LocationId"
                      style={{ height: 35 }}
                      name="LocationId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.LocationId}
                    >
                      <option>---SelectLocation---</option>
                      {Locations &&
                        Locations.map(ii => (
                          <option key={ii.LocationId} value={ii.LocationId}>
                            {ii.LocationName}
                          </option>
                        ))}
                    </select>
                    {formik.touched.LocationId &&
                      formik.errors.LocationId ? (
                        <span className="validationError">
                          {formik.errors.LocationId}
                        </span>
                      ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Service Title
                          </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      disabled={props.formData ? true : false}
                      id="ServiceId"
                      style={{ height: 35 }}
                      name="ServiceId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.ServiceId}
                    >
                      <option>--Select--</option>
                      {Service &&
                        Service.map(ii => (
                          <option key={ii.ServiceId} value={ii.ServiceId}>
                            {ii.ServiceTitle}
                          </option>
                        ))}
                    </select>
                    {formik.touched.ServiceId &&
                      formik.errors.ServiceId ? (
                        <span className="validationError">
                          {formik.errors.ServiceId}
                        </span>
                      ) : null}
                  </div>
                </div>


                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Package Title
                          </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      disabled={props.formData ? true : false}
                      id="PackageId"
                      style={{ height: 35 }}
                      name="PackageId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.PackageId}
                    >
                      <option>--Select--</option>
                      {Packages &&
                        Packages.map(ii => (
                          <option key={ii.PackageId} value={ii.PackageId}>
                            {ii.PackageTitle}
                          </option>
                        ))}
                    </select>
                    {formik.touched.PackageId &&
                      formik.errors.PackageId ? (
                        <span className="validationError">
                          {formik.errors.PackageId}
                        </span>
                      ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Rate
                          </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="Rate"
                      type="text"
                      placeholder="Enter Rate"
                      name="Rate"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.Rate}
                    />
                    {formik.touched.Rate &&
                      formik.errors.Rate ? (
                        <span className="validationError">
                          {formik.errors.Rate}
                        </span>
                      ) : null}
                  </div>
                </div>
                
                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                  Discount Value
                          </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="discValue"
                      type="text"
                      placeholder="Enter Rate"
                      name="discValue"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.discValue}
                    />
                    {formik.touched.discValue &&
                      formik.errors.discValue ? (
                        <span className="validationError">
                          {formik.errors.discValue}
                        </span>
                      ) : null}
                  </div>
                </div>
            <div className="col-md-12">
                  <fieldset className="form-group">
                    <div className="row">
                      <label className="col-form-label pd-1 col-sm-3 pl-1 pt-0">
                      Discount Type </label>
                      <div className="col-sm-6">
                        <div className="row">
                          <div className="col-sm-6">
                            <div className="radio radio-primary ml-2">
                              <input
                                id="Percentage"
                                type="radio"
                                name="discType"
                                value="P"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.discType === "P"}
                              />
                              <label htmlFor="Percentage">Percentage</label>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="radio radio-primary ml-2">
                              <input
                                id="Value"
                                type="radio"
                                name="discType"
                                value="V"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.discType === "V"}
                              />
                              <label htmlFor="Value">Value</label>
                            </div>
                          </div>
                        </div>

                        {formik.touched.discType && formik.errors.discType ? (
                          <span className="validationError">
                            {formik.errors.discType}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </fieldset>
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
                // dispatch(reInitialize());
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

export default ServiceRateMapCard;
