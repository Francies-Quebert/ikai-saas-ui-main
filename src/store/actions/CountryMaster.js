import axios from "../../axios";
import CountryMaster from "../../models/CountryMaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "CountryMaster";

export const FETCH_COUNTRYMASTER_START = "FETCH_COUNTRYMASTER_START";
export const FETCH_COUNTRYMASTER_SUCCESS = "FETCH_COUNTRYMASTER_SUCCESS";
export const FETCH_COUNTRYMASTER_FAIL = "FETCH_COUNTRYMASTER_FAIL";

export const fetchCountryMasters = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_COUNTRYMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post(
        "country-master/GetCountryMasters",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;

      const countryMasters = [];
      for (const key in resData) {
        countryMasters.push(
          new CountryMaster(
            resData[key].CountryCode,
            resData[key].CountryName,
            resData[key].MobileCode,
            resData[key].CurrencySymbolChar,
            resData[key].CountryCode2Char,
            resData[key].CurrencyCode,
            resData[key].IsDefault.data[0] === 1 ? true : false,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_COUNTRYMASTER_SUCCESS,
        countryMasters: countryMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_COUNTRYMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtCountryMaster = (pInsUpdtType, pCountryMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        CountryCode: pCountryMaster.CountryCode,
        CountryName: pCountryMaster.CountryName,
        MobileCode: pCountryMaster.MobileCode,
        CurrencySymbolChar: pCountryMaster.CurrencySymbolChar,
        CountryCode2Char: pCountryMaster.CountryCode2Char,
        IsDefault: pCountryMaster.IsDefault,
        IsActive: pCountryMaster.IsActive,
        updt_usrId: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "country-master/InsUpdtCountryMaster ",
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
      dispatch(fetchCountryMasters());
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
