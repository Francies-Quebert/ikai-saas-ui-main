import React, { Fragment, useEffect, useState } from "react";
import ManufacturerMasterCard from "./ManufactureMaster/ManufacturerMasterCard";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import { fetchManufacturerMasters } from "../../../store/actions/manufactureMaster";
import { toast } from "react-toastify";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { Button, Card, Row, Table, Badge, Space, Input, Col } from "antd";
import {
  PlusCircleOutlined,
  EditTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import { hasRight } from "../../../shared/utility";
import Highlighter from "react-highlight-words";
import CardHeader from "../../common/CardHeader";

const ManufacturerMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const manufacturermaster = useSelector((state) => state.manufacturermaster);
  const [editedData, setEditedData] = useState();
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    dispatch(setFormCaption(44));
    dispatch(fetchManufacturerMasters());
  }, []);

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  useEffect(() => {}, [manufacturermaster.manufacturerMasters]);

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
      title: "Manufacturer Code",
      dataIndex: "MfrCode",
      ...getColumnSearchProps("MfrCode"),
      align: "center",
      width: 250,
    },
    {
      title: "Manufacturer  Name",
      dataIndex: "MfrDesc",
      ...getColumnSearchProps("MfrDesc"),
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

  let renderItem = null;
  if (manufacturermaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (manufacturermaster.error) {
    renderItem = <div>Error : {manufacturermaster.error}</div>;
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
                  dataSource={manufacturermaster.manufacturerMasters}
                  pagination={
                    (manufacturermaster.manufacturerMasters.length > 15
                      ? true
                      : false,
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
            <Col flex={0.37}>
              <ManufacturerMasterCard
                entryMode={editedData.entryMode}
                onBackPress={() => setEditedData()}
                formData={editedData.formData}
                onSavePress={(val) => {
                  if (val) {
                    dispatch(fetchManufacturerMasters());
                  }
                }}
              />
            </Col>
          )}

          {/* {!editedData && manufacturermaster.manufacturerMasters && (
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={columnProperties}
              myData={manufacturermaster.manufacturerMasters}
              onAddClick={() => {
                setEditedData({ entryMode: "A" });
              }}
              onEditPress={(values) => {
                setEditedData({ entryMode: "E", formData: values });
              }}
              pageDefaultSize={15}
            />
          )} */}
        </Card>
      </Fragment>
    );
  }
  return renderItem;
};

export const columnProperties = [
  new ColumnProperties("MfrCode", true, "Manufacturer Code", false, 180),
  new ColumnProperties("MfrDesc", true, "Manufacturer Description", true),
  new ColumnProperties("IsActive", false, "Active Status", false, 50),
  new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
];

export default ManufacturerMasterPage;
