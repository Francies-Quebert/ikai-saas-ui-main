import React, { Fragment, useEffect, useState } from "react";
import ClassMasterCard from "../backoffice/ClassMaster/ClassMasterCard";
import { fetchClassMaster } from "../../../store/actions/ClassMaster";
import { useDispatch, useSelector } from "react-redux";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { hasRight } from "../../../shared/utility";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";

const ClassMasterPage = () => {
  const [editedData, setEditedData] = useState();
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);

  const classMaster = useSelector((state) => state.classMaster);

  useEffect(() => {
    dispatch(fetchClassMaster());
    dispatch(setFormCaption(58));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [classMaster.classMaster]);
  let renderItem = null;
  if (classMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (classMaster.error) {
    renderItem = <div>Error : classMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <ClassMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={true}
            onSavePress={(val) => {
              if (val) {
                dispatch(fetchClassMaster());
              }
            }}
          />
        )}
        {!editedData && classMaster.classMaster && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={classMaster.classMaster}
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
  new ColumnProperties("ClassId", false, "ClassId", false, 150),
  new ColumnProperties("ClassCode", false, "Class Code", true),
  new ColumnProperties("ClassName", true, "Class Name", true),
  new ColumnProperties("IsActive", false, "IsActive", false, 250),
  new ColumnProperties("IsActiveComponent", true, "Status", false, 150),
];

export default ClassMasterPage;
