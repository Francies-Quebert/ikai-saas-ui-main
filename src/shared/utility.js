import { storage, auth } from "../firebase";
import bcrypt from "bcryptjs";
import moment from "moment";
import axios from "../axios";
import _ from "lodash";
import fileDownload from "js-file-download";
export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const hasRight = (rightsArray, rightCode) => {
  return (
    rightsArray.filter(
      (ii) => ii.RightCode === rightCode && ii.RightVal === "Y"
    ).length <= 0
  );
};

export const hasRightToBeUsedNext = (rightsArray, rightCode) => {
  return rightsArray
    ? rightsArray.filter(
        (ii) => ii.RightCode === rightCode && ii.RightVal === "Y"
      ).length > 0
    : false;
};

//Hari on 20210129
export const getDashboardParam = (pAppMain, pDashboardSource) => {
  let param = pDashboardSource.match(/\(([^)]+)\)/)
    ? pDashboardSource.match(/\(([^)]+)\)/)[1].split(",")
    : undefined;
  let tempParam = "";
  if (param) {
    param.forEach((element, index) => {
      const getParamValue = CheckDataKeys(pAppMain, param[index]);
      if (index <= 0) {
        tempParam += `${getParamValue}`;
      } else {
        tempParam += `,${getParamValue}`;
      }
    });
  }

  let tempQuery = pDashboardSource.replace(/\((.+?)\)/g, "(" + tempParam + ")");

  //Added by hari on 20210129
  // tempQuery.push(tempParam);

  return tempQuery;
};

// export const CheckDataKeysNew = (appMain, param) => {
//   return Promise(function (resolve, reject) {
//     try {
//       const dataKey = appMain.reportDataKey.find(
//         (item) => item.KeyCode === param
//       );

//       try {
//         if (dataKey && dataKey.IsFromDB === "Y") {
//           resolve(dataKey.DefValue);
//         } else if (dataKey && dataKey.IsFromDB === "N") {
//           if (param === "<<CURR_USERID>>") {
//             resolve(appMain.userInfo.userId);
//           } else if (param === "<<CURR_USERNAME>>") {
//             resolve(appMain.userInfo.userName);
//           } else if (param === "<<CURR_USERTYPE>>") {
//             resolve(appMain.userInfo.userType);
//           } else if (param === "<<END_DAY_MONTH>>") {
//             resolve(`${moment().endOf("month").format("YYYY-MM-DD")}`);
//           } else if (param === "<<ST_DAY_MONTH>>") {
//             resolve(`${moment().startOf("month").format("YYYY-MM-DD")}`);
//           } else if (param === "<<END_DAY_TIME_MONTH>>") {
//             resolve(`${moment().endOf("month").format("YYYY-MM-DD hh:mm")}`);
//           } else if (param === "<<ST_DAY_TIME_MONTH>>") {
//             resolve(`${moment().startOf("month").format("YYYY-MM-DD hh:mm")}`);
//           } else if (param === "<<NOW>>") {
//             resolve(`${moment().format("YYYY-MM-DD hh:mm")}`);
//           } else if (param === "<<NOWDATE>>") {
//             resolve(`${moment().format("YYYY-MM-DD")}`);
//           } else if (param === "<<COMPCODE>>") {
//             resolve(`${1}`);
//           } else {
//             resolve(param);
//           }
//         } else {
//           resolve(param === "" ? null : param);
//         }
//       } catch (error) {
//         reject(error);
//       }
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

