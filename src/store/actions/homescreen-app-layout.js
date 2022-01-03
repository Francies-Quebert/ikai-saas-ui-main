import axios from "../../axios";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

const TRANTYPE = "HomeScreenAppLayout";

export const InsUpdtHomeScreenAppLayout = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        LayoutId: val.LayoutId,
        LayoutTitle: val.LayoutTitle,
        LayoutType: val.LayoutType,
        FrameHeight: val.FrameHeight,
        AutoPlay: val.AutoPlay,
        AutoPlayDuration: val.AutoPlayDuration,
        CmptHeight: val.CmptHeight,
        CmptWidth: val.CmptWidth,
        CmptShowTitle: val.CmptShowTitle,
        OrderBy: val.OrderBy,
        IsActive: val.IsActive,
        updt_usr: UpdtUsr,
      };
      // console.log)
      const res = await axios.post(
        "homescreen-app-layout/InsUpdtHomeScreenAppLayout",
        {
          data,
        }
      );
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

export const InsUpdtHomeScreenAppLayoutDtl = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        Id: val.Id,
        LayoutId: val.LayoutId,
        PromoTitle: val.PromoTitle,
        PromoImageUri: val.PromoImageUri,
        pathType: val.pathType,
        SysOption1: val.SysOption1,
        SysOption2: val.SysOption2,
        SysOption3: val.SysOption3,
        SysOption4: val.SysOption4,
        SysOption5: val.SysOption5,
        OrderBy: val.OrderBy,
        IsActive: val.IsActive,
        updt_usr: UpdtUsr,
      };
      // console.log)
      const res = await axios.post(
        "homescreen-app-layout/InsUpdtHomeScreenAppLayoutDtl",
        {
          data,
        }
      );
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
