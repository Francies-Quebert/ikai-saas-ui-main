import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/promotions";

const initialState = {
  error: null,
  isLoading: null,
  promotion: [],
};

const fetchPromotionStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchPromotionSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    promotion: action.promotion,
  });
};

const fetchPromotionFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    promotion: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROMOTION_START:
      return fetchPromotionStart(state, action);
    case actionTypes.FETCH_PROMOTION_SUCCESS:
      return fetchPromotionSuccess(state, action);
    case actionTypes.FETCH_PROMOTION_FAIL:
      return fetchPromotionFail(state, action);
    default:
      return state;
  }
};
