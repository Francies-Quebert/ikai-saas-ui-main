import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
// import CountryMasterCard from "./CountryMaster/CountryMasterCard";
import CountryMasterCard from "./CountryMaster/CountryMasterCardNew";
import { fetchCountryMasters } from "../../../store/actions/CountryMaster";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";

const CountryMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const countryMaster = useSelector((state) => state.countryMaster);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    dispatch(fetchCountryMasters());
    dispatch(setFormCaption(22));
  }, []);

  useEffect(() => {}, [countryMaster.countryMasters]);
  let renderItem = null;
  if (countryMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (countryMaster.error) {
    renderItem = <div>Error : countryMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <CountryMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
          />
        )}

        {!editedData && countryMaster.countryMasters && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={countryMaster.countryMasters}
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
  new ColumnProperties("CountryCode", true, "CountryCode", true, 150),
  new ColumnProperties("CountryName", true, "Country Name", true, 250),
  new ColumnProperties("MobileCode", true, "Mobile Code", false, 150),
  new ColumnProperties(
    "CurrencySymbolChar",
    false,
    "CurrencySymbol Char",
    false,
    80
  ),
  new ColumnProperties(
    "CountryCode2Char",
    true,
    "Country Short Code",
    true,
    200
  ),
  new ColumnProperties("CurrencyCode", false, "CurrencyCode", false, 180),
  new ColumnProperties("IsDefault", false, "IsDefault", true, 100),
  new ColumnProperties("IsActive", false, "Active Status", true, 100),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 120),
  new ColumnProperties("IsDefaultComponent", true, "Default", false, 100),
];
export default CountryMasterPage;
