import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/othermaster";

const initialState = {
  error: null,
  isLoading: null,
  otherMasters: [],
  categoryMasters: [],
  expierenceMasters: [],
  gradeMasters: [],
  hstMasters: [],
  designationMasters: [],
  stsMasters: [],
  brfMasters: [],
  helpGroupMaster: [],
  faqGroupMaster: [],
  menuVariation: [],
  menuGroup: [],
  specialNotes: [],
  dietType: [],
  tableStatusMaster: [],
  kotStatusMaster: [],
  incomeMaster: [],
  expenseMaster: [],
  otherMasterReasons: [],
};

const fetchotherMasterStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchotherMasterSuccess = (state, action) => {
  if (action.mastertype === "QLF") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      otherMasters: action.otherMasters,
    });
  } else if (action.mastertype === "CAT") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      categoryMasters: action.otherMasters,
    });
  } else if (action.mastertype === "EXP") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      expierenceMasters: action.otherMasters,
    });
  } else if (action.mastertype === "GRD") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      gradeMasters: action.otherMasters,
    });
  } else if (action.mastertype === "HST") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      hstMasters: action.otherMasters,
    });
  } else if (action.mastertype === "DSG") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      designationMasters: action.otherMasters,
    });
  } else if (action.mastertype === "STS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      stsMasters: action.otherMasters,
    });
  } else if (action.mastertype === "BRF") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      brfMasters: action.otherMasters,
    });
  } else if (action.mastertype === "HLP") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      helpGroupMaster: action.otherMasters,
    });
  } else if (action.mastertype === "FAQ") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      faqGroupMaster: action.otherMasters,
    });
  } else if (action.mastertype === "VAR") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      menuVariation: action.otherMasters,
    });
  } else if (action.mastertype === "MGRP") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      menuGroup: action.otherMasters,
    });
  } else if (action.mastertype === "SPLNTS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      specialNotes: action.otherMasters,
    });
  } else if (action.mastertype === "DEITTYP") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      dietType: action.otherMasters,
    });
  } else if (action.mastertype === "TSTS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      tableStatusMaster: action.otherMasters,
    });
  } else if (action.mastertype === "KOTSTS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      kotStatusMaster: action.otherMasters,
    });
  } else if (action.mastertype === "INC") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      incomeMaster: action.otherMasters,
    });
  } else if (action.mastertype === "EXPS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      expenseMaster: action.otherMasters,
    });
  } else if (action.mastertype === "RSM") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      otherMasterReasons: action.otherMasters,
    });
  }
};
const fetchotherMasterFail = (state, action) => {
  if (action.mastertype === "QLF") {
    return updateObject(state, {
      isLoading: false,
      error: action.error,
      otherMasters: [],
    });
  } else if (action.mastertype === "CAT") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      categoryMasters: [],
    });
  } else if (action.mastertype === "EXP") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      expierenceMasters: [],
    });
  } else if (action.mastertype === "GRD") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      gradeMasters: [],
    });
  } else if (action.mastertype === "HST") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      hstMasters: [],
    });
  } else if (action.mastertype === "DSG") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      designationMasters: [],
    });
  } else if (action.mastertype === "STS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      stsMasters: [],
    });
  } else if (action.mastertype === "BRF") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      brfMasters: [],
    });
  } else if (action.mastertype === "HLP") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      helpGroupMaster: [],
    });
  } else if (action.mastertype === "FAQ") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      faqGroupMaster: [],
    });
  } else if (action.mastertype === "VAR") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      menuVariation: [],
    });
  } else if (action.mastertype === "MGRP") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      menuGroup: [],
    });
  } else if (action.mastertype === "SPLNTS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      specialNotes: [],
    });
  } else if (action.mastertype === "DEITTYP") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      dietType: [],
    });
  } else if (action.mastertype === "TSTS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      tableStatusMaster: [],
    });
  } else if (action.mastertype === "KOTSTS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      kotStatusMaster: [],
    });
  } else if (action.mastertype === "INC") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      incomeMaster: [],
    });
  } else if (action.mastertype === "EXPS") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      expenseMaster: [],
    });
  } else if (action.mastertype === "RSM") {
    return updateObject(state, {
      isLoading: false,
      error: null,
      otherMasterReasons: [],
    });
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_OTHERMASTER_START:
      return fetchotherMasterStart(state, action);
    case actionTypes.FETCH_OTHERMASTER_SUCCESS:
      return fetchotherMasterSuccess(state, action);
    case actionTypes.FETCH_OTHERMASTER_FAIL:
      return fetchotherMasterFail(state, action);
    default:
      return state;
  }
};
