// import axios from "../axios";

// export function getReportServiceInvoice(pInvoiceId) {
//   return new Promise(function (resolve, reject) {
//     try {
//       // console.log("getUserRightMapp fetched request", pUserId, pUserType);
//       axios
//         .get(`user-master/getUserAddress/${pUserType}/${pUserId}`)
//         .then((res) => {
//           const resData = res.data.data;
//           let customerAddress = [];
//           for (const key in resData) {
//             customerAddress.push({
//               key: resData[key].AddressId,
//               AddressId: resData[key].AddressId,
//               UserId: resData[key].UserId,
//               latitude: resData[key].latitude,
//               longitude: resData[key].longitude,
//               geoLocationName: resData[key].geoLocationName,
//               add1: resData[key].add1,
//               add2: resData[key].add2,
//               add3: resData[key].add3,
//               AddressTag: resData[key].AddressTag,
//               City: resData[key].City,
//               PinCode: resData[key].PinCode,
//               IsDefault: resData[key].IsDefault,
//               MarkDeleted: resData[key].MarkDeleted,
//             });
//           }

//           resolve(customerAddress);
//         });
//     } catch (e) {
//       reject(e);
//     }
//   });
// }