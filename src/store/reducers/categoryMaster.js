import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/categoryMaster";

const initialState = {
  error: null,
  isLoading: null,
  categoryMasters: [],
};

const fetchCategoryMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchCategoryMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    categoryMasters: action.categoryMasters,
  });
};

const fetchCategoryMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    categoryMasters: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CATEGORYMASTER_START:
      return fetchCategoryMasterStart(state, action);
    case actionTypes.FETCH_CATEGORYMASTER_SUCCESS:
      return fetchCategoryMasterSuccess(state, action);
    case actionTypes.FETCH_CATEGORYMASTER_FAIL:
      return fetchCategoryMasterFail(state, action);
    default:
      return state;
  }
};
