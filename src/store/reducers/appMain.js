import * as actionTypes from "../actions/actionTypes";

import { updateObject } from "../../shared/utility";
import userInfo from "../../models/user-info";
import AppUserConfigs from "../../models/app-user-configs";

const initialState = {
  error: null,
  isLoading: false,
  appconfigs: [],
  promos: [],
  services: [],
  packageMasters: [],
  servicePacakages: [],
  serviceTypes: [],
  locations: [],
  slots: [],
  service_slot_loc_mapp: [],
  userMenu: [],
  userAccess: [],
  userInfo: new userInfo(),
  currentlocation: { LocationId: null, LocationName: null },
  userConfigs: new AppUserConfigs(),
  notificationTmpl: [],
  userPushNotifications: [],
  isLoaded: null,
  otherMasterGrade: null,
  otherMasterQLF: null,
  otherMasterCategory: null,
  otherMasterExperience: null,
  otherMasterDesignations: null,
  otherMasterOrderStatus: null,
  otherMasterSupportStatus: null,
  otherMasterSEQ: null,
  patientAddresses: [],
  sysSequenceConfig: [],
  reportDataKey: [],
  // employeeMasters: []
  kotMasterStatus: [],
  keyboardHotKeyConfig: [],
  otherMasterUserGroup: null,
  incomeMaster: null,
  expenseMaster: null,
  otherMasterSupplierType: null,
  otherMasterReasons: null,
  roundOffConfigs: [],
  CompCode: null,
};

const fetchSysSequenceConfigStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchSysSequenceConfigSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    sysSequenceConfig: action.sysSequenceConfig,
  });
};

const fetchSysSequenceConfigFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    sysSequenceConfig: [],
  });
};

const fetchUserMenuStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    userMenu: [],
    userAccess: [],
  });
};

const fetchUserMenuSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    userMenu: action.userMenu,
    userAccess: action.userAccess,
  });
};

const fetchUserMenuError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    userMenu: [],
    isLoading: false,
    userAccess: [],
  });
};

const fetchPackageStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    packageMasters: null,
  });
};

const fetchPackageSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    packageMasters: action.packages,
  });
};

const fetchPackageError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    packageMasters: null,
    isLoading: false,
  });
};

const fetchOtherMasterSupportStatusStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterSupportStatus: null,
  });
};

const fetchOtherMasterSupportStatusSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterSupportStatus: action.otherMasterSupportStatus,
  });
};

const fetchOtherMasterSupportStatusError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterSupportStatus: null,
    isLoading: false,
  });
};

const fetchOtherMasterOrderStatusStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterOrderStatus: null,
  });
};

// const initialState = {
//   error: null,
//   isLoading: null,
//   employeeMasters: []
// };

const fetchEmployeeMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchEmployeeMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    employeeMasters: action.employeeMasters,
  });
};

const fetchEmployeeMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    employeeMasters: [],
  });
};

const fetchOtherMasterOrderStatusSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterOrderStatus: action.otherMasterOrderStatus,
  });
};

const fetchOtherMasterOrderStatusError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterOrderStatus: null,
    isLoading: false,
  });
};

const fetchOtherMasterGradeStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterGrade: null,
  });
};

const fetchOtherMasterGradeSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterGrade: action.otherMasterGrade,
  });
};

const fetchOtherMasterGradeError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterGrade: null,
    isLoading: false,
  });
};

const fetchOtherMasterQualificationError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterQLF: null,
    isLoading: false,
  });
};

const fetchOtherMasterQualificationStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterQLF: null,
  });
};

const fetchOtherMasterSequenceSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterSEQ: action.otherMasterSEQ,
  });
};

const fetchOtherMasterSequenceError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterSEQ: null,
    isLoading: false,
  });
};

const fetchOtherMasterSequenceStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterSEQ: null,
  });
};

const fetchOtherMasterQualificationSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterQLF: action.otherMasterQLF,
  });
};

