import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/CountryMaster";

const initialState = {
  error: null,
  isLoading: null,
  countryMasters: []
};

const fetchCountryMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchCountryMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    countryMasters: action.countryMasters
  });
};

const fetchCountryMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    countryMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_COUNTRYMASTER_START:
      return fetchCountryMasterStart(state, action);
    case actionTypes.FETCH_COUNTRYMASTER_SUCCESS:
      return fetchCountryMasterSuccess(state, action);
    case actionTypes.FETCH_COUNTRYMASTER_FAIL:
      return fetchCountryMasterFail(state, action);
    default:
      return state;
  }
};
