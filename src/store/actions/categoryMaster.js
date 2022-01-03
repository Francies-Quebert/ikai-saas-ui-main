import axios from "../../axios";
import CategoryMaster from "../../models/categorymaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

const TRANTYPE = "CategoryMaster";

export const FETCH_CATEGORYMASTER_START = "FETCH_CATEGORYMASTER_START";
export const FETCH_CATEGORYMASTER_SUCCESS = "FETCH_CATEGORYMASTER_SUCCESS";
export const FETCH_CATEGORYMASTER_FAIL = "FETCH_CATEGORYMASTER_FAIL";

export const InsUpdtCategoryMaster = (pInsUpdtType, pCategoryMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        CatCode: pCategoryMaster.CatCode,
        CatDesc: pCategoryMaster.CatDesc,
        CatDetailDesc: pCategoryMaster.CatDetailDesc,
        ImageUrl: pCategoryMaster.ImageUrl,
        pathType: pCategoryMaster.pathType,
        IsActive: pCategoryMaster.IsActive,
        UpdtUsr: UpdtUsr,
      };

      const res = await axios.post("categorymaster/InsUpdtCategoryMaster", {
        data,
      });
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchCategoryMasters());
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

export const fetchCategoryMasters = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_CATEGORYMASTER_START });
    const path = getState().AppMain.appconfigs.find(
      (aa) => aa.configCode === "UPLOAD_PATH"
    );
    const CompCode = getState().LoginReducer.CompCode;
    try {
      const res = await axios.get(
        `categorymaster/getCategoryMaster/${CompCode}`
      );
      const resData = res.data.data;
      const categoryMasters = [];
      for (const key in resData) {
        categoryMasters.push(
          new CategoryMaster(
            resData[key].CatCode,
            resData[key].CatDesc,
            resData[key].CatDetailDesc,
            resData[key].ImageUrl,
            resData[key].pathType,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].pathType === "C"
              ? `${path.value1}/${resData[key].ImageUrl}`
              : resData[key].ImageUrl
          )
        );
      }

      // console.log(categoryMasters, "i got");
      dispatch({
        type: FETCH_CATEGORYMASTER_SUCCESS,
        categoryMasters: categoryMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_CATEGORYMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
