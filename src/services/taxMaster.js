import TaxMaster from "../models/tax-master";
import axios from "../axios";

export function getTaxMaster(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios.get(`tax-master/getTaxMaster/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let taxMaster = [];
        for (const key in resData) {
          taxMaster.push(
            new TaxMaster(
              resData[key].TaxCode,
              resData[key].TaxName,
              resData[key].TaxType,
              resData[key].TranType,
              resData[key].TaxPer,
              resData[key].IGSTPer,
              resData[key].CGSTPer,
              resData[key].SGSTPer,
              resData[key].UTSTPer,
              resData[key].CESSPer,
              resData[key].SURCHARGPer,
              resData[key].IsActive.data[0] === 1 ? true : false
            )
          );
        }
        // console.log("getUserRightMapp fetched data", pUserId, userRight);
        resolve(taxMaster);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtTaxMaster(data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("tax-master/InsUpdtTaxMaster", {
          data: { ...data },
        })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

//govind 12/04/2021
export function fetchTaxMasterData(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`tax-master/getTaxMaster/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let data = [];
        for (const key in resData) {
          data.push({
            ...resData[key],
            key,
            IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
          });
        }
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
}
