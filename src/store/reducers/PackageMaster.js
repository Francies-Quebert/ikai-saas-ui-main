import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/PackageMaster";

const initialState = {
  error: null,
  isLoading: null,
  packageMasters: []
};

const fetchPackageMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchPackageMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    packageMasters: action.packageMasters
  });
};

const fetchPackageMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    packageMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PACKAGEMASTER_START:
      return fetchPackageMasterStart(state, action);
    case actionTypes.FETCH_PACKAGEMASTER_SUCCESS:
      return fetchPackageMasterSuccess(state, action);
    case actionTypes.FETCH_PACKAGEMASTER_FAIL:
      return fetchPackageMasterFail(state, action);
    default:
      return state;
  }
};
