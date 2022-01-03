import axios from "../axios";
import OrderAddOnCost from "../models/OrderAddOnCost";

export const fetchAddOnCostOrder = (CompCode, pScheduleId) => {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("orders/getDataScheduleAddOnCost", {
          ScheduleId: pScheduleId,
          CompCode: CompCode,
        })
        .then((res) => {
          const orderAddOnCost = [];
          const resData = res.data.data;
          for (const key in resData) {
            orderAddOnCost.push(
              new OrderAddOnCost(
                resData[key].ScheduleId,
                resData[key].OrderId,
                resData[key].SrNo,
                resData[key].ItemDesc,
                parseFloat(resData[key].Rate)
              )
            );

            resolve(orderAddOnCost);
          }
        })
        .catch((err) => {
          console.error("rejected from fetchAddOnCostOrder", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchAddOnCostOrder", e);
      reject(e);
    }
  });
};
