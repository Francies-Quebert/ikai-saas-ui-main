import axios from "../axios";
import scheduleCalendar from "../models/schedulecalendar";

export function fetchScheduleCalendarData(CompCode, pselectedDate) {
  return new Promise(function (resolve, reject) {
    try {
      // const CompCode = getState().LoginReducer.CompCode;
      // console.log("getUserAccess fetched request", pUserId);
      axios
        .get(`appmain/getSchCalendarData/${CompCode}/${pselectedDate}`)
        .then((res) => {
          const schCalendarData = [];
          const resData = res.data.data;

          for (const key in resData) {
            schCalendarData.push(
              new scheduleCalendar(
                resData[key].ScheduleId,
                resData[key].OrderId,
                resData[key].ScheduleDate,
                resData[key].SlotId,
                resData[key].SlotName,
                resData[key].ServiceDesc,
                resData[key].orderTitle,
                resData[key].orderdate,
                resData[key].OrderStatus,
                resData[key].ScheduleStatusCode,
                resData[key].ScheduleStatus,
                resData[key].GrossTotal,
                resData[key].disc,
                resData[key].addOnCost,
                resData[key].RoundOff,
                resData[key].NetPayable,
                resData[key].userName,
                resData[key].email,
                resData[key].mobile,
                resData[key].gender,
                resData[key].latitude,
                resData[key].longitude,
                resData[key].add1,
                resData[key].add2,
                resData[key].Pin,
                resData[key].City,
                resData[key].geoLocationName,
                resData[key].PaymentStatus,
                resData[key].AttendantId,
                resData[key].EmpName,
                resData[key].AttendantMobile,
                resData[key].AttendantEmail,
                resData[key].Category,
                resData[key].Qualification,
                resData[key].Experience,
                resData[key].Grade,
                resData[key].Designation
              )
            );
          }

          resolve(schCalendarData);
        })
        .catch((err) => {
          console.error("rejected from getSchCalendarData", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getHelpGrpUsrMapp", e);
      reject(e);
    }
  });
}
