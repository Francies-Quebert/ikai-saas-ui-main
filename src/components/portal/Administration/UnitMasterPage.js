import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UnitMasterCard from "./UnitMaster/UnitMasterCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { fetchUnitMaster } from "../../../store/actions/unitmaster.js";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { hasRight } from "../../../shared/utility";

const UnitMasterPage = () => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const unitMaster = useSelector((state) => state.unitMaster);
  const currTran = useSelector((state) => state.currentTran);
  let renderItem = null;

  useEffect(() => {
    dispatch(setFormCaption(48));
    dispatch(fetchUnitMaster());
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  if (unitMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (unitMaster.error) {
    renderItem = <div>Error : {unitMaster.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <UnitMasterCard
            onSavePress={() => {}}
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
        )}

        {!editedData && (
          <div>
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={columnProperties}
              myData={unitMaster.unitMaster}
              onAddClick={() => {
                setEditedData({ entryMode: "A" });
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
  new ColumnProperties("UnitCode", true, "Unit Code", true, 100),
  new ColumnProperties("UnitDesc", true, "Unit Desc", true, 100),
  new ColumnProperties("ParentUnitCode", true, "Parent Unit", true, 200),
  new ColumnProperties(
    "UnitMeasureToParent",
    true,
    "Unit Measure Parent",
    true,
    300
  ),
  new ColumnProperties("AllowDecimal", false, "Allow Decimal", true, 150),
  new ColumnProperties("IsActive", false, "Is Active", false, 150),
  new ColumnProperties(
    "AllowDecimalComponent",
    true,
    "Allow Decimal",
    true,
    150
  ),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export default UnitMasterPage;
