import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/tablesmaster";

const initialState = {
  error: null,
  isLoading: null,
  tablesMaster: [],
};

const fetchTablesMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchTablesMasterSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    tablesMaster: action.tablesMaster,
  });
};

const fetchTablesMasterFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    tablesMaster: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TABLESMASTER_START:
      return fetchTablesMasterStart(state, action);
    case actionTypes.FETCH_TABLESMASTER_SUCCESS:
      return fetchTablesMasterSuccess(state, action);
    case actionTypes.FETCH_TABLESMASTER_FAIL:
      return fetchTablesMasterFail(state, action);
    default:
      return state;
  }
};
