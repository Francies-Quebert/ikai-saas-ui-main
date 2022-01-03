import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/ItemMaster";

const initialState = {
  error: null,
  isLoading: null,
  ItemMaster: [],
  isLoadingBardcode:null,
  ItemBarcode:[],
};


const fetchItemMasterStart = (state, action) => {
    return updateObject(state, {
      isLoading: true,
      error: null
    });
  };
  
  const fetchItemMasterSuccess = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: null,
      ItemMaster: action.ItemMaster
    });
  };
  
  const fetchItemMasterFail = (state, action) => {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      ItemMaster: []
    });
  };

  const fetchItemBarcodeStart = (state, action) => {
    return updateObject(state, {
      isLoadingBardcode: true,
      error: null
    });
  };
  
  const fetchItemBarcodeSuccess = (state, action) => {
    return updateObject(state, {
      isLoadingBardcode: false,
      error: null,
      ItemBarcode: action.ItemBarcode
    });
  };
  
  const fetchItemBarcodeFail = (state, action) => {
    return updateObject(state, {
      isLoadingBardcode: false,
      error: action.error,
      ItemBarcode: []
    });
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.FETCH_ITEM_MASTER_START:
        return fetchItemMasterStart(state, action);
      case actionTypes.FETCH_ITEM_MASTER_SUCCESS:
        return fetchItemMasterSuccess(state, action);
      case actionTypes.FETCH_ITEM_MASTER_FAIL:
        return fetchItemMasterFail(state, action);

        case actionTypes.FETCH_ITEM_BARCODE_START:
          return fetchItemBarcodeStart(state, action);
        case actionTypes.FETCH_ITEM_BARCODE_SUCCESS:
          return fetchItemBarcodeSuccess(state, action);
        case actionTypes.FETCH_ITEM_BARCODE_FAIL:
          return fetchItemBarcodeFail(state, action);
      default:
        return state;
    }
  };
  