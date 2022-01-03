import axios from "../axios";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";

const TRANTYPE = "CustomerAddress";

export function getCustomerAddress(CompCode, pUserType, pUserId) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId, pUserType);
      axios
        .get(`user-master/getUserAddress/${CompCode}/${pUserType}/${pUserId}`)
        .then((res) => {
          const resData = res.data.data;
          let customerAddress = [];
          for (const key in resData) {
            customerAddress.push({
              key: resData[key].AddressId,
              AddressId: resData[key].AddressId,
              UserId: resData[key].UserId,
              latitude: resData[key].latitude,
              longitude: resData[key].longitude,
              geoLocationName: resData[key].geoLocationName,
              add1: resData[key].add1,
              add2: resData[key].add2,
              add3: resData[key].add3,
              AddressTag: resData[key].AddressTag,
              City: resData[key].City,
              PinCode: resData[key].PinCode,
              IsDefault: resData[key].IsDefault,
              MarkDeleted: resData[key].MarkDeleted,
            });
          }

          resolve(customerAddress);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const InsUpdtCustomerAddress = (pData) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = { data: { ...pData, updtUsr: UpdtUsr, CompCode } };
      const res = await axios.post("user-master/insUpdtCustomerAddress", data);
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};
