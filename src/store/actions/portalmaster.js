import axios from "../../axios";
import PortalMaster from "../../models/portalmaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

export const FETCH_PORTALMASTER_START = "FETCH_PORTALMASTER_START";
export const FETCH_PORTALMASTER_SUCCESS = "FETCH_PORTALMASTER_SUCCESS";
export const FETCH_PORTALMASTER_FAIL = "FETCH_PORTALMASTER_FAIL";

export const fetchPortalMasters = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_PORTALMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "homescreen/InsUpdtHomescreenpromos",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(res.data.data, "I am here");
      const resData = res.data.data;
      const portalMasters = [];
      for (const key in resData) {
        portalMasters.push(
          new PortalMaster(
            resData[key].Id,
            resData[key].PromoTitle,
            resData[key].PromoImageUri,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5,
            resData[key].IsActive
          )
        );
      }
      // console.log('insde fun',PortalMaster)
      dispatch({
        type: FETCH_PORTALMASTER_SUCCESS,
        portalMasters: portalMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_PORTALMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
