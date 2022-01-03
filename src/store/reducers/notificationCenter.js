import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/notificationCenter";

const initialState = {
  error: null,
  isLoading: null,
  notificationTranEvents: [],
  notificationTranEventMapp: [],
  notificationTranDtl: [],
  notificationPromoTemp: [],
  LodaingDtl: true,
  notificationLog: [],
};

const fetchNotificationTranEventsStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchNotificationTranEventsSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    notificationTranEvents: action.notificationTranEvents,
  });
};

const fetchNotificationTranEventsFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    userAccess: [],
  });
};

const fetchNotificationPromoTemplateStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchNotificationPromoTemplateSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    notificationPromoTemp: action.notificationPromoTemp,
  });
};

const fetchNotificationPromoTemplateFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    userAccess: [],
  });
};
const fetchNotificationTranEventMappStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
  });
};

const fetchNotificationTranEventMappSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    notificationPromoTemp: action.notificationPromoTemp,
  });
};

const fetchNotificationTranEventMappFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    userAccess: [],
  });
};

const fetchNotificationTranDtlStart = (state, action) => {
  return updateObject(state, {
    LodaingDtl: true,
    error: null,
  });
};

const fetchNotificationTranDtlSuccess = (state, action) => {
  return updateObject(state, {
    LodaingDtl: false,
    error: null,
    notificationTranDtl: action.nootificationTranDtl,
  });
};

const fetchNotificationTranDtlFail = (state, action) => {
  return updateObject(state, {
    LodaingDtl: false,
    error: action.error,
    userAccess: [],
  });
};

const fetchNotificationLogStart = (state, action) => {
  return updateObject(state, {
    LodaingDtl: true,
    error: null,
  });
};

const fetchNotificationLogSuccess = (state, action) => {
  return updateObject(state, {
    LodaingDtl: false,
    error: null,
    notificationLog: action.notificationLog,
  });
};

const fetchNotificationLogFail = (state, action) => {
  return updateObject(state, {
    LodaingDtl: false,
    error: action.error,
    userAccess: [],
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_NotificationTranEvents_START:
      return fetchNotificationTranEventsStart(state, action);
    case actionTypes.FETCH_NotificationTranEvents_SUCCESS:
      return fetchNotificationTranEventsSuccess(state, action);
    case actionTypes.FETCH_NotificationTranEvents_FAIL:
      return fetchNotificationTranEventsFail(state, action);

    case actionTypes.FETCH_NotificationTranEventMapp_START:
      return fetchNotificationTranEventMappStart(state, action);
    case actionTypes.FETCH_NotificationTranEventMapp_SUCCESS:
      return fetchNotificationTranEventMappSuccess(state, action);
    case actionTypes.FETCH_NotificationTranEventMapp_FAIL:
      return fetchNotificationTranEventMappFail(state, action);

    case actionTypes.FETCH_NotificationTranDtl_START:
      return fetchNotificationTranDtlStart(state, action);
    case actionTypes.FETCH_NotificationTranDtl_SUCCESS:
      return fetchNotificationTranDtlSuccess(state, action);
    case actionTypes.FETCH_NotificationTranDtl_FAIL:
      return fetchNotificationTranDtlFail(state, action);

      case actionTypes.FETCH_NotificationPromoTemplate_START:
      return fetchNotificationPromoTemplateStart(state, action);
    case actionTypes.FETCH_NotificationPromoTemplate_SUCCESS:
      return fetchNotificationPromoTemplateSuccess(state, action);
    case actionTypes.FETCH_NotificationPromoTemplate_FAIL:
      return fetchNotificationPromoTemplateFail(state, action);
    case actionTypes.FETCH_NotificationLog_START:
      return fetchNotificationLogStart(state, action);
    case actionTypes.FETCH_NotificationLog_SUCCESS:
      return fetchNotificationLogSuccess(state, action);
    case actionTypes.FETCH_NotificationLog_FAIL:
      return fetchNotificationLogFail(state, action);

    default:
      return state;
  }
};
