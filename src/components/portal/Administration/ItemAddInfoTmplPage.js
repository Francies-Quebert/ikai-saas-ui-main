import React, { Fragment, useEffect, useState } from "react";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch } from "react-redux";
import { fetchItemAddInfoTemplHdr } from "../../../store/actions/ItemAddInfoTemplate";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { hasRight } from "../../../shared/utility";
import ItemAddInfoTemplateCard from "./ItemAddInfoTemplate/ItemAddInfoTmplCard";

const ItemAddInfoTmplPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const itemAddInfoTmplHdr = useSelector((state) => state.itemAddInfoTemplate);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(setFormCaption(52));
    dispatch(fetchItemAddInfoTemplHdr());
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  useEffect(() => {}, [itemAddInfoTmplHdr.itemAddInfoTmplHdr]);

  let renderItem = null;
  if (itemAddInfoTmplHdr.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (itemAddInfoTmplHdr.error) {
    renderItem = <div>Error : itemAddInfoTmplHdr.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <ItemAddInfoTemplateCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={true}
            onSavePress={(val) => {
              if (val) {
                dispatch(fetchItemAddInfoTemplHdr());
              }
            }}
          />
        )}
        {!editedData && itemAddInfoTmplHdr.itemAddInfoTmplHdr && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={itemAddInfoTmplHdr.itemAddInfoTmplHdr}
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
  new ColumnProperties("TempId", true, "ID", false, 100),
  new ColumnProperties("TemplateName", true, "Template Name", true),
  new ColumnProperties("IsActive", false, "Status", false, 50),
  new ColumnProperties("IsActiveComponent", true, "Status", false, 150),
];

export default ItemAddInfoTmplPage;
