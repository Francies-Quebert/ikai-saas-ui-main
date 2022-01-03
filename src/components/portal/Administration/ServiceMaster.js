import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import ServiceMasterCard from "./ServiceMaster/ServiceMasterCardNew";
// import ServiceMasterCard from "./ServiceMaster/ServiceMasterCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { fetchServiceMaster } from "../../../store/actions/servicemaster";
import { hasRight } from "../../../shared/utility";
import { fetchHsnsacMaster } from "../../../store/actions/hsnsacMaster";
import { fetchTaxMaster } from "../../../store/actions/taxMaster";

const ServiceMaster = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const serviceMaster = useSelector((state) => state.serviceMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchServiceMaster());
    dispatch(setFormCaption(10));
    dispatch(fetchHsnsacMaster());
    dispatch(fetchTaxMaster());
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      dispatch(fetchServiceMaster());
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [serviceMaster.serviceMasters]);

  let renderItem = null;
  if (serviceMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (serviceMaster.error) {
    renderItem = <div>Error : serviceMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <ServiceMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={true}
          />
        )}
        {!editedData && serviceMaster.serviceMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={serviceMaster.serviceMasters}
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
  new ColumnProperties("ServiceId", true, "Id", true, 50),
  new ColumnProperties("ServiceType", false, "Type", true, 200),
  new ColumnProperties("ServiceTitle", false, "Service Type", false, 250),
  new ColumnProperties("ServiceTypeTitle", true, "Service Type", false, 250),
  new ColumnProperties("ServiceDesc", true, "Service Description", true),
  new ColumnProperties("ServiceImageURI", false, "Image URI", true, 140),
  new ColumnProperties("IsActive", false, "IsActive", false, 100),
  new ColumnProperties("ImageUrlComponent", true, "Image", false, 100),
  new ColumnProperties("IsActiveComponent", true, "Status", false, 100),
  new ColumnProperties("HSNSACCode", false, "HSNSACCode", false, 100),
  new ColumnProperties("TaxCode", false, "TaxCode", false, 100),
  new ColumnProperties("pathType", false, "TaxCode", false, 100),
];

export default ServiceMaster;
