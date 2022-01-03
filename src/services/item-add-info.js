import axios from "../axios";
import ItemAddInfoTmplHdr from "../models/item-add-info-tmpl-hdr";
import ItemAddInfoTmplDtl from "../models/item-add-info-tmpl-dtl";

export function fetchItemAddInfoTemplDtl(CompCode, pTempId) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log("getUserRightMapp fetched request", pUserId);
      axios
        .get(
          `item-add-info-template/getItemAddInfoTmplDtl/${CompCode}/${pTempId}`
        )
        .then((res) => {
          const resData = res.data.data;
          const itemAddInfoTmplDtl = [];
          for (const key in resData) {
            itemAddInfoTmplDtl.push(
              new ItemAddInfoTmplDtl(
                resData[key].TempId,
                resData[key].SrNo,
                resData[key].FieldTitle,
                resData[key].DefaultValue,
                resData[key].IsReadOnly,
                resData[key].IsCompulsary,
                resData[key].orderBy,
                key
              )
            );
          }

          resolve(itemAddInfoTmplDtl);
        });
    } catch (e) {
      reject(e);
    }
  });
}
