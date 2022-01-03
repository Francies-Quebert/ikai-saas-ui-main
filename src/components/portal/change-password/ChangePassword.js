import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Divider, Input, Typography, Button } from "antd";
import ChangePass from "../../../assets/images/change-password.png";
import Cryptr from "cryptr";
import { useSelector, useDispatch } from "react-redux";
// import { InsUpdateChangePassword } from "../../../store/actions/orders";
import { InsUpdateChangePassword } from "../../../services/changePassword";
import { getHashPassword } from "../../../shared/utility";
import { toast, ToastContainer } from "react-toastify";
import bcrypt from "bcryptjs";
import axios from "../../../axios";

const { Text, Title } = Typography;

const ChangePassword = (props) => {
  const [iconLoading, setIconLoading] = useState(false);
  const cryptr = new Cryptr(process.env.REACT_APP_CRYPTOKEY);
  const loginInfo = useSelector((state) => state.LoginReducer);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values) => {
    console.log(values, "values");
    try {
      setIconLoading(true);
      axios
        .get(
          `user-master/getUserHash/${loginInfo.CompCode}/${loginInfo.userData.username}`
        )
        .then((usr) => {
          bcrypt
            .compare(values.current, usr.data.data[0].password)
            .then((res) => {
              if (res) {
                getHashPassword(values.password).then((newHash) => {
                  InsUpdateChangePassword(
                    loginInfo.CompCode,
                    loginInfo.userData.userType,
                    loginInfo.userData.userId,
                    loginInfo.userData.userId,
                    newHash
                  )
                    .then((res) => {})
                    .catch((err) => {
                      return toast.warn(
                        "Some Error has Occured Please Try Again"
                      );
                    });
                  setIconLoading(false);
                  props.history.push("/");
                });
              } else {
                setIconLoading(false);
                return toast.warn("current password does not match");
              }
            })
            .catch((err) => {
              alert("error");
              setIconLoading(false);
            });
        })
        .catch((err) => {
          toast.error("Some error has encountered try again");
          setIconLoading(false);
          // props.history.push("/");
        });
    } catch (error) {
      console.error(error.error);
      setIconLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "rgb(247, 250, 252)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ToastContainer />
      <Card style={{ borderRadius: 5 }} bodyStyle={{ padding: "25px 20px" }}>
        <Row>
          <Col
            xs={0}
            sm={0}
            md={12}
            lg={12}
            xl={12}
            style={{ borderRight: "1px solid #f0f0f0" }}
          >
            <Col style={{ textAlign: "center" }}>
              <Title level={3}>Change Password</Title>
            </Col>
            <Col>
              <img
                src={ChangePass}
                style={{ height: "auto", width: "100%", maxWidth: 500 }}
              />
            </Col>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            style={{ alignSelf: "center" }}
          >
            <Col
              xs={24}
              sm={24}
              md={0}
              lg={0}
              xl={0}
              style={{ textAlign: "center" }}
            >
              <Title level={4}>Change Password</Title>
              <Divider />
            </Col>

            <Col>
              <Form
                // {...layout}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                layout={"vertical"}
                onFinish={onFinish}
                style={{ padding: "0 50px" }}
              >
                <Form.Item
                  label={<Text strong>Current Password</Text>}
                  name="current"
                  rules={[
                    {
                      required: true,
                      message: "Please input your current password!",
                    },
                  ]}
                  required={false}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label={<Text strong>New Password</Text>}
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password!",
                    },
                    {
                      pattern:
                        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                      message: "Password not good enough",
                    },
                  ]}
                  required={false}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label={<Text strong>Confirm Password</Text>}
                  name="confirm"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Passwords do not match!");
                      },
                    }),
                  ]}
                  required={false}
                  dependencies={["password"]}
                >
                  <Input.Password />
                </Form.Item>
                <div style={{ display: "flex" }}>
                  <Form.Item
                    style={{
                      marginBottom: "0px",
                      justifyContent: "center",
                      marginRight: 7,
                      flex: "auto",
                    }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        width: "100%",
                        backgroundColor: "#0b5fff",
                        height: 35,
                      }}
                      loading={iconLoading}
                    >
                      Save Password
                    </Button>
                  </Form.Item>
                  <Button
                    onClick={() => props.history.goBack()}
                    style={{
                      height: 35,
                    }}
                    disabled={iconLoading}
                  >
                    Back
                  </Button>
                </div>
              </Form>
            </Col>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ChangePassword;
