import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Form, Empty, Switch } from "antd";
import _ from "lodash";
import { EditableCell } from "../../../common/AntEditedCell";
import {
  PlusCircleOutlined,
  CloseCircleTwoTone,
  EditTwoTone,
  SaveTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import { setSelectedInfoTemplDtl } from "../../../../store/actions/ItemAddInfoTemplate";
import { fetchItemAddInfoTemplDtl } from "../../../../services/item-add-info";
let isEdit = false;
export const getIsEditing = () => {
  return isEdit;
};

const ItemAddInfoDtlTable = (props) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [key, setKey] = useState(1);
  const [typeAE, setTypeAE] = useState();
  const [dataSource, setDataSource] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchItemAddInfoTemplDtl(props.TempId).then((res) => {
      setDataSource(res);
      setKey(res.length > 0 ? res[res.length - 1].key + 1 : 1);
      dispatch(setSelectedInfoTemplDtl(res));
    });
  }, []);

  const edit = (record) => {
    form.setFieldsValue({
      TempId: props.TempId ? props.TempId : 0,
      key: key,
      FieldTitle: "",
      DefaultValue: "",
      orderBy: null,
      IsReadOnly: "N",
      IsCompulsary: "N",
      ...record,
    });
    setEditingKey(record.key);
    setTypeAE("E");
    isEdit = true;
  };

  const add = async (record) => {
    const row = await form.validateFields();
    setDataSource([
      ...dataSource,
      {
        TempId: props.TempId ? props.TempId : 0,
        key: key,
        FieldTitle: "",
        DefaultValue: "",
        orderBy: null,
        IsReadOnly: "N",
        IsCompulsary: "N",
      },
    ]);
    // console.log(dataSource);
    form.setFieldsValue({
      TempId: props.TempId ? props.TempId : 0,
      key: key,
      FieldTitle: "",
      DefaultValue: "",
      orderBy: null,
      IsReadOnly: "N",
      IsCompulsary: "N",
    });
    setEditingKey(key);
    setKey(key + 1);
    setTypeAE("A");
    isEdit = true;
  };

  const cancel = async (record) => {
    if (typeAE === "A") {
      handleDelete(record.key);
      setEditingKey("");
      isEdit = false;
    } else {
      const row = await form.validateFields();
      setEditingKey("");
      isEdit = false;
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        dispatch(setSelectedInfoTemplDtl(newData));
        setEditingKey("");
        isEdit = false;
      } else {
        newData.push(row);
        setDataSource(newData);
        dispatch(setSelectedInfoTemplDtl(newData));
        setEditingKey("");
        isEdit = false;
      }
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = [...dataSource];
    setDataSource(newData.filter((item) => item.key !== key));

    dispatch(
      setSelectedInfoTemplDtl(newData.filter((item) => item.key !== key))
    );
  };

  let columns = [
    { align: "center", title: "Sr.No.", dataIndex: "key", width: "5%" },
    {
      title: "Field Title",
      dataIndex: "FieldTitle",
      editable: true,
      width: "15%",
    },
    {
      title: "Default Value",
      dataIndex: "DefaultValue",
      editable: true,
      width: "",
      required: false,
    },
    {
      title: "Order By",
      dataIndex: "orderBy",
      editable: true,
      width: "10%",
      required: false,
    },
    {
      align: "center",
      title: "Read Only",
      dataIndex: "IsReadOnly",
      width: "10%",
      render: (text, record) => {
        return (
          <Switch
            key={record.IsReadOnly}
            disabled={editingKey !== record.key}
            onChange={(val) => {
              const rowIndex = dataSource.findIndex(
                (i) => i.key === record.key
              );
              dataSource[rowIndex].IsReadOnly = val === true ? "Y" : "N";
              // setIsReadOnly(dataSource[rowIndex].IsReadOnly);
            }}
            defaultChecked={record.IsReadOnly === "Y" ? true : false}
          />
        );
      },
    },
    {
      align: "center",
      title: "Compulsary",
      width: "10%",
      dataIndex: "IsCompulsary",
      render: (text, record) => {
        return (
          <Switch
            key={record.IsCompulsary}
            disabled={editingKey !== record.key}
            onChange={(e) => {
              const rowIndex1 = dataSource.findIndex(
                (ii) => ii.key === record.key
              );
              dataSource[rowIndex1].IsCompulsary = e === true ? "Y" : "N";
              // dispatch(setSelectedInfoTemplDtl(dataSource));
            }}
            defaultChecked={record.IsCompulsary === "Y" ? true : false}
          />
        );
      },
    },
    {
      width: "10%",
      align: "center",
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <a
              // href="javascript:;"
              style={{ marginRight: 10 }}
              onClick={() => save(record.key)}
            >
              <SaveTwoTone />
            </a>
            <a
              // href="javascript:;"
              onClick={() => {
                cancel(record);
              }}
            >
              <CloseCircleTwoTone />
            </a>
          </>
        ) : (
          <>
            <a
              // href="javascript:;"
              disabled={editingKey !== ""}
              style={{ marginRight: 10 }}
              onClick={() => edit(record)}
            >
              <EditTwoTone />
            </a>
            <a
              // href="javascript:;"
              onClick={() => {
                handleDelete(record.key);
              }}
            >
              <DeleteTwoTone />
            </a>
          </>
        );
      },
    },
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
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          style={{ marginBottom: 8 }}
          onClick={() => add()}
        >
          New Row
        </Button>

        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={dataSource}
          columns={mergedColumns}
          bordered={true}
          pagination={false}
          rowClassName="editable-row"
        />
      </Form>
    </>
  );
};

export default ItemAddInfoDtlTable;
