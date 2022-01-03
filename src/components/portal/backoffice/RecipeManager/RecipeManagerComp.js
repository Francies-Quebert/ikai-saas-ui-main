import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Spin,
  Row,
  Col,
  Card,
  Select,
  Menu,
  Tabs,
  Empty,
  message,
  Table,
} from "antd";

const RecipeManagerComp = (props) => {
  let columns = [
    {
      title: "Item Code",
      dataIndex: "ItemCode",
      align: "center",
      width: "98px",
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      align: "center",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      align: "center",
      width: "110px",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      align: "center",
      width: "173px",
    },
  ];
  let Data = [];
  return (
    <>
      <Table
        style={{ padding: "4px" }}
        dataSource={props.data}
        columns={columns}
        bordered={true}
        pagination={false}
      />
    </>
  );
  
};

export default RecipeManagerComp;
