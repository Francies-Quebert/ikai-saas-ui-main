import axios from "../axios";

export function InsUpdtTableMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("tables-master/InsUpdtTablesMaster", {
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

export function fetchTableMasterData(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`tables-master/getTablesMaster/${CompCode}`).then((res) => {
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
