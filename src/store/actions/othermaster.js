import axios from "../../axios";
import OtherMaster from "../../models/othermaster";

import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "OtherMaster";

export const FETCH_OTHERMASTER_START = "FETCH_OTHERMASTER_START";
export const FETCH_OTHERMASTER_SUCCESS = "FETCH_OTHERMASTER_SUCCESS";
export const FETCH_OTHERMASTER_FAIL = "FETCH_OTHERMASTER_FAIL";

export const InsUpdtOtherMaster = (pInsUpdtType, pOtherMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        Id: pOtherMaster.Id,
        MasterType: pOtherMaster.MasterType,
        ShortCode: pOtherMaster.ShortCode,
        MasterDesc: pOtherMaster.MasterDesc,
        updt_usr: UpdtUsr,
        IsActive: pOtherMaster.IsActive,
        SysOption1: pOtherMaster.SysOption1,
        SysOption2: pOtherMaster.SysOption2,
        SysOption3: pOtherMaster.SysOption3,
        SysOption4: pOtherMaster.SysOption4,
        SysOption5: pOtherMaster.SysOption5,
      };
      const res = await axios.post("other-master/InsUpdtOtherMaster", {
        data,
      });
      // console.log("data", data);
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchOtherMasters("QLF", 0));
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

export const fetchOtherMasters = (mastertype, isactive) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_OTHERMASTER_START });
    try {
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        MasterType: mastertype,
        IsActive: isactive,
      };

      const res = await axios.post("other-master/getOtherMaster", data);
      const resData = res.data.data;
      const otherMasters = [];
      for (const key in resData) {
        otherMasters.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }
      // console.log(otherMasters, "othermaster data");
      dispatch({
        type: FETCH_OTHERMASTER_SUCCESS,
        mastertype,
        isactive: mastertype,
        otherMasters: otherMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_OTHERMASTER_FAIL,
        mastertype,
        isactive: mastertype,
        isactive,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
