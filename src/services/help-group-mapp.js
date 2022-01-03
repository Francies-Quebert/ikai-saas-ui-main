import axios from "../axios";
import FaqGrpUsrMapp from "../models/faqgrpusrmapp";
import HelpGrpUsrMapp from "../models/helpgrpusrmapp";
//import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";
const TRANTYPE = "HelpGroupMapping";

export function getHelpGrpUsrMapp(CompCode, pGroupCode, pUserType) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserAccess fetched request", pUserId);
      axios
        .get(`help/getHelpGrpUsrmapp/${CompCode}/${pGroupCode}/${pUserType}`)
        .then((res) => {
          const helpgrpusrmapp = [];
          const resData = res.data.data;

          for (const key in resData) {
            helpgrpusrmapp.push(
              new HelpGrpUsrMapp(
                resData[key].Id,
                resData[key].HelpTitle,
                resData[key].IsVisible == 1 ? true : false
              )
            );
          }

          resolve(helpgrpusrmapp);
        })
        .catch((err) => {
          console.error("rejected from getHelpGrpUsrMapp", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getHelpGrpUsrMapp", e);
      reject(e);
    }
  });
}

export const InsUpdtHelpGroupMapping = (pHelpGroup, pUserType, pDetail) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        data: {
          CompCode,
          HelpGroup: pHelpGroup,
          UserType: pUserType,
          UpdtUsrId: UpdtUsr,
          MappDtl: pDetail,
        },
      };
      const res = await axios.post("help/insUpdtHelpGrpUsrmapp", data);
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
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

export function getFaqGrpUsrMapp(CompCode, pGroupCode, pUserType) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserAccess fetched request", pUserId);
      axios
        .get(`help/getFaqGrpUsrmapp/${CompCode}/${pGroupCode}/${pUserType}`)
        .then((res) => {
          const faqgrpusrmapp = [];
          const resData = res.data.data;

          for (const key in resData) {
            faqgrpusrmapp.push(
              new FaqGrpUsrMapp(
                resData[key].Id,
                resData[key].Question,
                resData[key].IsVisible == 1 ? true : false
              )
            );
          }

          resolve(faqgrpusrmapp);
        })
        .catch((err) => {
          console.error("rejected from getFaqGrpUsrMapp", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getFaqGrpUsrMapp", e);
      reject(e);
    }
  });
}

export const InsUpdtFaqGroupMapping = (pFaqGroup, pUserType, pDetail) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        data: {
          FaqGroup: pFaqGroup,
          UserType: pUserType,
          UpdtUsrId: UpdtUsr,
          MappDtl: pDetail,
          CompCode,
        },
      };
      const res = await axios.post("help/insUpdtFaqGrpUsrmapp", data);
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
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
