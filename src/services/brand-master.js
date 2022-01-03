import BrandMasterModal from "../models/brandmaster";
import axios from "../axios";

export function getBrandMaster(pCompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`brandmaster/getBrandMaster/${pCompCode}`).then((res) => {
        const resData = res.data.data;
        let brandMaster = [];
        for (const key in resData) {
          brandMaster.push(
            new BrandMasterModal(
              resData[key].MfrCode,
              resData[key].MfrDesc,
              resData[key].BrandCode,
              resData[key].BrandDesc,
              resData[key].IsDefault.data[0] === 1 ? true : false,
              resData[key].IsActive.data[0] === 1 ? true : false
            )
          );
        }
        resolve(brandMaster);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtBrandMaster(pCompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("brandmaster/InsUpdtBrandMaster", {
          data: { ...data, CompCode: pCompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getManufacturerData(pCompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(`manufacturermaster/getManufacturerMaster/${pCompCode}`)
        .then((res) => {
          const resData = res.data.data;

          let mfrMaster = [];
          for (const key in resData) {
            mfrMaster.push({
              ...resData[key],
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          resolve(mfrMaster);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchBrandMasterCard(pCompCode, pCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(`brandmaster/getBrandData/${pCompCode}/${pCode}`)
        .then((res) => {
          const resData = res.data.data;
          let brandMaster = [];

          for (const key in resData) {
            brandMaster.push({
              ...resData[key],
              IsDefault: resData[key].IsDefault.data[0] === 1 ? true : false,
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }
          resolve(brandMaster);
        });
    } catch (e) {
      reject(e);
    }
  });
}
