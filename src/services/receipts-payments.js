import axios from "../axios";

export function fetchReceiptAndPayments(
  CompCode,
  pTranType,
  pFromDate,
  pToDate
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `payment-master/getReceiptAndPayments/${CompCode}/${pTranType}/${pFromDate}/${pToDate}`
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

export function fetchReceiptAndPaymentsWithDetails(
  CompCode,
  pTranType,
  pTranId
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `payment-master/getReceiptAndPaymentsWithDetails/${CompCode}/${pTranType}/${pTranId}`
        )
        .then((res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchReceiptAndPaymentReferenceHelp(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`payment-master/getReceiptAndPaymentReferenceHelp/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function saveInsReceiptAndPayments(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`payment-master/saveInsReceiptAndPayment`, {
          data: { ...data, CompCode },
        })
        .then((res) => {
          const resData = res.data;
          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function deleteReceiptAndPayments(CompCode, pTranType, pTranId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`payment-master/deleteReceiptAndPayment`, {
          TranType: pTranType,
          TranId: pTranId,
          CompCode: CompCode,
        })
        .then((res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchPayModeMaster(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`paymode-master/getPayModeMaster/${CompCode}`).then((res) => {
        const resData = res.data.data;
        resolve(resData);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function getReceiptAndPaymentPdf(
  CompCode,
  pTranType,
  pTranId,
  OutputType
) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {};
      axios
        .post(
          "html-reports/getReceiptsAndPaymentSlip",
          {
            TranType: pTranType,
            TranId: pTranId,
            OutputType: OutputType,
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

export function getTransferPdf(CompCode, pTranType, pTranId, OutputType) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {};
      axios
        .post(
          "html-reports/getTransferSlip",
          {
            TranType: pTranType,
            TranId: pTranId,
            OutputType: OutputType,
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

export function getBankandCashBookStatementPdf(
  CompCode,
  pPayCode,
  pFromDate,
  pToDate,
  OutputType
) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {};
      axios
        .post(
          "html-reports/getBankWalletGatewayBookRegister",
          {
            PayCode: pPayCode,
            FromDate: pFromDate,
            ToDate: pToDate,
            OutputType: OutputType,
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
