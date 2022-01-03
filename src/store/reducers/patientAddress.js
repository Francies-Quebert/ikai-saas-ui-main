import * as actionTypes from "../actions/patientAddress";
const initialState = {
    error: null,
  isLoading: null,
  patientAddresses: null
};

fetchPatientProfileStart = (state, action) => {
  return updateObject(state, {
    isLoading: true,
    error: null,
    patientProfiles: null
  });
};

fetchPatientProfileSuccess = (state, action) => {
  return updateObject(state, {
    isLoading: false,
    error: null,
    patientProfiles: action.patientAddresses
  });
};

fetchPatientProfileError = (state, action) => {
  return updateObject(state, {
    error: action.error,
    patientProfiles: null,
    isLoading: false
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_PATIENT_ADDRESS_START:
      return fetchPatientAddressesStart(state, action);
    case actionTypes.FETCH_USER_PATIENT_ADDRESS_SUCCESS:
      return fetchPatientAddressesSuccess(state, action);
    case actionTypes.FETCH_USER_PATIENT_ADDRESS_FAIL:
      return fetchPatientAddressesError(state, action);
    default:
      return state;
  }
};