export const CheckDataKeysNew = (appMain, param) => {
  const dataKey = appMain.reportDataKey.find((item) => item.KeyCode === param);
  const CompCode = appMain.CompCode ? appMain.CompCode : 1;
  // if (param === "<<COMPCODE>>") {
  //   console.log("checking", dataKey, param);
  // }
  try {
    if (dataKey && dataKey.IsFromDB === "Y") {
      return dataKey.DefValue;
    } else if (dataKey && dataKey.IsFromDB === "N") {
      if (param === "<<CURR_USERID>>") {
        return appMain.userInfo.userId;
      } else if (param === "<<CURR_USERNAME>>") {
        return appMain.userInfo.userName;
      } else if (param === "<<CURR_USERTYPE>>") {
        return appMain.userInfo.userType;
      } else if (param === "<<END_DAY_MONTH>>") {
        return `${moment().endOf("month").format("YYYY-MM-DD")}`;
      } else if (param === "<<ST_DAY_MONTH>>") {
        return `${moment().startOf("month").format("YYYY-MM-DD")}`;
      } else if (param === "<<END_DAY_TIME_MONTH>>") {
        return `${moment().endOf("month").format("YYYY-MM-DD hh:mm")}`;
      } else if (param === "<<ST_DAY_TIME_MONTH>>") {
        return `${moment().startOf("month").format("YYYY-MM-DD hh:mm")}`;
      } else if (param === "<<NOW>>") {
        return `${moment().format("YYYY-MM-DD hh:mm")}`;
      } else if (param === "<<NOWDATE>>") {
        return `${moment().format("YYYY-MM-DD")}`;
      } else if (param === "<<COMPCODE>>") {
        return `${CompCode}`;
      } else {
        return param;
      }
    } else {
      return param === "" ? null : param;
    }
  } catch (error) {
    alert(error, "error has Popped");
    return null;
  }
};

export const CheckDataKeys = (appMain, param) => {
  const dataKey = appMain.reportDataKey.find((item) => item.KeyCode === param);
  const CompCode = appMain.CompCode ? appMain.CompCode : 1;
  // console.log("checking",dataKey,param)
  try {
    if (dataKey && dataKey.IsFromDB === "Y") {
      return dataKey.DefValue;
    } else if (dataKey && dataKey.IsFromDB === "N") {
      if (param === "<<CURR_USERID>>") {
        return appMain.userInfo.userId;
      } else if (param === "<<CURR_USERNAME>>") {
        return appMain.userInfo.userName;
      } else if (param === "<<CURR_USERTYPE>>") {
        return appMain.userInfo.userType;
      } else if (param === "<<END_DAY_MONTH>>") {
        return `'${moment().endOf("month").format("YYYY-MM-DD")}'`;
      } else if (param === "<<ST_DAY_MONTH>>") {
        return `'${moment().startOf("month").format("YYYY-MM-DD")}'`;
      } else if (param === "<<END_DAY_TIME_MONTH>>") {
        return `'${moment().endOf("month").format("YYYY-MM-DD hh:mm")}'`;
      } else if (param === "<<ST_DAY_TIME_MONTH>>") {
        return `'${moment().startOf("month").format("YYYY-MM-DD hh:mm")}'`;
      } else if (param === "<<NOW>>") {
        return `'${moment().format("YYYY-MM-DD hh:mm")}'`;
      } else if (param === "<<NOWDATE>>") {
        return `'${moment().format("YYYY-MM-DD")}'`;
      } else if (param === "<<COMPCODE>>") {
        return `${CompCode}`;
      } else {
        return null;
      }
    } else {
      return param === "" ? null : param;
    }
  } catch (error) {
    alert(error, "error has Popped");
    return null;
  }
};

export const sysGenCode = (Array, Code) => {
  // console.log(Array);
  if (
    Array.filter((ii) => ii.TranType === `${Code}` && ii.ConfigType == "A")
      .length > 0
  ) {
    return true;
  } else {
    return false;
  }
};

export const getConfig = (configArray, configCode) => {
  return configArray.filter((ii) => ii.configCode === configCode)[0];
};

// export function firebaseAuth() {
//   auth
//     .auth()
//     .signInAnonymously()
//     .catch(function (error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       console.log(error);
//       // ...
//     });
// }

