import axios from "../axios";

export function fetchDataDayBookDetails(CompCode, pFromDate, pToDate) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `payment-master/getDataDayBookDetails/${CompCode}/${pFromDate}/${pToDate}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              key: resData[key].TranId,
              ...resData[key],
            });
          }

          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchDataCashBookDetails(CompCode, pFromDate, pToDate) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `payment-master/getDataCashBookDetails/${CompCode}/${pFromDate}/${pToDate}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              key: resData[key].TranId,
              ...resData[key],
            });
          }

          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getDayBookPdf(CompCode, pFromDate, pToDate, OutputType) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {};
      axios
        .post(
          "html-reports/getDayBookReport",
          {
            CompCode,
            FromDate: pFromDate,
            ToDate: pToDate,
            OutputType: OutputType,
          },
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "application/pdf",
            },
          }
        )
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getCashBookPdf(CompCode, pFromDate, pToDate, OutputType) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {};
      axios
        .post(
          "html-reports/getCashBookReport",
          {
            CompCode,
            FromDate: pFromDate,
            ToDate: pToDate,
            OutputType: OutputType,
          },
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "application/pdf",
            },
          }
        )
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}
