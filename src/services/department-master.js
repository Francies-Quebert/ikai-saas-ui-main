import axios from "../axios";

export function fetchDeptMasterService(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`deptmaster/getDeptMaster/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;
          resolve(resData);
        })
        .catch((err) => {
          console.error("rejected from fetchBranchMaster", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchBranchMaster", e);
      reject(e);
    }
  });
}
