import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/MenuMaster";

const initialState = {
  error: null,
  isLoading: null,
  menuMaster: [],
};

const fetchMenuMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchMenuMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    menuMaster: action.menuMaster,
  });
};

const fetchMenuMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    menuMaster: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MENU_MASTER_START:
      return fetchMenuMasterStart(state, action);
    case actionTypes.FETCH_MENU_MASTER_SUCCESS:
      return fetchMenuMasterSuccess(state, action);
    case actionTypes.FETCH_MENU_MASTER_FAIL:
      return fetchMenuMasterFail(state, action);
    default:
      return state;
  }
};

