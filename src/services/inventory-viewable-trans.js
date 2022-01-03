import axios from "../axios";

export function getRPTSale(CompCode, pVoucherId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`html-reports/getRPTSales`, {
          VoucherId: pVoucherId,
          OutputType: "json",
          CompCode,
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getRPTPurchase(CompCode, pVoucherId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`html-reports/getRPTPurchase`, {
          VoucherId: pVoucherId,
          OutputType: "json",
          CompCode,
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getRPTDataAdjustment(CompCode, pVoucherId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`html-reports/getRPTDataAdjustment`, {
          VoucherId: pVoucherId,
          OutputType: "json",
          CompCode,
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getDataRPTReprocessing(CompCode, pVoucherId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`html-reports/getDataRPTReprocessing`, {
          VoucherId: pVoucherId,
          OutputType: "json",
          CompCode,
        })
        .then((res) => {
          resolve(res.data.data);
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
        .post("html-reports/getReceiptsAndPaymentSlip", {
          TranType: pTranType,
          TranId: pTranId,
          OutputType: OutputType,
          CompCode,
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getReportServiceInvoice(CompCode, pInvoiceId, pOutputType) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("html-reports/getReportServiceInvoice", {
          InvoiceId: pInvoiceId,
          OutputType: pOutputType,
          CompCode,
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getRPTSalesReturn(CompCode, pInvoiceId, pOutputType) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("html-reports/getRPTSalesReturn", {
          VoucherId: pInvoiceId,
          OutputType: "json",
          CompCode,
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

// getRPTSalesReturn

export function getRPTSalesOrder(CompCode, pVoucherId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`html-reports/getRPTSalesOrder`, {
          VoucherId: pVoucherId,
          OutputType: "json",
          CompCode,
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
}
