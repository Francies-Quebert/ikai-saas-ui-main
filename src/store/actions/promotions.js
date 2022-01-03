import axios from "../../axios";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";
import Promotion from "../../models/promotions";

export const FETCH_PROMOTION_START = "FETCH_PROMOTION_START";
export const FETCH_PROMOTION_SUCCESS = "FETCH_PROMOTION_SUCCESS";
export const FETCH_PROMOTION_FAIL = "FETCH_PROMOTION_FAIL";

export const fetchPromotions = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_PROMOTION_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`promotions/getPromotion/${CompCode}`);
      const resData = res.data.data;
      const promotion = [];
      for (const key in resData) {
        promotion.push(
          new Promotion(
            key,
            resData[key].PromotionCode,
            resData[key].BranchCode,
            resData[key].PromotionType,
            resData[key].SchemeType,
            resData[key].PromotionName,
            resData[key].PromotionDesc,
            resData[key].DiscountType,
            resData[key].DiscountValue,
            resData[key].ApplicableFrom,
            resData[key].ApplicableTo,
            resData[key].FromQty,
            resData[key].ToQty,
            resData[key].DiscQty,
            resData[key].FromAmount,
            resData[key].ToAmount,
            resData[key].MaxDiscount,
            resData[key].ApplicableFromHrs,
            resData[key].ApplicableToHrs,
            resData[key].App_Sun,
            resData[key].App_Mon,
            resData[key].App_Tue,
            resData[key].App_Wed,
            resData[key].App_Thu,
            resData[key].App_Fri,
            resData[key].App_Sat,
            resData[key].TaxIncludeExclude,
            resData[key].Include_SysOption1,
            resData[key].Include_SysOption2,
            resData[key].Include_SysOption3,
            resData[key].Include_SysOption4,
            resData[key].Include_SysOption5,
            resData[key].Include_SysOption6,
            resData[key].Include_SysOption7,
            resData[key].Include_SysOption8,
            resData[key].Include_SysOption9,
            resData[key].Include_SysOption10,
            resData[key].Exclude_SysOption1,
            resData[key].Exclude_SysOption2,
            resData[key].Exclude_SysOption3,
            resData[key].Exclude_SysOption4,
            resData[key].Exclude_SysOption5,
            resData[key].Exclude_SysOption6,
            resData[key].Exclude_SysOption7,
            resData[key].Exclude_SysOption8,
            resData[key].Exclude_SysOption9,
            resData[key].Exclude_SysOption10,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_PROMOTION_SUCCESS,
        promotion: promotion,
      });
    } catch (err) {
      dispatch({
        type: FETCH_PROMOTION_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
