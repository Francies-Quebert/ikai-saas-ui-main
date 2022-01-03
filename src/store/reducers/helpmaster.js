import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/helpmaster";

const initialState = {
  HelpMasters: null,
  FAQMasters: null,
  helpgrpusrmapp: null,
  isLoading: null,
  error: null,
};

const fetchHelpMasterPortalStart = (state, action) => {
  // console.log('i was here')
  return updateObject(state, {
    isLoading: true,
    error: null,
    HelpMasters: null,
  });
};

const fetchHelpMasterPortalFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    HelpMasters: null,
  });
};

const fetchHelpMasterPortalSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    HelpMasters: action.HelpMasters,
  });
};

const fetchFAQMasterPortalStart = (state, action) => {
  // console.log('i was here')
  return updateObject(state, {
    isLoading: true,
    error: null,
    FAQMasters: null,
  });
};

const fetchFAQMasterPortalFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    FAQMasters: null,
  });
};

const fetchFAQMasterPortalSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    FAQMasters: action.FAQMasters,
  });
};

const fetchHelpGrpUsrMappStart = (state, action) => {
  // console.log('i was here')
  return updateObject(state, {
    isLoading: true,
    error: null,
    helpgrpusrmapp: null,
  });
};

const fetchHelpGrpUsrMappFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    helpgrpusrmapp: null,
  });
};

const fetchHelpGrpUsrMappSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    helpgrpusrmapp: action.helpgrpusrmapp,
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_HELPMASTERPORTAL_START:
      return fetchHelpMasterPortalStart(state, action);
    case actionTypes.FETCH_HELPMASTERPORTAL_FAIL:
      return fetchHelpMasterPortalFail(state, action);
    case actionTypes.FETCH_HELPMASTERPORTAL_SUCCESS:
      return fetchHelpMasterPortalSuccess(state, action);

    case actionTypes.FETCH_FAQMASTERPORTAL_START:
      return fetchFAQMasterPortalStart(state, action);
    case actionTypes.FETCH_FAQMASTERPORTAL_FAIL:
      return fetchFAQMasterPortalFail(state, action);
    case actionTypes.FETCH_FAQMASTERPORTAL_SUCCESS:
      return fetchFAQMasterPortalSuccess(state, action);

    case actionTypes.FETCH_HELPGROUPUSERMAPP_START:
      return fetchHelpGrpUsrMappStart(state, action);
    case actionTypes.FETCH_HELPGROUPUSERMAPP_FAIL:
      return fetchHelpGrpUsrMappFail(state, action);
    case actionTypes.FETCH_HELPGROUPUSERMAPP_SUCCESS:
      return fetchHelpGrpUsrMappSuccess(state, action);
    default:
      return state;
  }
};