const fetchOtherMasterCategoryError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterCategory: null,
    isLoading: false,
  });
};

const fetchOtherMasterCategoryStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterCategory: null,
  });
};

const fetchOtherMasterCategorySuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterCategory: action.otherMasterCategory,
  });
};

const fetchOtherMasterExperienceError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterExperience: null,
    isLoading: false,
  });
};

const fetchOtherMasterExperienceStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterExperience: null,
  });
};

const fetchOtherMasterExperienceSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterExperience: action.otherMasterExperience,
  });
};

const fetchOtherMasterDesignationsError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterDesignations: null,
    isLoading: false,
  });
};

const fetchOtherMasterDesignationsStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterDesignations: null,
  });
};

const fetchOtherMasterDesignationsSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterDesignations: action.otherMasterDesignations,
  });
};

const fetchAppConfigStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    appconfigs: [],
  });
};

const fetchAppConfigSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    appconfigs: action.appConfigs,
  });
};

const fetchAppConfigError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    appconfigs: [],
    isLoading: false,
  });
};

const fetchUserInfoStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    userInfo: new userInfo(),
  });
};

const fetchUserInfoSuccess = (state, action) => {
  // console.log("user info reducer", action);
  return updateObject(state, {
    userInfo: action.userInfo,
    error: null,
    isLoading: false,
  });
};

const fetchUserInfoError = (state, action) => {
  // console.log("user info reducer", action);
  return updateObject(state, {
    isLoading: false,
    userInfo: new userInfo(),
    error: action.error,
  });
};

const fetchServicesStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    services: null,
  });
};

const fetchServicesSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    services: action.services,
  });
};

const fetchServicesError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    services: null,
    isLoading: false,
  });
};

const fetchServicePackageStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    servicePacakages: null,
  });
};

const fetchServicePackageSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    servicePacakages: action.servicePackages,
  });
};

const fetchServicePackageError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    servicePacakages: null,
    isLoading: false,
  });
};

const fetchPromosStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    promos: null,
  });
};

const fetchPromosSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    promos: action.promos,
  });
};

const fetchPromosError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    promos: null,
    isLoading: false,
  });
};

const fetchServiceTypeStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    serviceTypes: null,
  });
};

const fetchServiceTypeSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    serviceTypes: action.serviceTypes,
  });
};

const fetchServiceTypeError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    serviceTypes: null,
    isLoading: false,
  });
};

const fetchLocationStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    locations: null,
  });
};

const fetchLocationSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    locations: action.locations,
  });
};

const fetchLocationError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    locations: null,
    isLoading: false,
  });
};

//Hari on 20191211
const fetchSlotStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    slots: null,
  });
};

const fetchSlotSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    slots: action.slots,
  });
};

const fetchSlotError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    slots: null,
    isLoading: false,
  });
};

const fetchServiceSlotLocMappStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    service_slot_loc_mapp: null,
  });
};

const fetchServiceSlotLocMappSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    service_slot_loc_mapp: action.service_slot_loc_mapp,
  });
};

const fetchServiceSlotLocMappError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    service_slot_loc_mapp: null,
    isLoading: false,
  });
};
//20191211

const updateUserInfoStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const updateUserInfoSuccess = (state, action) => {
  // console.log("user info reducer", action);
  return updateObject(state, {
    userInfo: action.userInfo,
    error: null,
    isLoading: false,
  });
};

const updateUserInfoError = (state, action) => {
  // console.log("user info reducer", action);
  return updateObject(state, {
    isLoading: false,
    error: action.error,
  });
};

const fetchPatientProfileStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    patientProfiles: null,
  });
};

const fetchPatientProfileSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    patientProfiles: action.patientProfiles,
  });
};

const fetchPatientProfileError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    patientProfiles: null,
    isLoading: false,
  });
};

const fetchPatientAddressesStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    patientAddresses: null,
  });
};

const fetchPatientAddressesSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    patientAddresses: action.patientAddresses,
  });
};

