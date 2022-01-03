import axios from "../axios";

// getFilterFieldTypeDefination
export function fetchFilterFieldTypeDefination(pCompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`app-route/getFilterFieldTypeDefination/${pCompCode}`)
        .then((res) => {
          const filterFieldType = [];
          const resData = res.data.data;
          for (const key in resData) {
            filterFieldType.push({
              ...resData[key],
              key: parseInt(key),
            });
          }

          resolve(filterFieldType);
        })
        .catch((err) => {
          console.error("rejected from fetchFilterFieldTypeDefination", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchFilterFieldTypeDefination", e);
      reject(e);
    }
  });
}

// getFilterFieldTypeDefination
export function getAppRouteHdr(pCompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`app-route/getAppRouteHdr/${pCompCode}`)
        .then((res) => {
          const appRouteHdr = [];
          const resData = res.data.data;
          for (const key in resData) {
            appRouteHdr.push({
              ...resData[key],
              key: parseInt(key),
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }

          resolve(appRouteHdr);
        })
        .catch((err) => {
          console.error("rejected from getAppRouteHdr", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getAppRouteHdr", e);
      reject(e);
    }
  });
}

// getAppRouteDtl
export function getAppRouteDtl(pCompCode, RouteId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`app-route/getAppRouteDtl/${pCompCode}/${RouteId}`)
        .then((res) => {
          const appRouteDtl = [];
          const resData = res.data.data;

          for (const key in resData) {
            appRouteDtl.push({
              ...resData[key],
              key: parseInt(key),
            });
          }

          resolve(appRouteDtl);
        })
        .catch((err) => {
          console.error("rejected from getAppRouteHdr", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getAppRouteHdr", e);
      reject(e);
    }
  });
}

export function insUpdtAppRoute(data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("app-route/insUpdtAppRoute", {
          data: { ...data },
        })
        .then((res) => {
          resolve(res.data.data);
        });
    } catch (e) {
      reject(e);
    }
  });
}
