import axios from "../../axios";
import UserPatientAddress from "../../models/patientAddress";

export const FETCH_USER_PATIENT_ADDRESS_START =
  "FETCH_USER_PATIENT_ADDRESS_START";
export const FETCH_USER_PATIENT_ADDRESS_SUCCESS =
  "FETCH_USER_PATIENT_ADDRESS_SUCCESS";
export const FETCH_USER_PATIENT_ADDRESS_FAIL =
  "FETCH_USER_PATIENT_ADDRESS_FAIL";

export const fetchUserPatientAddresses = (pUserType, pUserId) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_USER_PATIENT_ADDRESS_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        userType: pUserType,
        userId: pUserId,
      };
      const token = getState().LoginReducer.token;
      const res = await axios.post("appmain/getUserPatientAddresses", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_USER_PATIENT_ADDRESS_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;
      const patientAddresses = [];

      for (const key in resData) {
        patientAddresses.push(
          new UserPatientAddress(
            resData[key].AddressId,
            resData[key].latitude,
            resData[key].longitude,
            resData[key].geoLocationName,
            resData[key].add1,
            resData[key].add2,
            resData[key].add3,
            resData[key].AddressTag
          )
        );
      }
      // console.log(locations);
      dispatch({
        type: FETCH_USER_PATIENT_ADDRESS_SUCCESS,
        patientAddresses: patientAddresses,
      });
    } catch (err) {
      dispatch({
        type: FETCH_USER_PATIENT_ADDRESS_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
