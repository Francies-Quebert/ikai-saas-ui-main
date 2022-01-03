import axios from "../axios";

export function fetchGetnewserslotlocmapp(CompCode,pLocationId,pServiceId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `service/Getnewserslotlocmapp/${CompCode}/${pLocationId}/${pServiceId}`
        )
        .then((res) => {
          const resData = res.data.data;
          let serSlotLocMapp = [];
          for (const key in resData) {
            serSlotLocMapp.push({
              key:key,
              Id: resData[key].Id,
              SlotName: resData[key].SlotName,
              starttime: resData[key].starttime,
              IsMapped: resData[key].IsMapped,
              IsDirty: false,
            //   LocationId: resData[key].LocationId,
            //   ServiceId: resData[key].ServiceId,
            //   isDeleted:false,
            //   FromDatabase:true
            });
          }
          resolve(serSlotLocMapp);
        });
    } catch (e) {
      reject(e);
    }
  });
}
