import React, { useEffect, useState } from "react";
import { fetchTableMasterData } from "../../../../services/table-master";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../../../store/actions/currentTran";
import { Badge, Button, Card, Input, Row, Space, Table } from "antd";
import CardHeader from "../../../common/CardHeader";
import { hasRight } from "../../../../shared/utility";
import {
  EditTwoTone,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import TableMasterNewCard from "./Components/TableMasterNewCard";
import { fetchSectionMaster } from "../../../../services/section-master";

const TableMasterNewPage = () => {
  const dispatch = useDispatch();

  //useStates
  const [tablesData, setTablesData] = useState([]);
  const [secData, setSecData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [AEData, setAEData] = useState();
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });

  //useSelectors
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currTran = useSelector((state) => state.currentTran);

  //useEffects
  useEffect(() => {
    setIsLoading(true);
    dispatch(setFormCaption(54));
    fetchSectionMaster(CompCode).then((res) => setSecData(res));
    fecthTableData();
    // console.log(isLoading ,"dd")
  }, []);

  //fecthData
  const fecthTableData = async () => {
    fetchTableMasterData(CompCode)
      .then((res) => {
        console.log(res, "data");
        if (res.length > 0) {
          setTablesData(res);
        } else {
          setTablesData([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //Table Search
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
  //Table Coloums

  const columns = [
    {
      title: "Table Code",
      dataIndex: "ShortCode",
      ...getColumnSearchProps("ShortCode"),
      width: "5%",
      align: "center",
    },
    {
      title: "Table Name",
      dataIndex: "TableName",
      ...getColumnSearchProps("TableName"),
      width: "15%",
      align: "center",
    },
    {
      title: "Section",
      dataIndex: "SecCode",
      width: "10%",
      align: "center",
    },
    {
      title: "Sitting Capacity",
      dataIndex: "SittingCapacity",
      width: "5%",
      align: "center",
    },
    {
      title: "Status",
      align: "center",
      width: "3%",
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
      title: "Action",
      align: "center",
      width: "3%",

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
                  setAEData({ entryMode: "E", formData: record });
                  // console.log(formData,record,"gg")
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
      {!AEData && <CardHeader title={currTran.formTitle} />}
      {!AEData && (
        <Card bodyStyle={{ padding: 5 }}>
          <>
            <Row style={{ marginBottom: 5 }}>
              <Button
                loading={isLoading}
                style={{ marginRight: 10 }}
                type="primary"
                name="add"
                onClick={() => {
                  setAEData({ entryMode: "A" });
                }}
                icon={<PlusCircleOutlined />}
                // disabled={hasRight(currTran.moduleRights, "ADD")}
              >
                Add
              </Button>
            </Row>
            <Row>
              <Table
                loading={isLoading}
                bordered
                style={{ flex: 1 }}
                columns={columns}
                className="custom-pagination"
                dataSource={tablesData.length > 0 ? tablesData : null}
                pagination={false}
              />
            </Row>
          </>
        </Card>
      )}
      {AEData && (
        <>
          <TableMasterNewCard
            onBackPress={() => setAEData()}
            formData={AEData.formData}
            entryMode={AEData.entryMode}
            onSavePress={(val) => {
              setIsLoading(true);
              fecthTableData();
            }}
          />
        </>
      )}
    </>
  );
};

export default TableMasterNewPage;
