import { useSelector, useDispatch } from "react-redux";

import axios from "../axios";
export function InsUpdtBranchMaster( CompCode,data) {
  // const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("branchmaster/InsUpdtBranchMaster", {
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

export function fetchBranchMasterData(pCompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`branchmaster/getBranchMaster/${pCompCode}`)
        .then((res) => {
          const branchMaster = [];
          const resData = res.data.data;
          for (const key in resData) {
            branchMaster.push({
              ...resData[key],
              key: key,
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }

          resolve(branchMaster);
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
