import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/menucategorymaster";

const initialState = {
    error: null,
    isLoading: null,
    menuCategoryMaster: [],
  };
  
  const fetchMenuCategoryMasterStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null,
    });
  };
  
  const fetchMenuCategoryMasterSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      menuCategoryMaster: action.menuCategoryMaster,
    });
  };
  
  const fetchMenuCategoryMasterFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      menuCategoryMaster: [],
    });
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.FETCH_MENUCATEGORYMASTER_START:
        return fetchMenuCategoryMasterStart(state, action);
      case actionTypes.FETCH_MENUCATEGORYMASTER_SUCCESS:
        return fetchMenuCategoryMasterSuccess(state, action);
      case actionTypes.FETCH_MENUCATEGORYMASTER_FAIL:
        return fetchMenuCategoryMasterFail(state, action);
      default:
        return state;
    }
  };

