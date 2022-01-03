import axios from "../../axios";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";
import MenuMaster from "../../models/MenuMaster";

export const FETCH_MENU_MASTER_START = "FETCH_MENU_MASTER_START";
export const FETCH_MENU_MASTER_SUCCESS = "FETCH_MENU_MASTER_SUCCESS";
export const FETCH_MENU_MASTER_FAIL = "FETCH_MENU_MASTER_FAIL";

export const fetchMenuMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_MENU_MASTER_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`menu-master/getMenuMaster/${CompCode}`);
      const resData = res.data.data;
      const menuMaster = [];
      for (const key in resData) {
        menuMaster.push(
          new MenuMaster(
            resData[key].MenuCode,
            resData[key].ShortCode,
            resData[key].MenuName,
            resData[key].MenuDesc,
            resData[key].DietType,
            resData[key].UnitCode,
            resData[key].MenuCatCode,
            resData[key].MenuCatName,
            resData[key].MenuGroupCode,
            resData[key].HSNSACCode,
            resData[key].TaxCode,
            resData[key].ApplyForDineIn,
            resData[key].ApplyForPickUp,
            resData[key].ApplyForDelivery,
            resData[key].ApplyForOnline,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }

      // console.log(categoryMasters, "i got");
      dispatch({
        type: FETCH_MENU_MASTER_SUCCESS,
        menuMaster: menuMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_MENU_MASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const InsUpdtMenuMst = (values, Idata, IDdata, variationType, addOn) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: "MenuMaster" });
    try {
      // console.log(val)
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        val: {
          MenuCode: values.MenuCode.toUpperCase(),
          ShortCode: values.ShortCode,
          MenuName: values.MenuName,
          MenuDesc: values.MenuDesc,
          DietType: values.DietType,
          UnitCode: values.UnitCode,
          MenuCatCode: values.MenuCatCode,
          MenuGroupCode: values.MenuGroupCode,
          HSNSACCode: values.HSNSACCode,
          TaxCode: values.TaxCode,
          ApplyForDineIn: values.ApplyForDineIn === true ? "Y" : "N",
          ApplyForPickUp: values.ApplyForPickUp === true ? "Y" : "N",
          ApplyForDelivery: values.ApplyForDelivery === true ? "Y" : "N",
          ApplyForOnline: values.ApplyForOnline === true ? "Y" : "N",
          IsActive: values.IsActive,
          updt_usrId: UpdtUsr,
        },
        iData: Idata,
        idData: IDdata,
        variationType: variationType,
        addOn: addOn,
        CompCode: CompCode,
      };
      // console.log(data, "DATA");
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "menu-master/InsUpdtMenuMst",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: "MenuMaster",
        data: res.data.data,
      });
      dispatch(fetchMenuMaster());
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: "MenuMaster",
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};
