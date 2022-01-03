import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/subCategoryMaster";

const initialState = {
  error: null,
  isLoading: null,
  subCategoryMaster: []
};

const fetchSubCategoryMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchSubCategoryMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    subCategoryMaster: action.subCategoryMaster
  });
};

const fetchSubCategoryMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    subCategoryMaster: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SUB_CATEGORY_MASTER_START:
      return fetchSubCategoryMasterStart(state, action);
    case actionTypes.FETCH_SUB_CATEGORY_MASTER_SUCCESS:
      return fetchSubCategoryMasterSuccess(state, action);
    case actionTypes.FETCH_SUB_CATEGORY_MASTER_FAIL:
      return fetchSubCategoryMasterFail(state, action);
    default:
      return state;
  }
};
