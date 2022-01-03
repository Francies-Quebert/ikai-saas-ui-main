import axios from "../../axios";
import ItemAddInfoTmplHdr from "../../models/item-add-info-tmpl-hdr";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";
export const SET_SELCECTED_INFO_TEMP_DTL = "SET_SELCECTED_INFO_TEMP_DTL";

const TRANTYPE = "ItemAddInfoTemplate";

export const FETCH_ITEM_ADD_INFO_TMPL_HDR_START =
  "FETCH_ITEM_ADD_INFO_TMPL_HDR_START";
export const FETCH_ITEM_ADD_INFO_TMPL_HDR_SUCCESS =
  "FETCH_ITEM_ADD_INFO_TMPL_HDR_SUCCESS";
export const FETCH_ITEM_ADD_INFO_TMPL_HDR_FAIL =
  "FETCH_ITEM_ADD_INFO_TMPL_HDR_FAIL";

export const InsUpdtItemAddInfoTemplHdr = (pInsUpdtType, val, datasource) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        Hdr: {
          CompCode: CompCode,
          InsUpdtType: pInsUpdtType,
          TempId: val.TempId,
          TemplateName: val.TemplateName,
          IsActive: val.IsActive,
          updt_usrId: UpdtUsr,
        },
        Dtl: datasource,
      };

      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "item-add-info-template/InsUpdtItemAddInfoTmplHdr",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      dispatch(fetchItemAddInfoTemplHdr());
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

export const fetchItemAddInfoTemplHdr = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ITEM_ADD_INFO_TMPL_HDR_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `item-add-info-template/getItemAddInfoTmplHdr/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const itemAddInfoTmplHdr = [];
      for (const key in resData) {
        itemAddInfoTmplHdr.push(
          new ItemAddInfoTmplHdr(
            resData[key].TempId,
            resData[key].TemplateName,
            resData[key].IsActive.data[0] === 1 ? true : false
          )
        );
      }
      dispatch({
        type: FETCH_ITEM_ADD_INFO_TMPL_HDR_SUCCESS,
        itemAddInfoTmplHdr: itemAddInfoTmplHdr,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ITEM_ADD_INFO_TMPL_HDR_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const setSelectedInfoTemplDtl = (pTemplDtl) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_SELCECTED_INFO_TEMP_DTL,
        templDtl: pTemplDtl,
      });
    } catch (err) {
      throw err;
    }
  };
};

// export const IsEditing = (val) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: SET_SELCECTED_INFO_TEMP_DTL,
//         isEditing: val,
//       });
//     } catch (err) {
//       throw err;
//     }
//   };
// };