const fetchPatientAddressesError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    patientAddresses: null,
    isLoading: false,
  });
};

const crudPatientProfileStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    // patientProfiles:null
  });
};

const crudPatientProfileSuccess = (state, action) => {
  if (action.oprationType === "U") {
    const profileIndex = state.patientProfiles.findIndex(
      (prof) => prof.profileId === action.patientProfile.profileId
    );
    const updatedPatientProfiles = [...state.patientProfiles];
    updatedPatientProfiles[profileIndex] = action.patientProfile;

    return updateObject(state, {
      isLoading: false,
      error: null,
      patientProfiles: updatedPatientProfiles,
    });
  } else if (action.oprationType === "I") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      patientProfiles: state.patientProfiles.concat(action.patientProfile),
    });
  } else if (action.oprationType === "D") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      patientProfiles: state.patientProfiles.filter(
        (prof) => prof.profileId !== action.profileId
      ),
    });
  } else {
    return state;
  }
};

const crudPatientProfileError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    // patientProfiles: null,
    isLoading: false,
  });
};

const crudPatientAddressStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const crudPatientAddressSuccess = (state, action) => {
  if (action.oprationType === "U") {
    const addressIndex = state.patientAddresses.findIndex(
      (add) => add.addressId === action.patientAddress.addressId
    );
    // console.log(action);
    const updatedPatientAddresses = [...state.patientAddresses];
    updatedPatientAddresses[addressIndex] = action.patientAddress;

    return updateObject(state, {
      isLoading: false,
      error: null,
      patientAddresses: updatedPatientAddresses,
    });
  } else if (action.oprationType === "I") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      patientAddresses: state.patientAddresses.concat(action.patientAddress),
    });
  } else if (action.oprationType === "D") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      patientAddresses: state.patientAddresses.filter(
        (add) => add.addressId !== action.addressId
      ),
    });
  } else {
    return state;
  }
};

const crudPatientAddressError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    // patientProfiles: null,
    isLoading: false,
  });
};

//20191216
const setCurrLocationStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    currentlocation: null,
  });
};

const setCurrLocationSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    currentlocation: {
      LocationId: action.currLoc[0].LocationId,
      LocationName: action.currLoc[0].LocationName,
    },
  });
};

const setCurrLocationError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    currentlocation: null,
    isLoading: false,
  });
};
//20191216

//20191220
const saveUserLoginLogStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    userConfigs: null,
  });
};

const saveUserLoginLogSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    userConfigs: action.userConfigs,
  });
};

const saveUserLoginLogError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    userConfigs: null,
    isLoading: false,
  });
};

const fetchNotificationTmplStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    notificationTmpl: [],
  });
};

const fetchNotificationTmplSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    notificationTmpl: action.notificationTemplates,
  });
};

const fetchNotificationTmplError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    notificationTmpl: [],
    isLoading: false,
  });
};

const fetchUserPushNotificationStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    userPushNotifications: [],
  });
};

const fetchUserPushNotificationSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    userPushNotifications: action.userPushNotifications,
  });
};

const fetchUserPushNotificationError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    userPushNotifications: [],
    isLoading: false,
  });
};
//20191216

const fetchReportDataKeysStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchReportDataKeysSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    reportDataKey: action.reportDataKey,
  });
};

const fetchReportDataKeysFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    reportDataKey: [],
  });
};

const fetchKOTMasterStatusStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    kotMasterStatus: null,
  });
};

const fetchKOTMasterStatusSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    kotMasterStatus: action.kotMasterStatus,
  });
};

const fetchKOTMasterStatusFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    kotMasterStatus: null,
    isLoading: false,
  });
};

const fetchKeyboardHotKeyConfigStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    keyboardHotKeyConfig: [],
  });
};

const fetchKeyboardHotKeyConfigSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    keyboardHotKeyConfig: action.keyboardHotKeyConfig,
  });
};

const fetchKeyboardHotKeyConfigFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    keyboardHotKeyConfig: [],
    isLoading: false,
  });
};

const fetchOtherMasterUserGroupError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterUserGroup: null,
    isLoading: false,
  });
};

const fetchOtherMasterUserGroupStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterUserGroup: null,
  });
};

const fetchOtherMasterUserGroupSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterUserGroup: action.otherMasterUserGroup,
  });
};

const fetchOtherMasterIncomeStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    incomeMaster: null,
  });
};

const fetchOtherMasterIncomeSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    incomeMaster: action.incomeMaster,
  });
};

const fetchOtherMasterIncomeError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    incomeMaster: null,
    isLoading: false,
  });
};

const fetchOtherMasterExpenseStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    expenseMaster: null,
  });
};

const fetchOtherMasterExpenseSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    expenseMaster: action.expenseMaster,
  });
};

const fetchOtherMasterExpenseError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    expenseMaster: null,
    isLoading: false,
  });
};

const fetchOtherMasterSupplierTypeError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterSupplierType: null,
    isLoading: false,
  });
};

const fetchOtherMasterSupplierTypeStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterSupplierType: null,
  });
};

const fetchOtherMasterSupplierTypeSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterSupplierType: action.otherMasterSupplierType,
  });
};

const fetchOtherMasterReasonsStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    otherMasterReasons: null,
  });
};

const fetchOtherMasterReasonsSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    otherMasterReasons: action.otherMasterReasons,
  });
};

const fetchOtherMasterReasonsError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    otherMasterReasons: null,
    isLoading: false,
  });
};

const fetchRoundOffConfigStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    roundOffConfigs: [],
  });
};

const fetchRoundOffConfigSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    roundOffConfigs: action.roundOffConfigs,
  });
};

