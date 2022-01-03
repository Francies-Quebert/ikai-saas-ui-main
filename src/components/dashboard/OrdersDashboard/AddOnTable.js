import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import AddOnCard from "./AddOnCard";
import {
  fetchAddOnCostOrder,
  DeleteScheduleAddOnCostOrder,
} from "../../../store/actions/orders";

const AddOnTable = (props) => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const currTran = useSelector((state) => state.currentTran);
  useEffect(() => {
    dispatch(fetchAddOnCostOrder(props.scheduleId));
  }, []);

  useEffect(() => {
    if (currTran.isSuccess === true) {
      dispatch(fetchAddOnCostOrder(props.scheduleId));
    }
  }, [currTran.isSuccess]);

  const scheduleAddOnDetail = useSelector(
    (state) => state.orders.orderAddOnCost
  );
  const highestSrNo = useSelector((state) => state.orders.highestSrNo);
  const total = useSelector((state) => state.orders.total);

  return (
    <div>
      {editedData && (
        <AddOnCard
          scheduleId={props.scheduleId}
          orderId={props.orderId}
          srNo={editedData.srNo ? editedData.srNo : 1}
          entryMode={editedData.entryMode}
          onBackPress={() => setEditedData()}
          formData={editedData.formData}
        />
      )}
      {!editedData && scheduleAddOnDetail && (
        <>
          <CustomDataTable
            AllowDelete={true}
            isInvisibleFilter={true}
            showPagination={false}
            columnProperties={columnProperties}
            myData={scheduleAddOnDetail}
            // pageDefaultSize={15}
            onAddClick={() => {
              setEditedData({
                entryMode: "A",
                srNo: highestSrNo ? highestSrNo : 0,
              });
            }}
            onEditPress={(values) => {
              setEditedData({ entryMode: "A", formData: values });
            }}
            onDeletePress={(values) =>
              dispatch(
                DeleteScheduleAddOnCostOrder(
                  values.ScheduleId,
                  values.OrderId,
                  values.srNo
                )
              )
            }
          />
          {/* <hr className="m-0" /> */}
          <div
            className="row m-t-5"
            style={{ paddingLeft: 30, display: "flex", paddingRight: 30 }}
          >
            {/* <div style={{ flex: 0.3 }}>
              <strong>{`Total`}</strong>
            </div> */}
            <div style={{ flex: 1, textAlign: "right", paddingRight: 25 }}>
              {" "}
              <strong>{`Total : `}</strong>&#8377;{` ${total}`}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddOnTable;

export const columnProperties = [
  new ColumnProperties("ScheduleId", false, "ScheduleId", false, 100),
  new ColumnProperties("OrderId", false, "OrderId", false, 150),
  new ColumnProperties("srNo", true, "srNo", true, 100),
  new ColumnProperties("desc", true, "Description", true),
  new ColumnProperties("amount", true, "Amount", true, 150),
];
