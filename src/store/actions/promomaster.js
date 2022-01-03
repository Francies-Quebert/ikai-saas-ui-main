import axios from "../../axios";
import PromoMaster from "../../models/promomaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "PromoMaster";

export const FETCH_PROMOMASTER_START = "FETCH_PROMOMASTER_START";
export const FETCH_PROMOMASTER_SUCCESS = "FETCH_PROMOMASTER_SUCCESS";
export const FETCH_PROMOMASTER_FAIL = "FETCH_PROMOMASTER_FAIL";

export const InsUpdtPromoMaster = (pInsUpdtType, pPromoMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const token = getState().LoginReducer.token;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        Id: pPromoMaster.Id,
        PromoTitle: pPromoMaster.PromoTitle,
        PromoImageUri: pPromoMaster.PromoImageUri,
        PathType: pPromoMaster.PathType === null ? "U" : pPromoMaster.PathType,
        SysOption1: pPromoMaster.SysOption1,
        SysOption2: pPromoMaster.SysOption2,
        SysOption3: pPromoMaster.SysOption3,
        SysOption4: pPromoMaster.SysOption4,
        SysOption5: pPromoMaster.SysOption5,
        IsActive: pPromoMaster.IsActive,
        updt_usr: UpdtUsr,
      };
      const res = await axios.post(
        "homescreen/insUpdtHomescreenpromos",
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
      dispatch(fetchPromoMasters());
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

export const fetchPromoMasters = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_PROMOMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const path = getState().AppMain.appconfigs.find(
        (aa) => aa.configCode === "UPLOAD_PATH"
      );
      const res = await axios.post(
        "homescreen/GetHomescreenpromos",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const promoMasters = [];
      // console.log(res,"promo")
      for (const key in resData) {
        promoMasters.push(
          new PromoMaster(
            resData[key].Id,
            resData[key].PromoTitle,
            resData[key].PromoImageUri,
            resData[key].PathType,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].PathType === "C"
              ? `${path.value1}/${resData[key].PromoImageUri}`
              : resData[key].PromoImageUri
          )
        );
      }
      // console.log(serviceMasters,'hiiiiiii')
      dispatch({
        type: FETCH_PROMOMASTER_SUCCESS,
        promoMasters: promoMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_PROMOMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
