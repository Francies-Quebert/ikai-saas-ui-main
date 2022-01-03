import axios from "../../axios";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";
import PaymodeMaster from "../../models/PaymentMode";

const TRANTYPE = "PaymodeMaster";

export const FETCH_PAYMODEMASTER_START = "FETCH_PAYMODEMASTER_START";
export const FETCH_PAYMODEMASTER_SUCCESS = "FETCH_PAYMODEMASTER_SUCCESS";
export const FETCH_PAYMODEMASTER_FAIL = "FETCH_PAYMODEMASTER_FAIL";

export const fetchPaymodeMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_PAYMODEMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `paymode-master/getPayModeMaster/${CompCode}`
      );
      const resData = res.data.data;
      const paymodeMaster = [];
      for (const key in resData) {
        paymodeMaster.push(
          new PaymodeMaster(
            resData[key].PayCode,
            resData[key].PayDesc,
            resData[key].IsPaymentGateway,
            resData[key].PaymentGatewayComp,
            resData[key].PaymentType,
            resData[key].OpeningBalance,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5,
            resData[key].SysOption6,
            resData[key].SysOption7,
            resData[key].SysOption8,
            resData[key].SysOption9,
            resData[key].SysOption10,

            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_PAYMODEMASTER_SUCCESS,
        paymodeMaster: paymodeMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_PAYMODEMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtPayModeMaster = (pInsUpdtType, val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        PayCode: val.PayCode,
        PayDesc: val.PayDesc,
        IsActive: val.IsActive,
        updt_usr: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "paymode-master/InsUpdtPayModeMaster",
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
      dispatch(fetchPaymodeMaster());
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
