import { updateObject } from "../../shared/utility";
import * as actionTypes from "../actions/supportTicket";

const initialState = {
  error: null,
  isLoading: null,
  pendingSupportTickets: [],
  supportTicket: null
};

const supportPendingTicketStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null
  });
};

const supportPendingTicketSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    pendingSupportTickets: action.supportpendingtickets
  });
};

const supportPendingTicketFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    pendingSupportTickets: []
  });
};

const supportTicketStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    supportTicket:null
  });
};

const supportTicketSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    supportTicket: action.supporttickets
  });
};

const supportTicketFail = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: action.error,
    supportTicket: []
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SUPPORT_PENDING_TICKET_START:
      return supportPendingTicketStart(state, action);
    case actionTypes.SUPPORT_PENDING_TICKET_SUCCESS:
      return supportPendingTicketSuccess(state, action);
    case actionTypes.SUPPORT_PENDING_TICKET_FAIL:
      return supportPendingTicketFail(state, action);

    case actionTypes.SUPPORT_TICKET_START:
      return supportTicketStart(state, action);
    case actionTypes.SUPPORT_TICKET_SUCCESS:
      return supportTicketSuccess(state, action);
    case actionTypes.SUPPORT_TICKET_FAIL:
      return supportTicketFail(state, action);
    default:
      return state;
  }
};
