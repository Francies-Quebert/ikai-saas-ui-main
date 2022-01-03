import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/currentTran";

const initialState = {
  parent: null,
  formTitle: null,
  moduleRights:[],
  moduleId:null,
  isLoading: false,
  tranType: null,
  error: null,
  isSuccess: null,
  lastSavedData: null
};

const TranStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    lastSavedData: null,
    isSuccess:null,
    tranType: action.tranType
  });
};

const TranFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    isSuccess:false,
    tranType: action.tranType,
    lastSavedData: null
  });
};

const TranSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    isSuccess: true,
    tranType: action.tranType,
    lastSavedData: action.data
  });
};

const TranInitilize = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    tranType: null,
    error: null,
    isSuccess: null,
    lastSavedData:null
    // data: null
  });
};

const setFormCaption = (state, action) => {
  return updateObject(state, {
    parent: action.modDetail.ModGroupName,
    formTitle: action.modDetail.title,
    moduleId:action.modDetail.Id,
    moduleRights:action.modDetail.Rights,
    lastSavedData: null
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TRAN_START:
      return TranStart(state, action);
    case actionTypes.TRAN_FAIL:
      return TranFail(state, action);
    case actionTypes.TRAN_SUCCESS:
      return TranSuccess(state, action);
    case actionTypes.TRAN_INITIALIZE:
      return TranInitilize(state, action);
    case actionTypes.SET_FORM_CAPTION:
      return setFormCaption(state, action);
    default:
      return state;
  }
};
