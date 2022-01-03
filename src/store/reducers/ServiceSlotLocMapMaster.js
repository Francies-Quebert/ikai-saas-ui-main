import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/ServiceSlotLocMap";

const initialState = {
  error: null,
  isLoading: null,
  serviceslotlocmapMasters: []
};

const fetchServiceSlotLocMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchServiceSlotLocMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    serviceslotlocmapMasters: action.serviceslotlocmapMasters
  });
};

const fetchServiceSlotLocMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    serviceslotlocmapMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ServiceSlotLocMapMaster_START:
      return fetchServiceSlotLocMasterStart(state, action);
    case actionTypes.FETCH_ServiceSlotLocMapMaster_SUCCESS:
      return fetchServiceSlotLocMasterSuccess(state, action);
    case actionTypes.FETCH_ServiceSlotLocMapMaster_FAIL:
      return fetchServiceSlotLocMasterFail(state, action);
    default:
      return state;
  }
};
