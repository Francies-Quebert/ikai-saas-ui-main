import React, { Fragment, useEffect, useState } from "react";
import { fetchTablesMaster } from "../../../store/actions/tablesmaster";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import { useDispatch, useSelector } from "react-redux";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";
// import TablesMasterCard from "../backoffice/TablesMaster/TablesMasterCard";
import TablesMasterCard from "../backoffice/TablesMaster/TablesCardNew";

const TablesMasterPage = () => {
  const tablesMaster = useSelector((state) => state.tablesMaster);
  const [editedData, setEditedData] = useState();
  const currTran = useSelector((state) => state.currentTran);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTablesMaster());
    dispatch(setFormCaption(54));
    dispatch(fetchBranchMaster());
  }, []);

  useEffect(() => {}, [tablesMaster.tablesMaster]);

  let renderItem = null;

  if (tablesMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (tablesMaster.error) {
    renderItem = <div>Error : tablesMaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {editedData && (
          <TablesMasterCard
            onBackPress={() => setEditedData()}
            formData={editedData.formData}
            showUserCredentials={true}
            onSavePress={(values) => {
              if (values) {
                dispatch(fetchTablesMaster());
              }
            }}
          />
        )}

        {!editedData && tablesMaster.tablesMaster && (
          <CustomDataTable
            addDisabled={hasRight(currTran.moduleRights, "ADD")}
            disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            columnProperties={columnProperties}
            myData={tablesMaster.tablesMaster}
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
  new ColumnProperties("ShortCode", true, "Table Short Code", false, 150),
  new ColumnProperties("TableName", true, "Table Name", true),
  new ColumnProperties("SecCode", false, "Section Code", false, 150),
  new ColumnProperties("Icon", false, "Icon", false, 100),
  new ColumnProperties("SittingCapacity", true, "Sitting Capacity", false, 200),
  new ColumnProperties("IsActive", false, "IsActive", false, 250),
  new ColumnProperties("IsActiveComponent", true, "Status", false, 150),
];

export default TablesMasterPage;
