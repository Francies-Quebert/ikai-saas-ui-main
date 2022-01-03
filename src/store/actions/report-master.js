// import axios from "../../axios";
// import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

// export const InsUpdtMenuMst = (values, Idata, IDdata,variationType,addOn) => {
//   console.log(IDdata);
//   return async (dispatch, getState) => {
//     dispatch({ type: TRAN_START, tranType: "MenuMaster" });
//     try {
//       // console.log(val)
//       const UpdtUsr = getState().LoginReducer.userData.username;
//       const data = {
//         val: {
//           MenuCode: values.MenuCode.toUpperCase(),
//           ShortCode: values.ShortCode,
//           MenuName: values.MenuName,
//           MenuDesc: values.MenuDesc,
//           DietType: values.DietType,
//           UnitCode: values.UnitCode,
//           MenuCatCode: values.MenuCatCode,
//           MenuGroupCode: values.MenuGroupCode,
//           HSNSACCode: values.HSNSACCode,
//           TaxCode: values.TaxCode,
//           ApplyForDineIn: values.ApplyForDineIn === true ? "Y" : "N",
//           ApplyForPickUp: values.ApplyForPickUp === true ? "Y" : "N",
//           ApplyForDelivery: values.ApplyForDelivery === true ? "Y" : "N",
//           ApplyForOnline: values.ApplyForOnline === true ? "Y" : "N",
//           IsActive: values.IsActive,
//           updt_usrId: UpdtUsr,
//         },
//         iData: Idata,
//         idData: IDdata,
//         variationType:variationType,
//         addOn:addOn
//       };
//       // console.log(data, "DATA");
//       const token = getState().LoginReducer.token;
//       const res = await axios.post(
//         "menu-master/InsUpdtMenuMst",
//         {
//           data,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       dispatch({
//         type: TRAN_SUCCESS,
//         tranType: "MenuMaster",
//         data: res.data.data,
//       });
//       dispatch(fetchMenuMaster());
//     } catch (ex) {
//       dispatch({
//         type: TRAN_FAIL,
//         tranType: "MenuMaster",
//         error:
//           "Network error !! Check your internet connection. \n" + ex.message,
//       });
//     }
//   };
// };
