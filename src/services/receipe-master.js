import axios from "../axios";

export function fetchItemList(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`item-master/getItemMaster/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let itemMaster = [];
        for (const key in resData) {
          itemMaster.push({
            ItemCode: resData[key].ItemCode,
            ItemName: resData[key].ItemName,
            UnitCode: resData[key].UnitCode,
            IsActive: resData[key].IsActive,
            isDirty: false,
          });
        }
        resolve(itemMaster);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchMenulist(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`menu-master/getMenuMaster/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let menuMaster = [];
        for (const key in resData) {
          menuMaster.push({
            MenuCode: resData[key].MenuCode,
            MenuName: resData[key].MenuName,
            MenuDesc: resData[key].MenuDesc,
            IsActive: resData[key].IsActive,
          });
        }
        resolve(menuMaster);
      });
    } catch (e) {
      reject(e);
    }
  });
}

//getReceipeMenuVariationInfo
export function fetchReceipeMenuVariationInfo(CompCode, pMenuCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `receipe-master/getReceipeMenuVariationInfo/${CompCode}/${pMenuCode}`
        )
        .then((res) => {
          const resData = res.data.data;
          let receipeMaster = [];
          for (const key in resData) {
            receipeMaster.push({
              key: parseInt(key),
              VariationCode: resData[key].VariationCode,
              VariationDesc: resData[key].VariationDesc,
            });
          }
          resolve(receipeMaster);
        });
    } catch (e) {
      reject(e);
    }
  });
}

//fetchRestaurantGetRecipeConsumptionDtl
export function fetchRestaurantGetRecipeConsumptionDtl(
  CompCode,
  pBranchCode,
  pMenuCode
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `receipe-master/getRestaurantGetRecipeConsumptionDtl/${CompCode}/${pBranchCode}/${pMenuCode}`
        )
        .then((res) => {
          const resData = res.data.data;
          let tempHdrData = resData[0];
          let tempDtlData = [];

          for (const key in resData[1]) {
            tempDtlData.push({
              ...resData[1][key],
              key: parseInt(key),
            });
          }
          resolve([tempHdrData, tempDtlData]);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchGetReceipedtl(CompCode, pMenuCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`receipe-master/GetReceipeDTL/${CompCode}/${pMenuCode}`)
        .then((res) => {
          const resData = res.data.data;
          let receipeMaster = [];
          for (const key in resData) {
            receipeMaster.push({
              key: parseInt(key),
              MenuCode: resData[key].MenuCode,
              ItemCode: resData[key].ItemCode,
              ItemName: resData[key].ItemName,
              Quantity: resData[key].Quantity,
              // isDirty: false,
              // isDeleted: false,
              // FromDatabase: true,
            });
          }
          resolve(receipeMaster);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtReceipeManager(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`receipe-master/InsUpdtReceipeManager`, {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          resolve(res.data);
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

export function DeleteReciepeMgmtDtl(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`receipe-master/DeleteReciepeMgmtDtl`, {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          resolve(res.data);
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
