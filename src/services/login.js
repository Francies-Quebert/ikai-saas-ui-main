import axios from "../axios";

export function validateCompCode(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`login/validateCompCode/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((er) => {
          reject(er);
        });
    } catch (e) {
      reject(e);
    }
  });
}
