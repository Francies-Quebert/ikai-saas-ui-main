import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Col,
  Card,
  Row,
  Select,
  Button,
  Divider,
  Table,
  message,
  Input,
  Space,
  Modal,
  Descriptions,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  RetweetOutlined,
  PlusOutlined,
  RollbackOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { fetchBranchMaster } from "../../../../store/actions/branchmaster";
import { fetchDataPartyOutstandingSummary } from "../../../../services/party-outstanding";
import {
  fetchInvGetDataStockValuationDetail,
  fetchInvGetDataStockValuationSummary,
} from "../../../../services/stock-summary";
import { setFormCaption } from "../../../../store/actions/currentTran";
import CardHeader from "../../../common/CardHeader";
import Highlighter from "react-highlight-words";
import PartySKURateMappingComponent from "./PartySKURateMappingComponent";

const PartySKURateMappinPage = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const refAdd = useRef();
  const currentTran = useSelector((state) => state.currentTran);
  const branchMaster = useSelector((state) => state.branchMaster.branchMaster);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [stockInputParam, setStockInputParam] = useState({
    CompCode: CompCode,
    BranchCode: null,
  });
  const [stockSummaryItemsData, setStockSummaryItemsData] = useState([]);
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const [party, setParty] = useState(null);
  const [partyType, setPartyType] = useState("A");
  const [helpRef, setHelpRef] = useState([]);
  const [outStandingSummary, setOutStandingSummary] = useState([]);

  useEffect(() => {
    dispatch(setFormCaption(108));
    dispatch(fetchBranchMaster());
    fetchInvGetDataStockValuationSummary(CompCode, "ANDHERI").then((res) => {
      setStockSummaryItemsData(res);
    });
  }, []);

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

  const fnDefault = () => {
    try {
      fetchDataPartyOutstandingSummary(CompCode, party).then((res) => {
        if (res.length > 0) {
          setOutStandingSummary(res);
        } else {
          setOutStandingSummary([]);
        }
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
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
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
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

  const itemColums = [
    {
      title: "Sr. No",
      width: 100,
    },
    {
      title: "Item Code",
      dataIndex: "ItemCode",
      width: 100,
      ...getColumnSearchProps("ItemCode"),
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      width: 0,
      ...getColumnSearchProps("ItemName"),
    },
    { title: "Sales Price", dataIndex: "SalesPrice", width: 120 },
    { title: "MRP", dataIndex: "MRP", width: 120 },
    { title: "Action", key: "operation", width: 100 },
  ];
  const border = { border: "1px solid #f0f0f0" };

  return (
    <>
      <Col>
        <CardHeader title={currentTran.formTitle} />{" "}
        <Card bodyStyle={{ padding: "7px 5px" }}>
          <Row className="stock-summary-card">
            <label style={{ margin: 6 }}>Branch:</label>
            <Select
              className="stock-summary-select-input"
              allowClear={true}
              showSearch
              style={{ width: 250, marginRight: 5 }}
              placeholder="Select Branch"
              value={stockInputParam.branch}
              onChange={(val) => {
                setStockInputParam({ ...stockInputParam, BranchCode: val });
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {branchMaster.length > 0 &&
                branchMaster
                  .filter((i) => i.IsActive)
                  .map((i) => {
                    return (
                      <Option key={i.BranchCode} value={i.BranchCode}>
                        {i.BranchName}
                      </Option>
                    );
                  })}
            </Select>
            <label style={{ margin: 6 }}>Party:</label>
            <Select
              allowClear
              showSearch
              value={party}
              placeholder="Select Party"
              className="custom-party-outstanding-select-input"
              style={{ width: 250, marginRight: 5 }}
              onChange={(value) => {
                setParty(value);
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {helpRef.length > 0 &&
                helpRef
                  .filter((i) => partyType === "A" || i.UserType === partyType)
                  .map((item) => {
                    return (
                      <Select.Option key={item.RefId} value={item.RefId}>
                        {`${item.RefName} ${
                          item.AddInfo !== null ? `(${item.AddInfo})` : ""
                        }`}
                      </Select.Option>
                    );
                  })}
              <Select.Option key={"ALL"} value={null}></Select.Option>
            </Select>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              style={{ marginRight: 5 }}
              onClick={() => {
                if (_.includes([""], party)) {
                  message.error("Please Select Party");
                } else {
                  fnDefault();
                }
                if (_.includes([null], stockInputParam.BranchCode)) {
                  message.error("Please Select Inputs");
                } else {
                  // fnDefault();
                  fetchInvGetDataStockValuationSummary(
                    CompCode,
                    stockInputParam.BranchCode
                  ).then((res) => {
                    setStockSummaryItemsData(res);
                  });
                }
              }}
            >
              Show
            </Button>

            <Button
              icon={<RetweetOutlined />}
              type="primary"
              style={{ marginRight: 5 }}
            >
              Reset
            </Button>
          </Row>
          <Divider
            type="horizontal"
            style={{ marginBottom: 5, marginTop: 5 }}
          />
          <Table
            bordered
            showHeader={true}
            loading={isLoading}
            pagination={false}
            dataSource={null}
            columns={itemColums}
            expandable={{
              expandedRowRender: (record) => {
                return (
                  <>
                    <Descriptions
                      column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 1 }}
                      style={{ backgroundColor: "#fff" }}
                      size="small"
                      bordered
                    >
                      <Descriptions.Item
                        style={border}
                        label="Item Desc"
                        span={4}
                      >
                        {record.ItemDesc}
                      </Descriptions.Item>
                      <Descriptions.Item
                        style={border}
                        label="Manufacturer"
                        span={1}
                      >
                        {record.MfrCode} ({record.MfrDesc})
                      </Descriptions.Item>
                      <Descriptions.Item
                        style={border}
                        label="SubCategory"
                        span={1}
                      >
                        {record.SubCategoryCode} ({record.SubCatDesc})
                      </Descriptions.Item>
                      <Descriptions.Item style={border} label="Class" span={1}>
                        {record.classCode} ({record.ClassName})
                      </Descriptions.Item>
                      <Descriptions.Item
                        style={border}
                        label="UnitCode"
                        span={1}
                      >
                        {record.UnitCode} ({record.UnitDesc})
                      </Descriptions.Item>
                      <Descriptions.Item style={border} label="Image">
                        {record.URL ? (
                          <Avatar shape="square" size={64} src={record.URL} />
                        ) : (
                          <Avatar
                            shape="square"
                            size={64}
                            icon={<UserOutlined />}
                          />
                        )}
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                );
              },
            }}
          />
          <Row>
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={() => {
                setModal(true);
              }}
            >
              Add New Item
            </Button>
            {modal && (
              <Modal
                visible={modal}
                footer={false}
                bodyStyle={{ padding: "10px 10px" }}
                destroyOnClose={true}
                onCancel={() => {
                  setModal(false);
                }}
                width={"70%"}
              >
                <PartySKURateMappingComponent
                  onBackPress={() => {
                    setModal(false);
                  }}
                  onFinish={() => {
                    setModal(false);
                    // message.success(
                    //   "Data saved Successfully, To See Changes Reload the Page",
                    //   10
                    // );
                  }}
                />
              </Modal>
            )}
          </Row>
          <Row style={{ padding: 5 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
            >
              Save
            </Button>
            <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              icon={<RollbackOutlined />}
              style={{ marginRight: 5 }}
            >
              Back
            </Button>
          </Row>
        </Card>
      </Col>
    </>
  );
};

export default PartySKURateMappinPage;
