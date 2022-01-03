import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Table,
  Input,
  Descriptions,
  Avatar,
} from "antd";
import {
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getInvItemMasterData } from "../../../services/opening-stock";
import Highlighter from "react-highlight-words";
import moment from "moment";

const SearchAllInwardSeq = (props) => {
  const [selectedItem, setSelectedItem] = useState();
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );

  useEffect(() => {
    if (props.data) {
      setItemsData(props.data);
    }
  }, [props.data]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKey(selectedRowKeys);
      setSelectedItem(...selectedRows);
      setIsSelected(false);
    },
  };

  useEffect(() => {
    if (itemsData.length > 0) {
      setSelectedRowKey(
        itemsData.length > 0
          ? [
              props.record.InwardSeq !== null
                ? props.record.InwardSeq.InwardSeq
                : itemsData[0].InwardSeq,
            ]
          : []
      );
      setSelectedItem(
        itemsData.length > 0
          ? props.record.InwardSeq !== null
            ? itemsData.find(
                (ii) => ii.InwardSeq === props.record.InwardSeq.InwardSeq
              )
            : itemsData[0]
          : undefined
      );
      setIsSelected(false);
    }
  }, [itemsData]);
  const columns = [
    {
      title: "Inward Source",
      dataIndex: "InwardSourceDesc",
      align: "center",
      width: 120,
    },
    {
      title: "Inward Seq",
      dataIndex: "InwardSeq",
      align: "center",
      width: 100,
    },
    {
      title: "Current Stock",
      dataIndex: "CurrentStock",
      align: "right",
      width: 150,
    },
    {
      title: "Tran Date",
      dataIndex: "TranDate",
      align: "center",
      render: (text) => {
        return <>{moment(text).format("DD-MM-YYYY")}</>;
      },
      width: 130,
    },
    {
      title: "Cost",
      dataIndex: "Cost",
      align: "right",
      width: 80,
    },
    {
      title: "Sale",
      dataIndex: "Sale",
      align: "right",
      width: 80,
    },
    {
      title: "M.R.P",
      dataIndex: "MRP",
      align: "right",
      width: 80,
    },
  ];
  const border = { border: "1px solid #f0f0f0" };

  return (
    <>
      <Row>
        <Col flex={1}>
          <Table
            rowKey="InwardSeq"
            loading={loading}
            bordered
            columns={columns}
            rowSelection={{
              type: "radio",
              ...rowSelection,
              selectedRowKeys: selectedRowKey,
            }}
            // className="adjustmentTable"
            dataSource={itemsData}
            pagination={false}
          />
          <Divider
            type="horizontal"
            style={{ marginBottom: 5, marginTop: 5 }}
          />
          <Row style={{ display: "flex" }}>
            <Col span={24}>
              <Button
                icon={<SaveOutlined />}
                style={{ marginRight: 5 }}
                disabled={isSelected}
                type="primary"
                onClick={() => {
                  props.onItemSelect(selectedItem ? selectedItem : null);
                }}
              >
                Set
              </Button>
              <Button
                icon={<RollbackOutlined />}
                type="primary"
                onClick={() => {
                  props.onBackPress();
                }}
              >
                Back
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default SearchAllInwardSeq;
