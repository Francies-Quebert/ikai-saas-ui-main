import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  HeartOutlined,
} from "@ant-design/icons";
import React, { Fragment, useEffect, useState } from "react";
import {
  LoginBody,
  LoginInner,
  LoginHeader,
  LoginLogo,
  LoginSignUpBody,
  LoginHeadText,
  LoginHeadButton,
  LoginMainBody,
  LoginPrimaryInnerBody,
  LoginInnerBodyMessage,
  LoginInnerBodyImg,
  LoginInnerText,
  LoginRedirectLink,
  LoginInnerSpan,
  LoginInnerHeaderText,
  LoginMainAuthBody,
  LoginMainHeading,
  LoginDetailOverflowContainer,
  LoginDetailTranslateContainer,
  LoginAuthSubStep,
  LoginWithGoogleButtonContainer,
  LoginImgContainer,
  LoginGoogleButton,
  LoginSepratorContainer,
  LoginSeprator,
  LoginSepratorText,
  LoginForm,
  LoginFormLabel,
  LoginForInputEmail,
  LoginPasswordForget,
  LoginMainButton,
  LoginNeedHelp,
  LoginATag,
  LoginForInputPassword,
  FooterBottomContainer,
} from "./styles";
import { Spin, notification, Row, Col } from "antd";
import axios from "../../axios";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/actions/login";
import _ from "lodash";
import bcrypt from "bcryptjs";
import { validateCompCode } from "../../services/login";
import { Link } from "react-router-dom";
const LoginPage = (props) => {
  let currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.LoginReducer);
  const [iconLoading, setIconLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loginValue, setLoginValue] = useState({
    username: null,
    password: null,
    CompCode: null,
    CompName: null,
    validatingCompCode: null,
  });
  useEffect(() => {
    if (
      loginInfo &&
      loginInfo.token &&
      loginInfo.token !== null &&
      loginInfo.token.length > 0
    ) {
      props.history.push("/");
    } else if (!_.isNull(loginInfo.error) && loginInfo.error.length > 0) {
      // notification.error({
      //   message: "Invalid Value",
      //   description:
      //     "The .",
      // });
    }
    if (loginInfo.CompCode !== null) {
    }
    const token = localStorage.getItem("accessToken");
  }, [loginInfo]);
  useEffect(() => {
    const CompCode = localStorage.getItem("CompCode");
    if (CompCode) {
      setLoginValue({
        ...loginValue,
        CompCode: CompCode,
      });
    } else if (loginInfo.CompCode !== null) {
      setLoginValue({
        ...loginValue,
        CompCode: loginInfo.CompCode,
      });
    }
  }, []);
  const onFinish = async (values) => {
    setIconLoading(true);
    try {
      await axios
        .get(
          `user-master/getUserHash/${loginValue.CompCode}/${values.username}`
        )
        .then((usr) => {
          if (usr.data.data.length > 0) {
            bcrypt
              .compare(values.password, usr.data.data[0].password)
              .then((res) => {
                if (res) {
                  dispatch(
                    login(values.username, values.password, loginValue.CompCode)
                  );
                } else {
                  throw "Invalid Password";
                }
              })
              .catch((err) => {
                throw err;
              });
          } else {
            throw "Invalid Username";
          }
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Invalid Credential",
        description:
          "Incorrect username or password. To reset, click on Forgot? link.",
      });
      // setShowError(true);
    } finally {
      setIconLoading(false);
    }
  };
  const onValidateCompCode = (value) => {
    if (!_.includes([null, "", undefined], value)) {
      setIconLoading(true);
      dispatch({ type: "VALIDATE_COMPANY_START" });
      try {
        validateCompCode(value)
          .then((res) => {
            setLoginValue({
              ...loginValue,
              CompCode: res[0].compCode,
              CompName: res[0].compName,
            });
            dispatch({
              type: "VALIDATE_COMPANY_SUCCESS",
              CompCode: res[0].compCode,
            });
          })
          .catch((er) => {
            dispatch({
              type: "VALIDATE_COMPANY_FAIL",
              error: "Invalid Company Code",
            });
            throw {
              message: "Invalid Company Code",
              description:
                "please verify your company code again and try again",
            };
          });
      } catch (error) {
        dispatch({
          type: "VALIDATE_COMPANY_FAIL",
          error: "Invalid Company Code",
        });
        console.log(error, "error");
        notification.error(error);
      } finally {
        setIconLoading(false);
      }
    }
  };
  return (
    <LoginBody>
      <LoginInner>
        {/* <div className="footer-shape">
          <img
            src={require("../../assets/images/shape/footer-shape-one.png")}
            alt="Image"
          />
          <img
            src={require("../../assets/images/shape/footer-shape-two.png")}
            alt="Image"
          />
        </div> */}
        <LoginHeader>
          <div>
            <LoginLogo
              class="logo"
              src={require("../../assets/images/appicon.png")}
              alt="Logo"
              height=""
            />
            <LoginSignUpBody>
              <LoginHeadText>New to Ikai ?</LoginHeadText>

              <LoginHeadButton
                to="/SignUpPageLatest"
                aria-disabled="true"
                disabled="true"
              >
                Sign Up
              </LoginHeadButton>
            </LoginSignUpBody>
          </div>
        </LoginHeader>
        <LoginMainBody>
          <LoginPrimaryInnerBody>
            <img
              src={require("../../assets/images/ai-retail.jpg")}
              style={{
                width: "68%",
                position: "relative",
                top: "50px",
                right: "36px",
              }}
            />

            <LoginInnerBodyMessage>
              <LoginInnerBodyImg
                src={require("../../assets/images/login-banner.svg")}
              />
              <LoginInnerText>
                Start accepting payments on your website or blog in less than 5
                minutes. No coding needed.
              </LoginInnerText>
              <LoginRedirectLink>
                Learn More <LoginInnerSpan>→</LoginInnerSpan>
              </LoginRedirectLink>
              <LoginInnerHeaderText>
                Takeaways from FY20/21 &amp; ₹50k worth free credits!
              </LoginInnerHeaderText>
              <LoginInnerText>
                Start accepting payments on your website or blog in less than 5
                minutes. No coding needed.
              </LoginInnerText>
              <LoginRedirectLink>
                Register for free <LoginInnerSpan>→</LoginInnerSpan>
              </LoginRedirectLink>
            </LoginInnerBodyMessage>
          </LoginPrimaryInnerBody>
          <LoginMainAuthBody>
            <Spin spinning={iconLoading}>
              {_.includes([null, "", undefined], loginValue.CompCode) ? (
                <>
                  <LoginDetailOverflowContainer>
                    <LoginDetailTranslateContainer>
                      <LoginAuthSubStep>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "54px 36px 30px 30px",
                          }}
                        >
                          <LoginLogo
                            class="logo"
                            src={require("../../assets/images/appicon.png")}
                            alt="Logo"
                            height=""
                          />
                        </div>
                        <LoginForm>
                          <LoginFormLabel>Enter Company Code</LoginFormLabel>
                          <LoginForInputEmail
                            type="text"
                            value={loginValue.validatingCompCode}
                            placeholder="company code"
                            onChange={(e) => {
                              setLoginValue({
                                ...loginValue,
                                validatingCompCode: e.target.value,
                              });
                            }}
                          />
                          <LoginMainButton
                            onClick={(e) => {
                              e.preventDefault();
                              onValidateCompCode(loginValue.validatingCompCode);
                            }}
                          >
                            Validate Company
                          </LoginMainButton>
                        </LoginForm>
                      </LoginAuthSubStep>
                    </LoginDetailTranslateContainer>
                  </LoginDetailOverflowContainer>
                </>
              ) : (
                <>
                  <LoginMainHeading>Login to Dashboard</LoginMainHeading>
                  <LoginDetailOverflowContainer>
                    <LoginDetailTranslateContainer>
                      <LoginAuthSubStep>
                        {/*remove this div to display google button */}
                        <div style={{ display: "none" }}>
                          <LoginWithGoogleButtonContainer>
                            <LoginImgContainer>
                              <img
                                style={{
                                  width: 18,
                                  position: "absolute",
                                  top: "24%",
                                  left: "22%",
                                }}
                                src={require("../../assets/images/google-icon.svg")}
                              />
                            </LoginImgContainer>
                            <LoginGoogleButton>
                              Login With Google
                            </LoginGoogleButton>
                          </LoginWithGoogleButtonContainer>
                          <LoginSepratorContainer>
                            <LoginSeprator></LoginSeprator>
                            <LoginSepratorText>or</LoginSepratorText>
                          </LoginSepratorContainer>
                        </div>
                        <LoginForm>
                          <LoginFormLabel>Your username</LoginFormLabel>
                          <LoginForInputEmail
                            autoFocus="true"
                            type="username"
                            value={loginValue.username}
                            placeholder="example@xyz.com"
                            onChange={(e) => {
                              setLoginValue({
                                ...loginValue,
                                username: e.target.value,
                              });
                            }}
                          />
                          <div>
                            <LoginFormLabel>
                              Password
                              <LoginPasswordForget>
                                {" "}
                                (Forgot?)
                              </LoginPasswordForget>
                            </LoginFormLabel>
                            <LoginForInputPassword
                              type="password"
                              placeholder="password"
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeTwoTone />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              value={loginValue.password}
                              onChange={(e) => {
                                setLoginValue({
                                  ...loginValue,
                                  password: e.target.value,
                                });
                              }}
                            />
                            <LoginMainButton
                              onClick={(e) => {
                                e.preventDefault();
                                onFinish(loginValue);
                              }}
                            >
                              Log In
                            </LoginMainButton>
                          </div>
                        </LoginForm>
                      </LoginAuthSubStep>
                    </LoginDetailTranslateContainer>
                  </LoginDetailOverflowContainer>
                  <LoginNeedHelp>
                    Need help?
                    <LoginATag
                      href="http://ikaitechnologies.com/contact/"
                      target="_blank"
                    >
                      {" "}
                      Contact Us
                    </LoginATag>
                  </LoginNeedHelp>
                </>
              )}
            </Spin>
          </LoginMainAuthBody>
        </LoginMainBody>
      </LoginInner>
      {/* Footer Bottom Area   */}
      <footer className="footer-bottom-area">
        <FooterBottomContainer>
          <Row className="align-items-center">
            <Col xs={24} lg={10}>
              <div className="copy-right">
                <p>
                  Copyright &copy; {currentYear} Ikai Technologies. All Rights
                  Reserved
                </p>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <div className="privacy">
                <ul>
                  <li>
                    <Link href="/terms-conditions">
                      <a>Terms &amp; Conditions</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">
                      <a>Privacy Policy</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </Col>

            <Col xs={24} lg={6}>
              <div className="designed">
                <p>
                  Product From <HeartOutlined />{" "}
                  <a href="http://ikaitechnologies.com/" target="_blank">
                    Ikai Technologies
                  </a>
                </p>
              </div>
            </Col>
          </Row>
        </FooterBottomContainer>
      </footer>
    </LoginBody>
  );
};

export default LoginPage;
