import axios from "../axios";

export function fetchTableList(CompCode, BranchCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getRestaurantTablesList/${CompCode}/${BranchCode}`)
        .then((res) => {
          const resData = res.data.data;
          let tablesGroup = [];
          if (resData.length > 0)
            for (const key in resData) {
              let index = tablesGroup.findIndex(
                (jj) => jj.SecCode === resData[key].SecCode
              );

              if (index >= 0) {
                tablesGroup[index].children.push({
                  TableCode: resData[key].TableCode,
                  TableName: resData[key].TableName,
                  SecCode: resData[key].SecCode,
                  Icon: resData[key].Icon,
                  SittingCapacity: resData[key].SittingCapacity,
                  OrderBy: resData[key].OrderBy,

                  TableType: resData[key].TableType,
                  ParentTableCodes: resData[key].ParentTableCodes,
                  SysOption1: resData[key].SysOption1,
                  SysOption2: resData[key].SysOption2,
                  SysOption3: resData[key].SysOption3,
                  SysOption4: resData[key].SysOption4,
                  SysOption5: resData[key].SysOption5,
                  TableStatus: resData[key].TableStatus,
                  Remark: resData[key].Remark,
                });
              } else {
                tablesGroup.push({
                  SecCode: resData[key].SecCode,
                  SecDesc: resData[key].SecDesc,
                  SecImage: resData[key].SecImage,
                  children: [
                    {
                      TableCode: resData[key].TableCode,
                      TableName: resData[key].TableName,
                      SecCode: resData[key].SecCode,
                      Icon: resData[key].Icon,
                      SittingCapacity: resData[key].SittingCapacity,
                      OrderBy: resData[key].OrderBy,

                      TableType: resData[key].TableType,
                      ParentTableCodes: resData[key].ParentTableCodes,
                      SysOption1: resData[key].SysOption1,
                      SysOption2: resData[key].SysOption2,
                      SysOption3: resData[key].SysOption3,
                      SysOption4: resData[key].SysOption4,
                      SysOption5: resData[key].SysOption5,
                      TableStatus: resData[key].TableStatus,
                      Remark: resData[key].Remark,
                    },
                  ],
                });
              }
              resolve(tablesGroup);
            }
          else {
            resolve(true);
          }
        })
        .catch((err) => {
          console.error("rejected from fetchTableList", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchTableList", e);
      reject(e);
    }
  });
}

export function saveKOT(data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`restaurant-pos/saveKOT`, data)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (e) {
      console.error("rejected from saveKOT", e);
      reject(e);
    }
  });
}

export function updateKOTAddInfo(CompCode, data) {
  return new Promise(function (resolve, reject) {
    console.log({
      ...data,
      CompCode: CompCode,
    });
    try {
      axios
        .post(`restaurant-pos/updateKOTAddInfo`, {
          data: {
            ...data,
            CompCode: CompCode,
          },
        })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from updateKOTAddInfo", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from updateKOTAddInfo", e);
      reject(e);
    }
  });
}

export function saveTableStatus(CompCode, data) {
  return new Promise(async function (resolve, reject) {
    try {
      await axios
        .post(`restaurant-pos/saveTableStatus`, { ...data, CompCode: CompCode })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          console.error("rejected from saveTableStatus", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from saveTableStatus", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantMenuRates(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getPOSRestaurantMenuRates/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchPOSRestaurantMenuRates", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantMenuRates", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantUserFavoriteMenus(
  CompCode,
  pUserType,
  UserId
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `restaurant-pos/getPOSRestaurantUserFavoriteMenus/${CompCode}/${pUserType}/${UserId}`
        )
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error(
            `rejected from fetchPOSRestaurantUserFavoriteMenus`,
            err
          );
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantUserFavoriteMenus", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantMenuAddOnDtl(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getPOSRestaurantMenuAddOnDtl/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchPOSRestaurantMenuAddOnDtl", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantMenuAddOnDtl", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantMenuAddOns(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getPOSRestaurantMenuAddOns/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchPOSRestaurantMenuAddOns", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantMenuAddOns", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantMenuVariationRates(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getPOSRestaurantMenuVariationRates/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error(
            "rejected from fetchPOSRestaurantMenuVariationRates",
            err
          );
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantMenuVariationRates", e);
      reject(e);
    }
  });
}

export function fetchPOSRestaurantTableStatus(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getPOSRestaurantTableStatus/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchPOSRestaurantTableStatus", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPOSRestaurantTableStatus", e);
      reject(e);
    }
  });
}

export function fetchTableInfoAndKOTs(CompCode, pTableNo) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getTableInfoAndKOTs/${CompCode}/${pTableNo}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchTableInfoAndKOTs", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchTableInfoAndKOTs", e);
      reject(e);
    }
  });
}

export function fetchPOSCaptain(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getPOSCaptain/${CompCode}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from getPOSCaptain", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getPOSCaptain", e);
      reject(e);
    }
  });
}

export function fetchPrepareInvoiceDataRestaurant(
  pCompCode,
  pBranchCode,
  pDepartmentCode,
  pKeyValue1,
  pKeyValue2,
  pKeyValue3,
  pKeyValue4,
  pKeyValue5
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `restaurant-pos/GetPrepareInvoiceDataRestaurant/${pCompCode}/${pBranchCode}/${pDepartmentCode}/${pKeyValue1}/${pKeyValue2}/${pKeyValue3}/${pKeyValue4}/${pKeyValue5}`
        )
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from fetchPrepareInvoiceDataRestaurant", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchPrepareInvoiceDataRestaurant", e);
      reject(e);
    }
  });
}

export function updtPOSKOTInvoiceInfo(data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`restaurant-pos/updtPOSKOTInvoiceInfo`, {
          data,
        })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from updtPOSKOTInvoiceInfo", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from updtPOSKOTInvoiceInfo", e);
      reject(e);
    }
  });
}

export function getDataRestaurantPOSDeliveryPickupView(pCompCode, pBranchCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `restaurant-pos/getDataRestaurantPOSDeliveryPickupView/${pCompCode}/${pBranchCode}`
        )
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error(
            "rejected from getDataRestaurantPOSDeliveryPickupView",
            err
          );
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getDataRestaurantPOSDeliveryPickupView", e);
      reject(e);
    }
  });
}

export function raiseEvent(CompCode, EventCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`notify-events/raiseEvent`, { EventCode, data, CompCode })
        .then((res) => {
          resolve(res.data.message);
        })
        .catch((err) => {
          console.error("rejected from raiseEvent", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from raiseEvent", e);
      reject(e);
    }
  });
}

export function getInvoiceHdr(CompCode, pInvoiceId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getInvoiceHdr/${CompCode}/${pInvoiceId}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from getInvoiceHdr", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getInvoiceHdr", e);
      reject(e);
    }
  });
}

export function uptRestarantPosKOTHdrStatus(CompCode, data) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = [];
      await data.KOTId.forEach((row) => {
        axios
          .post(`restaurant-pos/uptRestarantPosKOTHdrStatus`, {
            KOTId: row,
            KOTStatus: data.KOTStatus,
            UpdtUsr: data.UpdtUsr,
            CompCode: CompCode,
          })
          .then((res) => {
            response.push(res.data.data);
          })
          .catch((err) => {
            console.error("rejected from uptRestarantPosKOTHdrStatus", err);
            reject(err);
          });
      });

      resolve(response);
    } catch (e) {
      console.error("rejected from uptRestarantPosKOTHdrStatus", e);
      reject(e);
    }
  });
}

export function uptRestarantPosKOTdtlStatus(CompCode, data) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = [];
      await data.KOTId.forEach((row) => {
        axios
          .post(`restaurant-pos/uptRestarantPosKOTdtlStatus`, {
            KOTId: row,
            KOTStatus: data.KOTStatus,
            UpdtUsr: data.UpdtUsr,
            CompCode: CompCode,
          })
          .then((res) => {
            response.push(res.data.data);
          })
          .catch((err) => {
            console.error("rejected from uptRestarantPosKOTdtlStatus", err);
            reject(err);
          });
      });

      resolve(response);
    } catch (e) {
      console.error("rejected from uptRestarantPosKOTdtlStatus", e);
      reject(e);
    }
  });
}

export function updtKOTViewTableStatus(CompCode, data) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = [];
      axios
        .post(`restaurant-pos/updtKOTViewTableStatus`, {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          response.push(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from updtKOTViewTableStatus", err);
          reject(err);
        });

      resolve(response);
    } catch (e) {
      console.error("rejected from updtKOTViewTableStatus", e);
      reject(e);
    }
  });
}

export function restaurantPosProcessSpltTable(CompCode, data) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = [];
      await axios
        .post(`restaurant-pos/restaurantPosProcessSpltTable`, {
          data: { ...data, CompCode },
        })
        .then((res) => {
          response.push(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from restaurantPosProcessSpltTable", err);
          reject(err);
        });

      resolve(response);
    } catch (e) {
      console.error("rejected from restaurantPosProcessSpltTable", e);
      reject(e);
    }
  });
}

export function restaurantPOSTableMergeOpration(CompCode, data) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = [];
      await axios
        .post(`restaurant-pos/restaurantPOSTableMergeOpration`, {
          data: { ...data, CompCode },
        })
        .then((res) => {
          response.push(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from restaurantPOSTableMergeOpration", err);
          reject(err);
        });

      resolve(response);
    } catch (e) {
      console.error("rejected from restaurantPOSTableMergeOpration", e);
      reject(e);
    }
  });
}

export function saveMergeTable(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`restaurant-pos/saveMergeTable`, { ...data, CompCode })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from saveMergeTable", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from saveMergeTable", e);
      reject(e);
    }
  });
}

export function saveSplitTable(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`restaurant-pos/saveSpltTable`, { ...data, CompCode: CompCode })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from saveSpltTable", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from saveSpltTable", e);
      reject(e);
    }
  });
}

export function getRestaurantInvoiceDtl(CompCode, pInvoiceId) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`restaurant-pos/getRestaurantInvoiceDtl/${CompCode}/${pInvoiceId}`)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from getRestaurantInvoiceDtl", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getRestaurantInvoiceDtl", e);
      reject(e);
    }
  });
}

// export function restaurantUptInvoiceHdr(data) {
//   return new Promise(function (resolve, reject) {
//     try {
//       axios
//         .post(`restaurant-pos/restaurantUptInvoiceHdr`, { data })
//         .then((res) => {
//           resolve(res.data.data);
//         })
//         .catch((err) => {
//           console.error("rejected from restaurantUptInvoiceHdr", err);
//           reject(err);
//         });
//     } catch (e) {
//       console.error("rejected from restaurantUptInvoiceHdr", e);
//       reject(e);
//     }
//   });
// }

// export function insInvoiceDTL(data, length) {
//   return new Promise(function (resolve, reject) {
//     try {
//       axios
//         .post(`restaurant-pos/insInvoiceDTL`, { data: { data, length } })
//         .then((res) => {
//           resolve(res.data.data);
//         })
//         .catch((err) => {
//           console.error("rejected from restaurantUptInvoiceHdr", err);
//           reject(err);
//         });
//     } catch (e) {
//       console.error("rejected from restaurantUptInvoiceHdr", e);
//       reject(e);
//     }
//   });
// }

export function restaurantPOSVoidBill(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      console.log("in side try");
      axios
        .post(`restaurant-pos/restaurantVoidBill`, {
          data,
        })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from restaurantVoidBill", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from restaurantVoidBill", e);
      reject(e);
    }
  });
}

export function updtRestaurantPOSKOTDtlStatus(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`restaurant-pos/updtRestaurantPOSKOTDtlStatus`, {
          data,
        })
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from updtRestaurantPOSKOTDtlStatus", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from updtRestaurantPOSKOTDtlStatus", e);
      reject(e);
    }
  });
}

export function fetchDataRestaurantPOS_ResentKOTs(
  CompCode,
  BranchCode,
  CurrentUserName
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `restaurant-pos/getDataRestaurantPOS_ResentKOTs/${CompCode}/${BranchCode}/${CurrentUserName}`
        )
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from getDataRestaurantPOS_ResentKOTs", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getDataRestaurantPOS_ResentKOTs", e);
      reject(e);
    }
  });
}

export function fetchDataRestaurantPOS_ResentBills(
  CompCode,
  BranchCode,
  CurrentUserName
) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `restaurant-pos/getDataRestaurantPOS_ResentBills/${CompCode}/${BranchCode}/${CurrentUserName}`
        )
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          console.error("rejected from getDataRestaurantPOS_ResentBills", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from getDataRestaurantPOS_ResentBills", e);
      reject(e);
    }
  });
}

export function uptRestaurantKOTHdrTableNo(CompCode, data) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = [];
      await data.forEach(async (data) => {
        await axios
          .post(`restaurant-pos/uptRestaurantKOTHdrTableNo`, {
            data: { ...data, CompCode },
          })
          .then((res) => {
            response.push(res.data.data);
          })
          .catch((err) => {
            console.error("rejected from uptRestaurantKOTHdrTableNo", err);
            reject(err);
          });
      });

      resolve(response);
    } catch (e) {
      console.error("rejected from uptRestaurantKOTHdrTableNo", e);
      reject(e);
    }
  });
}

export function uptRestaurantTableStatusArr(CompCode, Arrdata) {
  return new Promise(async function (resolve, reject) {
    try {
      let response = [];
      await Arrdata.forEach(async (data) => {
        await axios
          .post(`restaurant-pos/saveTableStatus`, {
            data: { ...data, CompCode },
          })
          .then(async (res) => {
            await response.push(res.data);
          })
          .catch((err) => {
            console.error("rejected from uptRestaurantTableStatusArr", err);
            reject(err);
          });
      });
      resolve(response);
    } catch (e) {
      console.error("rejected from uptRestaurantTableStatusArr", e);
      reject(e);
    }
  });
}

export function getRestaurantInvoicePdf(
  CompCode,
  printData,
  pInvoiceId,
  OutputType
) {
  return new Promise(function (resolve, reject) {
    try {
      if (printData) {
        const data = {};
        axios
          .post(
            "html-reports/getReportRestaurantInvoice",
            {
              InvoiceId: pInvoiceId,
              OutputType,
              CompCode,
            },
            {
              responseType: "arraybuffer",
              headers: {
                Accept: "application/pdf",
              },
            }
          )
          .then((res) => {
            // const resData = res.data.data;
            // let data = [];
            // console.log("res from api", resData);
            // for (const key in resData) {
            //   data.push({ ...resData[key], key });
            // }
            // console.log("invoice", res);
            resolve(res);
          });
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
}
