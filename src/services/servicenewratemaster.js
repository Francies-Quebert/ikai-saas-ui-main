import axios from "../axios";

export function fetchGetnewserviceratemapping(
  CompCode,
  pServiceID,
  pLocationId
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `serviceratemap/Getnewserviceratemapping/${CompCode}/${pServiceID}/${pLocationId}`
        )
        .then((res) => {
          const resData = res.data.data;
          let serviceNewRateMap = [];
          for (const key in resData) {
            serviceNewRateMap.push({
              key: key,
              Rate: resData[key].Rate,
              discType: resData[key].discType,
              discValue: resData[key].discValue,
              PackageId: resData[key].PackageId,
              PackageTitle: resData[key].PackageTitle,
              LocationId: resData[key].LocationId,
              ServiceId: resData[key].ServiceId,
              isDirty: false,
              isDeleted: false,
              FromDatabase: true,
            });
          }

          resolve(serviceNewRateMap);
        });
    } catch (e) {
      reject(e);
    }
  });
}
