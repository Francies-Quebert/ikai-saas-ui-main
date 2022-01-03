import React, { Fragment, useState, useEffect } from "react";
import MenuOtherMaster from "./MenuOtherMaster/MenuOtherMasterCard";
import { fetchOtherMasters } from "../../../store/actions/othermaster";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import ColumnProperties from "../../../models/columnProperties";
import { toast } from "react-toastify";
import CustomDataTable from "../../common/CustomDataTable";
import { hasRight } from "../../../shared/utility";

const MenuOtherMasterPage = (props) => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const otherMaster = useSelector((state) => state.otherMaster);
  const [editedData, setEditedData] = useState();
  useEffect(() => {
    // console.log(props.trnType);
    dispatch(fetchOtherMasters(props.trnType));
    dispatch(
      setFormCaption(
        props.trnType === "VAR"
          ? 62
          : props.trnType === "MGRP"
          ? 63
          : props.trnType === "SPLNTS"
          ? 64
          : props.trnType === "DEITTYP"
          ? 66
          : props.trnType === "TSTS"
          ? 75
          : props.trnType === "KOTSTS"
          ? 82
          : null
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
    renderItem = <div>Error : Data not found </div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <MenuOtherMaster
            {...props}
            // trnType={props.trnType}
            onBackPress={() => setEditedData()}
            onSavePress={(val) => {
            }}
            formData={editedData.formData}
          />
        )}

        {!editedData &&
          (props.trnType === "VAR"
            ? otherMaster.menuVariation
            : props.trnType === "MGRP"
            ? otherMaster.menuGroup
            : props.trnType === "SPLNTS"
            ? otherMaster.specialNotes
            : props.trnType === "DEITTYP"
            ? otherMaster.dietType
            : props.trnType === "TSTS"
            ? otherMaster.tableStatusMaster
            : props.trnType === "KOTSTS"
            ? otherMaster.kotStatusMaster
            : null) && (
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={
                props.trnType === "VAR"
                  ? columnProperties
                  : props.trnType === "MGRP"
                  ? columnProperties
                  : props.trnType === "SPLNTS"
                  ? columnProperties
                  : props.trnType === "DEITTYP"
                  ? columnProperties
                  : props.trnType === "TSTS"
                  ? columnProperties
                  : props.trnType === "KOTSTS"
                  ? columnProperties
                  : null
              }
              myData={
                props.trnType === "VAR"
                  ? otherMaster.menuVariation
                  : props.trnType === "MGRP"
                  ? otherMaster.menuGroup
                  : props.trnType === "SPLNTS"
                  ? otherMaster.specialNotes
                  : props.trnType === "DEITTYP"
                  ? otherMaster.dietType
                  : props.trnType === "TSTS"
                  ? otherMaster.tableStatusMaster
                  : props.trnType === "KOTSTS"
                  ? otherMaster.kotStatusMaster
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
  new ColumnProperties("Id", true, "Id", false, 80),
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
export default MenuOtherMasterPage;
