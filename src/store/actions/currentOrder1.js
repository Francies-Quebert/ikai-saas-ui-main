import axios from "../../axios";
import moment from "moment";
export const SET_SELCECTED_PATIENT = "SET_SELCECTED_PATIENT";
export const SET_SELCECTED_ADDRESS = "SET_SELCECTED_ADDRESS";
export const SET_SELCECTED_SERVICE = "SET_SELCECTED_SERVICE";
export const SET_SELCECTED_PACKAGE = "SET_SELCECTED_PACKAGE";
export const SET_SELCECTED_SCHEDULE = "SET_SELCECTED_SCHEDULE";
export const SET_SELCECTED_PAYMENT_MODE = "SET_SELCECTED_PAYMENT_MODE";

export const REINITIALIZE = "REINITIALIZE";
export const SAVE_ORDER_START = "SAVE_ORDER_START";
export const SAVE_ORDER_FAIL = "SAVE_ORDER_FAIL";
export const SAVE_ORDER_SUCCESS = "SAVE_ORDER_SUCCESS";

export const UPDATE_API_PAYMENT_ENTRY_START = "UPDATE_API_PAYMENT_ENTRY_START";
export const UPDATE_API_PAYMENT_ENTRY_FAIL = "UPDATE_API_PAYMENT_ENTRY_FAIL";
export const UPDATE_API_PAYMENT_ENTRY_SUCCESS =
  "UPDATE_API_PAYMENT_ENTRY_SUCCESS";

export const updateAPIPaymentEntry = (pAPIPaymentId) => {
  return async (dispatch, getState) => {
    dispatch({ type: UPDATE_API_PAYMENT_ENTRY_START });
    try {
      const UserId = getState().login.userId;
      const orderNo = getState().currentOrder.orderNo;
      const apiOrderNo = getState().currentOrder.paymentRes.id;
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      let res = null;
      res = await axios.post(
        "orders/updtPaymentEntry",
        {
          CompCode: CompCode,
          OrderId: orderNo,
          API_OrderId: apiOrderNo,
          API_PaymentId: pAPIPaymentId,
          userId: UserId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // if (res.status !== 200) {
      //   dispatch({
      //     type: UPDATE_API_PAYMENT_ENTRY_FAIL,
      //     error: "Something went wrong!!"
      //   });
      // }

      dispatch({
        type: UPDATE_API_PAYMENT_ENTRY_SUCCESS,
        apiPaymentId: pAPIPaymentId,
      });
    } catch (ex) {
      dispatch({
        type: UPDATE_API_PAYMENT_ENTRY_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const saveOrder = (
  pPatientInfo,
  pPatientAddress,
  pService,
  pPackage,
  pSchedule,
  pPaymentMode
) => {
  return async (dispatch, getState) => {
    dispatch({ type: SAVE_ORDER_START });
    try {
      const UserType = getState().login.userType;
      const UserId = getState().login.userId;
      const CompCode = getState().LoginReducer.CompCode;
      let l_GrossTotal = pService.actualrate * pPackage.unit;
      const data = {
        order: {
          CompCode: CompCode,
          OrderDate: moment().format("YYYY-MM-DD"),
          LocationId: 1,
          InvoiceNo: null,
          InvoiceDate: null,
          OrderStatus: "BKD",
          PatientId: pPatientInfo.profileId,
          AddressId: pPatientAddress.addressId,
          AssignedNurseId: null,
          OrderedUserType: UserType,
          OrderedUserId: UserId,
          GrossTotal: l_GrossTotal,
          disc: l_GrossTotal - pPackage.amount,
          RoundOff: 0,
          NetPayable: pPackage.amount,
          ScheduledFrom:
            pSchedule.fromDate !== null
              ? moment(pSchedule.fromDate).format("YYYY-MM-DD")
              : null,
          ScheduledTo:
            pSchedule.toDate !== null
              ? moment(pSchedule.toDate).format("YYYY-MM-DD")
              : null,
          OrderedUserId: UserId,
          SlotId: pSchedule.slotId,
        },
        orderDtl: [
          {
            CompCode: CompCode,
            SrNo: 1,
            ServiceId: pService.serviceId,
            ServiceTitle: pService.serviceTitle,
            ServiceType: pService.serviceType,
            PackageId: pPackage.packeProfile.packageId,
            rate: pService.actualrate,
            unit: pPackage.unit,
            unitDesc: pPackage.packeProfile.packageUnitDesc,
            amount: pService.actualrate * pPackage.unit,
            discVal: l_GrossTotal - pPackage.amount,
            netValue: pPackage.amount,
          },
        ],
      };
      const token = getState().LoginReducer.token;
      //console.log("while api call", data);
      const res = await axios.post("orders/createOrder", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 200) {
      //   dispatch({
      //     type: SAVE_ORDER_FAIL,
      //     error: "Something went wrong!!"
      //   });
      // }

      let resPaymentId = null;
      let amt = null;
      // console.log('saveorder',res.data.data, pPaymentMode)
      if (pPaymentMode === "P") {
        resPayment = await axios.post(
          "orders/createRazonPaymentId",
          {
            CompCode: CompCode,
            amount: pPackage.amount.toFixed(2),
            orderId: res.data.data + "",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // if (resPayment.status !== 200) {
        //   dispatch({
        //     type: SAVE_ORDER_FAIL,
        //     error: "On Payment : Something went wrong!!"
        //   });
        // }
        // console.log('payment res',resPayment)
        resPaymentId = resPayment.data.data.id;
        amt = resPayment.data.data.amount;
        let resPaymentSave = null;
        resPaymentSave = await axios.post("orders/insPaymentEntry", {
          CompCode: CompCode,
          OrderId: res.data.data,
          PaymentDate: moment().format("YYYY-MM-DD"),
          API_OrderId: resPayment.data.data.id,
          API_PaymentId: null,
          Amount: pPackage.amount.toFixed(2),
          userId: UserId,
        });

        // if (resPaymentSave.status !== 200) {
        //   dispatch({
        //     type: SAVE_ORDER_FAIL,
        //     error: "On Payment Save : Something went wrong!!"
        //   });
        // }
      }

      // console.log('retu',resData);
      dispatch({
        type: SAVE_ORDER_SUCCESS,
        result: res.data,
        paymentRes: { id: resPaymentId, amount: amt },
      });
    } catch (err) {
      console.error("Error on api call", err);
      dispatch({
        type: SAVE_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const reinitialize = (pPatientProfile) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: REINITIALIZE,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const setPaymentMode = (pPaymentMode) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_PAYMENT_MODE,
        paymentMode: pPaymentMode,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const setSelectedPatient = (pPatientProfile) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_PATIENT,
        patientProfile: pPatientProfile,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const setSelectedAddress = (pPatientAddress) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_ADDRESS,
        patientAddress: pPatientAddress,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const setSelectedService = (pServiceProfile) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_SERVICE,
        serviceProfile: pServiceProfile,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const setSelectedSchedule = (pFromDate, pToDate, pSlotId, pSlotDesc) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_SCHEDULE,
        schedule: {
          fromDate: pFromDate,
          toDate: pToDate,
          slotId: pSlotId,
          slotDesc: pSlotDesc,
        },
      });
    } catch (err) {
      throw err;
    }
  };
};

export const setServicePackage = (
  pSelectedPackage,
  pUnit,
  pRate,
  pAmount,
  pTotalDisc
) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_PACKAGE,
        package: {
          packeProfile: pSelectedPackage,
          unit: pUnit,
          rate: pRate,
          amount: pAmount,
          totalDisc: pTotalDisc,
        },
      });
    } catch (err) {
      throw err;
    }
  };
};
