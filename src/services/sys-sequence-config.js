import axios from "../axios";

export function fetchSequenceNextVal(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`sys-sequence-configmaster/getSequenceNextVal`, {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          const resData = res.data.data;
          const SequenceNextVal = [];
          for (const key in resData) {
            SequenceNextVal.push({
              NextVal: resData[key].NextVal,
              l_ResetOn: resData[key].l_ResetOn,
              l_ResetConfig: resData[key].l_ResetConfig,
            });
          }

          resolve(SequenceNextVal);
        });
    } catch (e) {
      reject(e);
    }
  });
}
