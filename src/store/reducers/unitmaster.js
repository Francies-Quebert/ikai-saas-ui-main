import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/unitmaster";

const initialState = {
  error: null,
  isLoading: null,
  unitMaster: [],
};

const fetchUnitMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchUnitMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    unitMaster: action.unitMaster,
  });
};

const fetchUnitMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    unitMaster: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_UNITMASTER_START:
      return fetchUnitMasterStart(state, action);
    case actionTypes.FETCH_UNITMASTER_SUCCESS:
      return fetchUnitMasterSuccess(state, action);
    case actionTypes.FETCH_UNITMASTER_FAIL:
      return fetchUnitMasterFail(state, action);
    default:
      return state;
  }
};
