import axios from "../axios";

export const getRoundOffConfigData = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`roundOffConfig/getRoundOffConfigData/${CompCode}`, null)
        .then(async (res) => {
          const resData = res.data.data;
          resolve(resData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const UpdtRounOffConfig = (CompCode, data) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("roundOffConfig/UpdtRounOffConfig", {
          data: { ...data, CompCode },
        })
        .then(async (res) => {
          resolve(res.data);
        })
        .catch((err) => {
          console.error("rejected from UpdtRounOffConfig", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from UpdtRounOffConfig", e);
      reject(e);
    }
  });
};
