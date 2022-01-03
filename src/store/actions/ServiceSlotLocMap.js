import axios from "../../axios";
import ServiceSlotLocMapMaster from "../../models/ServiceSlotLocMap";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "ServiceSlotLocMapMaster";

export const FETCH_ServiceSlotLocMapMaster_START =
  "FETCH_ServiceSlotLocMapMaster_START";
export const FETCH_ServiceSlotLocMapMaster_SUCCESS =
  "FETCH_ServiceSlotLocMapMaster_SUCCESS";
export const FETCH_ServiceSlotLocMapMaster_FAIL =
  "FETCH_ServiceSlotLocMapMaster_FAIL";

export const InsUpdtserviceSlotLocMapMaster = (pData) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      let data = [];
      pData.forEach((yy) => {
        data.push({
          ...yy,
          CompCode: getState().LoginReducer.CompCode,
          updt_usrId: UpdtUsr,
        });
      });
      const res = await axios.post(
        "serviceslotlocationmap/insUpdtservice_slot_loc_mapp",
        { data }
      );

      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
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
export const fetchServiceSlotLocMapMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ServiceSlotLocMapMaster_START });
    try {
      const res = await axios.post(
        "serviceslotlocationmap/GetServiceSlotLocMapp",
        { CompCode: getState().LoginReducer.CompCode }
      );
      const resData = res.data.data;
      const serviceslotlocmapMasters = [];
      for (const key in resData) {
        serviceslotlocmapMasters.push(
          new ServiceSlotLocMapMaster(
            resData[key].ServiceTitle,
            resData[key].SlotName,
            resData[key].LocationName,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_ServiceSlotLocMapMaster_SUCCESS,
        serviceslotlocmapMasters: serviceslotlocmapMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ServiceSlotLocMapMaster_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
