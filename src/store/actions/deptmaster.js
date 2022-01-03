//compamain Master
import axios from "../../axios";
import DeptMaster from "../../models/deptmaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

const TRANTYPE = "DeptMaster";

export const FETCH_DEPTMASTER_START = "FETCH_DEPTMASTER_START";
export const FETCH_DEPTMASTER_SUCCESS = "FETCH_DEPTMASTER_SUCCESS";
export const FETCH_DEPTMASTER_FAIL = "FETCH_DEPTMASTER_FAIL";

export const InsUpdtDeptMaster = (pInsUpdtType, val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        BranchCode: val.BranchCode,
        DeptCode: val.DeptCode,
        DeptName: val.DeptName,
        EnablePurchase: val.EnablePurchase,
        EnablePurchaseReturn: val.EnablePurchaseReturn,
        EnableSale: val.EnableSale,
        EnableSaleReturn: val.EnableSaleReturn,
        EnableTransferIN: val.EnableTransferIN,
        EnableTransferOUT: val.EnableTransferOUT,
        EnableAdjustments: val.EnableAdjustments,
        IsActive: val.IsActive,
        updt_usr: UpdtUsr,
      };
      // console.log(data,"DATA")
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "deptmaster/InsUpdtDeptMaster",
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
      dispatch(fetchDeptMaster());
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

export const fetchDeptMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_DEPTMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `deptmaster/getDeptMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const deptMaster = [];
      for (const key in resData) {
        deptMaster.push(
          new DeptMaster(
            resData[key].BranchCode,
            resData[key].DeptCode,
            resData[key].DeptName,
            resData[key].EnablePurchase,
            resData[key].EnablePurchaseReturn,
            resData[key].EnableSale,
            resData[key].EnableSaleReturn,
            resData[key].EnableTransferIN,
            resData[key].EnableTransferOUT,
            resData[key].EnableAdjustments,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_DEPTMASTER_SUCCESS,
        deptMaster: deptMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_DEPTMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
