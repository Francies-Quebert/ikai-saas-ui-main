import axios from "../axios";

export function InsUpdtSystemSequenceConfigMaster(data) {
  console.log(data, "res");
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post("sys-sequence-configmaster/InsUpdtSystemSequenceConfigMaster", {
          data: { ...data },
        })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchGetSequenceTrans(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(
          `sys-sequence-configmaster/getSys_Sequence_ConfigMaster/${CompCode}`
        )
        .then((res) => {
          const resData = res.data.data;
          let systemSequence = [];

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchSequenceTranMaster(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`sys-sequence-configmaster/getSequenceTranMaster/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;
          let systemSequence = [];

          resolve(resData);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getAddInfoTemplate() {
  return new Promise(function (resolve, reject) {
    try {
    } catch (e) {
      reject(e);
    }
  });
}
