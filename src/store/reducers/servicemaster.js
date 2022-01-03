import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/servicemaster";

const initialState = {
  error: null,
  isLoading: null,
  serviceMasters: []
};

const fetchServiceMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
   
  }); 
};

const fetchServiceMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    serviceMasters : action.serviceMasters
  });
};

const fetchServiceMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    serviceMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SERVICEMASTER_START:
      return fetchServiceMasterStart(state, action);
    case actionTypes.FETCH_SERVICEMASTER_SUCCESS:
      return fetchServiceMasterSuccess(state, action);
    case actionTypes.FETCH_SERVICEMASTER_FAIL:
      return fetchServiceMasterFail(state, action);
    default:
      return state;
  }
};
