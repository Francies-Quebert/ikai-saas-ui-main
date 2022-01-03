import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Badge,
  Menu,
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Form,
  InputNumber,
} from "antd";
import { EditableCell } from "../../../common/AntEditedCell";
import {
  PlusCircleOutlined,
  UserOutlined,
  CloseCircleTwoTone,
  EditTwoTone,
  SaveTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import { fetchItemMaster } from "../../../../store/actions/ItemMaster";
import { fetchItemList } from "../../../../services/receipe-master";
import { useSelector, useDispatch } from "react-redux";

const ReciepeTable = (props) => {
  const [form] = Form.useForm();
  const [key, setKey] = useState(1);
  const { Option } = Select;
  const dispatch = useDispatch();
  const isEditing = (record) => record.key === editingKey;
  const [editingKey, setEditingKey] = useState("");
  const [Data, setData] = useState(props.data);
  const ItemMaster = useSelector((state) => state.ItemMaster.ItemMaster);
  const [UnitCode, setUnitCode] = useState();

  useEffect(() => {
    dispatch(fetchItemMaster());
    setData(props.data);
    setKey(
      props.data && props.data.length > 0
        ? parseInt(props.data[props.data.length - 1].key) + 1
        : 1
    );
  }, [props.data]);

  const handleDelete = (key) => {
    const newData = [...Data];
    setData(newData.filter((item) => item.key !== key));
  };

  let columns = [
    {
      title: "Item Name",
      dataIndex: "ItemCode",
      key: "ItemCode",
      width: "70%",
      render: (text, record) => {
        return (
          <Select
            showSearch
            allowClear={true}
            style={{ width: "100%", marginRight: 10 }}
            placeholder="Select Menu"
            optionFilterProp="children"
            defaultValue={record.ItemName}
            disabled={record.FromDatabase}
            onChange={(val) => {
              record.ItemCode = val;
              record.isDirty = true;
            }}
          >
            {ItemMaster.map((ii) => {
              if (
                props.data &&
                !props.data
                  .filter((i) => i.isDeleted === false)
                  .map((iii) => iii.ItemCode)
                  .includes(ii.ItemCode)
              ) {
                return (
                  <Option key={ii.ItemCode} value={ii.ItemCode}>
                    {ii.ItemName} ({ii.UnitCode})
                  </Option>
                );
              }
            })}
          </Select>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      render: (text, record) => {
        return (
          <InputNumber
            style={{ width: "100%" }}
            defaultValue={record.Quantity}
            onChange={(value) => {
              record.Quantity = value;
              record.isDirty = true;
            }}
          />
        );
      },
    },
    // {
    //   width: "10%",
    //   align:"center",
    //   title: "Action",
    //   dataIndex: "",
    //   key: "x",
    //   render: (text, record) => {
    //     const editable = isEditing(record);
    //     return (
    //       <a
    //         href="javascript:;"
    //         onClick={() => {
    //           record.isDeleted = true;
    //           record.isDirty = true;
    //           handleDelete(record.key);
    //         }}
    //       >
    //         <DeleteTwoTone  />
    //       </a>
    //     );
    //   },
    // },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "orderBy" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        requiredValidation: col.required === false ? false : true,
      }),
    };
  });
  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={Data ? Data.filter((ii) => ii.isDeleted === false) : null}
          columns={mergedColumns}
          bordered={true}
          pagination={false}
          rowClassName="editable-row"
        />
      </Form>
    </>
  );
};

export default ReciepeTable;
