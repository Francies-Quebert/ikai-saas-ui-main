import UserAccess from "../models/userAccess";
import UserRightsMapp from "../models/userRightsMapp";
import axios from "../axios";

export function getUserAccess(CompCode, pUserId) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserAccess fetched request", pUserId);
      axios
        .get(`user-master/getUserAccess/${CompCode}/${pUserId}`)
        .then((res) => {
          const userAccess = [];
          const resData = res.data.data;

          for (const key in resData) {
            userAccess.push(
              new UserAccess(
                resData[key].ModGroupId,
                resData[key].ModGroupDesc,
                resData[key].ModuleId,
                resData[key].ModuleName,
                resData[key].Rights,
                resData[key].ModType
              )
            );
          }

          resolve(userAccess);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getUserRightMapp(CompCode, pUserId) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(`user-master/getUserRightmapp/${CompCode}/${pUserId}`)
        .then((res) => {
          const resData = res.data.data;
          let userRight;
          for (const key in resData) {
            userRight = new UserRightsMapp(
              resData[key].Id,
              resData[key].UserType,
              resData[key].UserId,
              resData[key].UserAccessType,
              resData[key].UserGroupAccessId
            );
          }
          // console.log("getUserRightMapp fetched data", pUserId, userRight);
          resolve(userRight);
        });
    } catch (e) {
      reject(e);
    }
  });
}
