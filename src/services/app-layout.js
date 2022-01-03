import axios from "../axios";
export function fetchAppLayout(CompCode, DeviceType) {
  // const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`app-layout/getAppLayout/${CompCode}/${DeviceType}`)
        .then((res) => {
          const appLayout = [];
          const resData = res.data.data;
          resolve(resData);
        })
        .catch((err) => {
          console.error("rejected from fetchAppLayout", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchAppLayout", e);
      reject(e);
    }
  });
}

export function fetchAppLayoutDtl(CompCode, DeviceType) {
  // const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`app-layout/getAppLayoutDtl/${CompCode}/${DeviceType}`)
        .then((res) => {
          // const appLayout = [];
          const resData = res.data.data;
          resolve(resData);
        })
        .catch((err) => {
          console.error("rejected from fetchAppLayoutDtl", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchAppLayoutDtl", e);
      reject(e);
    }
  });
}

export function InsUpdtAppLayout( data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("app-layout/InsUpdtAppLayout", {
          data,
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function InsUpdtAppLayoutDtl( data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("app-layout/InsUpdtAppLayoutDtl", {
          data,
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchLayoutTypeConfigHdr(CompCode) {
  // const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`app-layout/getLayoutTypeConfigHdr/${CompCode}`)
        .then((res) => {
          // const appLayout = [];
          const resData = res.data.data;
          resolve(resData);
        })
        .catch((err) => {
          console.error("rejected from fetchLayoutTypeConfigHdr", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchLayoutTypeConfigHdr", e);
      reject(e);
    }
  });
}

export function fetchLayoutTypeConfigDtl(CompCode,LayoutTypeCode) {
  // const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`app-layout/getLayoutTypeConfigDtl/${CompCode}/${LayoutTypeCode}`)
        .then((res) => {
          // const appLayout = [];
          const resData = res.data.data;
          resolve(resData);
        })
        .catch((err) => {
          console.error("rejected from fetchLayoutTypeConfigDtl", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchLayoutTypeConfigDtl", e);
      reject(e);
    }
  });
}