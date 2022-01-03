import axios from "../../axios";
import ReceipeMaster from "../../models/receipe-master";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";
import { fetchGetReceipedtl } from "../../services/receipe-master";

const TRANTYPE = "receipemaster";

export const InsUpdtreceipemasterhdr = (pInsUpdtType, MenuCode) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        MenuCode: MenuCode,
        updt_usrId: UpdtUsr,
      };
      const res = await axios.post("receipe-master/InsUpdtReceipeMaster", {
        data,
      });
      dispatch({
        // type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchGetReceipedtl());
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

export const InsUpdtreceipemasterdtl = (pInsUpdtType, pData, MenuCode) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      let res = [];
      const UpdtUsr = getState().LoginReducer.userData.username;
      for (const key in pData) {
        const data = {
          Hdr: {
            CompCode: getState().LoginReducer.CompCode,
            InsUpdtType: pInsUpdtType,
            MenuCode: MenuCode,
            ItemCode: pData[key].ItemCode,
            Quantity: pData[key].Quantity,
            updt_usr: UpdtUsr,
            isDirty: pData[key].isDirty,
            isDeleted: pData[key].isDeleted,
            FromDatabase: pData[key].FromDatabase,
          },
        };

        res = await axios.post("receipe-master/InsUpdtReceipesMaster", {
          data,
        });
      }
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchGetReceipedtl());
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
