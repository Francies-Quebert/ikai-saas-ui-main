import {
  PlusCircleOutlined,
  EditOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined,
  DeleteTwoTone,
  RetweetOutlined,
  MessageTwoTone,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Modal,
  Button,
  Tooltip,
  Table,
  notification,
  message,
} from "antd";
import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  invGetAllInwardSeqInfo,
  InvGetItemBalanceStockDistinctByInwardSeq,
  InvSaveAdjustments,
  invSaveUpdateAdjustments,
  invValidateBoxNoAdjustment,
} from "../../../services/inventory";
import _ from "lodash";
import {
  getInvItemMasterData,
  getItemCodeFromBarcode,
  invValidateItemCodeInTransaction,
} from "../../../services/opening-stock";

import SelectableItem from "../Adjustment/SelectableItem";
const { TextArea } = Input;
const { Option } = Select;
const AddStockForm = (props) => {
  const [itemMasterData, setItemMasterData] = useState([]);
  const qtyRef = useRef([]);
  const initialTable = [
    {
      ItemCode: null,
      ItemName: null,
      ReceiptIssue: null,
      Qty: null,
      InwardSeq: null,
      PacketNo: null,
      Weight: null,
      EstimatedSalePrice: null,
      key: 1,
      remark: null,
      BatchNo: null,
      ExpiryDate: null,
      isDeleted: false,
      Type: "C",
      ReceiptIssue: "I",
    },
  ];
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    if (props.branch !== null) {
      getInvItemMasterData(CompCode, props.branch).then((res1) => {
        setItemMasterData(res1);
      });
    }
    return () => {
      setItemMasterData([]);
    };
  }, [props.branch]);

  const [showModal, setShowModal] = useState({ type: null, record: null });
  const [tableConsumeLoading, setTableConsumeLoading] = useState(false);
  const [consumableTable, setConsumableTable] = useState(initialTable);
  const [cachedData, setCachedData] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [prevData, setPrevData] = useState();
  const [stockHdrData, setStockHdrData] = useState({
    BoxNo: null,
    TranDate: moment(),
    TranNo: null,
    Remark: null,
  });

  const [stockHdrDataDisable, setStockHdrDataDisable] = useState({
    BoxNo: false,
    TranDate: true,
    TranNo: true,
    Remark: false,
  });

  const editInitialLoad = () => {
    return new Promise(async function (resolve, reject) {
      try {
        setTableConsumeLoading(true);
        // console.log("loading start");
        if (props.entryMode.type === "EDITSTOCK") {
          setStockHdrDataDisable({
            BoxNo: true,
            TranDate: true,
            TranNo: true,
            Remark: false,
          });
          let tempHdrDta = await props.entryMode.record.hdrData;
          let tempDtlData = await props.entryMode.record.dtlData;
          let tempCacheData = await props.entryMode.record.cacheData;
          // console.log(tempHdrDta, tempDtlData, tempCacheData, "EDITSTOCK");
          if (
            props.entryMode.record.hdrData &&
            props.entryMode.record.hdrData.length > 0
          ) {
            setStockHdrData({
              BoxNo: tempHdrDta[0].SysOption1,
              TranDate: moment(tempHdrDta[0].VoucherDate),
              TranNo: tempHdrDta[0].VoucherNo,
              Remark: tempHdrDta[0].Remark,
            });
          }
          // if (tempDtlData.length > 0) {
          //   setConsumableTable(tempDtlData);
          // }
          // if (tempCacheData.length > 0) {
          //   setCachedData(tempCacheData);
          // }
          // console.log(tempDtlData);
          const resolvedData = {
            dtlData: await tempDtlData,
            cacheData: await tempCacheData,
            hdrData: {
              BoxNo: tempHdrDta[0].SysOption1,
              TranDate: moment(tempHdrDta[0].VoucherDate),
              TranNo: tempHdrDta[0].VoucherNo,
              Remark: tempHdrDta[0].Remark,
            },
            prvData: props.entryMode.record.prvData,
          };
          resolve(resolvedData);
        } else {
          resolve(true);
        }
        // console.log("loading resolved");
      } catch (error) {
        // console.log(error, "error");
        reject(error);
      }
    });
  };
  useEffect(() => {
    const initialData = async () => {
      setTableConsumeLoading(true);
      const data = await editInitialLoad();
      if (data && props.entryMode.type === "EDITSTOCK") {
        setPrevData([...props.entryMode.record.prvData]);
        if (data.dtlData && data.dtlData.length > 0) {
          const numData = await Promise.all([data.dtlData]);
          // console.log(numFruits);
          setConsumableTable(numData[0]);
          // const tmpConData =  data.dtlData;
          // if (tmpConData) {
          //   setTimeout(function () {
          //     setConsumableTable(tmpConData);
          //   }, 1000);
          // }
        }
        if (data.cacheData && data.cacheData.length > 0) {
          setCachedData(data.cacheData);
        }
        setTimeout(function () {
          setTableConsumeLoading(false);
        }, 100);
      } else {
        setTimeout(function () {
          setTableConsumeLoading(false);
        }, 100);
      }
    };
    initialData();
    // .then((res) => {
    //   setPrevData([...props.entryMode.record.prvData]);
    //   setTableConsumeLoading(false);
    // })
    // .catch((er) => {
    //   console.log(er, "loading error");
    //   setTableConsumeLoading(false);
    // })
    // .finally(() => {
    //   setTableConsumeLoading(false);
    // });
  }, [props.entryMode.type]);

  //   const checkItemCode = async (event, record) => {};
  const l_loginUser = useSelector((state) => state.LoginReducer.userData);
  const onStockOutSave = (dtlData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(dtlData, "in try 1");
        const AdjustmentHdr = {
          VoucherDate: stockHdrData.TranDate,
          VoucherNo: stockHdrData.TranNo,
          VoucherId:
            props.entryMode.type === "ADDSTOCK"
              ? null
              : props.entryMode.record.hdrData[0].VoucherId,
          CompCode: CompCode,
          BranchCode: props.branch,
          DeptCode: props.department,
          AdjustmentType: "STOCKOUT",
          Remark: stockHdrData.Remark,
          ReasonCode: null,
          SysOption1: stockHdrData.BoxNo,
          SysOption2: _.includes([null, 0, "", NaN, undefined], totalWeight)
            ? 0
            : totalWeight.toFixed(2),
          SysOption3: null,
          SysOption4: null,
          SysOption5: null,
          UpdtUsr: l_loginUser.username,
        };
        let AdjustmentDtl = dtlData;

        let data = {
          AdjustmentHdr,
          AdjustmentDtl,
          AdjustmentPrevDtl:
            props.entryMode.type === "EDITSTOCK"
              ? props.prevData.map((aa) => {
                  return { ...aa, Qty: Math.abs(parseFloat(aa.Qty)) };
                })
              : [],
        };
        // console.log(props.entryMode.record.prvData, "in try 3");

        if (props.entryMode.type === "EDITSTOCK") {
          await invSaveUpdateAdjustments(CompCode, data)
            .then((res) => {
              // console.log(res);
              resolve(res);
              setConsumableTable([]);
              notification.success({
                message: "Data Saved Successfully",
                description: "the transaction has been successfully saved",
              });
              props.onBackPress();
            })
            .catch((err) => {
              setTableConsumeLoading(false);
              setIsLoading(false);
              reject(err);
              notification.error({
                message: "Error Occured",
                description: err,
              });
            });
        } else {
          await InvSaveAdjustments(CompCode, data)
            .then((res) => {
              // console.log(res);
              resolve(res);
              setConsumableTable([]);

              notification.success({
                message: "Data Saved Successfully",
                description: "the transaction has been successfully saved",
              });
            })
            .catch((err) => {
              setTableConsumeLoading(false);
              reject(err);
              notification.error({
                message: "Error Occured",
                description: err,
              });
            });
        }
        // console.log("saving adjustment", data);
      } catch (error) {
        setIsLoading(false);
        setTableConsumeLoading(false);
        reject(error);
      }
    });
  };

  useEffect(() => {
    let tempWeight = 0;

    consumableTable
      .filter((aa) => aa.isDeleted === false)
      .forEach((row) => {
        // console.log();
        if (!_.includes([null, "", undefined, NaN], row.Weight)) {
          // console.log(Number.isNaN(row.Weight));
          // if (!Number.isNaN(row.Weight)) {
          tempWeight = parseFloat(row.Weight) + parseFloat(tempWeight);
          // }
        }
      });
    // console.log(tempWeight);
    setTotalWeight(parseFloat(tempWeight));
    // console.log(tempWeight);
  }, [consumableTable]);

  const checkItemCode = async (ItemCode, record) => {
    let iCode = await getItemCodeFromBarcode(CompCode, ItemCode);

    if (iCode && iCode.length > 0) {
      let itemInfo;
      let stockInfo;
      let tempCached =
        cachedData &&
        cachedData.find((oo) => oo.ItemCode === iCode[0].ItemCode);

      if (tempCached) {
        itemInfo = tempCached;
        stockInfo = tempCached.inwardSeq;
        console.log("if");
      } else {
        let itemInfoData = await invValidateItemCodeInTransaction(
          CompCode,
          iCode[0].ItemCode
        );
        // console.log(itemInfoData);
        stockInfo = await InvGetItemBalanceStockDistinctByInwardSeq(
          CompCode,
          props.branch,
          iCode[0].ItemCode
        );
        itemInfo = itemInfoData.length > 0 ? itemInfoData[0] : null;
        if (itemInfo != null) {
          setCachedData([...cachedData, { ...itemInfo, inwardSeq: stockInfo }]);
        }
        console.log("else");
      }
      // console.log(stockInfo, itemInfo, "itemInfo", "caching data");
      // let a = stockInfo.length > 0 ? stockInfo.map((aa) => +aa.BalQty);
      let tempCurrentStock =
        stockInfo.length > 0
          ? stockInfo.reduce(
              (totalCalories, stockInfo) =>
                totalCalories + parseFloat(stockInfo.BalQty),
              0
            )
          : 0;
      let tempTable = consumableTable;
      let findIndex = tempTable.findIndex((aa) => aa.key == record.key);

      if (itemInfo !== null) {
        if (stockInfo && stockInfo.length > 0) {
          tempTable[findIndex] = {
            ...itemInfo,
            Cost:
              stockInfo[0].CostRate === 0
                ? itemInfo.Cost
                : stockInfo[0].CostRate,
            ReceiptIssue: "I",
            CurrentStock: tempCurrentStock.toFixed(2),
            isDeleted: false,
            IsDisable: true,
          };
        } else {
          tempTable[findIndex] = {
            ...itemInfo,
            Cost: itemInfo.Cost,
            ReceiptIssue: "I",
            CurrentStock: tempCurrentStock.toFixed(2),
            isDeleted: false,
            IsDisable: true,
          };
        }
      } else {
        notification.error({
          message: "Invalid Item Data",
          description: "Please verify item data there seems to be a problem",
        });
      }

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
      setConsumableTable([...newData]);

      setTableConsumeLoading(false);
      if (qtyRef.current[record.key]) {
        qtyRef.current[record.key].focus();
      }
    } else {
      setTableConsumeLoading(false);
      notification.error({
        message: "Invalid Code",
        description: "No Item exist with this code",
      });
    }
    // }
  };

  const createAdjsDtlData = () => {
    return new Promise(async function (resolve, reject) {
      try {
        // console.log('cached data', cachedData)
        // await cachedData.inwardSeq.forEach((rr) => {
        //   tempCachedData.push({
        //     ...rr,
        //     RemainingQty: parseFloat(rr.BalQty),
        //   });
        // });
        let AdjusteDtlData = [];
        // console.log(cachedData)
        // Promise.all([]);
        await consumableTable
          .filter(
            (ll) =>
              ll.isDeleted === false &&
              !_.includes(null, undefined, "", ll.ItemCode) &&
              !_.includes(null, undefined, "", ll.ItemName)
          )
          .map(async (kk) => {
            let tempCachedData = [];

            tempCachedData = cachedData.filter((oo) => {
              return oo.ItemCode === kk.ItemCode;
            });
            console.log(cachedData, tempCachedData, "cachedData");
            let MRP, SaleRate, CostRate;
            // if (tempCachedData.length > 0) {
            //   if (tempCachedData[0].inwardSeq.length > 0) {
            //     console.log(
            //       kk.ItemCode,
            //       "in map",
            //       tempCachedData[0].inwardSeq[0]
            //     );
            //     MRP = tempCachedData[0].inwardSeq[0].MRP;
            //     SaleRate = tempCachedData[0].inwardSeq[0].SaleRate;
            //     CostRate = tempCachedData[0].inwardSeq[0].CostRate;
            //   } else {
            //     MRP = tempCachedData[0].MRP;
            //     SaleRate = tempCachedData[0].SalePrice;
            //     CostRate = 0;
            //     // CostRate = tempCachedData[0].Cost;
            //   }
            // }
            // console.log("CostRate", CostRate ? parseFloat(CostRate) : 0);
            await AdjusteDtlData.push({
              RIType: "I",
              SrNo: AdjusteDtlData.length + 1,
              ItemCode: kk.ItemCode,
              ScannedBarcode: null,
              InwardSeq: -999,
              BatchNo: null,
              ExpiryDate: null,
              Qty: kk.Qty,
              CostPrice: kk.Cost ? parseFloat(kk.Cost) : 0,
              SalePrice: SaleRate
                ? SaleRate
                : kk.SalePrice !== null
                ? kk.SalePrice
                : kk.EstimatedSalePrice,
              MRP:
                MRP && MRP !== null
                  ? MRP
                  : kk.MRP !== null
                  ? kk.MRP
                  : kk.EstimatedSalePrice,
              Remark: kk.remark,
              SysOption1: kk.PacketNo,
              SysOption2: kk.Weight,
              SysOption3: kk.EstimatedSalePrice,
              SysOption4: kk.SysOption4 ? kk.SysOption4 : null,
              SysOption5: "Initial SO",
              SysOption6: null,
              SysOption7: kk.SysOption7 ? kk.SysOption7 : null,
              SysOption8: kk.SysOption8 ? kk.SysOption8 : "UNSOLD",
              SysOption9: kk.SysOption9 ? kk.SysOption9 : null,
              SysOption10: null,
              UpdtUsr: l_loginUser.username,
            });
          });
        // console.log("final data", AdjusteDtlData, cachedData);
        resolve(AdjusteDtlData);
      } catch (error) {
        reject(error);
      }
    });
  };
  const column = [
    {
      title: "Sr No.",
      dataIndex: "key",
      width: 35,
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
            disabled={
              (props.entryMode.type === "EDITSTOCK" && record.isFromDB) ||
              record.IsDisable === true
            }
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
            autoFocus={true}
            onChange={(e) => {
              let tempTable = consumableTable;
              let findIndex = tempTable.findIndex(
                (aa) => aa.key === record.key
              );
              tempTable[findIndex].ItemCode = e.target.value;
              setConsumableTable([...tempTable]);
            }}
            onKeyDown={async (event) => {
              if (
                event.keyCode === 13 ||
                (!event.shiftKey && event.keyCode === 9)
              ) {
                setTableConsumeLoading(true);
                event.preventDefault();
                await checkItemCode(event.target.value, record);
              }
            }}
            // onBlur={async (event) => {
            //   await checkItemCode(event.target.value, record);
            // }}
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
              let tempTable = consumableTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].ItemName = e.target.value;
              setConsumableTable([...tempTable]);
            }}
          />
        );
      },
    },
    // {
    //   title: "Inward Seq",
    //   dataIndex: "InwardSeq",
    //   width: 135,
    //   align: "center",
    //   render: (text, record) => {
    //     return (
    //       <Input
    //         // style={{ paddingLeft: 0, textAlign: "right" }}
    //         className="inwardSeq-input"
    //         addonBefore={
    //           <button
    //             ref={null}
    //             className="no-style-button"
    //             onClick={() => {
    //               invGetAllInwardSeqInfo(1, props.branch, record.ItemCode).then(
    //                 (res) => {
    //                   //   setInwardSeqData({ data: [...res], record: record });
    //                   setShowModal({
    //                     type: "SEARCH_INWARD_SEQ",
    //                     record: record,
    //                   });
    //                 }
    //               );
    //             }}
    //           >
    //             <Tooltip title="Search Inward Seq">
    //               <i>
    //                 <InfoCircleOutlined className="info-cirlce" />
    //               </i>
    //             </Tooltip>
    //           </button>
    //         }
    //         disabled={true}
    //         value={text !== null ? text.InwardSeq : null}
    //         placeholder="Inward Seq"
    //         style={{ width: "100%", textAlign: "center" }}
    //         onChange={(e) => {
    //           let tempTable = consumableTable;
    //           let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
    //           tempTable[findIndex].InwardSeq = e.target.value;
    //           setConsumableTable([...tempTable]);
    //         }}
    //       />
    //     );
    //   },
    // },
    {
      title: "Out Qty",
      dataIndex: "Qty",
      width: 115,
      align: "center",
      render: (text, record) => {
        return (
          <InputNumber
            ref={(el) => (qtyRef.current[record.key] = el)}
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
              let tempTable = consumableTable;
              let findIndex = tempTable.findIndex(
                (aa) => aa.key === record.key
              );

              // console.log(record, e);
              if (!_.includes([null, undefined, "", NaN], e)) {
                tempTable[findIndex].Qty = e;
              } else {
                tempTable[findIndex].Qty = 0;
              }
              // if (
              //   record.ReceiptIssue === "I" &&
              //   record.CurrentStock &&
              //   record.CurrentStock < parseFloat(e)
              // ) {
              //   tempTable[findIndex].Qty = 0;
              //   notification.error({
              //     message: "Quantity Greater Than Current Stock",
              //     description: "qty cannot be greater than current stock ",
              //   });
              //   // e.preventDefault();
              // } else {
              //   let filteredData = consumableTable.filter(
              //     (aa) =>
              //       aa.ItemCode === record.ItemCode && aa.key !== record.key
              //   );
              //   let totalQty = 0;
              //   filteredData.forEach((aa) => {
              //     totalQty = totalQty + aa.Qty;
              //   });
              //   totalQty = totalQty + e;
              //   if (totalQty > record.CurrentStock) {
              //     notification.error({
              //       message: "Quantity Greater than Current Stock",
              //     });

              //     // tempTable[findIndex].Qty =
              //     //   record.CurrentStock - (totalQty - record.CurrentStock);
              //   }
              // }
              setConsumableTable([...tempTable]);
            }}
            min={0}
            disabled={
              _.includes([null, "", undefined], record.ItemCode) ||
              _.includes([null, "", undefined], record.ItemName)
            }
            // onBlur={(e) => {
            //   let tempTable = consumableTable;
            //   let findIndex = tempTable.findIndex(
            //     (aa) => aa.key === record.key
            //   );
            //   let filteredData = consumableTable.filter(
            //     (aa) => aa.ItemCode === record.ItemCode && aa.key !== record.key
            //   );
            //   let totalQty = 0;
            //   filteredData.forEach((aa) => {
            //     totalQty = parseFloat(totalQty) + parseFloat(aa.Qty);
            //   });
            //   totalQty = parseFloat(totalQty) + parseFloat(e.target.value);
            //   if (totalQty > parseFloat(record.CurrentStock)) {
            //     notification.error({
            //       message: "Quantity Greater than Current Stock",
            //     });
            //     // console.log(totalQty, record.CurrentStock);
            //     tempTable[findIndex].Qty =
            //       parseFloat(record.CurrentStock) -
            //       (totalQty - parseFloat(record.CurrentStock));
            //   }
            //   setConsumableTable([...tempTable]);
            //   //   let filteredData = consumableTable.filter(
            //   //     (aa) => aa.ItemCode === record.ItemCode && aa.key !== record.key
            //   //   );
            //   //   let totalQty = 0;
            //   //   filteredData.forEach((aa) => {
            //   //     totalQty = totalQty + aa.Qty;
            //   //   });
            //   //   console.log(totalQty);
            //   // }}
            //   // onBlur={(e) => {
            //   //   console.log(
            //   //     record,
            //   //     record.InwardSeq
            //   //       ? record.InwardSeq.CurrentStock < parseFloat(e.target.value)
            //   //       : "no",
            //   //     e.target.value
            //   //   );
            //   //   if (
            //   //     record.ReceiptIssue === "I" &&
            //   //     record.InwardSeq &&
            //   //     record.InwardSeq.CurrentStock < parseFloat(e.target.value)
            //   //   ) {
            //   //     let tempTable = consumableTable;
            //   //     let findIndex = tempTable.findIndex(
            //   //       (aa) => aa.key == record.key
            //   //     );

            //   //     tempTable[findIndex].Qty = null;
            //   //     setConsumableTable([...tempTable]);
            //   //     notification.error({
            //   //       message: "Quantity Greater Than Current Stock",
            //   //       description:
            //   //         "Stock qty cannot be greater than current stock ",
            //   //     });
            //   //   }
            // }}
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
            value={record.CurrentStock ? record.CurrentStock : "N/A"}
            disabled={true}
          />
        );
      },
    },
    {
      title: "Cost Price",
      dataIndex: "Cost",
      align: "center",
      width: 100,
      render: (text, record) => {
        return (
          <InputNumber
            precision={2}
            className="bill-input"
            style={{ textAlign: "right" }}
            value={record.Cost ? record.Cost : "N/A"}
            onChange={(e) => {
              let tempTable = consumableTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);

              tempTable[findIndex].Cost = e;
              // console.log(tempTable[findIndex], tempTable);
              setConsumableTable([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "Packet No",
      dataIndex: "PacketNo",
      align: "right",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return (
          <Input
            precision={2}
            // disabled={true}
            disabled={
              _.includes([null, "", undefined], record.ItemCode) ||
              _.includes([null, "", undefined], record.ItemName)
            }
            value={_.includes([undefined, null, ""], text) ? null : text}
            placeholder="Packet No"
            className="bill-input"
            style={{
              width: "100%",
            }}
            // bordered={false}
            onChange={(e) => {
              let tempTable = consumableTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);

              tempTable[findIndex].PacketNo = e.target.value;
              // console.log(tempTable[findIndex], tempTable);
              setConsumableTable([...tempTable]);
            }}
            onBlur={(e) => {
              if (!_.includes([null, "", undefined], record.ItemCode)) {
                let tempTable = consumableTable;
                let findValue = consumableTable.find(
                  (aa) =>
                    aa.ItemCode === record.ItemCode &&
                    aa.PacketNo === e.target.value &&
                    aa.key !== record.key
                );

                if (findValue) {
                  let findValueIndex = consumableTable.findIndex(
                    (aa) =>
                      aa.ItemCode === record.ItemCode &&
                      aa.PacketNo === e.target.value &&
                      aa.key === record.key
                  );

                  tempTable[findValueIndex].Qty = null;
                  tempTable[findValueIndex].PacketNo = null;
                  tempTable[findValueIndex].ItemName = null;
                  tempTable[findValueIndex].ItemCode = null;
                  tempTable[findValueIndex].CurrentStock = null;
                  tempTable[findValueIndex].Weight = null;
                  tempTable[findValueIndex].EstimatedSalePrice = null;
                  tempTable[findValueIndex].IsDisable = false;
                  // console.log(tempTable, "tempTable");
                  setConsumableTable([...tempTable]);
                  notification.error({
                    message: `Item Aready Exist at Sr No. ${findValue.key}`,
                  });
                }
              }
            }}
          />
        );
      },
    },
    {
      title: "Weight",
      dataIndex: "Weight",
      align: "right",
      width: 95,
      fixed: "right",
      render: (text, record) => {
        return (
          <InputNumber
            min={0}
            precision={2}
            // disabled={true}
            disabled={
              _.includes([null, "", undefined], record.ItemCode) ||
              _.includes([null, "", undefined], record.ItemName)
            }
            value={
              _.includes([undefined, null, ""], text)
                ? null
                : parseFloat(text).toFixed(2)
            }
            placeholder="Weight"
            className="bill-input"
            style={{
              width: "100%",
            }}
            onChange={async (e) => {
              let tempTable = consumableTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].Weight = e;
              setConsumableTable([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "Estimated Price",
      dataIndex: "EstimatedSalePrice",
      align: "right",
      fixed: "right",
      width: 95,
      render: (text, record) => {
        return (
          <InputNumber
            min={0}
            precision={2}
            disabled={
              _.includes([null, "", undefined], record.ItemCode) ||
              _.includes([null, "", undefined], record.ItemName)
            }
            // disabled={true}
            value={
              _.includes([undefined, null, ""], text)
                ? null
                : parseFloat(text).toFixed(2)
            }
            placeholder="Estm Price"
            className="bill-input"
            style={{
              width: "100%",
            }}
            bordered={false}
            onChange={(e) => {
              let tempTable = consumableTable;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].EstimatedSalePrice = e;
              setConsumableTable([...tempTable]);
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
                setTableConsumeLoading(true);

                setTimeout(() => {
                  let tempTable = consumableTable;
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
                  setConsumableTable(newData);

                  setTableConsumeLoading(false);

                  // console.log(newData, "newData");
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

  const [IsLoading, setIsLoading] = useState(false);
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  return (
    <>
      <div
        style={{
          height: "100%",
          display: IsLoading ? "flex" : "none",
          backgroundColor: "#ECECEC",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingOutlined spin style={{ fontSize: 85 }} />
      </div>
      <Row
        style={{
          backgroundColor: "#FFF",
          borderRadius: 3,
          display: IsLoading ? "none" : "flex",
        }}
      >
        <Col
          xs={24}
          style={{
            backgroundColor: "var(--app-theme-color)",
            color: "#FFF",
            padding: "2px 10px",
            // fontWeight: "600",
            fontSize: 16,
          }}
        >
          Stock Out
        </Col>
        <Row
          style={{
            borderRadius: 3,
            border: "2px solid var(--app-theme-color)",
            padding: "0px 10px 5px 10px",
            width: "100%",
          }}
        >
          {/* <Col
            xs={24}
            sm={12}
            // lg={6}
            style={{
              display: "flex",
              flexFlow: "row wrap",
            }}
          >
            <Col xs={24}>
              <div
                className="adjust-search-container"
                style={{ backgroundColor: "#FFF", border: 0 }}
              >
                <Col span={24}>Party Name:</Col>
                <Col span={24}>
                  <Select
                    placeholder="Party"
                    // className="adjust-input-container"
                    style={{ width: "100%" }}
                    size="small"
                    onChange={(e) => {}}
                    // value={searchData.voucherDate}
                  ></Select>
                </Col>
              </div>
            </Col>
          </Col> */}{" "}
          <Col
            xs={24}
            sm={6}
            // lg={8}
            style={{ display: "flex", flexFlow: "row wrap" }}
          >
            <Col xs={24}>
              <div
                className="adjust-search-container"
                // style={{ backgroundColor: "#FFF", border: 0 }}
              >
                <Col
                  span={24}
                  style={{ fontWeight: "normal" }}
                  className="adjust-label-container"
                >
                  Tran No
                </Col>
                <Col span={24} style={{ display: "flex" }}>
                  <DatePicker
                    placeholder="Tran Date"
                    // className="adjust-input-container"
                    size="small"
                    className="adjustment-container"
                    disabled={stockHdrDataDisable.TranDate}
                    onChange={(e) => {
                      setStockHdrData({
                        ...stockHdrData,
                        TranDate: e,
                      });
                    }}
                    style={{ width: "50%" }}
                    format={l_ConfigDateFormat}
                    value={stockHdrData.TranDate}
                  />
                  <InputNumber
                    placeholder="Tran No"
                    disabled={stockHdrDataDisable.TranNo}
                    className="adjust-input-container"
                    size="small"
                    value={stockHdrData.TranNo}
                    style={{ width: "50%" }}
                    onChange={(e) => {
                      setStockHdrData({
                        ...stockHdrData,
                        TranNo: e,
                      });
                    }}
                    // value={searchData.voucherDate}
                  />
                </Col>
              </div>
            </Col>
          </Col>
          <Col
            xs={24}
            sm={8}
            // lg={6}
            style={{ display: "flex", flexFlow: "row wrap" }}
          >
            <Col xs={24}>
              <div
                className="adjust-search-container"
                // style={{ backgroundColor: "#FFF", border: 0 }}
              >
                <Col
                  span={24}
                  className="adjust-label-container"
                  style={{ fontWeight: "normal" }}
                >
                  Box No <span style={{ color: "red" }}>*</span> / Total Weight
                </Col>
                <Col span={24} style={{ display: "flex" }}>
                  <Input
                    placeholder="Box No"
                    className="adjust-input-container"
                    size="small"
                    style={{ width: "50%" }}
                    onChange={(e) => {
                      setStockHdrData({
                        ...stockHdrData,
                        BoxNo: e.target.value,
                      });
                    }}
                    disabled={stockHdrDataDisable.BoxNo}
                    value={stockHdrData.BoxNo}
                  />
                  <InputNumber
                    placeholder="Total Weight"
                    disabled={false}
                    // style={{ color: "#000" }}
                    className="adjustment-container"
                    // className="adjust-input-container"
                    size="small"
                    value={
                      _.includes([null, 0, "", NaN, undefined], totalWeight)
                        ? null
                        : totalWeight.toFixed(2)
                    }
                    style={{ width: "50%" }}
                    onChange={(e) => {
                      setTotalWeight(e);
                    }}
                    // value={searchData.voucherDate}
                  />
                </Col>
              </div>
            </Col>
          </Col>
          <Col
            xs={24}
            sm={10}
            // lg={6}
            style={{ display: "flex", flexFlow: "row wrap" }}
          >
            <Col
              xs={24}
              // style={{ padding: "5px 0px" }}
              className="adjust-search-container"
            >
              <Col span={24} className="adjust-label-container">
                Remark
              </Col>
              <Col span={24}>
                <Input
                  size="small"
                  placeholder="Remark"
                  // style={{ height: "100%" }}
                  disabled={stockHdrDataDisable.Remark}
                  value={stockHdrData.Remark}
                  onChange={(e) => {
                    setStockHdrData({
                      ...stockHdrData,
                      Remark: e.target.value,
                    });
                  }}
                />
              </Col>
            </Col>
          </Col>
          <Col span="24">
            <div
              className="adjustment-table-container"
              style={{
                backgroundColor: "#FFF",
                borderRadius: 3,
                margin: "5px 0px 5px 0px",
                border: "1px solid var(--app-theme-color)",
                paddingBottom: 5,
                // borderTopLeftRadius: 17,
              }}
            >
              <div
              // style={{
              //   padding: "0px 0px 0px 15px",
              //   backgroundColor: "#ff3232",
              //   borderTopLeftRadius: 17,
              // }}
              >
                {/* <div className="repro-table-header">Consumable</div> */}
                {/* Consumable Tabel */}
                {/* {console.log(tableConsumeLoading, "loading")} */}
                <Table
                  loading={tableConsumeLoading || consumableTable.length <= 0}
                  dataSource={consumableTable
                    .filter((tt) => tt.isDeleted === false)
                    .sort((a, b) =>
                      parseFloat(a.key) > parseFloat(b.key) ? 1 : -1
                    )}
                  bordered={true}
                  columns={column.filter(
                    (cc) => cc.dataIndex !== "ReceiptIssue"
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
                  //   ref={refAddConsume}
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
                            aa.ItemName === "" ||
                            _.includes([null, "", undefined], aa.PacketNo) ||
                            _.includes([null, "", undefined], aa.Weight) ||
                            _.includes(
                              [null, "", undefined],
                              aa.EstimatedSalePrice
                            )) &&
                          aa.isDeleted === false
                      )
                    ) {
                      message.error("Required Fields Cannot Be Empty");
                    } else {
                      let newData = [];
                      let i = 0;
                      let iKey = 1;

                      while (i < consumableTable.length) {
                        newData.push({
                          ...consumableTable[i],
                          key:
                            consumableTable[i].isDeleted === false ? iKey : 0,
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
                          Cost: null,
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

                      // console.log(newData);
                      setConsumableTable([...newData]);
                    }
                  }}
                >
                  Add New Row
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Row>
      <Row
        style={{
          border: "1px solid var(--app-theme-color)",
          borderRadius: 3,
          width: "100%",
          backgroundColor: "#FFF",
          padding: "3px 5px",
          borderTop: 0,
        }}
      >
        <Button
          type="primary"
          disabled={
            IsLoading ||
            tableConsumeLoading ||
            (consumableTable.length > 0 &&
              consumableTable.filter(
                (aa) =>
                  aa.isDeleted === false &&
                  !_.includes(null, undefined, "", aa.ItemCode) &&
                  !_.includes(null, undefined, "", aa.ItemName)
              ).length <= 0)
          }
          style={{ marginRight: 5 }}
          icon={<PlusCircleOutlined />}
          onClick={async () => {
            if (_.includes([null, undefined, ""], stockHdrData.BoxNo)) {
              notification.error({ message: "Box No cannot be empty" });
            } else {
              let t_EmptyValArr = [null, undefined, ""];

              let t_DtlData = consumableTable.filter(
                (tt) =>
                  tt.isDeleted === false &&
                  !_.includes(t_EmptyValArr, tt.ItemCode) &&
                  !_.includes(t_EmptyValArr, tt.ItemName)
              );
              // console.log(t_DtlData, "ssss");

              if (t_DtlData.length > 0) {
                let BoxNo = await invValidateBoxNoAdjustment(
                  CompCode,
                  stockHdrData.BoxNo
                );
                // let Dtldata = await createAdjsDtlData();
                // console.log("hari", Dtldata);
                // return;
                if (props.entryMode.type === "EDITSTOCK" || BoxNo.length <= 0) {
                  setIsLoading(true);
                  setTableConsumeLoading(true);
                  let Dtldata = await createAdjsDtlData();
                  console.log(Dtldata, "FINAL dATA");

                  if (Dtldata) {
                    onStockOutSave(
                      Dtldata.filter(
                        (aa) => !_.includes([null, undefined, ""], aa.ItemCode)
                      )
                    )
                      .then((res) => {
                        setIsLoading(false);
                        setTableConsumeLoading(false);
                        props.onBackPress();
                      })
                      .catch((err) => {
                        setIsLoading(false);
                        setTableConsumeLoading(false);
                      });
                  }
                } else {
                  notification.error({
                    message: "Duplicate Box No",
                    description: "Box No already exists enter a unique no",
                  });
                }
              } else {
                notification.error({
                  message: "No Item Inserted",
                  description: "No of item cannot be zero",
                });
              }
            }
          }}
        >
          Save
        </Button>
        <Button
          type="primary"
          style={{ marginRight: 5 }}
          icon={<RetweetOutlined />}
          onClick={() => {
            props.onBackPress();
          }}
        >
          Back
        </Button>
      </Row>
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
                  let tempTable = consumableTable;
                  let findIndex = tempTable.findIndex(
                    (aa) => aa.key == showModal.record.key
                  );
                  tempTable[findIndex].remark = e.target.value;
                  // console.log("remarl", tempTable);
                  setConsumableTable([...tempTable]);
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
      <Modal
        visible={
          showModal &&
          showModal.type === "SEARCH_ITEM" &&
          showModal.record !== null
        }
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
          selectType={"radio"}
          onItemSelect={async (data) => {
            if (data) {
              checkItemCode(data.ItemCode, showModal.record);
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
    </>
  );
};

export default AddStockForm;
