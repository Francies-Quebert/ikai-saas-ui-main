import axios from "../../axios";
import StateMaster from "../../models/StateMaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "StateMaster";

export const FETCH_STATEMASTER_START = "FETCH_STATEMASTER_START";
export const FETCH_STATEMASTER_SUCCESS = "FETCH_STATEMASTER_SUCCESS";
export const FETCH_STATEMASTER_FAIL = "FETCH_STATEMASTER_FAIL";

export const fetchStateMasters = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_STATEMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "state-master/GetStateMasterData",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;

      const stateMasters = [];
      for (const key in resData) {
        stateMasters.push(
          new StateMaster(
            resData[key].StateCode,
            resData[key].StateName,
            resData[key].CountryCode,
            resData[key].StateCode2Char,
            resData[key].IsDefault.data[0] === 1 ? true : false,
            // resData[key].IsActive && resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].GSTStateCode
          )
        );
      }
      dispatch({
        type: FETCH_STATEMASTER_SUCCESS,
        stateMasters: stateMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_STATEMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtStateMaster = (pInsUpdtType, pStateMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      // console.log(pStateMaster, "ss");
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        CountryCode: pStateMaster.CountryCode,
        StateCode: pStateMaster.StateCode,
        StateName: pStateMaster.StateName,
        StateCode2Char: pStateMaster.StateCode2Char,
        IsDefault: pStateMaster.IsDefault,
        IsActive: pStateMaster.IsActive,
        GSTStateCode: pStateMaster.GSTStateCode,
        updt_usrId: UpdtUsr,
      };
      // console.log(data,"DATA")
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "state-master/InsUpdtStateMaster ",
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
      dispatch(fetchStateMasters());
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