export function UploadImageOwnWebServer(pDirectory, pFile) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log(pDirectory, pFile, "uploaded");
      pDirectory = pDirectory.replaceAll("/", "|");
      const formData = new FormData();
      // console.log(pDirectory, "pDirectory");
      formData.append("image", pFile, `${pDirectory}|${pFile.name}`);
      formData.append("directory", pDirectory);
      axios
        .post(`file-uploads/single`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function UploadImageOwnWebServerMultiFile(pDirectory, pFile) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log(pDirectory, pFile, "uploaded");
      pDirectory = pDirectory.replaceAll("/", "|");
      const formData = new FormData();
      // console.log(pFile,pDirectory, "pDirectory");
      formData.append("image", pFile, `${pDirectory}|${pFile.name}`);
      formData.append("directory", pDirectory);
      axios
        .post(`file-uploads/singleMutiFile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function UploadImageFirebase(pDirectory, pFile) {
  return new Promise(function (resolve, reject) {
    try {
      const uploadTask = storage
        .ref(`${pDirectory}/${pFile.uid}.${pFile.type.split("/")[1]}`)
        .put(pFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progrss function ....
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => {
          console.error("err", error);
          reject(error);
        },
        () => {
          storage
            .ref(`${pDirectory}`)
            .child(`${pFile.uid}.${pFile.type.split("/")[1]}`)
            .getDownloadURL()
            .then((url) => {
              resolve({
                fileName: `${pFile.uid}.${pFile.type.split("/")[1]}`,
                url: url,
              });
            });
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

export function getHashPassword(value) {
  return new Promise(function (resolve, reject) {
    try {
      bcrypt.genSalt(
        parseInt(Math.floor(Math.random() * (12 - 8 + 1)) + 8),
        function (err, salt) {
          bcrypt.hash(value, salt, function (err, hash) {
            resolve(hash);
          });
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

// const uploadTask = storage
//   .ref(`ProductImages/${"00001"}/${file.name}`)
//   .put(file);
// uploadTask.on(
//   "state_changed",
//   (snapshot) => {
//     // progrss function ....
//     const progress = Math.round(
//       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//     );
//     // this.setState({ progress });
//   },
//   (error) => {
//     // error function ....
//     console.log(error);
//   },
//   () => {
//     // complete function ....
//     // storage
//     //   .ref("ProductImages/00001")
//     //   .child(file.name)
//     //   .getDownloadURL()
//     //   .then((url) => {
//     //     console.log(url);
//     //     // this.setState({ url });
//     //   });

//     storage
//       .ref("ProductImages/00001")
//       .listAll()
//       .then((iiii) => {
//         //   co nsole.log(iiii.items)
//         iiii.items.map((item) => {
//           item
//             .getDownloadURL()
//             .then(function (url) {
//               console.log(url);
//             })
//             .catch(function (error) {
//               console.log(error);
//             });
//         });
//       });
//   }
// );

export function fetchSequenceNextVal(CompCode, TranType, pCurrentUserName) {
  return new Promise(function (resolve, reject) {
    try {
      const data = {
        CompCode: CompCode,
        TranType: TranType,
        updt_usr: pCurrentUserName,
      };

      axios
        .post(`sys-sequence-configmaster/getSequenceNextVal`, { data })
        .then((res) => {
          const resData = res.data.data;
          let seqData = [];
          for (const key in resData) {
            seqData.push({
              NextVal: resData[key].NextVal,
              l_ResetOn: resData[key].l_ResetOn,
              l_ResetConfig: resData[key].l_ResetConfig,
            });
          }
          resolve(seqData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function RoundConfiguredValue(pRoundConfigData, pTranType, pValue) {
  return new Promise(function (resolve, reject) {
    try {
      let config = pRoundConfigData.find(
        (ll) => ll.TransactionType === pTranType
      );
      if (config.IsEnabled === "Y") {
        if (config.RoundType === "R") {
          resolve((pValue - _.round(pValue, parseInt(config.RoundValue))) * -1);
        } else if (config.RoundType === "C") {
          let tempValue =
            parseFloat(config.RoundValue) -
            (pValue % parseFloat(config.RoundValue));
          resolve(tempValue == parseFloat(config.RoundValue) ? 0 : tempValue);
        } else if (config.RoundType === "F") {
          let tempValue = (pValue % parseFloat(config.RoundValue)) * -1;
          resolve(tempValue == parseFloat(config.RoundValue) ? 0 : tempValue);
        }
      } else {
        resolve(0);
      }
    } catch (e) {
      reject(e);
    }
  });
}

export function PrintPdfOrFromElectron(res, fileName, dataType) {
  return new Promise(function (resolve, reject) {
    try {
      if (res) {
        if (window.electron) {
          window.electron.ipcRenderer.send("store-data", {
            pdf: res.data,
            name: `${fileName}.${dataType}`,
            type: dataType,
          });
          window.electron.ipcRenderer.on("data-stored", (event, arg) => {
            console.log("data stored", arg);
          });
        } else {
          fileDownload(res.data, `${fileName}.${dataType}`);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}
