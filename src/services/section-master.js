import axios from "../axios";
import SectionMaster from "../models/section-master";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";

const TRANTYPE = "Section Master";
export function fetchSectionMaster(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`section-master/getSectionMaster/${CompCode}`)
        .then((res) => {
          const sectionMaster = [];
          const resData = res.data.data;
          for (const key in resData) {
            // console.log(resData[key].IsActive)
            sectionMaster.push(
              {
                ...resData[key],
                IsActive: resData[key].IsActive !== null && resData[key].IsActive.data[0] === 1 ? true : false,
                ImageURL: resData[key].ImageURL,
              }
              // new SectionMaster(
              //   resData[key].SecCode,
              //   resData[key].BranchCode,
              //   resData[key].SecDesc,
              //   resData[key].ImageURL,
              //   resData[key].IsActive.data[0] === 1 ? true : false
              // )
              // {
              //   ...resData[key],
              //   key: key,
              //   IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
              //   IsActiveComp:
              //     resData[key].IsActive.data[0] === 1 ? true : false,
              // }
              // const resData = res.data.data;
              // const brandMaster = [];
              // for (const key in resData) {
              //   brandMaster.push(
              //     new BrandMaster(
              //       resData[key].MfrCode,
              //       resData[key].MfrDesc,
              //       resData[key].BrandCode,
              //       resData[key].BrandDesc,
              //       resData[key].IsDefault.data[0] === 1 ? true : false,
              //       resData[key].IsActive.data[0] === 1 ? true : false
              //     )
              //   );
              // }

              // new SectionMaster(
              //   resData[key].SecCode,
              //   resData[key].BranchCode,
              //   resData[key].SecDesc,
              //   resData[key].ImageURL,
              //   resData[key].IsActive.data[0] === 1 ? true : false
              // )
            );
          }
          resolve(sectionMaster);
        })
        .catch((err) => {
          console.error("rejected from fetchSectionMaster", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchSectionMaster", e);
      reject(e);
    }
  });
}

export const InsUpdtSectionMaster = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const CompCode = getState().LoginReducer.CompCode;
      const data = {
        SecCode: val.SecCode,
        BranchCode: val.BranchCode,
        SecDesc: val.SecDesc,
        ImageURL: val.ImageURL,
        IsActive: val.IsActive,
        updt_usr: UpdtUsr,
        CompCode: CompCode,
      };
      // console.log(data)
      const res = await axios.post("section-master/InsUpdtSectionMaster", {
        data,
      });
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};

export function InsUpdtSecMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("section-master/InsUpdtSectionMaster", {
          data: { ...data, CompCode },
        })
        .then((res) => {
          const resData = res.data.data;
          let data = [];
          // console.log("res from api", resData);
          for (const key in resData) {
            data.push({ ...resData[key], key });
          }
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchSectionMasterCardData(CompCode, SecCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`section-master/getSectionMasterCardData/${CompCode}/${SecCode}`)
        .then((res) => {
          const resData = res.data.data;
          let data = [];

          for (const key in resData) {
            data.push({
              ...resData[key],
              key,
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
