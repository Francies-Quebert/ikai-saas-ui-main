import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Row, Table, Badge, Space, Input } from "antd";
import {
  PlusCircleOutlined,
  EditTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ColumnProperties from "../../../models/columnProperties";
import CustomDataTable from "../../common/CustomDataTable";
import { fetchBrandMaster } from "../../../store/actions/brandmaster";
import { fetchManufacturerMasters } from "../../../store/actions/manufactureMaster";
import { hasRight } from "../../../shared/utility";
// import BrandMasterCard from "./BrandMaster/BrandMasterCard";
import BrandMasterCard from "./BrandMaster/BrandMasterNew";
import Highlighter from "react-highlight-words";
import CardHeader from "../../common/CardHeader";

const BrandMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const brandMaster = useSelector((state) => state.brandMaster);
  const [editedData, setEditedData] = useState();
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    dispatch(fetchBrandMaster());
    dispatch(setFormCaption(45));
    dispatch(fetchManufacturerMasters());
  }, []);

  useEffect(() => {}, [brandMaster.brandMaster]);

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
      title: "Manufacturer Name",
      dataIndex: "MfrDesc",
      ...getColumnSearchProps("MfrDesc"),
    },
    {
      title: "Brand Code",
      dataIndex: "BrandCode",
      ...getColumnSearchProps("BrandCode"),
    },
    {
      title: "Brand Name",
      dataIndex: "BrandDesc",
      ...getColumnSearchProps("BrandDesc"),
    },
    {
      title: "Is Default",
      align: "center",
      width: "10%",
      dataIndex: "IsDefaultComponent",
      //   render: (value, record) => {
      //     return (
      //       <>
      //         {record.IsInventory ? (
      //           <Badge status="success" />
      //         ) : (
      //           <Badge status="error" />
      //         )}
      //       </>
      //     );
      //   },
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
  if (brandMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (brandMaster.error) {
    renderItem = <div>Error : brandmaster.error</div>;
  } else {
    renderItem = (
      <Fragment>
        {!editedData && <CardHeader title={currTran.formTitle} />}{" "}
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
                  dataSource={brandMaster.brandMaster}
                  pagination={
                    (brandMaster.brandMaster.length > 15 ? true : false,
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
            <BrandMasterCard
              entryMode={editedData.entryMode}
              onBackPress={() => setEditedData()}
              formData={editedData.formData}
              showUserCredentials={true}
              onSavePress={(val) => {
                if (val) {
                  dispatch(fetchBrandMaster());
                  dispatch(fetchManufacturerMasters());
                }
              }}
            />
          )}
          {/* {!editedData && brandMaster.brandMaster && (
            <CustomDataTable
              addDisabled={hasRight(currTran.moduleRights, "ADD")}
              disableEdit={hasRight(currTran.moduleRights, "EDIT")}
              columnProperties={columnProperties}
              myData={brandMaster.brandMaster}
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
  new ColumnProperties("MfrCode", false, "ManufacturerCode", true, 100),
  new ColumnProperties("MfrDesc", true, "Manufacturer Name", true, 180),
  new ColumnProperties("BrandCode", true, "Brand Code", true, 200),
  new ColumnProperties("BrandDesc", true, "Brand Desc", false),
  new ColumnProperties("IsDefault", false, "IsDefault", false, 100),
  new ColumnProperties("IsActive", false, "IsActive", false, 100),
  new ColumnProperties("IsDefaultComponent", true, "IsDefault", false, 100),
  new ColumnProperties("IsActiveComponent", true, "Status", false, 100),
];

export default BrandMasterPage;
