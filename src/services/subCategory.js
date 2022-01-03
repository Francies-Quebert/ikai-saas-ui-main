import SubCategoryMaster from "../models/subCategoryMaster";
import axios from "../axios";
import ItemAddInfoTmplHdr from "../models/item-add-info-tmpl-hdr";

export function getSubCategoryMaster(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(`sub-category-master/getSubCategory/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;
          let subCategoryMaster = [];
          for (const key in resData) {
            subCategoryMaster.push(
              new SubCategoryMaster(
                resData[key].SubCatCode,
                resData[key].CatCode,
                resData[key].SubCatDesc,
                resData[key].SubCatDetailDesc,
                resData[key].ImageUrl,
                resData[key].DefHSNSACCode,
                resData[key].IsActive.data[0] === 1 ? true : false,
                resData[key].IsInventory.data[0] === 1 ? true : false
              )
            );
          }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          resolve(subCategoryMaster);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getAddInfoTemplate(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(`item-add-info-template/getItemAddInfoTmplHdr/${CompCode}`)
        .then((res) => {
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
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          resolve(itemAddInfoTmplHdr);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtSubCategory(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("sub-category-master/InsUpdtSubCategoryMaster", {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          // const resData = res.data.data;
          // let data = [];
          // console.log("res from api", resData);
          // for (const key in resData) {
          //   data.push({ ...resData[key], key });
          // }
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchSubCatMasterCard(CompCode, pCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(`sub-category-master/getSubCatMaster/${CompCode}/${pCode}`)
        .then((res) => {
          const resData = res.data.data;
          let subCategoryMaster = [];

          for (const key in resData) {
            // console.log(resData[key]);
            subCategoryMaster.push({
              ...resData[key],
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
              IsInventory:
                resData[key].IsInventory.data[0] === 1 ? true : false,
            });
          }
          // for (const key in resData) {
          //   subCategoryMaster.push(
          //     new SubCategoryMaster(
          //       resData[key].SubCatCode,
          //       resData[key].CatCode,
          //       resData[key].SubCatDesc,
          //       resData[key].SubCatDetailDesc,
          //       resData[key].ImageUrl,
          //       resData[key].DefHSNSACCode,
          //       resData[key].IsActive.data[0] === 1 ? true : false,
          //       resData[key].IsInventory.data[0] === 1 ? true : false
          //     )
          //   );
          // }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          resolve(subCategoryMaster);
        });
    } catch (e) {
      reject(e);
    }
  });
}
