import axios from "../axios";

export function fetchTransactionTypeMaster(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`transaction-type-master/getTransactionTypeMaster/${CompCode}`)
        .then((res) => {
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
export function fetchTransactionTypeConfig(
  CompCode,
  pBranchCode,
  pTranTypeCode
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `transaction-type-master/getTranTypeConfigData/${CompCode}/${pBranchCode}/${pTranTypeCode}`
        )
        .then((res) => {
          const resData = res.data.data;
          let tempData = [];
          for (const key in resData) {
            tempData.push({
              ...resData[key],
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
              key: parseInt(key),
            });
          }
          resolve(tempData);
          //   console.log(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtTransactionTypeConfig(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("transaction-type-master/InsUpdtTransactionTypeConfig", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function DeleteTransactionTypeConfig(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("transaction-type-master/DeleteTransactionTypeConfig", {
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
