import axios from "../../axios";
import City from "../../models/CityMater";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "citymaster";

export const FETCH_CITYMASTER_START = "FETCH_CITYMASTER_START";
export const FETCH_CITYMASTER_SUCCESS = "FETCH_CITYMASTER_SUCCESS";
export const FETCH_CITYMASTER_FAIL = "FETCH_CITYMASTER_FAIL";

export const fetchCityMasters = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_CITYMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.post(
        "citymaster/GetCityMasterData",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resData = res.data.data;
      const cityMasters = [];
      for (const key in resData) {
        cityMasters.push(
          new City(
            resData[key].CityCode,
            resData[key].CityName,
            resData[key].CountryCode,
            resData[key].StateCode,
            resData[key].lat,
            resData[key].lng,
            resData[key].IsDefault.data[0] === 1 ? true : false,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      // console.log(cityMasters,'yuppp')
      dispatch({
        type: FETCH_CITYMASTER_SUCCESS,
        cityMasters: cityMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_CITYMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtCityMaster = (pInsUpdtType, pCityMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        CityCode: pCityMaster.CityCode,
        CityName: pCityMaster.CityName,
        CountryCode: pCityMaster.CountryCode,
        StateCode: pCityMaster.StateCode,
        lat: pCityMaster.lat,
        lng: pCityMaster.lng,
        IsDefault: pCityMaster.IsDefault,
        IsActive: pCityMaster.IsActive,
        updt_usrId: UpdtUsr,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "citymaster/InsUpdtCityMaster",
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
      // console.log(data,"dfdsf")

      dispatch(fetchCityMasters());
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
