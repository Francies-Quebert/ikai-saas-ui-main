import React, { Fragment, useEffect, useState } from "react";
// import UserMasterCard from "./UserMaster/UserMasterCard";
import UserMasterCard from "./UserMaster/UserMasterCardNew";
import CustomDataTable from "../../common/CustomDataTable";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import ColumnProperties from "../../../models/columnProperties";
import { Formik } from "formik";
import HousiePage from "../../common/HousiePage";

const UserMaster = (props) => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const userMaster = useSelector((state) => state.userMaster);
  // const [editedData, setEditedData] = useState({kkk:"i got something"});
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchUserMasters(props.trnType));
    dispatch(
      setFormCaption(props.trnType === "U" ? 5 : props.trnType === "G" ? 6 : 4)
    );
    if (userMaster.userGroupMaster.length <= 0) {
      dispatch(fetchUserMasters("G"));
    }
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {
    // console.log(userMaster);
  }, [
    userMaster.userMasters,
    userMaster.customerMasters,
    userMaster.userGroupMaster,
  ]);

  let renderItem = null;
  if (userMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (userMaster.error) {
    renderItem = <div>Error : {userMaster.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <UserMasterCard
            trnType={props.trnType}
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={props.trnType === "A"}
          />
        )}

        {!editedData &&
          (props.trnType === "A"
            ? userMaster.userMasters
            : props.trnType === "U"
            ? userMaster.customerMasters
            : userMaster.userGroupMaster) && (
            <CustomDataTable
              columnProperties={
                props.trnType === "A"
                  ? columnProperties
                  : props.trnType === "U"
                  ? columnCustomerProperties
                  : columnUserGroupProperties
              }
              myData={
                props.trnType === "A"
                  ? userMaster.userMasters
                  : props.trnType === "U"
                  ? userMaster.customerMasters
                  : userMaster.userGroupMaster
              }
              onAddClick={() => {
                // console.log("i m here");
                setEditedData({ entryMode: "A" });
              }}
              onEditPress={(values) => {
                // console.log(setEditedData, "i m here");
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
  new ColumnProperties("SrNo", true, "Sr No", true, 100),
  new ColumnProperties("userType", false, "UserType", true, 250),
  new ColumnProperties("userId", false, "User Id", false, 80),
  new ColumnProperties("userTypeRef", false, "userTypeRef", true, 350),
  new ColumnProperties("userName", true, "User Name", true, 150),
  new ColumnProperties("Gender", true, "Gender", false, 80),
  new ColumnProperties("email", true, "Email", false),
  new ColumnProperties("mobile", true, "Mobile No.", true, 100),
  new ColumnProperties("password", false, "password", true, 350),
  new ColumnProperties("RegisterFrom", false, "RegisterFrom", true, 350),
  new ColumnProperties(
    "hasDemographyInfo",
    false,
    "hasDemographyInfo",
    true,
    350
  ),
  new ColumnProperties("Name", false, "Display Name", false),

  new ColumnProperties("DOBmmdd", false, "Birth Date", true),
  new ColumnProperties("DOByyyy", false, "Birth Date", true),
  new ColumnProperties("AnniversaryMMDD", false, "Anniversary", true),
  new ColumnProperties("AnniversaryYYYY", false, "Anniversary", true),
  new ColumnProperties("Add1", false, "Address1", false),
  new ColumnProperties("Add2", false, "Address2", false),
  new ColumnProperties("Add3", false, "Address3", false),
  new ColumnProperties("GstNo", false, "GSTNO", false),
  new ColumnProperties("User_Group", false, "User_Group", false),
  new ColumnProperties("IsActive", false, "IsActive", false),
  new ColumnProperties(
    "Show_Cashier_Alert",
    false,
    "Show_Cashier_Alert",
    false
  ),
  new ColumnProperties(
    "Show_Kitchen_Alert",
    false,
    "Show_Kitchen_Alert",
    false
  ),
  new ColumnProperties("Show_Admin_Alert", false, "Show_Admin_Alert", false),
  new ColumnProperties("Show_Waiter_Alert", false, "Show_Waiter_Alert", false),
];

export const columnCustomerProperties = [
  new ColumnProperties("SrNo", true, "Sr No", true, 100),
  new ColumnProperties("userType", false, "UserType", true, 250),
  new ColumnProperties("userId", false, "User Id", false, 80),
  new ColumnProperties("userTypeRef", false, "userTypeRef", true, 350),
  new ColumnProperties("userName", false, "User Name", true, 150),
  new ColumnProperties("Gender", true, "Gender", false, 80),
  new ColumnProperties("email", true, "Email", false, 250),
  new ColumnProperties("mobile", true, "Mobile No.", true, 100),
  new ColumnProperties("password", false, "password", true, 350),
  new ColumnProperties("RegisterFrom", false, "RegisterFrom", true, 350),
  new ColumnProperties(
    "hasDemographyInfo",
    false,
    "hasDemographyInfo",
    true,
    350
  ),
  new ColumnProperties("Name", true, "Display Name", true),
  new ColumnProperties("DOBmmdd", false, "Birth Date", true),
  new ColumnProperties("DOByyyy", false, "Birth Date", true),
  new ColumnProperties("AnniversaryMMDD", false, "Anniversary", true),
  new ColumnProperties("AnniversaryYYYY", false, "Anniversary", true),
  new ColumnProperties("Add1", false, "Address1", true),
  new ColumnProperties("Add2", false, "Address2", true),
  new ColumnProperties("Add3", false, "Address3", true),
  new ColumnProperties("GstNo", false, "GSTNO", true),
  new ColumnProperties("User_Group", false, "User_Group", false),
  new ColumnProperties("IsActive", false, "IsActive", false),
  new ColumnProperties(
    "Show_Cashier_Alert",
    false,
    "Show_Cashier_Alert",
    false
  ),
  new ColumnProperties(
    "Show_Kitchen_Alert",
    false,
    "Show_Kitchen_Alert",
    false
  ),
  new ColumnProperties("Show_Admin_Alert", false, "Show_Admin_Alert", false),
  new ColumnProperties("Show_Waiter_Alert", false, "Show_Waiter_Alert", false),
];

export const columnUserGroupProperties = [
  new ColumnProperties("SrNo", true, "Sr No", true, 100),
  new ColumnProperties("userType", false, "UserType", true, 250),
  new ColumnProperties("userId", false, "User Id", false, 80),
  new ColumnProperties("userTypeRef", false, "userTypeRef", true, 350),
  new ColumnProperties("userName", false, "User Name", true, 150),
  new ColumnProperties("Gender", false, "Gender", true, 80),
  new ColumnProperties("email", false, "Email", true, 250),
  new ColumnProperties("mobile", false, "Mobile No.", true, 100),
  new ColumnProperties("password", false, "password", true, 350),
  new ColumnProperties("RegisterFrom", false, "RegisterFrom", true, 350),
  new ColumnProperties(
    "hasDemographyInfo",
    false,
    "hasDemographyInfo",
    true,
    350
  ),
  new ColumnProperties("Name", true, "Display Name", false),
  new ColumnProperties("DOBmmdd", false, "Birth Date", true),
  new ColumnProperties("DOByyyy", false, "Birth Date", true),
  new ColumnProperties("AnniversaryMMDD", false, "Anniversary", true),
  new ColumnProperties("AnniversaryYYYY", false, "Anniversary", true),
  new ColumnProperties("Add1", false, "Address1", false),
  new ColumnProperties("Add2", false, "Address2", false),
  new ColumnProperties("Add3", false, "Address3", false),
  new ColumnProperties("GstNo", false, "GSTNO", false),
  new ColumnProperties("User_Group", false, "User_Group", false),
  new ColumnProperties("IsActive", false, "IsActive", false),
  new ColumnProperties(
    "Show_Cashier_Alert",
    false,
    "Show_Cashier_Alert",
    false
  ),
  new ColumnProperties(
    "Show_Kitchen_Alert",
    false,
    "Show_Kitchen_Alert",
    false
  ),
  new ColumnProperties("Show_Admin_Alert", false, "Show_Admin_Alert", false),
  new ColumnProperties("Show_Waiter_Alert", false, "Show_Waiter_Alert", false),
];
export default UserMaster;
