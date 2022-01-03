import axios from "../../axios";
import ItemMasterModal from "../../models/ItemMaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "ItemMaster";

export const FETCH_ITEM_MASTER_START = "FETCH_ITEM_MASTER_START";
export const FETCH_ITEM_MASTER_SUCCESS = "FETCH_ITEM_MASTER_SUCCESS";
export const FETCH_ITEM_MASTER_FAIL = "FETCH_ITEM_MASTER_FAIL";

export const FETCH_ITEM_BARCODE_START = "FETCH_ITEM_BARCODE_START";
export const FETCH_ITEM_BARCODE_SUCCESS = "FETCH_ITEM_BARCODE_SUCCESS";
export const FETCH_ITEM_BARCODE_FAIL = "FETCH_ITEM_BARCODE_FAIL";

export const fetchItemMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ITEM_MASTER_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `item-master/getItemMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const ItemMaster = [];
      for (const key in resData) {
        ItemMaster.push(
          new ItemMasterModal(
            resData[key].ItemCode,
            resData[key].ItemName,
            resData[key].ItemDesc,
            resData[key].UnitCode,
            resData[key].SubCategoryCode,
            resData[key].BrandCode,
            resData[key].classCode,
            resData[key].className,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].ProductType,
            resData[key].PrintLabel,
            resData[key].HSNSACCode,
            resData[key].TaxCode,
            resData[key].SubCatDesc,
            resData[key].CatDesc,
            resData[key].MarkUpDown,
            resData[key].MarkUpDownPV,
            resData[key].Cost,
            resData[key].MRP,
            resData[key].SalePrice,
            resData[key].IsSaleOnMRP === "Y" ? true : false,
            resData[key].SecondaryUnitCode,
            resData[key].ConversionRate,
            resData[key].MaintainInventory,
            resData[key].MBQ,
            resData[key].LabelCopies,
            resData[key].TaxType,
            resData[key].Barcode,
            resData[key].BrandDesc,
            resData[key].cnt
          )
        );
      }
      dispatch({
        type: FETCH_ITEM_MASTER_SUCCESS,
        ItemMaster: ItemMaster,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ITEM_MASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};

export const fetchItemBarcode = (itemCode) => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_ITEM_BARCODE_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `item-master/getItemBarcode/${CompCode}/${itemCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const ItemBarcode = [];
      dispatch({
        type: FETCH_ITEM_BARCODE_SUCCESS,
        ItemBarcode: resData,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ITEM_BARCODE_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
export const InsUpdtItemMst = (values, Bdata, Ddata, Idata, IDdata) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        val: {
          CompCode: CompCode,
          ItemCode: values.ItemCode.toUpperCase(),
          ItemName: values.ItemName,
          ItemDesc: values.ItemDesc,
          UnitCode: values.UnitCode,
          SubCategoryCode: values.SubCategoryCode,
          BrandCode: values.BrandCode,
          classCode: values.classCode,
          IsActive: values.IsActive,
          ProductType: values.ProductType,
          PrintLabel: values.PrintLabel === true ? "Y" : "N",
          HSNSACCode: values.HSNSACCode,
          TaxCode: values.TaxCode,
          IsSaleOnMRP: values.SaleOnMRP === true ? "Y" : "N",
          MarkUpDown: values.MarkUpDown,
          MarkUpDownPV: values.MarkUpDowType,
          Cost: values.Cost,
          MRP: values.MRP,
          SalePrice: values.SalePrice,
          SecondaryUnitCode: values.SecondaryUnitCode,
          ConversionRate: values.ConversionRate,
          MaintainInventory: values.MaintainInventory,
          updt_usrId: UpdtUsr,
        },
        bData: Bdata,
        dData: Ddata,
        iData: Idata,
        idData: IDdata,
      };
      // console.log(data, "DATA");
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "item-master/InsUpdtItemMst",
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
      dispatch(fetchItemMaster());
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
