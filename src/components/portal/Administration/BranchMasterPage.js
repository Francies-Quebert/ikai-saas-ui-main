import React, { Fragment, useEffect, useState } from "react";
import ColumnProperties from "../../../models/columnProperties";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompMain } from "../../../store/actions/compmain";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import CustomDataTable from "../../common/CustomDataTable";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";
// import BranchMasterCard from "./BranchMaster/BranchMasterCard";
import BranchMasterCard from "./BranchMaster/BranchMasterCardNew";

const BranchMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const branchMaster = useSelector((state) => state.branchMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchCompMain());
    dispatch(fetchBranchMaster());
    dispatch(setFormCaption(51));
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  useEffect(() => {}, [branchMaster.branchMaster]);

  let renderItem = null;
  if (branchMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (branchMaster.error) {
    renderItem = <div>Error : compmain.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <BranchMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            // showUserCredentials={true}
            onSavePress={(val) => {
              if (val) {
                dispatch(fetchCompMain());
                dispatch(fetchBranchMaster());
              }
            }}
          />
        )}
        {!editedData && branchMaster.branchMaster && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={branchMaster.branchMaster}
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
  new ColumnProperties("CompCode", true, "Company Code", true, 140),
  new ColumnProperties("BranchCode", true, "Branch Code", true, 150),
  new ColumnProperties("BranchName", true, "Branch Name", false),
  new ColumnProperties("Add1", false, "address1", true),
  new ColumnProperties("Add2", false, "address2", true, 150),
  new ColumnProperties("Add3", false, "address3", true, 150),
  new ColumnProperties("City", false, "City", true, 250),
  new ColumnProperties("Pin", false, "Pin", true),
  new ColumnProperties("tel1", false, "Telephone ", true, 250),
  new ColumnProperties("tel2", false, "Alternate Number", true, 250),
  new ColumnProperties("mobile", false, "mobile", true, 180),
  new ColumnProperties("email", false, "email", true, 200),
  new ColumnProperties("website", true, "website", true, 250),
  new ColumnProperties("BranchType", false, "BranchType", true, 250),
  new ColumnProperties("IsActive", false, "IsActive", true, 250),
  new ColumnProperties("IsActiveComponent", true, "Status", true, 80),
];
export default BranchMasterPage;
