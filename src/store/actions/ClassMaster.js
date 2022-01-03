import axios from "../../axios";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";
import ClassMaster from "../../models/ClassMaster";

const TRANTYPE = "ClassMaster";

export const FETCH_CLASSMASTER_START = "FETCH_CLASSMASTER_START";
export const FETCH_CLASSMASTER_SUCCESS = "FETCH_CLASSMASTER_SUCCESS";
export const FETCH_CLASSMASTER_FAIL = "FETCH_CLASSMASTER_FAIL";

export const fetchClassMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_CLASSMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `class-master/getClassMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const classMaster = [];
      for (const key in resData) {
        classMaster.push(
          new ClassMaster(
            resData[key].ClassId,
            resData[key].ClassCode,
            resData[key].ClassName,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_CLASSMASTER_SUCCESS,
        classMaster: classMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_CLASSMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtClassMaster = (pInsUpdtType, val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        ClassId: val.ClassId,
        ClassCode: val.ClassCode,
        ClassName: val.ClassName,
        IsActive: val.IsActive,
        updt_usr: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "class-master/InsUpdtClassMaster",
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
      dispatch(fetchClassMaster());
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
