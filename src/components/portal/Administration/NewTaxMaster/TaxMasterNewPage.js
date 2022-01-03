import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  EditTwoTone,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Badge, Button, Card, Col, Input, Row, Space, Table } from "antd";
import { hasRight } from "../../../../shared/utility";
import CardHeader from "../../../common/CardHeader";
import TaxMasterNewCard from "./components/TaxMasterNewCard";
import { setFormCaption } from "../../../../store/actions/currentTran";
import { fetchTaxMasterData } from "../../../../services/taxMaster";
import Highlighter from "react-highlight-words";

const TaxMasterNewPage = () => {
  const dispatch = useDispatch();

  //useState
  const [taxData, setTaxData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [AEData, setAEData] = useState();
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
    dispatch(setFormCaption(43));
    fetchTaxData();
  }, []);

  //fecthData
  const fetchTaxData = () => {
    fetchTaxMasterData(CompCode)
      .then((res) => {
        // console.log(res,'hh')
        if (res.length > 0) {
          setTaxData(res);
        } else {
          setTaxData([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // search table

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

  //Tax Columns

  const columns = [
    {
      title: "Tax Code",
      dataIndex: "TaxCode",
      ...getColumnSearchProps("TaxCode"),
      width: "5%",
      align: "center",
    },
    {
      title: "Tax Name",
      dataIndex: "TaxName",
      width: "15%",
      align: "center",
      ...getColumnSearchProps("TaxName"),
    },
    {
      title: "Tax Type",
      dataIndex: "TaxType",
      width: "5%",
      align: "center",
    },
    {
      title: "Tran Type",
      dataIndex: "TranType",
      width: "4%",
      align: "center",
    },
    {
      title: "Tax %",
      dataIndex: "TaxPer",
      width: "4%",
      align: "center",
    },
    // {
    //   title: "IGST %",
    //   dataIndex: "IGSTPer",
    //   width: "5%",
    //   align: "center",
    // },
    // {
    //   title: "CGST %",
    //   dataIndex: "CGSTPer",
    //   width: "5%",
    //   align: "center",
    // },
    // {
    //   title: "SGST %",
    //   dataIndex: "SGSTPer",
    //   width: "5%",
    //   align: "center",
    // },
    // {
    //   title: "UTST %",
    //   dataIndex: "UTSTPer",
    //   width: "5%",
    //   align: "center",
    // },
    // {
    //   title: "CESS %",
    //   dataIndex: "CESSPer",
    //   width: "5%",
    //   align: "center",
    // },
    // {
    //   title: "SURCHARG %",
    //   dataIndex: "SURCHARGPer",
    //   width: "5%",
    //   align: "center",
    // },
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
                dataSource={taxData.length > 0 ? taxData : null}
                pagination={false}
              />
            </Row>
          </>
        </Card>
      )}
      {AEData && (
        <>
          <Col span={12}>
            <TaxMasterNewCard
              onBackPress={() => setAEData()}
              formData={AEData.formData}
              entryMode={AEData.entryMode}
              onSavePress={(val) => {
                setIsLoading(true);
                fetchTaxData();
              }}
            />
          </Col>
        </>
      )}
    </>
  );
};

export default TaxMasterNewPage;
