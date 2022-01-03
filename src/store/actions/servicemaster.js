import axios from "../../axios";
import ServiceMaster from "../../models/servicemaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";

const TRANTYPE = "ServiceMaster";

export const FETCH_SERVICEMASTER_START = "FETCH_SERVICEMASTER_START";
export const FETCH_SERVICEMASTER_SUCCESS = "FETCH_SERVICEMASTER_SUCCESS";
export const FETCH_SERVICEMASTER_FAIL = "FETCH_SERVICEMASTER_FAIL";

export const fetchServiceMaster = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_SERVICEMASTER_START });
    const FileUploadPath = getState().AppMain.appconfigs.find(
      (aa) => aa.configCode === "UPLOAD_PATH"
    );
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(
        `service/GetServiceMaster/${CompCode}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const resData = res.data.data;
      const serviceMasters = [];
      for (const key in resData) {
        serviceMasters.push(
          new ServiceMaster(
            resData[key].ServiceId,
            resData[key].ServiceType,
            resData[key].ServiceTitle,
            resData[key].ServiceDesc,
            resData[key].ServiceUIImage,
            resData[key].IsActive.data[0] === 1 ? true : false,
            // resData[key].ServiceTypeTitle,
            resData[key].HSNSACCode,
            resData[key].TaxCode,
            resData[key].pathType,
            FileUploadPath.value1
            // resData[key].IsActive
          )
        );
      }
      // console.log(serviceMasters, "hiiiiiii");
      dispatch({
        type: FETCH_SERVICEMASTER_SUCCESS,
        serviceMasters: serviceMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_SERVICEMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
export const InsUpdtServiceMaster = (pInsUpdtType, pServiceMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        ServiceId: pServiceMaster.ServiceId,
        ServiceType: pServiceMaster.ServiceType,
        ServiceTitle: pServiceMaster.ServiceTitle,
        ServiceDesc: pServiceMaster.ServiceDesc,
        ServiceUIImage: pServiceMaster.ServiceImageURI,
        pathType: pServiceMaster.pathType,
        HSNSACCode: pServiceMaster.HSNSACCode,
        TaxCode: pServiceMaster.TaxCode,
        IsActive: pServiceMaster.IsActive,
        updt_usr: UpdtUsr,
      };
      // console.log(data,"action")
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "service/insUpdtServiceMaster",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      // dispatch(fetchServiceMaster());
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error:
          "Network error !! Check your internet connection. \n" + ex.message,
      });
    }
  };
};
