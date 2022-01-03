import axios from "../../axios";
import ServiceRateMap from "../../models/serviceratemap";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";
export const SET_SELCECTED_SERVICENEWRATE_MAP =
  "SET_SELCECTED_SERVICENEWRATE_MAP";

const TRANTYPE = "servicerateMap";

export const FETCH_SERVICERATEMAP_START = "FETCH_SERVICERATEMAP_START";
export const FETCH_SERVICERATEMAP_SUCCESS = "FETCH_SERVICERATEMAP_SUCCESS";
export const FETCH_SERVICERATEMAP_FAIL = "FETCH_SERVICERATEMAP_FAIL";

export const fetchServiceRateMap = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SERVICERATEMAP_START });
    try {
      const res = await axios.post("serviceratemap/Getserviceratemapping", {
        CompCode: getState().LoginReducer.CompCode,
      });
      const resData = res.data.data;
      const servicerateMaps = [];
      for (const key in resData) {
        servicerateMaps.push(
          new ServiceRateMap(
            resData[key].ServiceId,
            resData[key].ServiceTitle,
            resData[key].LocationId,
            resData[key].LocationName,
            resData[key].PackageId,
            resData[key].PackageTitle,
            resData[key].Rate,
            resData[key].discType,
            resData[key].discValue
          )
        );
      }
      // console.log(servicerateMaps,'hiiiiiii')
      dispatch({
        type: FETCH_SERVICERATEMAP_SUCCESS,
        servicerateMaps: servicerateMaps,
      });
    } catch (err) {
      dispatch({
        type: FETCH_SERVICERATEMAP_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
export const InsUpdtserviceratemapping = (pInsUpdtType, pData) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      let res = [];
      const UpdtUsr = getState().LoginReducer.userData.username;
      for (const key in pData) {
        const data = {
          Hdr: {
            CompCode: getState().LoginReducer.CompCode,
            InsUpdtType: pInsUpdtType,
            ServiceID: pData[key].ServiceId,
            LocationId: pData[key].LocationId,
            Rate: pData[key].Rate,
            updt_usr: UpdtUsr,
            discType: pData[key].discType,
            discValue: pData[key].discValue,
            PackageId: pData[key].PackageId,
            isDirty: pData[key].isDirty,
            isDeleted: pData[key].isDeleted,
            FromDatabase: pData[key].FromDatabase,
          },
        };

        res = await axios.post("serviceratemap/InsUpdtserviceratemapping", {
          data,
        });
      }

      // const data = {
      // Hdr:{
      //   InsUpdtType: pInsUpdtType,
      //   ServiceID: ServiceRateMap.ServiceId,
      //   LocationId: ServiceRateMap.LocationId,
      //   Rate: ServiceRateMap.Rate,
      //   updt_usr: UpdtUsr,
      //   discType: ServiceRateMap.discType,
      //   discValue: ServiceRateMap.discValue,
      //   PackageId: ServiceRateMap.PackageId,
      // },
      // ServiceRate:Data
      // };

      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchServiceRateMap());
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

export const setSelectedServiceRateMap = (pNewService) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_SERVICENEWRATE_MAP,
        NewService: pNewService,
      });
    } catch (err) {
      throw err;
    }
  };
};
