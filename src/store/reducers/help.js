import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/help";

const initialState = {
  faqs: null,
  HelpCenter: null,
  isLoading: null,
  error: null,
  lastSavedTicktNo: null,
  lastSavedTicktError: null,
  lastSavedTicktIsLoading: null,
};

fetchFAQStart = (state, action) => {
  // console.log('i was here')
  return updateObject(state, {
    isLoading: true,
    error: null,
    faqs: null,
  });
};

fetchFAQFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    faqs: null,
  });
};

fetchFAQSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    faqs: action.faqs,
  });
};

fetchHelpCenterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    HelpCenter: null,
  });
};

fetchHelpCenterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    HelpCenter: null,
  });
};

fetchHelpCenterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    HelpCenter: action.HelpCenters,
  });
};

saveHelpTranStart = (state, action) => {
  return updateObject(state, {
    lastSavedTicktIsLoading: true,
    lastSavedTicktError: null,
    lastSavedTicktNo: null,
  });
};

saveHelpTranFail = (state, action) => {
  return updateObject(state, {
    lastSavedTicktIsLoading: false,
    lastSavedTicktError: action.error,
    lastSavedTicktNo: null,
  });
};

saveHelpTranSuccess = (state, action) => {
  // console.log(action.res);
  return updateObject(state, {
    lastSavedTicktIsLoading: false,
    lastSavedTicktError: null,
    lastSavedTicktNo: 1234,
  });
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FAQ_START:
      return fetchFAQStart(state, action);
    case actionTypes.FETCH_FAQ_FAIL:
      return fetchFAQFail(state, action);
    case actionTypes.FETCH_FAQ_SUCCESS:
      return fetchFAQSuccess(state, action);
    case actionTypes.FETCH_HELPCENTER_START:
      return fetchHelpCenterStart(state, action);
    case actionTypes.FETCH_HELPCENTER_FAIL:
      return fetchHelpCenterFail(state, action);
    case actionTypes.FETCH_HELPCENTER_SUCCESS:
      return fetchHelpCenterSuccess(state, action);

    case actionTypes.SAVE_HELPCENTERTRAN_START:
      return saveHelpTranStart(state, action);
    case actionTypes.SAVE_HELPCENTERTRAN_FAIL:
      return saveHelpTranFail(state, action);
    case actionTypes.SAVE_HELPCENTERTRAN_SUCCESS:
      return saveHelpTranSuccess(state, action);
    default:
      return state;
  }
};
