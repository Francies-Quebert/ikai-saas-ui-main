import React, { useContext, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import OrderAddOnCost from "../../../models/OrderAddOnCost";
import {
  fetchAddOnCostOrder,
  DeleteScheduleAddOnCostOrder,
  setSelectedAddOnCost,
} from "../../../store/actions/orders";
// import { fetchAddOnCostOrder } from "../../../services/orders-portal";
import {
  Table,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Form,
  Empty,
} from "antd";
import { EditableRow, EditableCell } from "../../common/AntTableRowColEdit";

const AddOnTable = (props) => {
  const dispatch = useDispatch();

  const currTran = useSelector((state) => state.currentTran);
  const [dataSource, setDataSource] = useState([]);
  var scheduleAddOnDetail = useSelector((state) => state.orders.orderAddOnCost);

  useEffect(() => {
    dispatch(fetchAddOnCostOrder(props.scheduleId));
  }, []);

  useEffect(() => {
    setDataSource(scheduleAddOnDetail);
    // console.log(scheduleAddOnDetail);
  }, [scheduleAddOnDetail && scheduleAddOnDetail.length > 0]);

  let columns = [
    {
      title: "Sr.No.",
      dataIndex: "srNo",
    },
    {
      title: "Description",
      dataIndex: "desc",
      editable: true,
      width: "70%",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      editable: true,
      width: "30%",
    },
    {
      title: "",
      dataIndex: "operation",
      render: (text, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              handleDelete(record.key);
            }}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const handleDelete = (key) => {
    const newData = [...dataSource];
    setDataSource(newData.filter((item) => item.key !== key));
    dispatch(
      DeleteScheduleAddOnCostOrder(
        newData[key - 1].ScheduleId,
        newData[key - 1].OrderId,
        newData[key - 1].srNo
      )
    );
  };

  const handleAdd = () => {
    const newData = [...dataSource];
    newData.push(
      new OrderAddOnCost(
        props.scheduleId,
        props.orderId,
        dataSource.length + 1,
        "",
        0.0
      )
    );
    setDataSource(newData);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    dispatch(setSelectedAddOnCost(newData));
  };
  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ margin: 5 }}>
        Add new row
      </Button>
      {dataSource && dataSource.length > 0 && (
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      )}
      {dataSource && dataSource.length <= 0 && (
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={null}
          columns={columns}
        />
      )}
    </div>
  );
};

export default AddOnTable;
