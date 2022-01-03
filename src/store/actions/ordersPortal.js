//Atul on 20200211
import axios from "../../axios";
import OrdersPortal from "../../models/ordersPortal";
import OrderScheduleVisit from "../../models/order-schedule-visits";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

export const FETCH_ORDERSPORTAL_START = "FETCH_ORDERSPORTAL_START";
export const FETCH_ORDERSPORTAL_SUCCESS = "FETCH_ORDERSPORTAL_SUCCESS";
export const FETCH_ORDERSPORTAL_FAIL = "FETCH_ORDERSPORTAL_FAIL";

export const FETCH_ORDERSPORTALHOME_START = "FETCH_ORDERSPORTALHOME_START";
export const FETCH_ORDERSPORTALHOME_SUCCESS = "FETCH_ORDERSPORTALHOME_SUCCESS";
export const FETCH_ORDERSPORTALHOME_FAIL = "FETCH_ORDERSPORTALHOME_FAIL";

export const ACCEPT_ORDER_START = "ACCEPT_ORDER_START";
export const ACCEPT_ORDER_SUCCESS = "ACCEPT_ORDER_SUCCESS";
export const ACCEPT_ORDER_FAIL = "ACCEPT_ORDER_FAIL";

export const REJECT_ORDER_START = "REJECT_ORDER_START";
export const REJECT_ORDER_SUCCESS = "REJECT_ORDER_SUCCESS";
export const REJECT_ORDER_FAIL = "REJECT_ORDER_FAIL";

export const CANCEL_ORDER_PORTAL_START = "CANCEL_ORDER_PORTAL_START";
export const CANCEL_ORDER_PORTAL_SUCCESS = "CANCEL_ORDER_PORTAL_SUCCESS";
export const CANCEL_ORDER_PORTAL_FAIL = "CANCEL_ORDER_PORTAL_FAIL";

export const ASSIGN_ATTENDANT_ORDER_START = "ASSIGN_ATTENDANT_ORDER_START";
export const ASSIGN_ATTENDANT_ORDER_SUCCESS = "ASSIGN_ATTENDANT_ORDER_SUCCESS";
export const ASSIGN_ATTENDANT_ORDER_FAIL = "ASSIGN_ATTENDANT_ORDER_FAIL";

export const SEND_SCHEDULE_SMS_START = "SEND_SCHEDULE_SMS_START";
export const SEND_SCHEDULE_SMS_SUCCESS = "SEND_SCHEDULE_SMS_SUCCESS";
export const SEND_SCHEDULE_SMS_FAIL = "SEND_SCHEDULE_SMS_FAIL";

export const ORDER_SCHEDULE_START = "ORDER_SCHEDULE_START";
export const ORDER_SCHEDULE_SUCCESS = "ORDER_SCHEDULE_SUCCESS";
export const ORDER_SCHEDULE_FAIL = "ORDER_SCHEDULE_FAIL";
export const REINTIALIZE = "REINTIALIZE";

export const FETCH_ORDERSCHEDULEVISITS_START =
  "FETCH_ORDERSCHEDULEVISITS_START";
export const FETCH_ORDERSCHEDULEVISITS_SUCCESS =
  "FETCH_ORDERSCHEDULEVISITS_SUCCESS";
export const FETCH_ORDERSCHEDULEVISITS_FAIL = "FETCH_ORDERSCHEDULEVISITS_FAIL";

export const PROCESS_ORDERSCHEDULEVISITS_START =
  "PROCESS_ORDERSCHEDULEVISITS_START";
export const PROCESS_ORDERSCHEDULEVISITS_SUCCESS =
  "PROCESS_ORDERSCHEDULEVISITS_SUCCESS";
export const PROCESS_ORDERSCHEDULEVISITS_FAIL =
  "PROCESS_ORDERSCHEDULEVISITS_FAIL";

export const FETCH_ORDERDETAIL_START = "FETCH_ORDERDETAIL_START";
export const FETCH_ORDERDETAIL_SUCCESS = "FETCH_ORDERDETAIL_SUCCESS";
export const FETCH_ORDERDETAIL_FAIL = "FETCH_ORDERDETAIL_FAIL";

export const FETCH_ORDERSPORTALUPCOMING_START =
  "FETCH_ORDERSPORTALUPCOMING_START";
export const FETCH_ORDERSPORTALUPCOMING_SUCCESS =
  "FETCH_ORDERSPORTALUPCOMING_SUCCESS";
export const FETCH_ORDERSPORTALUPCOMING_FAIL =
  "FETCH_ORDERSPORTALUPCOMING_FAIL";

