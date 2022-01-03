import axios from "../axios";
import {
  TRAN_START,
  TRAN_FAIL,
  TRAN_SUCCESS,
} from "../store/actions/currentTran";

export const InsUpdateChangePassword = (
  pCompCode,
  pUserType,
  pUserId,
  UpdtUsr,
  pNewPassword
) => {
  return new Promise(async function (resolve, reject) {
    try {
      // const pUserType = getState().LoginReducer.userData.userType;
      // const pUserId = getState().LoginReducer.userData.userId;
      // const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: pCompCode,
        UserType: pUserType,
        UserId: pUserId,
        // CurPassword: pCurPassword,
        NewPassword: pNewPassword,
        UpdtUsr: UpdtUsr,
      };

      const res = await axios.post("auth/changePassword", data);
      resolve(res);
      // if(res.data.response && res.data.response.statusCode===406){
      //     reject(res.data.response)
      // }else{
      //     resolve(res.data.message)
      // }
    } catch (ex) {
      reject(ex);
    }
  });
};
