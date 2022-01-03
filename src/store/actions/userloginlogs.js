import axios from "../../axios";
import UserLoginLogsMaster from "../../models/userloginlogs";

export const FETCH_USERLOGINLOGSMASTER_START =
  "FETCH_USERLOGINLOGSMASTER_START";
export const FETCH_USERLOGINLOGSMASTER_SUCCESS =
  "FETCH_USERLOGINLOGSMASTER_SUCCESS";
export const FETCH_USERLOGINLOGSMASTER_FAIL = "FETCH_USERLOGINLOGSMASTER_FAIL";

export const fetchUserLoginLogsMasters = (fromDate, toDate) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USERLOGINLOGSMASTER_START });
    try {
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        FromDate: fromDate,
        ToDate: toDate,
      };
      const token = getState().LoginReducer.token;
      // console.log(data,'i m here')
      const res = await axios.post("userloginlogs/GetUserLoginLogs", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const userloginlogsMasters = [];
      // console.log(userloginlogsMasters)
      for (const key in resData) {
        userloginlogsMasters.push(
          new UserLoginLogsMaster(
            resData[key].Id,
            resData[key].UserType,
            resData[key].UserId,
            resData[key].Name,
            resData[key].MobileNo,
            resData[key].DeviceName,
            resData[key].ExpoDeviceId,
            resData[key].SystemOS,
            resData[key].SystemOSVerNo,
            resData[key].LoginDttm,
            resData[key].ExpoNotificationToken
          )
        );
      }
      // console.log(userloginlogsMasters, "mmmmmmm");
      dispatch({
        type: FETCH_USERLOGINLOGSMASTER_SUCCESS,
        userloginlogsMasters: userloginlogsMasters,
      });
    } catch (err) {
      console.error(err, "error");
      dispatch({
        type: FETCH_USERLOGINLOGSMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
