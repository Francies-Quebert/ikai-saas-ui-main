import axios from "../../axios";
import EmployeeMaster from "../../models/emloyeemaster";
import { TRAN_START, TRAN_FAIL, TRAN_SUCCESS } from "../actions/currentTran";
const TRANTYPE = "EmployeeMaster";

export const SAVE_EMPLOYEE_START = "SAVE_EMPLOYEE_START";
export const SAVE_EMPLOYEE_SUCCESS = "SAVE_EMPLOYEE_SUCCESS";
export const SAVE_EMPLOYEE_FAIL = "SAVE_EMPLOYEE_FAIL";

export const FETCH_EMPLOYEEMASTER_START = "FETCH_EMPLOYEEMASTER_START";
export const FETCH_EMPLOYEEMASTER_SUCCESS = "FETCH_EMPLOYEEMASTER_SUCCESS";
export const FETCH_EMPLOYEEMASTER_FAIL = "FETCH_EMPLOYEEMASTER_FAIL";

export const InsUpdtEmployeeMaster = (pInsUpdtType, pEmpMasterData) => {
  return async (dispatch, getState) => {
    dispatch({ type: TRAN_START, tranType: TRANTYPE });
    try {
      const UpdtUsr = getState().LoginReducer.userData.username;
      const token = getState().LoginReducer.token;
      const CompCode = getState().LoginReducer.CompCode;
      // console.log(pEmpMasterData.ProfilePicture);
      const data = {
        CompCode: CompCode,
        InsUpdtType: pInsUpdtType,
        Id: pEmpMasterData.Id,
        EmpType: pEmpMasterData.EmpType,
        FirstName: pEmpMasterData.FirstName,
        MiddleName: pEmpMasterData.MiddleName,
        LastName: pEmpMasterData.LastName,
        bio: pEmpMasterData.bio,
        CategoryCode: pEmpMasterData.CategoryCode,
        QualificationCode: pEmpMasterData.QualificationCode,
        ExperienceCode: pEmpMasterData.ExperienceCode,
        GradeCode: pEmpMasterData.GradeCode,
        DOB: pEmpMasterData.DOB,
        Gender: pEmpMasterData.Gender,
        Address1: pEmpMasterData.Address1,
        Address2: pEmpMasterData.Address2,
        Address3: pEmpMasterData.Address3,
        City: pEmpMasterData.City,
        PinCode: pEmpMasterData.PinCode,
        State: pEmpMasterData.State,
        Country: pEmpMasterData.Country,
        tel: pEmpMasterData.tel,
        mobile1: pEmpMasterData.mobile1,
        mobile2: pEmpMasterData.mobile2,
        email: pEmpMasterData.email,
        AadharNo: pEmpMasterData.AadharNo,
        PanNo: pEmpMasterData.PanNo,
        IsActive: pEmpMasterData.IsActive,
        UpdtUsr: UpdtUsr,
        DesignationCode: pEmpMasterData.DesignationCode,
        ProfilePicture: pEmpMasterData.ProfilePicture,
        pathType: pEmpMasterData.pathType,
      };

      const res = await axios.post(
        "employee/InsUpdtEmployeeMaster",
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
      dispatch(fetchEmployeeMasters());
    } catch (ex) {
      dispatch({
        type: TRAN_FAIL,
        tranType: TRANTYPE,
        error: "Network error !! Check your internet connection" + ex.message,
      });
    }
  };
};

export const fetchEmployeeMasters = () => {
  return async (dispatch, getState) => {
    dispatch({ type: FETCH_EMPLOYEEMASTER_START });
    try {
      const CompCode = getState().LoginReducer.CompCode;
      const token = getState().LoginReducer.token;
      // const res = await axios.post("employee/getEmployees", null, {
      //   headers: { Authorization1: `Bearer ${token}` }
      // });

      const res = await axios.post("employee/getEmployees", {
        CompCode: getState().LoginReducer.CompCode,
      });

      const resData = res.data.data;
      const employeeMasters = [];
      // console.log(resData)
      for (const key in resData) {
        // console.log('jjj',resData[key].ProfilePicture,)
        // var reader = new FileReader();
        // reader.readAsDataURL(resData[key].ProfilePicture);
        // reader.onloadend = function() {
        //   var base64data = reader.result;
        //   console.log(base64data);
        //   imgData=base64data;
        // };

        employeeMasters.push(
          new EmployeeMaster(
            resData[key].Id,
            resData[key].EmpType,
            resData[key].FirstName,
            resData[key].MiddleName,
            resData[key].LastName,
            resData[key].bio,
            resData[key].CategoryCode,
            resData[key].QualificationCode,
            resData[key].ExperienceCode,
            resData[key].GradeCode,
            resData[key].DOB,
            resData[key].Gender,
            resData[key].Address1,
            resData[key].Address2,
            resData[key].Address3,
            resData[key].City,
            resData[key].PinCode,
            resData[key].State,
            resData[key].Country,
            resData[key].tel,
            resData[key].mobile1,
            resData[key].mobile2,
            resData[key].email,
            resData[key].AadharNo,
            resData[key].PanNo,
            resData[key].IsActive.data[0] === 1 ? true : false,
            resData[key].DesignationCode,
            resData[key].ProfilePicture,
            resData[key].pathType
          )
        );
      }
      // console.log(FETCH_EMPLOYEEMASTER_SUCCESS, employeeMasters)
      dispatch({
        type: FETCH_EMPLOYEEMASTER_SUCCESS,
        employeeMasters: employeeMasters,
      });
    } catch (err) {
      dispatch({
        type: FETCH_EMPLOYEEMASTER_FAIL,
        error:
          "Network error !! Check your internet connection.\\" + err.message,
      });
    }
  };
};
