import axios from "../../axios";
import HSNSACmaster from "../../models/hasnsac-master";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "SubCategoryMaster";

export const FETCH_HSNSAC_MASTER_START = "FETCH_HSNSAC_MASTER_START";
export const FETCH_HSNSAC_MASTER_SUCCESS = "FETCH_HSNSAC_MASTER_SUCCESS";
export const FETCH_HSNSAC_MASTER_FAIL = "FETCH_HSNSAC_MASTER_FAIL";

export const fetchHsnsacMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_HSNSAC_MASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `hsnsac-master/getHSNSACmaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const hsnsacMaster = [];
      for (const key in resData) {
        hsnsacMaster.push(
          new HSNSACmaster(
            resData[key].hsnsaccode,
            resData[key].hsnsacdesc,
            resData[key].DefTaxCode,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].TaxName
          )
        );
      }
      dispatch({
        type: FETCH_HSNSAC_MASTER_SUCCESS,
        hsnsacMaster: hsnsacMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_HSNSAC_MASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtHsnsacMaster = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        hsnsaccode: val.hsnsaccode,
        hsnsacdesc: val.hsnsacdesc,
        DefTaxCode: val.DefTaxCode,
        IsActive: val.IsActive,
        updt_usrId: UpdtUsr,
      };
      // console.log(data,"DATA")
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "hsnsac-master/InsUpdtHSNSACmaster",
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
      dispatch(fetchHsnsacMaster());
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

