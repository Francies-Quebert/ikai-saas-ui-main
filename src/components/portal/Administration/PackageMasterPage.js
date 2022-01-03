import React, { Fragment, useEffect, useState } from "react";
import PackageMasterCard from "./PackageMaster/PackageMasterCardNew";
// import PackageMasterCard from "./PackageMaster/PackageMasterCard";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { fetchPackageMaster } from "../../../store/actions/PackageMaster";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";

const PackageMasterPage = () => {
  const dispatch = useDispatch();
  const packageMaster = useSelector(state => state.packageMaster);
  const currTran = useSelector(state => state.currentTran);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchPackageMaster());
    dispatch(setFormCaption(21));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [packageMaster.packageMasters]);

  let renderItem = null;
  if (packageMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (packageMaster.error) {
    renderItem = <div>Error : packageMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <PackageMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
        )}
        {!editedData && packageMaster.packageMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={packageMaster.packageMasters}
            onAddClick={() => {
              setEditedData({ entryMode: "A" });
            }}
            onEditPress={values => {

              // seteditedKeyPair({ ServiceTypeCode: "TO" });
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
  new ColumnProperties("PackageId", true, "PackageId", true, 100),
  new ColumnProperties("PackageTitle", true, "Package Title", true, ),
  new ColumnProperties("PackageDesc", false, "Package Details", false,100 ),
  new ColumnProperties("PackageUnit", true, "Unit", false, 100),
  new ColumnProperties("PackageUnitDesc", false, "PackageUnitDesc", true, 0),
  new ColumnProperties("PackageDiscType", false, "PackageDiscType", false, 0),
  new ColumnProperties("PackageDiscValue", false, "PackageDiscValue", false, 0),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 120),
  new ColumnProperties("VisitType", true, "Visit Type", false, 150),
  new ColumnProperties("PackageDiscHtml", false, "PackageDiscHtml", false, 0)


];

export default PackageMasterPage;
