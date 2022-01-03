import axios from "../axios";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";

const TRANTYPE = "BillSettlement";

export function getCustOutstandingData(CompCode, CustId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`custOutstanding/getCustOutstandingData/${CompCode}/${CustId}`)
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

export function getBillSettlementData(CompCode, FromDate, ToDate, CustId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `custOutstanding/getBillSettlementData/${CompCode}/${FromDate}/${ToDate}/${CustId}`
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

export function getDataReciepts(CompCode, CustId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`custOutstanding/getDataReciepts/${CompCode}/${CustId}`)
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key], key, SettlementAmount: 0 });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

// export function InsBillSettlemet(pData) {
//   return new Promise(function (resolve, reject) {
//     try {
//       // const data = {
//       //   invoiceHdr: pInvoiceHdr,
//       //   invoiceDtl: pInvoiceDtl,
//       // };
//       // axios
//       //   .post("orderportal/saveServiceInvoice", {
//       //     data,
//       //   })
//       //   .then((res) => {
//       //     // const resData = res.data.data;
//       //     // let data = [];
//       //     // console.log("res from api", resData);
//       //     // for (const key in resData) {
//       //     //   data.push({ ...resData[key], key });
//       //     // }
//       //     resolve(res);
//       //   });
//     } catch (e) {
//       reject(e);
//     }
//   });
// }
export const InsBillSettlemet = (data) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post("custOutstanding/InsReceiptStlmnt", {
        data: { ...data, CompCode },
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
