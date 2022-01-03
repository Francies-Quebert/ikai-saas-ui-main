import axios from "../axios";

export function getKOTData(pCompCode, pBranchCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `restaurant-pos/getDataRestaurantPOSViewKOT/${pCompCode}/${pBranchCode}`
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
export function getKOTDtlData(CompCode, pKOTId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `restaurant-pos/getDataRestaurantPOSViewKOTDtl/${CompCode}/${pKOTId}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              ...resData[key],
              key: parseInt(key),
              IsDeleted: "N",
              IsChecked:
                resData[key].ItemStatus === "PND" ||
                resData[key].ItemStatus === "PPND"
                  ? "Y"
                  : "N",
            });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function updtKOTStatus(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`restaurant-pos/updtKOTStatus`, { data: { ...data, CompCode } })
        .then((res) => {
          const resData = res.data;

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function updtKOTItemStatus(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`restaurant-pos/updtKOTItemStatus`, {
          data: { ...data, CompCode },
        })
        .then((res) => {
          const resData = res.data;
          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function updtRestaurantKOTStatus(CompCode, pKOTId, pUpdtUsr) {
  return new Promise(function (resolve, reject) {
    const data = { KOTId: pKOTId, UpdtUsr: pUpdtUsr, CompCode };
    try {
      axios
        .post(`restaurant-pos/updtRestaurantKOTStatus`, { data })
        .then((res) => {
          const resData = res.data;
          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}
