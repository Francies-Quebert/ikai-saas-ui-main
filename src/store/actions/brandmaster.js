//Brand Master
import axios from "../../axios";
import BrandMaster from "../../models/brandmaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

const TRANTYPE = "BrandMaster";

export const FETCH_BRANDMASTER_START = "FETCH_BRANDMASTER_START";
export const FETCH_BRANDMASTER_SUCCESS = "FETCH_BRANDMASTER_SUCCESS";
export const FETCH_BRANDMASTER_FAIL = "FETCH_BRANDMASTER_FAIL";

export const InsUpdtBrandMaster = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        MfrCode: val.MfrCode,
        BrandCode: val.BrandCode,
        BrandDesc: val.BrandDesc,
        IsDefault: val.IsDefault,
        IsActive: val.IsActive,
        updt_usrId: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "brandmaster/InsUpdtBrandMaster",
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
      dispatch(fetchBrandMaster());
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

export const fetchBrandMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_BRANDMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`brandmaster/getBrandMaster/${CompCode}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const brandMaster = [];
      for (const key in resData) {
        brandMaster.push(
          new BrandMaster(
            resData[key].MfrCode,
            resData[key].MfrDesc,
            resData[key].BrandCode,
            resData[key].BrandDesc,
            resData[key].IsDefault.data[0] === 1 ? true : false,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_BRANDMASTER_SUCCESS,
        brandMaster: brandMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_BRANDMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
