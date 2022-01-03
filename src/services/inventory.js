import axios from "../axios";

export function InsOpeningStock(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invSaveOpeningStock", {
          data: data,
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InvDeleteOpeningStock(data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invDeleteOpeningStock", {
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

export function InvUpdateOpeningStock(data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invUpdateOpeningStock", {
          data: data,
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}
export const InvGetTransactionTypes = (CompCode, TranType) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`inventory/invGetTransactionTypes/${CompCode}/${TranType}`)
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};
export const InvGetItemBalanceStockDistinctByPrices = (
  CompCode,
  BranchCode,
  ItemCode
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/invGetItemBalanceStockDistinctByPrices/${CompCode}/${BranchCode}/${ItemCode}`
        )
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const InvGetItemBalanceStockDistinctByInwardSeq = (
  CompCode,
  BranchCode,
  ItemCode
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/invGetItemBalanceStockDistinctByInwardSeq/${CompCode}/${BranchCode}/${ItemCode}`
        )
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const InvSaveSaleInvoice = (
  CompCode,
  SaleInvoiceHdr,
  SaleInvoiceDtl,
  AddIncomeExpensesDtl
) => {
  return new Promise(function (resolve, reject) {
    try {
      const data = {
        SaleInvoiceHdr,
        SaleInvoiceDtl,
        AddIncomeExpensesDtl,
        CompCode,
      };
      axios.post(`inventory/invSaveSaleInvoice`, { data }).then((res) => {
        resolve(res.data.data);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const invGetAllInwardSeqInfo = (pCompCode, pBranchCode, pItemCode) => {
  return new Promise(async function (resolve, reject) {
    try {
      let res = await axios.get(
        `inventory/invGetAllInwardSeqInfo/${pCompCode}/${pBranchCode}/${pItemCode}`
      );
      if (res) {
        resolve(res.data.data);
      }
    } catch (e) {
      reject(e);
    }
  });
};

export function InvSaveAdjustments(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invSaveAdjustments", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function invSavePurchaseInvoice(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invSavePurchaseInvoice", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const InvGetDataMKStockOut = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`inventory/invGetDataMKStockOut/${CompCode}`).then((res) => {
        resolve(res.data.data);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const InvGenerateInvoiceMKStockOut = (CompCode, data) => {
  return new Promise(async function (resolve, reject) {
    try {
      await axios
        .post(`inventory/invGenerateInvoiceStockOutDtlMK`, {
          data: { StockOutDtlMK: data, CompCode },
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const invGetDataINVAllTranDocView = (
  CompCode,
  pTranType,
  pFromDate,
  pToDate,
  pRefCode,
  pCurrentUserName
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/invGetDataINVAllTranDocView/${CompCode}/${pTranType}/${pFromDate}/${pToDate}/${pRefCode}/${pCurrentUserName}`
        )
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

export const getSalesReport = (CompCode, pVoucherId, pOutputType) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "html-reports/getRPTSales",
          {
            VoucherId: pVoucherId,
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
};

export const invUpdateStockOutDtlMK = (CompCode, data) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`inventory/invUpdateStockOutDtlMK`, {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const getPurchaseReport = (CompCode, pVoucherId, pOutputType) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "html-reports/getRPTPur",
          {
            VoucherId: pVoucherId,
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
};

export const getReportDataAdjustment = (CompCode, pVoucherId, pOutputType) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "html-reports/getRPTDataAdjustment",
          { VoucherId: pVoucherId, OutputType: pOutputType, CompCode },
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
};

export const getReportDataReprocessing = (
  CompCode,
  pVoucherId,
  pOutputType
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "html-reports/getDataRPTReprocessing",
          {
            VoucherId: pVoucherId,
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
};

export const getReasonsMasterData = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`other-master/getReasonsMaster/${CompCode}`).then((res) => {
        resolve(res.data.data);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const invUpdateStockOutDtlMKArchive = (CompCode, data) => {
  return new Promise(async function (resolve, reject) {
    try {
      await axios
        .post(`inventory/invUpdateStockOutDtlMKArchive`, {
          data: { StockOutDtlMK: data, CompCode: CompCode },
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

// invSaveUpdatePurchaseInvoice
export function invSaveUpdatePurchaseInvoice(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invSaveUpdatePurchaseInvoice", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

// invGetDataTranPurchase
export const invGetDataTranPurchase = (CompCode, pVoucherId) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`inventory/invGetDataTranPurchase/${CompCode}/${pVoucherId}`)
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const invGetDataTranAdjustement = (CompCode, pVoucherId) => {
  return new Promise(async function (resolve, reject) {
    try {
      let res = await axios.get(
        `inventory/invGetDataTranAdjustement/${CompCode}/${pVoucherId}`
      );
      if (res) {
        resolve(res.data.data);
      }
    } catch (e) {
      reject(e);
    }
  });
};

export function invSaveUpdateAdjustments(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invSaveUpdateAdjustments", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

// invSavePurchaseReturnInvoice
export function invSavePurchaseReturnInvoice(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invSavePurchaseReturnInvoice", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function invSaveSaleReturnInvoice(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("inventory/invSaveSaleReturnInvoice", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
}
// govind 08/03/2021
export function invDeleteAdjustment(CompCode, pVoucherId, pUpdtUsr) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "inventory/invDeleteAdjustment",
          { VoucherId: pVoucherId, UpdtUsr: pUpdtUsr, CompCode: CompCode },
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
// govind 08/03/21
export function invDeletePurchaseInvoice(CompCode, pVoucherId, pUpdtUsr) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "inventory/invDeletePurchaseInvoice",
          { VoucherId: pVoucherId, UpdUser: pUpdtUsr, CompCode: CompCode },
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

export function getReportServiceInvoice(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("html-reports/getReportServiceInvoice", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function invValidateBoxNoAdjustment(CompCode, BoxNo) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`inventory/invValidateBoxNoAdjustment/${CompCode}/${BoxNo}`, {})
        .then((res) => {
          resolve(res.data.data[0]);
        })
        .catch((err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}

export function getInvoiceTranData(CompCode, InvoiceId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`inventory/getInvoiceTranData/${CompCode}/${InvoiceId}`, {})
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}

export function deleteServiceInvoice(CompCode, InvoiceId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`inventory/deleteServiceInvoice`, { InvoiceId, CompCode })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}

export function modifyServiceInvoice(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`inventory/modifyServiceInvoice`, { data: { ...data, CompCode } })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}

export function getGenericInvoicePdf(CompCode, pInvoiceId, OutputType) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {};
      axios
        .post(
          "html-reports/getReportServiceInvoice",
          {
            InvoiceId: pInvoiceId,
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

export function getSalesVoucherData(CompCode, VoucherId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`inventory/invGetSalesVoucherData/${CompCode}/${VoucherId}`, {})
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}

export function validateSalesVoucher(CompCode, Branch, Depart, VoucherNo) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/validateSalesVoucher/${CompCode}/${Branch}/${Depart}/${VoucherNo}/`,
          {}
        )
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}

export const getSalesReturnReport = (CompCode, pVoucherId, pOutputType) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "html-reports/getRPTSalesReturn",
          {
            VoucherId: pVoucherId,
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
};

// invSaveSaleOrderInvoice
export const invSaveSaleOrderInvoice = (
  CompCode,
  SaleOrderInvoiceHdr,
  SaleOrderInvoiceDtl,
  AddIncomeExpensesDtl
) => {
  return new Promise(function (resolve, reject) {
    try {
      const data = {
        SaleOrderInvoiceHdr,
        SaleOrderInvoiceDtl,
        AddIncomeExpensesDtl,
        CompCode,
      };
      axios.post(`inventory/invSaveSaleOrderInvoice`, { data }).then((res) => {
        resolve(res.data.data);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const getSalesOrderReport = (CompCode, pVoucherId, pOutputType) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "html-reports/getRPTSalesOrder",
          {
            VoucherId: pVoucherId,
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
};

export const invGetDataItemRates = (CompCode, BranchCode, ItemCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/invGetDataItemRates/${CompCode}/${BranchCode}/${ItemCode}`
        )
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export function invDeletSalesInvoice(CompCode, pVoucherId, pUpdtUsr) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(
          "inventory/invDeleteSalesInvoice",
          { VoucherId: pVoucherId, UpdUser: pUpdtUsr, CompCode: CompCode },
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
