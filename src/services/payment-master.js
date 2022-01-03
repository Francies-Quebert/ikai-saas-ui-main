import axios from "../axios";

export function getPaymentHdrData(CompCode, pFromDate, pToDate, pPaymentNo) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `payment-master/getPaymentHdrData/${CompCode}/${pFromDate}/${pToDate}/${pPaymentNo}`
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

export function getPaymentDtlData(CompCode, pPaymentId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`payment-master/getPaymentDtlData/${CompCode}/${pPaymentId}`)
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
