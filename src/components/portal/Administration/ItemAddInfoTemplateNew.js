import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Row, Table, Badge, Space, Input } from "antd";
import { setFormCaption } from "../../../store/actions/currentTran";
import { fetchItemAddInfoTemplHdr } from "../../../store/actions/ItemAddInfoTemplate";
import ItemAddInfoCardNew from "./ItemAddInfoTemplate/ItemAddInfoCardNew";
import { hasRight } from "../../../shared/utility";
import Highlighter from "react-highlight-words";
import { useSelector, useDispatch } from "react-redux";
import {
  SearchOutlined,
  EditTwoTone,
  PlusCircleOutlined,
} from "@ant-design/icons";

const ItemAddInfoTemplateNew = () => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const currTran = useSelector((state) => state.currentTran);
  const itemAddInfoTmplHdr = useSelector((state) => state.itemAddInfoTemplate);

  useEffect(() => {
    dispatch(setFormCaption(52));
    dispatch(fetchItemAddInfoTemplHdr());
  }, []);

  useEffect(() => {
  }, [itemAddInfoTmplHdr.itemAddInfoTmplHdr]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchedData({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchedData({ searchText: "" });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchedData.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(
          () =>
            searchedData.searchInput ? searchedData.searchInput.select() : null,
          100
        );
      }
    },
    render: (text) =>
      searchedData.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: process.env.REACT_APP_PRIMARY_COLOR,
            padding: 0,
          }}
          searchWords={[searchedData.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Template Id",
      dataIndex: "TempId",
      width: 150,
      ...getColumnSearchProps("TempId"),
    },
    {
      title: "Template Name",
      dataIndex: "TemplateName",
      ...getColumnSearchProps("TemplateName"),
    },
    {
      title: "Status",
      align: "center",
      width: "5%",
      render: (value, record) => {
        return (
          <>
            {record.IsActive ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            )}
          </>
        );
      },
    },
    {
      title: "",
      align: "center",
      width: "5%",
      render: (value, record) => {
        return (
          <>
            <a
              href="#"
              className={`edit-btn ${
                hasRight(currTran.moduleRights, "EDIT")
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={hasRight(currTran.moduleRights, "EDIT")}
              style={{ marginRight: 10 }}
            >
              <span
                onClick={() => {
                  setEditedData({ entryMode: "E", formData: record });
                }}
              >
                <EditTwoTone />
              </span>
            </a>
          </>
        );
      },
    },
  ];
  return (
    <>
      {!editedData && (
        <>
          <Card bodyStyle={{ padding: 5 }}>
            <Row style={{ marginBottom: 5 }}>
              <Button
                style={{ marginRight: 10 }}
                type="primary"
                name="add"
                onClick={() => {
                  setEditedData({ entryMode: "A" });
                }}
                icon={<PlusCircleOutlined />}
                disabled={hasRight(currTran.moduleRights, "ADD")}
              >
                Add
              </Button>
            </Row>
            <Row>
              <Table
                bordered
                style={{ flex: 1 }}
                columns={columns}
                key={"TempId"}
                className="custom-pagination"
                dataSource={itemAddInfoTmplHdr.itemAddInfoTmplHdr}
                pagination={
                  itemAddInfoTmplHdr.itemAddInfoTmplHdr.length > 25
                    ? {
                        pageSize: 20,
                        size: "small",
                      }
                    : false
                }
              />
            </Row>
          </Card>
        </>
      )}
      {editedData && (
        <ItemAddInfoCardNew
          onBackPress={() => setEditedData()}
          formData={editedData.formData}
          entryMode={editedData.entryMode}
          onSavePress={(val) => {
            if (val) {
              dispatch(fetchItemAddInfoTemplHdr());
            }
          }}
        />
      )}
    </>
  );
};

export default ItemAddInfoTemplateNew;
