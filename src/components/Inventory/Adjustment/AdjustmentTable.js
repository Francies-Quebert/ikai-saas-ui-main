import {
  DeleteTwoTone,
  EditOutlined,
  InfoCircleOutlined,
  InfoOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Input,
  DatePicker,
  Table,
  Button,
  Select,
  InputNumber,
  Tooltip,
  Modal,
  message,
  notification,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getInvItemMasterData } from "../../../services/opening-stock";
import {
  invGetAllInwardSeqInfo,
  InvSaveAdjustments,
} from "../../../services/inventory";
import SelectableItem from "./SelectableItem";
import moment from "moment";
import SearchAllInwardSeq from "./SearchAllInwardSeq";
import _ from "lodash";
const { Option } = Select;

const AdjustmentTable = (props) => {
  const dispatch = useDispatch();
  const refAdd = useRef();
  const refInwardSeq = useRef([]);
  const initialTable = [
    {
      ItemCode: null,
      ItemName: null,
      ReceiptIssue: null,
      Qty: null,
      InwardSeq: null,
      CostPrice: null,
      SalePrice: null,
      MRP: null,
      key: 1,
      remark: null,
      BatchNo: null,
      ExpiryDate: null,
      isDeleted: false,
    },
  ];
  const [ItemTable, setItemTable] = useState(initialTable);
  const [tableLoading, setTableLoading] = useState(false);
  const [showModal, setShowModal] = useState();
  const [inwardSeqData, setInwardSeqData] = useState({
    data: [],
    record: null,
  });
  const [itemMasterData, setItemMasterData] = useState([]);

  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    props.sendItemData(ItemTable);
  }, [props.validateSaveData]);
  useEffect(() => {
    if (props.searchData.branch !== null) {
      getInvItemMasterData(CompCode, props.searchData.branch.BranchCode).then(
        (res1) => {
          setItemMasterData(res1);
        }
      );
    }
    return () => {
      setItemMasterData([]);
    };
  }, [props.searchData.branch]);

  const checkItemCode = async (event, record) => {
    let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
    let tempTable = ItemTable;
    let tempData = itemMasterData.find(
      (aa) => aa.ItemCode === event.target.value
    );

    if (tempData) {
      tempTable[findIndex].ItemCode = tempData.ItemCode;
      tempTable[findIndex].ItemName = tempData.ItemName;
      tempTable[findIndex].Qty = null;
      tempTable[findIndex].InwardSeq = null;
      tempTable[findIndex].ReceiptIssue = null;
      tempTable[findIndex].CostPrice = null;
      tempTable[findIndex].SalePrice = null;
      tempTable[findIndex].MRP = null;
      if (!ItemTable.find((aa) => aa.ItemCode === null || aa.ItemCode === "")) {
        await setItemTable([...tempTable]);
        refAdd.current.click();
      }
      refInwardSeq.current[record.key].focus();
    } else {
      tempTable[findIndex].ItemCode = null;
      tempTable[findIndex].ItemName = null;
      tempTable[findIndex].Qty = null;
      tempTable[findIndex].InwardSeq = null;
      tempTable[findIndex].ReceiptIssue = null;
      tempTable[findIndex].CostPrice = null;
      tempTable[findIndex].SalePrice = null;
      tempTable[findIndex].MRP = null;
      if (event.target.value !== "" && event.target.value !== null) {
        message.error("Incorrect Item Code");
      }
      await setItemTable([...tempTable]);
    }
  };
  const getItemDtlsData = () => {
    return ItemTable;
  };
  const column = [
    {
      title: "Sr No.",
      dataIndex: "key",
      width: 60,
      align: "center",
      fixed: "left",
    },
    {
      title: "Item Code",
      dataIndex: "ItemCode",
      key: "key",
      width: 140,
      fixed: "left",
      render: (text, record) => {
        return (
          <Input
            value={text}
            addonBefore={
              <a
                onClick={() => {
                  setShowModal("SEARCH_ITEM");
                }}
              >
                <Tooltip title="Search Items">
                  <i>
                    <ShoppingCartOutlined />
                  </i>
                  {/* </span> */}
                </Tooltip>
              </a>
            }
            placeholder="Item Code"
            autoFocus={true}
            onChange={(e) => {
              let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
              let tempTable = ItemTable;
              tempTable[findIndex].ItemCode = e.target.value;
              setItemTable([...tempTable]);
            }}
            onKeyDown={async (event) => {
              if (
                event.keyCode === 13 ||
                (!event.shiftKey && event.keyCode === 9)
              ) {
                event.preventDefault();
                await checkItemCode(event, record);
              }
            }}
            onBlur={async (event) => {
              await checkItemCode(event, record);
            }}
          />
        );
      },
    },
    {
      title: "Item Name",
      dataIndex: "ItemName",
      fixed: "left",
      width: 200,
      render: (text, record) => {
        return (
          <Input
            disabled={true}
            value={text}
            placeholder="Item Name"
            onChange={(e) => {
              let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
              let tempTable = ItemTable;
              tempTable[findIndex].ItemName = e.target.value;
              setItemTable([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "Inward Seq",
      dataIndex: "InwardSeq",
      width: 135,
      align: "center",
      render: (text, record) => {
        return (
          <Input
            // style={{ paddingLeft: 0, textAlign: "right" }}
            className="inwardSeq-input"
            addonBefore={
              <button
                ref={(el) => (refInwardSeq.current[record.key] = el)}
                className="no-style-button"
                onClick={() => {
                  invGetAllInwardSeqInfo(
                    CompCode,
                    props.branch.BranchCode,
                    record.ItemCode
                  ).then((res) => {
                    setInwardSeqData({ data: [...res], record: record });
                    setShowModal("SEARCH_INWARD_SEQ");
                  });
                }}
              >
                <Tooltip title="Search Inward Seq">
                  <i>
                    <InfoCircleOutlined className="info-cirlce" />
                  </i>
                </Tooltip>
              </button>
            }
            disabled={true}
            value={text !== null ? text.InwardSeq : null}
            placeholder="Inward Seq"
            style={{ width: "100%", textAlign: "center" }}
            onChange={(e) => {
              let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
              let tempTable = ItemTable;
              tempTable[findIndex].InwardSeq = e.target.value;
              setItemTable([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "Receipt /issue",
      dataIndex: "ReceiptIssue",
      width: 140,
      render: (text, record) => {
        return (
          <Select
            value={text}
            placeholder="Receipt /issue"
            style={{ width: "100%" }}
            allowClear={true}
            disabled={record.InwardSeq === null}
            onChange={(e) => {
              let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
              let tempTable = ItemTable;
              let validateReceiptIssue = tempTable.find((vv) => {
                return vv.ItemCode === record.ItemCode &&
                  vv.ReceiptIssue === e &&
                  vv.InwardSeq !== null &&
                  record.InwardSeq !== null
                  ? vv.InwardSeq.InwardSeq === record.InwardSeq.InwardSeq
                  : false;
              });
              if (validateReceiptIssue) {
                notification.error({
                  message: "This Value Already Exist",
                  description: `a data already exist with similar value at Sr No ${validateReceiptIssue.key}`,
                  style: {
                    width: 400,
                  },
                });
                tempTable[findIndex].ReceiptIssue = null;
              } else {
                tempTable[findIndex].ReceiptIssue = e;
                if (e === "I" && record.Qty > record.InwardSeq.CurrentStock) {
                  tempTable[findIndex].Qty = null;
                  message.error(
                    "Adjustment quantity cannot be greater than c urrent stock"
                  );
                }
              }
              setItemTable([...tempTable]);
            }}
          >
            <Option value="R">Receipt</Option>
            <Option value="I">Issue</Option>
          </Select>
        );
      },
    },
    {
      title: "Adjustment Qty",
      dataIndex: "Qty",
      width: 115,
      align: "center",
      render: (text, record) => {
        return (
          <InputNumber
            min={1}
            max={
              record.ReceiptIssue === "I"
                ? record.InwardSeq.CurrentStock
                : Number.MAX_SAFE_INTEGER
            }
            placeholder="Qty"
            value={_.includes([undefined, null, ""], text) ? null : text}
            className="bill-input"
            style={{
              width: "100%",
            }}
            onChange={(e) => {
              let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
              let tempTable = ItemTable;
              tempTable[findIndex].Qty = e;
              setItemTable([...tempTable]);
            }}
            bordered={false}
          />
        );
      },
    },
    {
      title: "Current Stock",
      align: "center",
      width: 100,
      render: (text, record) => {
        return (
          <Input
            style={{ textAlign: "right" }}
            value={
              record.InwardSeq !== null ? record.InwardSeq.CurrentStock : "N/A"
            }
            disabled={true}
          />
        );
      },
    },
    {
      title: "Cost Price",
      dataIndex: "CostPrice",
      align: "right",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return (
          <InputNumber
            precision={2}
            disabled={true}
            value={
              _.includes([undefined, null, ""], text)
                ? null
                : Number.parseFloat(text).toFixed(2)
            }
            placeholder="Cost Price"
            className="bill-input"
            style={{
              width: "100%",
            }}
            bordered={false}
            onChange={(e) => {
              let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
              let tempTable = ItemTable;
              tempTable[findIndex].CostPrice = e;
              setItemTable([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "Sale Price",
      dataIndex: "SalePrice",
      align: "right",
      width: 95,
      fixed: "right",
      render: (text, record) => {
        return (
          <InputNumber
            precision={2}
            disabled={true}
            value={
              _.includes([undefined, null, ""], text)
                ? null
                : parseFloat(text).toFixed(2)
            }
            placeholder="Sale Price"
            className="bill-input"
            style={{
              width: "100%",
            }}
            bordered={false}
            onChange={(e) => {
              let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
              let tempTable = ItemTable;
              tempTable[findIndex].SalePrice = e;
              setItemTable([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "M.R.P",
      dataIndex: "MRP",
      align: "right",
      fixed: "right",
      width: 95,
      render: (text, record) => {
        return (
          <InputNumber
            precision={2}
            disabled={true}
            value={
              _.includes([undefined, null, ""], text)
                ? null
                : parseFloat(text).toFixed(2)
            }
            placeholder="M.R.P"
            className="bill-input"
            style={{
              width: "100%",
            }}
            bordered={false}
            onChange={(e) => {
              let findIndex = ItemTable.findIndex((aa) => aa.key == record.key);
              let tempTable = ItemTable;
              tempTable[findIndex].MRP = e;
              setItemTable([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "",
      dataIndex: "key",
      align: "center",
      fixed: "right",
      width: 35,
      render: (text, record) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setTableLoading(true);
              setTimeout(() => {
                let tempTable = ItemTable;
                let findIndex = ItemTable.findIndex(
                  (aa) => aa.key == record.key
                );
                tempTable[findIndex].isDeleted = true;
                let newData = [];
                let i = 0;
                let iKey = 1;
                while (i < tempTable.length) {
                  newData.push({
                    ...tempTable[i],
                    key: tempTable[i].isDeleted === false ? iKey : 0,
                  });

                  if (tempTable[i].isDeleted === false) {
                    iKey++;
                  }
                  i++;
                }
                setItemTable(newData);
                setTableLoading(false);
              }, 100);
            }}
          >
            <DeleteTwoTone />
          </span>
        );
      },
    },
  ];
  return (
    <div
      className="adjustment-table-container"
      style={{
        backgroundColor: "#FFF",
        borderRadius: 3,
        padding: "0px 0px 5px 0px",
        border: "1px solid var(--app-theme-color)",
      }}
    >
      <Table
        loading={tableLoading}
        dataSource={ItemTable.filter((tt) => tt.isDeleted === false)}
        bordered={true}
        columns={column}
        className="adjustmentTable"
        style={{
          borderBottom: "1px solid var(--app-theme-color)",
          marginBottom: 5,
        }}
        pagination={false}
        scroll={{ y: "71vh", x: 1300, scrollToFirstRowOnChange: true }}
      />
      <div
        style={{
          padding: "0px 5px",
        }}
      >
        <Button
          type="dashed"
          ref={refAdd}
          style={{
            borderColor: "var(--app-theme-color)",
            width: "100%",
          }}
          onClick={() => {
            if (
              ItemTable.find(
                (aa) =>
                  (aa.ItemCode === null ||
                    aa.ItemCode === "" ||
                    aa.ItemName === null ||
                    aa.ItemName === "") &&
                  aa.isDeleted === false
              )
            ) {
              message.error("Item Code and Name Cannot Be Empty");
            } else {
              let newData = [];
              let i = 0;
              let iKey = 1;

              while (i < ItemTable.length) {
                newData.push({
                  ...ItemTable[i],
                  key: ItemTable[i].isDeleted === false ? iKey : 0,
                });
                if (ItemTable[i].isDeleted === false) {
                  iKey++;
                }
                i++;
              }
              newData = [
                ...newData,
                {
                  ItemCode: null,
                  ItemName: null,
                  ReceiptIssue: null,
                  Qty: null,
                  InwardSeq: null,
                  CostPrice: null,
                  SalePrice: null,
                  MRP: null,
                  key: iKey,
                  remark: null,
                  BatchNo: null,
                  ExpiryDate: null,
                  isDeleted: false,
                },
              ];

              setItemTable([...newData]);
              // if (refInwardSeq.current[refInwardSeq.current.length - 1]) {
              //   refInwardSeq.current[
              //     refInwardSeq.current.length - 1
              //   ].scrollIntoView({ block: "start", behavior: "smooth" });
              // }
            }
          }}
        >
          Add New Row
        </Button>
      </div>
      <Modal
        visible={showModal === "SEARCH_ITEM"}
        title={"Add Item"}
        footer={false}
        bodyStyle={{ padding: "10px 10px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
        }}
        width={"90%"}
      >
        <SelectableItem
          data={itemMasterData}
          onItemSelect={async (data) => {
            if (data) {
              let tempData = [
                ...ItemTable.filter(
                  (i) => i.ItemCode !== null && i.ItemName !== null
                ),
              ];
              data.map((aa) =>
                tempData.push({
                  ItemCode: aa.ItemCode,
                  ItemName: aa.ItemName,
                  ReceiptIssue: null,
                  Qty: 1,
                  InwardSeq: null,
                  CostPrice: null,
                  SalePrice: null,
                  MRP: null,
                  key: tempData.length + 1,
                  remark: null,
                  BatchNo: null,
                  ExpiryDate: null,
                  isDeleted: false,
                })
              );
              await setItemTable([...tempData]);
              refAdd.current.click();
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
      <Modal
        visible={showModal === "SEARCH_INWARD_SEQ"}
        title={"Select Inward Sequence"}
        footer={false}
        bodyStyle={{ padding: "10px 10px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
          setInwardSeqData({ data: [], record: null });
        }}
        width={800}
      >
        <SearchAllInwardSeq
          data={inwardSeqData.data}
          record={inwardSeqData.record}
          onItemSelect={async (data) => {
            if (data) {
              let findIndex = ItemTable.findIndex(
                (aa) => aa.key == inwardSeqData.record.key
              );
              let tempTable = ItemTable;
              tempTable[findIndex].InwardSeq = data;
              tempTable[findIndex].CostPrice = data.Cost;
              tempTable[findIndex].SalePrice = data.Sale;
              tempTable[findIndex].ReceiptIssue = null;
              tempTable[findIndex].MRP = data.MRP;
              setItemTable([...tempTable]);
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default AdjustmentTable;
