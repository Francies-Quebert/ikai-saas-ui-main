//Branch Master
import axios from "../../axios";
import BranchMaster from "../../models/branchmaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

const TRANTYPE = "BranchMaster";

export const FETCH_BRANCHMASTER_START = "FETCH_BRANCHMASTER_START";
export const FETCH_BRANCHMASTER_SUCCESS = "FETCH_BRANCHMASTER_SUCCESS";
export const FETCH_BRANCHMASTER_FAIL = "FETCH_BRANCHMASTER_FAIL";

export const InsUpdtBranchMaster = (pInsUpdtType, val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        InsUpdtType: pInsUpdtType,
        CompCode: val.CompCode,
        BranchCode: val.BranchCode,
        BranchName: val.BranchName,
        Add1: val.Add1,
        Add2: val.Add2,
        Add3: val.Add3,
        City: val.City,
        Pin: val.Pin,
        tel1: val.tel1,
        tel2: val.tel2,
        mobile: val.mobile,
        email: val.email,
        website: val.website,
        BranchType: val.BranchType,
        IsActive: val.IsActive,
        updt_usr: UpdtUsr,
      };
      // console.log(data, "DATA");//
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "branchmaster/InsUpdtBranchMaster",
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
      dispatch(fetchBranchMaster());
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

export const fetchBranchMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_BRANCHMASTER_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(
        `branchmaster/getBranchMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resData = res.data.data;
      const branchMaster = [];
      for (const key in resData) {
        branchMaster.push(
          new BranchMaster(
            resData[key].CompCode,
            resData[key].BranchCode,
            resData[key].BranchName,
            resData[key].Add1,
            resData[key].Add2,
            resData[key].Add3,
            resData[key].City,
            resData[key].Pin,
            resData[key].tel1,
            resData[key].tel2,
            resData[key].mobile,
            resData[key].email,
            resData[key].website,
            resData[key].BranchType,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_BRANCHMASTER_SUCCESS,
        branchMaster: branchMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_BRANCHMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
