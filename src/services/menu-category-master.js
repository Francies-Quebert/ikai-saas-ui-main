import axios from "../axios";

export function InsUpdtMenuCategory(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("menucategory-master/InsUpdtMenuCategoryMaster", {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}
