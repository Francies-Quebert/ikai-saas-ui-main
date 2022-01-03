import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../../../store/actions/currentTran";
import { Button, Space, Input, Table, Card, Badge, Col } from "antd";
import Icon, {
  EditTwoTone,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SectionMasterCard from "./Components/SectionMasterNewCard";
import { fetchSectionMaster } from "../../../../services/section-master";
import Highlighter from "react-highlight-words";
import { hasRight } from "../../../../shared/utility";

const SectionMasterNewPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [sectioncard, setSectionCard] = useState();
  const [sectionData, setSectionData] = useState([]);
  const [tablesearchdata, setTableSearchData] = useState({
    searchText: "",
    searchedColumn: "",
  });

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currTran = useSelector((state) => state.currentTran);
  const UploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "UPLOAD_PATH")
  );

  useEffect(() => {
    setIsLoading(true);
    dispatch(setFormCaption(56));
    fetchSectionData();
  }, []);

  const fetchSectionData = () => {
    fetchSectionMaster(CompCode).then((res) => {
      if (res.length > 0) {
        setSectionData(res);
        setIsLoading(false);
      } else {
        setSectionData([]);
        setIsLoading(false);
        // setIsLoading(false);
      }
    });
    // } catch (error) {
    //   console.log("error");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setTableSearchData({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setTableSearchData({ searchText: "" });
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
            tablesearchdata.searchText = node;
          }}
          placeholder={`Search  `}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
            size="small"
            style={{ width: 90 }}
            onClick={() => handleReset(clearFilters)}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setTableSearchData({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
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
            tablesearchdata.searchInput
              ? tablesearchdata.searchInput.select()
              : null,
          100
        );
      }
    },
    render: (text) =>
      setTableSearchData.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[setTableSearchData.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const sectiondata = [
    {
      title: "Code",
      dataIndex: "SecCode",
      width: "10%",
      align: "center",
      ...getColumnSearchProps("SecCode"),
    },
    {
      title: "Branch Name",
      dataIndex: "BranchCode",
      width: "15%",
      align: "center",
      key: "2",
    },
    {
      title: "Description",
      dataIndex: "SecDesc",
      key: "3",
      ...getColumnSearchProps("SecDesc"),
    },
    {
      title: "Image",
      dataIndex: "ImageURL",
      width: "10%",
      align: "center",
      key: "4",
      render: (value, record) => {
        return (
          <img
            width="30px"
            height="30px"
            src={
              record.pathType === "C"
                ? `${UploadPath.value1}/${record.ImageURL}`
                : `${record.ImageURL}`
            }
          />
        );
      },
    },
    {
      title: "Status",
      width: "10%",
      align: "center",
      key: "5",
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
      dataIndex: "",
      width: "5%",
      align: "center",
      key: "6",
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
              style={{ marginRight: 10 }}
              disabled={hasRight(currTran.moduleRights, "EDIT")}
            >
              <span
                onClick={() => {
                  setSectionCard({ entryMode: "E", formData: record });
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
      {!sectioncard && (
        <>
          <Card bodyStyle={{ padding: "5px" }}>
            <Button
              loading={isLoading}
              type="primary"
              onClick={() => {
                // setIsLoading(false);
                setSectionCard({ entryMode: "A" });
              }}
              disabled={hasRight(currTran.moduleRights, "ADD")}
              style={{ marginBottom: "5px" }}
            >
              <PlusCircleOutlined />
              Add
            </Button>
            <Table
              loading={isLoading}
              columns={sectiondata}
              bordered
              dataSource={sectionData.length > 0 && sectionData}
              pagination={
                sectionData.length > 25
                  ? {
                      pageSize: 20,
                      size: "small",
                    }
                  : false
              }
            />
          </Card>
        </>
      )}

      {sectioncard && (
        <>
          <Col span={12}>
            <SectionMasterCard
              formData={sectioncard.formData}
              entryMode={sectioncard.entryMode}
              onSavePress={(data) => {
                if (data) {
                  setIsLoading(true);
                  fetchSectionData();
                }
              }}
              onBackPress={() => setSectionCard()}
            />
          </Col>
        </>
      )}
    </>
  );
};

export default SectionMasterNewPage;
