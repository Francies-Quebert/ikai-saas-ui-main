import axios from "../axios";

export function UpdtCompanyMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("compmain/UpdtCompMain", {
          data: { ...data, CompCode },
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

export function fetchCompanyMaster(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`compmain/getCompMain/${CompCode}`)
        .then((res) => {
          const companyMaster = [];
          const resData = res.data.data;
          for (const key in resData) {
            companyMaster.push({
              ...resData[key],
            });
          }

          resolve(companyMaster);
        })
        .catch((err) => {
          console.error("rejected from fetchCompanyMaster", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchCompanyMaster", e);
      reject(e);
    }
  });
}
