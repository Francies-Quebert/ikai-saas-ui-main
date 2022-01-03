import axios from "../axios";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";

const TRANTYPE = "RECIEPT";

export function getRecieptHdrData(CompCode, pFromDate, pToDate, pRecieptId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `reciept/getRecieptHdrData/${CompCode}/${pFromDate}/${pToDate}/${pRecieptId}`
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

export function getRecieptDtlData(CompCode, pRecieptId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`reciept/getRecieptDtlData/${CompCode}/${pRecieptId}`)
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

export function InsUpdtRcptService(CompCode, recieptHdr, recieptDtl) {
  return new Promise(function (resolve, reject) {
    try {
      const UpdtUsr = recieptHdr.updt_usr;
      const data = {
        Hdr: recieptHdr,
        Dtl: recieptDtl,
        updt_usr: UpdtUsr,
        CompCode: CompCode,
      };
      axios
        .post("reciept/InsUpdtRcptHdr", {
          data,
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const InsUpdtRcpt = (recieptHdr, recieptDtl) => {
  return async (dispatch, getState) => {
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        Hdr: recieptHdr,
        Dtl: recieptDtl,
        updt_usr: UpdtUsr,
        CompCode: CompCode,
      };
      const res = await axios.post("reciept/InsUpdtRcptHdr", {
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

export const DeleteReciept = (pdata) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    const CompCode = getState().LoginReducer.CompCode;
    try {
      const res = await axios.post("reciept/DeleteRcptHdr", {
        RecieptId: pdata.ReceiptId,
        CompCode: CompCode,
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
export function updtPosInvoiceSettlementAmount(pdata) {
  return new Promise(function (resolve, reject) {
    try {
      let data = { ...pdata };
      axios
        .post("reciept/updtPosInvoiceSettlementAmount", { data })
        .then((res) => {
          const resData = res.data;

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getRecieptHdrPOS(CompCode, pRecieptId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`reciept/getRecieptHdrPOS/${CompCode}/${pRecieptId}`)
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

export function UpdateReceiptSettlementAmount(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      // const UpdtUsr = recieptHdr.updt_usr;
      // const data = {
      //   ReceiptId: recieptHdr,
      //   Amount: recieptDtl,
      //   updt_usr: UpdtUsr,
      // };
      axios
        .post("reciept/updateReceiptSettlementAmount", {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}
export function InsRcptSettlement(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      // const UpdtUsr = recieptHdr.updt_usr;
      // const data = {
      //   ReceiptId: recieptHdr,
      //   Amount: recieptDtl,
      //   updt_usr: UpdtUsr,
      // };
      axios
        .post("reciept/InsReceiptSettlement", {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}
