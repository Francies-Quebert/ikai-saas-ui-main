import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { fetchSlotMaster } from "../../../store/actions/slotmaster";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";
import SlotMasterCardNew from "../Administration/SlotMaster/SlotMasterCardNew";

const SlotMaster = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const slotMaster = useSelector((state) => state.slotMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchSlotMaster());
    dispatch(setFormCaption(11));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [slotMaster.slotMasters]);

  // return (

  let renderItem = null;
  if (slotMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (slotMaster.error) {
    renderItem = <div>Error : slotMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <SlotMasterCardNew
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={true}
          />
        )}
        {!editedData && slotMaster.slotMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={slotMaster.slotMasters}
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
  new ColumnProperties("Id", true, "ID", true, 100),
  new ColumnProperties("SlotName", true, "Slot Name", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 50),
  new ColumnProperties("starttime", true, "Start Time", true, 250),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];
export default SlotMaster;
