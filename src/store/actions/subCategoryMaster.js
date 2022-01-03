import axios from "../../axios";
import SubCategoryMaster from "../../models/subCategoryMaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";
import { fetchCategoryMasters } from "./categoryMaster";

const TRANTYPE = "SubCategoryMaster";

export const FETCH_SUB_CATEGORY_MASTER_START =
  "FETCH_SUB_CATEGORY_MASTER_START";
export const FETCH_SUB_CATEGORY_MASTER_SUCCESS =
  "FETCH_SUB_CATEGORY_MASTER_SUCCESS";
export const FETCH_SUB_CATEGORY_MASTER_FAIL = "FETCH_SUB_CATEGORY_MASTER_FAIL";

export const fetchSubCategory = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SUB_CATEGORY_MASTER_START });
    try {
      const path = getState().AppMain.appconfigs.find(
        (aa) => aa.configCode === "UPLOAD_PATH"
      );
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `sub-category-master/getSubCategory/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const subCategoryMaster = [];
      for (const key in resData) {
        subCategoryMaster.push(
          new SubCategoryMaster(
            resData[key].SubCatCode,
            resData[key].CatCode,
            resData[key].SubCatDesc,
            resData[key].SubCatDetailDesc,
            resData[key].ImageUrl,
            resData[key].PathType,
            resData[key].DefHSNSACCode,
            resData[key].ItemInfoTemplate,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].IsInventory.data[0] === 1 ? true : false,
            resData[key].ImageUrl !== null
              ? resData[key].pathType === "C"
                ? `${path.value1}/${resData[key].ImageUrl}`
                : resData[key].ImageUrl
              : null,

            resData[key].CatDesc
          )
        );
      }
      dispatch({
        type: FETCH_SUB_CATEGORY_MASTER_SUCCESS,
        subCategoryMaster: subCategoryMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_SUB_CATEGORY_MASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtSubCategoryMaster = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      // console.log(val)
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        SubCatCode: val.SubCatCode,
        CatCode: val.CatCode,
        SubCatDesc: val.SubCatDesc,
        SubCatDetailDesc: val.SubCatDetailDesc,
        ImageUrl: val.ImageUrl,
        PathType: val.PathType,
        DefHSNSACCode: val.DefHSNSACCode,
        ItemInfoTemplate: val.ItemInfoTemplate,
        IsActive: val.IsActive,
        IsInventory: val.IsInventory,
        updt_usrId: UpdtUsr,
      };

      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "sub-category-master/InsUpdtSubCategoryMaster",
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
      dispatch(fetchSubCategory());
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
