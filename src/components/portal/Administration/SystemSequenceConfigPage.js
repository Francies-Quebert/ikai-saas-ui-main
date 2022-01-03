import React, { Fragment, useEffect, useState } from "react";
import CardHeader from "../../common/CardHeader";
import SystemConfigCard from "../Administration/SystemSequenceConfig/SystemSequenceConfigCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchSysSequenceConfig } from "../../../store/actions/sys-sequence-config";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";
import SequenceConfigNewCard from "../Administration/SystemSequenceConfig/SequenceConfigNewCard";

const SystemConfigPage = () => {
  const sysSequenceConfig = useSelector((state) => state.sysSequenceConfig);
  const [editedData, setEditedData] = useState();
  const currTran = useSelector((state) => state.currentTran);
  const dispatch = useDispatch();
  const [configType, setConfigType] = useState("");

  useEffect(() => {
    dispatch(fetchSysSequenceConfig());
    dispatch(setFormCaption(55));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [sysSequenceConfig.sysSequenceConfig]);

  let renderItem = null;
  if (sysSequenceConfig.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (sysSequenceConfig.error) {
    renderItem = <div>Error : sysSequenceConfig.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <SystemConfigCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={true}
          />
        )}
        {!editedData && sysSequenceConfig.sysSequenceConfig && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={sysSequenceConfig.sysSequenceConfig}
            onAddClick={() => {
              setEditedData({ entryMode: "A" });
            }}
            onEditPress={(values) => {
              {
                  setEditedData({ entryMode: "E", formData: values });
              }
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
  new ColumnProperties("Id", false, " Short Code", false, 150),
  new ColumnProperties("TranType", false, "Tran Type", true,),
  new ColumnProperties("TranDesc", true, "Transaction Description", false,),
  new ColumnProperties("ConfigType", false, "Config Type", true, 200),
  new ColumnProperties("ResetOn", false, "Reset On", true),
  new ColumnProperties("Preffix", false, "Preffix", true, 200),
  new ColumnProperties("Suffix", false, "Suffix", true, 200),
  new ColumnProperties("Value", false, "Value", false, 150),
  new ColumnProperties("LastGenNo", false, "LastGenerated No", false),
  new ColumnProperties("EnablePadding", false, "Padding Enabled", false, 100),
  new ColumnProperties("PaddingLength", false, "Padding Length", false, 100),
  new ColumnProperties("PaddingChar", false, "Padding Char", false, 100),
  new ColumnProperties("IsActive", false, "IsActive", false, 250),
  new ColumnProperties("IsActiveComponent", true, "Status", false, 150),
  new ColumnProperties("ConfigTypeDesc", false, "Configuration Type", false, 100),

];

export default SystemConfigPage;
