import axios from "../../axios";
import TablesMaster from "../../models/tablesmaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

const TRANTYPE = "TablesMaster";

export const FETCH_TABLESMASTER_START = "FETCH_TABLESMASTER_START";
export const FETCH_TABLESMASTER_SUCCESS = "FETCH_TABLESMASTER_SUCCESS";
export const FETCH_TABLESMASTER_FAIL = "FETCH_TABLESMASTER_FAIL";

export const fetchTablesMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_TABLESMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `tables-master/getTablesMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const tablesMaster = [];
      // console.log(resData, "sss");
      for (const key in resData) {
        tablesMaster.push(
          {
            ...resData[key],
            IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
          }
          // new TablesMaster(
          //   resData[key].ShortCode,
          //   resData[key].TableName,
          //   resData[key].SecCode,
          //   resData[key].Icon,
          //   resData[key].SittingCapacity,
          //   resData[key].IsActive.data[0] === 1 ? true : false
          // )
        );
      }
      dispatch({
        type: FETCH_TABLESMASTER_SUCCESS,
        tablesMaster: tablesMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_TABLESMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtTablesMaster = (pInsUpdtType, val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        ShortCode: val.ShortCode,
        TableName: val.TableName,
        SecCode: val.SecCode,
        Icon: val.Icon,
        SittingCapacity: val.SittingCapacity,
        IsActive: val.IsActive,
        updt_usr: UpdtUsr,
      };
      // console.log(data,"DATA")
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "tables-master/InsUpdtTablesMaster",
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
      dispatch(fetchTablesMaster());
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
