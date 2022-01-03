import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Row,
  Space,
  Table,
  Input,
} from "antd";
import {
  RollbackOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";

const SearchSupplier = (props) => {
  const [selectedItem, setSelectedItem] = useState();
  const [isSelected, setIsSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [searchedData, setSearchedData] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );

  useEffect(() => {
    if (props.data) {
      setItemsData(props.data);
    }
  }, [props.data]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedItem(...selectedRows);
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
      title: "Code",
      dataIndex: "suppCode",
      ...getColumnSearchProps("suppCode"),
      width: "10%",
    },
    {
      title: "Supplier Name",
      dataIndex: "suppName",
      ...getColumnSearchProps("suppName"),
    },
    {
      title: "Type",
      dataIndex: "suppType",
      ...getColumnSearchProps("suppType"),
    },
    {
      title: "Email",
      dataIndex: "emailId",
      ...getColumnSearchProps("emailId"),
    },
    {
      title: "Mobile No.",
      dataIndex: "mobileNo",
      ...getColumnSearchProps("mobileNo"),
    },
  ];
  const border = { border: "1px solid #f0f0f0" };

  return (
    <>
      <div>
        <Col style={{ padding: "5px 15px" }} className="card-sales-inner">
          Supplier Advance Search{" "}
        </Col>
        <Col flex={1} style={{ padding: "5px 15px" }}>
          <Table
            loading={loading}
            bordered
            columns={columns}
            rowSelection={{
              type: "radio",
              ...rowSelection,
            }}
            rowKey={(aa) => aa.suppCode}
            dataSource={itemsData}
            // pagination={false}
            // expandable={{
            //   expandedRowRender: (record) => {
            //     return (
            //       <>
            //         <Descriptions
            //           column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 1 }}
            //           style={{ backgroundColor: "#fff" }}
            //           size="small"
            //           bordered
            //         >
            //           <Descriptions.Item
            //             style={border}
            //             label="Item Desc"
            //             span={4}
            //           >
            //             {record.ItemDesc}
            //           </Descriptions.Item>
            //           <Descriptions.Item
            //             style={border}
            //             label="Manufacturer"
            //             span={1}
            //           >
            //             {record.MfrCode} ({record.MfrDesc})
            //           </Descriptions.Item>
            //           <Descriptions.Item
            //             style={border}
            //             label="SubCategory"
            //             span={1}
            //           >
            //             {record.SubCategoryCode} ({record.SubCatDesc})
            //           </Descriptions.Item>
            //           <Descriptions.Item style={border} label="Class" span={1}>
            //             {record.classCode} ({record.ClassName})
            //           </Descriptions.Item>
            //           <Descriptions.Item
            //             style={border}
            //             label="UnitCode"
            //             span={1}
            //           >
            //             {record.UnitCode} ({record.UnitDesc})
            //           </Descriptions.Item>
            //           <Descriptions.Item style={border} label="Image">
            //             {record.URL ? (
            //               <Avatar shape="square" size={64} src={record.URL} />
            //             ) : (
            //               <Avatar
            //                 shape="square"
            //                 size={64}
            //                 icon={<UserOutlined />}
            //               />
            //             )}
            //           </Descriptions.Item>
            //         </Descriptions>
            //       </>
            //     );
            //   },
            // }}
          />
          <Divider
            type="horizontal"
            style={{ marginBottom: 5, marginTop: 5 }}
          />
          <Row style={{ display: "flex" }}>
            <Col span={24}>
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
            </Col>
          </Row>
        </Col>
      </div>
    </>
  );
};

export default SearchSupplier;
