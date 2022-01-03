import React, { Fragment, useState, useEffect } from "react";
import { useFormik, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CKEditors from "react-ckeditor-component";
import SweetAlert from "react-bootstrap-sweetalert";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { InsUpdtPackageMaster } from "../../../../store/actions/PackageMaster";
import PackageMaster from "../../../../models/package-master";
import renderHTML from "react-render-html";

const PackageMasterCard = props => {
  const [Status, setStatus] = useState("false");
  const currentTran = useSelector(state => state.currentTran);
  const [ChkEditContent, setChkEditContent] = useState(
    props.formData ? props.formData.PackageDesc : ""
  );

  useEffect(() => {
    if (currentTran.isSuccess) {
      formik.resetForm(formInitialValues);
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);

  useEffect(() => {
    formik.values.PackageDesc = ChkEditContent;
  }, [ChkEditContent]);

  const toggle8 = () => {
    setModal8(!modal8);
  };

  const handleblur = evt => {
    var newContent = evt.editor.getData();
    setChkEditContent(newContent);
    setModal8(!modal8);
  };

  // console.log(props.formData, "promo");

  const formInitialValues = {
    PackageId: props.formData ? props.formData.PackageId : 0,
    PackageTitle: props.formData ? props.formData.PackageTitle : "",
    PackageDesc: props.formData ? props.formData.PackageDesc : "",
    PackageUnit: props.formData ? props.formData.PackageUnit : "",
    PackageUnitDesc: props.formData ? props.formData.PackageUnitDesc : "",
    PackageDiscType: props.formData ? props.formData.PackageDiscType : "",
    PackageDiscValue: props.formData ? props.formData.PackageDiscValue : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
    VisitType: props.formData ? props.formData.VisitType : "",
    PackageDiscHtml: props.formData ? props.formData.PackageDiscHtml : "",
  };

  const onChange = evt => {
    var newContent = evt.editor.getData();
  };

  const [showSuccess, setShowSuccess] = useState();
  const dispatch = useDispatch();
  const [modal8, setModal8] = useState();
  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      PackageDiscHtml: Yup.string()
        .trim()
        .required("Enter Proper time"),
      PackageTitle: Yup.string().required("Required"),
      Status: Yup.string().required("Required"),
      VisitType: Yup.string().required("Required")
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        const val = new PackageMaster(
          values.PackageId,
          values.PackageTitle,
          values.PackageDesc,
          values.PackageUnit,   
          values.PackageUnitDesc,   
          null,
          null,
          values.Status === "true" ? true : false,
          values.VisitType,
          values.PackageDiscHtml,
        );
        dispatch(InsUpdtPackageMaster(props.formData ? "U" : "I", val));
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
                    * Package Title:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="PackageTitle"
                      type="text"
                      placeholder="Enter Title"
                      name="PackageTitle"
                      onInput={e => {
                        e.target.value = ("" + e.target.value).toUpperCase();
                      }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.PackageTitle}
                    />
                    {formik.touched.PackageTitle &&
                    formik.errors.PackageTitle ? (
                      <span className="validationError">
                        {formik.errors.PackageTitle}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                 * Package Description:
                </label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter Package Description"
                    name="PackageDiscHtml"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.PackageDiscHtml}
                  ></textarea>
                    
                    {formik.touched.PackageDiscHtml &&
                    formik.errors.PackageDiscHtml ? (
                      <span className="validationError">
                        {formik.errors.PackageDiscHtml}
                      </span>
                    ) : null}
                </div>
              </div>


                <div className="form-group row">
                  <label className="col-md-3 col-form-label">
                  * Package Description Html:
                  </label>
                  <div className="col-md-9">
                    {/* <div
                      className="form-control overflowStyle"
                      style={{
                        borderColor: "#eff0f1",
                        color: "#898989",
                        height: 135,
                        overflowY: "auto"
                      }}
                      //  onClick={toggle8}
                    > */}
                    {/* {renderHTML(ChkEditContent)} */}
                    <CKEditors
                      activeclassName="p10"
                      id="PackageDesc"
                      name="PackageDesc"
                      // data={formik.values.PackageDesc}
                      content={formik.values.PackageDesc}
                      events={{
                        // blur: evt => {
                        //   console.log('blur',evt);
                        // },
                        // afterPaste: evt => {
                        //   console.log('afterpaste',evt);
                        // },
                        change: evt => {
                          // console.log('change',evt.editor.getData());
                          formik.values.PackageDesc = evt.editor.getData();
                        }
                      }}
                      // onChange={formik.handleChange}
                      // onBlur={formik.handleBlur}
                      // onChange={(e) => {
                      //   console.log('onblue',e)
                      // }}
                    />
                  </div>
                  {formik.touched.PackageDesc && formik.errors.PackageDesc ? (
                    <span className="validationError">
                      {formik.errors.PackageDesc}
                    </span>
                  ) : null}
                  {/* <Modal
                      centered={true}
                      isOpen={modal8}
                       toggle={toggle8}
                      size="lg"
                      backdrop="static"
                    >
                      <ModalHeader toggle={toggle8}>Package Description</ModalHeader>
                      <ModalBody>
                        <CKEditors
                          activeclassName="p10"
                          id="PackageDesc"
                          name="PackageDesc"
                          value={formik.values.PackageDesc}
                          content={formik.values.PackageDesc}
                          events={{
                            blur: handleblur,
                            change: onChange
                          }}
                          
                        />
                      </ModalBody>
                      <ModalFooter style={{ justifyContent: "end" }}>
                        <button className="btn btn-primary mr-1" type="submit">
                          Submit
                        </button>
                        <button className="btn btn-light" onClick={toggle8}>
                          Cancel
                        </button>
                      </ModalFooter>
                    </Modal>  */}
                  {/* </div> */}
                </div>

                <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    * Package Unit:
                  </label>
                  <div className="col-sm-3">
                    <input
                      className="form-control"
                      id="PackageUnit"
                      type="text"
                      placeholder="Enter Unit"
                      name="PackageUnit"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.PackageUnit}
                    />
                    {formik.touched.PackageUnit &&
                    formik.errors.PackageUnit ? (
                      <span className="validationError">
                        {formik.errors.PackageUnit}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group row">
                <label
                  className="col-sm-3 col-form-label"
                  htmlFor="inputPassword3"
                >
                 * Package Unit Description:
                </label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter Description"
                    name="PackageUnitDesc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.PackageUnitDesc}
                  ></textarea>
                </div>
              </div>
              <div className="form-group row">
                  <label
                    className="col-sm-3 col-form-label"
                    htmlFor="inputPassword3"
                  >
                    * Visit Type:
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      id="VisitType"
                      type="text"
                      placeholder="Enter Title"
                      name="VisitType"
                      onInput={e => {
                        e.target.value = ("" + e.target.value).toUpperCase();
                      }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.VisitType}
                    />
                    {formik.touched.VisitType &&
                    formik.errors.VisitType ? (
                      <span className="validationError">
                        {formik.errors.VisitType}
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

export default PackageMasterCard;
