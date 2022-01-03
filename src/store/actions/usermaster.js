import axios from "../../axios";
import UserMaster from "../../models/usermaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";
import UserAccess from "../../models/userAccess";
import UserAddress from "../../models/userAddress";

const TRANTYPE = "UserOrUserMaster";

export const FETCH_USERMASTER_START = "FETCH_USERMASTER_START";
export const FETCH_USERMASTER_SUCCESS = "FETCH_USERMASTER_SUCCESS";
export const FETCH_USERMASTER_FAIL = "FETCH_USERMASTER_FAIL";

export const FETCH_USERADDRESS_START = "FETCH_USERADDRESS_START";
export const FETCH_USERADDRESS_SUCCESS = "FETCH_USERADDRESS_SUCCESS";
export const FETCH_USERADDRESS_FAIL = "FETCH_USERADDRESS_FAIL";

export const FETCH_USERACCESS_START = "FETCH_USERACCESS_START";
export const FETCH_USERACCESS_SUCCESS = "FETCH_USERACCESS_SUCCESS";
export const FETCH_USERACCESS_FAIL = "FETCH_USERACCESS_FAIL";

export const FETCH_USERGROUP_START = "FETCH_USERGROUP_START";
export const FETCH_USERGROUP_SUCCESS = "FETCH_USERGROUP_SUCCESS";
export const FETCH_USERGROUP_FAIL = "FETCH_USERGROUP_FAIL";

export const InsUpdtUserMaster = (pInsUpdtType, pUserMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;

      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        UserType: pUserMaster.userType,
        UserId: pUserMaster.userId,
        UserTypeRef: pUserMaster.userTypeRef,
        UserName: pUserMaster.userName,
        gender: pUserMaster.Gender,
        email: pUserMaster.email,
        mobile: pUserMaster.mobile,
        password: pUserMaster.password,
        RegisterFrom: pUserMaster.RegisterFrom,
        hasDemographyInfo: pUserMaster.hasDemographyInfo,
        Name: pUserMaster.Name,
        DOBmmdd: pUserMaster.DOBmmdd,
        DOByyyy: pUserMaster.DOByyyy,
        AnniversaryMMDD: pUserMaster.AnniversaryMMDD,
        AnniversaryYYYY: pUserMaster.AnniversaryYYYY,
        Add1: pUserMaster.Add1,
        Add2: pUserMaster.Add2,
        Add3: pUserMaster.Add3,
        GstNo: pUserMaster.GstNo,
        UpdtUsr: UpdtUsr,
        DOBmmdd: pUserMaster.DOBmmdd,
        DOByyyy: pUserMaster.DOByyyy,
        AnniversaryMMDD: pUserMaster.AnniversaryMMDD,
        AnniversaryYYYY: pUserMaster.AnniversaryYYYY,
        Add1: pUserMaster.Add1,
        Add2: pUserMaster.Add2,
        User_Group: pUserMaster.User_Group,
        IsActive: pUserMaster.IsActive,
        Show_Cashier_Alert: pUserMaster.Show_Cashier_Alert,
        Show_Kitchen_Alert: pUserMaster.Show_Kitchen_Alert,
        Show_Admin_Alert: pUserMaster.Show_Admin_Alert,
        Show_Waiter_Alert: pUserMaster.Show_Waiter_Alert,
      };

      // console.log("jjjj", data);
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "user-master/InsUpdtUserMaster",
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
      dispatch(fetchUserMasters(pUserMaster.userType));
    } catch (ex) {
      // console.log(ex.sqlMessage);
      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error: ex.message,
      });
    }
  };
};

