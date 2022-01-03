import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/manufactureMaster";

const initialState = {
  error: null,
  isLoading: null,
  manufacturerMasters: [],
};

const fetchManufacturerMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchManufacturerMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    manufacturerMasters: action.manufacturerMasters,
  });
};

const fetchManufacturerMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    manufacturerMasters: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MANUFACTURERMASTER_START:
      return fetchManufacturerMasterStart(state, action);
    case actionTypes.FETCH_MANUFACTURERMASTER_SUCCESS:
      return fetchManufacturerMasterSuccess(state, action);
    case actionTypes.FETCH_MANUFACTURERMASTER_FAIL:
      return fetchManufacturerMasterFail(state, action);
    default:
      return state;
  }
};
