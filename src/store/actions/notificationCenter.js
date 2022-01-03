import axios from "../../axios";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";
import NotificationDtl from "../../models/notificationDtl";

export const FETCH_NotificationTranEvents_START =
  "FETCH_NotificationTranEvents_START";
export const FETCH_NotificationTranEvents_SUCCESS =
  "FETCH_NotificationTranEvents_SUCCESS";
export const FETCH_NotificationTranEvents_FAIL =
  "FETCH_NotificationTranEvents_FAIL";

export const FETCH_NotificationLog_START = "FETCH_NotificationLog_START";
export const FETCH_NotificationLog_SUCCESS = "FETCH_NotificationLog_SUCCESS";
export const FETCH_NotificationLog_FAIL = "FETCH_NotificationLog_FAIL";

export const FETCH_NotificationTranEventMapp_START =
  "FETCH_NotificationTranEventMapp_START";
export const FETCH_NotificationTranEventMapp_SUCCESS =
  "FETCH_NotificationTranEventMapp_SUCCESS";
export const FETCH_NotificationTranEventMapp_FAIL =
  "FETCH_NotificationTranEventMapp_FAIL";

export const FETCH_NotificationTranDtl_START =
  "FETCH_NotificationTranDtl_START";
export const FETCH_NotificationTranDtl_SUCCESS =
  "FETCH_NotificationTranDtl_SUCCESS";
export const FETCH_NotificationTranDtl_FAIL = "FETCH_NotificationTranDtl_FAIL";

export const FETCH_NotificationPromoTemplate_START =
  "FETCH_NotificationPromoTemplate_START";
export const FETCH_NotificationPromoTemplate_SUCCESS =
  "FETCH_NotificationPromoTemplate_SUCCESS";
export const FETCH_NotificationPromoTemplate_FAIL =
  "FETCH_NotificationPromoTemplate_FAIL";

