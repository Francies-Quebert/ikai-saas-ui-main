import axios from "../axios";
export function fetchPOSRestaurantMenuRatesSelfOrder(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`self-order/getPOSRestaurantMenuRates/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchPOSRestaurantMenuRates", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantMenuRates", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantUserFavoriteMenusSelfOrder(
  CompCode,
  pUserType,
  UserId
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `self-order/getPOSRestaurantUserFavoriteMenus/${CompCode}/${pUserType}/${UserId}`
        )
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error(
            `rejected from fetchPOSRestaurantUserFavoriteMenus`,
            err
          );
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantUserFavoriteMenus", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantMenuAddOnDtlSelfOrder(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`self-order/getPOSRestaurantMenuAddOnDtl/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchPOSRestaurantMenuAddOnDtl", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantMenuAddOnDtl", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantMenuAddOnsSelfOrder(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`self-order/getPOSRestaurantMenuAddOns/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchPOSRestaurantMenuAddOns", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantMenuAddOns", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantMenuVariationRatesSelfOrder(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`self-order/getPOSRestaurantMenuVariationRates/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error(
            "rejected from fetchPOSRestaurantMenuVariationRates",
            err
          );
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantMenuVariationRates", e);
      reject(e);
    }
  });
}

export function saveKOT(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`self-order/saveKOT`, { ...data, CompCode: CompCode })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (e) {
      console.error("rejected from saveKOT", e);
      reject(e);
    }
  });
}

export function saveTableStatus(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`self-order/saveTableStatus`, { ...data, CompCode: CompCode })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from saveTableStatus", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from saveTableStatus", e);
      reject(e);
    }
  });
}

export function fetchConfig(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`self-order/GetConfig`, { CompCode })
        .then((res) => {
          const configData = [];
          const resData = res.data.data;

          resolve(resData);
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

export function fetchValidateSelfOrder(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`self-order/fetchValidateSelfOrder`, {
          data: { ...data, CompCode },
        })
        .then((res) => {
          const configData = [];
          const resData = res.data.data;

          resolve(resData);
        })
        .catch((err) => {
          console.error("rejected from fetchValidateSelfOrder", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchValidateSelfOrder", e);
      reject(e);
    }
  });
}
export function fetchSelfOrderKOTData(pCompCode, pBranchCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/fetchSelfOrderKOTData/${pCompCode}/${pBranchCode}`)
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({ ...resData[key], key: key });
          }
          resolve(data);
        })
        .catch((err) => {
          console.error("rejected from fetchSelfOrderKOTData", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchSelfOrderKOTData", e);
      reject(e);
    }
  });
}
