import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { Input } from "antd";
export const LoginBody = styled.div`
 // background: linear-gradient(
 //     0deg,
   //   rgba(2, 42, 156, 0.3),
      rgba(2, 42, 156, 0.3)
    ),
    linear-gradient(232.85deg, #020529 -52%, #000b8e 198.1%);
    background:#00042c;
  position: relative;
  min-height: 660px;
  height: 100vh;
  overflow-y: scroll;
  height: 100%;
  overflow: hidden;
  font-family: Lato, "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #58666e;
`;

export const LoginInner = styled.div`
  position: relative;
  margin: 0 auto;
  width: 890px;
  padding: 30px;

  @media (max-width: 890px) {
    overflow: auto;
    width: auto;
    max-width: 480px;
    margin: 0px auto;
    padding: 30px;
  }
`;

export const LoginHeader = styled.div`
  position: absolute;
  width: 100%;
  padding: 0 30px;
  left: 0;
  @media (max-width: 890px) {
    padding: 0 30px;
  }
`;

export const LoginLogo = styled.img`
  width: 60px;
  border: 0;
  vertical-align: middle;
`;

export const LoginSignUpBody = styled.div`
  float: right !important;
  cursor: not-allowed;
`;
export const LoginHeadText = styled.span`
  color: #fff;
`;
export const LoginHeadButton = styled(Link)`
  color: #528ff0;
  background-color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 700;
  width: 72px;
  margin-left: 12px;
  outline: 0 !important;
  border-radius: 2px;
  display: inline-block;
  margin-bottom: 0;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.428571429;
  vertical-align: middle;
  background-image: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: not-allowed;
`;
export const LoginMainBody = styled.div`
  position: relative;
  margin-top: 92px;
`;
export const LoginPrimaryInnerBody = styled.div`
  width: 100%;
  height: 540px;
  position: relative;
  border-radius: 2px;
  padding: 40px;
  background-color: #f7f8fa;
  -webkit-box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 20%);
  @media (max-width: 890px) {
    display: none;
  }
`;
export const LoginInnerBodyMessage = styled.div`
  opacity: 1;
  -webkit-transition-delay: 0.4s;
  transition-delay: 0.4s;
  right: 390px;
  left: 40px;
  -webkit-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
  position: absolute;
  top: 40px;
  bottom: 40px;
  display: none;
`;
export const LoginInnerBodyImg = styled.img`
  margin-bottom: 4px;
  width: 100%;
  border: 0;
  vertical-align: middle;
`;
export const LoginRedirectLink = styled.a`
  font-weight: 600;
  font-size: 16px;
  color: #528ff0 !important;
  margin-top: 8px;
  display: inline-block;
  margin-bottom: 20px;
`;
export const LoginInnerText = styled.div`
  font-size: 14px;
  line-height: 1.8;
  margin-top: 8px;
`;

export const LoginInnerSpan = styled.span`
  display: inline-block;
  transition: 0.12s ease-in;
  font-family: Muli, BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    Helvetica, Arial, sans-serif;
`;

export const LoginInnerHeaderText = styled.div`
  margin-top: 24px;
  font-weight: 700;
  font-family: Lato !important;
  font-size: 16px;
`;
export const LoginMainAuthBody = styled.div`
  padding: 0;
  height: 600px;
  width: 322px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 4px 4px 8px 0 rgb(23 31 37 / 6%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 4px 4px 8px 0 rgb(23 31 37 / 6%);
  top: -30px;
  left: 30px;
  -webkit-transition: left 0.8s cubic-bezier(0.175, 0.885, 0.26, 1.055);
  transition: left 0.8s cubic-bezier(0.175, 0.885, 0.26, 1.055);
  @media (min-width: 890px) {
    left: 480px;
    position: absolute;
  }
  @media (max-width: 890px) {
    margin: 0 auto;
  }
`;

export const LoginMainHeading = styled.div`
    // padding: 20px 32px 0 32px; // this is default if google button exist
    padding: 110px 32px 0 32px; // remove if google button exist
    font-size: 20px;
    line-height: 30px;
    color: rgba(22, 47, 86, 0.87);
    font-weight: 700;
}`;

