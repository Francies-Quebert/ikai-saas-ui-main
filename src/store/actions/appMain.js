import * as actionTypes from "./actionTypes";
import axios from "../../axios";
import AppConfig from "../../models/app-config";
import UserInfo from "../../models/user-info";
// import AppService from "../../models/app-service";
import AppService from "../../models/app-service";
import AppServicePackage from "../../models/app-service-package";
import AppServiceType from "../../models/app-servicetypes";
import AppPromos from "../../models/app-promo";
import AppLocation from "../../models/app-location";
import AppSlots from "../../models/app-slots";
import PackageMaster from "../../models/package-master";
import AppUserConfigs from "../../models/app-user-configs";
import ServiceSlotLocMapp from "../../models/app-service-slot-loc-mapp";
import AppNotificationTemplate from "../../models/app-notification-tmpl";
import AppUserPushNotification from "../../models/app-user-push-notifications";
import OtherMaster from "../../models/othermaster";
import UserPatientAddress from "../../models/app-user-patient-address";
import { fetchEmployeeMasters } from "./employeemaster";
import _ from "lodash";
import SysSequenceConfig from "../../models/sys-sequence-config";

// import EmployeeMaster from "../../models/emloyeemaster";
import {
  Home,
  File,
  Headphones,
  HelpCircle,
  Settings,
  Database,
  AlertTriangle,
  Users,
  FileText,
} from "react-feather";
import KeyboardHotKeyConfig from "../../models/KeyboardHotKeyConfig";
export const fetchAppMain = () => {
  return (dispatch, getState) => {
    Promise.all([
      dispatch({ type: actionTypes.INITIAL_LOAD_RESET }),
      dispatch(fetchUserInfo()),
      dispatch(fetchAppConfig()),
      dispatch(fetchServices()),
      dispatch(fetchPromos()),
      dispatch(fetchServiceTypes()),
      dispatch(fetchLocations()),
      dispatch(fetchServicePackages()),
      dispatch(fetchSlots()),
      dispatch(fetchServiceSlotLocMapp()),
      dispatch(fetchNotificationTemplate()),
      dispatch(fetchPushNotifications()),
      dispatch(fetchOtherMasterGrade()),
      dispatch(fetchPackages()),
      dispatch(fetchOtherMasterQualification()),
      dispatch(fetchOtherMasterCategory()),
      dispatch(fetchOtherMasterExperience()),
      dispatch(fetchOtherMasterDesignations()),
      dispatch(fetchOtherMasterOrderStatus()),
      dispatch(fetchOtherMasterSupportStatus()),
      dispatch(fetchEmployeeMasters()),
      dispatch(fetchSysSequenceConfig()),
      dispatch(fetchReportDataKeys()),
      dispatch(fetchKotMasterStatus()),
      dispatch(fetchKeyboardHotKeyConfig()),
      dispatch(fetchOtherMasterUserGroup()),
      dispatch(fetchOtherMasterIncome()),
      dispatch(fetchOtherMasterExpense()),
      dispatch(fetchOtherMasterSupplierType()),
      dispatch(fetchOtherMasterReasonsMaster()),
      dispatch(fetchRoundOffConfig()), //Roundoff Config
    ]).then(() => {
      Promise.all([dispatch(fetchUserMenu())]).then(() => {
        dispatch({ type: actionTypes.INITIAL_LOAD_COMPLETED });
      });
    });
  };
};

