import axios from "../axios";

export function fetchDashboardLayout(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`dashboard/getDashboardLayout/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchDashboardLayout", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchDashboardLayout", e);
      reject(e);
    }
  });
}

export function fetchDashboardConfig(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`dashboard/getDashboardConfig/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchDashboardConfig", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchDashboardConfig", e);
      reject(e);
    }
  });
}

export function fetchDashboardLayoutConfigMapp(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`dashboard/getDashboardLayoutConfigMapp/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchDashboardLayoutConfigMapp", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchDashboardLayoutConfigMapp", e);
      reject(e);
    }
  });
}
