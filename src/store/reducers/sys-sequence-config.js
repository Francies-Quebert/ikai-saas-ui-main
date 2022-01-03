import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/sys-sequence-config";

const initialState = {
    error: null,
    isLoading: null,
    sysSequenceConfig: [],
    SequenceNextVal:[]
  };
  
  const fetchSysSequenceConfigStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null,
    });
  };
  
  const fetchSysSequenceConfigSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      sysSequenceConfig: action.sysSequenceConfig,
    });
  };
  
  const fetchSysSequenceConfigFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      sysSequenceConfig: [],
    });
  };

  const fetchSequenceNextValStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null,
    });
  };
  
  const fetchSequenceNextValSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      SequenceNextVal: action.SequenceNextVal,
    });
  };
  
  const fetchSequenceNextValFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      SequenceNextVal: [],
    });
  };

 
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.FETCH_SYSSEQUENCECONFIG_START:
        return fetchSysSequenceConfigStart(state, action);
      case actionTypes.FETCH_SYSSEQUENCECONFIG_SUCCESS:
        return fetchSysSequenceConfigSuccess(state, action);
      case actionTypes.FETCH_SYSSEQUENCECONFIG_FAIL:
        return fetchSysSequenceConfigFail(state, action);

        case actionTypes.FETCH_SEQUENCENEXTVAL_START:
          return fetchSequenceNextValStart(state, action);
        case actionTypes.FETCH_SEQUENCENEXTVAL_SUCCESS:
          return fetchSequenceNextValSuccess(state, action);
        case actionTypes.FETCH_SEQUENCENEXTVAL_FAIL:
          return fetchSequenceNextValFail(state, action);
  

      default:
        return state;



    }

    
  };

