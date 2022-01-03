import axios from "../../axios";
import Orders from "../../models/orders";
import OrderDetails from "../../models/order-details";
import OrderCheckIn from "../../models/OrderCheckIn";
import OrderCheckOut from "../../models/OrderCheckOut";
import OrderAddOnCost from "../../models/OrderAddOnCost";

import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

export const SET_SELCECTED_ADDONCOST = "SET_SELCECTED_ADDONCOST";

export const FETCH_ORDERS_START = "FETCH_ORDERS_START";
export const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS";
export const FETCH_ORDERS_FAIL = "FETCH_ORDERS_FAIL";

//Hari on 20191230
export const FETCH_ORDERDETAILS_START = "FETCH_ORDERDETAILS_START";
export const FETCH_ORDERDETAILS_SUCCESS = "FETCH_ORDERDETAILS_SUCCESS";
export const FETCH_ORDERDETAILS_FAIL = "FETCH_ORDERDETAILS_FAIL";
//END 20191230

//Hari on 20191230
export const CANCEL_ORDER_START = "CANCEL_ORDER_START";
export const CANCEL_ORDER_SUCCESS = "CANCEL_ORDER_SUCCESS";
export const CANCEL_ORDER_FAIL = "CANCEL_ORDER_FAIL";
//END 20191230

//Atul on 20200125
export const RESCHEDULE_ORDER_START = "RESCHEDULE_ORDER_START";
export const RESCHEDULE_ORDER_SUCCESS = "RESCHEDULE_ORDER_SUCCESS";
export const RESCHEDULE_ORDER_FAIL = "RESCHEDULE_ORDER_FAIL";
//Atul End 20200125
// Franceis 20200318
export const FETCH_CHECKIN_ORDER_START = "FETCH_CHECKIN_ORDER_START";
export const FETCH_CHECKIN_ORDER_SUCCESS = "FETCH_CHECKIN_ORDER_SUCCESS";
export const FETCH_CHECKIN_ORDER_FAIL = "FETCH_CHECKIN_ORDER_FAIL";

export const FETCH_CHECKOUT_ORDER_START = "FETCH_CHECKOUT_ORDER_START";
export const FETCH_CHECKOUT_ORDER_SUCCESS = "FETCH_CHECKOUT_ORDER_SUCCESS";
export const FETCH_CHECKOUT_ORDER_FAIL = "FETCH_CHECKOUT_ORDER_FAIL";

export const FETCH_ADDON_COST_ORDER_START = "FETCH_ADDON_COST_ORDER_START";
export const FETCH_ADDON_COST_ORDER_SUCCESS = "FETCH_ADDON_COST_ORDER_SUCCESS";
export const FETCH_ADDON_COST_ORDER_FAIL = "FETCH_ADDON_COST_ORDER_FAIL";

export const SET_CHECKIN_ORDER_START = "SET_CHECKIN_ORDER_START";
export const SET_CHECKIN_ORDER_SUCCESS = "SET_CHECKIN_ORDER_SUCCESS";
export const SET_CHECKIN_ORDER_FAIL = "SET_CHECKIN_ORDER_FAIL";

export const SET_CHECKOUT_ORDER_START = "SET_CHECKOUT_ORDER_START";
export const SET_CHECKOUT_ORDER_SUCCESS = "SET_CHECKOUT_ORDER_SUCCESS";
export const SET_CHECKOUT_ORDER_FAIL = "SET_CHECKOUT_ORDER_FAIL";

export const SET_ADDON_COST_ORDER_START = "SET_ADDON_COST_ORDER_START";
export const SET_ADDON_COST_ORDER_SUCCESS = "SET_ADDON_COST_ORDER_SUCCESS";
export const SET_ADDON_COST_ORDER_FAIL = "SET_ADDON_COST_ORDER_FAIL";
// END

