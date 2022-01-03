//compamain Master
import axios from "../../axios";
import CompMain from "../../models/compmain";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "./currentTran";

const TRANTYPE = "CompMain";

export const FETCH_COMPMAIN_START = "FETCH_COMPMAIN_START";
export const FETCH_COMPMAIN_SUCCESS = "FETCH_COMPMAIN_SUCCESS";
export const FETCH_COMPMAIN_FAIL = "FETCH_COMPMAIN_FAIL";

export const UpdtCompMain = (val) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const data = {
        compCode: val.compCode,
        compShortName: val.compShortName,
        compName: val.compName,
        validity: val.validity,
        address1: val.address1,
        address2: val.address2,
        address3: val.address3,
        City: val.City,
        Pin: val.Pin,
        Country: val.Country,
        GST: val.GST,
        PAN: val.PAN,
        ContantPerson: val.ContantPerson,
        Directors: val.Directors,
        tel: val.tel,
        tel2: val.tel2,
        mobile: val.mobile,
        email: val.email,
        website: val.website,
        updt_usr: UpdtUsr,
      };
      // console.log(data,"DATA")
      const token = getState().LoginReducer.token;
      const res = await axios.post(
        "compmain/UpdtCompMain",
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
      dispatch(fetchCompMain());
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

export const fetchCompMain = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_COMPMAIN_START });
    try {
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      const res = await axios.get(`compmain/getCompMain/${CompCode}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = res.data.data;
      const compMain = [];
      for (const key in resData) {
        compMain.push(
          new CompMain(
            resData[key].compCode,
            resData[key].compShortName,
            resData[key].compName,
            resData[key].validity,
            resData[key].address1,
            resData[key].address2,
            resData[key].address3,
            resData[key].City,
            resData[key].Pin,
            resData[key].Country,
            resData[key].GST,
            resData[key].PAN,
            resData[key].ContantPerson,
            resData[key].Directors,
            resData[key].tel,
            resData[key].tel2,
            resData[key].mobile,
            resData[key].email,
            resData[key].website
          )
        );
      }
      // console.log(resData,"hey")
      dispatch({
        type: FETCH_COMPMAIN_SUCCESS,
        compMain: compMain,
      });
    } catch (err) {
      dispatch({
        type: FETCH_COMPMAIN_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
