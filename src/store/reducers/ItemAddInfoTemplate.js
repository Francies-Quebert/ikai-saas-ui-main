import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/ItemAddInfoTemplate";
import { SET_SELCECTED_INFO_TEMP_DTL } from "../actions/ItemAddInfoTemplate";

const initialState = {
  error: null,
  isLoading: null,
  itemAddInfoTmplHdr: [],
  templDtl: [],

};

const fetchItemAddInfoTemplHdrStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchItemAddInfoTemplHdrSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    itemAddInfoTmplHdr: action.itemAddInfoTmplHdr,
  });
};

const fetchItemAddInfoTemplHdrFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    itemAddInfoTmplHdr: [],
  });
};

const setSelectedInfoTemplDtl = (state, action) => {
  return updateObject(state, {
    templDtl: action.templDtl,
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SELCECTED_INFO_TEMP_DTL:
      return setSelectedInfoTemplDtl(state, action);
    case actionTypes.FETCH_ITEM_ADD_INFO_TMPL_HDR_START:
      return fetchItemAddInfoTemplHdrStart(state, action);
    case actionTypes.FETCH_ITEM_ADD_INFO_TMPL_HDR_SUCCESS:
      return fetchItemAddInfoTemplHdrSuccess(state, action);
    case actionTypes.FETCH_ITEM_ADD_INFO_TMPL_HDR_FAIL:
      return fetchItemAddInfoTemplHdrFail(state, action);
    default:
      return state;
  }
};
