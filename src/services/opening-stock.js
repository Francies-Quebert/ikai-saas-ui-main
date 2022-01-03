import axios from "../axios";

export const getInvItemMasterData = (CompCode, BranchCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`inventory/invGetDataItemHelp/${CompCode}/${BranchCode}`)
        .then((res) => {
          // console.log(res.data)
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              ...resData[key],
              // IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
              key: parseInt(key),
            });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const getInvGetOpeningStock = (
  CompCode,
  BranchCode,
  DeptCode,
  ItemCode
) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/invGetOpeningStock/${CompCode}/${BranchCode}/${DeptCode}/${ItemCode}`
        )
        .then((res) => {
          // console.log(res.data)
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              ...resData[key],
              key: parseInt(key),
              isDirty: false,
              FromDatabase: true,
              isDeleted: false,
            });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const getItemCodeFromBarcode = (CompCode, Barcode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`inventory/invGetItemCodeFromBarcode/${CompCode}/${Barcode}`)
        .then((res) => {
          // console.log(res.data)
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              ...resData[key],
              // IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
              key: parseInt(key),
            });
          }
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};

//invValidateItemCodeInTransaction
export const invValidateItemCodeInTransaction = (CompCode, ItemCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `inventory/invValidateItemCodeInTransaction/${CompCode}/${ItemCode}`
        )
        .then((res) => {
          // console.log(res.data)
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              ...resData[key],
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
              isDirty: false,
              FromDatabase: true,
              isDeleted: false,
              key: parseInt(key),
            });
          }
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
