import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  PlusCircleOutlined,
  CloseCircleTwoTone,
  EditTwoTone,
  SaveTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import _ from "lodash";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import { Table, Button, Form, Divider, message, InputNumber } from "antd";
import { EditableCell } from "../../common/AntEditedCell";
import { reInitialize } from "../../../store/actions/currentTran";
import {
  getServiceSchedulesAddonCost,
  InsUpdateScheduleAddOnCostOrder,
} from "../../../services/service-managment/service-management";
import { useSelector } from "react-redux";

let isEdit = false;

const AdditonalCost = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [key, setKey] = useState(1);
  const [typeAE, setTypeAE] = useState();
  const [editingKey, setEditingKey] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const isEditing = (record) => record.key === editingKey;
  const [totalVariableAmount, setTotalVariableAmount] = useState(0);
  const appConfig = useSelector((state) => state.AppMain.appconfigs);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    getServiceSchedulesAddonCost(
      CompCode,
      props.ScheduleId,
      props.OrderId
    ).then((res) => {
      setDataSource(res);
      setKey(res.length > 0 ? parseInt(res[res.length - 1].key) + 1 : 1);
    });
  }, []);

  useEffect(() => {
    let tempAmount = 0;
    dataSource
      .filter((dd) => dd.isDeleted !== true)
      .map((ii) => (tempAmount += parseFloat(ii.Rate)));
    setTotalVariableAmount(tempAmount);
  }, [dataSource]);

  const onFinish = () => {
    if (isEdit === true) {
      message.error("Please save your data");
      return false;
    }
    // console.log(dataSource);
    dispatch(InsUpdateScheduleAddOnCostOrder(dataSource));
  };

  const add = async (record) => {
    const row = await form.validateFields();
    setDataSource([
      ...dataSource,
      {
        key: key,
        ScheduleId: props.ScheduleId,
        OrderId: props.OrderId,
        SrNo: dataSource.length + 1,
        ItemDesc: "",
        Rate: 0,
        isDeleted: false,
      },
    ]);
    form.setFieldsValue({
      key: key,
      ScheduleId: props.ScheduleId,
      OrderId: props.OrderId,
      SrNo: dataSource.length + 1,
      ItemDesc: "",
      Rate: 0,
    });
    setEditingKey(key);
    setKey(key + 1);
    setTypeAE("A");
    isEdit = true;
  };

  const edit = (record) => {
    form.setFieldsValue({
      key: key,
      ScheduleId: props.ScheduleId,
      OrderId: props.OrderId,
      SrNo: parseInt(record.SrNo),
      ItemDesc: "",
      Rate: record.SrNo,
      ...record,
    });
    setEditingKey(record.key);
    setTypeAE("E");
    isEdit = true;
  };

  const handleDelete = (key) => {
    const newData = [...dataSource];
    setDataSource(newData);
    // console.log(dataSource, "deleted");
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

  const save = async (key, record) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === parseInt(item.key));
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        setEditingKey("");
        isEdit = false;
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey("");
        isEdit = false;
      }
    } catch (errInfo) {}
  };

  let columns = [
    {
      title: "Sr.No.",
      dataIndex: "SrNo",
      width: 10,
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "ItemDesc",
      editable: true,
    },
    {
      title: "Amount",
      dataIndex: "Rate",
      width: "30%",
      editable: true,
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
              style={{ marginRight: 10 }}
              onClick={() => {
                save(parseInt(record.key), record);
              }}
            >
              <SaveTwoTone />
            </a>
            <a
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
              disabled={editingKey !== ""}
              style={{ marginRight: 10 }}
              onClick={() => {
                edit(record);
              }}
            >
              <EditTwoTone />
            </a>
            <a
              onClick={() => {
                record.isDeleted = true;
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
        inputType: col.dataIndex === "Rate" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        requiredValidation: col.required === false ? false : true,
      }),
    };
  });

  //   console.log(dataSource);
  return (
    <>
      <Form form={form} component={false}>
        <div style={{ display: "flex" }}>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            style={{ marginBottom: 5, marginTop: 5, marginRight: 5 }}
            onClick={() => add()}
          >
            New Row
          </Button>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "0px 20px",
            }}
          >
            Variable Cost:&nbsp;
            <div style={{ fontWeight: "600" }}>
              {`${appConfig.find((ii) => ii.configCode === "CURRENCY").value1} 
              ${totalVariableAmount.toFixed(2)}`}
            </div>
          </div>
        </div>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={dataSource.filter((ii) => ii.isDeleted === false)}
          columns={mergedColumns}
          bordered={true}
          pagination={false}
          rowClassName="editable-row"
        />
      </Form>
      <Divider style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ marginRight: 5, left: 10, marginBottom: 5 }}>
        <Button
          type="primary"
          key="submit"
          disabled={props.IsSaveDisabled}
          icon={<SaveOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => {
            onFinish();
          }}
        >
          Save
        </Button>
        <Button
          type="primary"
          key="back"
          icon={<RollbackOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => props.onAddCostBack()}
        >
          Back
        </Button>
      </div>
    </>
  );
};

export default AdditonalCost;
