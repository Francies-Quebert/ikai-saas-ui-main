import axios from "../axios";

export const InsUpdtOtherMasterCard = (CompCode, data) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("other-master/InsUpdtOtherMaster", {
          data: { ...data, CompCode },
        })
        .then(async (res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from InsUpdtOtherMasterCard", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from InsUpdtOtherMasterCard", e);
      reject(e);
    }
  });
};

export function fetchDeliveryStatusOM(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`other-master/getDeliveryStatus/${CompCode}`).then((res) => {
        const resData = res.data.data;

        resolve(resData);
      });
    } catch (e) {
      reject(e);
    }
  });
}
