import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
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
  Avatar,
  Descriptions,
  Tooltip,
  Typography,
  DatePicker,
  Checkbox,
  Empty,
} from "antd";
import CardHeader from "../../common/CardHeader";
import {
  SearchOutlined,
  RetweetOutlined,
  UserOutlined,
  RightCircleOutlined,
  SnippetsFilled,
  SnippetsOutlined,
} from "@ant-design/icons";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import _ from "lodash";
import moment from "moment";
import {
  fetchInvGetDataStockValuationDetail,
  fetchInvGetDataStockValuationSummary,
} from "../../../services/stock-summary";
import Highlighter from "react-highlight-words";
import StockInwardSeqWiseViewComponent from "./StockSummary/StockInwardSeqWiseViewComponent";
import ReportsMain from "../Reports/ReportsMain";
import Modal from "antd/lib/modal/Modal";

const StockSummaryPage = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const { Text } = Typography;
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currentTran = useSelector((state) => state.currentTran);
  const branchMaster = useSelector((state) => state.branchMaster.branchMaster);
  const [isLoading, setIsloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showZeroStocks, setShowZeroStocks] = useState(false);
  const [stockInputParam, setStockInputParam] = useState({
    CompCode: CompCode,
    BranchCode: null,
    AsOfDate: moment(),
  });
  const [stockSummaryItemsData, setStockSummaryItemsData] = useState([]);
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const l_Currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const l_ConfigStockSummaryValueDivisibleByN = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "ZBN_SS")
  );

  const [itemsStockDtlData, setItemsStockDtlData] = useState();
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    dispatch(setFormCaption(107));
    dispatch(fetchBranchMaster());
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

  const itemColumns = [
    {
      title: "Item Code",
      dataIndex: "ItemCode",
      ...getColumnSearchProps("ItemCode"),
      width: 100,
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      ...getColumnSearchProps("ItemName"),
      ellipsis: true,
    },
    {
      title: "Unit",
      dataIndex: "UnitDesc",
      width: 60,
      ellipsis: true,
    },
    {
      title: "Curr. Stock",
      dataIndex: "CurrStockQty",
      width: 100,
      align: "right",
      render: (txt, record) => {
        return (
          <span
            style={{
              fontWeight: 500,
              color: `${
                parseFloat(record.CurrStockQty).toFixed(2) > 0 ? "green" : "red"
              }`,
            }}
          >
            {parseFloat(Math.abs(record.CurrStockQty)).toFixed(2)}
          </span>
        );
      },
    },
    {
      title: "Curr. Stock Value",
      dataIndex: "CurrStockVal",
      align: "right",
      width: 100,
      render: (txt, record) => {
        return (
          <span
            style={{
              fontWeight: 500,
              color: `${
                parseFloat(record.CurrStockVal).toFixed(2) > 0 ? "green" : "red"
              }`,
            }}
          >
            {parseFloat(
              Math.abs(record.CurrStockVal) /
                l_ConfigStockSummaryValueDivisibleByN.value1
            ).toFixed(2)}
          </span>
        );
      },
    },
    {
      title: "",
      width: 30,
      render: (record) => {
        return (
          <>
            <Checkbox
              checked={
                selectedRow && selectedRow.ItemCode === record.ItemCode
                  ? true
                  : false
              }
              onChange={(e) => {
                if (e.target.checked) {
                  fetchInvGetDataStockValuationDetail(
                    CompCode,
                    stockInputParam.BranchCode,
                    record.ItemCode,
                    moment(stockInputParam.AsOfDate).format("YYYY-MM-DD")
                  ).then((res) => {
                    let tempAddInfo = {
                      InwardWise: [],
                      TranDetailWise: [],
                    };
                    if (res) {
                      if (res[0]) {
                        for (var key of Object.keys(res[0])) {
                          tempAddInfo.InwardWise.push({
                            ...res[0][key],
                            key,
                          });
                        }
                      }
                      if (res[1]) {
                        for (var key of Object.keys(res[1])) {
                          tempAddInfo.TranDetailWise.push({
                            ...res[1][key],
                            key,
                          });
                        }
                      }
                    }
                    setItemsStockDtlData({
                      ...record,
                      AddInfo: tempAddInfo,
                    });
                    setSelectedRow(record);
                  });
                } else {
                  setItemsStockDtlData();
                  setSelectedRow();
                }
              }}
            />
          </>
          // <Tooltip title="Click to view details">
          //   <a
          //     onClick={() => {
          //       fetchInvGetDataStockValuationDetail(
          //         1,
          //         "ANDHERI",
          //         record.ItemCode
          //       ).then((res) => {
          //         let tempAddInfo = {
          //           InwardWise: [],
          //           TranDetailWise: [],
          //         };
          //         if (res) {
          //           if (res[0]) {
          //             for (var key of Object.keys(res[0])) {
          //               tempAddInfo.InwardWise.push({
          //                 ...res[0][key],
          //                 key,
          //               });
          //             }
          //           }
          //           if (res[1]) {
          //             for (var key of Object.keys(res[1])) {
          //               tempAddInfo.TranDetailWise.push({
          //                 ...res[1][key],
          //                 key,
          //               });
          //             }
          //           }
          //         }
          //         setItemsStockDtlData({ ...record, AddInfo: tempAddInfo });
          //       });
          //     }}
          //     style={{ color: "var(--app-theme-color)" }}
          //   >
          //     <RightCircleOutlined />
          //   </a>
          // </Tooltip>
        );
      },
    },
  ];

  const border = { border: "1px solid #f0f0f0" };
  return (
    <>
      <Col lg={24} xl={24}>
        <CardHeader title={currentTran.formTitle} />{" "}
        <Card bodyStyle={{ padding: "7px 5px", minHeight: 330 }}>
          <Row
            className="stock-summary-card"
            style={{ justifyContent: "space-between" }}
          >
            <Col>
              <label style={{ margin: 6 }}>Branch:</label>
              <Select
                disabled={stockSummaryItemsData.length > 0}
                className="stock-summary-select-input"
                allowClear
                showSearch
                style={{ width: 250, marginRight: 5 }}
                placeholder="Select Branch"
                value={stockInputParam.BranchCode}
                onChange={(val) => {
                  setStockInputParam({ ...stockInputParam, BranchCode: val });
                }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
              <label style={{ margin: 6 }}>As Of Date :</label>
              <DatePicker
                onChange={(val) => {
                  setStockInputParam({ ...stockInputParam, AsOfDate: val });
                }}
                allowClear={false}
                format="DD-MM-YYYY"
                value={stockInputParam.AsOfDate}
              />
              <label style={{ margin: 6 }}>Show 0 Stocks :</label>
              <Checkbox
                checked={showZeroStocks}
                onChange={(e) => {
                  setShowZeroStocks(e.target.checked);
                }}
              ></Checkbox>
              <Button
                icon={<SearchOutlined />}
                type="primary"
                style={{ marginRight: 5, marginLeft: 5 }}
                onClick={() => {
                  if (_.includes([null, ""], stockInputParam.BranchCode)) {
                    message.error("Please Select Inputs");
                  } else {
                    // fnDefault();
                    fetchInvGetDataStockValuationSummary(
                      CompCode,
                      stockInputParam.BranchCode,
                      moment(stockInputParam.AsOfDate).format("YYYY-MM-DD")
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
                onClick={() => {
                  setStockInputParam({
                    ...stockInputParam,
                    BranchCode: null,
                  });
                  setStockSummaryItemsData([]);
                  setSelectedRow();
                  setItemsStockDtlData();
                }}
              >
                Reset
              </Button>
            </Col>
            <Col>
              <Button
                icon={<SnippetsOutlined />}
                type="primary"
                style={{ marginRight: 5 }}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Show Reports
              </Button>
            </Col>
          </Row>
          <Divider
            type="horizontal"
            style={{ marginBottom: 5, marginTop: 5 }}
          />
          <Row>
            <Col lg={12} style={{ paddingRight: 5 }}>
              <div
                style={{
                  backgroundColor: "var(--app-theme-color)",
                  fontSize: 14,
                  width: "100%",
                  color: "#FFF",
                  padding: "3px 0px 3px 8px",
                  fontWeight: "600",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Product (SKU) wise list of stock with valuation
              </div>
              <Table
                bordered
                className="stock-summary-table"
                size="small"
                showHeader={true}
                loading={isLoading}
                pagination={false}
                dataSource={
                  !showZeroStocks
                    ? stockSummaryItemsData.filter(
                        (aa) =>
                          parseFloat(aa.CurrStockQty) !== 0.0 &&
                          parseFloat(aa.CurrStockVal) !== 0.0
                      )
                    : stockSummaryItemsData
                }
                columns={itemColumns}
                expandable={{
                  expandedRowRender: (record) => {
                    return (
                      <>
                        <Descriptions
                          //   column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 1 }}
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
                            span={2}
                          >
                            {record.MfrCode} ({record.MfrDesc})
                          </Descriptions.Item>
                          <Descriptions.Item
                            style={border}
                            label="Brand"
                            span={2}
                          >
                            {record.BrandDesc} ({record.BrandCode})
                          </Descriptions.Item>
                          <Descriptions.Item
                            style={border}
                            label="Category"
                            span={2}
                          >
                            {record.CatDesc} ({record.CatCode})
                          </Descriptions.Item>
                          <Descriptions.Item
                            style={border}
                            label="SubCategory"
                            span={2}
                          >
                            {record.SubCatDesc} ({record.SubCategoryCode})
                          </Descriptions.Item>

                          <Descriptions.Item style={border} label="Image">
                            {record.URL ? (
                              <Avatar
                                shape="square"
                                size={64}
                                src={record.URL}
                              />
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
                summary={(pageData) => {
                  let totalCurrStockQty = 0;
                  let totalCurrStockVal = 0;

                  if (pageData.length > 0) {
                    pageData.forEach(({ CurrStockQty, CurrStockVal }) => {
                      totalCurrStockQty += parseFloat(CurrStockQty);
                      totalCurrStockVal += parseFloat(CurrStockVal);
                    });
                  }

                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell></Table.Summary.Cell>
                        <Table.Summary.Cell></Table.Summary.Cell>
                        <Table.Summary.Cell>
                          <Text strong>Total ({l_Currency.value1})</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell></Table.Summary.Cell>
                        <Table.Summary.Cell className="custom-table-stock-summary-amount">
                          <Text strong>{totalCurrStockQty.toFixed(2)}</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell className="custom-table-stock-summary-amount">
                          <Text strong>
                            {(
                              totalCurrStockVal /
                              parseFloat(
                                l_ConfigStockSummaryValueDivisibleByN.value1
                              )
                            ).toFixed(2)}
                          </Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell></Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Col>
            <Col lg={12} style={{ paddingRight: 5 }}>
              {itemsStockDtlData && (
                <StockInwardSeqWiseViewComponent
                  isShowFreeQty={true}
                  ConfigStockSummaryValueDivisibleByN={
                    l_ConfigStockSummaryValueDivisibleByN
                  }
                  data={itemsStockDtlData ? itemsStockDtlData : null}
                />
              )}
              {!itemsStockDtlData && (
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{
                    height: 200,
                  }}
                  description={
                    <span>Select Product / SKU to see detail view</span>
                  }
                ></Empty>
              )}
            </Col>
          </Row>
          <Modal
            // title={"Customer"}
            visible={showModal}
            footer={false}
            bodyStyle={{ padding: "0px 0px" }}
            style={{ top: 20 }}
            destroyOnClose={true}
            onCancel={() => {
              setShowModal(false);
            }}
            width={"95%"}
          >
            <ReportsMain
              // hideSideBar={true}
              isModal={true}
              reportId={"42"}
              reportGroups={["Mk stock out Reports"]}
            />
          </Modal>
        </Card>
      </Col>
    </>
  );
};

export default StockSummaryPage;
