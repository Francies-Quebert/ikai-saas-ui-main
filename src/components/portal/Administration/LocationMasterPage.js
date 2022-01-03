import React, { Fragment, useEffect, useState } from "react";
import LocationMasterCard from "./LocationMaster/LocationMasterCardNew";
// import LocationMasterCard from "./LocationMaster/LocationMasterCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch } from "react-redux";
import { fetchLocationMaster } from "../../../store/actions/locationmaster";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { hasRight } from "../../../shared/utility";

const LocationMaster = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const locationMaster = useSelector((state) => state.locationMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchLocationMaster());
    dispatch(setFormCaption(25));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [locationMaster.locationMasters]);

  //   return (

  let renderItem = null;
  if (locationMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (locationMaster.error) {
    renderItem = <div>Error : locationMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <LocationMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={true}
          />
        )}
        {!editedData && locationMaster.locationMasters && (
          <CustomDataTable
          addDisabled={hasRight(currTran.moduleRights, "ADD")}
          disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={locationMaster.locationMasters}
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
  new ColumnProperties("LocationId", true, "ID", false, 100),
  new ColumnProperties("LocationName", true, "Location Name", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 50),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export default LocationMaster;
