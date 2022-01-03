import OtherMaster from "../models/othermaster";
import axios from "../axios";

export function getOtherMater(CompCode, mastertype, isactive) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      const data = {
        MasterType: mastertype,
        IsActive: isactive,
        CompCode: CompCode,
      };

      const res = axios
        .post("other-master/getOtherMaster", data)
        .then((res) => {
          const resData = res.data.data;
          let otherMasters = [];
          for (const key in resData) {
            otherMasters.push(
              new OtherMaster(
                resData[key].Id,
                resData[key].MasterType,
                resData[key].ShortCode,
                resData[key].MasterDesc,
                resData[key].IsActive.data[0] === 1 ? true : false,
                resData[key].SysOption1,
                resData[key].SysOption2,
                resData[key].SysOption3,
                resData[key].SysOption4,
                resData[key].SysOption5
              )
            );
          }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          resolve(otherMasters);
        });
    } catch (e) {
      reject(e);
    }
  });
}
