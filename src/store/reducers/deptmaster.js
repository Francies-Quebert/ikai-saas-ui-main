import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/deptmaster";

const initialState = {
  error: null,
  isLoading: null,
  deptMaster: [],
};

const fetchDeptMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchDeptMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    deptMaster: action.deptMaster,
  });
};

const fetchDeptMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    deptMaster: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DEPTMASTER_START:
      return fetchDeptMasterStart(state, action);
    case actionTypes.FETCH_DEPTMASTER_SUCCESS:
      return fetchDeptMasterSuccess(state, action);
    case actionTypes.FETCH_DEPTMASTER_FAIL:
      return fetchDeptMasterFail(state, action);
    default:
      return state;
  }
};
