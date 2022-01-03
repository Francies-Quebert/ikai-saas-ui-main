import React, { Fragment, useEffect, useState } from "react";
import ColumnProperties from "../../../models/columnProperties";
import ConfigCard from "./Config/ConfigCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import { fetchConfig } from "../../../store/actions/config";
import CustomDataTable from "../../common/CustomDataTable";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";

const ConfigNewPage = () => {
  const currTran = useSelector((state) => state.currentTran);
  // const config = useSelector(state => state.config);
  const config = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  // const filterConfig = config.find(ii=>ii.configs.ConfigAccessLevel === "U")

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  useEffect(() => {
    dispatch(fetchConfig());
    dispatch(setFormCaption(27));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {

  }, [config.configs]);

  let renderItem = null;
  if (config.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (config.error) {
    renderItem = <div>Error : config.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <ConfigCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            // showUserCredentials={true}
          />
        )}
        {!editedData && config.configs && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={config.configs.filter(
              (item) => item.ConfigAccessLevel === "U"
            )}
            isInvisibleAdd={true}
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
  new ColumnProperties("id", true, "ID", true, 40),
  new ColumnProperties("ConfigCode", true, "Config Code", true, 150),
  new ColumnProperties(
    "ConfigAccessLevel",
    false,
    "Config Access Level",
    false
  ),
  new ColumnProperties("ConfigType", false, "ConfigType", true),
  new ColumnProperties("ConfigName", true, "ConfigName", true),
  new ColumnProperties("Value1", true, "Value1", true, 150),
  new ColumnProperties("Value2", true, "Value2", true, 150),
  new ColumnProperties("ConfigDesc", true, "ConfigDesc", true, 250),
  new ColumnProperties("SysOption1", false, "SysOption1", true),
  new ColumnProperties("SysOption2", false, "SysOption2", true),
];

export default ConfigNewPage;
