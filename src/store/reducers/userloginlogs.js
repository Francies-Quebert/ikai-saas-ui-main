import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/userloginlogs";

const initialState = {
  error: null,
  isLoading: null,
  userloginlogsMasters:null
};

const fetchUserLoginLogsMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    userloginlogsMasters:null
  });
};

const fetchUserLoginLogsMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    userloginlogsMasters: action.userloginlogsMasters
  });
};

const fetchUserLoginLogsMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    userloginlogsMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERLOGINLOGSMASTER_START:
      return fetchUserLoginLogsMasterStart(state, action);
    case actionTypes.FETCH_USERLOGINLOGSMASTER_SUCCESS:
      return fetchUserLoginLogsMasterSuccess(state, action);
    case actionTypes.FETCH_USERLOGINLOGSMASTER_FAIL:
      return fetchUserLoginLogsMasterFail(state, action);
    default:
      return state;
  }
};
