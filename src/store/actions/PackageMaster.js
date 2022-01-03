import axios from "../../axios";
import PackageMaster from "../../models/package-master";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "PackageMaster";

export const FETCH_PACKAGEMASTER_START = "FETCH_PACKAGEMASTER_START";
export const FETCH_PACKAGEMASTER_SUCCESS = "FETCH_PACKAGEMASTER_SUCCESS";
export const FETCH_PACKAGEMASTER_FAIL = "FETCH_PACKAGEMASTER_FAIL";

export const fetchPackageMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_PACKAGEMASTER_START });
    try {
      const res = await axios.post("PackageMaster/GetPackageMaster", {
        CompCode: getState().LoginReducer.CompCode,
      });
      const resData = res.data.data;
      const packageMasters = [];

      for (const key in resData) {
        //  console.log( resData,'i amsn')
        packageMasters.push(
          new PackageMaster(
            resData[key].PackageId,
            resData[key].PackageTitle,
            resData[key].PackageDesc,
            resData[key].PackageUnit,
            resData[key].PackageUnitDesc,
            resData[key].PackageDiscType,
            resData[key].PackageDiscValue,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].VisitType,
            resData[key].PackageDiscHtml
          )
        );
      }
      dispatch({
        type: FETCH_PACKAGEMASTER_SUCCESS,
        packageMasters: packageMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_PACKAGEMASTER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const InsUpdtPackageMaster = (pInsUpdtType, pPackageMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        PackageId: pPackageMaster.PackageId,
        PackageTitle: pPackageMaster.PackageTitle,
        PackageDesc: pPackageMaster.PackageDesc,
        PackageUnit: pPackageMaster.PackageUnit,
        PackageUnitDesc: pPackageMaster.PackageUnitDesc,
        PackageDiscValue: pPackageMaster.PackageDiscValue,
        PackageDiscType: pPackageMaster.PackageDiscType,
        IsActive: pPackageMaster.IsActive,
        updt_usr: UpdtUsr,
        VisitType: pPackageMaster.VisitType,
        PackageDiscHtml: pPackageMaster.PackageDiscHtml,
      };

      const res = await axios.post("packagemaster/InsUpdtPackageMaster", {
        data,
      });
      //  console.log(res.data.data[0]);

      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchPackageMaster());
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
