import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/slotmaster";

const initialState = {
  error: null,
  isLoading: null,
  slotMasters: []
};

const fetchSlotMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  }); 
};

const fetchSlotMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    slotMasters : action.slotMasters
  });
};

const fetchSlotMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    slotMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SLOTMASTER_START:
      return fetchSlotMasterStart(state, action);
    case actionTypes.FETCH_SLOTMASTER_SUCCESS:
      return fetchSlotMasterSuccess(state, action);
    case actionTypes.FETCH_SLOTMASTER_FAIL:
      return fetchSlotMasterFail(state, action);
    default:
      return state;
  }
};

