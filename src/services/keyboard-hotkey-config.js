import axios from "../axios";

export function fetchKeyboardHotKeyConfig(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios.get(`keyboard-hotkey-config/getKeyboardHotConfig/${CompCode}`).then((res) => {
        const resData = res.data.data;
        let data = [];
        for (const key in resData) {
          data.push({
            ...resData[key],
            key,
            IsVisible: true,
            IsDisabled: false,
          });
        }
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
}