const fetchRoundOffConfigError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    roundOffConfigs: [],
    isLoading: false,
  });
};
const setCompanyCode = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    CompCode: action.CompCode,
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_APP_CONFIG_START:
      return fetchAppConfigStart(state, action);
    case actionTypes.FETCH_APP_CONFIG_SUCCESS:
      return fetchAppConfigSuccess(state, action);
    case actionTypes.FETCH_APP_CONFIG_FAIL:
      return fetchAppConfigError(state, action);

    case actionTypes.FETCH_USERINFO_START:
      return fetchUserInfoStart(state, action);
    case actionTypes.FETCH_USERINFO_SUCCESS:
      return fetchUserInfoSuccess(state, action);
    case actionTypes.FETCH_USERINFO_FAIL:
      return fetchUserInfoError(state, action);

    case actionTypes.FETCH_SERVICES_START:
      return fetchServicesStart(state, action);
    case actionTypes.FETCH_SERVICES_SUCCESS:
      return fetchServicesSuccess(state, action);
    case actionTypes.FETCH_SERVICES_FAIL:
      return fetchServicesError(state, action);

    case actionTypes.FETCH_PROMOS_START:
      return fetchPromosStart(state, action);
    case actionTypes.FETCH_PROMOS_SUCCESS:
      return fetchPromosSuccess(state, action);
    case actionTypes.FETCH_PROMOS_FAIL:
      return fetchPromosError(state, action);

    case actionTypes.FETCH_SERVICETYPE_START:
      return fetchServiceTypeStart(state, action);
    case actionTypes.FETCH_SERVICETYPE_SUCCESS:
      return fetchServiceTypeSuccess(state, action);
    case actionTypes.FETCH_SERVICETYPE_FAIL:
      return fetchServiceTypeError(state, action);

    case actionTypes.FETCH_LOCATION_START:
      return fetchLocationStart(state, action);
    case actionTypes.FETCH_LOCATION_SUCCESS:
      return fetchLocationSuccess(state, action);
    case actionTypes.FETCH_LOCATION_FAIL:
      return fetchLocationError(state, action);

    //Added by Hari on 20191211
    case actionTypes.FETCH_SLOTS_START:
      return fetchSlotStart(state, action);
    case actionTypes.FETCH_SLOTS_SUCCESS:
      return fetchSlotSuccess(state, action);
    case actionTypes.FETCH_SLOTS_FAIL:
      return fetchSlotError(state, action);

    case actionTypes.FETCH_SLOT_SERVICE_LOC_MAPP_START:
      return fetchServiceSlotLocMappStart(state, action);
    case actionTypes.FETCH_SLOT_SERVICE_LOC_MAPP_SUCCESS:
      return fetchServiceSlotLocMappSuccess(state, action);
    case actionTypes.FETCH_SLOT_SERVICE_LOC_MAPP_FAIL:
      return fetchServiceSlotLocMappError(state, action);
    //End 20191211

    case actionTypes.FETCH_SERVICEPACKAGE_START:
      return fetchServicePackageStart(state, action);
    case actionTypes.FETCH_SERVICEPACKAGE_SUCCESS:
      return fetchServicePackageSuccess(state, action);
    case actionTypes.FETCH_SERVICEPACKAGE_FAIL:
      return fetchServicePackageError(state, action);

    case actionTypes.UPDATE_USERINFO_START:
      return updateUserInfoStart(state, action);
    case actionTypes.UPDATE_USERINFO_SUCCESS:
      return updateUserInfoSuccess(state, action);
    case actionTypes.UPDATE_USERINFO_FAIL:
      return updateUserInfoError(state, action);

    case actionTypes.FETCH_USER_PATIENT_PROFILE_START:
      return fetchPatientProfileStart(state, action);
    case actionTypes.FETCH_USER_PATIENT_PROFILE_SUCCESS:
      return fetchPatientProfileSuccess(state, action);
    case actionTypes.FETCH_USER_PATIENT_PROFILE_FAIL:
      return fetchPatientProfileError(state, action);

    case actionTypes.FETCH_USER_PATIENT_ADDRESS_START:
      return fetchPatientAddressesStart(state, action);
    case actionTypes.FETCH_USER_PATIENT_ADDRESS_SUCCESS:
      return fetchPatientAddressesSuccess(state, action);
    case actionTypes.FETCH_USER_PATIENT_ADDRESS_FAIL:
      return fetchPatientAddressesError(state, action);

    case actionTypes.CRUD_USER_PATIENT_PROFILE_START:
      return crudPatientProfileStart(state, action);
    case actionTypes.CRUD_USER_PATIENT_PROFILE_SUCCESS:
      return crudPatientProfileSuccess(state, action);
    case actionTypes.CRUD_USER_PATIENT_PROFILE_FAIL:
      return crudPatientProfileError(state, action);

    case actionTypes.CRUD_USER_PATIENT_ADDRESS_START:
      return crudPatientAddressStart(state, action);
    case actionTypes.CRUD_USER_PATIENT_ADDRESS_SUCCESS:
      return crudPatientAddressSuccess(state, action);
    case actionTypes.CRUD_USER_PATIENT_ADDRESS_FAIL:
      return crudPatientAddressError(state, action);

    //20191216
    case actionTypes.SET_CURR_LOCATION_START:
      return setCurrLocationStart(state, action);
    case actionTypes.SET_CURR_LOCATION_SUCCESS:
      return setCurrLocationSuccess(state, action);
    case actionTypes.SET_CURR_LOCATION_FAIL:
      return setCurrLocationError(state, action);
    //20191216

    //20191220
    case actionTypes.SAVE_USERLOGIN_LOG_START:
      return saveUserLoginLogStart(state, action);
    case actionTypes.SAVE_USERLOGIN_LOG_SUCCESS:
      return saveUserLoginLogSuccess(state, action);
    case actionTypes.SAVE_USERLOGIN_LOG_FAIL:
      return saveUserLoginLogError(state, action);

    case actionTypes.FETCH_NOTIFICATION_TMPL_START:
      return fetchNotificationTmplStart(state, action);
    case actionTypes.FETCH_NOTIFICATION_TMPL_SUCCESS:
      return fetchNotificationTmplSuccess(state, action);
    case actionTypes.FETCH_NOTIFICATION_TMPL_FAIL:
      return fetchNotificationTmplError(state, action);

    case actionTypes.FETCH_PUSH_NOTIFICATION_START:
      return fetchUserPushNotificationStart(state, action);
    case actionTypes.FETCH_PUSH_NOTIFICATION_SUCCESS:
      return fetchUserPushNotificationSuccess(state, action);
    case actionTypes.FETCH_PUSH_NOTIFICATION_FAIL:
      return fetchUserPushNotificationError(state, action);

    case actionTypes.INITIAL_LOAD_COMPLETED:
      return updateObject(state, { isLoaded: true });
    case actionTypes.INITIAL_LOAD_RESET:
      return updateObject(state, { isLoaded: false });
    //20191220

    case actionTypes.FETCH_OTHERMASTER_GRADE_START:
      return fetchOtherMasterGradeStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_GRADE_SUCCESS:
      return fetchOtherMasterGradeSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_GRADE_FAIL:
      return fetchOtherMasterGradeError(state, action);

    case actionTypes.FETCH_OTHERMASTER_QLF_START:
      return fetchOtherMasterQualificationStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_QLF_SUCCESS:
      return fetchOtherMasterQualificationSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_QLF_FAIL:
      return fetchOtherMasterQualificationError(state, action);

    case actionTypes.FETCH_OTHERMASTER_SEQ_START:
      return fetchOtherMasterSequenceStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_SEQ_SUCCESS:
      return fetchOtherMasterSequenceSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_SEQ_FAIL:
      return fetchOtherMasterSequenceError(state, action);

    case actionTypes.FETCH_OTHERMASTER_CATEGORY_START:
      return fetchOtherMasterCategoryStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_CATEGORY_SUCCESS:
      return fetchOtherMasterCategorySuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_CATEGORY_FAIL:
      return fetchOtherMasterCategoryError(state, action);

    case actionTypes.FETCH_OTHERMASTER_EXPERIENCE_START:
      return fetchOtherMasterExperienceStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_EXPERIENCE_SUCCESS:
      return fetchOtherMasterExperienceSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_EXPERIENCE_FAIL:
      return fetchOtherMasterExperienceError(state, action);

    case actionTypes.FETCH_OTHERMASTER_DESIGNATIONS_START:
      return fetchOtherMasterDesignationsStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_DESIGNATIONS_SUCCESS:
      return fetchOtherMasterDesignationsSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_DESIGNATIONS_FAIL:
      return fetchOtherMasterDesignationsError(state, action);

    case actionTypes.FETCH_OTHERMASTER_ORDERSTATUS_START:
      return fetchOtherMasterOrderStatusStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_ORDERSTATUS_SUCCESS:
      return fetchOtherMasterOrderStatusSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_ORDERSTATUS_FAIL:
      return fetchOtherMasterOrderStatusError(state, action);

    case actionTypes.FETCH_OTHERMASTER_SUPPORTSTATUS_START:
      return fetchOtherMasterSupportStatusStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_SUPPORTSTATUS_SUCCESS:
      return fetchOtherMasterSupportStatusSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_SUPPORTSTATUS_FAIL:
      return fetchOtherMasterSupportStatusError(state, action);

    case actionTypes.FETCH_PACKAGE_START:
      return fetchPackageStart(state, action);
    case actionTypes.FETCH_PACKAGE_SUCCESS:
      return fetchPackageSuccess(state, action);
    case actionTypes.FETCH_PACKAGE_FAIL:
      return fetchPackageError(state, action);

    case actionTypes.FETCH_USERMENU_START:
      return fetchUserMenuStart(state, action);
    case actionTypes.FETCH_USERMENU_SUCCESS:
      return fetchUserMenuSuccess(state, action);
    case actionTypes.FETCH_USERMENU_FAIL:
      return fetchUserMenuError(state, action);

    case actionTypes.FETCH_SYSSEQUENCECONFIG_START:
      return fetchSysSequenceConfigStart(state, action);
    case actionTypes.FETCH_SYSSEQUENCECONFIG_SUCCESS:
      return fetchSysSequenceConfigSuccess(state, action);
    case actionTypes.FETCH_SYSSEQUENCECONFIG_FAIL:
      return fetchSysSequenceConfigFail(state, action);

    case actionTypes.FETCH_REPORT_DATA_KEYS_START:
      return fetchReportDataKeysStart(state, action);
    case actionTypes.FETCH_REPORT_DATA_KEYS_SUCCESS:
      return fetchReportDataKeysSuccess(state, action);
    case actionTypes.FETCH_REPORT_DATA_KEYS_FAIL:
      return fetchReportDataKeysFail(state, action);
    case actionTypes.FETCH_KOTMASTERSTATUS_START:
      return fetchKOTMasterStatusStart(state, action);
    case actionTypes.FETCH_KOTMASTERSTATUS_SUCCESS:
      return fetchKOTMasterStatusSuccess(state, action);
    case actionTypes.FETCH_KOTMASTERSTATUS_FAIL:
      return fetchKOTMasterStatusFail(state, action);

    case actionTypes.FETCH_KEYBOARD_HOTKEY_CONFIG_START:
      return fetchKeyboardHotKeyConfigStart(state, action);
    case actionTypes.FETCH_KEYBOARD_HOTKEY_CONFIG_SUCCESS:
      return fetchKeyboardHotKeyConfigSuccess(state, action);
    case actionTypes.FETCH_KEYBOARD_HOTKEY_CONFIG_FAIL:
      return fetchKeyboardHotKeyConfigFail(state, action);

    case actionTypes.FETCH_OTHERMASTER_USERGROUP_START:
      return fetchOtherMasterUserGroupStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_USERGROUP_SUCCESS:
      return fetchOtherMasterUserGroupSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_USERGROUP_FAIL:
      return fetchOtherMasterUserGroupError(state, action);

    case actionTypes.FETCH_OTHERMASTER_INCOME_START:
      return fetchOtherMasterIncomeStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_INCOME_SUCCESS:
      return fetchOtherMasterIncomeSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_INCOME_FAIL:
      return fetchOtherMasterIncomeError(state, action);

    case actionTypes.FETCH_OTHERMASTER_EXPENSE_START:
      return fetchOtherMasterExpenseStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_EXPENSE_SUCCESS:
      return fetchOtherMasterExpenseSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_EXPENSE_FAIL:
      return fetchOtherMasterExpenseError(state, action);

    case actionTypes.FETCH_OTHERMASTER_SUPPTYP_START:
      return fetchOtherMasterSupplierTypeStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_SUPPTYP_SUCCESS:
      return fetchOtherMasterSupplierTypeSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_SUPPTYP_FAIL:
      return fetchOtherMasterSupplierTypeError(state, action);

    case actionTypes.FETCH_OTHERMASTER_REASONSMASTER_START:
      return fetchOtherMasterReasonsStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_REASONSMASTER_SUCCESS:
      return fetchOtherMasterReasonsSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_REASONSMASTER_FAIL:
      return fetchOtherMasterReasonsError(state, action);

    case actionTypes.FETCH_ROUNDOFF_CONFIG_START:
      return fetchRoundOffConfigStart(state, action);
    case actionTypes.FETCH_ROUNDOFF_CONFIG_SUCCESS:
      return fetchRoundOffConfigSuccess(state, action);
    case actionTypes.FETCH_ROUNDOFF_CONFIG_FAIL:
      return fetchRoundOffConfigError(state, action);

    case actionTypes.SET_COMPANY_CODE:
      return setCompanyCode(state, action);

    default:
      return state;
  }
};
