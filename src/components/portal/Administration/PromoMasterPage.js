import React, { Fragment, useState, useEffect } from "react";
// import PromoMasterCard from './PromoMaster/PromoMasterCard';
import PromoMasterCard from "./PromoMaster/PromoMasterCardNew";
import CustomDataTable from "../../common/CustomDataTable";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchPromoMasters } from "../../../store/actions/promomaster";
import ColumnProperties from "../../../models/columnProperties";
import { hasRight } from "../../../shared/utility";

const PromoMaster = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const promoMaster = useSelector((state) => state.promoMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchPromoMasters());
    dispatch(setFormCaption(20));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [promoMaster.promoMasters]);

  let renderItem = null;
  if (promoMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (promoMaster.error) {
    renderItem = <div>Error : promoMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <PromoMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            title="Promo Master"
          />
        )}

        {!editedData && promoMaster.promoMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={promoMaster.promoMasters}
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
  new ColumnProperties("Id", false, "Id", true, 350),
  new ColumnProperties("PromoTitle", true, "Promo Title", true),
  new ColumnProperties("PromoImage", true, "Promo Image", false, 150),
  new ColumnProperties("PromoImageUri", false, "Promo Image URL", true),
  new ColumnProperties("PathType", false, "PathType", true, 0),
  new ColumnProperties("SysOption1", false, "SysOption1", true, 0),
  new ColumnProperties("SysOption2", false, "SysOption2", false, 0),
  new ColumnProperties("SysOption3", false, "SysOption3", false, 0),
  new ColumnProperties("SysOption4", false, "SysOption4", false, 0),
  new ColumnProperties("SysOption5", false, "SysOption5", false, 0),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("VisitType ", true, "VisitType", true, 150),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];
export default PromoMaster;