export const fetchNotificationTranEvents = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_NotificationTranEvents_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `notification-center/getNotificationTranEvents/${CompCode}`
      );
      const resData = res.data.data;
      const notificationTranEvents = [];
      //   console.log(resData);
      for (const key in resData) {
        notificationTranEvents.push({
          EventCode: resData[key].EventCode,
          EventDesc: resData[key].EventDesc,
          OutputKeys: resData[key].OutputKeys,
        });
      }
      // console.log(userMasters, "mmmmmmm");
      dispatch({
        type: FETCH_NotificationTranEvents_SUCCESS,
        notificationTranEvents: notificationTranEvents,
      });
    } catch (err) {
      console.error("fetch notificationTranEvents", err);
      dispatch({
        type: FETCH_NotificationTranEvents_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const fetchNotificationTranEventMapp = (pEventCode) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_NotificationTranEventMapp_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `notification-center/getNotificationTranEventMapp/${CompCode}/${pEventCode}`
      );
      const resData = res.data.data;
      const notificationTranEventMapp = [];
      //   console.log(resData);
      for (const key in resData) {
        notificationTranEventMapp.push({
          EventCode: resData[key].EventCode,
          EventDesc: resData[key].EventDesc,
          OutputKeys: resData[key].OutputKeys,
          NotificationTranId: resData[key].NotificationTranId,
          NotificationTranDesc: resData[key].NotificationTranDesc,
          fetchDataSource: resData[key].fetchDataSource,
          KeyValuesHelp: resData[key].KeyValuesHelp,
        });
      }
      // console.log(userMasters, "mmmmmmm");
      dispatch({
        type: FETCH_NotificationTranEventMapp_SUCCESS,
        notificationTranEventMapp: notificationTranEventMapp,
      });
    } catch (err) {
      console.error("fetch notificationTranEvents", err);
      dispatch({
        type: FETCH_NotificationTranEventMapp_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const fetchNotificationTranDtl = (pTranId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_NotificationTranDtl_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `notification-center/getNotificationTranDtl/${CompCode}/${pTranId}`
      );
      const resData = res.data.data;
      const notificationTranDtl = [];
      //   console.log(resData);
      for (const key in resData) {
        notificationTranDtl.push({
          PkId: resData[key].PkId,
          NotificationType: resData[key].NotificationType,
          IsEnabled: resData[key].IsEnabled,
          DataValue1: resData[key].DataValue1,
          DataValue2: resData[key].DataValue2,
          DataValue3: resData[key].DataValue3,
          DataValue4: resData[key].DataValue4,
          DataValue5: resData[key].DataValue5,
          DataValue6: resData[key].DataValue6,
          DataValue7: resData[key].DataValue7,
          ConfigValue1: resData[key].ConfigValue1,
          ConfigValue2: resData[key].ConfigValue2,
          ConfigValue3: resData[key].ConfigValue3,
          ConfigValue4: resData[key].ConfigValue4,
          ConfigValue5: resData[key].ConfigValue5,
          ConfigValue6: resData[key].ConfigValue6,
          ConfigValue7: resData[key].ConfigValue7,
        });
      }
      dispatch({
        type: FETCH_NotificationTranDtl_SUCCESS,
        notificationTranDtl: notificationTranDtl,
      });
    } catch (err) {
      console.error("fetch NotificationTranDtl", err);
      dispatch({
        type: FETCH_NotificationTranDtl_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtNotificationTranDtl = (val, pPkId, tranId) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: "NotificationTranDtl" });
    try {
      // console.log(pPkId, tranId);
      const CompCode = getState().LoginReducer.CompCode;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "notification-center/InsUpdtNotificationTranDtl",
        {
          CompCode: CompCode,
          PkId: pPkId,
          NotificationTranId: tranId,
          InsUpdtType: pPkId ? "U" : "I",
          NotificationType: val.NotificationType,
          DeliveryType: val.DeliveryType,
          WaitInSeconds: val.DeliveryType === "H" ? null : val.WaitInSeconds,
          title: val.title,
          IsEnabled: val.IsEnabled === true ? "Y" : "N",
          DataValue1: val.DataValue1,
          DataValue2: val.DataValue2,
          DataValue3: val.DataValue3,
          DataValue4: val.DataValue4,
          DataValue5: val.DataValue5,
          DataValue6: val.DataValue6,
          DataValue7: val.DataValue7,
          ConfigValue1: val.ConfigValue1,
          ConfigValue2: val.ConfigValue2,
          ConfigValue3: val.ConfigValue3,
          ConfigValue4: val.ConfigValue4,
          ConfigValue5: val.ConfigValue5,
          ConfigValue6: val.ConfigValue6,
          ConfigValue7: val.ConfigValue7,
          UpdtUsr: UpdtUsr,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "NotificationTranDtl",
        data: res.data.data,
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "NotificationTranDtl",
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};

export const fetchNotificationPromoTemplate = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_NotificationPromoTemplate_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `notification-center/getNotificationPromoTemplate/${CompCode}`
      );
      const resData = res.data.data;
      const notificationPromoTemp = [];
      //   console.log(resData);
      for (const key in resData) {
        notificationPromoTemp.push(
          new NotificationDtl(
            resData[key].TemplateId,
            resData[key].TemplateName,
            resData[key].NotificationType,
            resData[key].IsEnabled,
            resData[key].DataValue1,
            resData[key].DataValue2,
            resData[key].DataValue3,
            resData[key].DataValue4,
            resData[key].DataValue5,
            resData[key].DataValue6,
            resData[key].DataValue7,
            resData[key].ConfigValue1,
            resData[key].ConfigValue2,
            resData[key].ConfigValue3,
            resData[key].ConfigValue4,
            resData[key].ConfigValue5,
            resData[key].ConfigValue6,
            resData[key].ConfigValue7
          )
        );
      }
      dispatch({
        type: FETCH_NotificationPromoTemplate_SUCCESS,
        notificationPromoTemp: notificationPromoTemp,
      });
    } catch (err) {
      console.error("fetch NotificationTranDtl", err);
      dispatch({
        type: FETCH_NotificationPromoTemplate_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtNotificationPromo = (pData) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: "NotificationSendSMS" });
    try {
      // console.log(val, pData, Fdata, "action");
      const CompCode = getState().LoginReducer.CompCode;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const token = getState().LoginReducer.token;
      const data = pData;
      const res = await axios.post(
        "notify-events/savePromoNotificationTran",
        {
          data,
          CompCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "NotificationTranDtl",
        // data: res.data.data,
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "NotificationTranDtl",
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};

export const InsUpdtNotificationPromoTemplate = (val) => {
  return async (dispatch, getState) => {
    const TRANTYPE = "InsUpdtNotificationPromoTemplate";
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      // console.log(val)
      const CompCode = getState().LoginReducer.CompCode;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: CompCode,
        TemplateId: val.TemplateId,
        TemplateName: val.TemplateName,
        NotificationType: val.NotificationType,
        DataValue1: val.DataValue1,
        DataValue2: val.DataValue2,
        DataValue3: val.DataValue3,
        DataValue4: val.DataValue4,
        DataValue5: val.DataValue5,
        DataValue6: val.DataValue6,
        DataValue7: val.DataValue7,
        ConfigValue1: val.ConfigValue1,
        ConfigValue2: val.ConfigValue2,
        ConfigValue3: val.ConfigValue3,
        ConfigValue4: val.ConfigValue4,
        ConfigValue5: val.ConfigValue5,
        ConfigValue6: val.ConfigValue6,
        ConfigValue7: val.ConfigValue7,
        IsEnabled: val.IsEnabled,
        UpdtUsr: UpdtUsr,
      };
      // console.log(data,"DATA")
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "notification-center/InsUpdtNotificationPromoTemplate",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchNotificationPromoTemplate());
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};
