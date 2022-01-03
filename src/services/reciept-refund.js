import axios from "../axios";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";

const TRANTYPE = "RECIEPTREFUND";

export function getRecieptRefundHdrData(
  CompCode,
  pFromDate,
  pToDate,
  pRefundNo
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `reciept/getRecieptRefundHdrData/${CompCode}/${pFromDate}/${pToDate}/${pRefundNo}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key], key });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getRecieptRefundDtlData(CompCode, RefundId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`reciept/getRecieptRefundDtlData/${CompCode}/${RefundId}`)
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key], key });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const DeleteRefund = (pdata) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    const pCompCode = getState().LoginReducer.CompCode;
    try {
      const data = {
        RefundId: pdata.RefundId,
        ReceiptId: pdata.ReceiptId,
        BalAmount: parseFloat(pdata.Amount),
        CompCode: pCompCode,
      };
      const res = await axios.post("reciept/DeleteRefund", {
        data,
      });
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        // data: res.data.data,
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

export function getRecieptBalAmountData(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`reciept/getRecieptBalAmountData/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let data = [];
        for (const key in resData) {
          data.push({ ...resData[key], key });
        }
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export const InsUpdtRefund = (
  refundHdr,
  refundDtl,
  balAmount,
  updateRcptHdr
) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    const pCompCode = getState().LoginReducer.CompCode;
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        Hdr: refundHdr,
        Dtl: refundDtl,
        balAmount: balAmount,
        updt_usr: UpdtUsr,
        CompCode: pCompCode,
      };
      // console.log(data, "service data");
      const res = await axios.post("reciept/InsUpdtRefund", {
        data,
        updtRcptHdr: updateRcptHdr,
      });
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        // data: res.data.data,
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

export const InsUpdtRefundService = (
  CompCode,
  refundHdr,
  refundDtl,
  balAmount,
  updateRcptHdr,
  updtUsr
) => {
  return new Promise(async function (resolve, reject) {
    try {
      const data = {
        Hdr: refundHdr,
        Dtl: refundDtl,
        balAmount: balAmount,
        updt_usr: updtUsr,
        CompCode: CompCode,
      };
      // console.log(data, "service data");
      const res = await axios.post("reciept/InsUpdtRefund", {
        data,
        updtRcptHdr: updateRcptHdr,
      });
      resolve(res);
    } catch (ex) {
      reject(ex);
    }
  });
};
