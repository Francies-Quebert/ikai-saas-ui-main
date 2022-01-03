import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/paymodemaster";

const initialState = {
    error: null,
    isLoading: null,
    paymodeMaster: [],
  };
  
  const fetchPaymodeMasterStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null,
    });
  };
  
  const fetchPaymodeMasterSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      paymodeMaster: action.paymodeMaster,
    });
  };
  
  const fetchPaymodeMasterFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      paymodeMaster: [],
    });
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.FETCH_PAYMODEMASTER_START:
        return fetchPaymodeMasterStart(state, action);
      case actionTypes.FETCH_PAYMODEMASTER_SUCCESS:
        return fetchPaymodeMasterSuccess(state, action);
      case actionTypes.FETCH_PAYMODEMASTER_FAIL:
        return fetchPaymodeMasterFail(state, action);
      default:
        return state;
    }
  };

