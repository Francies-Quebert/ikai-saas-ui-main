import React, { Fragment, useEffect, useState } from "react";
import MenuCategoryMasterCard from "../backoffice/MenuCategoryMaster/MenuCategoryMasterCard";
import { fetchMenuCategoryMaster } from "../../../store/actions/menucategorymaster";
import { useDispatch, useSelector } from "react-redux";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { toast } from "react-toastify";
import { setFormCaption } from "../../../store/actions/currentTran";
import { hasRight } from "../../../shared/utility";

const MenuCategoryMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const [editedData, setEditedData] = useState();
  const menuCategoryMaster = useSelector((state) => state.menuCategoryMaster);
  const FileUploadPath = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
        .value1
  );
  useEffect(() => {
    dispatch(fetchMenuCategoryMaster(FileUploadPath));
    dispatch(setFormCaption(61));
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  useEffect(() => {}, [menuCategoryMaster.menuCategoryMaster]);

  let renderItem = null;
  if (menuCategoryMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (menuCategoryMaster.error) {
    renderItem = <div>Error : menuCategoryMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <MenuCategoryMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={true}
            onSavePress={(val) => {
              dispatch(fetchMenuCategoryMaster(FileUploadPath));
            }}
          />
        )}
        {!editedData &&
          FileUploadPath &&
          menuCategoryMaster.menuCategoryMaster && (
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={columnProperties}
              myData={menuCategoryMaster.menuCategoryMaster}
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
  new ColumnProperties("MenuCatCode", true, "Menu Category Code", false, 150),
  new ColumnProperties("MenuCatName", true, "Menu Category Name", true),
  new ColumnProperties("MenuCatDesc", false, "Menu Category Description", true),
  new ColumnProperties("Image", true, "Image", false, 150),
  new ColumnProperties("ImageURL", false, "Image", true),
  new ColumnProperties("pathType", false, "pathType", false),
  new ColumnProperties("DefHSNSACCode", false, "DefHSNSACCode", true),
  new ColumnProperties("IsActive", false, "IsActive", false, 250),
  new ColumnProperties("IsActiveComponent", true, "Status", false, 150),
  new ColumnProperties("TaxCode", false, "DefTaxCode", false, 250),
];

export default MenuCategoryMasterPage;
