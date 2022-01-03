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
  Checkbox,
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

const SerSlotLocTable = (props) => {
//   const [form] = Form.useForm();
//   const [editingKey, setEditingKey] = useState("");
//   const [key, setKey] = useState(1);
//   const isEditing = (record) => record.key === editingKey;
//   const [Data, setData] = useState(props.Data);
//   const [typeAE, setTypeAE] = useState(
//     props.data ? props.data.length : 1
//   );



//   useEffect(() => {
//     setData(props.data);
//     setKey(
//       props.data && props.data.length > 0
//         ? props.data[props.data.length - 1].key + 1
//         : 1
//     );
//     // dispatch(setSelectedServiceRateMap(props.data));
//   }, [props.data]);

  let columns = [
    {
      title: "",
      dataIndex: "IsMapped",
      width: 50,
      render: (text, record) => {
        return (
          <Checkbox
          defaultValue={record.IsMapped}
            onChange={(e) => {
              record.IsMapped = e.target.checked;
              record.IsDirty = true;
            }}
          />
        );
      },
    },
    {
      title: "Slot Name",
      dataIndex: "SlotName",
      width: 200,
    },
    {
      title: "Slot Start Time",
      dataIndex: "starttime",
      width: 200,
    },
  ];
 

  return (
    <>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={props.Data}
          columns={columns}
        //   columns={mergedColumns}
          bordered={true}
          pagination={false}
          rowClassName="editable-row"
        />
    </>
  );
};

export default SerSlotLocTable;
