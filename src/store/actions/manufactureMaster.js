//Manufacturer Master
import axios from "../../axios";
import ManufacturerMaster from "../../models/manufacturermaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

const TRANTYPE = "ManufacturerMaster";

export const FETCH_MANUFACTURERMASTER_START = "FETCH_MANUFACTURERMASTER_START";
export const FETCH_MANUFACTURERMASTER_SUCCESS =
  "FETCH_MANUFACTURERMASTER_SUCCESS";
export const FETCH_MANUFACTURERMASTER_FAIL = "FETCH_MANUFACTURERMASTER_FAIL";

export const InsUpdtManufacturerMaster = (
  pInsUpdtType,
  pManufacturerMaster
) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        MfrCode: pManufacturerMaster.MfrCode,
        MfrDesc: pManufacturerMaster.MfrDesc,
        IsActive: pManufacturerMaster.IsActive,
        UpdtUsr: UpdtUsr,
      };
      // console.log(data,"hey")
      const res = await axios.post(
        "manufacturermaster/InsUpdtManufacturerMaster",
        {
          data,
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchManufacturerMasters());
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

export const fetchManufacturerMasters = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_MANUFACTURERMASTER_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `manufacturermaster/getManufacturerMaster/${CompCode}`
      );
      const resData = res.data.data;
      const manufacturerMasters = [];
      for (const key in resData) {
        manufacturerMasters.push(
          new ManufacturerMaster(
            resData[key].MfrCode,
            resData[key].MfrDesc,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }

      // console.log(categoryMasters, "i got");
      dispatch({
        type: FETCH_MANUFACTURERMASTER_SUCCESS,
        manufacturerMasters: manufacturerMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_MANUFACTURERMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
