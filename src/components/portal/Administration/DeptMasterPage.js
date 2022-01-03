import React, { Fragment, useEffect, useState } from "react";
import DeptMasterCard from "./DeptMaster/DeptMasterCard";
import ColumnProperties from "../../../models/columnProperties";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeptMaster } from "../../../store/actions/deptmaster";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import CustomDataTable from "../../common/CustomDataTable";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";

const DeptMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const deptMaster = useSelector((state) => state.deptMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchDeptMaster());
    dispatch(fetchBranchMaster());
    dispatch(setFormCaption(50));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [deptMaster.deptMaster]);

  let renderItem = null;
  if (deptMaster.isLoading) {
    renderItem = <div> Loading...... </div>;
  } else if (deptMaster.error) {
    renderItem = <div> Error: deptmaster.error </div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <DeptMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
          // showUserCredentials={true}
        )}
        {!editedData && deptMaster.deptMaster && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            columnProperties={columnProperties}
            myData={deptMaster.deptMaster}
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
  new ColumnProperties("BranchCode", false, "Branch Code", true, 150),
  new ColumnProperties("DeptCode", false, "Department Code", false, 200),
  new ColumnProperties("DeptName", true, "Department Name", false),
  new ColumnProperties("EnablePurchase", false, "Purchase", false, 150),
  new ColumnProperties(
    "EnablePurchaseReturn",
    false,
    "Purchase Return",
    false,
    200
  ),
  new ColumnProperties("EnableSale", false, "Sale", false),
  new ColumnProperties("EnableSaleReturn", false, "Sale Return", false, 150),
  new ColumnProperties("EnableTransferIN", false, "Transfer In", false, 200),
  new ColumnProperties("EnableTransferOUT", false, "Transfer Out", false),
  new ColumnProperties("EnableAdjustments", false, "Adjustments", false),
  new ColumnProperties("IsActive", false, "Status", true, 250),
  new ColumnProperties("IsActiveComponent", true, "Status", true, 250),
];

export default DeptMasterPage;
