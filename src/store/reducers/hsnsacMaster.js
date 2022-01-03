import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/hsnsacMaster";

const initialState = {
  error: null,
  isLoading: null,
  hsnsacMaster: []
};


const fetchHsnsacMasterStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null
    });
  };
  
  const fetchHsnsacMasterSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      hsnsacMaster: action.hsnsacMaster
    });
  };
  
  const fetchHsnsacMasterFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      hsnsacMaster: []
    });
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.FETCH_HSNSAC_MASTER_START:
        return fetchHsnsacMasterStart(state, action);
      case actionTypes.FETCH_HSNSAC_MASTER_SUCCESS:
        return fetchHsnsacMasterSuccess(state, action);
      case actionTypes.FETCH_HSNSAC_MASTER_FAIL:
        return fetchHsnsacMasterFail(state, action);
      default:
        return state;
    }
  };
  