export const fetchSysSequenceConfig = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_SYSSEQUENCECONFIG_START });
    try {
      const token = getState().LoginReducer.token;
      let CompCode = localStorage.getItem("CompCode");
      // const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `sys-sequence-configmaster/getSys_Sequence_ConfigMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const sysSequenceConfig = [];
      for (const key in resData) {
        sysSequenceConfig.push(
          new SysSequenceConfig(
            resData[key].Id,
            resData[key].TranType,
            resData[key].ConfigType,
            resData[key].ResetOn,
            resData[key].Preffix,
            resData[key].Suffix,
            resData[key].Value,
            resData[key].LastGenNo,
            resData[key].EnablePadding,
            resData[key].PaddingLength,
            resData[key].PaddingChar,
            resData[key].TranDesc,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].ConfigTypeDesc
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_SYSSEQUENCECONFIG_SUCCESS,
        sysSequenceConfig: sysSequenceConfig,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_SYSSEQUENCECONFIG_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

const getRightsArray = (rightsString) => {
  if (rightsString) {
    let tmpObjects = [];
    _.split(rightsString, ",").map((item) => {
      let hh = item.split("#");
      tmpObjects.push({ RightCode: hh[1], RightDesc: hh[2], RightVal: hh[0] });
    });
    return tmpObjects;
  } else {
    return [];
  }
};

const hasViewAccess = (rightsString) => {
  let ViewRights = false;
  _.split(rightsString, ",").map((item) => {
    let hh = item.split("#");

    if (hh[1] === "VIEW") {
      // console.log("inside view", hh[0], hh[1]);
      if (hh[0] === "Y") {
        ViewRights = true;
      }
    }
  });
  return ViewRights;
};
export const fetchUserMenu = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_USERMENU_START });
    const UserId = getState().LoginReducer.userData.userId;
    const CompCode = getState().LoginReducer.CompCode;
    try {
      const res = await axios.get(`appmain/getUserMenu/${CompCode}/${UserId}`);

      const resData = res.data.data;
      let userAccess = [];
      resData.forEach((row) => {
        userAccess.push({ ...row, Rights: getRightsArray(row.Rights) });
      });

      let modGroups = [];
      for (const key in resData) {
        if (resData[key].ModType === "form") {
          let index = modGroups.findIndex(
            (jj) => jj.ModGroupId === resData[key].ModGroupId
          );

          if (index >= 0) {
            if (hasViewAccess(resData[key].Rights)) {
              modGroups[index].children.push({
                Id: resData[key].ModuleId,
                path: resData[key].ModuleSysOption1,
                title: resData[key].ModuleName,
                type: resData[key].ModuleSysOption2,
                ModSysOption3: resData[key].ModuleSysOption3,
                ModSysOption4: resData[key].ModuleSysOption4,
                ModSysOption5: resData[key].ModuleSysOption5,
                Rights: getRightsArray(resData[key].Rights),
                // hasViewAccess: hasViewAccess(resData[key].Rights),
              });
            }
          } else {
            modGroups.push({
              ModGroupId: resData[key].ModGroupId,
              title: resData[key].ModGroupDesc,
              icon: resData[key].ModGroupIcon,
              type: "sub",
              badgeType: "primary",
              active: false,
              children: [],
            });

            if (hasViewAccess(resData[key].Rights)) {
              index = modGroups.length - 1;
              modGroups[index].children.push({
                Id: resData[key].ModuleId,
                path: resData[key].ModuleSysOption1,
                title: resData[key].ModuleName,
                type: resData[key].ModuleSysOption2,
                ModSysOption3: resData[key].ModuleSysOption3,
                ModSysOption4: resData[key].ModuleSysOption4,
                ModSysOption5: resData[key].ModuleSysOption5,
                Rights: getRightsArray(resData[key].Rights),
                // hasViewAccess: hasViewAccess(resData[key].Rights),
              });
            }
          }
        }
      }

      const userMenu = modGroups.filter((item) => item.children.length > 0);
      // console.log("fetchUserMenu", userMenu);

      dispatch({
        type: actionTypes.FETCH_USERMENU_SUCCESS,
        userMenu: userMenu,
        userAccess: userAccess,
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: actionTypes.FETCH_USERMENU_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const crudUserPatientAddress = (
  OprationType,
  addressId,
  latitude,
  longitude,
  geoLocationName,
  add1,
  add2,
  add3,
  addressTag
) => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.CRUD_USER_PATIENT_ADDRESS_START });
    try {
      const UserType = getState().currentOrder.patientProfile.userType;
      const UserId = getState().currentOrder.patientProfile.userId;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        OprationType: OprationType,
        UserType: UserType,
        UserId: UserId,
        AddressId: addressId,
        latitude: latitude,
        longitude: longitude,
        geoLocationName: geoLocationName,
        add1: add1,
        add2: add2,
        add3: add3,
        AddressTag: addressTag,
        UpdtUsr: UserId,
      };
      const token = getState().LoginReducer.token;
      // console.log('while api call', data)
      const res = await axios.post("appmain/crudUserPatientAddress", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.CRUD_USER_PATIENT_ADDRESS_FAIL,
      //     error: "Something went wrong!!"
      //   });
      // }

      const resData = res.data.data;
      // console.log('res from api', resData)
      let patientAddress = new UserPatientAddress();
      for (const key in resData) {
        patientAddress = new UserPatientAddress(
          resData[key].AddressId,
          "" + resData[key].latitude,
          "" + resData[key].longitude,
          resData[key].geoLocationName,
          resData[key].add1,
          resData[key].add2,
          resData[key].add3,
          resData[key].AddressTag
        );
      }
      // console.log('ss',patientProfile.profileId)

      if (OprationType === "D") {
        dispatch({
          type: actionTypes.CRUD_USER_PATIENT_ADDRESS_SUCCESS,
          addressId: addressId,
          oprationType: OprationType,
        });
      } else {
        dispatch({
          type: actionTypes.CRUD_USER_PATIENT_ADDRESS_SUCCESS,
          patientAddress: patientAddress,
          oprationType: OprationType,
        });
      }
    } catch (err) {
      // console.log("Error on api call", err);
      dispatch({
        type: actionTypes.CRUD_USER_PATIENT_ADDRESS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchPackages = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_PACKAGE_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`appmain/getPackages/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resData = res.data.data;
      const packages = [];

      for (const key in resData) {
        // console.log( resData[key].IsActive)
        packages.push(
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
        type: actionTypes.FETCH_PACKAGE_SUCCESS,
        packages: packages,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_PACKAGE_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

// 20201102
const fetchOtherMasterGrade = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_GRADE_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`other-master/getGrade/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SLOTS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const otherMasterGrade = [];

      for (const key in resData) {
        otherMasterGrade.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_GRADE_SUCCESS,
        otherMasterGrade: otherMasterGrade,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_GRADE_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterQualification = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_QLF_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`other-master/getQualification/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SLOTS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const otherMasterQLF = [];

      for (const key in resData) {
        otherMasterQLF.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_QLF_SUCCESS,
        otherMasterQLF: otherMasterQLF,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_QLF_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchOtherMasterSequence = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_SEQ_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`other-master/getSequence/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const otherMasterSEQ = [];

      for (const key in resData) {
        otherMasterSEQ.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive
          )
        );
      }

      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_SEQ_SUCCESS,
        otherMasterSEQ: otherMasterSEQ,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_SEQ_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterCategory = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_CATEGORY_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`other-master/getCategory/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SLOTS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const otherMasterCategory = [];

      for (const key in resData) {
        otherMasterCategory.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_CATEGORY_SUCCESS,
        otherMasterCategory: otherMasterCategory,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_CATEGORY_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterExperience = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_EXPERIENCE_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`other-master/getExperience/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SLOTS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const otherMasterExperience = [];

      for (const key in resData) {
        otherMasterExperience.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_EXPERIENCE_SUCCESS,
        otherMasterExperience: otherMasterExperience,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_EXPERIENCE_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterDesignations = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_DESIGNATIONS_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`other-master/getDesignations/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const otherMasterDesignations = [];

      for (const key in resData) {
        otherMasterDesignations.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_DESIGNATIONS_SUCCESS,
        otherMasterDesignations: otherMasterDesignations,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_DESIGNATIONS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterOrderStatus = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_ORDERSTATUS_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`other-master/getOrderStatus/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const otherMasterOrderStatus = [];

      for (const key in resData) {
        otherMasterOrderStatus.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_ORDERSTATUS_SUCCESS,
        otherMasterOrderStatus: otherMasterOrderStatus,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_ORDERSTATUS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterSupportStatus = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_SUPPORTSTATUS_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`other-master/getSupportStatus/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const otherMasterSupportStatus = [];

      for (const key in resData) {
        otherMasterSupportStatus.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_SUPPORTSTATUS_SUCCESS,
        otherMasterSupportStatus: otherMasterSupportStatus,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_SUPPORTSTATUS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

//20191220
const fetchPushNotifications = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_PUSH_NOTIFICATION_START });
    try {
      const token = getState().LoginReducer.token;
      const userType = getState().LoginReducer.userData.userType;
      const userId = getState().LoginReducer.userData.userId;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        userType: userType,
        userId: userId,
      };

      // console.log('while api call', data)
      const res = await axios.post("appmain/getPushNotifications", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_PUSH_NOTIFICATION_FAIL,
      //     error: "Something went wrong!!"
      //   });
      // }

      const resData = res.data.data;
      let userPushNotifications = [];
      for (const key in resData) {
        userPushNotifications.push(
          new AppUserPushNotification(
            resData[key].Id,
            resData[key].NotificationCode,
            resData[key].NotificationType,
            resData[key].UserType,
            resData[key].UserId,
            resData[key].Subject,
            resData[key].Title,
            resData[key].Message,
            resData[key].NotificationDttm,
            resData[key].DeliveryStatus
          )
        );

        dispatch({
          type: actionTypes.FETCH_PUSH_NOTIFICATION_SUCCESS,
          userPushNotifications: userPushNotifications,
        });
      }
    } catch (err) {
      // console.log(err);
      dispatch({
        type: actionTypes.FETCH_PUSH_NOTIFICATION_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchNotificationTemplate = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_NOTIFICATION_TMPL_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `appmain/getNotificationTemplate/${CompCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_NOTIFICATION_TMPL_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const notificationTemplates = [];

      for (const key in resData) {
        notificationTemplates.push(
          new AppNotificationTemplate(
            resData[key].NotificationCode,
            resData[key].NotificationType,
            resData[key].NotificationDesc,
            resData[key].Subject,
            resData[key].Title,
            resData[key].Message,
            resData[key].Option1,
            resData[key].Option2,
            resData[key].Option3,
            resData[key].Option4,
            resData[key].Option5,
            resData[key].Option6,
            resData[key].Option7,
            resData[key].Option8,
            resData[key].Option9,
            resData[key].Option10
          )
        );
      }
      // console.log(locations);
      dispatch({
        type: actionTypes.FETCH_NOTIFICATION_TMPL_SUCCESS,
        notificationTemplates: notificationTemplates,
      });
    } catch (err) {
      // console.log(err)
      dispatch({
        type: actionTypes.FETCH_NOTIFICATION_TMPL_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const updateUserInfo = (
  userTypeRef,
  userName,
  email,
  mobile,
  gender
) => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.UPDATE_USERINFO_START });
    try {
      const token = getState().LoginReducer.token;
      const userType = getState().LoginReducer.userData.userType;
      const userId = getState().LoginReducer.userData.userId;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        userType: userType,
        userId: userId,
        userTypeRef: userTypeRef,
        userName: userName,
        email: email,
        mobile: mobile,
        gender: gender,
        loginUserId: userId,
      };
      //console.log("sent data", data);
      const res = await axios.post("appmain/updateUserInfo", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.UPDATE_USERINFO_FAIL,
      //     error: "Something went wrong!!"
      //   });
      // }

      const resData = res.data.data;
      //console.log(resData);
      //   console.log(resData);
      let userInfo = new UserInfo();
      for (const key in resData) {
        userInfo = new UserInfo(
          resData[key].UserType,
          resData[key].UserId,
          resData[key].UserTypeRef,
          resData[key].UserName,
          resData[key].email,
          resData[key].mobile,
          resData[key].gender,
          resData[key].hasDemographyInfo
        );
      }

      dispatch({
        type: actionTypes.UPDATE_USERINFO_SUCCESS,
        userInfo: userInfo,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.UPDATE_USERINFO_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchLocations = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_LOCATION_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`appmain/getLocations/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_LOCATION_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const locations = [];

      for (const key in resData) {
        locations.push(
          new AppLocation(resData[key].LocationId, resData[key].LocationName)
        );
      }
      //console.log(locations);
      dispatch({
        type: actionTypes.FETCH_LOCATION_SUCCESS,
        locations: locations,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_LOCATION_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchSlots = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_SLOTS_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`appmain/getSlots/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SLOTS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const slots = [];

      for (const key in resData) {
        slots.push(new AppSlots(resData[key].Id, resData[key].SlotName));
      }
      dispatch({
        type: actionTypes.FETCH_SLOTS_SUCCESS,
        slots: slots,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_SLOTS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchServiceSlotLocMapp = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_SLOT_SERVICE_LOC_MAPP_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`appmain/getServiceSlotLocMapp/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SLOT_SERVICE_LOC_MAPP_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const service_slot_loc_mapp = [];

      for (const key in resData) {
        service_slot_loc_mapp.push(
          new ServiceSlotLocMapp(
            resData[key].ServiceId,
            resData[key].SlotId,
            resData[key].LocationId
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_SLOT_SERVICE_LOC_MAPP_SUCCESS,
        service_slot_loc_mapp: service_slot_loc_mapp,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_SLOT_SERVICE_LOC_MAPP_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchServiceTypes = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_SERVICETYPE_START });
    try {
      const token = getState().LoginReducer.token;
      // const FileUploadPath = getState().AppMain.appConfigs.find(
      //   (aa) => aa.configCode === "UPLOAD_PATH"
      // );
      // console.log( "SERVICE TYPE FETCHING")s;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        showInActiveAsWell: true,
      };
      const res = await axios.post("appmain/getServiceTypes", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SERVICETYPE_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const serviceTypes = [];

      for (const key in resData) {
        // console.log(resData[key].IsActive.data[0]);
        serviceTypes.push(
          new AppServiceType(
            resData[key].ServiceTypeCode,
            resData[key].ServiceTypeTitle,
            resData[key].ServiceTypeDesc,
            resData[key].ServiceTypeDescDetail,
            resData[key].ServiceTypeImageURI,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].orderby,
            resData[key].pathType
          )
        );
      }
      //console.log(serviceTypes);
      dispatch({
        type: actionTypes.FETCH_SERVICETYPE_SUCCESS,
        serviceTypes: serviceTypes,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_SERVICETYPE_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchServices = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_SERVICES_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`appmain/getServices/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resData = res.data.data;
      const services = [];

      for (const key in resData) {
        services.push(
          new AppService(
            resData[key].ServiceType,
            resData[key].ServiceId,
            resData[key].ServiceTitle,
            resData[key].ServiceDesc,
            resData[key].LocationId,
            resData[key].LocationName,
            +resData[key].rate,
            resData[key].discType,
            +resData[key].discValue,
            +resData[key].totaldisc,
            +resData[key].actualRate,
            resData[key].PackageId
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_SERVICES_SUCCESS,
        services: services,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_SERVICES_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchServicePackages = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_SERVICEPACKAGE_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`appmain/getServicePackages/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SERVICES_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const servicePackages = [];

      for (const key in resData) {
        servicePackages.push(
          new AppServicePackage(
            resData[key].serviceId,
            resData[key].PackageId,
            resData[key].PackageTitle,
            resData[key].PackageDesc,
            resData[key].PackageUnit,
            resData[key].PackageUnitDesc,
            resData[key].PackageDiscType,
            +resData[key].PackageDiscValue
          )
        );
      }

      dispatch({
        type: actionTypes.FETCH_SERVICEPACKAGE_SUCCESS,
        servicePackages: servicePackages,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_SERVICEPACKAGE_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchPromos = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_PROMOS_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`appmain/getPromos/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_PROMOS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const promos = [];

      for (const key in resData) {
        promos.push(
          new AppPromos(
            resData[key].Id,
            resData[key].PromoTitle,
            resData[key].PromoImageUri,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }

      dispatch({
        type: actionTypes.FETCH_PROMOS_SUCCESS,
        promos: promos,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_PROMOS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchAppConfig = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_APP_CONFIG_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`appmain/getConfigs/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_APP_CONFIG_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      let compName = resData.find((aa) => aa.ConfigCode === "COMPANY");
      // console.log(compName, "compName");
      document.title = `Ekai : ${compName.Value1}`;
      const appconfigs = [];

      for (const key in resData) {
        appconfigs.push(
          new AppConfig(
            resData[key].id,
            resData[key].ConfigCode,
            resData[key].ConfigName,
            resData[key].Value1,
            resData[key].Value2,
            resData[key].ConfigDesc,
            resData[key].ConfigAccessLevel,
            resData[key].ConfigType,
            resData[key].SysOption1,
            resData[key].SysOption2
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_APP_CONFIG_SUCCESS,
        appConfigs: appconfigs,
      });
    } catch (err) {
      // console.log("fetch Config err", err);
      dispatch({
        type: actionTypes.FETCH_APP_CONFIG_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchUserInfo = (pUserType, pUserId) => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_USERINFO_START });
    try {
      const userType = pUserType
        ? pUserType
        : getState().LoginReducer.userData.userType;
      const userId = pUserId
        ? pUserId
        : getState().LoginReducer.userData.userId;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        userType: userType,
        userId: userId,
      };

      const res = await axios.post(`appmain/getUserInfo`, data);
      const resData = res.data.data;

      let userInfo;
      for (const key in resData) {
        userInfo = {
          userType: resData[key].UserType,
          userId: resData[key].UserId,
          userTypeRef: resData[key].UserTypeRef,
          userName: resData[key].UserName,
          email: resData[key].email,
          mobileNo: resData[key].mobile,
          gender: resData[key].gender,
          hasDemographyInfo: resData[key].hasDemographyInfo,
          defaultPath: resData[key].defaultPath,
        };
      }

      dispatch({
        type: actionTypes.FETCH_USERINFO_SUCCESS,
        userInfo: userInfo,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_USERINFO_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const setCurrentLocation = (currLoc) => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.SET_CURR_LOCATION_START });
    try {
      dispatch({
        type: actionTypes.SET_CURR_LOCATION_SUCCESS,
        currLoc: currLoc,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.SET_CURR_LOCATION_FAIL,
        error: err.message,
      });
    }
  };
};

export const fetchReportDataKeys = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_REPORT_DATA_KEYS_START });
    try {
      const userType = getState().LoginReducer.userData.userType;
      const CompCode = getState().LoginReducer.CompCode;
      const userId = getState().LoginReducer.userData.userId;
      const data = {
        userType: userType,
        userId: userId,
      };

      const res = await axios.get(`appmain/getReportDataKeys/${CompCode}`);
      const resData = res.data.data;

      dispatch({
        type: actionTypes.FETCH_REPORT_DATA_KEYS_SUCCESS,
        reportDataKey: resData,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_REPORT_DATA_KEYS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
const fetchKotMasterStatus = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_KOTMASTERSTATUS_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `other-master/getKotMasterStatus/${CompCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const kotMasterStatus = [];

      for (const key in resData) {
        kotMasterStatus.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_KOTMASTERSTATUS_SUCCESS,
        kotMasterStatus: kotMasterStatus,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_KOTMASTERSTATUS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

export const fetchKeyboardHotKeyConfig = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_KEYBOARD_HOTKEY_CONFIG_START });
    try {
      // const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `keyboard-hotkey-config/getKeyboardHotConfig/${CompCode}`
      );
      const resData = res.data.data;
      const keyboardHotKeyConfig = [];
      for (const key in resData) {
        keyboardHotKeyConfig.push(
          new KeyboardHotKeyConfig(
            resData[key].CompId,
            resData[key].CompName,
            resData[key].CompDesc,
            resData[key].ModuleGroup,
            resData[key].OrderBy,
            resData[key].EventSrNo,
            resData[key].EventCode,
            resData[key].EventName,
            resData[key].HotKey
          )
        );
      }

      dispatch({
        type: actionTypes.FETCH_KEYBOARD_HOTKEY_CONFIG_SUCCESS,
        keyboardHotKeyConfig: keyboardHotKeyConfig,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_KEYBOARD_HOTKEY_CONFIG_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterUserGroup = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_USERGROUP_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`other-master/getUserGroup/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const otherMasterUserGroup = [];

      for (const key in resData) {
        otherMasterUserGroup.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_USERGROUP_SUCCESS,
        otherMasterUserGroup: otherMasterUserGroup,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_USERGROUP_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterIncome = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_INCOME_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`other-master/getIncomeMaster/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const incomeMaster = [];

      for (const key in resData) {
        incomeMaster.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_INCOME_SUCCESS,
        incomeMaster: incomeMaster,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_INCOME_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterExpense = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_EXPENSE_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`other-master/getExpenseMaster/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const expenseMaster = [];

      for (const key in resData) {
        expenseMaster.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_EXPENSE_SUCCESS,
        expenseMaster: expenseMaster,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_EXPENSE_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterSupplierType = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_SUPPTYP_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`other-master/getSupplierType/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const otherMasterSupplierType = [];

      for (const key in resData) {
        otherMasterSupplierType.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].SysOption1,
            resData[key].SysOption2,
            resData[key].SysOption3,
            resData[key].SysOption4,
            resData[key].SysOption5
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_SUPPTYP_SUCCESS,
        otherMasterSupplierType: otherMasterSupplierType,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_SUPPTYP_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
//fetchRoundOffConfig
const fetchRoundOffConfig = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_ROUNDOFF_CONFIG_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `roundOffConfig/getRoundOffConfigData/${CompCode}`
      );
      const resData = res.data.data;
      let roundOffConfigs = [];
      // console.log(resData, "resData");
      for (const key in resData) {
        roundOffConfigs.push({ ...resData[key] });
      }
      dispatch({
        type: actionTypes.FETCH_ROUNDOFF_CONFIG_SUCCESS,
        roundOffConfigs,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_ROUNDOFF_CONFIG_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};

const fetchOtherMasterReasonsMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_OTHERMASTER_REASONSMASTER_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      const res = await axios.get(`other-master/getReasonsMaster/${CompCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const otherMasterReasons = [];

      for (const key in resData) {
        otherMasterReasons.push(
          new OtherMaster(
            resData[key].Id,
            resData[key].MasterType,
            resData[key].ShortCode,
            resData[key].MasterDesc,
            resData[key].IsActive
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_REASONSMASTER_SUCCESS,
        otherMasterReasons: otherMasterReasons,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_OTHERMASTER_REASONSMASTER_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
