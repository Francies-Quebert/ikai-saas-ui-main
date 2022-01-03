import {
  FETCH_ORDERS_START,
  FETCH_ORDERS_FAIL,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERDETAILS_START,
  FETCH_ORDERDETAILS_FAIL,
  FETCH_ORDERDETAILS_SUCCESS,
  CANCEL_ORDER_START,
  CANCEL_ORDER_FAIL,
  CANCEL_ORDER_SUCCESS,
  RESCHEDULE_ORDER_START,
  RESCHEDULE_ORDER_FAIL,
  RESCHEDULE_ORDER_SUCCESS,
  FETCH_CHECKIN_ORDER_START,
  FETCH_CHECKIN_ORDER_FAIL,
  FETCH_CHECKIN_ORDER_SUCCESS,
  FETCH_CHECKOUT_ORDER_START,
  FETCH_CHECKOUT_ORDER_FAIL,
  FETCH_CHECKOUT_ORDER_SUCCESS,
  FETCH_ADDON_COST_ORDER_START,
  FETCH_ADDON_COST_ORDER_FAIL,
  FETCH_ADDON_COST_ORDER_SUCCESS,
  SET_SELCECTED_ADDONCOST,
} from "../actions/orders";
import { updateObject } from "../../shared/utility";

const initialState = {
  orders: null,
  isLoading: false,
  error: null,
  currentOrderDetails: null,
  orderCheckIn: null,
  orderCheckOut: null,
  orderAddOnCost: null,
  addOnCost: null,
};

const fetchOrdersStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    orders: null,
  });
};

const fetchOrdersSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    orders: action.orders,
  });
};

const fetchOrdersError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    orders: null,
    isLoading: false,
  });
};

const fetchOrderDetailsStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    currentOrderDetails: null,
  });
};

const fetchOrderDetailsSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    currentOrderDetails: action.orderDetails,
  });
};

const fetchOrderDetailsError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    currentOrderDetails: null,
    isLoading: false,
  });
};

const fetchOrderCheckInStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    orderCheckIn: null,
  });
};

const fetchOrderCheckInSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    orderCheckIn: action.orderCheckIn,
  });
};

const fetchOrderCheckInError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    orderCheckIn: null,
    isLoading: false,
  });
};

const fetchOrderCheckOutStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    orderCheckOut: null,
  });
};

const fetchOrderCheckOutSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    orderCheckOut: action.orderCheckOut,
  });
};

const fetchOrderCheckOutError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    orderCheckOut: null,
    isLoading: false,
  });
};

const fetchOrderAddOnCostStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    orderAddOnCost: null,
    highestSrNo: null,
    total: null,
  });
};

const fetchOrderAddOnCostSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    orderAddOnCost: action.orderAddOnCost,
    highestSrNo: action.highestSrNo,
    total: action.total,
  });
};

const fetchOrderAddOnCostError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    orderAddOnCost: null,
    isLoading: false,
    highestSrNo: null,
    total: null,
  });
};

const setSelectedAddOnCost = (state, action) => {
  return updateObject(state, {
    addOnCost: action.addOnCost,
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS_START:
      return fetchOrdersStart(state, action);
    case FETCH_ORDERS_FAIL:
      return fetchOrdersError(state, action);
    case FETCH_ORDERS_SUCCESS:
      return fetchOrdersSuccess(state, action);

    case FETCH_ORDERDETAILS_START:
      return fetchOrderDetailsStart(state, action);
    case FETCH_ORDERDETAILS_FAIL:
      return fetchOrderDetailsError(state, action);
    case FETCH_ORDERDETAILS_SUCCESS:
      return fetchOrderDetailsSuccess(state, action);

    case FETCH_CHECKIN_ORDER_START:
      return fetchOrderCheckInStart(state, action);
    case FETCH_CHECKIN_ORDER_FAIL:
      return fetchOrderCheckInError(state, action);
    case FETCH_CHECKIN_ORDER_SUCCESS:
      return fetchOrderCheckInSuccess(state, action);

    case FETCH_CHECKOUT_ORDER_START:
      return fetchOrderCheckOutStart(state, action);
    case FETCH_CHECKOUT_ORDER_FAIL:
      return fetchOrderCheckOutError(state, action);
    case FETCH_CHECKOUT_ORDER_SUCCESS:
      return fetchOrderCheckOutSuccess(state, action);

    case FETCH_ADDON_COST_ORDER_START:
      return fetchOrderAddOnCostStart(state, action);
    case FETCH_ADDON_COST_ORDER_FAIL:
      return fetchOrderAddOnCostError(state, action);
    case FETCH_ADDON_COST_ORDER_SUCCESS:
      return fetchOrderAddOnCostSuccess(state, action);
    case SET_SELCECTED_ADDONCOST:
      return setSelectedAddOnCost(state, action);

    case CANCEL_ORDER_START:
      return state;
    case CANCEL_ORDER_FAIL:
      return state;
    case CANCEL_ORDER_SUCCESS:
      return state;

    case RESCHEDULE_ORDER_START:
      return state;
    case RESCHEDULE_ORDER_FAIL:
      return state;
    case RESCHEDULE_ORDER_SUCCESS:
      return state;
    default:
      return state;
  }
};
