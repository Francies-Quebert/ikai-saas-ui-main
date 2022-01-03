import axios from "../axios";

export const getItemVariationConfigData = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`item-master/getItemVariationConfigData/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
};
