import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/branchmaster";

const initialState = {
  error: null,
  isLoading: null,
  branchMaster: [],
};

const fetchBranchMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchBranchMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    branchMaster: action.branchMaster,
  });
};
const fetchBranchMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    branchMaster: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BRANCHMASTER_START:
      return fetchBranchMasterStart(state, action);
    case actionTypes.FETCH_BRANCHMASTER_SUCCESS:
      return fetchBranchMasterSuccess(state, action);
    case actionTypes.FETCH_BRANCHMASTER_FAIL:
      return fetchBranchMasterFail(state, action);
    default:
      return state;
  }
};
