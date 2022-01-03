import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
// import logo from "../../../assets/images/sofuto.png";
import logo from "../../../assets/images/logo.png"; //livkwick logo
// import logo from "../../../assets/images/pink-and-yellow.png"; //Resturant Logo

// import bg from '../../../assets/images/server/hexgon.jpg'
import Cryptr from "cryptr";
import { ToastContainer, toast } from "react-toastify";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../../axios";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../../store/actions/login";
import SweetAlert from "react-bootstrap-sweetalert";
import _ from "lodash";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
// import "antd/dist/antd.css";
import { KeyOutlined } from "@ant-design/icons";
import loginImgSERVICE from "../../../assets/images/LOGIN_SERVICE.png";
import loginImgRESTAURANT from "../../../assets/images/LOGIN_RESTAURANT.png";

import skyelintLogo from "../../../assets/images/endless-logo2.png";
import bcrypt from "bcryptjs";

const { Title, Text } = Typography;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.LoginReducer);
  // console.log(process.env.REACT_APP_CRYPTOKEY)
  const cryptr = new Cryptr(process.env.REACT_APP_CRYPTOKEY);
  // const [isLoading, setIsLoading] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);
  // const formik = useFormik({
  //   initialValues: {
  //     username: "",
  //     password: "",
  //     rememberme: false
  //   },
  //   validationSchema: Yup.object({
  //     username: Yup.string()
  //       .max(15, "Must be 15 characters or less")
  //       .required("Required"),
  //     password: Yup.string().required("Required")
  //   }),
  //   onSubmit: (values, { setSubmitting, resetForm }) => {
  //     setIsLoading(true);
  //     if (values.password.length < 100) {
  //       let pass = cryptr.encrypt(values.password);
  //       values.password = pass;
  //       // console.log(pass);
  //     }
  //     // setTimeout(() => {
  //     //   // alert(JSON.stringify(values, null, 2));

  //     // }, 400);
  //     dispatch(login(values.username, values.password));

  //     setSubmitting(false);
  //     resetForm();
  //     setIsLoading(false);
  //   }
  // });

  // useEffect(() => {}, [isLoading]);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (loginInfo.token && loginInfo.token.length > 0) {
      props.history.push("/");
    } else if (!_.isNull(loginInfo.error) && loginInfo.error.length > 0) {
      setShowError(true);
    }
    const token = localStorage.getItem("accessToken");
  }, [loginInfo]);

  const onFinish = async (values) => {
    setIconLoading(true);
    try {
      await axios
        .get(`user-master/getUserHash/${loginInfo.CompCode}/${values.username}`)
        .then((usr) => {
          if (usr.data.data.length > 0) {
            bcrypt
              .compare(values.password, usr.data.data[0].password)
              .then((res) => {
                if (res) {
                  dispatch(login(values.username, values.password));
                } else {
                  setShowError(true);
                  setIconLoading(false);
                }
              })
              .catch((err) => {
                console.error(err);
                setIconLoading(false);
              });
          } else {
            setShowError(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setIconLoading(false);
        });
    } catch (err) {
      console.error(err);
      setIconLoading(false);
    } finally {
      setIconLoading(false);
    }
  };
  let renderItem = (
    <div>
      <ToastContainer />
      <SweetAlert
        show={showError}
        type={"warning"}
        title={`Invalid Credentials`}
        onConfirm={() => setShowError(!showError)}
      />
      <Row style={{ minHeight: "100vh" }}>
        <Col xs={0} sm={0} md={12} lg={14} xl={16}>
          <Row style={{ minHeight: "100%" }}>
            <Col flex="1 1 100%">
              <img
                src={skyelintLogo}
                style={{ width: 110, height: "auto", padding: "15px 15px" }}
              />
            </Col>
            <Col style={{ alignSelf: "flex-end" }}>
              <img
                src={
                  process.env.REACT_APP_PROJECT_TYPE === "SERVICE"
                    ? loginImgSERVICE
                    : loginImgRESTAURANT
                }
                alt=""
                style={{ height: "auto", width: "100%" }}
              />
            </Col>
          </Row>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={10}
          xl={8}
          style={{
            backgroundColor:
              process.env.REACT_APP_PROJECT_TYPE === "SERVICE"
                ? "#c6d5f4"
                : "#fea3a6",
            padding: "0px 30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }} //Resturant

          // style={{ backgroundColor: "#c6d5f4" }} //Livkwick
        >
          <div
            style={{
              padding: "50px 30px",
              background: " #fff",
              // margin: "20px 35px 35px 35px",
              borderRadius: 8,
            }}
          >
            <div style={{ padding: "0px 0px", textAlign: "center" }}>
              <img
                src={`${
                  process.env.NODE_ENV === "production"
                    ? process.env.REACT_APP_API_PATH_LIVE
                    : process.env.REACT_APP_API_PATH_DEV
                }app-logo.png`}
                style={{ height: "auto", width: 130 }}
              />
            </div>

            <div style={{ padding: "5px 0px", textAlign: "center" }}>
              <Title
                level={2}
                strong
                style={{ color: "rgba(0, 0, 0, 0.70)", marginBottom: 0 }}
              >
                Welcome Back
              </Title>
            </div>
            <div style={{ padding: "0px 30px" }}>
              <Divider>
                <Text style={{ color: "rgba(0, 0, 0, 0.65)", fontSize: 12 }}>
                  Enter your Credentials
                </Text>
              </Divider>
            </div>
            <Form
              // {...layout}
              name="basic"
              initialValues={{
                usrname: "",
                password: "",
              }}
              layout={"vertical"}
              onFinish={onFinish}
              style={{ padding: "0 50px" }}
            >
              <Form.Item
                label={<Text strong>Username</Text>}
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
                required={false}
                // hasFeedback={true}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<Text strong>Password</Text>}
                name="password"
                // style={{ marginBottom: "0px" }}
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
                required={false}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                // {...tailLayout}
                style={{
                  marginBottom: "0px",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "100%",
                    flex: 1,
                    // backgroundColor: "#fb8a2d", //resturant color
                    backgroundColor:
                      process.env.REACT_APP_PROJECT_TYPE === "SERVICE"
                        ? "#0b5fff"
                        : "#fe6603",
                    borderColor:
                      process.env.REACT_APP_PROJECT_TYPE === "SERVICE"
                        ? "#0b5fff"
                        : "#fe6603",
                    //resturant color
                    // backgroundColor: "#0b5fff", //livkwick color
                    height: 40,
                  }}
                  loading={iconLoading}
                  // onClick={() => setIconLoading(!iconLoading)}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>

      {/* <SweetAlert
        show={showError}
        type={"warning"}
        title={loginInfo.error}
        onConfirm={() => setShowError(!showError)}
      ></SweetAlert>
      <div className="auth-bg align-card-center">
        <div className="authentication-box authentication-box-width">
          <div className="card mt-3">
            <div
              className="card-body"
              style={{ paddingTop: 75, paddingBottom: 75 }}
            >
              <div className="text-center p-b-25">
                <img src={logo} alt="" />
              </div>
              <div className="text-center">
                <h4>Portal Login</h4>
              </div>
              <Form
                {...layout}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                onFinish={(values) => {
                  setIsLoading(true);
                  if (values.password.length < 100) {
                    let pass = cryptr.encrypt(values.password);
                    values.password = pass;
                  }
                  dispatch(login(values.username, values.password));
                  setIsLoading(false);
                  setIconLoading(false)
                }}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  style={{ marginBottom: "0px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  style={{ marginBottom: "0px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  {...tailLayout}
                  style={{ marginBottom: "0px", justifyContent: "center" }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={iconLoading}
                    onClick={() => setIconLoading(!iconLoading)}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
  return renderItem;
};

export default LoginPage;
