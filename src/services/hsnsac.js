import HSNSACmaster from "../models/hasnsac-master";
import axios from "../axios";

export function getHSNSACmaster(CompCode, pUserId) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios.get(`hsnsac-master/getHSNSACmaster/${CompCode}`).then((res) => {
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
        resolve(hsnsacMaster);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtHsnsacMaster( data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("hsnsac-master/InsUpdtHSNSACmaster", {
          data,
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}


export function fetchHsnsacMasterData(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`hsnsac-master/getHSNSACmaster/${CompCode}`).then((res) => {
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

