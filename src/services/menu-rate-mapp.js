import axios from "../axios";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";

const TRANTYPE = "MenuRateMapp";

export function fetchMenuRateMap(CompCode, pBranchCode, pDeptCode, pSecCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `menu-master/getMenuRateMapp/${CompCode}/${pBranchCode}/${pDeptCode}/${pSecCode}`
        )
        .then((res) => {
          const resData = res.data.data;
          let menuRateMapp = [];
          for (const key in resData) {
            let menuRateGroup = menuRateMapp.findIndex(
              (ii) => ii.MenuCode === resData[key].MenuCode
            );

            if (menuRateGroup >= 0) {
              menuRateMapp[menuRateGroup].childrens.push({
                key: resData[key].VariationCode,
                MenuCode: resData[key].MenuCode,
                VariationCode: resData[key].VariationCode,
                VariationDesc: resData[key].VariationDesc,
                Rate: resData[key].Rate,
                isDirty: false,
              });
            } else {
              menuRateMapp.push({
                key: key,
                MenuCode: resData[key].MenuCode,
                ShortCode: resData[key].ShortCode,
                MenuName: resData[key].MenuName,
                MenuDesc: resData[key].MenuDesc,
                DietType: resData[key].DietType,
                UnitCode: resData[key].UnitCode,
                MenuCatCode: resData[key].MenuCatCode,
                MenuGroupCode: resData[key].MenuGroupCode,
                ApplyForDineIn: resData[key].ApplyForDineIn,
                ApplyForPickUp: resData[key].ApplyForPickUp,
                ApplyForDelivery: resData[key].ApplyForDelivery,
                ApplyForOnline: resData[key].ApplyForOnline,
                MenuCatName: resData[key].MenuCatName,
                GroupDesc: resData[key].GroupDesc,
                URL: resData[key].URL,
                Rate: resData[key].Rate,
                isDirty: false,
                childrens: [],
              });
              if (resData[key].VariationCode) {
                menuRateMapp[menuRateMapp.length - 1].childrens.push({
                  key: resData[key].VariationCode,
                  MenuCode: resData[key].MenuCode,
                  VariationCode: resData[key].VariationCode,
                  VariationDesc: resData[key].VariationDesc,
                  Rate: resData[key].Rate,
                  isDirty: false,
                });
              }
            }
          }
          resolve(menuRateMapp);
        })
        .catch((err) => {
          console.error("rejected from fetchMenuRateMap", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchMenuRateMap", e);
      reject(e);
    }
  });
}

export const InsUpdtMenuRateMapp = (CompCode, pData) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      // const data = {
      //   Data: pData,
      //   UpdtUsrId: UpdtUsr,
      // };
      let data = { data: { ...pData, updtUsr: UpdtUsr, CompCode: CompCode } };
      const res = await axios.post("menu-master/insUpdtMenuRateMapp", data);
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
