import * as actionTypes from "../actions/currentOrder";
import { updateObject } from "../../shared/utility";

const initialState = {
  patientProfile: null,
  patientAddress: null,
  serviceProfile: null,
  package: {
    packeProfile: null,
    unit: null,
    rate: null,
    amount: null,
    totalDisc: null,
    VisitType:null
  },
  schedule: {
    fromDate: null,
    toDate: null,
  },
  isLoading: false,
  orderNo: null,
  errorText: "",
  paymentMode: "",
  paymentId: null,
  paymentRes: {
    id: null,
    amount: null,
  },
  serviceType: null,
  location: null,
  slot:{
    slotId: null,
    slotDesc: null,
  }
};
const resetOrder=(state,action)=>{
  return updateObject(state,initialState);
}

const setSelectedPatient = (state, action) => {
  return updateObject(state, {
    patientProfile: action.patientProfile,
  });
};

const setSelectedAddress = (state, action) => {
  return updateObject(state, {
    patientAddress: action.patientAddress,
  });
};

const setServiceProfile = (state, action) => {
  return updateObject(state, {
    serviceProfile: action.serviceProfile,
  });
};

const setPackage = (state, action) => {
  return updateObject(state, {
    package: action.package,
  });
};

const setSchedule = (state, action) => {
  return updateObject(state, {
    schedule: action.schedule,
  });
};

const setSlot = (state, action) => {
  return updateObject(state, {
    slot: action.slot,
  });
};

const setPaymentMode = (state, action) => {
  return updateObject(state, {
    paymentMode: action.paymentMode,
  });
};
const saveOrderStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
  });
};
const saveOrderFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    errorText: action.error,
  });
};
const saveOrderSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    orderNo: action.result.data,
    paymentRes: action.paymentRes,
  });
};

const updatePaymentStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
  });
};
const updatePaymentFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    errorText: action.error,
  });
};
const updatePaymentSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    paymentId: action.apiPaymentId,
  });
};

const setServiceType = (state, action) => {
  return updateObject(state, {
    serviceType: action.servicetype,
  });
};

const setLocation = (state, action) => {
  return updateObject(state, {
    location: action.location,
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SELCECTED_PATIENT:
      return setSelectedPatient(state, action);
    case actionTypes.SET_SELCECTED_ADDRESS:
      return setSelectedAddress(state, action);
    case actionTypes.SET_SELCECTED_SERVICE:
      return setServiceProfile(state, action);
    case actionTypes.SET_SELCECTED_PACKAGE:
      return setPackage(state, action);
    case actionTypes.SET_SELCECTED_SCHEDULE:
      return setSchedule(state, action);
    case actionTypes.SET_SELCECTED_SLOT:
      return setSlot(state, action);
    case actionTypes.SET_SELCECTED_PAYMENT_MODE:
      return setPaymentMode(state, action);
    case actionTypes.SAVE_ORDER_START:
      return saveOrderStart(state, action);
    case actionTypes.SAVE_ORDER_FAIL:
      return saveOrderFail(state, action);
    case actionTypes.SAVE_ORDER_SUCCESS:
      return saveOrderSuccess(state, action);

    case actionTypes.SET_SELCECTED_SERVICETYPE:
      return setServiceType(state, action);
    case actionTypes.SET_SELCECTED_LOCATION:
      return setLocation(state, action);

    case actionTypes.UPDATE_API_PAYMENT_ENTRY_START:
      return updatePaymentStart(state, action);
    case actionTypes.UPDATE_API_PAYMENT_ENTRY_FAIL:
      return updatePaymentFail(state, action);
    case actionTypes.UPDATE_API_PAYMENT_ENTRY_SUCCESS:
      return updatePaymentSuccess(state, action);

    case actionTypes.REINITIALIZE:
      return {
        patientProfile: null,
        patientAddress: null,
        serviceProfile: null,
        package: {
          packeProfile: null,
          unit: null,
          rate: null,
          amount: null,
          totalDisc: null,
        },
        schedule: {
          fromDate: null,
          toDate: null,
        },
        orderNo: null,
        errorText: "",
        paymentMode: "",
        paymentId: null,
        paymentRes: {
          id: null,
        },
      };
    default:
      return state;
  }
};
