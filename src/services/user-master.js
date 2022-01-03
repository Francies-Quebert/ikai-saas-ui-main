import axios from "../axios";

export function getUserByMobile(CompCode, pUserType, pMobile) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId, pUserType);
      axios
        .get(`user-master/getUserByMobile/${CompCode}/${pUserType}/${pMobile}`)
        .then((res) => {
          const resData = res.data.data;
          let customerDtl = [];
          for (const key in resData) {
            customerDtl.push({
              key: key,
              UserType: resData[key].UserType,
              UserId: resData[key].UserId,
              Name: resData[key].Name,
              UserName: resData[key].UserName,
              email: resData[key].email,
              mobile: resData[key].mobile,
              gender: resData[key].gender,
              GstNo: resData[key].GstNo,
              DOBmmdd: resData[key].DOBmmdd,
              DOByyyy: resData[key].DOByyyy,
              AnniversaryMMDD: resData[key].AnniversaryMMDD,
              AnniversaryYYYY: resData[key].AnniversaryYYYY,
            });
          }

          resolve(customerDtl);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtPOSUserMaster(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId, pUserType);
      axios
        .post(`user-master/InsUpdtPOSUserMaster`, {
          data: { ...data, CompCode },
        })
        .then((res) => {
          const resData = res.data.data;
          let customerDtl = [];
          for (const key in resData) {
            customerDtl.push({
              key: key,
              UserType: resData[key].UserType,
              UserId: resData[key].UserId,
              Name: resData[key].Name,
              UserName: resData[key].UserName,
              email: resData[key].email,
              mobile: resData[key].mobile,
              gender: resData[key].gender,
              GstNo: resData[key].GstNo,
              DOBmmdd: resData[key].DOBmmdd,
              DOByyyy: resData[key].DOByyyy,
              AnniversaryMMDD: resData[key].AnniversaryMMDD,
              AnniversaryYYYY: resData[key].AnniversaryYYYY,
            });
          }

          resolve(customerDtl);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtUserPatientAddress(CompCode, pData) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId, pUserType);
      // const UserType = getState().currentOrder.patientProfile.userType;
      // const UserId = getState().currentOrder.patientProfile.userId;
      // const data = {
      //   OprationType: 'I',
      //   UserType: UserType,
      //   UserId: UserId,
      //   AddressId: null,
      //   latitude: latitude,
      //   longitude: longitude,
      //   geoLocationName: geoLocationName,
      //   add1: add1,
      //   add2: add2,
      //   add3: add3,
      //   AddressTag: addressTag,
      //   UpdtUsr: UserId,
      // };
      // const token = getState().LoginReducer.token;
      // console.log('while api call', data)
      const res = axios
        .post("appmain/crudUserPatientAddress", {
          pData: { ...pData, CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getUserDetails(CompCode, pUserType, pUserId) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId, pUserType);
      axios
        .get(`user-master/getUserDetail/${CompCode}/${pUserType}/${pUserId}`)
        .then((res) => {
          const resData = res.data.data;
          let customerDtl = [];
          for (const key in resData) {
            customerDtl.push({
              key: key,
              UserType: resData[key].UserType,
              UserId: resData[key].UserId,
              Name: resData[key].Name,
              UserName: resData[key].UserName,
              email: resData[key].email,
              mobile: resData[key].mobile,
              gender: resData[key].gender,
              GstNo: resData[key].GstNo,
              DOBmmdd: resData[key].DOBmmdd,
              DOByyyy: resData[key].DOByyyy,
              AnniversaryMMDD: resData[key].AnniversaryMMDD,
              AnniversaryYYYY: resData[key].AnniversaryYYYY,
            });
          }

          resolve(customerDtl);
        });
    } catch (e) {
      reject(e);
    }
  });
}
export function getDataCustomers(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId, pUserType);
      axios.get(`user-master/getDataCustomers/${CompCode}`).then((res) => {
        const resData = res.data.data;

        resolve(resData);
      });
    } catch (e) {
      reject(e);
    }
  });
}
