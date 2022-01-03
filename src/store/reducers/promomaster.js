import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/promomaster";

const initialState = {
  error: null,
  isLoading: null,
  promoMasters: []
};

const fetchPromoMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchPromoMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    promoMasters: action.promoMasters
  });
};

const fetchPromoMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    promoMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROMOMASTER_START:
      return fetchPromoMasterStart(state, action);
    case actionTypes.FETCH_PROMOMASTER_SUCCESS:
      return fetchPromoMasterSuccess(state, action);
    case actionTypes.FETCH_PROMOMASTER_FAIL:
      return fetchPromoMasterFail(state, action);
    default:
      return state;
  }
};