export const fetchCheckInOrder = (pScheduleId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_CHECKIN_ORDER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post(
        "orders/getDataScheduleCheckIn",
        { CompCode: CompCode, ScheduleId: pScheduleId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resData = res.data.data;
      const orderCheckIn = [];

      for (const key in resData) {
        orderCheckIn.push(
          new OrderCheckIn(
            resData[key].ScheduleId,
            resData[key].OrderId,
            resData[key].CheckInDTTM,
            resData[key].latitude,
            resData[key].longitude,
            resData[key].CheckInImage
          )
        );
      }
      // console.log(locations);
      dispatch({
        type: FETCH_CHECKIN_ORDER_SUCCESS,
        orderCheckIn: orderCheckIn,
      });
    } catch (err) {
      dispatch({
        type: FETCH_CHECKIN_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchCheckOutOrder = (pScheduleId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_CHECKOUT_ORDER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      // console.log(pScheduleId, "sdadasd");
      const res = await axios.post(
        "orders/getDataScheduleCheckOut",
        { CompCode: CompCode, ScheduleId: pScheduleId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resData = res.data.data;
      const orderCheckOut = [];

      for (const key in resData) {
        orderCheckOut.push(
          new OrderCheckOut(
            resData[key].ScheduleId,
            resData[key].OrderId,
            resData[key].CheckOutDTTM,
            resData[key].Observation,
            resData[key].Resolution,
            resData[key].CheckOutRemark
          )
        );
      }
      // console.log(locations);
      dispatch({
        type: FETCH_CHECKOUT_ORDER_SUCCESS,
        orderCheckOut: orderCheckOut,
      });
    } catch (err) {
      dispatch({
        type: FETCH_CHECKOUT_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchAddOnCostOrder = (pScheduleId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ADDON_COST_ORDER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post(
        "orders/getDataScheduleAddOnCost",
        { CompCode: CompCode, ScheduleId: pScheduleId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resData = res.data.data;
      let highestSrNo = 0;
      let total = 0.0;
      const orderAddOnCost = [];
      for (const key in resData) {
        orderAddOnCost.push(
          new OrderAddOnCost(
            resData[key].ScheduleId,
            resData[key].OrderId,
            resData[key].SrNo,
            resData[key].ItemDesc,
            parseFloat(resData[key].Rate)
          )
        );
        // console.log(parseFloat(resData[key].Rate));
        total = total + parseFloat(resData[key].Rate);
        if (resData[key].SrNo > highestSrNo) {
          highestSrNo = resData[key].SrNo;
        }
      }

      dispatch({
        type: FETCH_ADDON_COST_ORDER_SUCCESS,
        orderAddOnCost: orderAddOnCost,
        highestSrNo: highestSrNo + 1,
        total: total,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ADDON_COST_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ORDERS_START });
    try {
      const userType = getState().login.userType;
      const userId = getState().login.userId;
      const CompCode = getState().login.CompCode;

      const data = { CompCode: CompCode, userType: userType, userId: userId };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orders/getOrders", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 200) {
      //   console.log(res)
      //   dispatch({
      //     type: FETCH_ORDERS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const orders = [];

      for (const key in resData) {
        orders.push(
          new Orders(
            resData[key].orderId,
            resData[key].OrderDate,
            resData[key].OrderStatus,
            resData[key].OrderStatusCode,
            resData[key].PatientId,
            resData[key].AddressId,
            resData[key].GrossTotal,
            resData[key].disc,
            resData[key].RoundOff,
            resData[key].NetPayable,
            resData[key].ScheduledFrom,
            resData[key].ScheduledTo,
            resData[key].ServiceId,
            resData[key].ServiceTitle,
            resData[key].IsOnGoing,
            resData[key].message
          )
        );
      }
      // console.log(locations);
      dispatch({
        type: FETCH_ORDERS_SUCCESS,
        orders: orders,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ORDERS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const cancelOrder = (orderId) => {
  return async (dispatch, getState) => {
    dispatch({ type: CANCEL_ORDER_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        orderId: orderId,
        UpdtUserId: getState().login.userId,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orders/cancelOrder", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 200) {
      //   dispatch({
      //     type: CANCEL_ORDER_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      // console.log(locations);
      dispatch({
        type: CANCEL_ORDER_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: CANCEL_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const orderReSchedule = (orderId, fromDate, toDate, slotId) => {
  return async (dispatch, getState) => {
    dispatch({ type: RESCHEDULE_ORDER_START });
    try {
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        OrderId: orderId,
        ScheduleFromDate: fromDate,
        ScheduleToDate: toDate,
        SlotId: slotId,
        UpdtUserId: getState().LoginReducer.userData.userId,
      };
      // console.log("hello",data)
      const token = getState().LoginReducer.token;
      const res = await axios.post("orders/orderReSchedule", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: RESCHEDULE_ORDER_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: RESCHEDULE_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchOrderDetails = (orderId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ORDERDETAILS_START });
    try {
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        orderId: orderId,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orders/getOrderDetails", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 200) {
      //   dispatch({
      //     type: FETCH_ORDERDETAILS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const orderDetails = [];

      for (const key in resData) {
        orderDetails.push(
          new OrderDetails(
            resData[key].orderId,
            resData[key].OrderDate,
            resData[key].PatientId,
            resData[key].PatientName,
            resData[key].Relationship,
            resData[key].Gender,
            resData[key].Age,
            resData[key].Weight,
            resData[key].MedicalCondition,
            resData[key].knownLanguages,
            resData[key].DietPreference,
            resData[key].AddressId,
            resData[key].latitude,
            resData[key].longitude,
            resData[key].geoLocationName,
            resData[key].add1,
            resData[key].add2,
            resData[key].add3,
            resData[key].AddressTag,
            resData[key].ServiceId,
            resData[key].ServiceTitle,
            resData[key].ServiceType,
            resData[key].PackageId,
            +resData[key].itemRate,
            +resData[key].itemUnit,
            +resData[key].itemUnitDesc,
            +resData[key].itemAmount,
            +resData[key].itemDiscVal,
            +resData[key].itemNetValue,
            +resData[key].GrossTotal,
            +resData[key].disc,
            +resData[key].RoundOff,
            +resData[key].NetPayable,
            resData[key].ScheduledFrom,
            resData[key].ScheduledTo,
            resData[key].SlotId,
            resData[key].SlotName
          )
        );
      }
      // console.log(locations);
      dispatch({
        type: FETCH_ORDERDETAILS_SUCCESS,
        orderDetails: orderDetails,
      });
    } catch (err) {
      // Console.log(err)
      dispatch({
        type: FETCH_ORDERDETAILS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const InsUpdateCheckInOrder = (
  pScheduleId,
  pOrderId,
  pCheckInDTTM,
  checkInData
) => {
  return async (dispatch, getState) => {
    // dispatch({ type: SET_CHECKIN_ORDER_START });
    dispatch({ type: TRAN_START, tranType: "ScheduleCheckIn" });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        ScheduleId: pScheduleId,
        OrderId: pOrderId,
        CheckInDTTM: pCheckInDTTM,
        latitude: null,
        longitude: null,
        CheckInImage: null,
        UpdtUsr: UpdtUsr,
      };
      const res = await axios.post("orders/InsUpdtScheduleCheckIn", data);
      const resCheckIn = await axios.post("orders/setMarkCheckIn", {
        CompCode: getState().LoginReducer.CompCode,
        scheduleId: pScheduleId,
        markCheckIn: checkInData ? checkInData.markedCheckeddIn : false,
        updtUsrId: UpdtUsr,
      });
      // dispatch({
      //   type: SET_CHECKIN_ORDER_SUCCESS
      // });
      //   console.log(res.data.data[0]);

      // dispatch(fetchServiceTypes());
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "ScheduleCheckIn",
        data: data,
      });
    } catch (ex) {
      // dispatch({
      //   type: SET_CHECKIN_ORDER_FAIL,
      //   error: "Network error !! Check your internet connection"
      // });
      dispatch({
        type: TRAN_FAIL,
        tranType: "ScheduleCheckIn",
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const InsUpdateCheckOutOrder = (
  pScheduleId,
  pOrderId,
  pCheckOutDTTM,
  pObservation,
  pResolution,
  pCheckOutRemark,
  markedCheckeddOut
) => {
  return async (dispatch, getState) => {
    // dispatch({ type: SET_CHECKOUT_ORDER_START });
    dispatch({ type: TRAN_START, tranType: "ScheduleCheckOut" });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        ScheduleId: pScheduleId,
        OrderId: pOrderId,
        CheckOutDTTM: pCheckOutDTTM,
        Observation: pObservation,
        Resolution: pResolution,
        CheckOutRemark: pCheckOutRemark,
        UpdtUsr: UpdtUsr,
      };

      const res = await axios.post("orders/InsUpdtScheduleCheckOut", data);
      const resCheckIn = await axios.post("orders/setMarkCheckOut", {
        CompCode: getState().LoginReducer.CompCode,
        scheduleId: pScheduleId,
        markCheckOut: markedCheckeddOut,
        updtUsrId: UpdtUsr,
      });
      // dispatch({
      //   type: SET_CHECKOUT_ORDER_SUCCESS
      // });
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "ScheduleCheckOut",
        data: data,
      });
      //   console.log(res.data.data[0]);

      // dispatch(fetchServiceTypes());
    } catch (ex) {
      // dispatch({
      //   type: SET_CHECKOUT_ORDER_FAIL,
      //   error: "Network error !! Check your internet connection"
      // });
      dispatch({
        type: TRAN_FAIL,
        tranType: "ScheduleCheckOut",
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const InsUpdateScheduleAddOnCostOrder = (pData) => {
  return async (dispatch, getState) => {
    dispatch({
      type: TRAN_START,
      tranType: "ScheduleAddOnCost",
    });

    const UpdtUsr = getState().LoginReducer.userData.username;
    for (const key in pData) {
      try {
        const data = {
          CompCode: getState().LoginReducer.CompCode,
          ScheduleId: pData[key].ScheduleId,
          OrderId: pData[key].OrderId,
          SrNo: pData[key].srNo,
          ItemDesc: pData[key].desc,
          Rate: pData[key].amount,
          UpdtUsr: UpdtUsr,
        };
        const res = await axios.post(
          "orders/InsUpdtOrderScheduleAddOnCost",
          data
        );
        dispatch({
          type: TRAN_SUCCESS,
          tranType: "ScheduleAddOnCost",
          data: data,
        });
        //   console.log(res.data.data[0]);

        // dispatch(fetchServiceTypes());
      } catch (ex) {
        dispatch({
          type: TRAN_FAIL,
          tranType: "ScheduleAddOnCost",
          error: "Network error !! Check your internet connection",
        });
      }
    }
  };
};

export const DeleteScheduleAddOnCostOrder = (pScheduleId, pOrderId, pSrNo) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: "DeleteScheduleAddonCost" });
    try {
      // console.log(pScheduleId, pOrderId, pSrNo);
      // const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        ScheduleId: pScheduleId,
        OrderId: pOrderId,
        SrNo: pSrNo,
      };

      const res = await axios.post("orders/DeleteScheduleAddonCost", data);
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "DeleteScheduleAddonCost",
      });
      //   console.log(res.data.data[0]);

      // dispatch(fetchServiceTypes());
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "DeleteScheduleAddonCost",
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const InsUpdateChangePassword = (pCurPassword, pNewPassword) => {
  return async (dispatch, getState) => {
    let message = "Network error !! Check your internet connection";
    dispatch({ type: TRAN_START, tranType: "ChangePassword" });
    try {
      const pUserType = getState().LoginReducer.userData.userType;
      const pUserId = getState().LoginReducer.userData.userId;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        UserType: pUserType,
        UserId: pUserId,
        CurPassword: pCurPassword,
        NewPassword: pNewPassword,
        UpdtUsr: UpdtUsr,
      };

      const res = await axios.post("auth/changePassword", data);
      message = res.data.response.message;
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "ChangePassword",
        data: res.data.response.message,
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "ChangePassword",
        error: message,
      });
    }
  };
};

export const setSelectedAddOnCost = (pAddonCost) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_ADDONCOST,
        addOnCost: pAddonCost,
      });
    } catch (err) {
      throw err;
    }
  };
};
