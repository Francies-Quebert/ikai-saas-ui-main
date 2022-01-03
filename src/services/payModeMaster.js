import axios from "../axios";

export const fetchPaymodeMaster = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`paymode-master/getPayModeMaster/${CompCode}`, null)
        .then(async (res) => {
          const resData = res.data.data;
          const payMode = [];
          await resData.forEach((row) => {
            payMode.push({ ...row, IsActive: row.IsActive.data[0] });
          });
          resolve(payMode);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const InsUpdtPayModeMaster = (CompCode, data) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("payModeMaster/InsUpdtPayModeMaster", {
          data: { ...data, CompCode: CompCode },
        })
        .then(async (res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from InsUpdtPayModeMaster", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from InsUpdtPayModeMaster", e);
      reject(e);
    }
  });
};

export const InsUpdtPaymentModeMaster = (CompCode, data) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("paymode-master/InsUpdtPaymentModeMaster", {
          data: { ...data, CompCode: CompCode },
        })
        .then(async (res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from InsUpdtPaymentModeMaster", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from InsUpdtPaymentModeMaster", e);
      reject(e);
    }
  });
};

export const fetchDataCashBankSummary = (
  CompCode,
  pAsOfDate
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `paymode-master/getDataCashBankSummary/${CompCode}/${pAsOfDate}`
        )
        .then(async (res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};


//Created by Hari/Savrav/Goving/Sailee on 2021-03-02
export const fetchDataBankWalletGatewayBook = (
  CompCode,
  pPayCode,
  pAsOfDate
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `paymode-master/getDataBankWalletGatewayBook/${CompCode}/${pPayCode}/${pAsOfDate}`
        )
        .then(async (res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

//getDataBankWalletGatewayBookDetail
//Created by Hari/Savrav/Goving/Sailee on 2021-03-02
export const fetchDataBankWalletGatewayBookDetail = (
  CompCode,
  pPayCode,
  pFromDate,
  pToDate
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `paymode-master/getDataBankWalletGatewayBookDetail/${CompCode}/${pPayCode}/${pFromDate}/${pToDate}`
        )
        .then(async (res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const fetchDataCashBankTransferPayModes = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`paymode-master/getDataCashBankTransferPayModes/${CompCode}`)
        .then(async (res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const InsUpdtCashBankTransferOrAdjustments = (CompCode, data) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`paymode-master/InsUpdtCashBankTransferOrAdjustments`, {
          data: { ...data, CompCode: CompCode },
        })
        .then(async (res) => {
          const resData = res.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const fetchDataChequeSettlement = (CompCode, pFromDate, pToDate) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `paymode-master/getDataChequeSettlement/${CompCode}/${pFromDate}/${pToDate}`
        )
        .then(async (res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const updtCheque_Deposit_Witdraw_ReOpen = (CompCode, data) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`paymode-master/updtCheque_Deposit_Witdraw_ReOpen`, {
          data: { ...data, CompCode: CompCode },
        })
        .then(async (res) => {
          const resData = res.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const DeleteCashBankTransferOrAdjustments = (CompCode, TranId) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`paymode-master/DeleteCashBankTransferOrAdjustments`, {
          data: { CompCode: CompCode, TranId: TranId },
        })
        .then(async (res) => {
          const resData = res.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};
