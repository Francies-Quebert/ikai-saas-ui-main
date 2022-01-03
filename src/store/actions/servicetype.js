import axios from "../../axios";
import AppServiceType from "../../models/app-servicetypes";
import { fetchServiceTypes } from "../actions/appMain";
// import React from 'react';
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";
import * as actionTypes from "./actionTypes";
const TRANTYPE = "ServiceTypeMaster";

export const insUpdtServiceTypeMaster = (pInsUpdtType, pServiceTypeMaster) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        InsUpdtType: pInsUpdtType,
        ServiceTypeCode: pServiceTypeMaster.serviceTypeCode,
        orderby: pServiceTypeMaster.orderby,
        ServiceTypeTitle: pServiceTypeMaster.serviceTypeTitle,
        ServiceTypeDesc: pServiceTypeMaster.serviceTypeDesc,
        ServiceTypeDescDetail: null,
        ServiceTypeImageURI: pServiceTypeMaster.serviceTypeImageURI,
        IsActive: pServiceTypeMaster.IsActive,
        pathType: pServiceTypeMaster.pathType,
        updt_usr: UpdtUsr,
      };
      // console.log('insde fun',data)
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "service/insUpdtServiceTypeMaster",
        {
          data,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
        console.log(res);

      dispatch({
        type: TRAN_SUCCESS,
        tranType: TRANTYPE,
        data: res.data.data,
      });
      // dispatch(fetchServiceTypes());
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

export const fetchServiceTypesMater = () => {
  return async (dispatch, getState) => {
    dispatch({ type: actionTypes.FETCH_SERVICETYPE_START });
    try {
      // const token = getState().LoginReducer.token;
      const FileUploadPath = getState().AppMain.appconfigs.find(
        (aa) => aa.configCode === "UPLOAD_PATH"
      );
      // console.log(FileUploadPath, "SERVICE TYPE");
      const data = {
        CompCode: getState().LoginReducer.CompCode,
        showInActiveAsWell: true,
      };
      const res = await axios.post("appmain/getServiceTypes", data);
      // if (res.status !== 201) {
      //   dispatch({
      //     type: actionTypes.FETCH_SERVICETYPE_FAIL,
      //     error: "Something went wrong!"
      //   });
      // }
      const resData = res.data.data;

      const serviceTypes = [];
      for (const key in resData) {
        serviceTypes.push(
          new AppServiceType(
            resData[key].ServiceTypeCode,
            resData[key].ServiceTypeTitle,
            resData[key].ServiceTypeDesc,
            resData[key].ServiceTypeDescDetail,
            resData[key].ServiceTypeImageURI,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].orderby,
            resData[key].pathType,
            FileUploadPath.value1
          )
        );
      }
      dispatch({
        type: actionTypes.FETCH_SERVICETYPE_SUCCESS,
        serviceTypes: serviceTypes,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_SERVICETYPE_FAIL,
        error: "Network error !! Check your internet connection",
      });
    }
  };
};
