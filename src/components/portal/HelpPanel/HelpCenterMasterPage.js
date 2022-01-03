import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { fetchHelpMasterPortal } from "../../../store/actions/helpmaster";
import HelpMasterCard from "./HelpCenterMaster/HelpMasterCard";
import { hasRight } from "../../../shared/utility";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";

const HelpCenterMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const helpmasterportal = useSelector((state) => state.helpmasterportal);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchHelpMasterPortal());
    dispatch(setFormCaption(31));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [helpmasterportal.HelpMasters]);

  let renderItem = null;
  if (helpmasterportal.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (helpmasterportal.error) {
    renderItem = <div>Error : helpmaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <HelpMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
        )}

        {!editedData && helpmasterportal.HelpMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={helpmasterportal.HelpMasters}
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
  new ColumnProperties("Id", false, "Help Id", true, 350),
  new ColumnProperties("HelpTitle", true, "Help Title", true, 250),
  new ColumnProperties("HelpDesc", true, "Help Description", false),
  new ColumnProperties("IsAllowFeedback", false, "IsAllow Feedback", true, 100),
  new ColumnProperties("DisplayFor", true, "Display For", true, 100),
  new ColumnProperties("IsActive", false, "Active Status", false, 300),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
  new ColumnProperties(
    "IsAllowFeedbackComponent",
    true,
    "IsAllowed Feedback",
    false,
    170
  ),
];
export default HelpCenterMasterPage;