export const fetchUserMasters = (userType) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USERMASTER_START, userType: userType });
    try {
      const token = getState().LoginReducer.token;
      const res = await axios.post("user-master/getUserMaster", {
        CompCode: getState().LoginReducer.CompCode,
        UserType: userType,
      });
      const resData = res.data.data;
      const userMasters = [];
      for (const key in resData) {
        userMasters.push(
          new UserMaster(
            resData[key].SrNo,
            resData[key].UserType,
            resData[key].UserId,
            resData[key].EmpId,
            resData[key].UserName,
            resData[key].gender,
            resData[key].email,
            resData[key].mobile,
            resData[key].password,
            resData[key].RegisterFrom,
            resData[key].hasDemographyInfo,
            resData[key].Name,
            resData[key].DOBmmdd,
            resData[key].DOByyyy,
            resData[key].AnniversaryMMDD,
            resData[key].AnniversaryYYYY,
            resData[key].Add1,
            resData[key].Add2,
            resData[key].Add3,
            resData[key].GstNo,
            resData[key].User_Group,
            resData[key].IsActive,
            resData[key].Show_Cashier_Alert,
            resData[key].Show_Kitchen_Alert,
            resData[key].Show_Admin_Alert,
            resData[key].Show_Waiter_Alert
          )
        );
      }
      // console.log(userMasters, "mmmmmmm");
      dispatch({
        type: FETCH_USERMASTER_SUCCESS,
        userType: userType,
        userMasters: userMasters,
      });
    } catch (err) {
      // console.log("fetch usermaster", err);
      dispatch({
        type: FETCH_USERMASTER_FAIL,
        userType: userType,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const fetchUserAccess = (pUserId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USERACCESS_START, userId: pUserId });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `user-master/getUserAccess/${CompCode}/${pUserId}`
      );
      const resData = res.data.data;
      const userAccess = [];

      for (const key in resData) {
        userAccess.push(
          new UserAccess(
            resData[key].ModGroupId,
            resData[key].ModGroupDesc,
            resData[key].ModuleId,
            resData[key].ModuleName,
            resData[key].Rights
          )
        );
      }
      // console.log(userMasters, "mmmmmmm");
      dispatch({
        type: FETCH_USERACCESS_SUCCESS,
        userAccess: userAccess,
      });
    } catch (err) {
      dispatch({
        type: FETCH_USERACCESS_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const fetchUserGroup = (userType) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USERGROUP_START, userId: userType });
    try {
      const token = getState().LoginReducer.token;
      const res = await axios.post("user-master/getUserMaster", {
        CompCode: getState().LoginReducer.CompCode,
        UserType: userType,
      });
      const resData = res.data.data;
      const userGroupMaster = [];

      for (const key in resData) {
        userGroupMaster.push(
          new UserMaster(
            resData[key].SrNo,
            resData[key].UserType,
            resData[key].UserId,
            resData[key].EmpId,
            resData[key].UserName,
            resData[key].gender,
            resData[key].email,
            resData[key].mobile,
            resData[key].password,
            resData[key].RegisterFrom,
            resData[key].hasDemographyInfo,
            resData[key].Name
          )
        );
      }
      // console.log(userMasters, "mmmmmmm");
      dispatch({
        type: FETCH_USERGROUP_SUCCESS,
        userGroupMaster: userGroupMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_USERGROUP_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtUserAccess = (
  pUserType,
  pUserId,
  pUserAccessType,
  pUserGroupAccessId,
  pDetails
) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: "InsUpdtUserAccess" });
    // console.log(
    //   pUserType,
    //   pUserId,
    //   pUserAccessType,
    //   pUserAccessType === "I" ? null : pUserGroupAccessId,
    //   pDetails,
    //   "the data of user Access Submit"
    // );
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        header: {
          CompCode: CompCode,
          UserType: pUserType,
          UserId: pUserId,
          UserAccessType: pUserAccessType,
          UserGroupAccessId:
            pUserAccessType === "I" ? null : pUserGroupAccessId,
          UpdtUsrId: UpdtUsr,
        },
        details: pDetails,
      };
      const res = await axios.post("user-master/insUpdtUserAccess", {
        data,
      });
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "InsUpdtUserAccess",
        data: res.data.data,
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "InsUpdtUserAccess",
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};
