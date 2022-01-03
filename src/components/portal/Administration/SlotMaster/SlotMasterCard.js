import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from 'react-bootstrap-sweetalert';
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import {InsUpdtSlotMaster} from "../../../../store/actions/slotmaster";
import SlotMaster from "../../../../models/slotmaster";
// import TimePickerOne from './timepicker-one';

const SlotMasterCard = props => {
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
    Id: props.formData ? props.formData.Id : 0,
    SlotName: props.formData ? props.formData.SlotName : "",
    Status: props.formData ? props.formData.IsActive.toString():"true",
    starttime: props.formData ? props.formData.starttime:""
  };

  const [showSuccess, setShowSuccess] = useState();
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: formInitialValues,
      // SlotName: "",
      // Starttime: "",
      // Status: "",
      // rememberme: false
    
    validationSchema: Yup.object({
      starttime: Yup.string().trim().required('Enter Proper time'),
      SlotName: Yup.string().required("Required"),
      Status: Yup.string().required("Required"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));

        const val = new SlotMaster(
            values.Id,
             values.SlotName,	
            values.Status === "true" ? true : false,
            values.starttime
          );
        dispatch(InsUpdtSlotMaster(props.formData ? "U" : "I", val))
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
      //     console.log(formik.errors);
      //   }}
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
                   * Slot Name:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="SlotName"
                      type="text"
                      placeholder="Enter Slot Name"
                      name="SlotName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.SlotName}
                    />
                    
                    {formik.touched.SlotName &&
                      formik.errors.SlotName ? (
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
                   * Start Time:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="starttime"
                      type="text"
                      placeholder="Enter Time"
                      name="starttime"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.starttime}
                    />
                    {formik.touched.starttime &&
                      formik.errors.starttime ? (
                        <span className="validationError">
                          {formik.errors.starttime}
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

export default SlotMasterCard;
