import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { fetchFAQMasterPortal } from "../../../store/actions/helpmaster";
import FAQMasterCard from "./FAQCenterMaster/FAQMasterCard";
import { hasRight } from "../../../shared/utility";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";

const FAQCenterMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const helpmasterportal = useSelector((state) => state.helpmasterportal);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchFAQMasterPortal());
    dispatch(setFormCaption(32));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [helpmasterportal.FAQMasters]);

  let renderItem = null;
  if (helpmasterportal.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (helpmasterportal.error) {
    renderItem = <div>Error : helpmaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <FAQMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
        )}

        {!editedData && helpmasterportal.FAQMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={helpmasterportal.FAQMasters}
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
  new ColumnProperties("Id", false, "FAQ Id", true, 350),
  new ColumnProperties("Question", true, "Faq Title", true, 350),
  new ColumnProperties("Answer", true, "Faq Description", false),
  new ColumnProperties("IsActive", false, "Active Status", false, 300),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];
export default FAQCenterMasterPage;
