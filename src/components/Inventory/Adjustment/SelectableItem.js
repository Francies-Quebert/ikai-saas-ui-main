import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Table,
  Input,
  Descriptions,
  Avatar,
  Select,
} from "antd";
import {
  EditTwoTone,
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
  SearchOutlined,
  UserOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getInvItemMasterData } from "../../../services/opening-stock";
import Modal from "antd/lib/modal/Modal";
import ItemMasterCardNew from "../../portal/backoffice/ItemMaster/ItemMasterCardNew";
import _ from "lodash";
const SearchCustomer = (props) => {
  const { Option } = Select;
  const [selectedItem, setSelectedItem] = useState();
  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [searchOnColumn, setSearchOnColumn] = useState("ItemName");
  const [searchOnColumnTitle, setSearchOnColumnTitle] = useState("Item Name");
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const [itemAddEdit, setItemAddEdit] = useState({
    entryMode: "",
    data: null,
  });
  const searchInputRef = useRef();
  const searchBtnClick = useRef();
  useEffect(() => {
    if (props.data) {
      setItemsData(props.data);
    }
  }, [props.data]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (props.selectType === "checkbox") {
        setSelectedItem([...selectedRows]);
      } else {
        setSelectedItem(...selectedRows);
      }
      setIsSelected(false);
    },
  };

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

  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //   }) => (
  //     <div style={{ padding: 8 }}>
  //       <Input
  //         ref={(node) => {
  //           searchedData.searchInput = node;
  //         }}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) => {
  //           setSelectedKeys(e.target.value ? [e.target.value] : []);
  //         }}
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{ width: 188, marginBottom: 8, display: "block" }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => handleReset(clearFilters)}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex]
  //       ? record[dataIndex]
  //           .toString()
  //           .toLowerCase()
  //           .includes(value.toLowerCase())
  //       : "",
  //   onFilterDropdownVisibleChange: (visible) => {
  //     if (visible) {
  //       setTimeout(
  //         () =>
  //           searchedData.searchInput ? searchedData.searchInput.select() : null,
  //         100
  //       );
  //     }
  //   },
  //   render: (text) =>
  //     searchedData.searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: process.env.REACT_APP_PRIMARY_COLOR,
  //           padding: 0,
  //         }}
  //         searchWords={[searchedData.searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ""}
  //       />
  //     ) : (
  //       text
  //     ),
  // });

  useEffect(() => {
    if (searchOnColumn) {
      searchBtnClick.current.click();
    }
    return () => {};
  }, [searchOnColumn]);
  const columns = [
    {
      title: "Barcode",
      dataIndex: "Barcode",
      // ...getColumnSearchProps("ItemCode"),
      width: 100,
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
    },
    {
      title: "Item Code",
      dataIndex: "ItemCode",
      // ...getColumnSearchProps("ItemCode"),
      width: 100,
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      ellipsis: true,
      // width: 200,
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
      render: (value, record) => {
        return `${value} ${
          record.VariationName && `[${record.VariationName}]`
        }`;
      },
      // ...getColumnSearchProps("ItemName"),
    },

    // {
    //   title: "Brand",
    //   dataIndex: "BrandCode",
    //   // ...getColumnSearchProps("BrandCode"),
    //   ellipsis: true,
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         {record.BrandCode} ({record.BrandDesc})
    //       </div>
    //     );
    //   },
    //   width: 250,
    //   fixed: true,
    //   onHeaderCell: (column) => {
    //     return {
    //       onClick: () => {
    //         setSearchOnColumn(column.dataIndex);
    //         setSearchOnColumnTitle(column.title);
    //         searchInputRef.current.focus();
    //       },
    //     };
    //   },
    // },
    {
      title: "Category",
      dataIndex: "CatCode",
      // ...getColumnSearchProps("CatCode"),
      ellipsis: true,
      // fixed: true,
      render: (text, record) => {
        return (
          <div>
            {record.CatCode} ({record.CatDesc})
          </div>
        );
      },
      width: 250,
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
    },
    {
      title: "Current Stock",
      dataIndex: "CurrentStockQty",
      ellipsis: true,
      width: 120,
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
      align: "center",
      render: (text, record) => {
        return <div>{parseFloat(record.CurrentStockQty).toFixed(2)}</div>;
      },
      // ...getColumnSearchProps("ItemName"),
    },
    {
      title: "Cost Price" + ` (${currency.value1})`,
      dataIndex: "DefCost",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <div>
            {record.DefCost ? parseFloat(record.DefCost).toFixed(2) : "-"}
          </div>
        );
      },
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
    },
    {
      title: "MRP" + ` (${currency.value1})`,
      dataIndex: "DefMRP",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <div>
            {record.DefMRP ? parseFloat(record.DefMRP).toFixed(2) : "-"}
          </div>
        );
      },
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
    },
    {
      title: "Sale Price" + ` (${currency.value1})`,
      dataIndex: "DefSalePrice",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <div>
            {record.DefMRP ? parseFloat(record.DefMRP).toFixed(2) : "-"}
          </div>
        );
      },
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
    },
    {
      dataIndex: "x",
      width: 40,
      align: "left",
      render: (text, record) => {
        return (
          <Button
            icon={<EditTwoTone color="red" />}
            type="link"
            onClick={() => {
              setItemAddEdit({ entryMode: "E", data: record });
            }}
          />
        );
      },
    },
  ];
  const border = { border: "1px solid #f0f0f0" };

  return (
    <>
      <Row>
        <Col
          flex={1}
          style={{
            padding: 5,
            // border: "1px solid #d9d9d9",
            marginBottom: 0,
            display: "flex",
            marginRight: 50,
          }}
        >
          {/* <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              width: "max-content",
              padding: "0px 5px",
              alignSelf: "center",
            }}
          >
            Product (SKU) Help
          </div> */}
          <div
            style={{
              display: "flex",
              flex: 1,
            }}
          >
            <div className="search-label-custom">{searchOnColumnTitle}</div>
            <Input
              // size="large"
              placeholder={`Search On ${searchOnColumnTitle}`}
              // prefix={
              //     <SearchOutlined />
              // }
              width={200}
              style={{
                flex: 1,
              }}
              onChange={(val) => {
                setItemsData(
                  props.data.filter(
                    (item) =>
                      item[`${searchOnColumn}`] &&
                      item[`${searchOnColumn}`]
                        .toString()
                        .toLowerCase()
                        .includes(val.target.value.toLowerCase())
                  )
                );
              }}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  setItemsData(
                    props.data.filter((item) =>
                      item[`${searchOnColumn}`]
                        .toString()
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    )
                  );
                }
              }}
              autoFocus={true}
              ref={searchInputRef}
            />
          </div>
          <div
            className="search-icon-custom"
            ref={searchBtnClick}
            onClick={() => {
              let value = searchInputRef.current.state.value;
              if (!_.includes([null, undefined, ""], value)) {
                setItemsData(
                  props.data.filter((item) =>
                    item[`${searchOnColumn}`]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
                  )
                );
              }
            }}
          >
            <SearchOutlined />
          </div>
        </Col>
        <Col flex={1}>
          <Table
            loading={loading}
            bordered
            columns={columns}
            className="custom-pagination header-pointer item-table"
            // size="small"
            rowSelection={{
              type: props.selectType,
              ...rowSelection,
            }}
            dataSource={itemsData}
            pagination={{ pageSize: 11, size: "small" }}
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
          <Divider
            type="horizontal"
            style={{ marginBottom: 5, marginTop: 5 }}
          />
          <Row style={{ display: "flex" }}>
            <Col span={8}>
              <Button
                icon={<SaveOutlined />}
                style={{ marginRight: 5 }}
                disabled={isSelected}
                type="primary"
                onClick={() => {
                  props.onItemSelect(selectedItem ? selectedItem : null);
                }}
              >
                Set
              </Button>
              <Button
                icon={<RollbackOutlined />}
                type="primary"
                onClick={() => {
                  props.onBackPress();
                }}
              >
                Back
              </Button>

              <Button
                type="primary"
                // size="small"
                // shape="round"
                style={{ marginLeft: 20 }}
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setItemAddEdit({ entryMode: "A" });
                }}
              >
                Add Product SKU
              </Button>
            </Col>
            <Col span={8}></Col>
          </Row>
        </Col>
        {itemAddEdit && itemAddEdit.entryMode && (
          <Modal
            visible={itemAddEdit.entryMode}
            bodyStyle={{ padding: 0 }}
            footer={false}
            destroyOnClose={true}
            onCancel={() => {
              setItemAddEdit({ entryMode: "", data: {} });
            }}
            width={"90%"}
          >
            <ItemMasterCardNew
              title={"Item Master"}
              onBackPress={() => setItemAddEdit({ entryMode: "", data: {} })}
              formData={itemAddEdit.data}
              entryMode={itemAddEdit.entryMode}
              onSavePress={(val) => {
                // console.log(val);
                if (val && props.branch) {
                  getInvItemMasterData(CompCode, props.branch).then((res1) => {
                    setItemsData(res1);
                    if (props.updateItemMaterData) {
                      props.updateItemMaterData(res1);
                    }
                  });
                }
                // dispatch(fetchItemMaster());
              }}
            />
          </Modal>
        )}
      </Row>
    </>
  );
};

export default SearchCustomer;
