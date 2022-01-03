import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/usermaster";

const initialState = {
  error: null,
  isLoading: null,
  userMasters: [],
  customerMasters: [],
  userGroupMaster: [],
  userAccess: [],
};

const fetchUserMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchUserMasterSuccess = (state, action) => {
  if (action.userType === "A") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      userMasters: action.userMasters,
    });
  } else if (action.userType === "U") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      customerMasters: action.userMasters,
    });
  } else if (action.userType === "G") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      userGroupMaster: action.userMasters,
    });
  }
};

const fetchUserMasterFail = (state, action) => {
  if (action.userType === "A") {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      userMasters: [],
    });
  } else if (action.userType === "U") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      customerMasters: [],
    });
  } else if (action.userType === "G") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      userGroupMaster: [],
    });
  }
};

const fetchUserAccessStart = (state, action) => {
  return updateObject(state, {
    // isLoading: true,
    error: null,
  });
};

const fetchUserAccessSuccess = (state, action) => {
  return updateObject(state, {
    // isLoading: false,
    error: null,
    userAccess: action.userAccess,
  });
};

const fetchUserAccessFail = (state, action) => {
  return updateObject(state, {
    // isLoading: false,
    error: action.error,
    userAccess: [],
  });
};

const fetchUserGroupStart = (state, action) => {
  return updateObject(state, {
    // isLoading: true,
    error: null,
  });
};

const fetchUserGroupSuccess = (state, action) => {
  return updateObject(state, {
    // isLoading: false,
    error: null,
    userGroupMaster: action.userGroupMaster,
  });
};

const fetchUserGroupFail = (state, action) => {
  return updateObject(state, {
    // isLoading: false,
    error: action.error,
    userAccess: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERMASTER_START:
      return fetchUserMasterStart(state, action);
    case actionTypes.FETCH_USERMASTER_SUCCESS:
      return fetchUserMasterSuccess(state, action);
    case actionTypes.FETCH_USERMASTER_FAIL:
      return fetchUserMasterFail(state, action);

    case actionTypes.FETCH_USERACCESS_START:
      return fetchUserAccessStart(state, action);
    case actionTypes.FETCH_USERACCESS_SUCCESS:
      return fetchUserAccessSuccess(state, action);
    case actionTypes.FETCH_USERACCESS_FAIL:
      return fetchUserAccessFail(state, action);

    case actionTypes.FETCH_USERGROUP_START:
      return fetchUserGroupStart(state, action);
    case actionTypes.FETCH_USERGROUP_SUCCESS:
      return fetchUserGroupSuccess(state, action);
    case actionTypes.FETCH_USERGROUP_FAIL:
      return fetchUserGroupFail(state, action);

    default:
      return state;
  }
};
