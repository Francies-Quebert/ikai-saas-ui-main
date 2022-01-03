import axios from "../axios";

export function fetchHomeScreenAppLayoutDtl(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`homescreen-app-layout/getHomeScreenAppLayoutDtl/${CompCode}`)
        .then((res) => {
          const homescreenAppLayoutDtl = [];
          const resData = res.data.data;

          for (const key in resData) {
            homescreenAppLayoutDtl.push({
              key: resData[key].LayoutId,
              Id: resData[key].Id,
              LayoutId: resData[key].LayoutId,
              PromoTitle: resData[key].PromoTitle,
              PromoImageUri: resData[key].PromoImageUri,
              pathType: resData[key].pathType,
              SysOption1: resData[key].SysOption1,
              SysOption2: resData[key].SysOption2,
              SysOption3: resData[key].SysOption3,
              SysOption4: resData[key].SysOption4,
              SysOption5: resData[key].SysOption5,
              OrderBy: resData[key].OrderBy,
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }

          resolve(homescreenAppLayoutDtl);
        })
        .catch((err) => {
          console.error("rejected from fetchHomeScreenAppLayoutDtl", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchHomeScreenAppLayoutDtl", e);
      reject(e);
    }
  });
}

export function fetchHomeScreenAppLayout(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserAccess fetched request", pUserId);
      axios
        .get(`homescreen-app-layout/getHomeScreenAppLayout/${CompCode}`)
        .then((res) => {
          const homescreenAppLayout = [];
          const resData = res.data.data;

          for (const key in resData) {
            homescreenAppLayout.push({
              key: resData[key].LayoutId,
              LayoutId: resData[key].LayoutId,
              LayoutTitle: resData[key].LayoutTitle,
              LayoutType: resData[key].LayoutType,
              FrameHeight: resData[key].FrameHeight,
              AutoPlay: resData[key].AutoPlay,
              AutoPlayDuration: resData[key].AutoPlayDuration,
              CmptHeight: resData[key].CmptHeight,
              CmptWidth: resData[key].CmptWidth,
              CmptShowTitle: resData[key].CmptShowTitle,
              OrderBy: resData[key].OrderBy,
              IsActive: resData[key].IsActive.data[0] === 1 ? true : false,
            });
          }

          resolve(homescreenAppLayout);
        })
        .catch((err) => {
          console.error("rejected from fetchHomeScreenAppLayout", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchHomeScreenAppLayout", e);
      reject(e);
    }
  });
}
