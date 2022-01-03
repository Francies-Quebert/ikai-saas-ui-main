import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/compmain";

const initialState = {
  error: null,
  isLoading: null,
  compMain: [],
};

const fetchCompMainStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchCompMainSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    compMain: action.compMain,
  });
};

const fetchCompMainFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    compMain: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_COMPMAIN_START:
      return fetchCompMainStart(state, action);
    case actionTypes.FETCH_COMPMAIN_SUCCESS:
      return fetchCompMainSuccess(state, action);
    case actionTypes.FETCH_COMPMAIN_FAIL:
      return fetchCompMainFail(state, action);
    default:
      return state;
  }
};
