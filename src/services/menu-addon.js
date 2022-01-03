import axios from "../axios";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";

const TRANTYPE = "MenuAddon";

export function fetchMenuAddonHdr(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserAccess fetched request", pUserId);
      axios
        .get(`menu-master/getMenuAddonHdr/${CompCode}`)
        .then((res) => {
          const menuAddonHdr = [];
          const resData = res.data.data;

          for (const key in resData) {
            menuAddonHdr.push({
              key: resData[key].AddOnCode,
              AddOnCode: resData[key].AddOnCode,
              AddOnName: resData[key].AddOnName,
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }

          resolve(menuAddonHdr);
        })
        .catch((err) => {
          console.error("rejected from fetchMenuAddonHdr", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchMenuAddonHdr", e);
      reject(e);
    }
  });
}

export function fetchMenuAddonDtl(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`menu-master/getMenuAddonDtl/${CompCode}`)
        .then((res) => {
          const menuAddonDtl = [];
          const resData = res.data.data;
          for (const key in resData) {
            menuAddonDtl.push({
              key: resData[key].Id,
              Id: resData[key].Id,
              AddOnCode: resData[key].AddOnCode,
              ItemName: resData[key].ItemName,
              Rate: resData[key].Rate,
              AddInfo: resData[key].AddInfo,
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }

          resolve(menuAddonDtl);
        })
        .catch((err) => {
          console.error("rejected from fetchMenuAddonDtl", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchMenuAddonDtl", e);
      reject(e);
    }
  });
}

export const InsUpdtMenuAddonHdr = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        AddOnCode: val.AddOnCode,
        AddOnName: val.AddOnName,
        IsActive: val.IsActive,
        updt_usrId: UpdtUsr,
        CompCode: getState().LoginReducer.CompCode,
      };
      const res = await axios.post("menu-master/InsUpdtMenuAddonHdr", {
        data,
      });
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

export const InsUpdtMenuAddonDtl = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        Id: val.Id,
        AddOnCode: val.AddOnCode,
        ItemName: val.ItemName,
        Rate: val.Rate,
        AddInfo: val.AddInfo,
        IsActive: val.IsActive,
        updt_usrId: UpdtUsr,
        CompCode: getState().LoginReducer.CompCode,
      };
      // console.log)
      const res = await axios.post("menu-master/InsUpdtMenuAddonDtl", {
        data,
      });
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
