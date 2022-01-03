import axios from "../../axios";
import FAQMasterPortal from "../../models/faqmaster-portal";
import HelpMasterPortal from "../../models/helpmaster-portal";
import HelpGrpUsrMapp from "../../models/helpgrpusrmapp";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "Help Master";

export const FETCH_FAQMASTERPORTAL_START = "FETCH_FAQMASTERPORTAL_START";
export const FETCH_FAQMASTERPORTAL_SUCCESS = "FETCH_FAQMASTERPORTAL_SUCCESS";
export const FETCH_FAQMASTERPORTAL_FAIL = "FETCH_FAQMASTERPORTAL_FAIL";

export const FETCH_HELPMASTERPORTAL_START = "FETCH_HELPMASTERPORTAL_START";
export const FETCH_HELPMASTERPORTAL_SUCCESS = "FETCH_HELPMASTERPORTAL_SUCCESS";
export const FETCH_HELPMASTERPORTAL_FAIL = "FETCH_HELPMASTERPORTAL_FAIL";

export const FETCH_HELPGROUPUSERMAPP_START = "FETCH_HELPGROUPUSERMAPP_START";
export const FETCH_HELPGROUPUSERMAPP_SUCCESS =
  "FETCH_HELPGROUPUSERMAPP_SUCCESS";
export const FETCH_HELPGROUPUSERMAPP_FAIL = "FETCH_HELPGROUPUSERMAPP_FAIL";

export const InsUpdtHelpMasterPortal = (pInsUpdtType, pHelpMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const token = getState().LoginReducer.token;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        Id: pHelpMaster.Id,
        HelpTitle: pHelpMaster.HelpTitle,
        HelpDesc: pHelpMaster.HelpDesc,
        IsAllowFeedback: pHelpMaster.IsAllowFeedback,
        DisplayFor: pHelpMaster.DisplayFor,
        IsActive: pHelpMaster.IsActive,
        updt_usrId: UpdtUsr,
      };
      const res = await axios.post(
        "help/insUpdtHelpCenter",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchHelpMasterPortal());
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};

export const fetchHelpMasterPortal = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_HELPMASTERPORTAL_START });

    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post("help/GetHelpMasterPortal", {
        CompCode: getState().LoginReducer.CompCode,
      });
      const resData = res.data.data;
      const HelpMasters = [];
      // console.log(resData, "datatatatat");
      for (const key in resData) {
        HelpMasters.push(
          new HelpMasterPortal(
            resData[key].Id,
            resData[key].HelpTitle,
            resData[key].HelpDesc,
            resData[key].IsAllowFeedback.data[0] === 1 ? true : false,
            resData[key].DisplayFor,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }

      dispatch({
        type: FETCH_HELPMASTERPORTAL_SUCCESS,
        HelpMasters: HelpMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_HELPMASTERPORTAL_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchFAQMasterPortal = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_FAQMASTERPORTAL_START });

    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post("help/getFAQMasterPortal", {
        CompCode: getState().LoginReducer.CompCode,
      });
      const resData = res.data.data;
      const FAQMasters = [];
      // console.log(resData, "datatatatat");
      for (const key in resData) {
        FAQMasters.push(
          new FAQMasterPortal(
            resData[key].Id,
            resData[key].Question,
            resData[key].Answer,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }

      dispatch({
        type: FETCH_FAQMASTERPORTAL_SUCCESS,
        FAQMasters: FAQMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_FAQMASTERPORTAL_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchHelpGrpUsrMapp = (pGroupCode, pUserType) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_HELPGROUPUSERMAPP_START });
    const data = {
      CompCode: getState().LoginReducer.CompCode,
      GroupCode: pGroupCode,
      UserType: pUserType,
    };
    try {
      const res = await axios.post("help/getHelpGrpUsrmapp", data);
      const resData = res.data.data;
      const helpgrpusrmapp = [];
      // console.log(resData, "datatatatat");
      for (const key in resData) {
        helpgrpusrmapp.push(
          new HelpGrpUsrMapp(
            resData[key].Id,
            resData[key].HelpTitle,
            resData[key].IsVisible == 1 ? true : false
          )
        );
      }

      dispatch({
        type: FETCH_HELPGROUPUSERMAPP_SUCCESS,
        helpgrpusrmapp: helpgrpusrmapp,
      });
    } catch (err) {
      dispatch({
        type: FETCH_HELPGROUPUSERMAPP_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const InsUpdtFAQMasterPortal = (pInsUpdtType, pFAQMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const token = getState().LoginReducer.token;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        Id: pFAQMaster.Id,
        Question: pFAQMaster.Question,
        Answer: pFAQMaster.Answer,
        IsActive: pFAQMaster.IsActive,
        updt_usrId: UpdtUsr,
      };
      const res = await axios.post(
        "help/insUpdtFAQCenter",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchFAQMasterPortal());
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};
