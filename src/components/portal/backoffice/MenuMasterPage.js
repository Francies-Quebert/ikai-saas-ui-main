import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { fetchMenuMaster } from "../../../store/actions/MenuMaster";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { hasRight, sysGenCode } from "../../../shared/utility";
import { fetchSequenceNextVal } from "../../../store/actions/sys-sequence-config";
// import MenuMasterCard from "./MenuMaster/MenuMasterCard";
import MenuMasterCard from "./MenuMaster/MenuMasterNew";

const MenuMasterPage = () => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const MenuMaster = useSelector((state) => state.MenuMaster);
  const currTran = useSelector((state) => state.currentTran);
  const sysConfig = useSelector((state) => state.AppMain.sysSequenceConfig);
  let renderItem = null;

  useEffect(() => {
    dispatch(setFormCaption(65));
    dispatch(fetchMenuMaster());
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  if (MenuMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (MenuMaster.error) {
    renderItem = <div>Error : {MenuMaster.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <MenuMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            entryMode={editedData.entryMode}
            onSavePress={(val) => {
              dispatch(fetchMenuMaster());
            }}
          />
        )}

        {!editedData && (
          <div>
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={columnProperties}
              myData={MenuMaster.menuMaster}
              onAddClick={() => {
                setEditedData({ entryMode: "A" });
                if (sysGenCode(sysConfig, "MENU")) {
                  dispatch(fetchSequenceNextVal("MENU"));
                }
              }}
              onEditPress={(values) => {
                setEditedData({ entryMode: "E", formData: values });
              }}
              pageDefaultSize={15}
            />
          </div>
        )}
      </Fragment>
    );
  }

  return renderItem;
};

export const columnProperties = [
  new ColumnProperties("MenuCode", true, "Menu Code", true, 150),
  new ColumnProperties("ShortCode", false, "Short Code", true, 250),
  new ColumnProperties("MenuName", true, " Item Name", true),
  new ColumnProperties("MenuDesc", false, "Description", true),
  new ColumnProperties("DietType", false, "Sub Category", true, 150),
  new ColumnProperties("DietTypeFull", true, "Diet Type", true, 150),
  new ColumnProperties("UnitCode", false, "Unit", true),
  new ColumnProperties("MenuCatCode", false, "Sub Category", true),
  new ColumnProperties("MenuCatName", false, "Brand", true, 150),
  new ColumnProperties("MenuGroupCode", false, "Brand", true),
  new ColumnProperties("HSNSACCode", false, "HSN SAC Code", true),
  new ColumnProperties("TaxCode", false, "Tax Code", true),
  new ColumnProperties("ApplyForDineIn", false, "SaleOnMRP", false),
  new ColumnProperties("ApplyForPickUp", false, "MarkUpDown", false),
  new ColumnProperties("ApplyForDelivery", false, "MarkUpDownPV", false),
  new ColumnProperties("ApplyForOnline", false, "Cost", false),
  new ColumnProperties("IsActive", false, "Is Active", false),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export default MenuMasterPage;