export const LoginDetailOverflowContainer = styled.div`
    width: 320px;
    height: 360px;
}`;
export const LoginDetailTranslateContainer = styled.div`
    transform: translateX(0px);
    width: 640px;
    height:0px;
}`;
export const LoginAuthSubStep = styled.div`
    overflow: hidden overlay;
    padding: 0 32px 20px 32px;
    height: 548px;
    width: 320px;
}`;

export const LoginWithGoogleButtonContainer = styled.div`
    width: 100%;
    position: relative;
    margin-top: 24px;
    margin-right: 0;
}`;
export const LoginImgContainer = styled.div`
    width: 32px;
    height: 32px;
    background-color: white;
    position: absolute;
    top: 7%;
    left: 4px;
    border-radius: 2px;
}`;

export const LoginGoogleButton = styled.button`
    background: rgba(98, 170, 255, 0.05);
    color: #2B83EA;
    border: 1px solid rgba(11, 112, 231, 0.74);
    font-size: 14px;
    line-height: 20px;    
    padding: 8px 24px;
    border-radius: 2px;
    font-weight: bold;
    width: 100%;
    -webkit-appearance: button;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    margin: 0;
}`;

export const LoginSepratorContainer = styled.div`
  position: relative;
  padding-top: 28px;
  padding-bottom: 9px;
`;
export const LoginSeprator = styled.div`
  background: rgba(22, 47, 86, 0.1);
  border-radius: 2px;
  height: 1px;
`;
export const LoginSepratorText = styled.span`
  position: absolute;
  top: 18px;
  left: calc(50% - 20px);
  z-index: 1;
  padding-left: 10px;
  padding-right: 10px;
  background: white;
  font-size: 12px;
  color: rgba(22, 47, 86, 0.54);
`;
export const LoginForm = styled.form`
  margin-top: 24px;
  margin-bottom: 0;
  position: relative;
`;
export const LoginFormLabel = styled.label`
  margin-top: 4px;
  font-size: 12px;
  line-height: 18px;
  color: rgba(22, 47, 86, 0.54);
  font-weight: normal;
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
`;
export const defaultFormCss = css`
  margin-bottom: 20px;
  height: 40px;
  font-size: 14px;
  line-height: 20px;
  padding: 8px;
  border: none;
  border-bottom: 1px solid rgba(22, 47, 86, 0.1);
  background-color: rgba(224, 228, 249, 0.1);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`;
export const LoginForInputEmail = styled(Input)`
  ${defaultFormCss}
  color: #555;
  display: block;
  box-shadow: none;
  border-radius: 2px;
  width: 100%;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;

  &::placeholder {
    color: #999;
    opacity: 0.5;
  }
  &:focus {
    box-shadow: none;
  }
`;

export const LoginForInputPassword = styled(Input.Password)`
  ${defaultFormCss}
  color: #555;
  display: flex;
  box-shadow: none;
  border-radius: 2px;
  width: 100%;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;

  &::placeholder {
    color: #999;
    opacity: 0.5;
  }
  &:focus {
    box-shadow: none;
  }
`;
export const LoginPasswordForget = styled.span`
  color: #0b70e7;
  font-size: 12px;
  line-height: 18px;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 16px;
  margin-top: -12px;
`;

export const LoginMainButton = styled.button`
  font-size: 14px;
  line-height: 20px;
  background-color: #2b83ea;
  padding: 8px 24px;
  color: white;
  border-radius: 2px;
  font-weight: bold;
  border: 1px solid #2b83ea;
  width: 100%;
  color: #fff !important;
  cursor: pointer;
  text-transform: none;
`;
export const LoginNeedHelp = styled.div`
  position: absolute;
  left: 50%;
  margin-left: -59px;
  bottom: 30px;
  font-size: 12px;
  text-align: center;
`;
export const LoginATag = styled.a`
  text-decoration: none !important;
  color: #2b83ea !important;
  cursor: pointer;
  background-color: transparent;
  font-size: 12px;
  text-align: center;
`;
export const FooterBottomContainer = styled.div`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  @media (min-width: 992px) {
    max-width: 960px;
  }
  @media (max-width: 768px) {
    max-width: 720px;
  }
  @media (max-width: 576px) {
    max-width: 540px;
  }
`;