export const fetchOrderDetail = (pOrderId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ORDERDETAIL_START });
    try {
      // console.log(pOrderId);
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        OrderId: pOrderId,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orderportal/getOrderDetails", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      let orderDetail = null;
      // console.log(`FETCH_ORDERDETAIL_START`, resData);
      for (const key in resData) {
        orderDetail = new OrdersPortal(
          resData[key].orderid,
          resData[key].orderTitle,
          resData[key].orderdate,
          resData[key].OrderStatus,
          resData[key].statusDesc,
          resData[key].GrossTotal,
          resData[key].disc,
          resData[key].RoundOff,
          resData[key].NetPayable,
          resData[key].userName,
          resData[key].email,
          resData[key].mobile,
          resData[key].gender,
          resData[key].ScheduledFrom,
          resData[key].ScheduledTo,
          resData[key].slotName,
          resData[key].latitude,
          resData[key].longitude,
          resData[key].add1,
          resData[key].add2,
          resData[key].Pin,
          resData[key].City,
          resData[key].geoLocationName,
          resData[key].PaymentStatus,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          resData[key].StsBackColor,
          resData[key].StsForeColor,
          resData[key].IsShowAccept,
          resData[key].IsShowReject,
          resData[key].IsShowShcedule,
          resData[key].IsShowCancel,
          resData[key].UpComingScheduleDate,
          resData[key].UpComingScheduleSlot
        );
      }
      dispatch({
        type: FETCH_ORDERDETAIL_SUCCESS,
        orderDetail: orderDetail,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ORDERDETAIL_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const ProcessOrderScheduleVisits = (pOrderId) => {
  return async (dispatch, getState) => {
    dispatch({ type: PROCESS_ORDERSCHEDULEVISITS_START });

    try {
      // console.log(pOrderId);
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        OrderId: pOrderId,
        UpdtUserId: getState().LoginReducer.userData.username,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "orderportal/ProcessOrderScheduleVisit",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resData = res.data.data;
      const scheduleVisits = [];

      // console.log(res)
      for (const key in resData) {
        scheduleVisits.push(
          new OrderScheduleVisit(
            resData[key].ScheduleId,
            resData[key].OrderId,
            resData[key].ScheduleDate,
            resData[key].SlotId,
            resData[key].slotname,
            resData[key].Remark,
            resData[key].Status,
            resData[key].StatusDesc,
            resData[key].IsActive,
            resData[key].AttendantId,
            resData[key].EmpName,
            resData[key].mobileNo,
            resData[key].email,
            resData[key].Category,
            resData[key].Qualification,
            resData[key].Experience,
            resData[key].Grade,
            resData[key].Designation
          )
        );
      }
      dispatch({
        type: PROCESS_ORDERSCHEDULEVISITS_SUCCESS,
        scheduleVisits: scheduleVisits,
      });
    } catch (err) {
      dispatch({
        type: PROCESS_ORDERSCHEDULEVISITS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchOrderScheduleVisits = (pOrderId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ORDERSCHEDULEVISITS_START });

    try {
      // console.log(pOrderId);
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        OrderId: pOrderId,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orderportal/getOrderScheduleVisit", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resData = res.data.data;
      const scheduleVisits = [];

      for (const key in resData) {
        scheduleVisits.push(
          new OrderScheduleVisit(
            resData[key].ScheduleId,
            resData[key].OrderId,
            resData[key].ScheduleDate,
            resData[key].SlotId,
            resData[key].slotname,
            resData[key].Remark,
            resData[key].Status,
            resData[key].StatusDesc,
            resData[key].IsActive,
            resData[key].AttendantId,
            resData[key].EmpName,
            resData[key].mobileNo,
            resData[key].email,
            resData[key].Category,
            resData[key].Qualification,
            resData[key].Experience,
            resData[key].Grade,
            resData[key].Designation,
            resData[key].VerificationCode
          )
        );
      }
      dispatch({
        type: FETCH_ORDERSCHEDULEVISITS_SUCCESS,
        scheduleVisits: scheduleVisits,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ORDERSCHEDULEVISITS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const sendScheduleSms = (pScheduleId) => {
  return async (dispatch, getState) => {
    dispatch({ type: SEND_SCHEDULE_SMS_START });

    try {
      // console.log(pOrderId);
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        ScheduleId: pScheduleId,
        UpdtUsr: getState().LoginReducer.userData.username,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orders/SendScheduleSMS", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: SEND_SCHEDULE_SMS_SUCCESS,
      });
      dispatch({ type: REINTIALIZE });
    } catch (err) {
      dispatch({
        type: SEND_SCHEDULE_SMS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const acceptOrderPortal = (pOrderId) => {
  return async (dispatch, getState) => {
    dispatch({ type: ACCEPT_ORDER_START });

    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const token = getState().LoginReducer.token;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        orderId: pOrderId,
        UpdtUserId: UpdtUsr,
      };
      const res = await axios.post("orders/BookingAccept", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: ACCEPT_ORDER_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: ACCEPT_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const cancelOrderPortal = (pOrderId) => {
  return async (dispatch, getState) => {
    // dispatch({ type: CANCEL_ORDER_PORTAL_START });
    dispatch({ type: TRAN_START, tranType: "cancelOrderPortal" });
    try {
      const UpdtUsrId = getState().LoginReducer.userData.userId;
      // console.log(pOrderId,"asd",UpdtUsrId)
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        orderId: pOrderId,
        UpdtUserId: UpdtUsrId,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orders/cancelOrder", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(res, "data");
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "cancelOrderPortal",
      });
      // dispatch({
      //   type: CANCEL_ORDER_PORTAL_SUCCESS
      // });
    } catch (err) {
      // dispatch({
      //   type: CANCEL_ORDER_PORTAL_FAIL,
      //   error: "Network error !! Check your internet connection"
      // });
      dispatch({
        type: TRAN_FAIL,
        tranType: "cancelOrderPortal",
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const rejectOrderPortal = (pOrderId) => {
  return async (dispatch, getState) => {
    dispatch({ type: REJECT_ORDER_START });

    try {
      const UpdtUsr = getState().LoginReducer.userData.username;

      const data = {
        CompCode: getState().LoginReducer.CompCode,
        orderId: pOrderId,
        UpdtUserId: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      // console.log(data);
      const res = await axios.post("orders/BookingReject", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: REJECT_ORDER_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: REJECT_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const assignAttendantOrderPortal = (pOrderId, pAttendantId) => {
  return async (dispatch, getState) => {
    dispatch({ type: ASSIGN_ATTENDANT_ORDER_START });

    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        orderId: pOrderId,
        attendantId: pAttendantId,
        UpdtUserId: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orders/assignAttendant", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({
        type: ASSIGN_ATTENDANT_ORDER_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: ASSIGN_ATTENDANT_ORDER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchOrdersPortal = (fromDate, toDate) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ORDERSPORTAL_START });
    try {
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        FromDate: fromDate,
        ToDate: toDate,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("orderportal/GetOrdersPortal", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const ordersPortal = [];

      for (const key in resData) {
        ordersPortal.push(
          new OrdersPortal(
            resData[key].orderid,
            resData[key].orderTitle,
            resData[key].orderdate,
            resData[key].OrderStatus,
            resData[key].statusDesc,
            resData[key].GrossTotal,
            resData[key].disc,
            resData[key].RoundOff,
            resData[key].NetPayable,
            resData[key].userName,
            resData[key].email,
            resData[key].mobile,
            resData[key].gender,
            resData[key].ScheduledFrom,
            resData[key].ScheduledTo,
            resData[key].slotName,
            resData[key].latitude,
            resData[key].longitude,
            resData[key].add1,
            resData[key].add2,
            resData[key].Pin,
            resData[key].City,
            resData[key].geoLocationName,
            resData[key].AttendantId,
            resData[key].EmpName,
            resData[key].AttendantMobile,
            resData[key].AttendantEmail,
            resData[key].Category,
            resData[key].Qualification,
            resData[key].Experience,
            resData[key].Grade,
            resData[key].Designation,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            resData[key].UpComingScheduleDate,
            resData[key].UpComingScheduleSlot
          )
        );
      }
      // console.log(locations);
      dispatch({
        type: FETCH_ORDERSPORTAL_SUCCESS,
        ordersPortal: ordersPortal,
      });
    } catch (err) {
      // console.log(err);
      dispatch({
        type: FETCH_ORDERSPORTAL_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchOrdersPortalHome = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ORDERSPORTALHOME_START });
    try {
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "orderportal/GetOrdersPortalHome",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const ordersPortalHome = [];
      for (const key in resData) {
        ordersPortalHome.push(
          new OrdersPortal(
            resData[key].orderid,
            resData[key].orderTitle,
            resData[key].orderdate,
            resData[key].OrderStatus,
            resData[key].statusDesc,
            resData[key].GrossTotal,
            resData[key].disc,
            resData[key].RoundOff,
            resData[key].NetPayable,
            resData[key].userName,
            resData[key].email,
            resData[key].mobile,
            resData[key].gender,
            resData[key].ScheduledFrom,
            resData[key].ScheduledTo,
            resData[key].slotName,
            resData[key].latitude,
            resData[key].longitude,
            resData[key].add1,
            resData[key].add2,
            resData[key].Pin,
            resData[key].City,
            resData[key].geoLocationName,
            resData[key].PaymentStatus,
            resData[key].ActionRequired,
            resData[key].AttendantId,
            resData[key].EmpName,
            resData[key].AttendantMobile,
            resData[key].AttendantEmail,
            resData[key].Category,
            resData[key].Qualification,
            resData[key].Experience,
            resData[key].Grade,
            resData[key].Designation,
            null,
            null,
            null,
            null,
            null,
            null,
            resData[key].UpComingScheduleDate,
            resData[key].UpComingScheduleSlot
          )
        );
      }
      // console.log(ordersPortalHome, "fsa");
      dispatch({
        type: FETCH_ORDERSPORTALHOME_SUCCESS,
        ordersPortalHome: ordersPortalHome,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: FETCH_ORDERSPORTALHOME_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
export const fetchOrdersPortalUpcoming = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ORDERSPORTALUPCOMING_START });
    try {
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "orderportal/GetUpComingOrder",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const ordersPortalUpcoming = [];
      // console.log("test",ordersPortalUpcoming)
      for (const key in resData) {
        ordersPortalUpcoming.push(
          new OrdersPortal(
            resData[key].orderid,
            resData[key].orderTitle,
            resData[key].orderdate,
            resData[key].OrderStatus,
            resData[key].statusDesc,
            resData[key].GrossTotal,
            resData[key].disc,
            resData[key].RoundOff,
            resData[key].NetPayable,
            resData[key].userName,
            resData[key].email,
            resData[key].mobile,
            resData[key].gender,
            resData[key].ScheduledFrom,
            resData[key].ScheduledTo,
            resData[key].slotName,
            resData[key].latitude,
            resData[key].longitude,
            resData[key].add1,
            resData[key].add2,
            resData[key].Pin,
            resData[key].City,
            resData[key].geoLocationName,
            resData[key].PaymentStatus,
            resData[key].ActionRequired,
            resData[key].AttendantId,
            resData[key].EmpName,
            resData[key].AttendantMobile,
            resData[key].AttendantEmail,
            resData[key].Category,
            resData[key].Qualification,
            resData[key].Experience,
            resData[key].Grade,
            resData[key].Designation,
            null,
            null,
            null,
            null,
            null,
            null,
            resData[key].UpComingScheduleDate,
            resData[key].UpComingScheduleSlot
          )
        );
      }
      dispatch({
        type: FETCH_ORDERSPORTALUPCOMING_SUCCESS,
        ordersPortalUpcoming: ordersPortalUpcoming,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: FETCH_ORDERSPORTALUPCOMING_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const InsUpdateOrderSchedule = (
  pInsUpdtType,
  pScheduleId,
  pOrderId,
  pScheduleDate,
  pSlotId,
  pAttendantId,
  pRemark,
  pStatus
) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: "InsUpdateOrderSchedule" });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        ScheduleId: pScheduleId,
        OrderId: pOrderId,
        ScheduleDate: pScheduleDate,
        SlotId: pSlotId,
        AttendantId: pAttendantId,
        Remark: pRemark,
        Status: pStatus,
        UpdtUsr: UpdtUsr,
      };
      // console.log(data);
      const res = await axios.post("orderportal/UpdateOrderSchedule", data);
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "InsUpdateOrderSchedule",
      });
      //   console.log(res.data.data[0]);

      // dispatch(fetchServiceTypes());
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "InsUpdateOrderSchedule",
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const InsUpdateOrderScheduleVisit = (pData) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: "InsUpdateOrderSchedule" });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        ScheduleId: pData.ScheduleId,
        OrderId: pData.OrderId,
        ScheduleDate: pData.ScheduleDate,
        SlotId: pData.SlotId,
        AttendantId: pData.AttendantId ? pData.AttendantId : null,
        Remark: pData.Remark,
        Status: pData.AttendantId ? "ASC" : "UAS",
        UpdtUsr: UpdtUsr,
      };
      const res = await axios.post("orderportal/InsUpdtOrderSchedule", data);
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "InsUpdateOrderSchedule",
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "InsUpdateOrderSchedule",
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
