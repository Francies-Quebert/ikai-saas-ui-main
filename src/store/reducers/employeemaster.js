import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/employeemaster";

const initialState = {
  error: null,
  isLoading: null,
  employeeMasters: []
};

const fetchEmployeeMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const fetchEmployeeMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    employeeMasters: action.employeeMasters
  });
};

const fetchEmployeeMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    employeeMasters: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EMPLOYEEMASTER_START:
      return fetchEmployeeMasterStart(state, action);
    case actionTypes.FETCH_EMPLOYEEMASTER_SUCCESS:
      return fetchEmployeeMasterSuccess(state, action);
    case actionTypes.FETCH_EMPLOYEEMASTER_FAIL:
      return fetchEmployeeMasterFail(state, action);
    default:
      return state;
  }
};
