import axios from "../../axios";
import Faq from "../../models/faq";
import HelpCenter from "../../models/Help-Center";
import HelpMasterPortal from "../../models/helpmaster-portal";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

export const FETCH_FAQ_START = "FETCH_FAQ_START";
export const FETCH_FAQ_SUCCESS = "FETCH_FAQ_SUCCESS";
export const FETCH_FAQ_FAIL = "FETCH_FAQ_FAIL";

export const FETCH_HELPCENTER_START = "FETCH_HELPCENTER_START";
export const FETCH_HELPCENTER_SUCCESS = "FETCH_HELPCENTER_SUCCESS";
export const FETCH_HELPCENTER_FAIL = "FETCH_HELPCENTER_FAIL";

export const SAVE_HELPCENTERTRAN_START = "SAVE_HELPCENTERTRAN_START";
export const SAVE_HELPCENTERTRAN_SUCCESS = "SAVE_HELPCENTERTRAN_SUCCESS";
export const SAVE_HELPCENTERTRAN_FAIL = "SAVE_HELPCENTERTRAN_FAIL";

export const fetchFAQData = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_FAQ_START });

    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const userType = getState().login.userType;
      //  console.log("d1", userType);
      const data = { CompCode: CompCode, userType: userType };
      const res = await axios.post("help/getFAQData", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //   console.log("d1.2");
      // if (res.status !== 200) {
      //   dispatch({
      //     type: FETCH_FAQ_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      //   console.log("d2", res);
      const resData = res.data.data;
      const faqs = [];

      for (const key in resData) {
        faqs.push(
          new Faq(
            resData[key].FAQGroupCode,
            resData[key].FAQGroupDesc,
            resData[key].Question,
            resData[key].Answer
          )
        );
      }
      //   console.log(faqs);
      dispatch({
        type: FETCH_FAQ_SUCCESS,
        faqs: faqs,
      });
    } catch (err) {
      dispatch({
        type: FETCH_FAQ_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchHelpCenterData = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_HELPCENTER_START });

    try {
      const userType = getState().login.userType;
      //  console.log("d1", userType);
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        userType: userType,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("help/getHelpCenterData", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const HelpCenters = [];

      for (const key in resData) {
        HelpCenters.push(
          new HelpCenter(
            resData[key].Id,
            resData[key].HelpGroupCode,
            resData[key].HelpGroupDesc,
            resData[key].HelpTitle,
            resData[key].HelpDesc,
            resData[key].IsAllowFeedback,
            resData[key].DisplayFor
          )
        );
      }
      //   console.log(HelpCenters);
      dispatch({
        type: FETCH_HELPCENTER_SUCCESS,
        HelpCenters: HelpCenters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_HELPCENTER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

//20200113 Atul

export const saveHelpCenterTran = (
  helpType,
  helpId,
  userType,
  userId,
  mobileNo,
  orderNo,
  customHelpText,
  statusCode
) => {
  return async (dispatch, getState) => {
    const TRANTYPE = "SupportTicketSave";

    dispatch({ type: SAVE_HELPCENTERTRAN_START });
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      // const userType = getState().login.userType;
      const UpdtuserId = getState().LoginReducer.userData.username;
      // //  console.log("d1", userType);
      const data = {
        data: {
          CompCode: getState().LoginReducer.CompCode,
          UserType: userType,
          HelpType: helpType,
          UserId: userId,
          HelpId: helpId,
          MobileNo: mobileNo,
          OrderNo: orderNo,
          CustomHelpText: customHelpText,
          statusCode: statusCode,
          updtUsrId: UpdtuserId,
        },
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("help/insHelpTran", data);

      const resData = res.data;

      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: resData,
      });

      dispatch({
        type: SAVE_HELPCENTERTRAN_SUCCESS,
        res: resData,
      });
    } catch (ex) {
      console.error(ex);
      dispatch({
        type: SAVE_HELPCENTERTRAN_FAIL,
        error: "Network error !! Check your internet connection",
      });

      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};
//20200113
