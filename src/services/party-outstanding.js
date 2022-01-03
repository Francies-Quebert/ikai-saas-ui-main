import axios from "../axios";

export function fetchDataPartyOutstandingSummary(
  CompCode,
  pPartyId,
  FromDate,
  ToDate
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `payment-master/getDataPartyOutstandingSummary/${CompCode}/${pPartyId}/${FromDate}/${ToDate}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key], key });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchDataPartyOutstandingDetail(
  CompCode,
  pPartyId,
  FromDate,
  ToDate
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `payment-master/getDataPartyOutstandingDetail/${CompCode}/${pPartyId}/${FromDate}/${ToDate}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              ...resData[key],
              key,
              isRightSelected: false,
              AdjustedAmount: 0,
            });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}
