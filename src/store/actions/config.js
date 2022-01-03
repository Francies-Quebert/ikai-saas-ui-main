import axios from "../../axios";
import Config from "../../models/config";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

export const SAVE_CONFIG_START = "SAVE_CONFIG_START";
export const SAVE_CONFIG_SUCCESS = "SAVE_CONFIG_SUCCESS";
export const SAVE_CONFIG_FAIL = "SAVE_CONFIG_FAIL";

const TRANTYPE = "Config";

export const FETCH_CONFIG_START = "FETCH_CONFIG_START";
export const FETCH_CONFIG_SUCCESS = "FETCH_CONFIG_SUCCESS";
export const FETCH_CONFIG_FAIL = "FETCH_CONFIG_FAIL";

export const fetchConfig = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_CONFIG_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post(
        "config/GetConfig",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const configs = [];
      for (const key in resData) {
        configs.push(
          new Config(
            resData[key].id,
            resData[key].ConfigCode,
            resData[key].ConfigAccessLevel,
            resData[key].ConfigType,
            resData[key].ConfigName,
            resData[key].Value1,
            resData[key].Value2,
            resData[key].ConfigDesc,
            resData[key].SysOption1,
            resData[key].SysOption2
          )
        );
      }
      // console.log(Config, "error");
      dispatch({
        type: FETCH_CONFIG_SUCCESS,
        configs: configs,
      });
      // console.log(configs, "error found");
    } catch (err) {
      console.error(err, "error");
      dispatch({
        type: FETCH_CONFIG_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
export const UpdtConfig = (pConfig) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        data: { CompCode: CompCode, Config: pConfig, UpdtUsrId: UpdtUsr },
      };

      const res = await axios.post("config/UpdtConfig", data);

      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      // dispatch(fetchConfig());
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
