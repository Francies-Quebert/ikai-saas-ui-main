import React, { Fragment, useState } from "react";
import { useFormik, Formik, Field } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { crudUserPatientAddress } from "../../../store/actions/appMain";
import {
  Form,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Spin,
  Divider,
} from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CardHeader from "../../common/CardHeader";

const AddAddressCard = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const formInitialValues = {
    bName: "",
    landmark: "",
    pincode: "",
    city: "",
  };

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema: Yup.object({
      bName: Yup.string().required("Required"),
      landmark: Yup.string().required("Required"),
      pincode: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        // alert(JSON.stringify(values, null, 2));

        // const val = new SlotMaster(
        //     values.Id,
        //      values.SlotName,
        //     values.Status === "true" ? true : false,
        //     values.starttime
        //   );
        dispatch(
          crudUserPatientAddress(
            "I",
            null,
            null,
            null,
            null,
            values.bName,
            values.landmark,
            values.pincode,
            values.city
          )
        );
        setSubmitting(false);
        // setShowSuccess(!showSuccess)
      }, 400);
    },
  });
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const onFinish = (values) => {
    setIsLoading(true);
    dispatch(
      crudUserPatientAddress(
        "I",
        null,
        null,
        null,
        null,
        values.bName,
        values.landmark,
        values.pincode,
        values.city
      )
    );
    setIsLoading(false);
  };

  return (
    <Fragment>
      {/* <form
        className="theme-form"
        style={props.styleComponentCenter}
        onSubmit={formik.handleSubmit}
        // onSubmit={e => {
        //     e.preventDefault();;
        //   }}
      >
        <div className="col-md-12 p-0">
          <div className="card">
            <div className="card-header p-b-15">
              <h5 className="fa fa-edit"> Add New Address</h5>
            </div>
            <div className="card-body p-t-10 p-b-10">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group row">
                    <label
                      className="col-sm-5 col-form-label"
                      htmlFor="inputPassword3"
                    >
                      Building Name / Flat Number:
                    </label>
                    <div className="col-sm-7">
                      <input
                        className="form-control"
                        autoComplete="off"
                        id="bName"
                        type="text"
                        name="bName"
                        placeholder="Building Name / Flat Number"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.bName}
                      />
                      {formik.touched.bName && formik.errors.bName ? (
                        <span className="validationError">
                          {formik.errors.bName}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group row">
                    <label
                      className="col-sm-5 col-form-label"
                      htmlFor="inputPassword3"
                    >
                      Landmark:
                    </label>
                    <div className="col-sm-7">
                      <input
                        className="form-control"
                        autoComplete="off"
                        id="landmark"
                        type="text"
                        name="landmark"
                        placeholder="landmark"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.landmark}
                      />
                      {formik.touched.landmark && formik.errors.landmark ? (
                        <span className="validationError">
                          {formik.errors.landmark}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group row">
                    <label
                      className="col-sm-5 col-form-label"
                      htmlFor="inputPassword3"
                    >
                      Pincode:
                    </label>
                    <div className="col-sm-7">
                      <input
                        className="form-control"
                        autoComplete="off"
                        id="pincode"
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.pincode}
                      />
                      {formik.touched.pincode && formik.errors.pincode ? (
                        <span className="validationError">
                          {formik.errors.pincode}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group row">
                    <label
                      className="col-sm-5 col-form-label"
                      htmlFor="inputPassword3"
                    >
                      City:
                    </label>
                    <div className="col-sm-7">
                      <input
                        className="form-control"
                        autoComplete="off"
                        id="city"
                        type="text"
                        name="city"
                        placeholder="City"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.city}
                      />
                      {formik.touched.city && formik.errors.city ? (
                        <span className="validationError">
                          {formik.errors.city}
                        </span>
                      ) : null}
                    </div>
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
                  type="reset"
                  name="reset"
                  onClick={() => {
                    // dispatch(reInitialize());
                    formik.resetForm(formInitialValues);
                  }}
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
        </div>
      </form> */}
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={1}>
            {/* <CardHeader title="Add Address" /> */}
            {/* <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}> */}
            <Form
              form={form}
              initialValues={formInitialValues}
              name="userbody"
              {...formItemLayout}
              onFinish={onFinish}
            >
              <Form.Item
                name="bName"
                style={{ marginBottom: 5 }}
                label="Building and Flat no"
                rules={[
                  {
                    required: true,
                    message: "Please input your Building name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="landmark"
                style={{ marginBottom: 5 }}
                label="Landmark"
                rules={[
                  {
                    required: true,
                    message: "Please input your Landmark!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="pincode"
                style={{ marginBottom: 5 }}
                label="Pincode"
                rules={[
                  {
                    required: true,
                    message: "Please input your Pincode!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="city"
                style={{ marginBottom: 5 }}
                label="City"
                rules={[
                  {
                    required: true,
                    message: "Please input your City!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Divider style={{ marginBottom: 5, marginTop: 5 }} />
              <Form.Item noStyle={true}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  style={{ marginRight: 5 }}
                >
                  Save
                </Button>

                {/* <Button
                    type="primary"
                    icon={<RetweetOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={()=>{}}
                  >
                    Reset
                  </Button> */}

                <Button
                  type="primary"
                  icon={<Icon component={RollbackOutlined} />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    props.onBackPress();
                  }}
                >
                  Back
                </Button>

                {/* <Button
                    type="primary"
                    icon={<Icon component={PrinterOutlined} />}
                    style={{ marginRight: 5 }}
                    onClick={props.OnPrint}
                  >
                    Print
                  </Button> */}
              </Form.Item>
            </Form>
            {/* </Card> */}
          </Col>
        </Row>
      </Spin>
    </Fragment>
  );
};

export default AddAddressCard;
