import axios from "../axios";

export function InsUpdtItemInfoTemplate(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("item-add-info-template/InsUpdtItemAddInfoTmplHdr", {
          data: { ...data, CompCode },
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

export function InsUpdtItemInfoTemp(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("item-add-info-template/InsUpdtItemAddInfoTmpl", {
          data: { ...data, CompCode },
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

export function fetchDataItemInfoHdr(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`item-add-info-template/getItemAddInfoTmplHdr/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          //console.log(resData, "res");//
          for (const key in resData) {
            data.push({
              ...resData[key],
              key: parseInt(key),
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }
          resolve(data);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchAddInfoTmplDtl(CompCode, TempId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `item-add-info-template/getItemAddInfoTmplDtl/${CompCode}/${TempId}`
        )
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          //console.log(resData, "res");//
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
