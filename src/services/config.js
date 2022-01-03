import axios from "../axios";

export function fetchConfigData(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`config/getConfigData/${CompCode}`)
        .then((res) => {
          const configData = [];
          const resData = res.data.data;

          for (const key in resData) {
            configData.push({
              key,
              id: resData[key].id,
              ProjectType: resData[key].ProjectType,
              ConfigGroup: resData[key].ConfigGroup,
              ConfigCode: resData[key].ConfigCode,
              ConfigAccessLevel: resData[key].ConfigAccessLevel,
              ConfigType: resData[key].ConfigType,
              ConfigName: resData[key].ConfigName,
              Value1: resData[key].Value1,
              Value2: resData[key].Value2,
              ConfigDesc: resData[key].ConfigDesc,
              SysOption1: resData[key].SysOption1,
              SysOption2: resData[key].SysOption2,
            });
          }

          resolve(configData);
        })
        .catch((err) => {
          console.error("rejected from fetchConfigData", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchConfigData", e);
      reject(e);
    }
  });
}
