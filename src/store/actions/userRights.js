import axios from "../../axios";
import UserRightsMapp from "../../models/userRightsMapp";

export const FETCH_USER_RIGHTSMAPP_START = "FETCH_USER_RIGHTSMAPP_START";
export const FETCH_USER_RIGHTSMAPP_SUCCESS = "FETCH_USER_RIGHTSMAPP_SUCCESS";
export const FETCH_USER_RIGHTSMAPP_FAIL = "FETCH_USER_RIGHTSMAPP_FAIL";

export const fetchUserRightsMapp = (pUserId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USER_RIGHTSMAPP_START, userId: pUserId });
    try {
      // console.log(pUserId,"userId")
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `user-master/getUserRightmapp/${CompCode}/${pUserId}`
      );
      const resData = res.data.data;
      const userRightsMapp = [];

      for (const key in resData) {
        userRightsMapp.push(
          new UserRightsMapp(
            resData[key].Id,
            resData[key].UserType,
            resData[key].UserId,
            resData[key].UserAccessType,
            resData[key].UserGroupAccessId
          )
        );
      }
      // console.log(userRightsMapp, "mmmmmmm");
      dispatch({
        type: FETCH_USER_RIGHTSMAPP_SUCCESS,
        userRightsMapp: userRightsMapp,
      });
    } catch (err) {
      dispatch({
        type: FETCH_USER_RIGHTSMAPP_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
