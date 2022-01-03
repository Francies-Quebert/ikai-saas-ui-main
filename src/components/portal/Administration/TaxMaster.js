import React, { Fragment, useEffect, useState } from "react";
import { Table, Popconfirm, Badge, Form, Button, Empty } from "antd";
import { useSelector, useDispatch } from "react-redux";
import ColumnPropertiesAnt from "../../../models/columnPropertiesAnt.js";
import { PlusCircleOutlined } from "@ant-design/icons";
import TaxMasterCard from "./TaxMaster/TaxMasterCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { fetchTaxMaster } from "../../../store/actions/taxMaster.js";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { hasRight } from "../../../shared/utility";

const TaxMaster = () => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const taxMaster = useSelector((state) => state.taxMaster);
  const currTran = useSelector((state) => state.currentTran);
  let renderItem = null;

  useEffect(() => {
    dispatch(setFormCaption(43));
    dispatch(fetchTaxMaster());
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  if (taxMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (taxMaster.error) {
    renderItem = <div>Error : {taxMaster.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <TaxMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            onSavePress={(val) => {
              if (val) {
                dispatch(fetchTaxMaster());
              }
            }}
          />
        )}

        {!editedData && (
          <div>
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={columnProperties}
              myData={taxMaster.taxMaster}
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
  new ColumnProperties("TaxCode", true, "Tax Code", true, 150),
  new ColumnProperties("TaxName", true, "Tax Name", true, 150),
  new ColumnProperties("TaxType", false, "Tax Type", true, 150),
  new ColumnProperties("TaxTypeFF", true, "Tax Type", true, 150),
  new ColumnProperties("TranType", false, "Tran Type", true, 150),
  new ColumnProperties("TranTypeFF", true, "Tran Type", true, 150),
  new ColumnProperties("TaxPer", true, "Tax %", true, 150),
  new ColumnProperties("IGSTPer", true, "IGST %", true, 100),
  new ColumnProperties("CGSTPer", true, "CGST %", true, 150),
  new ColumnProperties("SGSTPer", true, "SGST %", true, 150),
  new ColumnProperties("UTSTPer", true, "UTST %", true, 150),
  new ColumnProperties("CESSPer", true, "CESS %", true, 150),
  new ColumnProperties("SURCHARGPer", true, "SURCHARG %", true, 150),
  new ColumnProperties("IsActive", false, "Is Active", false, 150),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export default TaxMaster;
