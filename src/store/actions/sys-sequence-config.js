import axios from "../../axios";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";
import SysSequenceConfig from "../../models/sys-sequence-config";

const TRANTYPE = "SysSequenceConfig";

export const FETCH_SYSSEQUENCECONFIG_START = "FETCH_SYSSEQUENCECONFIG_START";
export const FETCH_SYSSEQUENCECONFIG_SUCCESS =
  "FETCH_SYSSEQUENCECONFIG_SUCCESS";
export const FETCH_SYSSEQUENCECONFIG_FAIL = "FETCH_SYSSEQUENCECONFIG_FAIL";

export const FETCH_SEQUENCENEXTVAL_START = "FETCH_SEQUENCENEXTVAL_START";
export const FETCH_SEQUENCENEXTVAL_SUCCESS = "FETCH_SEQUENCENEXTVAL_SUCCESS";
export const FETCH_SEQUENCENEXTVAL_FAIL = "FETCH_SEQUENCENEXTVAL_FAIL";

export const fetchSysSequenceConfig = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SYSSEQUENCECONFIG_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `sys-sequence-configmaster/getSys_Sequence_ConfigMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const sysSequenceConfig = [];
      for (const key in resData) {
        sysSequenceConfig.push(
          new SysSequenceConfig(
            resData[key].Id,
            resData[key].TranType,
            resData[key].ConfigType,
            resData[key].ResetOn,
            resData[key].Preffix,
            resData[key].Suffix,
            resData[key].Value,
            resData[key].LastGenNo,
            resData[key].EnablePadding,
            resData[key].PaddingLength,
            resData[key].PaddingChar,
            resData[key].TranDesc,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].ConfigTypeDesc
          )
        );
      }
      dispatch({
        type: FETCH_SYSSEQUENCECONFIG_SUCCESS,
        sysSequenceConfig: sysSequenceConfig,
      });
    } catch (err) {
      dispatch({
        type: FETCH_SYSSEQUENCECONFIG_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtSystemSequenceConfigMaster = (pInsUpdtType, val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        Id: val.Id,
        TranType: val.TranType,
        ConfigType: val.ConfigType,
        ResetOn: val.ResetOn,
        Preffix: val.Preffix,
        Suffix: val.Suffix,
        Value: val.Value,
        LastGenNo: val.LastGenNo,
        EnablePadding: val.EnablePadding,
        PaddingLength: val.PaddingLength,
        PaddingChar: val.PaddingChar,
        TranDesc: val.TranDesc,
        IsActive: val.IsActive,
        ConfigTypeDesc: val.ConfigTypeDesc,
        updt_usr: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "sys-sequence-configmaster/InsUpdtSystemSequenceConfigMaster",
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
      dispatch(fetchSysSequenceConfig());
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

export const fetchSequenceNextVal = (TranType) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SEQUENCENEXTVAL_START });
    try {
      //      const token = getState().LoginReducer.token;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        TranType: TranType,
        updt_usr: UpdtUsr,
      };
      //Commented by Hari since its not required
      // const res = await axios.post(
      //   "sys-sequence-configmaster/getSequenceNextVal",
      //   { data },
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
      const res = await axios.post(
        "sys-sequence-configmaster/getSequenceNextVal",
        { data }
      );
      const resData = res.data.data;
      const SequenceNextVal = [];
      for (const key in resData) {
        SequenceNextVal.push({
          NextVal: resData[key].NextVal,
          l_ResetOn: resData[key].l_ResetOn,
          l_ResetConfig: resData[key].l_ResetConfig,
        });
      }
      // console.log(SequenceNextVal,"here")
      dispatch({
        type: FETCH_SEQUENCENEXTVAL_SUCCESS,
        SequenceNextVal: SequenceNextVal,
      });
    } catch (err) {
      dispatch({
        type: FETCH_SEQUENCENEXTVAL_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
