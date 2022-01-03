import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/StateMaster";

const initialState = {
  error: null,
  isLoading: null,
  stateMasters: []
};

const fetchStateMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchStateMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    stateMasters: action.stateMasters
  });
};

const fetchStateMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    stateMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_STATEMASTER_START:
      return fetchStateMasterStart(state, action);
    case actionTypes.FETCH_STATEMASTER_SUCCESS:
      return fetchStateMasterSuccess(state, action);
    case actionTypes.FETCH_STATEMASTER_FAIL:
      return fetchStateMasterFail(state, action);
    default:
      return state;
  }
};
