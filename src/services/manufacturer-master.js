import axios from "../axios";

export function InsUpdtManufacturerMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("manufacturermaster/InsUpdtManufacturerMaster", {
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

export function fetchMNFRMasterCard(CompCode, pCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(`manufacturermaster/getMFRData/${CompCode}/${pCode}`)
        .then((res) => {
          const resData = res.data.data;
          let mfrData = [];

          for (const key in resData) {
            mfrData.push({
              ...resData[key],
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }
          resolve(mfrData);
        });
    } catch (e) {
      reject(e);
    }
  });
}
