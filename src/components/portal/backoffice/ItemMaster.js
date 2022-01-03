import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import { fetchItemMaster } from "../../../store/actions/ItemMaster";
import { hasRight, sysGenCode } from "../../../shared/utility";
import { fetchSequenceNextVal } from "../../../store/actions/sys-sequence-config";
import ItemMasterCard from "./ItemMaster/ItemMasterCardNew";
import { Button, Card, Row, Table, Badge, Space, Input } from "antd";
import {
  EditTwoTone,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CardHeader from "../../common/CardHeader";
import Highlighter from "react-highlight-words";
import { CloudLightning } from "react-feather";
import { getBrandMaster } from "../../../services/brand-master";
// import ItemMasterCard from "./ItemMaster/ItemMasterCard";
// import ItemMasterCard from "./ItemMaster/ItemMasterCardHari";

export const ItemMstConfigContext = React.createContext(null);

const ItemMaster = () => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });

  const [brandMaster, setBrandmaster] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const ItemMaster = useSelector((state) => state.ItemMaster);
  const currTran = useSelector((state) => state.currentTran);
  const sysConfig = useSelector((state) => state.AppMain.sysSequenceConfig);
  const config = useSelector((state) => state.AppMain.appconfigs);
  const [itemsData, setItemsData] = useState([]);
  const [searchOnColumn, setSearchOnColumn] = useState("ItemName");
  const [searchOnColumnTitle, setSearchOnColumnTitle] = useState("Item Name");
  let renderItem = null;
  const searchInputRef = useRef();
  const searchBtnClick = useRef();

  useEffect(() => {
    dispatch(setFormCaption(47));
    dispatch(fetchItemMaster());
    getBrandMaster(CompCode).then((res) => setBrandmaster(res));
  }, []);

  useEffect(() => {
    if (ItemMaster.ItemMaster.length > 0) {
      let tempData = [];

      setItemsData(
        ItemMaster.ItemMaster.map((xx, idx) => {
          return { ...xx, key: idx };
        })
      );
    } else {
      setItemsData([]);
    }
  }, [ItemMaster.ItemMaster]);

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
            backgroundColor: `rgba(52, 211, 153, 50%)`,
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
      title: "Barcode",
      dataIndex: "Barcode",
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
      // ...getColumnSearchProps("ItemCode"),
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
      // ...getColumnSearchProps("ItemName"),
    },
    {
      title: "Category",
      dataIndex: "CatDesc",
      ellipsis: true,
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
      // ...getColumnSearchProps("CatDesc"),
    },
    {
      title: "Sub Category",
      dataIndex: "SubCatDesc",
      ellipsis: true,
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSearchOnColumn(column.dataIndex);
            setSearchOnColumnTitle(column.title);
            searchInputRef.current.focus();
          },
        };
      },
      // ...getColumnSearchProps("SubCatDesc"),
    },
    {
      title: "Brand",
      dataIndex: "BrandDesc",
      ellipsis: true,
      // ...getColumnSearchProps("BrandCode"),
      // render: (text, record) => {
      //   return (
      //     <>
      //       {record.BrandCode &&
      //       brandMaster.length > 0 &&
      //       brandMaster.find((ii) => ii.BrandCode === record.BrandCode)
      //         ? brandMaster.find((ii) => ii.BrandCode === record.BrandCode)
      //             .BrandDesc
      //         : ""}
      //     </>
      //   );
      // },
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
      title: "Variants",
      dataIndex: "count",
      align: "center",
      width: 90,
    },
    {
      title: "Status",
      align: "center",
      width: 60,
      render: (value, record) => {
        return (
          <>
            {record.IsActive ? (
              <Badge status="success" color="green" />
            ) : (
              <Badge status="error" color="red" />
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

  // useEffect(() => {
  //   if (currTran.lastSavedData) {
  //     toast.success("Data saved successfully...!");
  //   }
  // }, [currTran.lastSavedData]);

  if (ItemMaster.isLoading) {
    renderItem = <div>Loading......</div>;
  } else if (ItemMaster.error) {
    renderItem = <div>Error : {ItemMaster.error}</div>;
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
                    // if (sysGenCode(sysConfig, "ITEM")) {
                    //   dispatch(fetchSequenceNextVal("ITEM"));
                    // }
                  }}
                  icon={<PlusCircleOutlined />}
                  disabled={hasRight(currTran.moduleRights, "ADD")}
                >
                  Add
                </Button>
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
                      ItemMaster.ItemMaster.filter(
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
                        ItemMaster.ItemMaster.filter((item) =>
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
              </Row>
              <Row>
                {/* <CustomDataTable
                addDisabled={hasRight(currTran.moduleRights, "ADD")}
                disableEdit={hasRight(currTran.moduleRights, "EDIT")}
                columnProperties={columnProperties}
                myData={ItemMaster.ItemMaster}
                onAddClick={() => {
                  setEditedData({ entryMode: "A" });
                  if (sysGenCode(sysConfig, "ITEM")) {
                    dispatch(fetchSequenceNextVal("ITEM"));
                  }
                }}
                onEditPress={(values) => {
                  setEditedData({ entryMode: "E", formData: values });
                }}
                pageDefaultSize={15}
              /> */}

                <Table
                  bordered
                  style={{ flex: 1 }}
                  columns={columns.filter((cc) =>
                    config.find(
                      (aa) => aa.configCode === "ENABLE_ITM_VARIATION"
                    ).value1 === "Y"
                      ? cc.dataIndex !== "Barcode"
                      : cc.dataIndex !== "count"
                  )}
                  className="custom-pagination item-table"
                  dataSource={itemsData}
                  pagination={
                    itemsData.length > 20
                      ? {
                          // pageSize: itemsData.length > 20 ? 20 : null,
                          defaultPageSize: 20,
                        }
                      : false
                  }
                />
              </Row>
            </>
          )}
          {/* <ItemMstConfigContext.Provider
            value={{
              configVariant: config.find(
                (aa) => aa.configCode === "ENABLE_ITM_VARIATION"
              ),
            }}
          > */}
            {editedData && (
              <ItemMasterCard
                onBackPress={() => setEditedData()}
                formData={editedData.formData}
                entryMode={editedData.entryMode}
                onSavePress={(val) => {
                  dispatch(fetchItemMaster());
                }}
              />
            )}
          {/* </ItemMstConfigContext.Provider> */}
        </Card>
      </Fragment>
    );
  }

  return renderItem;
};

// export const columnProperties = [
//   new ColumnProperties("ItemCode", true, "Item Code", true, 150),
//   new ColumnProperties("ItemName", true, "Item Name", true),
//   new ColumnProperties("ItemDesc", false, "Description", true),
//   new ColumnProperties("CatDesc", true, "Category", true, 150),
//   new ColumnProperties("SubCatDesc", true, "Sub Category", true, 150),
//   new ColumnProperties("UnitCode", false, "Unit", true),
//   new ColumnProperties("SubCategoryCode", false, "Sub Category", true),
//   new ColumnProperties("BrandCode", true, "Brand", true, 150),
//   new ColumnProperties("classCode", false, "Brand", true),
//   new ColumnProperties("className", false, "Brand", true),
//   new ColumnProperties("ProductType", false, "Product Type", true),
//   new ColumnProperties("PrintLabel", false, "Print Label", true),
//   new ColumnProperties("HSNSACCode", false, "HSN SAC Code", true),
//   new ColumnProperties("TaxCode", false, "Tax Code", true),
//   new ColumnProperties("IsActive", false, "Is Active", false),
//   new ColumnProperties("IsActiveComponent", true, "Active Status", false, 150),
//   new ColumnProperties("IsSaleOnMRP", false, "SaleOnMRP", false),
//   new ColumnProperties("MarkUpDown", false, "MarkUpDown", false),
//   new ColumnProperties("MarkUpDownPV", false, "MarkUpDownPV", false),
//   new ColumnProperties("Cost", false, "Cost", false),
//   new ColumnProperties("MRP", false, "MRP", false),
//   new ColumnProperties("SalePrice", false, "SalePrice", false),
//   new ColumnProperties(
//     "SecondaryUnitCode",
//     false,
//     "Secondary Unit Code",
//     false
//   ),
//   new ColumnProperties("ConversionRate", false, "ConversionRate", false),
//   new ColumnProperties("MaintainInventory", false, "MaintainInventory", false),
// ];
export default ItemMaster;
