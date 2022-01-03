import axios from "../axios";
import HSNSACmaster from "../models/hasnsac-master";
import ClassMaster from "../models/class-master";
import TaxMaster from "../models/tax-master";
import BrandMasterModal from "../models/brandmaster";
import UnitMaster from "../models/unitmaster";
import ItemMasterModal from "../models/ItemMaster";

export function getItemSubCategories(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios.get(`item-master/getHelpSubCategory/${CompCode}`).then((res) => {
        const resData = res.data.data;
        // let hsnsacMaster=[];
        // for (const key in resData) {
        //   hsnsacMaster.push(new HSNSACmaster(
        //     resData[key].hsnsaccode,
        //     resData[key].hsnsacdesc,
        //     resData[key].DefTaxCode,
        //     resData[key].IsActive.data[0] === 1 ? true : false
        //   ));
        // }
        // console.log("getUserRightMapp fetched data", pUserId, userRight);
        resolve(resData);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export const fetchItemImages = (CompCode, itemCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`item-master/getItemImages/${CompCode}/${itemCode}`)
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

export const fetchItemMasterCard = (CompCode, itemCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`item-master/getItemMasterCard/${CompCode}/${itemCode}`)
        .then((res) => {
          const ItemMaster = [];
          const resData = res.data.data;

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
                null,
                resData[key].IsActive.data[0] === 1 ? true : false,
                resData[key].ProductType,
                resData[key].PrintLabel,
                resData[key].HSNSACCode,
                resData[key].TaxCode,
                null,
                null,
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
                resData[key].TaxType
              )
            );
          }

          resolve(ItemMaster);
          // resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export function getItemMasterServices(CompCode, pUserId) {
  return new Promise(async function (resolve, reject) {
    try {
      let data = [];
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
      await axios.get(`brandmaster/getBrandMaster/${CompCode}`).then((res) => {
        const resDataBrand = res.data.data;
        let brandMaster = [];
        for (const key in resDataBrand) {
          brandMaster.push(
            new BrandMasterModal(
              resDataBrand[key].MfrCode,
              resDataBrand[key].MfrDesc,
              resDataBrand[key].BrandCode,
              resDataBrand[key].BrandDesc,
              resDataBrand[key].IsDefault.data[0] === 1 ? true : false,
              resDataBrand[key].IsActive.data[0] === 1 ? true : false
            )
          );
        }
        // console.log("getUserRightMapp fetched data", pUserId, userRight);
        return data.push({ brandMaster: brandMaster });
      });
      await axios
        .get(`item-master/getHelpSubCategory/${CompCode}`)
        .then((res, index) => {
          const resDataSubCat = res.data.data;
          let subCatMaster = [];
          for (const key in resDataSubCat) {
            subCatMaster.push({
              ...resDataSubCat[key],
              key: key,
              IsActive:
                resDataSubCat[key].IsActive.data[0] === 1 ? true : false,
              IsInventory:
                resDataSubCat[key].IsInventory.data[0] === 1 ? true : false,
            });
          }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          return data.push({
            subCategory: subCatMaster,
          });
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
      await axios.get(`class-master/getClassMaster/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let classMaster = [];
        for (const key in resData) {
          classMaster.push(
            new ClassMaster(
              resData[key].ClassId,
              resData[key].ClassCode,
              resData[key].ClassName,
              resData[key].IsActive.data[0] === 1 ? true : false
            )
          );
        }
        // console.log("getUserRightMapp fetched data", pUserId, userRight);
        return data.push({ classMaster: classMaster });
      });

      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtItemMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("item-master/InsUpdtItemMst", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchDepatmentAndBranch(CompCode) {
  return new Promise(async function (resolve, reject) {
    try {
      let data = [];

      await axios
        .get(`deptmaster/getDeptMaster/${CompCode}`, null)
        .then((dres) => {
          data.push(dres.data.data.filter((aa) => aa.IsActive.data[0] === 1));
        });

      await axios
        .get(`branchmaster/getBranchMaster/${CompCode}`, null)
        .then((res) => {
          data.push(res.data.data.filter((aa) => aa.IsActive.data[0] === 1));
        });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

export const ValidateItemBarcode = (CompCode, Barcode, itemCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `item-master/getValidateItemBarcode/${CompCode}/${Barcode}/${itemCode}`
        )
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

export const getValidateItemMaster = (CompCode, itemCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`item-master/getValidateItemMaster/${CompCode}/${itemCode}`)
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

//Atul 2021-01-29

export const fetchDataItemAdditionalInfoTemplate = (
  CompCode,
  ItemCode,
  TemplateId
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `item-master/getDataItemAddInfoTemplate/${CompCode}/${ItemCode}/${TemplateId}`
        )
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

//saveInsItemMstAddInfoDtl
export function saveItemMstAddInfoDtl(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("item-master/saveItemMstAddInfoDtl", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const fetchItemMasterData = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`item-master/getItemMaster/${CompCode}`).then((res) => {
        // console.log(res.data)
        const resData = res.data.data;

        resolve(resData);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchVariationTypesConfigHdr = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`item-master/getVariationTypesConfigHdr/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchDataItemVariants = (CompCode, ItemCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`item-master/getDataItemVariants/${CompCode}/${ItemCode}`)
        .then((res) => {
          const resData = res.data.data;

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
};
