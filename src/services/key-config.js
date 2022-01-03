import axios from "../axios";

export function UpdtHotKeyConfigDtl(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("keyboard-hotkey-config/UpdtHotKeyConfigDtl", {
          data: { keyboardData: [...data], CompCode },
        })
        .then((res) => {
          resolve(res);
        });
    } catch (e) {
      reject(e);
    }
  });
}
