import axios from "../../axios";
import SlotMaster from "../../models/slotmaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "SlotMaster";

export const FETCH_SLOTMASTER_START = "FETCH_SLOTMASTER_START";
export const FETCH_SLOTMASTER_SUCCESS = "FETCH_SLOTMASTER_SUCCESS";
export const FETCH_SLOTMASTER_FAIL = "FETCH_SLOTMASTER_FAIL";

export const fetchSlotMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SLOTMASTER_START });
    try {
      const token = getState().LoginReducer.token;
      // console.log(token,"main hu")
      const res = await axios.post(
        "slot/GetSlotMaster",
        { CompCode: getState().LoginReducer.CompCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const slotMasters = [];
      for (const key in resData) {
        slotMasters.push(
          new SlotMaster(
            resData[key].Id,
            resData[key].SlotName,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].starttime
          )
        );
      }
      // console.log(SlotMaster,'error')
      dispatch({
        type: FETCH_SLOTMASTER_SUCCESS,
        slotMasters: slotMasters,
      });
      // console.log(slotMasters,'error found')
    } catch (err) {
      // console.log(err,'error')
      dispatch({
        type: FETCH_SLOTMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtSlotMaster = (pInsUpdtType, pSlotMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const token = getState().LoginReducer.token;
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        Id: pSlotMaster.Id,
        SlotName: pSlotMaster.SlotName,
        IsActive: pSlotMaster.IsActive,
        updt_usrId: UpdtUsr,
        starttime: pSlotMaster.starttime,
      };
      const res = await axios.post(
        "slot/InsUpdtSlotMaster",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log(data,'hi there')
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchSlotMaster());
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
