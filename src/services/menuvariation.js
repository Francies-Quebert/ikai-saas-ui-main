import axios from "../axios";

export function fetchGetMenuVariations(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`menuvariations-master/getMenuVariations/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let menuVariationsMaster = [];
        for (const key in resData) {
            menuVariationsMaster.push({
            MenuCode: resData[key].MenuCode,
            VariationCode: resData[key].VariationCode,
          });
        }

        resolve(menuVariationsMaster);
      });
    } catch (e) {
      reject(e);
    }
  });
}


