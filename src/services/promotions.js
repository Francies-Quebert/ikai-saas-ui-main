import React from "react";
import axios from "../axios";

export const fetchPromotionsData = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`promotions/getPromotion/${CompCode}`).then((res) => {
        // console.log(res.data)
        const resData = res.data.data;
        let data = [];
        for (const key in resData) {
          data.push({
            ...resData[key],
            IsActive: resData[key].IsActive.data[0],
            IsActiveComponent: (
              <i
                className={`fa fa-circle font-${
                  resData[key].IsActive.data[0] === 1 ? "success" : "danger"
                } f-12`}
              />
            ),
          });
        }
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export function InsUpdtPromotions(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("promotions/InsUpdtPromotions", {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          // const resData = res.data.data;
          // let data = [];
          // console.log("res from api", resData);
          // for (const key in resData) {
          //   data.push({ ...resData[key], key });
          // }
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const fetchPromotionsIEData = (CompCode) => {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`promotions/getPromotionIEData/${CompCode}`).then((res) => {
        // console.log(res.data)
        const resData = res.data.data;
        let data = [];
        for (const key in resData) {
          data.push({
            ...resData[key],
            IsActive: resData[key].IsActive.data[0],
          });
        }
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export function fetchSelectQuery(CompCode, pQuery) {
  return new Promise(function (resolve, reject) {
    try {
      // const data = { query: pQuery, parameter: pParameter };
      axios
        .get(`promotions/getSelectQuery/${CompCode}/${pQuery}`)
        .then((res) => {
          const resData = res.data.data;

          // console.log("from service", resData);
          resolve(resData);
        })
        .catch((err) => {
          console.error(err, "error in Details Data");
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const fetchPromotionIEConfig = (pCompCode, pBranchCode, pPromoCode) => {
  return new Promise(async function (resolve, reject) {
    try {
      let resData = [];
      let data = await axios
        .get(
          `promotions/getPromotionIEConfig/${pCompCode}/${pBranchCode}/${pPromoCode}`
        )
        .then((res) => {
          // console.log('from atul',res);
          resData = res.data.data;
          // let data = [];
          // for (const key in resData) {
          //   data.push({
          //     ...resData[key],
          //     IsActive: resData[key].IsActive.data[0],
          //   });
          // }
        });

      resolve(resData);
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchPromotionSchedule = (pCompCode, pBranchCode, pPromoCode) => {
  return new Promise(async function (resolve, reject) {
    try {
      let resData = [];
      let data = await axios
        .get(
          `promotions/getPromotionSchedule/${pCompCode}/${pBranchCode}/${pPromoCode}`
        )
        .then((res) => {
          // console.log('from atul',res);
          const resData = res.data.data;
          let data = [];
          for (const key in resData) {
            data.push({
              ...resData[key],
              key: parseInt(key),
              IsChecked: "Y",
              IsDirty: false,
            });
          }
          resolve(data);
        });

      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};
