import UnitMaster from "../models/unitmaster";
import axios from "../axios";

export function getUnitMaster(CompCode,pUserId) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios.get(`unitmaster/getUnitMaster/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let unitMaster = [];
        for (const key in resData) {
          unitMaster.push(
            new UnitMaster(
              resData[key].UnitCode,
              resData[key].UnitDesc,
              resData[key].ParentUnitCode,
              resData[key].UnitMeasureToParent,
              resData[key].AllowDecimal,
              resData[key].IsActive.data[0] === 1 ? true : false
            )
          );
        }
        // console.log("getUserRightMapp fetched data", pUserId, userRight);
        resolve(unitMaster);
      });
    } catch (e) {
      reject(e);
    }
  });
}
