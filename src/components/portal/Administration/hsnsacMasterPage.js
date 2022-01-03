import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSubCategory } from "../../../store/actions/subCategoryMaster";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { fetchHsnsacMaster } from "../../../store/actions/hsnsacMaster";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { hasRight } from "../../../shared/utility";
import HsnsacMasterCard from "./HSNSACmaster/hsnacCardNew";
// import HsnsacMasterCard from "./HSNSACmaster/hsnsacMasterCard";

const HsnsacMasterPage = () => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const hsnsacMaster = useSelector((state) => state.hsnsacMaster);
  const currTran = useSelector((state) => state.currentTran);

  let renderItem = null;

  useEffect(() => {
    dispatch(setFormCaption(46));
    dispatch(fetchHsnsacMaster());
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  if (hsnsacMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (hsnsacMaster.error) {
    renderItem = <div>Error : {hsnsacMaster.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <HsnsacMasterCard
            onSavePress={(data) => {
              dispatch(fetchHsnsacMaster());
            }}
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
              myData={hsnsacMaster.hsnsacMaster}
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
  new ColumnProperties("hsnsaccode", true, "HSN SAC Code", true, 200),
  new ColumnProperties("hsnsacdesc", true, "Description", true),
  new ColumnProperties("DefTaxCode", false, "Default Tax Code", true, 150),
  new ColumnProperties("TaxName", true, "Default Tax", true, 150),
  new ColumnProperties("IsActive", false, "Is Active", false),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export default HsnsacMasterPage;
