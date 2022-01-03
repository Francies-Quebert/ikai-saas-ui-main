import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Row, Table, Badge, Space, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  PlusCircleOutlined,
  EditTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import { fetchSubCategory } from "../../../store/actions/subCategoryMaster";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { fetchCategoryMasters } from "../../../store/actions/categoryMaster";
import { hasRight } from "../../../shared/utility";
// import SubMasterCategoryCard from "./SubCategoryMaster/SubMasterCategoryCard";
import SubMasterCategoryCard from "./SubCategoryMaster/SubCategoryCardNew";
import CardHeader from "../../common/CardHeader.js";
import Highlighter from "react-highlight-words";

const SubCategoryMaster = () => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const subCategory = useSelector((state) => state.subCategoryMaster);
  const currTran = useSelector((state) => state.currentTran);

  let renderItem = null;
  useEffect(() => {
    dispatch(setFormCaption(42));
    dispatch(fetchSubCategory());
    dispatch(fetchCategoryMasters());
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

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
      title: "Code",
      dataIndex: "SubCatCode",
      ...getColumnSearchProps("SubCatCode"),
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "SubCatDesc",
      ...getColumnSearchProps("SubCatDesc"),
    },
    {
      title: "Category",
      dataIndex: "CatDesc",
      align: "center",
      ...getColumnSearchProps("CatDesc"),
    },
    {
      title: "Image",
      align: "center",
      width: "8%",
      dataIndex: "Image",
    },
    {
      title: "Inventory Status",
      align: "center",
      width: "10%",
      render: (value, record) => {
        return (
          <>
            {record.IsInventory ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            )}
          </>
        );
      },
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

  if (subCategory.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (subCategory.error) {
    renderItem = <div>Error : {subCategory.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {!editedData && <CardHeader title={currTran.formTitle} />}
        <Card bodyStyle={{ padding: 5 }}>
          {!editedData && (
            <>
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
                  className="custom-pagination"
                  dataSource={subCategory.subCategoryMaster}
                  pagination={
                    (subCategory.subCategoryMaster.length > 15 ? true : false,
                    {
                      pageSize: 15,
                      size: "small",
                    })
                  }
                />
              </Row>
            </>
          )}
          {editedData && (
            <SubMasterCategoryCard
              entryMode={editedData.entryMode}
              onBackPress={() => {
                setEditedData();
              }}
              onSavePress={(data) => {
                if (data) {
                  dispatch(fetchSubCategory());
                }
              }}
              formData={editedData.formData}
            />
          )}
        </Card>
        {/* {!editedData && (
          <div>
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={columnProperties}
              myData={subCategory.subCategoryMaster}
              onAddClick={() => {
                setEditedData({ entryMode: "A" });
              }}
              onEditPress={(values) => {
                setEditedData({ entryMode: "E", formData: values });
              }}
              pageDefaultSize={15}
            />
          </div>
        )} */}
      </Fragment>
    );
  }
  return renderItem;
};

export default SubCategoryMaster;
