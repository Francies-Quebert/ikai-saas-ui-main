import axios from "../axios";

export function fetchSupplierMasterComp(CompCode, pSupplierCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`supplier-master/getSupplierMaster/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let data = [];
        for (const key in resData) {
          data.push({
            ...resData[key],
            IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            key: parseInt(key),
          });
        }
        resolve(data);
        //   console.log(resData);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtSupplierMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("supplier-master/InsUpdtSupplierMaster", {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getDataSuppliers(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`supplier-master/getDataSuppliers/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let data = [];
        for (const key in resData) {
          data.push({
            ...resData[key],
            key: parseInt(key),
          });
        }
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
}
