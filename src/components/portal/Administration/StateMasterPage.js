import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
// import StateMasterCard from './StateMaster/StateMasterCard';
import StateMasterCard from "./StateMaster/StateMasterCardNew";
import { fetchStateMasters } from "../../../store/actions/StateMaster";
import { fetchCountryMasters } from "../../../store/actions/CountryMaster";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";

const StateMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const stateMaster = useSelector((state) => state.stateMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchCountryMasters());
    dispatch(fetchStateMasters());
    dispatch(setFormCaption(23));
  }, []);

  useEffect(() => {}, [stateMaster.stateMasters]);

  let renderItem = null;
  if (stateMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (stateMaster.error) {
    renderItem = <div>Error : stateMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <StateMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
        )}
        {!editedData && stateMaster.stateMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={stateMaster.stateMasters}
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
  new ColumnProperties("StateCode", true, "State Name", true, 300),
  new ColumnProperties("StateName", true, "State Code", false, 150),
  new ColumnProperties("CountryCode", true, "Country", true),
  new ColumnProperties("StateCode2Char", false, "Short Code", false, 80),
  new ColumnProperties("IsDefault", false, "IsDefault", false, 100),
  new ColumnProperties("IsActive", false, "Active Status", false, 100),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 120),
  new ColumnProperties("IsDefaultComponent", true, "Default", false, 100),
  new ColumnProperties("GSTStateCode", false, "GSTStateCode", false, 100),
];
export default StateMasterPage;
