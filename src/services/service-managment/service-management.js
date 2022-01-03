import axios from "../../axios";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../../store/actions/currentTran";

import { useDispatch, useSelector } from "react-redux";
export function getServiceOrders(pCompCode, pFromDate, pToDate, pUserId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `orderportal/getDataServiceOrders/${pCompCode}/${pFromDate}/${pToDate}/${pUserId}`
        )
        .then((res) => {
          const resData = res.data.data;
          let ggg = [];
          for (const key in resData) {
            ggg.push({ ...resData[key], key });
          }
          resolve(ggg);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getServiceSchedules(
  pCompCode,
  pFromDate,
  pToDate,
  pOrderId,
  pUserId
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `orderportal/getDataServiceSchedules/${pCompCode}/${pFromDate}/${pToDate}/${pOrderId}/${pUserId}`
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

export function getServiceSchedulesVisit(pCompCode, pScheduleId, pOrderId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `orderportal/getDataServiceSchedulesVisit/${pCompCode}/${pScheduleId}/${pOrderId}`
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

export function getServiceSchedulesAddonCost(pCompCode, pScheduleId, pOrderId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `orderportal/getDataServiceSchedulesAddonCost/${pCompCode}/${pScheduleId}/${pOrderId}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key], key, isDeleted: false });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const InsUpdateScheduleAddOnCostOrder = (pData) => {
  return async (dispatch, getState) => {
    dispatch({
      type: TRAN_START,
      tranType: "ScheduleAddOnCost",
    });
    const pCompCode = getState().LoginReducer.CompCode;
    const UpdtUsr = getState().LoginReducer.userData.username;
    try {
      for (const key in pData) {
        const data = {
          Data: pData[key],
          UpdtUsr: UpdtUsr,
          CompCode: pCompCode,
        };
        const res = await axios.post(
          "orderportal/InsUpdtOrderScheduleAddOnCost",
          { data }
        );
      }
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "ScheduleAddOnCost",
        // data: data,
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "ScheduleAddOnCost",
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export function getServiceOrderDetail(pCompCode, pOrderId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`orderportal/getServiceOrder/${pCompCode}/${pOrderId}`)
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key], key, CompCode: pCompCode });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const InsOrderSchedule = (pData) => {
  return async (dispatch, getState) => {
    dispatch({
      type: TRAN_START,
      tranType: "InsOrderSchedule",
    });
    const pCompCode = getState().LoginReducer.CompCode;
    const UpdtUsr = getState().LoginReducer.userData.username;
    for (const key in pData) {
      try {
        const data = {
          OrderId: pData[key].OrderId,
          ScheduleDate: pData[key].ScheduleDate,
          Slot: pData[key].SlotId,
          CompCode: pCompCode,
          UpdtUsr: UpdtUsr,
        };
        const res = await axios.post("orderportal/InsOrderSchedule", { data });
        dispatch({
          type: TRAN_SUCCESS,
          tranType: "InsOrderSchedule",
        });
      } catch (ex) {
        dispatch({
          type: TRAN_FAIL,
          tranType: "InsOrderSchedule",
          error: "Network error !! Check your internet connection",
        });
      }
    }
  };
};

export const CancelSchedule = (pOrderId) => {
  return async (dispatch, getState) => {
    dispatch({
      type: TRAN_START,
      tranType: "cancelSchedulePortal",
    });
    const UpdtUsr = getState().LoginReducer.userData.username;
    const pCompCode = getState().LoginReducer.CompCode;
    try {
      const data = {
        OrderId: pOrderId,
        UpdtUsr: UpdtUsr,
        CompCode: pCompCode,
      };
      const res = await axios.post("orderportal/cancelSchedule", {
        data,
      });
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "cancelSchedulePortal",
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "cancelSchedulePortal",
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export function SaveInvoice(pCompCode, pInvoiceHdr, pInvoiceDtl) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {
        invoiceHdr: pInvoiceHdr,
        invoiceDtl: pInvoiceDtl,
        CompCode: pCompCode,
      };
      axios
        .post("orderportal/saveServiceInvoice", {
          data,
        })
        .then((res) => {
          // const resData = res.data.data;
          // let data = [];
          // console.log("res from api", resData);
          // for (const key in resData) {
          //   data.push({ ...resData[key], key });
          // }
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getPreInvoiceDataService(pCompCode, pOrderId, pScheduleId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `orderportal/GetPreInvoiceDataService/${pCompCode}/${pOrderId}/${pScheduleId}`
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

export function getInvoicePdf(pCompCode, printData, pInvoiceId, OutputType) {
  return new Promise(function (resolve, reject) {
    try {
      if (printData) {
        const data = {};
        axios
          .post(
            "html-reports/getReportServiceInvoice",
            { CompCode: pCompCode, InvoiceId: pInvoiceId, OutputType },
            {
              responseType: "arraybuffer",
              headers: {
                Accept: "application/pdf",
              },
            }
          )
          .then((res) => {
            // const resData = res.data.data;
            // let data = [];
            // console.log("res from api", resData);
            // for (const key in resData) {
            //   data.push({ ...resData[key], key });
            // }
            // console.log("invoice", res);
            resolve(res);
          });
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
}

export function AcknowledeSchedule(data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("orderportal/serviceScheduleAcknowledge", {
          data,
        })
        .then((res) => {
          // const resData = res.data.data;
          // let data = [];
          // console.log("res from api", resData);
          // for (const key in resData) {
          //   data.push({ ...resData[key], key });
          // }
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getKotPdf(pCompCode, printData, pKotId, OutputType) {
  return new Promise(function (resolve, reject) {
    try {
      if (printData) {
        const data = {};
        axios
          .post(
            "html-reports/getReportServiceKOT",
            {
              CompCode: pCompCode,
              KotId: pKotId,
              OutputType,
            },
            {
              responseType: "arraybuffer",
              headers: {
                Accept: "application/pdf",
              },
            }
          )
          .then((res) => {
            // const resData = res.data.data;
            // let data = [];
            // console.log("res from api", resData);
            // for (const key in resData) {
            //   data.push({ ...resData[key], key });
            // }
            // console.log("invoice", res);
            resolve(res);
          });
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
}
