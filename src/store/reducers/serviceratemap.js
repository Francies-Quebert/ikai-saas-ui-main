import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/serviceratemap";
import {SET_SELCECTED_SERVICENEWRATE_MAP} from "../actions/serviceratemap";


const initialState = {
  error: null,
  isLoading: null,
  servicerateMaps: [],
  NewService:[]
};

const fetchServiceRateMapStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
   
  }); 
};

const fetchServiceRateMapSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    servicerateMaps : action.servicerateMaps
  });
};

const fetchServiceRateMapFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    servicerateMaps: []
  });
};

  const setSelectedServiceRateMap = (state, action) => {
  return updateObject(state, {
    NewService: action.NewService,
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case  SET_SELCECTED_SERVICENEWRATE_MAP:
      return setSelectedServiceRateMap(state, action);
    case actionTypes.FETCH_SERVICERATEMAP_START:
      return fetchServiceRateMapStart(state, action);
    case actionTypes.FETCH_SERVICERATEMAP_SUCCESS:
      return fetchServiceRateMapSuccess(state, action);
    case actionTypes.FETCH_SERVICERATEMAP_FAIL:
      return fetchServiceRateMapFail(state, action);
    default:
      return state;
  }
};
