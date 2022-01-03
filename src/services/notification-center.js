import axios from "../axios";
import NotificationLogs from "../models/notificationLogs";

export function fetchNotificationTranEventMapp(CompCode, pEventCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserAccess fetched request", pUserId);
      axios
        .get(
          `notification-center/getNotificationTranEventMapp/${CompCode}/${pEventCode}`
        )
        .then((res) => {
          const notificationTranEventMapp = [];
          const resData = res.data.data;

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

          resolve(notificationTranEventMapp);
        })
        .catch((err) => {
          console.error("rejected from fetchNotificationTranEventMapp", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchNotificationTranEventMapp", e);
      reject(e);
    }
  });
}

export function fetchNotificationTranDtl(CompCode, pTranId) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserAccess fetched request", pUserId);
      axios
        .get(
          `notification-center/getNotificationTranDtl/${CompCode}/${pTranId}`
        )
        .then((res) => {
          const notificationTranDtl = [];
          const resData = res.data.data;
          // console.log(resData)
          for (const key in resData) {
            notificationTranDtl.push({
              PkId: resData[key].PkId,
              NotificationType: resData[key].NotificationType,
              NotificationTypeDesc:
                resData[key].NotificationType === "S"
                  ? "SMS"
                  : resData[key].NotificationType === "E"
                  ? "E-Mail"
                  : "Notification",
              title: resData[key].title,
              DeliveryType: resData[key].DeliveryType,
              WaitInSeconds: resData[key].WaitInSeconds,
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

          resolve(notificationTranDtl);
        })
        .catch((err) => {
          console.error("rejected from NotificationTranDtl", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from NotificationTranDtl", e);
      reject(e);
    }
  });
}

export function fetchNotificationLog(
  CompCode,
  pNotificationMode,
  pNotificationType,
  pFromDate,
  pToDate
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `notification-center/getNotificationLogs/${CompCode}/${pNotificationMode}/${pNotificationType}/${pFromDate}/${pToDate}`
        )
        .then((res) => {
          const notificationlog = [];
          const resData = res.data.data;
          for (const key in resData) {
            notificationlog.push({
              key: resData[key].TranId,
              TranId: resData[key].TranId,
              Title: resData[key].Title,
              NotificationType: resData[key].NotificationType,
              SendDTTM: resData[key].SendDTTM,
              StatusDesc: resData[key].StatusDesc,
              ScheduleOn: resData[key].ScheduleOn,
              crt_dttm: resData[key].crt_dttm,
            });
          }

          resolve(notificationlog);
        })
        .catch((err) => {
          console.error("rejected from fetchNotificationLog", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchNotificationlog", e);
      reject(e);
    }
  });
}

export function fetchNotificationFromSystem(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`notification-center/getNotificationFetchFromSystem/${CompCode}`)
        .then((res) => {
          const notificationlog = [];
          const resData = res.data.data;
          // for (const key in resData) {
          //   notificationlog.push({
          //     TranId: resData[key].TranId,
          //     Title: resData[key].Title,
          //     NotificationType: resData[key].NotificationType,
          //     SendDTTM: resData[key].SendDTTM,
          //     Status: resData[key].Status,
          //     crt_dttm: resData[key].crt_dttm,
          //   });
          // }
          // console.log(resData)
          resolve(resData);
        })
        .catch((err) => {
          console.error("rejected from fetchNotificationLog", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchNotificationlog", e);
      reject(e);
    }
  });
}

export function fetchSystemSp(CompCode, pSpName) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `notification-center/getNotificationCallSystemSp/${CompCode}/${pSpName}`
        )
        .then((res) => {
          const notificationlog = [];
          const resData = res.data.data;
          // for (const key in resData) {
          //   notificationlog.push({
          //     TranId: resData[key].TranId,
          //     Title: resData[key].Title,
          //     NotificationType: resData[key].NotificationType,
          //     SendDTTM: resData[key].SendDTTM,
          //     Status: resData[key].Status,
          //     crt_dttm: resData[key].crt_dttm,
          //   });
          // }
          // console.log(resData)
          resolve(resData);
        })
        .catch((err) => {
          console.error("rejected from fetchNotificationLog", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchNotificationlog", e);
      reject(e);
    }
  });
}
