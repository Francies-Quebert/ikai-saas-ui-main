import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/CityMaster";

const initialState = {
  error: null,
  isLoading: null,
  cityMasters: []
};

const fetchCityMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchCityMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    cityMasters: action.cityMasters
  });
};

const fetchCityMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    cityMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CITYMASTER_START:
      return fetchCityMasterStart(state, action);
    case actionTypes.FETCH_CITYMASTER_SUCCESS:
      return fetchCityMasterSuccess(state, action);
    case actionTypes.FETCH_CITYMASTER_FAIL:
      return fetchCityMasterFail(state, action);
    default:
      return state;
  }
};
