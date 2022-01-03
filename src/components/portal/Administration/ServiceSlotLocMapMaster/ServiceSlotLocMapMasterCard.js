import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { InsUpdtserviceSlotLocMapMaster } from "../../../../store/actions/ServiceSlotLocMap";
import ServiceSlotLocMapp from "../../../../models/ServiceSlotLocMap";

const ServiceSlotLocMapMaterCard = props => {
  const [Status, setStatus] = useState("false");
  const currentTran = useSelector(state => state.currentTran);
  const Locations = useSelector(state => state.AppMain.locations);
  const Slots = useSelector(state => state.AppMain.slots);
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

  const formInitialValues = {
    ServiceTitle: props.formData
      ? Service.find(ii => ii.ServiceTitle === props.formData.ServiceTitle).ServiceId
      : "",
    SlotName: props.formData
      ? Slots.find(ii => ii.SlotName === props.formData.SlotName).Id
      : "",
    LocationName: props.formData
      ? Locations.find(ii => ii.LocationName === props.formData.LocationName).LocationId
      : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true"
  };
  const [showSuccess, setShowSuccess] = useState();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      LocationName: Yup.string().required("Required"),
      ServiceTitle: Yup.string().required("Required"),
      SlotName: Yup.string().required("Required"),
      Status: Yup.string().required("Required")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));
        const val = new ServiceSlotLocMapp(
          values.ServiceTitle,
          values.SlotName,
          values.LocationName,
          values.Status === "true" ? true : false
        );
        dispatch(
          InsUpdtserviceSlotLocMapMaster(props.formData ? "U" : "I", val)
        );
        setSubmitting(false);
      }, 400);
    }
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
          <div className="card">
            {/* <div className="card-header">
              <h5 className="fa fa-edit">Edit Info.</h5>
            </div> */}
            <div className="card-body">
              <form className="theme-form">
                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    Location Name:
                  </label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      id="LocationName"
                      style={{ height: 35 }}
                      name="LocationName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.LocationName}
                    >
                      <option>---SelectLocation---</option>
                      {Locations &&
                        Locations.map(ii => (
                          <option key={ii.LocationId} value={ii.LocationId}>
                            {ii.LocationName}
                          </option>
                        ))}
                    </select>

                    {formik.touched.LocationName &&
                    formik.errors.LocationName ? (
                      <span className="validationError">
                        {formik.errors.LocationName}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                    Service Name:
                  </label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      id="ServiceTitle"
                      style={{ height: 35 }}
                      name="ServiceTitle"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.ServiceTitle}
                    >
                      <option>--Select--</option>
                      {Service &&
                        Service.map(ii => (
                          <option key={ii.ServiceId} value={ii.ServiceId}>
                            {ii.ServiceTitle}
                          </option>
                        ))}
                    </select>

                    {formik.touched.ServiceTitle &&
                    formik.errors.ServiceTitle ? (
                      <span className="validationError">
                        {formik.errors.ServiceTitle}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="form-group row">
                  <label className="col-md-3 col-form-label">SlotName:</label>
                  <div className="col-md-9">
                    <select
                      className="form-control"
                      id="SlotName"
                      style={{ height: 35 }}
                      name="SlotName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SlotName}
                    >
                      <option>---SelectSlot---</option>
                      {Slots &&
                        Slots.map(ii => (
                          <option key={ii.Id} value={ii.Id}>
                            {ii.SlotName}
                          </option>
                        ))}
                    </select>

                    {formik.touched.SlotName && formik.errors.SlotName ? (
                      <span className="validationError">
                        {formik.errors.SlotName}
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

export default ServiceSlotLocMapMaterCard;
