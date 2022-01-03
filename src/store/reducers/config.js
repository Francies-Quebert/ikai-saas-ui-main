import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/config";

const initialState = {
  error: null,
  isLoading: null,
  configs: []
};

const fetchConfigStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  }); 
};

const fetchConfigSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    configs : action.configs
  });
};

const fetchConfigFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    configs: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONFIG_START:
      return fetchConfigStart(state, action);
    case actionTypes.FETCH_CONFIG_SUCCESS:
      return fetchConfigSuccess(state, action);
    case actionTypes.FETCH_CONFIG_FAIL:
      return fetchConfigFail(state, action);
    default:
      return state;
  }
};

