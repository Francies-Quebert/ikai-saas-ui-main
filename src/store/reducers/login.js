import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  changepasswords: null,
  token: null,
  userData: {
    userType: null,
    userId: null,
    empId: null,
    username: null,
    isLoading: null,
    error: null,
  },
  isLoading: false,
  error: null,
  CompCode: null,
};
// by ekta
const saveCHANGEPASSWORDstart = (state, action) => {
  // console.log('i was here')
  return updateObject(state, {
    isLoading: true,
    error: null,
    changepasswords: null,
  });
};

const saveCHANGEPASSWORDFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    changepasswords: null,
  });
};

const saveCHANGEPASSWORDSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    changepasswords: action.changepasswords,
  });
};

// by ekta

const generateOTPStart = (state, action) => {
  return updateObject(state, {
    mobileNo: null,
    isLoading: true,
    error: null,
    otpGenerated: false,
  });
};

const generateOTPSuccess = (state, action) => {
  return updateObject(state, {
    mobileNo: action.mobileNo,
    isLoading: false,
    userType: action.userType,
    error: null,
    otpGenerated: true,
  });
};

const generateOTPFail = (state, action) => {
  return updateObject(state, {
    mobileNo: null,
    isLoading: false,
    error: action.error,
    otpGenerated: null,
  });
};

const validateOTPStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const validateOTPSuccess = (state, action) => {
  return updateObject(state, {
    userId: action.userId,
    isLoading: false,
    userType: action.userType,
    error: null,
  });
};

const validateOTPFail = (state, action) => {
  return updateObject(state, {
    userId: null,
    isLoading: false,
    error: action.error,
  });
};

const authenticateSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    userData: action.userData,
    error: null,
    isLoading: false,
  });
};
const authenticateStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const authenticateFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    token: null,
    userData: null,
    error: action.error,
  });
};

const loginSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    userData: action.userData,
    error: null,
    isLoading: false,
  });
};
const loginStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const loginFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    token: null,
    userData: null,
    error: action.error,
  });
};
const valCompCodeSuccess = (state, action) => {
  return updateObject(state, {
    CompCode: action.CompCode,
    error: null,
    isLoading: false,
  });
};
const valCompCodeStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const valCompCodeFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    token: null,
    userData: null,
    error: action.error,
  });
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_CHANGEPASSWORD_START:
      return saveCHANGEPASSWORDstart(state, action);
    case actionTypes.SAVE_CHANGEPASSWORD_SUCCESS:
      return saveCHANGEPASSWORDSuccess(state, action);
    case actionTypes.SAVE_CHANGEPASSWORD_FAIL:
      return saveCHANGEPASSWORDFail(state, action);

    case actionTypes.AUTHENTICATE_SUCCESS:
      return authenticateSuccess(state, action);
    case actionTypes.AUTHENTICATE_START:
      return authenticateStart(state, action);
    case actionTypes.AUTHENTICATE_FAIL:
      return authenticateFail(state, action);

    case actionTypes.LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case actionTypes.LOGIN_START:
      return loginStart(state, action);
    case actionTypes.LOGIN_FAIL:
      return loginFail(state, action);

    case actionTypes.VALIDATE_OTP_START:
      return validateOTPStart(state, action);
    case actionTypes.VALIDATE_OTP_SUCCESS:
      return validateOTPSuccess(state, action);
    case actionTypes.VALIDATE_OTP_FAIL:
      return validateOTPFail(state, action);

    case actionTypes.GENERATE_OTP_START:
      return generateOTPStart(state, action);
    case actionTypes.GENERATE_OTP_SUCCESS:
      return generateOTPSuccess(state, action);
    case actionTypes.GENERATE_OTP_FAIL:
      return generateOTPFail(state, action);

    case actionTypes.VALIDATE_COMPANY_START:
      return valCompCodeStart(state, action);
    case actionTypes.VALIDATE_COMPANY_SUCCESS:
      return valCompCodeSuccess(state, action);
    case actionTypes.VALIDATE_COMPANY_FAIL:
      return valCompCodeFail(state, action);

    case actionTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
