import SysSequenceConfig from "../models/sys-sequence-config";
import axios from "../axios";

export function getSysSequenceConfig(CompCode, TranType) {
  return new Promise(function (resolve, reject) {
    try {
      // const token = getState().LoginReducer.token;
      //   const res = axios.get(
      //     "sys-sequence-configmaster/getSys_Sequence_ConfigMaster",
      //     null
      //   );
      axios
        .get(
          `sys-sequence-configmaster/getSys_Sequence_ConfigMaster/${CompCode}`
        )
        .then((res) => {
          const sysSequenceConfig = [];
          const resData = res.data.data;
          for (const key in resData.filter(
            (ii) => ii.TranType === TranType && ii.ConfigType === "A"
          )) {
            sysSequenceConfig.push(
              new SysSequenceConfig(
                resData[key].Id,
                resData[key].TranType,
                resData[key].ConfigType,
                resData[key].ResetOn,
                resData[key].Preffix,
                resData[key].Suffix,
                resData[key].Value,
                resData[key].LastGenNo,
                resData[key].EnablePadding,
                resData[key].PaddingLength,
                resData[key].PaddingChar,
                resData[key].TranDesc,
                resData[key].IsActive.data[0] === 1 ? true : false,
                resData[key].ConfigTypeDesc
              )
            );
          }
          resolve(sysSequenceConfig);
        });
    } catch (e) {
      reject(e);
    }
  });
}

