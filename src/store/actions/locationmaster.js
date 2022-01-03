import axios from "../../axios";
import LocationMaster from "../../models/locationmaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "LocationMaster";

export const FETCH_LOCATIOMASTER_START = "FETCH_LOCATIOMASTER_START";
export const FETCH_LOCATIONMASTER_SUCCESS = "FETCH_LOCATIONMASTER_SUCCESS";
export const FETCH_LOCATIONMASTER_FAIL = "FETCH_LOCATIONMASTER_FAIL";

export const fetchLocationMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_LOCATIOMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post(
        "locationmaster/GetLocations",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const locationMasters = [];
      for (const key in resData) {
        locationMasters.push(
          new LocationMaster(
            resData[key].LocationId,
            resData[key].LocationName,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_LOCATIONMASTER_SUCCESS,
        locationMasters: locationMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_LOCATIONMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtLocationMaster = (pInsUpdtType, pLocationMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        LocationId: pLocationMaster.LocationId,
        LocationName: pLocationMaster.LocationName,
        IsActive: pLocationMaster.IsActive,
        updt_usr: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "locationmaster/InsUpdtLocationMaster",
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
      dispatch(fetchLocationMaster());
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
