import * as actionTypes from "./actionTypes";
import axios from "../../axios";
import ChangePassword from "../../models/changepassword";
import { fetchUserInfo } from "./appMain";
// import { firebaseAuth } from "../../shared/utility";

export const saveCHANGEPASSWORDData = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.SAVE_CHANGEPASSWORD_START });

    try {
      const password = getState().login.password;
      //  console.log("d1", userType);
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        password: password,
      };

      const res = await axios.post("change/ChangePassword", data);
      const resData = res.data;
      const changepasswords = [];
      for (const key in resData) {
        changepasswords.push(
          new ChangePassword(
            resData[key].CurrentPassword,
            resData[key].NewPassword,
            resData[key].RetypePassword
          )
        );
      }
      dispatch({
        type: actionTypes.SAVE_CHANGEPASSWORD_SUCCESS,
        changepasswords: changepasswords,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.SAVE_CHANGEPASSWORD_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
// BY EKTA 12-02-2020

const authenticateStart = () => {
  return {
    type: actionTypes.AUTHENTICATE_START,
    error: null,
  };
};

const authenticateSuccess = (token, userData) => {
  return {
    type: actionTypes.AUTHENTICATE_SUCCESS,
    token,
    token,
    userData: userData,
  };
};
const authenticateFail = (error) => {
  return {
    type: actionTypes.AUTHENTICATE_FAIL,
    error: error,
  };
};

export const authenticate = () => {
  return async (dispatch, getState) => {
    // firebaseAuth();
    dispatch(authenticateStart());
    let l_token = localStorage.getItem("accessToken");
    let l_userData = JSON.parse(localStorage.getItem("userData"));
    let CompCode = localStorage.getItem("CompCode");

    dispatch({ type: actionTypes.FETCH_USERINFO_START });
    try {
      const userType = l_userData.userType
        ? l_userData.userType
        : getState().LoginReducer.userData.userType;
      const userId = l_userData.userId
        ? l_userData.userId
        : getState().LoginReducer.userData.userId;
      const data = {
        CompCode: CompCode ? CompCode : getState().LoginReducer.CompCode,
        userType: userType,
        userId: userId,
      };

      const res = await axios.post(`appmain/getUserInfo`, data);
      const resData = res.data.data;

      let userInfo;
      for (const key in resData) {
        userInfo = {
          userType: resData[key].UserType,
          userId: resData[key].UserId,
          userTypeRef: resData[key].UserTypeRef,
          userName: resData[key].UserName,
          email: resData[key].email,
          mobileNo: resData[key].mobile,
          gender: resData[key].gender,
          hasDemographyInfo: resData[key].hasDemographyInfo,
          defaultPath: resData[key].defaultPath,
        };
      }

      dispatch({
        type: actionTypes.FETCH_USERINFO_SUCCESS,
        userInfo: userInfo,
      });
      if (CompCode) {
        dispatch({
          type: actionTypes.VALIDATE_COMPANY_SUCCESS,
          CompCode: CompCode,
        });
        dispatch({
          type: actionTypes.SET_COMPANY_CODE,
          CompCode: CompCode,
        });
      }
      if (userInfo && userInfo.userId) {
        dispatch(authenticateSuccess(l_token, l_userData));
      } else {
        dispatch(authenticateFail(""));
      }
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_USERINFO_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }

    // Promise.all([
    //   dispatch(
    //     fetchUserInfo(
    //       l_userData && l_userData.userType,
    //       l_userData && l_userData.userId
    //     )
    //   ),
    // ]).then(() => {
    //   // if (
    //   //   getState().AppMain.userInfo.userId &&
    //   //   getState().AppMain.userInfo.userId
    //   // ) {
    //   if (getState().AppMain.userInfo && getState().AppMain.userInfo.userId) {
    //     dispatch(authenticateSuccess(l_token, l_userData));
    //   } else {
    //     // console.log("sad");
    //     // localStorage.removeItem("accessToken");
    //     // localStorage.removeItem("userData");
    //     dispatch(authenticateFail(""));
    //   }
    // });
  };
};

export const logout = () => {
  console.log("system log-out");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userData");
  return { type: actionTypes.LOGOUT };
};

const loginStart = () => {
  return {
    type: actionTypes.LOGIN_START,
    error: null,
  };
};

const loginSuccess = (token, userData) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    token,
    userData: userData,
  };
};
const loginFail = (error) => {
  return {
    type: actionTypes.LOGIN_FAIL,
    error: error,
  };
};

export const login = (username, password, compCode) => {
  return async (dispatch) => {
    dispatch(loginStart());

    const data = {
      CompCode: compCode,
      username,
      password,
    };
    // console.log(data);
    axios
      .post("auth/SignIn", data)
      .then((res) => {
        // console.log("res", res);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userData", JSON.stringify(res.data.userData));
        localStorage.setItem("CompCode", compCode);

        dispatch(loginSuccess(res.data.accessToken, res.data.userData));
      })
      .catch((err) => {
        console.error("err", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
        // setTimeout(() => {
        //   toast.error(
        //     "Oppss.. The password is invalid or the user does not have a password."
        //   );
        // }, 200);

        dispatch(loginFail("Invalid Credentials"));
      });
  };
};
