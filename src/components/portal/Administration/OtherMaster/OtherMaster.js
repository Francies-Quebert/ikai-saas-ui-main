import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../../../common/breadcrumb";
// import OtherMasterCard from "./OtherMasterCard";
// import OtherMasterCard from "./OtherMastersCardNew";
import OtherMasterCard from "./OtherMasterCardNewForm";
import { fetchOtherMasters } from "../../../../store/actions/othermaster";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../../store/actions/currentTran";
import ColumnProperties from "../../../../models/columnProperties";
import { toast } from "react-toastify";
import CustomDataTable from "../../../common/CustomDataTable";
import { hasRight } from "../../../../shared/utility";

const OtherMaster = (props) => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const otherMaster = useSelector((state) => state.otherMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    // console.log(props.trnType);
    dispatch(fetchOtherMasters(props.trnType));
    dispatch(
      setFormCaption(
        props.trnType === "CAT"
          ? 13
          : props.trnType === "QLF"
          ? 12
          : props.trnType === "GRD"
          ? 14
          : props.trnType === "HST"
          ? 15
          : props.trnType === "DSG"
          ? 16
          : props.trnType === "STS"
          ? 17
          : props.trnType === "HLP"
          ? 33
          : props.trnType === "FAQ"
          ? 34
          : props.trnType === "INC"
          ? 94
          : props.trnType === "EXPS"
          ? 95
          : props.trnType === "RSM"
          ? 109
          : 18
      )
    );
  }, [currTran.lastSavedData]);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [otherMaster.otherMasters]);

  let renderItem = null;
  if (otherMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (otherMaster.error) {
    renderItem = <div>Error : otherMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <OtherMasterCard
            {...props}
            // trnType={props.trnType}
            onBackPress={() => {
              setEditedData();
              dispatch(fetchOtherMasters(props.trnType));
            }}
            formData={editedData.formData}
          />
        )}

        {!editedData &&
          (props.trnType === "QLF"
            ? otherMaster.otherMasters
            : props.trnType === "CAT"
            ? otherMaster.categoryMasters
            : props.trnType === "GRD"
            ? otherMaster.gradeMasters
            : props.trnType === "HST"
            ? otherMaster.hstMasters
            : props.trnType === "DSG"
            ? otherMaster.designationMasters
            : props.trnType === "STS"
            ? otherMaster.stsMasters
            : props.trnType === "HLP"
            ? otherMaster.helpGroupMaster
            : props.trnType === "FAQ"
            ? otherMaster.faqGroupMaster
            : props.trnType === "EXP"
            ? otherMaster.expierenceMasters
            : props.trnType === "INC"
            ? otherMaster.incomeMaster
            : props.trnType === "EXPS"
            ? otherMaster.expenseMaster
            : props.trnType === "RSM"
            ? otherMaster.otherMasterReasons
            : null) && (
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={
                columnProperties
                // props.trnType === "QLF"
                //   ? columnProperties
                //   : props.trnType === "CAT"
                //   ? columnCategoryProperties
                //   : props.trnType === "GRD"
                //   ? coloumnGradeProperties
                //   : props.trnType === "HST"
                //   ? coloumnHSTProperties
                //   : props.trnType === "DSG"
                //   ? coloumnDesignationProperties
                //   : props.trnType === "STS"
                //   ? coloumnSTSProperties
                //   : coloumnExpierenceProperties
              }
              myData={
                props.trnType === "QLF"
                  ? otherMaster.otherMasters
                  : props.trnType === "CAT"
                  ? otherMaster.categoryMasters
                  : props.trnType === "GRD"
                  ? otherMaster.gradeMasters
                  : props.trnType === "HST"
                  ? otherMaster.hstMasters
                  : props.trnType === "DSG"
                  ? otherMaster.designationMasters
                  : props.trnType === "STS"
                  ? otherMaster.stsMasters
                  : props.trnType === "HLP"
                  ? otherMaster.helpGroupMaster
                  : props.trnType === "FAQ"
                  ? otherMaster.faqGroupMaster
                  : props.trnType === "EXP"
                  ? otherMaster.expierenceMasters
                  : props.trnType === "INC"
                  ? otherMaster.incomeMaster
                  : props.trnType === "EXPS"
                  ? otherMaster.expenseMaster
                  : props.trnType === "RSM"
                  ? otherMaster.otherMasterReasons
                  : null
              }
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
  new ColumnProperties("Id", false, "Id", false, 80),
  new ColumnProperties("MasterType", false, "Category Type", true, 250),
  new ColumnProperties("ShortCode", true, "Code", false, 150),
  new ColumnProperties("MasterDesc", true, "Description", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("SysOption1", false, "SysOption1", true, 0),
  new ColumnProperties("SysOption2", false, "SysOption2", false, 0),
  new ColumnProperties("SysOption3", false, "SysOption3", false, 0),
  new ColumnProperties("SysOption4", false, "SysOption4", false, 0),
  new ColumnProperties("SysOption5", false, "SysOption5", false, 0),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export const columnCategoryProperties = [
  new ColumnProperties("Id", true, "Id", false, 80),
  new ColumnProperties("MasterType", false, "Category Type", true, 250),
  new ColumnProperties("ShortCode", true, "ShortCode", false, 150),
  new ColumnProperties("MasterDesc", true, "MasterDesc", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("SysOption1", false, "SysOption1", true, 0),
  new ColumnProperties("SysOption2", false, "SysOption2", false, 0),
  new ColumnProperties("SysOption3", false, "SysOption3", false, 0),
  new ColumnProperties("SysOption4", false, "SysOption4", false, 0),
  new ColumnProperties("SysOption5", false, "SysOption5", false, 0),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export const coloumnGradeProperties = [
  new ColumnProperties("Id", true, "Id", false, 80),
  new ColumnProperties("MasterType", false, "Category Type", true, 250),
  new ColumnProperties("ShortCode", true, "ShortCode", false, 150),
  new ColumnProperties("MasterDesc", true, "MasterDesc", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("SysOption1", false, "SysOption1", true, 0),
  new ColumnProperties("SysOption2", false, "SysOption2", false, 0),
  new ColumnProperties("SysOption3", false, "SysOption3", false, 0),
  new ColumnProperties("SysOption4", false, "SysOption4", false, 0),
  new ColumnProperties("SysOption5", false, "SysOption5", false, 0),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export const coloumnExpierenceProperties = [
  new ColumnProperties("Id", true, "Id", false, 80),
  new ColumnProperties("MasterType", false, "Category Type", true, 250),
  new ColumnProperties("ShortCode", true, "ShortCode", false, 150),
  new ColumnProperties("MasterDesc", true, "MasterDesc", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("SysOption1", false, "SysOption1", true, 0),
  new ColumnProperties("SysOption2", false, "SysOption2", false, 0),
  new ColumnProperties("SysOption3", false, "SysOption3", false, 0),
  new ColumnProperties("SysOption4", false, "SysOption4", false, 0),
  new ColumnProperties("SysOption5", false, "SysOption5", false, 0),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export const coloumnHSTProperties = [
  new ColumnProperties("Id", true, "Id", false, 80),
  new ColumnProperties("MasterType", false, "Category Type", true, 250),
  new ColumnProperties("ShortCode", true, "ShortCode", false, 150),
  new ColumnProperties("MasterDesc", true, "MasterDesc", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("SysOption1", false, "SysOption1", true, 0),
  new ColumnProperties("SysOption2", false, "SysOption2", false, 0),
  new ColumnProperties("SysOption3", false, "SysOption3", false, 0),
  new ColumnProperties("SysOption4", false, "SysOption4", false, 0),
  new ColumnProperties("SysOption5", false, "SysOption5", false, 0),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export const coloumnDesignationProperties = [
  new ColumnProperties("Id", true, "Id", false, 80),
  new ColumnProperties("MasterType", false, "Category Type", true, 250),
  new ColumnProperties("ShortCode", true, "ShortCode", false, 150),
  new ColumnProperties("MasterDesc", true, "MasterDesc", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("SysOption1", false, "SysOption1", true, 0),
  new ColumnProperties("SysOption2", false, "SysOption2", false, 0),
  new ColumnProperties("SysOption3", false, "SysOption3", false, 0),
  new ColumnProperties("SysOption4", false, "SysOption4", false, 0),
  new ColumnProperties("SysOption5", false, "SysOption5", false, 0),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export const coloumnSTSProperties = [
  new ColumnProperties("Id", true, "Id", false, 80),
  new ColumnProperties("MasterType", false, "Category Type", true, 250),
  new ColumnProperties("ShortCode", true, "ShortCode", false, 150),
  new ColumnProperties("MasterDesc", true, "MasterDesc", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("SysOption1", false, "SysOption1", true, 0),
  new ColumnProperties("SysOption2", false, "SysOption2", false, 0),
  new ColumnProperties("SysOption3", false, "SysOption3", false, 0),
  new ColumnProperties("SysOption4", false, "SysOption4", false, 0),
  new ColumnProperties("SysOption5", false, "SysOption5", false, 0),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export default OtherMaster;
