import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HsnsacMasterCardNew from "./components/HsnsacMasterCardNew";
import {
  EditTwoTone,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { setFormCaption } from "../../../../store/actions/currentTran";
import CardHeader from "../../../common/CardHeader";
import { Badge, Button, Card, Input, Row, Space, Table ,Col} from "antd";
import { fetchTaxMasterData } from "../../../../services/taxMaster";
import { fetchHsnsacMasterData } from "../../../../services/hsnsac";
import { hasRight } from "../../../../shared/utility";
import Highlighter from "react-highlight-words";

const HsnsacMasterPageNew = () => {
  const dispatch = useDispatch();

  //useState
  const [HsnData, setHsnData] = useState([]);
  const [TaxData, setTaxData] = useState([]);
  const [AEData, setAEData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });

  //useSelector
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currTran = useSelector((state) => state.currentTran);

  //useEffect
  useEffect(() => {
    setIsLoading(true);
    dispatch(setFormCaption(46));
    fetchTaxMasterData(CompCode).then((res) => setTaxData(res));
    fetchHsnData();
  }, []);

  // fetch data
  const fetchHsnData = async () => {
    fetchHsnsacMasterData(CompCode)
      .then((res) => {
        if (res.length > 0) {
          setHsnData(res);
        } else {
          setHsnData([]);
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

  //table column

  const columns = [
    {
      title: "HSN SAC Code",
      dataIndex: "hsnsaccode",
      ...getColumnSearchProps("hsnsaccode"),
      width: "3%",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "hsnsacdesc",
      width: "15%",
      align: "center",
      ...getColumnSearchProps("hsnsacdesc"),
    },
    {
      title: "Default Tax",
      dataIndex: "DefTaxCode",
      align: "center",
      width: "3%",
    },
    {
      title: "Status",
      width: "3%",
      align: "center",
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
      width: "3%",
      align: "center",
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
                dataSource={HsnData.length > 0 ? HsnData : null}
                pagination={false}
              />
            </Row>
          </>
        </Card>
      )}
      <>
        {AEData && (
          <Col span={12}>
            <HsnsacMasterCardNew
              onBackPress={() => setAEData()}
              formData={AEData.formData}
              entryMode={AEData.entryMode}
              onSavePress={(val) => {
                setIsLoading(true);
                fetchHsnData();
              }}
            />
          </Col>
        )}
      </>
    </>
  );
};

export default HsnsacMasterPageNew;
