import axios from "../../axios";
import TaxMaster from "../../models/tax-master";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "SubCategoryMaster";

export const FETCH_TAX_MASTER_START = "FETCH_TAX_MASTER_START";
export const FETCH_TAX_MASTER_SUCCESS = "FETCH_TAX_MASTER_SUCCESS";
export const FETCH_TAX_MASTER_FAIL = "FETCH_TAX_MASTER_FAIL";

export const fetchTaxMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_TAX_MASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`tax-master/getTaxMaster/${CompCode}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const taxMaster = [];
      for (const key in resData) {
        taxMaster.push(
          new TaxMaster(
            resData[key].TaxCode,
            resData[key].TaxName,
            resData[key].TaxType,
            resData[key].TranType,
            resData[key].TaxPer,
            resData[key].IGSTPer,
            resData[key].CGSTPer,
            resData[key].SGSTPer,
            resData[key].UTSTPer,
            resData[key].CESSPer,
            resData[key].SURCHARGPer,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_TAX_MASTER_SUCCESS,
        taxMaster: taxMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_TAX_MASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtTaxMaster = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        TaxCode: val.TaxCode,
        TaxName: val.TaxName,
        TaxType: val.TaxType,
        TranType: val.TranType,
        TaxPer: val.TaxPer,
        IGSTPer: val.IGSTPer,
        CGSTPer: val.CGSTPer,
        SGSTPer: val.SGSTPer,
        UTSTPer: val.UTSTPer,
        CESSPer: val.CESSPer,
        SURCHARGPer: val.SURCHARGPer,
        IsActive: val.IsActive,
        updt_usrId: UpdtUsr,
      };
      // console.log(data,"DATA")
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "tax-master/InsUpdtTaxMaster",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchTaxMaster());
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
