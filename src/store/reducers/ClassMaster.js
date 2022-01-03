import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/ClassMaster";

const initialState = {
    error: null,
    isLoading: null,
    classMaster: [],
  };
  
  const fetchClassMasterStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null,
    });
  };
  
  const fetchClassMasterSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      classMaster: action.classMaster,
    });
  };
  
  const fetchClassMasterFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      classMaster: [],
    });
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.FETCH_CLASSMASTER_START:
        return fetchClassMasterStart(state, action);
      case actionTypes.FETCH_CLASSMASTER_SUCCESS:
        return fetchClassMasterSuccess(state, action);
      case actionTypes.FETCH_CLASSMASTER_FAIL:
        return fetchClassMasterFail(state, action);
      default:
        return state;
    }
  };

