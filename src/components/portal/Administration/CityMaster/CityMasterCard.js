import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { InsUpdtCityMaster } from "../../../../store/actions/CityMaster";
import CityMaster from "../../../../models/CityMater";

const CityMasterCard = props => {
  const [Status, setStatus] = useState("false");
  const [Check, setCheck] = useState("false");
  const currentTran = useSelector(state => state.currentTran);
  const Country = useSelector(state => state.countryMaster.countryMasters);
  const State = useSelector(state => state.stateMaster.stateMasters);
  const City = useSelector(state => state.cityMaster.cityMasters);


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
    CityCode: props.formData ? props.formData.CityCode : "",
    CityName: props.formData ? props.formData.CityName : "",
    CountryCode: props.formData ? props.formData.CountryCode : "",
    StateCode: props.formData ? props.formData.StateCode : "",
    lat: props.formData ? props.formData.lat : "",
    lng: props.formData ? props.formData.lng : "",
    IsDefault: props.formData ? props.formData.IsDefault.toString() : "true",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const [showSuccess, setShowSuccess] = useState();
  const dispatch = useDispatch();
  const formik = useFormik({
    
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      CityCode: Yup.string().required("Required"),
      CityName: Yup.string().required("Required"),
      CountryCode: Yup.string().required("Required"),
      StateCode: Yup.string().required("Required"),
      Status: Yup.string().required("Required")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));

        const val = new CityMaster(
          values.CityCode,
          values.CityName,
          values.CountryCode,
          values.StateCode,
          values.lat,
          values.lng,
          values.IsDefault === "true" ? true : false,
          values.Status === "true" ? true : false,
        );
        dispatch(InsUpdtCityMaster(props.formData ? "U" : "I", val));
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

      //   }}
      >
        <div className="col-sm-12">
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
                    * Country Name:
                  </label>
                  <div className="col-sm-3">
                    <select
                      className="form-control"
                      disabled={props.formData ? true : false}
                      id="CountryCode"
                      style={{ height: 35 }}
                      name="CountryCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.CountryCode}
                    >
                      <option>---Select Country---</option>
                      {Country &&
                        Country.map(ii => (
                          <option key={ii.CountryCode} value={ii.CountryCode}>
                            {ii.CountryName}
                          </option>
                        ))}
                    </select>
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
                   * State Name:
                  </label>
                  <div className="col-sm-3">
                    <select
                      className="form-control"
                      disabled={props.formData ? true : false}
                      id="StateCode"
                      style={{ height: 35 }}
                      name="StateCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.StateCode}
                    >
                      <option>---Select State---</option>
                      {State  &&
                        State
                        .filter(i=>i.CountryCode===formik.values.CountryCode)
                        .map(ii => (
                          <option key={ii.StateCode} value={ii.StateCode}>
                            {ii.StateName}
                          </option>
                        ))}
                    </select>
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
                   * City Code:
                  </label>
                  <div className="col-sm-2">
                    <input
                      className="form-control"
                      id="CityCode"
                      type="text"
                      placeholder="City Code"
                      name="CityCode"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.CityCode}
                    // disabled={props.formData ? true : false}
                    />
                    {formik.touched.CityCode && formik.errors.CityCode ? (
                      <span className="validationError">
                        {formik.errors.CityCode}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                   * City Name:
                  </label>
                  <div className="col-sm-3">
                  <input
                      className="form-control"
                      id="CityName"
                      type="text"
                      placeholder="Enter City Name"
                      name="CityName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.CityName}
                    disabled={props.formData ? true : false}
                    />
                    {formik.touched.CityName && formik.errors.CityName ? (
                      <span className="validationError">
                        {formik.errors.CityName}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Lattitude:
                  </label>
                  <div className="col-sm-3">
                    <input
                      className="form-control"
                      id="lat"
                      type="text"
                      placeholder="Enter Lattitude"
                      name="lat"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lat}
                    // disabled={props.formData ? true : false}
                    />
                    {formik.touched.lat && formik.errors.lat ? (
                      <span className="validationError">
                        {formik.errors.lat}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Longitude:
                  </label>
                  <div className="col-sm-3">
                    <input
                      className="form-control"
                      id="lng"
                      type="text"
                      placeholder="Enter Longitude"
                      name="lng"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lng}
                    />
                    {formik.touched.lng && formik.errors.lng ? (
                      <span className="validationError">
                        {formik.errors.lng}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row mb-0">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    Default City:
                  </label>
                  <div className="col-md-3">
                    <div className="form-group m-checkbox-inline">
                      <div className="checkbox checkbox-dark ml-2">
                        <input id="inline-1" type="checkbox"
                          name="IsDefault"
                          checked={formik.values.IsDefault }
                          // onClick={() => setStatus("true")}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <label for="inline-1">
                          Is Default<span className="IsDefault"
                          ></span>
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

export default CityMasterCard;
