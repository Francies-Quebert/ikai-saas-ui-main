import axios from "../../axios";
import SupportTicket from "../../models/supportTicket";

import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

export const SUPPORT_PENDING_TICKET_START = "SUPPORT_PENDING_TICKET_START";
export const SUPPORT_PENDING_TICKET_SUCCESS = "SUPPORT_PENDING_TICKET_SUCCESS";
export const SUPPORT_PENDING_TICKET_FAIL = "SUPPORT_PENDING_TICKET_FAIL";

export const SUPPORT_TICKET_START = "SUPPORT_TICKET_START";
export const SUPPORT_TICKET_SUCCESS = "SUPPORT_TICKET_SUCCESS";
export const SUPPORT_TICKET_FAIL = "SUPPORT_TICKET_FAIL";

const TRANTYPE = "SupportTickets";

export const updtSupportTicket = (pTicketNo, pStatusCode, pRemark) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const token = getState().LoginReducer.token;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        TicketNo: pTicketNo,
        StatusCode: pStatusCode,
        Remark: pRemark,
        UpdtUsrId: UpdtUsr,
      };

      const res = await axios.post("help/updtSupportTicket", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchSupportPendingTicket());
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

export const fetchSupportTicket = (fromDate, toDate) => {
  return async (dispatch, getState) => {
    dispatch({ type: SUPPORT_TICKET_START });
    try {
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        FromDate: fromDate,
        ToDate: toDate,
      };
      const token = getState().LoginReducer.token;
      const arrSupportStatus = getState().AppMain.otherMasterSupportStatus;
      const res = await axios.post("help/getSupportTickets", data, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const supporttickets = [];
      for (const key in resData) {
        supporttickets.push(
          new SupportTicket(
            resData[key].TicketNo,
            resData[key].name,
            resData[key].mobile,
            resData[key].HelpType,
            resData[key].HelpTitle,
            resData[key].HelpDesc,
            resData[key].CustomHelpText,
            resData[key].statusCode,
            resData[key].StatusDesc,
            resData[key].orderNo,
            resData[key].Remark,
            resData[key].crt_usrId,
            resData[key].crt_dttm,
            resData[key].updt_dttm,
            resData[key].updt_usrId,
            arrSupportStatus
          )
        );
      }
      dispatch({
        type: SUPPORT_TICKET_SUCCESS,
        supporttickets: supporttickets,
      });
    } catch (err) {
      console.error(err, "error");
      dispatch({
        type: SUPPORT_TICKET_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const fetchSupportPendingTicket = () => {
  return async (dispatch, getState) => {
    dispatch({ type: SUPPORT_PENDING_TICKET_START });
    try {
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "help/getPendingSupportTickets",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const supportpendingtickets = [];
      const arrSupportStatus = getState().AppMain.otherMasterSupportStatus;

      for (const key in resData) {
        supportpendingtickets.push(
          new SupportTicket(
            resData[key].TicketNo,
            resData[key].name,
            resData[key].mobile,
            resData[key].HelpType,
            resData[key].HelpTitle,
            resData[key].HelpDesc,
            resData[key].CustomHelpText,
            resData[key].statusCode,
            resData[key].StatusDesc,
            resData[key].orderNo,
            resData[key].Remark,
            resData[key].crt_usrId,
            resData[key].crt_dttm,
            resData[key].updt_dttm,
            resData[key].updt_usrId,
            arrSupportStatus
          )
        );
      }
      // console.error(SlotMaster,'error')
      dispatch({
        type: SUPPORT_PENDING_TICKET_SUCCESS,
        supportpendingtickets: supportpendingtickets,
      });
      //   console.error(slotmasters,'error found')
    } catch (err) {
      console.error(err, "error");
      dispatch({
        type: SUPPORT_PENDING_TICKET_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
