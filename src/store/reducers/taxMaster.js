import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/taxMaster";

const initialState = {
  error: null,
  isLoading: null,
  taxMaster: []
};


const fetchTaxMasterStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null
    });
  };
  
  const fetchTaxMasterSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      taxMaster: action.taxMaster
    });
  };
  
  const fetchTaxMasterFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      taxMaster: []
    });
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.FETCH_TAX_MASTER_START:
        return fetchTaxMasterStart(state, action);
      case actionTypes.FETCH_TAX_MASTER_SUCCESS:
        return fetchTaxMasterSuccess(state, action);
      case actionTypes.FETCH_TAX_MASTER_FAIL:
        return fetchTaxMasterFail(state, action);
      default:
        return state;
    }
  };
  