import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Input,
  Switch,
  Spin,
  Card,
  Select,
  Row,
  Col,
  Table,
  InputNumber,
  Popconfirm,
  message,
  Menu,
  Dropdown,
} from "antd";
import { EditableCell } from "../../common/AntEditedCell";
import {
  CloseCircleTwoTone,
  EditTwoTone,
  SaveTwoTone,
  DeleteTwoTone,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import CSVReader from "react-csv-reader";
import {
  fetchNotificationFromSystem,
  fetchSystemSp,
} from "../../../services/notification-center";

// let data = [
//   { key: 1, VAR1: "abc", VAR2: "asda", VAR3: "asd", VAR4: "asd", VAR5: "dasd" },
// ];
let data = [];
export const fetchTableData = () => {
  return data;
};

const NotificationPromoTable = (props) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const [key, setKey] = useState(
    data.length > 0 ? data[data.length - 1].key + 1 : 1
  );
  const [dataSource, setDataSource] = useState(data);
  const [typeAE, setTypeAE] = useState();
  const upload = useRef();
  const [fetchSystem, setFetchSystem] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setDataSource([]);
  }, []);
  useEffect(() => {
    fetchNotificationFromSystem(CompCode).then((res) => {
      setFetchSystem([]);
      setFetchSystem(
        res.filter((ii) => ii.NotificationType === props.NotificationType)
      );
    });
  }, [props.NotificationType]);

  useEffect(() => {
    data.splice(0, data.length, ...dataSource);

    if (dataSource.length <= 0) {
      SetShowColumns({
        var1: true,
        var: false,
        var3: false,
        var4: false,
        var5: false,
      });
    }
  }, [dataSource]);

  const edit = (record) => {
    form.setFieldsValue({
      key: key,
      VAR1: "",
      VAR2: "",
      VAR3: "",
      VAR4: "",
      VAR5: "",
      ...record,
    });
    setEditingKey(record.key);
    setTypeAE("E");
  };

  const add = async (record) => {
    const row = await form.validateFields();
    setDataSource([
      ...dataSource,
      {
        key: key,
        var1: "",
        var2: "",
        var3: "",
        var4: "",
        var5: "",
      },
    ]);
    form.setFieldsValue({
      var1: "",
      var2: "",
      var3: "",
      var4: "",
      var5: "",
    });
    setEditingKey(key);
    setKey(key + 1);
    setTypeAE("A");
  };

  const cancel = async (record) => {
    if (typeAE === "A") {
      handleDelete(record.key);
      setEditingKey("");
    } else {
      const row = await form.validateFields();
      setEditingKey("");
    }
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = [...dataSource];
    setDataSource(newData.filter((item) => item.key !== key));
  };
  class columnClass {
    constructor(key, title, isEditable) {
      this.title = title;
      this.dataIndex = key;
      this.key = key;
      this.editable = isEditable;
    }
  }

  const [showColumns, SetShowColumns] = useState({
    var1: true,
    var2: false,
    var3: false,
    var4: false,
    var5: false,
  });

  let columns = [];
  if (showColumns.var1) {
    columns = [...columns, new columnClass("var1", "VAR1", true)];
  }
  if (showColumns.var2) {
    columns = [...columns, new columnClass("var2", "VAR2", true)];
  }
  if (showColumns.var3) {
    columns = [...columns, new columnClass("var3", "VAR3", true)];
  }
  if (showColumns.var4) {
    columns = [...columns, new columnClass("var4", "VAR4", true)];
  }
  if (showColumns.var5) {
    columns = [...columns, new columnClass("var5", "VAR5", true)];
  }
  columns = [
    ...columns,
    {
      width: 75,
      align: "center",
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <a
              href="javascript:;"
              style={{ marginRight: 10 }}
              onClick={() => save(record)}
            >
              <SaveTwoTone />
            </a>
            <a
              href="javascript:;"
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
              href="javascript:;"
              disabled={editingKey !== ""}
              style={{ marginRight: 10 }}
              onClick={() => edit(record)}
            >
              <EditTwoTone />
            </a>
            <a
              href="javascript:;"
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
    if (col && !col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleForce = (data, fileInfo) => {
    try {
      let tName = fileInfo.name.trim().split(".").pop();
      new Promise(function (resolve, reject) {
        let gg = {
          var1: false,
          var2: false,
          var3: false,
          var4: false,
          var5: false,
        };
        if (tName === "csv" || tName === "txt") {
          // console.log(data);
          let newData = [];
          data.map((ii) => newData.push({ key: ii.var1, ...ii }));
          // console.log(newData, Object.keys(newData[0]));
          newData[0] &&
            Object.keys(newData[0]).map((iKey) => {
              // console.log(iKey,"sd")
              if (iKey !== "key") {
                // console.log(iKey, showColumns);
                gg = { ...gg, [iKey]: true };
              }
            });
          SetShowColumns(gg);
          // SetShowColumns({ ...columns, [`${newData[0]}`]: true });
          setDataSource([...newData, ...dataSource]);
          return resolve(newData);
        } else {
          message.error("Incorrect file type");
          return reject(false);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };
  const menu = (
    <Menu>
      {fetchSystem.length > 0 &&
        fetchSystem.map((ii) => {
          return (
            <Menu.Item>
              <a
                onClick={() => {
                  let gg = {
                    var1: false,
                    var2: false,
                    var3: false,
                    var4: false,
                    var5: false,
                  };
                  fetchSystemSp(CompCode, ii.fetchSP).then((res) => {
                    let newData = [];
                    res.map((ii) => newData.push({ key: ii.var1, ...ii }));
                    Object.keys(newData[0]).map((iKey) => {
                      // console.log(iKey,"sd")
                      if (iKey !== "key") {
                        // console.log(iKey, showColumns);
                        gg = { ...gg, [iKey]: true };
                      }
                    });
                    SetShowColumns(gg);
                    // SetShowColumns({ ...columns, [`${newData[0]}`]: true });
                    setDataSource([...newData]);
                  });
                }}
              >
                {ii.Title}
              </a>
            </Menu.Item>
          );
        })}
    </Menu>
  );

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
    delimitersToGuess: [",", "~"],
  };

  return (
    <>
      <div style={{ padding: "5px 0px" }}>
        <CSVReader
          ref={upload}
          accept
          cssClass="react-csv-input"
          onFileLoaded={handleForce}
          parserOptions={papaparseOptions}
          inputStyle={{ display: "none" }}
        />
        <div style={{ display: "flex" }}>
          <div>
            <Button
              // size="small"
              type="primary"
              onClick={() =>
                document.getElementById("react-csv-reader-input").click()
              }
              style={{ marginRight: 5 }}
            >
              Import CSV or Text File
            </Button>
          </div>
          <div style={{ flex: 1, textAlign: "end" }}>
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button icon={<UnorderedListOutlined />} />
            </Dropdown>
          </div>
        </div>
        {/* <Button size="small" type="primary">
          Import Text
        </Button> */}
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={dataSource}
          columns={mergedColumns}
          bordered={true}
          pagination={dataSource.length <= 10 ? false : 15}
          rowClassName="editable-row"
          scroll={{ x: 400 }}
        />
      </Form>
      <Button
        icon
        type="dashed"
        style={{ width: "100%", marginTop: 5, marginBottom: 0 }}
        disabled={editingKey !== ""}
        onClick={async () => {
          add();
        }}
      >
        New Row
      </Button>
    </>
  );
};

// export const SavedData = (EditedData) =>{
// const [EditedData,setEditedData]=useState([])

// }

export default NotificationPromoTable;
