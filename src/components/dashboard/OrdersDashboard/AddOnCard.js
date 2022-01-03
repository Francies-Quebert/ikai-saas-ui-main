import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  fetchAddOnCostOrder,
  InsUpdateScheduleAddOnCostOrder
} from "../../../store/actions/orders";
import SweetAlert from 'react-bootstrap-sweetalert';
import { reInitialize } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";

const AddOnCard = props => {
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState();
  const [srNo, setSrNo] = useState(1);
//   const currentTran = useSelector(state => state.currentTran);
// useEffect(() => {
//     dispatch(fetchAddOnCostOrder(props.formData ? props.formData.ScheduleId:null))
// }, [])

//   useEffect(() => {
//     if (currentTran.isSuccess) {
//       formik.resetForm(formInitialValues);
//       dispatch(reInitialize());
//       props.onBackPress();
//     } else if (currentTran.error) {
//       toast.error(currentTran.error);
//     }
//   }, [currentTran.error, currentTran.isSuccess]);



  const formInitialValues = {
    Description: props.formData ? props.formData.desc:"",
    Amount: props.formData ? props.formData.amount:""
  };

  
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      Description: Yup.string().required("Required"),
      Amount: Yup.number("Enter Only Character").required("Required")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));
        dispatch(
          InsUpdateScheduleAddOnCostOrder(
            props.formData ? props.formData.ScheduleId:props.scheduleId,
            props.formData ? props.formData.OrderId:props.orderId,
            props.formData ? props.formData.srNo:props.srNo,
            values.Description,
            values.Amount
          )
        );
        
        props.onBackPress();
      }, 400);
    }
  });

  return (
    <Fragment>
      <form
        onSubmit={formik.handleSubmit}

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
          <div className="card" style={{marginBottom:5}}>
            {/* <div className="card-header p-t-10 p-b-10">
              <h5>Additional Cost.</h5>
            </div> */}
            <div className="card-body">
              <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                  Description:
                </label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    id="Description"
                    type="text"
                    placeholder="Enter Description"
                    name="Description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.Description}
                  />

                  {formik.touched.Description && formik.errors.Description ? (
                    <span className="validationError">
                      {formik.errors.Description}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                  Amount:
                </label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    id="Amount"
                    type="text"
                    placeholder="Enter Amount"
                    name="Amount"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.Amount}
                  />

                  {formik.touched.Amount && formik.errors.Amount ? (
                    <span className="validationError">
                      {formik.errors.Amount}
                    </span>
                  ) : null}
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
                onClick={formik.handleReset}
                type="reset"
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                //   dispatch(reInitialize());
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

export default AddOnCard;
