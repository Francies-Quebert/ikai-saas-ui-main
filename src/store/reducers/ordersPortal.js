import * as actionTypes from "../actions/ordersPortal";
import { updateObject } from "../../shared/utility";
import { reInitialize } from "../actions/currentTran";

const initialState = {
  ordersPortal: null,
  ordersPortalHome: null,
  currentOrderScheduleVisits: null,
  currentOrderViewDetail: null,
  isLoading: null,
  error: null,
  refreshRequired: null,
  ordersPortalUpcoming: null,
};

const reinitialize = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    refreshRequired: false,
  });
};
const fetchOrderDetailStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    currentOrderViewDetail: null,
  });
};

const fetchOrderDetailSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    currentOrderViewDetail: action.orderDetail,
  });
};

const fetchOrderDetailError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    currentOrderViewDetail: null,
    isLoading: false,
  });
};

const fetchOrderScheduleVisitsStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    currentOrderScheduleVisits: null,
  });
};

const fetchOrderScheduleVisitsSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    currentOrderScheduleVisits: action.scheduleVisits,
  });
};

const fetchOrderScheduleVisitsError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    currentOrderScheduleVisits: null,
    isLoading: false,
  });
};

const processOrderScheduleVisitsStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    currentOrderScheduleVisits: null,
  });
};

const processOrderScheduleVisitsSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    currentOrderScheduleVisits: action.scheduleVisits,
  });
};

const processOrderScheduleVisitsError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    currentOrderScheduleVisits: null,
    isLoading: false,
  });
};

const fetchOrdersPortalHomeStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    ordersPortalHome: null,
  });
};

const fetchOrdersPortalHomeSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    ordersPortalHome: action.ordersPortalHome,
  });
};

const fetchOrdersPortalHomeError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    ordersPortalHome: null,
    isLoading: false,
  });
};

const fetchOrdersPortalStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    ordersPortal: null,
  });
};

const fetchOrdersPortalSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    ordersPortal: action.ordersPortal,
  });
};

const fetchOrdersPortalError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    ordersPortal: null,
    isLoading: false,
  });
};

const sendScheduleSmsStart = (state, action) => {
  return updateObject(state, {
    error: null,
    isLoading: true,
    refreshRequired: false,
  });
};

const sendScheduleSmsSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    isLoading: false,
    refreshRequired: true,
  });
};

const sendScheduleSmsError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    isLoading: false,
    refreshRequired: false,
  });
};

const fetchOrdersPortalUpcomingStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    ordersPortalUpcoming: null,
  });
};

const fetchOrdersPortalUpcomingSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    ordersPortalUpcoming: action.ordersPortalUpcoming,
  });
};

const fetchOrdersPortalUpcomingError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    ordersPortalUpcoming: null,
    isLoading: false,
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ORDERSCHEDULEVISITS_START:
      return fetchOrderScheduleVisitsStart(state, action);
    case actionTypes.FETCH_ORDERSCHEDULEVISITS_FAIL:
      return fetchOrderScheduleVisitsError(state, action);
    case actionTypes.FETCH_ORDERSCHEDULEVISITS_SUCCESS:
      return fetchOrderScheduleVisitsSuccess(state, action);

    case actionTypes.PROCESS_ORDERSCHEDULEVISITS_START:
      return processOrderScheduleVisitsStart(state, action);
    case actionTypes.PROCESS_ORDERSCHEDULEVISITS_FAIL:
      return processOrderScheduleVisitsError(state, action);
    case actionTypes.PROCESS_ORDERSCHEDULEVISITS_SUCCESS:
      return processOrderScheduleVisitsSuccess(state, action);

    case actionTypes.SEND_SCHEDULE_SMS_START:
      return sendScheduleSmsStart(state, action);
    case actionTypes.SEND_SCHEDULE_SMS_FAIL:
      return sendScheduleSmsError(state, action);
    case actionTypes.SEND_SCHEDULE_SMS_SUCCESS:
      return sendScheduleSmsSuccess(state, action);

    case actionTypes.FETCH_ORDERSPORTAL_START:
      return fetchOrdersPortalStart(state, action);
    case actionTypes.FETCH_ORDERSPORTAL_FAIL:
      return fetchOrdersPortalError(state, action);
    case actionTypes.FETCH_ORDERSPORTAL_SUCCESS:
      return fetchOrdersPortalSuccess(state, action);

    case actionTypes.FETCH_ORDERSPORTALHOME_START:
      return fetchOrdersPortalHomeStart(state, action);
    case actionTypes.FETCH_ORDERSPORTALHOME_FAIL:
      return fetchOrdersPortalHomeError(state, action);
    case actionTypes.FETCH_ORDERSPORTALHOME_SUCCESS:
      return fetchOrdersPortalHomeSuccess(state, action);

    case actionTypes.FETCH_ORDERDETAIL_START:
      return fetchOrderDetailStart(state, action);
    case actionTypes.FETCH_ORDERDETAIL_FAIL:
      return fetchOrderDetailError(state, action);
    case actionTypes.FETCH_ORDERDETAIL_SUCCESS:
      return fetchOrderDetailSuccess(state, action);

    case actionTypes.REJECT_ORDER_START ||
      actionTypes.ACCEPT_ORDER_START ||
      actionTypes.ASSIGN_ATTENDANT_ORDER_START ||
      actionTypes.CANCEL_ORDER_PORTAL_START:
      return updateObject(state, {
        isLoading: true,
        error: null,
      });

    case actionTypes.REJECT_ORDER_FAIL ||
      actionTypes.ACCEPT_ORDER_FAIL ||
      actionTypes.ASSIGN_ATTENDANT_ORDER_FAIL ||
      actionTypes.CANCEL_ORDER_PORTAL_FAIL:
      return updateObject(state, {
        isLoading: false,
        error: action.error,
      });

    case actionTypes.REJECT_ORDER_SUCCESS ||
      actionTypes.ACCEPT_ORDER_SUCCESS ||
      actionTypes.ASSIGN_ATTENDANT_ORDER_SUCCESS ||
      actionTypes.CANCEL_ORDER_PORTAL_SUCCESS:
      return updateObject(state, {
        isLoading: false,
        error: null,
      });

    case actionTypes.ORDER_SCHEDULE_START:
      return updateObject(state, {
        isLoading: true,
        error: null,
      });
    case actionTypes.ORDER_SCHEDULE_FAIL:
      return updateObject(state, {
        isLoading: false,
        error: action.error,
      });
    case actionTypes.ORDER_SCHEDULE_SUCCESS:
      return updateObject(state, {
        isLoading: false,
        error: null,
      });

    case actionTypes.FETCH_ORDERSPORTALUPCOMING_START:
      return fetchOrdersPortalUpcomingStart(state, action);
    case actionTypes.FETCH_ORDERSPORTALUPCOMING_FAIL:
      return fetchOrdersPortalUpcomingError(state, action);
    case actionTypes.FETCH_ORDERSPORTALUPCOMING_SUCCESS:
      return fetchOrdersPortalUpcomingSuccess(state, action);

    case actionTypes.REINTIALIZE:
      return reinitialize(state,action);
      
    default:
      return state;
  }
};
