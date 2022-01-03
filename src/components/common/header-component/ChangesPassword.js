import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalBody } from "reactstrap";
import Cryptr from "cryptr";
import { useSelector, useDispatch } from "react-redux";
import { InsUpdateChangePassword } from "../../../store/actions/orders";
const ChangesPassword = (props) => {
  const dispatch = useDispatch();
  const cryptr = new Cryptr(process.env.REACT_APP_CRYPTOKEY);
  const formik = useFormik({
    initialValues: {
      curPassword: "",
      newPassword: "",
      reEnterPassword: "",
    },
    validationSchema: Yup.object({
      curPassword: Yup.string().required("Required"),
      newPassword: Yup.string()
        .required("Required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      reEnterPassword: Yup.string()
        .required("Required")
        .when("newPassword", {
          is: (val) => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf(
            [Yup.ref("newPassword")],
            "Both password need to be the same"
          ),
        }),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        dispatch(
          InsUpdateChangePassword(
            cryptr.encrypt(values.curPassword),
            cryptr.encrypt(values.newPassword)
          )
        );
        // alert(JSON.stringify(values, null));
        setSubmitting(false);
        props.onBackPress();
      }, 400);
    },
  });

  return (
    <form
      className="theme-form"
      onSubmit={formik.handleSubmit}
      // onSubmit={e => {
      //     e.preventDefault();

      //   }}
    >
      <ModalBody>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label" htmlFor="inputEmail3">
            Current password
          </label>
          <div className="col-sm-9">
            <input
              className="form-control"
              id="curPassword"
              type="password"
              placeholder="current password"
              name="curPassword"
              autocomplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.curPassword}
            />
            {formik.touched.curPassword && formik.errors.curPassword ? (
              <span className="validationError">
                {formik.errors.curPassword}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label" htmlFor="inputPassword3">
            New password
          </label>
          <div className="col-sm-9">
            <input
              className="form-control"
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="new password"
              autocomplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <span className="validationError">
                {formik.errors.newPassword}
              </span>
            ) : null}
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label" htmlFor="reEnterPassword">
            R-enter password
          </label>
          <div className="col-sm-9">
            <input
              name="reEnterPassword"
              className="form-control"
              id="reEnterPassword"
              type="password"
              placeholder="re-enter password"
              autocomplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reEnterPassword}
            />
            {(formik.touched.reEnterPassword &&
              formik.errors.reEnterPassword) ||
            formik.errors.reEnterPassword ? (
              <span className="validationError">
                {formik.errors.reEnterPassword}
              </span>
            ) : null}
          </div>
        </div>
      </ModalBody>
      <div class="modal-footer">
        <button
          disabled={formik.isSubmitting}
          type="submit"
          name="submit"
          className="btn btn-secondary mr-1"
        >
          {formik.isSubmitting === true && (
            <i
              className="fa fa-refresh fa-spin"
              style={{ marginRight: "5px" }}
            />
          )}
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            props.onBackPress();
          }}
          className="btn btn-secondary ml-1"
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default ChangesPassword;
