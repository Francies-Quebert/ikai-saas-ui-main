import {
  CloseCircleOutlined,
  DeleteTwoTone,
  EditOutlined,
  InfoCircleOutlined,
  InfoOutlined,
  MessageTwoTone,
  PlusCircleOutlined,
  PlusCircleTwoTone,
  PlusOutlined,
  PlusSquareTwoTone,
  QuestionCircleOutlined,
  RetweetOutlined,
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
  getReasonsMasterData,
  invGetAllInwardSeqInfo,
  InvSaveAdjustments,
} from "../../../services/inventory";
import SelectableItem from "./SelectableItem";
import moment from "moment";
import SearchAllInwardSeq from "./SearchAllInwardSeq";
import _ from "lodash";
import AdjustmentTable from "./AdjustmentTable";
import { setFormCaption } from "../../../store/actions/currentTran";
import { hasRightToBeUsedNext } from "../../../shared/utility";
const { Option } = Select;
const { TextArea } = Input;
const AdjustmentCard = (props) => {
  const dispatch = useDispatch();
  const refAdd = useRef();
  const refAddConsume = useRef();
  const refAddByProduct = useRef();
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
      Type: "A",
    },
  ];
  const [ItemTable, setItemTable] = useState(initialTable);
  const [reasonsData, setReasonsData] = useState([]);
  const [consumableTable, setConsumableTable] = useState([
    {
      ...initialTable[0],
      Type: "C",
      ReceiptIssue: "I",
    },
  ]);
  const [byProductsTable, setByProductsTable] = useState([
    {
      ...initialTable[0],
      Type: "B",
      ReceiptIssue: "R",
    },
  ]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableConsumeLoading, setTableConsumeLoading] = useState(false);
  const [tableByProductLoading, setTableByProductLoading] = useState(false);
  const [showModal, setShowModal] = useState();
  const [inwardSeqData, setInwardSeqData] = useState({
    data: [],
    record: null,
  });
  const [itemMasterData, setItemMasterData] = useState([]);
  const [searchData, setSearchData] = useState({
    voucherDate: moment(),
    voucherNo: null,
    branch: props.branch ? props.branch.BranchName : null,
    department: props.dept ? props.dept.DeptName : null,
    reason: null,
    remark: null,
  });
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const reasonRights = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 109)[0]
  );
  const l_ConfigPrevDates = useSelector((state) =>
    state.AppMain.appconfigs.find(
      (cur) => cur.configCode === "ENABLE_PREV_DATES"
    )
  );

  useEffect(() => {
    if (searchData.branch !== null) {
      getInvItemMasterData(CompCode, props.branch.BranchCode).then((res1) => {
        setItemMasterData(res1);
      });
    }
    getReasonsMasterData(CompCode).then((res) => {
      setReasonsData(res);
    });
    return () => {
      setItemMasterData([]);
    };
  }, [searchData.branch]);

  const checkItemCode = async (event, record) => {
    let tempTable =
      props.TranType === "ADJS"
        ? ItemTable
        : record.Type === "C"
        ? consumableTable
        : byProductsTable;
    if (
      props.TranType === "REPRO" &&
      record.Type === "B" &&
      byProductsTable.filter(
        (i) =>
          i.ItemCode === record.ItemCode &&
          i.key !== record.key &&
          i.isDeleted === false
      ).length > 0
    ) {
      notification.error({
        message: "Item Already exist",
        description: "item already exist in the table",
      });
      // tempData = [...tempTable];
    } else {
      let findIndex = tempTable.findIndex((aa) => aa.key == record.key);

      let tempData = itemMasterData.find(
        (aa) => aa.ItemCode === event.target.value
      );

      if (tempData) {
        tempTable[findIndex].ItemCode = tempData.ItemCode;
        tempTable[findIndex].ItemName = tempData.ItemName;
        tempTable[findIndex].Qty = null;
        tempTable[findIndex].InwardSeq = null;
        tempTable[findIndex].ReceiptIssue =
          props.TranType === "ADJS" ? null : record.Type === "C" ? "I" : "R";
        tempTable[findIndex].CostPrice = null;
        tempTable[findIndex].SalePrice = null;
        tempTable[findIndex].MRP = null;
        if (
          !tempTable.find((aa) => aa.ItemCode === null || aa.ItemCode === "")
        ) {
          if (props.TranType === "ADJS") {
            await setItemTable([...tempTable]);
            refAdd.current.click();
          } else if (props.TranType === "REPRO") {
            if (record.Type === "C") {
              await setConsumableTable([...tempTable]);
              refAddConsume.current.click();
            } else {
              await setByProductsTable([...tempTable]);
              refAddByProduct.current.click();
            }
          }
        }
        if (record.Type === "C") {
          // refInwardSeqConsume.current[record.key].focus();
        } else if (record.Type === "B") {
          // refInwardSeqByProduct.current[record.key].focus();
        } else {
          refInwardSeq.current[record.key].focus();
        }
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
        if (props.TranType === "ADJS") {
          await setItemTable([...tempTable]);
        } else if (props.TranType === "REPRO") {
          if (record.Type === "C") {
            await setConsumableTable([...tempTable]);
          } else {
            await setByProductsTable([...tempTable]);
          }
        }
      }
    }
  };
  const column = [
    {
      title: "Sr No.",
      dataIndex: "key",
      width: 50,
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
                  setShowModal({ type: "SEARCH_ITEM", record: record });
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
            // autoFocus={true}
            onChange={(e) => {
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
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
      width: 180,
      render: (text, record) => {
        return (
          <Input
            disabled={true}
            value={text}
            placeholder="Item Name"
            onChange={(e) => {
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
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
                ref={(el) =>
                  props.TranType === "ADJS"
                    ? (refInwardSeq.current[record.key] = el)
                    : null
                }
                className="no-style-button"
                onClick={() => {
                  invGetAllInwardSeqInfo(
                    CompCode,
                    props.branch.BranchCode,
                    record.ItemCode
                  ).then((res) => {
                    setInwardSeqData({ data: [...res], record: record });
                    setShowModal({ type: "SEARCH_INWARD_SEQ", record: record });
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
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
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
      width: 135,
      // colSpan: props.TranType === "ADJS" ? undefined : 0,
      render: (text, record) => {
        return (
          <>
            {props.TranType === "ADJS" && (
              <Select
                value={text}
                placeholder="Receipt /issue"
                style={{ width: "100%" }}
                allowClear={true}
                disabled={record.InwardSeq === null}
                onChange={(e) => {
                  let tempTable =
                    props.TranType === "ADJS"
                      ? ItemTable
                      : record.Type === "C"
                      ? consumableTable
                      : byProductsTable;
                  let findIndex = tempTable.findIndex(
                    (aa) => aa.key == record.key
                  );
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
                    if (
                      e === "I" &&
                      record.Qty > record.InwardSeq.CurrentStock
                    ) {
                      tempTable[findIndex].Qty = null;
                      message.error(
                        "Adjustment quantity cannot be greater than current stock"
                      );
                    }
                  }
                  setItemTable([...tempTable]);
                }}
              >
                <Option value="R">Receipt</Option>
                <Option value="I">Issue</Option>
              </Select>
            )}
            {props.TranType === "REPRO" && (
              <Input
                style={{ textAlign: "right" }}
                value={record.Type === "C" ? "Issue" : "Receipt"}
                disabled={true}
              />
            )}
          </>
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
            // max={
            //   record.ReceiptIssue === "I" && record.InwardSeq
            //     ? record.InwardSeq.CurrentStock
            //     : Number.MAX_SAFE_INTEGER
            // }
            placeholder="Qty"
            value={_.includes([undefined, null, ""], text) ? null : text}
            className="bill-input"
            style={{
              width: "100%",
            }}
            onChange={(e) => {
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);

              tempTable[findIndex].Qty = e;
              setItemTable([...tempTable]);
              if (
                record.ReceiptIssue === "I" &&
                record.InwardSeq &&
                record.InwardSeq.CurrentStock < parseFloat(e)
              ) {
                notification.error({
                  message: "Quantity Greater Than Current Stock",
                  description:
                    "adjustment qty cannot be greater than current stock ",
                });
                // e.preventDefault();
              }
            }}
            onBlur={(e) => {
              if (
                record.ReceiptIssue === "I" &&
                record.InwardSeq &&
                record.InwardSeq.CurrentStock < parseFloat(e.target.value)
              ) {
                let tempTable =
                  props.TranType === "ADJS"
                    ? ItemTable
                    : record.Type === "C"
                    ? consumableTable
                    : byProductsTable;
                let findIndex = tempTable.findIndex(
                  (aa) => aa.key == record.key
                );

                tempTable[findIndex].Qty = null;
                setItemTable([...tempTable]);
                notification.error({
                  message: "Quantity Greater Than Current Stock",
                  description:
                    "adjustment qty cannot be greater than current stock ",
                });
              }
            }}
            bordered={false}
          />
        );
      },
    },
    {
      title: "Current Stock",
      dataIndex: "CurrentStock",
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
            disabled={
              props.TranType === "ADJS" || record.Type === "C" ? true : false
            }
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
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);

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
            disabled={
              props.TranType === "ADJS" || record.Type === "C" ? true : false
            }
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
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
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
            disabled={
              props.TranType === "ADJS" || record.Type === "C" ? true : false
            }
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
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
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
      width: 50,
      render: (text, record) => {
        return (
          <>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (props.TranType === "ADJS") {
                  setTableLoading(true);
                } else {
                  if (record.Type === "C") {
                    setTableConsumeLoading(true);
                  } else {
                    setTableByProductLoading(true);
                  }
                }
                setTimeout(() => {
                  let tempTable =
                    props.TranType === "ADJS"
                      ? ItemTable
                      : record.Type === "C"
                      ? consumableTable
                      : byProductsTable;
                  let findIndex = tempTable.findIndex(
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
                  if (props.TranType === "ADJS") {
                    setTableLoading(false);
                  } else {
                    if (record.Type === "C") {
                      setTableConsumeLoading(false);
                    } else {
                      setTableByProductLoading(false);
                    }
                  }
                }, 100);
              }}
            >
              <DeleteTwoTone twoToneColor="#ff1919" />
            </span>
            <span
              style={{ marginLeft: 5, cursor: "pointer" }}
              onClick={() => {
                setShowModal({ type: "ADD_REMARK", record: record });
              }}
            >
              <MessageTwoTone />
            </span>
          </>
        );
      },
    },
  ];
  const onAdjustmentSave = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const AdjustmentHdr = {
          VoucherDate: searchData.voucherDate,
          VoucherNo: searchData.voucherNo,
          CompCode: CompCode,
          BranchCode: props.branch.BranchCode,
          DeptCode: props.dept.DeptCode,
          AdjustmentType: props.TranType,
          Remark: searchData.remark,
          ReasonCode: searchData.reason,
          SysOption1: null,
          SysOption2: null,
          SysOption3: null,
          SysOption4: null,
          SysOption5: null,
          UpdtUsr: l_loginUser,
        };
        let AdjustmentDtl = [];
        let tempTable =
          props.TranType === "ADJS"
            ? ItemTable
            : [...consumableTable, ...byProductsTable];
        let tempDtl = tempTable.filter(
          (aa) =>
            aa.isDeleted === false &&
            !_.includes([null, "", undefined], aa.ItemCode) &&
            !_.includes([null, "", undefined], aa.ItemName)
        );
        tempDtl.forEach((row) =>
          AdjustmentDtl.push({
            RIType: row.ReceiptIssue,
            SrNo: row.key,
            ItemCode: row.ItemCode,
            ScannedBarcode: null,
            InwardSeq: row.InwardSeq !== null ? row.InwardSeq.InwardSeq : null,
            BatchNo: row.BatchNo,
            ExpiryDate: row.ExpiryDate,
            Qty: row.Qty,
            CostPrice: row.CostPrice,
            SalePrice: row.SalePrice,
            MRP: row.MRP,
            Remark: row.remark,
            SysOption1: null,
            SysOption2: null,
            SysOption3: null,
            SysOption4: null,
            SysOption5: null,
            UpdtUsr: l_loginUser,
          })
        );

        let data = {
          AdjustmentHdr,
          AdjustmentDtl,
        };

        await InvSaveAdjustments(CompCode, data)
          .then((res) => {
            resolve(res);
            setTableLoading(false);
            setTableConsumeLoading(false);
            setTableByProductLoading(false);
            if (props.TranType === "ADJS") {
              setItemTable(initialTable);
            } else if (props.TranType === "REPRO") {
              setConsumableTable([
                {
                  ...initialTable[0],
                  Type: "C",
                  ReceiptIssue: "I",
                },
              ]);
              setByProductsTable([
                {
                  ...initialTable[0],
                  Type: "B",
                  ReceiptIssue: "R",
                },
              ]);
            }
            setSearchData({ ...searchData, remark: null, reason: null });
            notification.success({
              message: "Data Saved Successfully",
              description: "the transaction has been successfully saved",
            });
          })
          .catch((err) => {
            setTableLoading(false);
            reject(err);
            notification.error({ message: "Error Occured", description: err });
          });
      } catch (error) {
        reject(error);
      }
    });
  };
  return (
    <>
      {(props.TranType === "ADJS" ||
        props.TranType === "REPRO" ||
        props.TranType === "RAADJ") && (
        <div style={{ marginBottom: 5 }}>
          <Row
            style={{
              backgroundColor: "#FFF",
              borderRadius: 3,
              padding: "0px 0px 5px 5px",
              border: "1px solid var(--app-theme-color)",
            }}
          >
            <Col
              xs={24}
              lg={12}
              style={{ display: "flex", flexFlow: "row wrap" }}
            >
              <Col sm={24} lg={12}>
                <div className="adjust-search-container">
                  <Col span={24} className="adjust-label-container">
                    Voucher Date:
                  </Col>
                  <Col span={24}>
                    <DatePicker
                      placeholder="Voucher Date"
                      className="adjust-input-container"
                      size="small"
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          voucherDate: e,
                        });
                      }}
                      disabledDate={(current) => {
                        return (
                          current > moment().endOf("day") ||
                          (l_ConfigPrevDates.value1 === "N" &&
                            current < moment().endOf("day"))
                        );
                      }}
                      format={l_ConfigDateFormat}
                      value={searchData.voucherDate}
                    />
                  </Col>
                </div>
              </Col>
              <Col sm={24} lg={12}>
                <div className="adjust-search-container">
                  <Col span={24} className="adjust-label-container">
                    Voucher No:
                  </Col>
                  <Col span={24}>
                    <Input
                      placeholder="* Auto Generated *"
                      className="adjust-input-container"
                      size="small"
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          voucherNo: e.target.value,
                        });
                      }}
                      value={searchData.voucherNo}
                      disabled={true}
                    />
                  </Col>
                </div>
              </Col>
              <Col sm={24} lg={12}>
                <div className="adjust-search-container">
                  <Col span={24} className="adjust-label-container">
                    Branch:
                  </Col>
                  <Col span={24}>
                    <Input
                      placeholder="Branch"
                      className="adjust-input-container"
                      size="small"
                      disabled={true}
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          branch: e.target.value,
                        });
                      }}
                      value={searchData.branch}
                    />
                  </Col>
                </div>
              </Col>
              <Col sm={24} lg={12}>
                <div className="adjust-search-container">
                  <Col span={24} className="adjust-label-container">
                    Department:
                  </Col>
                  <Col span={24}>
                    <Input
                      placeholder="Department"
                      className="adjust-input-container"
                      size="small"
                      disabled={true}
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          department: e.target.value,
                        });
                      }}
                      value={searchData.department}
                    />
                  </Col>
                </div>
              </Col>
            </Col>
            <Col
              xs={24}
              lg={12}
              style={{ display: "flex", flexFlow: "row wrap" }}
            >
              <Col sm={24} lg={24}>
                <div className="adjust-search-container">
                  <Col span={24} className="adjust-label-container">
                    Reason:
                  </Col>
                  <Col span={24} style={{ display: "flex" }}>
                    {/* <div style={{ width: "calc(100% - 60px)" }}> */}
                    <div style={{ width: "100%" }}>
                      <Select
                        placeholder="Reason"
                        className="adjust-input-container"
                        size="small"
                        onChange={(e) => {
                          setSearchData({
                            ...searchData,
                            reason: e,
                          });
                        }}
                        allowClear
                        value={searchData.reason}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {reasonsData.length > 0 &&
                          reasonsData.map((cc) => {
                            return (
                              <Option value={cc.ShortCode} key={cc.ShortCode}>
                                {cc.MasterDesc}
                              </Option>
                            );
                          })}
                      </Select>
                    </div>
                    {/* <div style={{ width: 30, textAlign: "center" }}>
                      <Button
                        icon={<PlusOutlined />}
                        shape="circle"
                        type="primary"
                        size="small"
                        disabled={
                          !hasRightToBeUsedNext(reasonRights.Rights, "ADD")
                        }
                      />
                    </div>
                    <div style={{ width: 30, textAlign: "center" }}>
                      <Button
                        icon={<EditOutlined />}
                        shape="circle"
                        type="primary"
                        size="small"
                        disabled={
                          !hasRightToBeUsedNext(reasonRights.Rights, "EDIT")
                        }
                      />
                    </div> */}
                  </Col>
                </div>
              </Col>
              <Col sm={24} lg={24}>
                <div className="adjust-search-container">
                  <Col span={24} className="adjust-label-container">
                    Remark:
                  </Col>
                  <Col span={24}>
                    <Input
                      placeholder="Remark"
                      className="adjust-input-container"
                      size="small"
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          remark: e.target.value,
                        });
                      }}
                      value={searchData.remark}
                    />
                  </Col>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      )}

      {/* Adjustment Table */}
      {props.TranType === "ADJS" && (
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
            scroll={{ y: "71vh", x: 1000, scrollToFirstRowOnChange: true }}
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
        </div>
      )}

      {props.TranType === "REPRO" && (
        <>
          <div
            className="adjustment-table-container"
            style={{
              backgroundColor: "#FFF",
              borderRadius: 3,
              padding: "0px 0px 5px 0px",
              border: "1px solid var(--app-theme-color)",
              borderTopLeftRadius: 17,
            }}
          >
            <div
              style={{
                padding: "0px 0px 0px 15px",
                backgroundColor: "#ff3232",
                borderTopLeftRadius: 17,
              }}
            >
              <div className="repro-table-header">Consumable</div>
              {/* Consumable Tabel */}
              <Table
                loading={tableConsumeLoading}
                dataSource={consumableTable.filter(
                  (tt) => tt.isDeleted === false
                )}
                bordered={true}
                columns={column.filter((cc) => cc.dataIndex !== "ReceiptIssue")}
                className="adjustmentTable"
                style={{
                  borderBottom: "1px solid var(--app-theme-color)",
                  marginBottom: 5,
                }}
                pagination={false}
                scroll={{ y: "71vh", x: 900, scrollToFirstRowOnChange: true }}
              />
            </div>
            <div
              style={{
                padding: "0px 5px",
              }}
            >
              <Button
                type="dashed"
                ref={refAddConsume}
                style={{
                  borderColor: "var(--app-theme-color)",
                  width: "100%",
                }}
                onClick={() => {
                  if (
                    consumableTable.find(
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

                    while (i < consumableTable.length) {
                      newData.push({
                        ...consumableTable[i],
                        key: consumableTable[i].isDeleted === false ? iKey : 0,
                      });
                      if (consumableTable[i].isDeleted === false) {
                        iKey++;
                      }
                      i++;
                    }
                    newData = [
                      ...newData,
                      {
                        ItemCode: null,
                        ItemName: null,
                        ReceiptIssue: "I",
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
                        Type: "C",
                      },
                    ];

                    setConsumableTable([...newData]);
                  }
                }}
              >
                Add New Row
              </Button>
            </div>
          </div>
          <div
            className="adjustment-table-container"
            style={{
              marginTop: 5,
              backgroundColor: "#FFF",
              borderRadius: 3,
              padding: "0px 0px 5px 0px",
              border: "1px solid var(--app-theme-color)",
              borderTopLeftRadius: 17,
            }}
          >
            <div
              style={{
                padding: "0px 0px 0px 15px",
                backgroundColor: "#007600",
                borderTopLeftRadius: 17,
              }}
            >
              <div className="repro-table-header">By Products</div>
              {/* By Product Table */}
              <Table
                loading={tableByProductLoading}
                dataSource={byProductsTable.filter(
                  (tt) => tt.isDeleted === false
                )}
                bordered={true}
                columns={column.filter(
                  (cc) =>
                    !_.includes(
                      ["ReceiptIssue", "CurrentStock", "InwardSeq"],
                      cc.dataIndex
                    )
                )}
                className="adjustmentTable"
                style={{
                  borderBottom: "1px solid var(--app-theme-color)",
                  marginBottom: 5,
                }}
                pagination={false}
                scroll={{ y: "71vh", x: 900, scrollToFirstRowOnChange: true }}
              />
            </div>
            <div
              style={{
                padding: "0px 5px",
              }}
            >
              <Button
                type="dashed"
                ref={refAddByProduct}
                style={{
                  borderColor: "var(--app-theme-color)",
                  width: "100%",
                }}
                onClick={() => {
                  if (
                    byProductsTable.find(
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

                    while (i < byProductsTable.length) {
                      newData.push({
                        ...byProductsTable[i],
                        key: byProductsTable[i].isDeleted === false ? iKey : 0,
                      });
                      if (byProductsTable[i].isDeleted === false) {
                        iKey++;
                      }
                      i++;
                    }
                    newData = [
                      ...newData,
                      {
                        ItemCode: null,
                        ItemName: null,
                        ReceiptIssue: "R",
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
                        Type: "B",
                      },
                    ];

                    setByProductsTable([...newData]);
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
          </div>
        </>
      )}

      <div
        style={{
          backgroundColor: "#FFF",
          padding: "4px 10px",
          marginTop: 5,
          textAlign: "end",
          border: "1px solid var(--app-theme-color)",
          borderRadius: 3,
        }}
      >
        <Button
          type="primary"
          style={{ marginRight: 5 }}
          onClick={() => {
            setTableLoading(true);
            setTableConsumeLoading(true);
            setTableByProductLoading(true);
            if (props.TranType === "ADJS" || props.TranType === "REPRO") {
              let tempData = ItemTable.filter(
                (bb) =>
                  !_.includes([null, undefined, ""], bb.ItemCode) ||
                  !_.includes([null, undefined, ""], bb.ItemName)
              );
              if (tempData.length > 0) {
                if (
                  tempData.filter(
                    (aa) =>
                      ((aa.InwardSeq === null && aa.Type !== "B") ||
                        _.includes([null, undefined, ""], aa.ReceiptIssue) ||
                        _.includes([null, undefined, ""], aa.Qty)) &&
                      aa.isDeleted === false
                  ).length > 0
                ) {
                  notification.error({
                    message: "Empty Values",
                    description:
                      "some of your input are empty, please re-check your data",
                  });
                  setTableLoading(false);
                  setTableConsumeLoading(false);
                  setTableByProductLoading(false);
                } else {
                  onAdjustmentSave().then((res) => {
                    props.onBackPress();
                  });
                }
              } else if (props.TranType === "RAADJ") {
              }
            } else {
              setTableLoading(false);
              setTableConsumeLoading(false);
              setTableByProductLoading(false);
            }
          }}
          icon={<PlusCircleOutlined />}
        >
          Save
        </Button>
        <Button
          type="primary"
          icon={<RetweetOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => {
            props.onBackPress();
          }}
        >
          Back
        </Button>
      </div>
      <Modal
        visible={
          showModal &&
          showModal.type === "SEARCH_ITEM" &&
          showModal.record !== null
        }
        // title={"Add Item"}
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
          selectType={
            props.TranType === "ADJS"
              ? "checkbox"
              : showModal &&
                showModal.record !== null &&
                showModal.record.Type === "C"
              ? "checkbox"
              : "radio"
          }
          onItemSelect={async (data) => {
            if (data) {
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : showModal.record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let tempData = [];
              if (
                props.TranType === "REPRO" &&
                showModal.record.Type === "B" &&
                tempTable.find(
                  (i) => i.ItemCode === data.ItemCode && i.isDeleted === false
                )
              ) {
                notification.error({
                  message: "Item Already exist",
                  description: "item already exist in the table",
                });
                tempData = [...tempTable];
              } else {
                tempData = [
                  ...tempTable.filter(
                    (i) => i.ItemCode !== null && i.ItemName !== null
                  ),
                ];

                let selectedData =
                  props.TranType === "REPRO" && showModal.record.Type === "B"
                    ? [data]
                    : data;
                selectedData.map(async (aa) =>
                  tempData.push({
                    ItemCode: aa.ItemCode,
                    ItemName: aa.ItemName,
                    ReceiptIssue:
                      props.TranType === "ADJS"
                        ? null
                        : showModal.record.Type === "C"
                        ? "I"
                        : "R",
                    Qty: null,
                    InwardSeq: null,
                    CostPrice: null,
                    SalePrice: null,
                    MRP: null,
                    key: tempData.length + 1,
                    remark: null,
                    BatchNo: null,
                    ExpiryDate: null,
                    isDeleted: false,
                    Type:
                      props.TranType === "ADJS"
                        ? "A"
                        : showModal.record.Type === "C"
                        ? "C"
                        : "B",
                  })
                );
              }
              if (props.TranType === "ADJS") {
                await setItemTable([...tempData]);
                refAdd.current.click();
              } else if (props.TranType === "REPRO") {
                if (showModal.record.Type === "C") {
                  setConsumableTable([...tempData]);
                } else {
                  setByProductsTable([...tempData]);
                }
              }
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
      <Modal
        visible={showModal && showModal.type === "SEARCH_INWARD_SEQ"}
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
              let tempTable =
                props.TranType === "ADJS"
                  ? ItemTable
                  : inwardSeqData.record.Type === "C"
                  ? consumableTable
                  : byProductsTable;
              let findIndex = ItemTable.findIndex(
                (aa) => aa.key == inwardSeqData.record.key
              );
              if (findIndex >= 0) {
                tempTable[findIndex].Qty = null;
                tempTable[findIndex].InwardSeq = data;
                tempTable[findIndex].CostPrice = data.Cost;
                tempTable[findIndex].SalePrice = data.Sale;
                if (props.TranType === "ADJS") {
                  tempTable[findIndex].ReceiptIssue = null;
                }
                tempTable[findIndex].MRP = data.MRP;
                setItemTable([...tempTable]);
              }
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
      <Modal
        visible={
          showModal !== undefined &&
          showModal.type === "ADD_REMARK" &&
          showModal.record !== null
            ? true
            : false
        }
        title={"Add Remark"}
        footer={false}
        bodyStyle={{ padding: "10px 10px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
        }}
        width={800}
      >
        {showModal && showModal.record !== null && (
          <div style={{ backgroundColor: "#FFF" }}>
            <div style={{ fontWeight: 600, color: "#000", fontSize: 16 }}>
              Remark :
            </div>
            <div>
              <TextArea
                placeholder="Remark"
                rows={4}
                defaultValue={showModal ? showModal.record.remark : null}
                onChange={(e) => {
                  let tempTable =
                    props.TranType === "ADJS"
                      ? ItemTable
                      : showModal.record.Type === "C"
                      ? consumableTable
                      : byProductsTable;
                  let findIndex = tempTable.findIndex(
                    (aa) => aa.key == showModal.record.key
                  );
                  tempTable[findIndex].remark = e.target.value;
                  if (props.TranType === "ADJS") {
                    setItemTable([...tempTable]);
                  } else if (props.TranType === "REPRO") {
                    if (showModal.record.Type === "C") {
                      setConsumableTable([...tempTable]);
                    } else {
                      setByProductsTable([...tempTable]);
                    }
                  }
                }}
              />
            </div>
            <div style={{ textAlign: "end", padding: "4px 0px" }}>
              <Button
                type="primary"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setShowModal();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdjustmentCard;
