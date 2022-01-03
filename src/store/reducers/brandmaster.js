import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/brandmaster";

const initialState = {
  error: null,
  isLoading: null,
  brandMaster: [],
};

const fetchBrandMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchBrandMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    brandMaster: action.brandMaster,
  });
};

const fetchBrandMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    brandMaster: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BRANDMASTER_START:
      return fetchBrandMasterStart(state, action);
    case actionTypes.FETCH_BRANDMASTER_SUCCESS:
      return fetchBrandMasterSuccess(state, action);
    case actionTypes.FETCH_BRANDMASTER_FAIL:
      return fetchBrandMasterFail(state, action);
    default:
      return state;
  }
};
