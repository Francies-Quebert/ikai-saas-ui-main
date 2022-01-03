import axios from "../axios";

export function fetchCatMasterCard(pCompCode, pCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(`categorymaster/getCatMaster/${pCompCode}/${pCode}`)
        .then((res) => {
          const resData = res.data.data;
          let categoryMaster = [];

          for (const key in resData) {
            categoryMaster.push({
              ...resData[key],
              fromDataase: true,
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }
          resolve(categoryMaster);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtCategory(pCompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("categorymaster/InsUpdtCategoryMaster", {
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
