import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/portalmaster";

const initialState = {
  error: null,
  isLoading: null,
  portalMasters: []
};

const fetchPortalMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchPortalMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    portalMasters: action.portalMasters
  });
};

const fetchPortalMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    portalMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PORTALMASTER_START:
      return fetchPortalMasterStart(state, action);
    case actionTypes.FETCH_PORTALMASTER_SUCCESS:
      return fetchPortalMasterSuccess(state, action);
    case actionTypes.FETCH_PORTALMASTER_FAIL:
      return fetchPortalMasterFail(state, action);
    default:
      return state;
  }
};
