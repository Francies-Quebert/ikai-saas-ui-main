import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/userRights";

const initialState = {
    error: null,
    isLoading: null,
    userRightsMapp: [],
  };

  
const fetchUserRightsMappStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null,
    });
  };
  
  const fetchUserRightsMappSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      userRightsMapp: action.userRightsMapp,
    });
  };
  
  const fetchUserRightsMappFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      userRightsMapp: [],
    });
  };

  export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USER_RIGHTSMAPP_START:
          return fetchUserRightsMappStart(state, action);
        case actionTypes.FETCH_USER_RIGHTSMAPP_SUCCESS:
          return fetchUserRightsMappSuccess(state, action);
        case actionTypes.FETCH_USER_RIGHTSMAPP_FAIL:
          return fetchUserRightsMappFail(state, action);
    
      default:
        return state;
    }
  };