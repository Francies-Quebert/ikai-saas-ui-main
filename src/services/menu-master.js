import axios from "../axios";
import HSNSACmaster from "../models/hasnsac-master";
import ClassMaster from "../models/class-master";
import TaxMaster from "../models/tax-master";
import BrandMasterModal from "../models/brandmaster";
import UnitMaster from "../models/unitmaster";
import MenuMasterModal from "../models/MenuMaster";
import OtherMaster from "../models/othermaster";

export const fetchMenuImages = (CompCode, itemCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`menu-master/getMenuImages/${CompCode}/${itemCode}`)
        .then((res) => {
          // console.log(res.data)
          const resData = res.data.data;

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchMenuVariationTab = (CompCode, MenuCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`menu-master/getMenuVariationTab/${CompCode}/${MenuCode}`)
        .then((res) => {
          // console.log(res.data)
          const resData = res.data.data;

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchMenuAddOnTab = (CompCode, MenuCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`menu-master/getMenuAddOnTab/${CompCode}/${MenuCode}`)
        .then((res) => {
          // console.log(res.data)
          const resData = res.data.data;

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchMenuMasterCard = (CompCode, MenuCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`menu-master/getMenuMasterCard/${CompCode}/${MenuCode}`)
        .then((res) => {
          const MenuMaster = [];
          const resData = res.data.data;

          for (const key in resData) {
            MenuMaster.push(
              new MenuMasterModal(
                resData[key].MenuCode,
                resData[key].ShortCode,
                resData[key].MenuName,
                resData[key].MenuDesc,
                resData[key].DietType,
                resData[key].UnitCode,
                resData[key].MenuCatCode,
                null,
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

          resolve(MenuMaster);
          // resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export function getMenuMasterServices(CompCode, pUserId) {
  return new Promise(async function (resolve, reject) {
    try {
      let data = [];
      // console.log("getUserRightMapp fetched request", pUserId);
      await axios
        .get(`hsnsac-master/getHSNSACmaster/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;
          let hsnsacMaster = [];
          for (const key in resData) {
            hsnsacMaster.push(
              new HSNSACmaster(
                resData[key].hsnsaccode,
                resData[key].hsnsacdesc,
                resData[key].DefTaxCode,
                resData[key].IsActive.data[0] === 1 ? true : false
              )
            );
          }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          return data.push({ hsnsacMaster: hsnsacMaster });
        });
      await axios.get(`tax-master/getTaxMaster/${CompCode}`).then((res) => {
        const resDataTax = res.data.data;
        let taxMaster = [];
        for (const key in resDataTax) {
          taxMaster.push(
            new TaxMaster(
              resDataTax[key].TaxCode,
              resDataTax[key].TaxName,
              resDataTax[key].TaxType,
              resDataTax[key].TranType,
              resDataTax[key].TaxPer,
              resDataTax[key].IGSTPer,
              resDataTax[key].CGSTPer,
              resDataTax[key].SGSTPer,
              resDataTax[key].UTSTPer,
              resDataTax[key].CESSPer,
              resDataTax[key].SURCHARGPer,
              resDataTax[key].IsActive.data[0] === 1 ? true : false
            )
          );
        }
        // console.log("getUserRightMapp fetched data", pUserId, userRight);
        return data.push({ taxMaster: taxMaster });
      });
      await axios
        .get(`menu-master/getHelpMenuCategory/${CompCode}`)
        .then((res) => {
          const resDataSubCat = res.data.data;
          let menuCatMaster = [];

          for (const key in resDataSubCat) {
            menuCatMaster.push({
              ...resDataSubCat[key],
              key: parseInt(key),
              TaxCode: resDataSubCat[key].DefTaxCode,
              IsActive:
                resDataSubCat[key].IsActive.data[0] === 1 ? true : false,
            });
            //   hsnsacMaster.push(new HSNSACmaster(
            //     resData[key].hsnsaccode,
            //     resData[key].hsnsacdesc,
            //     resData[key].DefTaxCode,
            //     resData[key].IsActive.data[0] === 1 ? true : false
            //   ));
          }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          return data.push({ subCategory: menuCatMaster });
        });
      await axios.get(`unitmaster/getUnitMaster/${CompCode}`).then((res) => {
        const resDataUnit = res.data.data;
        let unitMaster = [];
        for (const key in resDataUnit) {
          unitMaster.push(
            new UnitMaster(
              resDataUnit[key].UnitCode,
              resDataUnit[key].UnitDesc,
              resDataUnit[key].ParentUnitCode,
              resDataUnit[key].UnitMeasureToParent,
              resDataUnit[key].AllowDecimal,
              resDataUnit[key].IsActive.data[0] === 1 ? true : false
            )
          );
        }
        // console.log("getUserRightMapp fetched data", pUserId, userRight);
        return data.push({ unitMaster: unitMaster });
      });
      await axios
        .post(`other-master/getOtherMaster`, {
          MasterType: "MGRP",
          CompCode: CompCode,
        })
        .then((res) => {
          const resData = res.data.data;
          let groupMaster = [];
          for (const key in resData) {
            groupMaster.push(
              new OtherMaster(
                resData[key].Id,
                resData[key].MasterType,
                resData[key].ShortCode,
                resData[key].MasterDesc,
                resData[key].IsActive.data[0] === 1 ? true : false,
                resData[key].SysOption1,
                resData[key].SysOption2,
                resData[key].SysOption3,
                resData[key].SysOption4,
                resData[key].SysOption5
              )
            );
          }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          return data.push({ groupMaster: groupMaster });
        });

      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtMenuMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("menu-master/InsUpdtMenuMst", {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}
