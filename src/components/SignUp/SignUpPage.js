import React from "react";
import {
  LoginBody,
  LoginInner,
  LoginHeader,
  LoginLogo,
  LoginSignUpBody,
  LoginHeadText,
  LoginMainBody,
  LoginPrimaryInnerBody,
  LoginInnerBodyImg,
  LoginInnerText,
  LoginRedirectLink,
  LoginInnerSpan,
  LoginInnerHeaderText,
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
} from "../Login/styles";
import {
  LoginHeadButton,
  LoginMainAuthBody,
  LoginInnerBodyMessage,
} from "./styleSignUp";
const SignUpPage = () => {
  return (
    <LoginBody>
      <LoginInner>
        <LoginHeader>
          <div>
            <LoginLogo
              class="logo"
              src={require("../../assets/images/appicon.png")}
              alt="Logo"
              height=""
            />
            <LoginSignUpBody>
              <LoginHeadText>Already a user?</LoginHeadText>

              <LoginHeadButton to="/loginLatest">Log In</LoginHeadButton>
            </LoginSignUpBody>
          </div>
        </LoginHeader>
        <LoginMainBody>
          <LoginPrimaryInnerBody>
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
            <LoginMainHeading>Login to Dashboard</LoginMainHeading>
            <LoginDetailOverflowContainer>
              <LoginDetailTranslateContainer>
                <LoginAuthSubStep>
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
                    <LoginGoogleButton>Login With Google</LoginGoogleButton>
                  </LoginWithGoogleButtonContainer>
                  <LoginSepratorContainer>
                    <LoginSeprator></LoginSeprator>
                    <LoginSepratorText>or</LoginSepratorText>
                  </LoginSepratorContainer>
                  <LoginForm>
                    <LoginFormLabel>Your email</LoginFormLabel>
                    <LoginForInputEmail
                      type="email"
                      placeholder="example@xyz.com"
                    />
                    <div>
                      <LoginFormLabel>
                        Password
                        <LoginPasswordForget> (Forgot?)</LoginPasswordForget>
                      </LoginFormLabel>
                      <LoginForInputEmail
                        type="password"
                        placeholder="Passeord"
                      />
                      <LoginMainButton>Log In</LoginMainButton>
                    </div>
                  </LoginForm>
                </LoginAuthSubStep>
              </LoginDetailTranslateContainer>
            </LoginDetailOverflowContainer>
            <LoginNeedHelp>
              Need help?<LoginATag> Contact Us</LoginATag>
            </LoginNeedHelp>
          </LoginMainAuthBody>
        </LoginMainBody>
      </LoginInner>
    </LoginBody>
  );
};

export default SignUpPage;
