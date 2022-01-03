import axios from "../axios";

export function InsUpdtClassMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("class-master/InsUpdtClassMaster", {
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
