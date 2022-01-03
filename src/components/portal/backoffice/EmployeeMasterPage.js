import React, { Fragment, useEffect, useState } from "react";
// import EmployeeMasterCard from "./EmployeeMaster/EmployeeMasterCard";
import EmployeeMasterCard from "./EmployeeMaster/EmployeeMasterCardNew";
import CustomDataTable from "../../common/CustomDataTable";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import { fetchEmployeeMasters } from "../../../store/actions/employeemaster";
import { toast } from "react-toastify";
import ColumnProperties from "../../../models/columnProperties";
import { hasRight } from "../../../shared/utility";

const EmployeeMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const employeeMaster = useSelector((state) => state.employeeMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(setFormCaption(7));
    dispatch(fetchEmployeeMasters());
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [employeeMaster.employeeMasters]);
  let renderItem = null;
  if (employeeMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (employeeMaster.error) {
    renderItem = <div>Error : {employeeMaster.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <EmployeeMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
        )}
        {!editedData && employeeMaster.employeeMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={employeeMaster.employeeMasters}
            onAddClick={() => {
              setEditedData({ entryMode: "A" });
            }}
            onEditPress={(values) => {
              setEditedData({ entryMode: "E", formData: values });
            }}
            pageDefaultSize={15}
            
          />
        )}
      </Fragment>
    );
  }

  return renderItem;
};

export const columnProperties = [
  new ColumnProperties("Id", true, "Id", true, 50),
  new ColumnProperties("EmpType", false, "EmpType", true, 50),
  new ColumnProperties("Name", true, "Name", true),
  new ColumnProperties("FirstName", false, "FirstName", true, 150),
  new ColumnProperties("MiddleName", false, "MiddleName", true, 150),
  new ColumnProperties("LastName", false, "LastName", true, 150),
  new ColumnProperties("bio", false, "bio", true, 250),
  new ColumnProperties("CategoryCode", false, "CategoryCode", true, 50),
  new ColumnProperties(
    "QualificationCode",
    false,
    "QualificationCode",
    true,
    50
  ),
  new ColumnProperties("ExperienceCode", false, "ExperienceCode", true, 50),
  new ColumnProperties("GradeCode", false, "GradeCode", true, 50),
  new ColumnProperties("DOB", false, "DOB", true, 150),
  new ColumnProperties("Gender", false, "Gender", true, 150),
  new ColumnProperties("IsGenderComponent", true, "Gender Status", false, 150),
  new ColumnProperties("Address1", false, "Address1", true, 150),
  new ColumnProperties("Address2", false, "Address2", true, 150),
  new ColumnProperties("Address3", false, "Address3", true, 150),
  new ColumnProperties("City", false, "City", true, 150),
  new ColumnProperties("PinCode", false, "PinCode", true, 100),
  new ColumnProperties("State", false, "State", true, 150),
  new ColumnProperties("Country", false, "Country", true, 150),
  new ColumnProperties("tel", false, "tel", true, 100),
  new ColumnProperties("mobile1", true, "Mobile", true, 100),
  new ColumnProperties("mobile2", false, "mobile2", true, 130),
  new ColumnProperties("email", true, "email", true, 250),
  new ColumnProperties("AadharNo", false, "AadharNo", true, 150),
  new ColumnProperties("PanNo", false, "PanNo", true, 150),
  new ColumnProperties("DesignationCode", false, "DesignationCode", true, 80),
  new ColumnProperties(
    "DisplayProfilePicture",
    false,
    "ProfilePicture",
    true,
    150
  ),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
  new ColumnProperties("ProfilePicture", false, "ProfilePicture", true, 350),
  new ColumnProperties("pathType", false, "pathType", true, 350),
];

export default EmployeeMasterPage;
