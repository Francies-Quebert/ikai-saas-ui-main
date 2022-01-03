import axios from "../axios";

export const razorPayReqGenerate = (
  CompCode,
  pPaymentTypeCode,
  pAmount,
  pRefernceNo
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("payment-gateway/razorPayReqGenerate", {
          PaymentTypeCode: pPaymentTypeCode,
          Amount: pAmount,
          RefernceNo: pRefernceNo,
          CompCode: CompCode,
        })
        .then(async (res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from razorPayReqGenerate", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from razorPayReqGenerate", e);
      reject(e);
    }
  });
};
//updtOnlinePaymentRequestResponse

export const updtOnlinePaymentRequestResponse = (
  CompCode,
  RequestId,
  ResponseOption1,
  ResponseOption2,
  ResponseOption3,
  ResponseOption4,
  ResponseOption5,
  RequestStatus,
  UpdtUsr
) => {
  return new Promise(function (resolve, reject) {
    try {
      let data = {
        RequestId,
        ResponseOption1,
        ResponseOption2,
        ResponseOption3,
        ResponseOption4,
        ResponseOption5,
        RequestStatus,
        UpdtUsr,
        CompCode,
      };
      axios
        .post("payment-gateway/updtOnlinePaymentRequestResponse", {
          data,
        })
        .then(async (res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from updtOnlinePaymentRequestResponse", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from updtOnlinePaymentRequestResponse", e);
      reject(e);
    }
  });
};

export const getDataOnlinePaymentRequest = (CompCode, pPaymentRequestId) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `payment-gateway/GetOnlinePaymentRequest/${CompCode}/${pPaymentRequestId}`
        )
        .then(async (res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from GetOnlinePaymentRequest", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from GetOnlinePaymentRequest", e);
      reject(e);
    }
  });
};

//GetPaymentGatewayOptionsAndConfig
export const getPaymentGatewayOptionsAndConfig = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`payment-gateway/GetPaymentGatewayOptionsAndConfig/${CompCode}`)
        .then(async (res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from GetPaymentGatewayOptionsAndConfig", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from GetPaymentGatewayOptionsAndConfig", e);
      reject(e);
    }
  });
};

export const serviceBookingPaymentSuccess = (
  CompCode,
  orderId,
  paymentRequestId,
  UpdtUserId
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`payment-gateway/serviceBookingPaymentSuccess`, {
          orderId,
          paymentRequestId,
          UpdtUserId,
          CompCode,
        })
        .then(async (res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from GetOnlinePaymentRequest", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from GetOnlinePaymentRequest", e);
      reject(e);
    }
  });
};
