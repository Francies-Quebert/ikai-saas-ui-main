import React, { useEffect, useState } from "react";
import { Divider, Table, Button } from "antd";
import { useSelector } from "react-redux";
import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";

const FieldFilterSelectComponent = (props) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [isSelected, setIsSelected] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // setData(props.data);
    if (props.data.length > 0) {
      setIsLoading(true);
      setData(props.data);
    } else {
      setData([]);
    }
    setIsLoading(false);
  }, [props.data]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (props.selectType === "checkbox") {
        setSelectedItem([...selectedRows]);
      } else {
        setSelectedItem(...selectedRows);
      }
      setIsSelected(false);
    },
  };

  const columns = [
    {
      title: "Field Type",
      dataIndex: "FieldType",
      align: "center",
      width: 150,
    },
    {
      title: "Field Title",
      dataIndex: "FieldTitle",
    },
  ];
  return (
    <>
      <div
        style={{
          padding: "6px 15px 5px 15px",
          borderBottom: "1px solid #cecece",
        }}
      >
        <span style={{ fontWeight: "600", fontSize: 16 }}>Filter Type</span>
      </div>
      <Table
        loading={isLoading}
        dataSource={data}
        columns={columns}
        bordered={true}
        rowSelection={{
          type: props.selectType,
          ...rowSelection,
        }}
        rowKey={"key"}
        pagination={false}
      />
      <Divider style={{ marginBottom: 5, marginTop: 5 }} />
      <Button
        type="primary"
        style={{ flex: 1, margin: "3px 3px" }}
        icon={<SaveOutlined />}
        disabled={isSelected}
        onClick={() => {
          props.onSetClick(selectedItem ? selectedItem : null);
        }}
      >
        <span style={{ fontWeight: "600" }}>Set</span>
      </Button>
      <Button
        type="ghost"
        style={{ flex: 1, margin: "3px 3px" }}
        icon={<RollbackOutlined />}
        onClick={() => {
          props.onBackPress();
        }}
      >
        <span style={{ fontWeight: "600" }}>Back</span>
      </Button>
    </>
  );
};

export default FieldFilterSelectComponent;
