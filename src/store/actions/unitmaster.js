import axios from "../../axios";
import UnitMaster from "../../models/unitmaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "UnitMaster";

export const FETCH_UNITMASTER_START = "FETCH_UNITMASTER_START";
export const FETCH_UNITMASTER_SUCCESS = "FETCH_UNITMASTER_SUCCESS";
export const FETCH_UNITMASTER_FAIL = "FETCH_UNITMASTER_FAIL";

export const fetchUnitMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_UNITMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `unitmaster/getUnitMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const unitMaster = [];
      for (const key in resData) {
        unitMaster.push(
          new UnitMaster(
            resData[key].UnitCode,
            resData[key].UnitDesc,
            resData[key].ParentUnitCode,
            resData[key].UnitMeasureToParent,
            resData[key].AllowDecimal,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_UNITMASTER_SUCCESS,
        unitMaster: unitMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_UNITMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtUnitMaster = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        UnitCode: val.UnitCode,
        UnitDesc: val.UnitDesc,
        ParentUnitCode: val.ParentUnitCode,
        UnitMeasureToParent: val.UnitMeasureToParent,
        AllowDecimal: val.AllowDecimal,
        IsActive: val.IsActive,
        updt_usrId: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "unitmaster/InsUpdtUnitMaster",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchUnitMaster());
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
