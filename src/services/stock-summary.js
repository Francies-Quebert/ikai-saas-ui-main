import axios from "../axios";

export function fetchInvGetDataStockValuationSummary(pCompCode, pBranchCode,pAsOfDate) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/invGetDataStockValuationSummary/${pCompCode}/${pBranchCode}/${pAsOfDate}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key], key, AddInfo: null });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchInvGetDataStockValuationDetail(
  pCompCode,
  pBranchCode,
  pItemCode,
  pAsOfDate
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/invGetDataStockValuationDetail/${pCompCode}/${pBranchCode}/${pItemCode}/${pAsOfDate}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key] });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getStockSummaryPurchasePdf(CompCode, pTranId, pOutputType) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {};
      axios
        .post(
          "html-reports/getRPTPurchase",
          {
            VoucherId: pTranId,
            OutputType: pOutputType,
            CompCode: CompCode,
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

export function getStockSummarySalesPdf(CompCode, pTranId, pOutputType) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {};
      axios
        .post(
          "html-reports/getRPTSales",
          {
            VoucherId: pTranId,
            OutputType: pOutputType,
            CompCode: CompCode,
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

// export function getStockSummaryPurchasePdf(pTranId, pOutputType) {
//   return new Promise(function (resolve, reject) {
//     try {
//       const data = {};
//       axios
//         .post(
//           "html-reports/getRPTPurchase",
//           {
//             VoucherId: pTranId,
//             OutputType: pOutputType,
//           },
//           {
//             responseType: "arraybuffer",
//             headers: {
//               Accept: "application/pdf",
//             },
//           }
//         )
//         .then((res) => {
//           resolve(res);
//         });
//     } catch (e) {
//       reject(e);
//     }
//   });
// }
