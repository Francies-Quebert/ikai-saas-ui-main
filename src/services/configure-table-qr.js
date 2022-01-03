import axios from "../axios";

export function fetchConfigureTableQR(pCompCode, pBranchCode, pDeptCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `config_table_qr/getConfigureTableQR/${pCompCode}/${pBranchCode}/${pDeptCode}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              ...resData[key],
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
              key: parseInt(key),
            });
          }
          resolve(data);
          //   console.log(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsConfigureTableQR(CompCode, data) {
  console.log(data,"saf")
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("config_table_qr/InsConfigureTableQR", {
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

export function UpdtConfigureTableQR(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("config_table_qr/UpdtConfigureTableQR", {
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
