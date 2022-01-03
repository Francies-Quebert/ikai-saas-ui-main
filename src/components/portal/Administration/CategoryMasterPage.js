import React, { Fragment, useEffect, useState } from "react";
import CategoryMasterCard from "./CategoryMaster/CategoryMasterCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategoryMasters } from "../../../store/actions/categoryMaster";
import { toast } from "react-toastify";
// import AntDataTable from "../../common/AntDataTable";
// import ColumnPropertiesAnt from "../../../models/columnPropertiesAnt.js";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { Button, Badge, Avatar, Table, Card, Input, Space, Row } from "antd";
import {
  EditTwoTone,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { hasRight } from "../../../shared/utility";
import CardHeader from "../../common/CardHeader";
import Highlighter from "react-highlight-words";

const CategoryMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const categorymaster = useSelector((state) => state.categoryMaster);
  const [editedData, setEditedData] = useState();
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    dispatch(setFormCaption(41));
    dispatch(fetchCategoryMasters());
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {}, [categorymaster.categoryMasters]);

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

  // const columns = [
  //   new ColumnPropertiesAnt("CatCode", "Category Code", false, true, 150),
  //   new ColumnPropertiesAnt("CatDesc", "Category Desc", true, true, 180),
  //   new ColumnPropertiesAnt(
  //     "CatDetailDesc",
  //     "Category Detail Desc",
  //     false,
  //     true
  //   ),
  //   {
  //     title: "Image Url",
  //     dataIndex: "ImageUrl",
  //     render: (text, record) =>
  //       record.ImageUrl.length > 0 ? (
  //         <Avatar shape="square" size="small" src={record.ImageUrl} />
  //       ) : (
  //         <Avatar shape="square" size="small" icon={<UserOutlined />} />
  //       ),
  //     align: "center",
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "IsActive",
  //     render: (text, record) =>
  //       //   <Popconfirm title="Sure to Edit?">
  //       record.IsActive === true ? (
  //         <Badge status="success" />
  //       ) : (
  //         <Badge status="error" />
  //       ),
  //     //   </Popconfirm>
  //     align: "center",
  //   },
  //   {
  //     title: "Action",
  //     dataIndex: "edit",
  //     render: (text, record) => (
  //       <a disabled={hasRight(currTran.moduleRights, "EDIT")} href="#">
  //         <i
  //           className="fa fa-pencil"
  //           style={{
  //             width: 35,
  //             fontSize: 16,
  //             padding: 11,
  //             color: "rgb(40, 167, 69)",
  //           }}
  //           onClick={() => {
  //             setEditedData({ entryMode: "E", formData: record });
  //           }}
  //         ></i>
  //       </a>
  //     ),
  //     align: "center",
  //   },
  // ];

  let renderItem = null;

  const columns = [
    {
      title: "Code",
      dataIndex: "CatCode",
      ...getColumnSearchProps("CatCode"),
      align: "center",
    },
    {
      title: "Category Name",
      dataIndex: "CatDesc",
      ...getColumnSearchProps("CatDesc"),
    },
    {
      title: "Image",
      align: "center",
      width: "8%",
      dataIndex: "ImageUrlComponent",
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

  if (categorymaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (categorymaster.error) {
    renderItem = <div>Error : {categorymaster.error}</div>;
  } else {
    renderItem = (
      <Fragment>
        {!editedData && <CardHeader title={currTran.formTitle} />}
        <Card bodyStyle={{ padding: 5 }}>
          {editedData && (
            <CategoryMasterCard
              entryMode={editedData.entryMode}
              onBackPress={() => setEditedData()}
              formData={editedData.formData}
              onSavePress={(val) => {
                if (val) {
                  dispatch(fetchCategoryMasters());
                }
              }}
            />
          )}
          {!editedData && categorymaster.categoryMasters && (
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
                  dataSource={categorymaster.categoryMasters}
                  pagination={
                    (categorymaster.categoryMasters.length > 15 ? true : false,
                    {
                      pageSize: 15,
                      size: "small",
                    })
                  }
                />
              </Row>
            </>
            // <CustomDataTable
            //   addDisabled={hasRight(currTran.moduleRights, "ADD")}
            //   disableEdit={hasRight(currTran.moduleRights, "EDIT")}
            //   columnProperties={columnProperties}
            //   myData={categorymaster.categoryMasters}
            //   onAddClick={() => {
            //     setEditedData({ entryMode: "A" });
            //   }}
            //   onEditPress={(values) => {
            //     setEditedData({ entryMode: "E", formData: values });
            //   }}
            //   pageDefaultSize={15}
            // />
          )}
        </Card>
      </Fragment>
    );
  }

  return renderItem;
};

export const columnProperties = [
  new ColumnProperties("CatCode", true, "Category Code", false, 180),
  new ColumnProperties("CatDesc", true, "Category Desc", true, 200),
  new ColumnProperties("CatDetailDesc", true, "Category Detail Desc", true),
  new ColumnProperties("ImageUrl", false, "Image", true),
  new ColumnProperties("pathType", false, "pathType", false, 0),
  new ColumnProperties("IsActive", false, "Active Status", false, 50),
  new ColumnProperties("ImageUrlComponent", true, "Image ", false, 150),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export default CategoryMasterPage;
