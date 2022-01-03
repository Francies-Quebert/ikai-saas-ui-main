import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  Button,
  Form,
  Empty,
  Switch,
  Radio,
  Select,
  InputNumber,
  Input,
} from "antd";
import _ from "lodash";
import { EditableCell } from "../../../common/AntEditedCell";
import {
  PlusCircleOutlined,
  CloseCircleTwoTone,
  EditTwoTone,
  SaveTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import { fetchServiceRateMap } from "../../../../store/actions/serviceratemap";
import { fetchServiceMaster } from "../../../../store/actions/servicemaster";
import { fetchGetnewserviceratemapping } from "../../../../services/servicenewratemaster";
import { setSelectedServiceRateMap } from "../../../../store/actions/serviceratemap";

let isEdit = false;

export const getIsEditing = () => {
  return isEdit;
};

const ServiceRateTable = (props) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [key, setKey] = useState(1);
  const [typeAE, setTypeAE] = useState(
    props.data ? props.data.length : 1
  );
  const [PackageTitle, setpackageTitle] = useState("");
  const dispatch = useDispatch();
  const servicerateMap = useSelector(
    (state) => state.serviceratemap.servicerateMaps
  );
  const Packages = useSelector((state) => state.AppMain.packageMasters);
  const [Data, setData] = useState(props.Data);
  const config = useSelector((state) => state.AppMain.appconfigs);

  useEffect(() => {
    setData(props.data);
    setKey(
      props.data && props.data.length >0 ? props.data[props.data.length - 1].key + 1 : 1
    );
    // dispatch(setSelectedServiceRateMap(props.data));
  }, [props.data]);

  const edit = (record) => {
    form.setFieldsValue({
      key: key,
      PackageId: "",
      PackageTitle: "",
      Rate: "",
      DisType: "N",
      ...record,
    });
    setEditingKey(record.key);
    setTypeAE("E");
    isEdit = true;
  };

  const handleDelete = (key) => {
    const newData = [...Data];
    setData(newData.filter((item) => item.key !== key));
    // props.data=props.data.filter((item) => item.key !== key)
  };

  let columns = [
    {
      title: "Package Title",
      dataIndex: "PackageTitle",
      render: (text, record) => {
        return (
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a service"
            optionFilterProp="children"
            allowClear={true}
            defaultValue={record.PackageTitle}
            onChange={(val) => {
              // let tempdata=dataSource.filter((ii)=>ii.PackageId != ii.PackageId)
              record.PackageId = val;
              record.isDirty = true;
            }}
            disabled={record.FromDatabase}
          >
            {Packages.map((ii) => {
              if (
                props.data && !props.data
                  .filter((i) => i.isDeleted === false)
                  .map((iii) => iii.PackageId)
                  .includes(ii.PackageId)
              ) {
                return (
                  <Option key={ii.PackageId} value={ii.PackageId}>
                    {ii.PackageTitle}
                  </Option>
                );
              }
            })}
          </Select>
        );
      },
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      width: 200,
      render: (text, record) => {
        return (
          <InputNumber
            style={{ width: "100%" }}
            defaultValue={record.Rate}
            onChange={(value) => {
              record.Rate = value;
              record.isDirty = true;
            }}
          />
        );
      },
    },
    {
      title: "Discount",
      dataIndex: "discValue",

      required: false,
      width: 200,
      render: (text, record) => {
        return (
          <div
            style={{
              display: " flex",
            }}
          >
            <div>
              <InputNumber
                defaultValue={record.discValue}
                onChange={(value) => {
                  record.discValue = value;
                  record.isDirty = true;
                }}
              />
            </div>
            <div style={{ marginLeft: 8 }}>
              <Radio.Group
                onChange={(e) => {
                  record.discType = e.target.value;
                  record.isDirty = true;
                }}
                defaultValue={record.discType}
                buttonStyle="solid"
              >
                <Radio.Button value="P">%</Radio.Button>
                <Radio.Button value="V">{`${
                  config.filter((ii) => ii.configCode === "CURRENCY")[0].value1
                }`}</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        );
      },
    },

    {
      width: "10%",
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => {
        const editable = isEditing(record);
        return (
          <a
            href="javascript:;"
            onClick={() => {
              record.isDeleted = true;
              record.isDirty = true;
              handleDelete(record.key);
            }}
          >
            <DeleteTwoTone />
          </a>
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

export default ServiceRateTable;
