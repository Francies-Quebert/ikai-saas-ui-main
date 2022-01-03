import axios from "../../axios";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";
import MenuCategoryMaster from "../../models/menucategorymaster";

const TRANTYPE = "MenuCategoryMaster";

export const FETCH_MENUCATEGORYMASTER_START = "FETCH_MENUCATEGORYMASTER_START";
export const FETCH_MENUCATEGORYMASTER_SUCCESS =
  "FETCH_MENUCATEGORYMASTER_SUCCESS";
export const FETCH_MENUCATEGORYMASTER_FAIL = "FETCH_MENUCATEGORYMASTER_FAIL";

export const fetchMenuCategoryMaster = (uploadPath) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_MENUCATEGORYMASTER_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(
        `menucategory-master/getMenuCategoryMaster/${CompCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const menuCategoryMaster = [];
      for (const key in resData) {
        // console.log(resData[key], "path");
        menuCategoryMaster.push(
          new MenuCategoryMaster(
            resData[key].MenuCatCode,
            resData[key].MenuCatName,
            resData[key].MenuCatDesc,
            resData[key].ImageURL,
            resData[key].pathType,
            resData[key].DefHSNSACCode,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].TaxCode,
            uploadPath
          )
        );
      }

      dispatch({
        type: FETCH_MENUCATEGORYMASTER_SUCCESS,
        menuCategoryMaster: menuCategoryMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_MENUCATEGORYMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtMenuCategoryMaster = (pInsUpdtType, val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        MenuCatCode: val.MenuCatCode,
        MenuCatName: val.MenuCatName,
        MenuCatDesc: val.MenuCatDesc,
        ImageURL: val.ImageURL,
        DefHSNSACCode: val.DefHSNSACCode,
        IsActive: val.IsActive,
        updt_usrId: UpdtUsr,
        TaxCode: val.TaxCode,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "menucategory-master/InsUpdtMenuCategoryMaster",
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
      dispatch(fetchMenuCategoryMaster());
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
