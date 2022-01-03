import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/locationmaster";

const initialState = {
  error: null,
  isLoading: null,
  locationMasters: []
};

const fetchLocationMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  }); 
};

const fetchLocationMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    locationMasters : action.locationMasters
  });
};

const fetchLocationMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    locationMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_LOCATIOMASTER_START:
      return fetchLocationMasterStart(state, action);
    case actionTypes.FETCH_LOCATIONMASTER_SUCCESS:
      return fetchLocationMasterSuccess(state, action);
    case actionTypes.FETCH_LOCATIONMASTER_FAIL:
      return fetchLocationMasterFail(state, action);
    default:
      return state;
  }
};

