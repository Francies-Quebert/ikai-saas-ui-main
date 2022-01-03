import {
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Select,
  DatePicker,
  Tooltip,
  notification,
  message,
} from "antd";
import React, { useState, useEffect, useRef } from "react";
import {
  PlusOutlined,
  EditOutlined,
  RetweetOutlined,
  PlusCircleOutlined,
  UserOutlined,
  PrinterOutlined,
  LoadingOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined,
  DeleteTwoTone,
  MessageTwoTone,
} from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymodeMaster } from "../../../../services/payModeMaster";
import { fetchBranchMasterData } from "../../../../services/branch-master";
import { fetchDeptMasterService } from "../../../../services/department-master";
import {
  getInvItemMasterData,
  getItemCodeFromBarcode,
} from "../../../../services/opening-stock";
import SelectableItem from "../../Adjustment/SelectableItem";
import _ from "lodash";
import {
  invGetAllInwardSeqInfo,
  InvGetTransactionTypes,
  invSavePurchaseReturnInvoice,
} from "../../../../services/inventory";
import { getUnitMaster } from "../../../../services/unit-master";
import StockDistinctPrice from "../../../sales/StockDistinctPrice";
import SupplierMasterComp from "../../../portal/backoffice/SupplierMaster/SupplierMasterComp";
import { fetchSupplierMasterComp } from "../../../../services/supplier-master-comp";
import { fetchStateMasters } from "../../../../store/actions/StateMaster";
import { fetchCountryMasters } from "../../../../store/actions/CountryMaster";
import { fetchCityMasters } from "../../../../store/actions/CityMaster";
// import PurchaseSummaryComponent from "../../../purchases/PurchaseSummaryComponent";
import PurchaseSummaryComponent from "./PurchaseReturnSummary";
import SearchSupplier from "../../../purchases/SearchSupplier";
import { getTaxMaster } from "../../../../services/taxMaster";
import SearchAllInwardSeq from "../../Adjustment/SearchAllInwardSeq";
import DiscountAdditionalIncomeExpenseComp from "../../../sales/DiscountAdditionalIncomeExpenseComp";
import { RoundConfiguredValue } from "../../../../shared/utility";

const { Option } = Select;

const PurchaseReturnCard = (props) => {
  const dispatch = useDispatch();
  const refAdd = useRef();
  const refInwardSeq = useRef([]);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const initialSearchData = {
    branch: null,
    department: null,
    voucherNo: null,
    voucherDate: moment(),
    voucherType: null,
    saleType: "GST_INC",
    supplierId: null,
    supplierName: null,
    refDate: null,
    refNo: null,
    pBillNo: null,
    pBillDate: null,
    creditDays: null,
    eWaybillNo: null,
    vehicleNo: null,
  };
  const initialSummaryValues = {
    GrossAmount: 0,
    Discount: 0,
    TaxAmount: 0,
    AddIncomeAndExpenses: 0,
    RoundOff: 0,
    NetAmount: 0,
    TaxType: "I",
  };

  const initialTable = [
    {
      key: 1,
      ScannedBarcode: null,
      ItemCode: null,
      ItemName: null,
      InwardSeq: null,
      BatchNo: null,
      ExpiryDate: null,
      Qty: 0,
      CostPrice: 0,
      LCostPrice: 0,
      ItemGrossAmount: 0,
      ItemDiscount: 0,
      TaxCode: null,
      TaxPer: null,
      TaxAmount: 0,
      SalePrice: 0,
      MRP: 0,
      DiscPer: 0,
      DiscAmount: 0,
      CGST: 0,
      SGST: 0,
      IGST: 0,
      UGST: 0,
      Surcharge: 0,
      Cess: 0,
      remark: null,
      ItemTotalAmount: 0,
      isDeleted: false,
    },
  ];
  const [discount, setDiscount] = useState(null);
  const [addIncomeExpense, setAddIncomeExpense] = useState([]);
  const [voucherSummary, setVoucherSummary] = useState(initialSummaryValues);
  const [searchData, setSearchData] = useState(initialSearchData);
  const [IsLoading, setIsLoading] = useState(false);
  const [BranchMaster, setBranchMaster] = useState();
  const [DeptMaster, setDeptMaster] = useState();
  const [TranType, setTranType] = useState();
  const [showModal, setShowModal] = useState();
  const [itemMasterData, setItemMasterData] = useState([]);
  const [ItemTableData, setItemTableData] = useState(initialTable);
  const [inwardSeqData, setInwardSeqData] = useState({
    data: [],
    record: null,
  });
  const [supplierData, setSupplierData] = useState([]);
  const [unitMaster, setUnitMaster] = useState();
  const [taxMaster, setTaxMaster] = useState([]);
  const currTran = useSelector((state) => state.currentTran);
  const [distcountInfo, setDiscountInfo] = useState({
    Source: "",
    PercValue: 0,
    AmountValue: 0,
  });

  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const l_Currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const roundOffConfigs = useSelector((state) => state.AppMain.roundOffConfigs);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const l_ConfigPrevDates = useSelector((state) =>
    state.AppMain.appconfigs.find(
      (cur) => cur.configCode === "ENABLE_PREV_DATES"
    )
  );

  // useEffect(() => {
  //   let tempTotalPaid = 0;
  //   paymentMode
  //     .filter((bb) => bb.IsChecked === true && bb.IsActive === 1)
  //     .map((aa) => {
  //       tempTotalPaid += aa.Amount;
  //     });
  //   setTotalAmountPaid(tempTotalPaid);
  // }, [paymentMode]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let branch = null;
      let depart = null;
      let TranType = null;

      //fetchBranchMasterData
      await fetchBranchMasterData(CompCode).then((brnh) => {
        if (brnh.length > 0) {
          setBranchMaster(brnh.filter((ii) => ii.IsActive === true));
          branch = brnh[0].BranchCode;
        }
      });

      //fetchDeptMasterService
      await fetchDeptMasterService(CompCode).then((dept) => {
        if (dept.length > 0) {
          depart = dept[0].DeptCode;
          setDeptMaster(dept.filter((dd) => dd.IsActive.data[0] === 1));
        }
      });

      //getUnitMaster
      // await getUnitMaster().then((uu) => {
      //   if (uu.length > 0) {
      //     setUnitMaster(uu.filter((uf) => uf.IsActive === true));
      //   }
      // });

      await InvGetTransactionTypes(CompCode, "PURRTN").then((trantype) => {
        if (trantype.length > 0) {
          TranType = trantype[0].TranConfigCode;
          setTranType(trantype);
        }
      });

      // getTaxMaster;
      await getTaxMaster(CompCode).then((res) => {
        setTaxMaster(res.filter((tx) => tx.IsActive === true));
      });

      setSearchData({
        ...searchData,
        branch: branch,
        department: depart,
        voucherType: TranType,
      });
    }

    fetchData();
    dispatch(fetchCountryMasters());
    dispatch(fetchStateMasters());
    dispatch(fetchCityMasters());
    fetchSupplierMasterComp(CompCode).then((res) => {
      setSupplierData(res.filter((aa) => aa.IsActive === true));
    });
  }, []);

  useEffect(() => {
    if (searchData.branch !== null) {
      getInvItemMasterData(CompCode, searchData.branch.BranchCode).then(
        (res1) => {
          setItemMasterData(res1);
          setIsLoading(false);
        }
      );
    }
    return () => {
      setItemMasterData([]);
      setIsLoading(false);
    };
  }, [searchData.branch]);

  // useEffect(() => {
  //   async function calc() {
  //     if (ItemTableData.length > 0) {
  //       let l_totalgross = 0;
  //       let l_totalDiscount = 0;
  //       let l_totaltax = 0;
  //       let l_AdditionalIE = 0;
  //       let l_roundoff = 0;
  //       let l_NetAmount = 0;

  //       let lv_DiscInfo = distcountInfo;
  //       let lv_AddIncomeExpenses = addIncomeExpense;
  //       let lv_TaxType = "I";
  //       let lv_TaxAfterDiscOrBeforeDiscount = "A";

  //       ItemTableData.filter((aa) => aa.ItemCode !== null).forEach((xx, zz) => {
  //         console.log(xx,"dd");
  //         l_totalgross += xx.ItemGrossAmount ? xx.ItemGrossAmount : 0;
  //         l_totalDiscount += xx.ItemDiscount ? xx.ItemDiscount : 0;
  //         l_totaltax += xx.TaxAmount ? xx.TaxAmount : 0;
  //       });

  //       // l_NetAmount = l_totalgross - l_totalDiscount + l_totaltax;

  //       console.log(lv_DiscInfo, "discount");

  //       if (lv_AddIncomeExpenses.length > 0) {
  //         lv_AddIncomeExpenses.map((ie) => {
  //           if (ie.IEtype === "I") {
  //             l_AdditionalIE += parseFloat(ie.amount);
  //           } else {
  //             l_AdditionalIE -= parseFloat(ie.amount);
  //           }
  //         });
  //       }

  //       if (lv_TaxType === "I") {
  //         l_NetAmount =
  //           l_totalgross - l_totalDiscount + l_AdditionalIE + l_totaltax;
  //       } else if (lv_TaxType === "E") {
  //         l_NetAmount =
  //           l_totalgross - l_totalDiscount - l_totaltax + l_AdditionalIE;
  //       }

  //       l_roundoff = await RoundConfiguredValue(
  //         roundOffConfigs,
  //         "PURRTN",
  //         l_NetAmount
  //       );

  //       setVoucherSummary({
  //         ...voucherSummary,
  //         GrossAmount: parseFloat(l_totalgross).toFixed(2),
  //         Discount: _.round(l_totalDiscount, 0),
  //         TaxInclusiveOrExclusive: lv_TaxType,
  //         TaxAmount: parseFloat(l_totaltax).toFixed(2),
  //         AddIncomeAndExpenses: parseFloat(l_AdditionalIE).toFixed(2),
  //         RoundOff: parseFloat(l_roundoff).toFixed(2),
  //         NetAmount: parseFloat(l_NetAmount + l_roundoff).toFixed(2),
  //       });
  //     }
  //   }
  //   calc();
  // }, [ItemTableData, addIncomeExpense]);

  const checkItemCode = async (event, record) => {
    return new Promise(async function (resolve, reject) {
      try {
        let tempTable = ItemTableData;
        let iCode = await getItemCodeFromBarcode(
          CompCode,
          record.ItemCode ? record.ItemCode : null
        );
        let findIndex = tempTable.findIndex((aa) => aa.key === record.key);

        if (iCode.length > 0) {
          let tempData = await itemMasterData.find(
            (aa) => aa.ItemCode === iCode[0].ItemCode
          );

          // // console.log(tempData, "await");
          if (tempData) {
            tempTable[findIndex].ScannedBarcode = record.ItemCode;
            tempTable[findIndex].ItemCode = await tempData.ItemCode;
            tempTable[findIndex].ItemName = await tempData.ItemName;
            tempTable[findIndex].Qty = 0;
            tempTable[findIndex].InwardSeq = null;
            tempTable[findIndex].CostPrice = null;
            tempTable[findIndex].SalePrice = null;
            tempTable[findIndex].MRP = null;

            //calling add click after changing values
            if (
              !tempTable.find(
                (aa) => aa.ItemCode === null || aa.ItemCode === ""
              )
            ) {
              if (tempTable && tempTable.length > 0) {
                refAdd.current.click();
                // await CalcFnc([...tempTable]);
                await setItemTableData([...tempTable]);
              }
            }

            //changing focus to inward sequence in current row

            refInwardSeq.current[record.key].focus();
          } else {
            if (event.target.value !== "" && event.target.value !== null) {
              message.error("Incorrect Item Code");
            }
            if (tempTable && tempTable.length > 0) {
              // await CalcFnc([...tempTable]);
              await setItemTableData([...tempTable]);
            }
          }
          // }
        } else {
          // Changing values to null if incase of invalid item
          notification.error({
            message: "Invalid Code",
            description: "No Item exist with this code",
          });
          tempTable[findIndex].ScannedBarcode = null;
          tempTable[findIndex].ItemCode = null;
          tempTable[findIndex].ItemName = null;
          tempTable[findIndex].Qty = null;
          tempTable[findIndex].InwardSeq = null;
          tempTable[findIndex].CostPrice = null;
          tempTable[findIndex].SalePrice = null;
          tempTable[findIndex].MRP = null;
          tempTable[findIndex].isDeleted = false;
          await setItemTableData([...tempTable]);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  async function CalcFnc(pTableData, pDiscountInfo, pAddIncomeExpenses) {
    try {
      let lv_TableData = pTableData
        ? pTableData.filter((aa) => aa.ItemCode && aa.isDeleted === false)
        : ItemTableData.filter((aa) => aa.ItemCode && aa.isDeleted === false);

      let lv_AddIncomeExpenses = pAddIncomeExpenses
        ? pAddIncomeExpenses
        : addIncomeExpense;

      //set DiscountInfo

      //Calc Summary
      let l_GrossAmount = 0;
      let l_Discount = 0;
      let l_TaxAmount = 0;
      let l_AddIncomeAndExpenses = 0;
      let l_NetAmountBeforeRoundOff = 0;
      let l_RoundOff = 0;

      lv_TableData.forEach((row) => {
        l_GrossAmount += row.ItemGrossAmount;
        l_Discount += row.ItemDiscount;
        l_TaxAmount += parseFloat(row.TaxAmount);
      });

      if (lv_AddIncomeExpenses.length > 0) {
        lv_AddIncomeExpenses.map((ie) => {
          if (ie.IEtype === "I") {
            l_AddIncomeAndExpenses += parseFloat(ie.amount);
          } else {
            l_AddIncomeAndExpenses -= parseFloat(ie.amount);
          }
        });
      }

      l_NetAmountBeforeRoundOff =
        l_GrossAmount - l_Discount + l_TaxAmount + l_AddIncomeAndExpenses;

      l_RoundOff = await RoundConfiguredValue(
        roundOffConfigs,
        "PURRTN",
        l_NetAmountBeforeRoundOff
      );

      setVoucherSummary({
        GrossAmount: parseFloat(l_GrossAmount).toFixed(2),
        Discount: _.round(l_Discount, 0),
        TaxAmount: parseFloat(l_TaxAmount).toFixed(2),
        AddIncomeAndExpenses: parseFloat(l_AddIncomeAndExpenses).toFixed(2),
        RoundOff: parseFloat(l_RoundOff).toFixed(2),
        NetAmount: parseFloat(l_NetAmountBeforeRoundOff + l_RoundOff).toFixed(
          2
        ),
      });
    } catch (error) {
      console.error("CalcTotal", error);
    }
  }

  const calcItemData = (data) => {
    let l_Qty =
      data && !_.includes(["", null, undefined], data.Qty) ? data.Qty : 0;

    let l_Discount =
      data && !_.includes(["", null, undefined], data.ItemDiscount)
        ? data.ItemDiscount
        : 0;

    let l_Cost = data && data.CostPrice ? data.CostPrice : 0;

    let l_ItemGrossAmount = parseFloat(l_Cost) * l_Qty;

    let costTaxAmount =
      ((l_ItemGrossAmount - l_Discount) / 100) * parseFloat(data.TaxPer);

    let l_LandingCost =
      (l_ItemGrossAmount - l_Discount + costTaxAmount) / parseFloat(l_Qty);

    let l_ItemTotalAmount = l_ItemGrossAmount - l_Discount + costTaxAmount;

    let tempTable = ItemTableData;
    let findIndex = ItemTableData.findIndex((xz) => xz.key == data.key);

    let ll_TaxableAmount = _.round(l_ItemGrossAmount - l_Discount);

    console.log(tempTable, "taxable amount");
    tempTable[findIndex].ItemGrossAmount = l_ItemGrossAmount;
    tempTable[findIndex].LCostPrice = l_LandingCost;
    tempTable[findIndex].ItemTotalAmount = l_ItemTotalAmount;
    tempTable[findIndex].TaxAmount = costTaxAmount;
    tempTable[findIndex].CGST =
      parseFloat(
        ll_TaxableAmount * parseFloat(tempTable[findIndex].TaxInfo.CGSTPer)
      ) / 100;
    tempTable[findIndex].SGST =
      parseFloat(
        ll_TaxableAmount * parseFloat(tempTable[findIndex].TaxInfo.SGSTPer)
      ) / 100;
    tempTable[findIndex].IGST =
      parseFloat(
        ll_TaxableAmount * parseFloat(tempTable[findIndex].TaxInfo.IGSTPer)
      ) / 100;
    tempTable[findIndex].UGST =
      parseFloat(
        ll_TaxableAmount * parseFloat(tempTable[findIndex].TaxInfo.UTSTPer)
      ) / 100;
    tempTable[findIndex].Surcharge =
      parseFloat(
        ll_TaxableAmount * parseFloat(tempTable[findIndex].TaxInfo.SURCHARGPer)
      ) / 100;

    tempTable[findIndex].Cess =
      parseFloat(
        ll_TaxableAmount * parseFloat(tempTable[findIndex].TaxInfo.CESSPer)
      ) / 100;

    tempTable[findIndex].DiscPer = _.round(
      (l_Discount / l_ItemTotalAmount) * 100,
      3
    );

    setItemTableData([...tempTable]);
    CalcFnc([...tempTable]);
  };

  const column = [
    {
      title: "#",
      dataIndex: "key",
      width: 30,
      align: "center",
      fixed: "left",
    },
    {
      title: "Item Code",
      dataIndex: "ItemCode",
      key: "key",
      width: 120,
      fixed: "left",
      render: (text, record) => {
        return (
          <Input
            value={text}
            size={CompSize}
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
                </Tooltip>
              </a>
            }
            placeholder="Item Code"
            // autoFocus={true}
            onChange={(e) => {
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].ItemCode = e.target.value;
              setItemTableData([...tempTable]);
            }}
            onKeyDown={async (event) => {
              if (
                event.keyCode === 13 ||
                (!event.shiftKey && event.keyCode === 9)
              ) {
                event.preventDefault();
                // console.log("iamkeydown");
                await checkItemCode(event, record);
              }
            }}
            onBlur={async (event) => {
              // console.log("iamonblr");
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
            size={CompSize}
            disabled={true}
            value={text}
            placeholder="Item Name"
            onChange={(e) => {
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].ItemName = e.target.value;
              setItemTableData([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "Inward Seq",
      dataIndex: "InwardSeq",
      width: 95,
      fixed: "left",
      align: "center",
      render: (text, record) => {
        return (
          <Input
            // style={{ paddingLeft: 0, textAlign: "right" }}
            className="inwardSeq-input"
            size={CompSize}
            addonBefore={
              <button
                ref={(el) => (refInwardSeq.current[record.key] = el)}
                className="no-style-button"
                onClick={() => {
                  invGetAllInwardSeqInfo(
                    CompCode,
                    searchData.branch,
                    record.ItemCode
                  ).then((res) => {
                    // console.log(res);
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
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].InwardSeq = e.target.value;
              setItemTableData([...tempTable]);
            }}
          />
        );
      },
    },
    {
      title: "Rtn. Qty",
      dataIndex: "Qty",
      width: 95,
      align: "center",
      fixed: "left",
      render: (text, record) => {
        return (
          <InputNumber
            size={CompSize}
            min={0}
            placeholder="Qty"
            value={_.includes([undefined, null, ""], text) ? null : text}
            className="bill-input"
            style={{
              width: "100%",
            }}
            onChange={(e) => {
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);

              if (
                record.InwardSeq &&
                record.InwardSeq.CurrentStock < parseFloat(e)
              ) {
                notification.error({
                  message: "Quantity Greater Than Current Stock",
                  description:
                    "purchase return qty cannot be greater than current stock",
                });
                // e.preventDefault();
              } else {
                tempTable[findIndex].Qty = e;
                setItemTableData([...tempTable]);
                // CalcFnc([...tempTable]);
                calcItemData(record);
              }
            }}
            onBlur={(e) => {
              if (
                record.InwardSeq &&
                record.InwardSeq.CurrentStock < parseFloat(e.target.value)
              ) {
                let tempTable = ItemTableData;
                let findIndex = tempTable.findIndex(
                  (aa) => aa.key == record.key
                );
                tempTable[findIndex].Qty = null;
                calcItemData(record);
                // CalcFnc([...tempTable]);
                setItemTableData([...tempTable]);
                notification.error({
                  message: "Quantity Greater Than Current Stock",
                  description:
                    "purchase return qty cannot be greater than current stock ",
                });
              }
            }}
            bordered={false}
          />
        );
      },
    },
    {
      title: "Stk. Qty",
      dataIndex: "CurrentStock",
      align: "center",
      width: 90,
      render: (text, record) => {
        return (
          <Input
            size={CompSize}
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
      width: 90,
      render: (text, record) => {
        return (
          <InputNumber
            size={CompSize}
            precision={2}
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
            // disabled
            bordered={false}
            onChange={(e) => {
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].CostPrice = e;
              // CalcFnc([...tempTable]);
              setItemTableData([...tempTable]);
              calcItemData(record);
            }}
          />
        );
      },
    },
    {
      title: "Gross Amt.",
      dataIndex: "ItemGrossAmount",
      align: "right",
      width: 90,
      render: (text, record) => {
        return (
          <InputNumber
            precision={2}
            size={CompSize}
            value={
              _.includes([undefined, null, ""], text)
                ? null
                : Number.parseFloat(text).toFixed(2)
            }
            placeholder="Gross Amt"
            className="bill-input"
            style={{
              width: "100%",
            }}
            disabled
            bordered={false}
            // onChange={(e) => {
            //   let tempTable = ItemTableData;
            //   let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
            //   tempTable[findIndex].CostPrice = e;
            //   calcItemData({
            //     ...record,
            //     CostPrice: e,
            //   });
            //   setItemTableData([...tempTable]);
            // }}
          />
        );
      },
    },
    {
      title: "Discount",
      dataIndex: "ItemDiscount",
      align: "right",
      width: 90,

      render: (text, record) => {
        return (
          <InputNumber
            size={CompSize}
            precision={2}
            value={
              _.includes([undefined, null, ""], text)
                ? null
                : Number.parseFloat(text).toFixed(2)
            }
            placeholder="Discount"
            className="bill-input"
            style={{
              width: "100%",
            }}
            // disabled
            bordered={false}
            onChange={(val) => {
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);

              if (parseFloat(val) > voucherSummary.GrossAmount) {
                notification.error({
                  message: "Invalid Discount",
                  description: "Discount cannot be in more than gross amount",
                });
                tempTable[findIndex].ItemDiscount = 0;
                setItemTableData([...tempTable]);
                calcItemData(record);
              } else {
                tempTable[findIndex].ItemDiscount = val;
                setItemTableData([...tempTable]);
                calcItemData(record);
              }
            }}
          />
        );
      },
    },
    {
      title: "Tax",
      dataIndex: "TaxCode",
      align: "right",
      width: 90,
      render: (text, record) => {
        return (
          <Select
            size={CompSize}
            value={
              _.includes([undefined, null, ""], record.TaxCode)
                ? null
                : record.TaxCode
            }
            placeholder="Tax"
            style={{
              width: "100%",
            }}
            allowClear
            onChange={(e) => {
              if (e) {
                let tempTable = ItemTableData;
                let findIndex = tempTable.findIndex(
                  (aa) => aa.key == record.key
                );
                let taxPerc = taxMaster.find((zz) => zz.TaxCode == e);

                tempTable[findIndex].TaxCode = e;
                tempTable[findIndex].TaxPer = taxPerc.TaxPer;
                // CalcFnc([...tempTable]);
                setItemTableData([...tempTable]);
                calcItemData(record);
              } else {
                let tempTable = ItemTableData;
                let findIndex = tempTable.findIndex(
                  (aa) => aa.key == record.key
                );
                let taxPerc = taxMaster.find((zz) => zz.TaxCode == e);

                tempTable[findIndex].TaxCode = null;
                tempTable[findIndex].TaxPer = 0;
                // CalcFnc([...tempTable]);
                setItemTableData([...tempTable]);
                calcItemData(record);
              }
            }}
          >
            {taxMaster &&
              taxMaster.map((uu) => {
                return (
                  <Option value={uu.TaxCode} key={uu.TaxCode}>
                    {uu.TaxName}
                  </Option>
                );
              })}
          </Select>
        );
      },
    },
    {
      title: "L.Cost",
      dataIndex: "LCostPrice",
      align: "right",
      width: 90,
      render: (text, record) => {
        return (
          <InputNumber
            size={CompSize}
            precision={2}
            value={
              _.includes([undefined, null, ""], text)
                ? null
                : Number.parseFloat(text).toFixed(2)
            }
            placeholder="LCostPrice"
            className="bill-input"
            style={{
              width: "100%",
            }}
            disabled
            bordered={false}
          />
        );
      },
    },
    {
      title: "Sale Price",
      dataIndex: "SalePrice",
      align: "right",
      width: 90,

      render: (text, record) => {
        return (
          <InputNumber
            size={CompSize}
            precision={2}
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
            disabled
            bordered={false}
            onChange={(e) => {
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].SalePrice = e;
              // CalcFnc([...tempTable]);
              setItemTableData([...tempTable]);
              calcItemData(record);
            }}
          />
        );
      },
    },
    {
      title: "M.R.P",
      dataIndex: "MRP",
      align: "right",
      width: 90,
      render: (text, record) => {
        return (
          <InputNumber
            size={CompSize}
            precision={2}
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
            disabled
            bordered={false}
            onChange={(e) => {
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].MRP = e;
              // CalcFnc([...tempTable]);
              setItemTableData([...tempTable]);
              calcItemData(record);
            }}
          />
        );
      },
    },
    {
      title: "Amount",
      align: "right",
      fixed: "right",
      width: 95,
      render: (text, record) => {
        return (
          <InputNumber
            size={CompSize}
            precision={2}
            value={
              _.includes([undefined, null, ""], record.ItemTotalAmount)
                ? null
                : parseFloat(record.ItemTotalAmount).toFixed(2)
            }
            placeholder="Amount"
            className="bill-input"
            style={{
              width: "100%",
            }}
            disabled
            bordered={false}
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
          <>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                let tempTable = [
                  ...ItemTableData.filter((aa) => aa.key !== record.key),
                ];

                setItemTableData([...tempTable]);
                CalcFnc([...tempTable]);
              }}
            >
              <DeleteTwoTone twoToneColor="#ff1919" />
            </span>
          </>
        );
      },
    },
  ];

  const CompSize = "small";

  return (
    <div style={{ height: "100%" }}>
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
      <Row style={{ display: IsLoading ? "none" : "flex" }}>
        <Col span={14}>
          <div
            className="card-sales"
            style={{ display: "flex", paddingRight: 0, paddingBottom: 2 }}
          >
            <div style={{ width: "50%" }}>
              <Col xs={24} lg={24} xl={24} style={{ paddingBottom: 3 }}>
                <Row className="purchase-search-input-container">
                  <Col xs={24} lg={24} style={{ alignSelf: "center" }}>
                    <div
                      style={{ alignSelf: "center", paddingLeft: 5 }}
                      className="sales-item-input-label purchase-search-label"
                    >
                      Voucher No / Voucher Date
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    lg={24}
                    style={{ display: "flex" }}
                    className="purchase-search-input"
                  >
                    <div
                      style={{ width: "50%" }}
                      className="border-right-style"
                    >
                      <Input
                        defaultValue={searchData.voucherNo}
                        disabled
                        placeholder="Auto Generated"
                        style={{ width: "100%" }}
                        size="small"
                        onChange={(e) => {
                          let oldD = { ...searchData };
                          setSearchData({ ...oldD, voucherNo: e.target.value });
                        }}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <DatePicker
                        onChange={(e) => {
                          setSearchData((oldD) => {
                            return { ...oldD, voucherDate: e };
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
                        defaultValue={searchData.voucherDate}
                        placeholder="Voucher Date"
                        style={{ width: "100%" }}
                        size="small"
                      />
                    </div>
                    {/* <div style={{ width: "35%" }}>
                      <Select
                        onChange={(value) => {
                          setSearchData((oldD) => {
                            return { ...oldD, saleType: value };
                          });
                        }}
                        defaultValue={searchData.saleType}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        placeholder="Sale type"
                        style={{ width: "100%" }}
                        size="small"
                        dropdownStyle={{ fontSize: 12 }}
                      >
                        <Option value="GST_INC">GST Inclusive</Option>
                        <Option value="GST_EXC">GST Exclusive</Option>
                      </Select>
                    </div> */}
                  </Col>
                </Row>
              </Col>
              <Col
                xs={24}
                lg={24}
                xl={24}
                style={{ paddingBottom: 3, marginRight: 0 }}
              >
                <Row className="purchase-search-input-container">
                  <Col xs={24} lg={24} xl={24} style={{ alignSelf: "center" }}>
                    <div
                      style={{ alignSelf: "center", paddingLeft: 5 }}
                      className="sales-item-input-label purchase-search-label"
                    >
                      Supplier
                    </div>
                  </Col>
                  <Col xs={24} lg={24} xl={24} style={{ display: "flex" }}>
                    <div
                      style={{ width: "calc(100% - 60px)", display: "flex" }}
                      className="purchase-search-input"
                    >
                      <a
                        onClick={() => {
                          setShowModal("SEARCH_SUPPLIER");
                        }}
                        style={{
                          padding: "0px 5px",
                          /* margin: auto; */
                          height: " 100%",
                          alignSelf: "center",
                          background: "#fafafa",
                          border: "1px solid #d9d9d9",
                          width: 24,
                        }}
                      >
                        <Tooltip title="Search Supplier">
                          <span>
                            <i>
                              <UserOutlined />
                            </i>
                          </span>
                        </Tooltip>
                      </a>
                      <Select
                        className="purchase-select"
                        onChange={(value, newAtt) => {
                          setSearchData((oldD) => {
                            return {
                              ...oldD,
                              supplierId: value,
                              supplierName: newAtt
                                ? newAtt.option.suppName
                                : null,
                            };
                          });
                        }}
                        value={searchData.supplierId}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        placeholder="Supplier"
                        style={{
                          // padding: "0px 5px",
                          width: "calc(100% - 24px)",
                          flex: 1,
                          alignSelf: "center",
                        }}
                        size="small"
                      >
                        {supplierData.length > 0 &&
                          supplierData.map((cc) => (
                            <Option
                              value={cc.PartyId}
                              key={cc.PartyId}
                              option={cc}
                            >
                              {cc.suppName} ({cc.SuppTypeDesc})
                            </Option>
                          ))}
                      </Select>
                    </div>
                    <div style={{ width: 60, minWidth: 60 }}>
                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        style={{
                          margin: "auto 5px auto",
                        }}
                        disabled={
                          searchData.supplierId &&
                          searchData.supplierId !== null
                        }
                        onClick={() => setShowModal("ADD_SUPPLIER")}
                        icon={<PlusOutlined />}
                      ></Button>
                      <Button
                        type="primary"
                        shape="circle"
                        disabled={
                          !searchData.supplierId ||
                          searchData.supplierId === null
                        }
                        size="small"
                        onClick={() => setShowModal("EDIT_SUPPLIER")}
                        icon={<EditOutlined />}
                      ></Button>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col
                xs={24}
                lg={24}
                xl={24}
                style={{ paddingBottom: 3, marginRight: 0 }}
              >
                <Row className="purchase-search-input-container">
                  <Col xs={24} lg={24} xl={24} style={{ alignSelf: "center" }}>
                    <div
                      style={{ alignSelf: "center", paddingLeft: 5 }}
                      className="sales-item-input-label purchase-search-label"
                    >
                      Challan No / Challan Date
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    lg={24}
                    xl={24}
                    style={{ display: "flex" }}
                    className="purchase-search-input"
                  >
                    <div
                      style={{ width: "50%", display: "flex" }}
                      className="border-right-style"
                    >
                      <Input
                        onChange={(e) => {
                          setSearchData({
                            ...searchData,
                            refNo: e.target.value,
                          });
                        }}
                        defaultValue={searchData.refNo}
                        allowClear
                        placeholder="Challan No."
                        style={{
                          // padding: "0px 5px",
                          //   width: "calc(100% - 24px)"
                          width: "100%",
                          flex: 1,
                          alignSelf: "center",
                        }}
                        size="small"
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <DatePicker
                        size="small"
                        onChange={(e) => {
                          setSearchData((oldD) => {
                            return { ...oldD, refDate: e };
                          });
                        }}
                        format={l_ConfigDateFormat}
                        defaultValue={searchData.refDate}
                        placeholder="Challan Date"
                        // className="sales-item-input-date"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </div>
            <div style={{ width: "50%" }}>
              <Col xs={24} lg={24} xl={24} style={{ paddingBottom: 3 }}>
                <Row className="purchase-search-input-container">
                  <Col xs={24} lg={24} style={{ alignSelf: "center" }}>
                    <div
                      style={{ alignSelf: "center", paddingLeft: 5 }}
                      className="sales-item-input-label purchase-search-label"
                    >
                      Branch / Department / Voucher Type
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    lg={24}
                    style={{ display: "flex" }}
                    className="purchase-search-input"
                  >
                    <div
                      style={{ width: "40%" }}
                      className="border-right-style"
                    >
                      <Select
                        value={searchData.branch}
                        allowClear
                        showSearch
                        disabled
                        optionFilterProp="children"
                        placeholder="Branch"
                        style={{ width: "100%" }}
                        size="small"
                        onChange={(val) => {
                          setSearchData((oldD) => {
                            return { ...oldD, branch: val };
                          });
                        }}
                      >
                        {BranchMaster &&
                          BranchMaster.filter((bb) => bb.IsActive === true).map(
                            (brn) => {
                              return (
                                <Option
                                  value={brn.BranchCode}
                                  key={brn.BranchCode}
                                >
                                  {brn.BranchName}
                                </Option>
                              );
                            }
                          )}
                      </Select>
                    </div>
                    <div style={{ width: "30%" }}>
                      <Select
                        value={searchData.department}
                        allowClear
                        showSearch
                        disabled
                        optionFilterProp="children"
                        placeholder="Department"
                        style={{ width: "100%" }}
                        size="small"
                        onChange={(val) => {
                          setSearchData((oldD) => {
                            return { ...oldD, department: val };
                          });
                        }}
                      >
                        {DeptMaster &&
                          DeptMaster.filter(
                            (dd) =>
                              dd.IsActive.data[0] === 1 &&
                              (searchData.branch === null ||
                                dd.BranchCode === searchData.branch)
                          ).map((brn) => {
                            return (
                              <Option
                                value="ANDHERI"
                                value={brn.DeptCode}
                                key={brn.DeptCode}
                              >
                                {brn.DeptName}
                              </Option>
                            );
                          })}
                      </Select>
                    </div>
                    <div
                      style={{ width: "30%" }}
                      className="border-right-style"
                    >
                      <Select
                        disabled={true}
                        value={searchData.voucherType}
                        placeholder="Type"
                        style={{ width: "100%" }}
                        size="small"
                        onChange={(e) => {
                          let oldD = { ...searchData };
                          setSearchData({
                            ...oldD,
                            voucherType: e,
                          });
                        }}
                      >
                        {TranType &&
                          TranType.map((tt) => {
                            return (
                              <Option
                                value={tt.TranConfigCode}
                                key={tt.TranConfigCode}
                              >
                                {tt.TranConfigDesc}
                              </Option>
                            );
                          })}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} lg={24} xl={24} style={{ paddingBottom: 3 }}>
                <Row className="purchase-search-input-container">
                  <Col xs={24} lg={24} style={{ alignSelf: "center" }}>
                    <div
                      style={{ alignSelf: "center", paddingLeft: 5 }}
                      className="sales-item-input-label purchase-search-label"
                    >
                      Pur Rtn. No / Pur Rtn. Date
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    lg={24}
                    style={{ display: "flex" }}
                    className="purchase-search-input"
                  >
                    <div
                      style={{ width: "50%" }}
                      className="border-right-style"
                    >
                      <Input
                        onChange={(e) => {
                          let tempData = searchData;
                          setSearchData({
                            ...tempData,
                            pBillNo: e.target.value,
                          });
                        }}
                        defaultValue={searchData.pBillNo}
                        placeholder="Pur Return Bill No"
                        style={{
                          width: "100%",
                          flex: 1,
                          alignSelf: "center",
                        }}
                        size="small"
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <DatePicker
                        onChange={(e) => {
                          setSearchData((oldD) => {
                            return { ...oldD, pBillDate: e };
                          });
                        }}
                        // className="sales-item-input-date"
                        format={l_ConfigDateFormat}
                        defaultValue={searchData.pBillDate}
                        placeholder="Pur Return Bill Date"
                        // className="sales-item-input-date"
                        style={{ width: "100%" }}
                        size="small"
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col
                xs={24}
                lg={24}
                xl={24}
                style={{ paddingBottom: 3, marginRight: 0 }}
              >
                <Row className="purchase-search-input-container">
                  <Col xs={24} lg={24} xl={24} style={{ alignSelf: "center" }}>
                    <div
                      style={{ alignSelf: "center", paddingLeft: 5 }}
                      className="sales-item-input-label purchase-search-label"
                    >
                      E-Way Bill / Vehicle No. / Credit Days
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    lg={24}
                    xl={24}
                    style={{ display: "flex" }}
                    className="purchase-search-input"
                  >
                    <div
                      style={{ width: "38%" }}
                      className="border-right-style"
                    >
                      <Input
                        onChange={(e) => {
                          let tempData = searchData;
                          setSearchData({
                            ...tempData,
                            eWaybillNo: e.target.value,
                          });
                        }}
                        defaultValue={searchData.eWaybillNo}
                        // allowClear
                        placeholder="E-Way Bill No."
                        style={{
                          width: "100%",
                          flex: 1,
                          alignSelf: "center",
                        }}
                        size="small"
                      />
                    </div>
                    <div style={{ width: "32%" }}>
                      <Input
                        onChange={(e) => {
                          let tempData = searchData;
                          setSearchData({
                            ...tempData,
                            vehicleNo: e.target.value,
                          });
                        }}
                        defaultValue={searchData.vehicleNo}
                        placeholder="Vehicle No."
                        style={{
                          width: "100%",
                          flex: 1,
                          alignSelf: "center",
                        }}
                        size="small"
                      />
                    </div>
                    <div style={{ width: "30%" }}>
                      <InputNumber
                        onChange={(e) => {
                          setSearchData({
                            ...searchData,
                            creditDays: e,
                          });
                        }}
                        defaultValue={searchData.creditDays}
                        allowClear
                        placeholder="Credit Days"
                        style={{
                          width: "100%",
                          flex: 1,
                          alignSelf: "center",
                        }}
                        size="small"
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </div>
          </div>
        </Col>
        <Col span={10} style={{ height: 172 }}>
          <div className="card-sales" style={{ padding: 0, height: "98%" }}>
            <PurchaseSummaryComponent
              TaxType={voucherSummary.TaxType}
              GrossAmount={voucherSummary ? voucherSummary.GrossAmount : 0}
              DiscountAmount={voucherSummary ? voucherSummary.Discount : 0}
              TaxAmount={voucherSummary ? voucherSummary.TaxAmount : 0}
              AddIncomeAndExpenses={
                voucherSummary ? voucherSummary.AddIncomeAndExpenses : 0
              }
              RoundOff={voucherSummary ? voucherSummary.RoundOff : 0}
              NetAmount={voucherSummary ? voucherSummary.NetAmount : 0}
              onAddIECLick={() => {
                setShowModal("ADDIE");
              }}
            />
          </div>
        </Col>
        <Col
          span={24}
          style={{
            height: "calc(100vh - 275px)",
            // maxHeight: "calc(100vh - 440px)",
            // maxHeight: 300,
          }}
        >
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
              size={CompSize}
              //   loading={tableLoading}
              dataSource={ItemTableData}
              bordered={true}
              columns={column}
              className="adjustmentTable"
              style={{
                borderBottom: "1px solid var(--app-theme-color)",
                marginBottom: 5,
                height: 335,
              }}
              pagination={false}
              //   scroll={{ y: "71vh", x: 1300, scrollToFirstRowOnChange: true }}
              scroll={{ x: 1300 }}
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
                    ItemTableData.find(
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

                    while (i < ItemTableData.length) {
                      newData.push({
                        ...ItemTableData[i],
                        key: ItemTableData[i].isDeleted === false ? iKey : 0,
                      });
                      if (ItemTableData[i].isDeleted === false) {
                        iKey++;
                      }
                      i++;
                    }
                    newData = [
                      ...newData,
                      {
                        key: iKey,
                        ItemCode: null,
                        ItemName: null,
                        InwardSeq: null,
                        BatchNo: null,
                        ExpiryDate: null,
                        ScannedBarcode: null,
                        Qty: 0,
                        CostPrice: 0,
                        ItemGrossAmount: 0,
                        ItemDiscount: 0,
                        TaxCode: null,
                        TaxPer: null,
                        TaxAmount: 0,
                        LCostPrice: 0,
                        SalePrice: 0,
                        MRP: 0,
                        remark: null,
                        ItemTotalAmount: 0,
                        DiscPer: 0,
                        DiscAmount: 0,
                        CGST: 0,
                        SGST: 0,
                        IGST: 0,
                        UGST: 0,
                        Surcharge: 0,
                        Cess: 0,
                        isDeleted: false,
                      },
                    ];
                    // console.log(newData);
                    // CalcFnc([...newData]);
                    setItemTableData([...newData]);
                  }
                }}
              >
                Add New Row
              </Button>
            </div>
          </div>
        </Col>

        <Col span={24} style={{ height: 40 }}>
          <div className="card-sales" style={{ marginRight: 0 }}>
            <Button
              icon={<PlusCircleOutlined />}
              style={{ marginRight: 5 }}
              disabled={
                _.includes([null, undefined, ""], searchData.supplierId) ||
                ItemTableData.filter(
                  (aa) => aa.ItemCode !== null && aa.isDeleted === false
                ).length <= 0
              }
              type="primary"
              onClick={() => {
                setIsLoading(true);

                let PurchaseReturnInvoiceDtl = [];
                let AddIncomeExpensesDtl = [];
                let PurchaseReturnInvoiceHdr = {
                  CompCode: CompCode,
                  BranchCode: searchData.branch,
                  DeptCode: searchData.department,
                  VoucherDate: searchData.voucherDate,
                  VoucherNo: searchData.voucherNo,
                  TaxType: searchData.saleType,
                  SuppId: searchData.supplierId,
                  PurchaseType: searchData.voucherType,
                  PurchaseRtnBillNo: searchData.pBillNo,
                  PurchaseRtnBillDate: searchData.pBillDate,
                  RefNo: searchData.refNo,
                  RefDate: searchData.refDate,
                  EWayBillNo: searchData.eWaybillNo,
                  VehicleNo: searchData.vehicleNo,
                  CreditDays: searchData.creditDays,
                  PurchaseId: null,
                  PurchaseNo: null,
                  PurchaseDate: null,
                  SysOption1: null,
                  SysOption2: null,
                  SysOption3: null,
                  SysOption4: null,
                  SysOption5: null,
                  SysOption6: null,
                  SysOption7: null,
                  SysOption8: null,
                  SysOption9: null,
                  SysOption10: null,
                  GrossAmount: voucherSummary.GrossAmount,
                  DiscAmount: voucherSummary.Discount,
                  TaxAmount: voucherSummary.TaxAmount,
                  MiscAmount: voucherSummary.MiscAmount,
                  RoundOff: voucherSummary.RoundOff,
                  NetAmount: voucherSummary.NetAmount,
                  SettlementAmount: 0,
                  UpdtUsr: l_loginUser,
                };

                ItemTableData.filter(
                  (aa) => aa.ItemCode !== null && aa.isDeleted === false
                ).forEach((val, inx) => {
                  // console.log(val);
                  PurchaseReturnInvoiceDtl.push({
                    //  ...row
                    SrNo: inx + 1,
                    VoucherId: val.VoucherId,
                    ItemCode: val.ItemCode,
                    ScannedBarcode: val.ScannedBarcode
                      ? val.ScannedBarcode
                      : null,
                    InwardSeq: val.InwardSeq.InwardSeq,
                    BatchNo: val.BatchNo,
                    ExpiryDate: val.ExpiryDate,
                    Qty: val.Qty,
                    CostPrice: val.CostPrice,
                    LCostPrice: val.LCostPrice,
                    SalePrice: val.SalePrice,
                    MRP: val.MRP,
                    DiscPer: val.DiscPer,
                    DiscAmount: val.ItemDiscount,
                    TaxCode: val.TaxCode,
                    TaxPerc: val.TaxPer,
                    TaxAmount: val.TaxAmount,
                    Amount: val.ItemTotalAmount,
                    SysOption1: null,
                    SysOption2: null,
                    SysOption3: null,
                    SysOption4: null,
                    SysOption5: null,
                    CGST: val.CGST,
                    SGST: val.SGST,
                    IGST: val.IGST,
                    UTGST: val.UGST,
                    Surcharge: val.Surcharge,
                    Cess: val.Cess,
                    UpdtUsr: l_loginUser,
                  });
                });

                addIncomeExpense.forEach((row, index) => {
                  console.log(row);
                  AddIncomeExpensesDtl.push({
                    SrNo: index + 1,
                    IEType: row.IEtype,
                    Particular: row.reason,
                    Amount: parseFloat(row.amount),
                    SysOption1: null,
                    SysOption2: null,
                    SysOption3: null,
                    SysOption4: null,
                    SysOption5: null,
                  });
                });

                let data = {
                  PurchaseReturnInvoiceHdr,
                  PurchaseReturnInvoiceDtl,
                  AddIncomeExpensesDtl,
                };
                // console.log(data, "final");
                invSavePurchaseReturnInvoice(CompCode, data).then((res) => {
                  props.onBackPress();
                  setIsLoading(false);
                });
              }}
            >
              Save
            </Button>
            <Button
              icon={<PrinterOutlined />}
              style={{ marginRight: 5 }}
              type="primary"
            >
              Save &amp; Print
            </Button>
            <Button
              // icon={<RetweetOutlined />}
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                props.onBackPress();
              }}
              type="primary"
              onClick={() => {
                props.onBackPress();
              }}
            >
              Back
            </Button>
          </div>
        </Col>
      </Row>
      <Modal
        visible={showModal === "SEARCH_SUPPLIER"}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
        }}
        className="search-customer"
        width={"70%"}
        maskClosable={false}
      >
        <SearchSupplier
          data={supplierData}
          onItemSelect={(data) => {
            if (data) {
              setSearchData((oldD) => {
                return { ...oldD, supplierId: data.PartyId };
              });
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
      <Modal
        visible={showModal === "SEARCH_REFRENCE"}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
        }}
        className="search-customer"
        width={"70%"}
        maskClosable={false}
      >
        <SearchSupplier
          data={supplierData}
          onItemSelect={(data) => {
            if (data) {
              setSearchData((oldD) => {
                return { ...oldD, supplierId: data.PartyId };
              });
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
      <Modal
        visible={showModal === "ADD_SUPPLIER" || showModal === "EDIT_SUPPLIER"}
        // title={"Customer"}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
        }}
        className="search-customer"
        width={"80%"}
      >
        <SupplierMasterComp
          datasource={supplierData}
          onBackPress={(data) => {
            setShowModal();
            fetchSupplierMasterComp(CompCode).then((res) => {
              setSupplierData(res.filter((aa) => aa.IsActive === true));
            });
            if (data) {
              setSearchData((old) => {
                return { ...old, supplierId: data.data.data[0].PartyId };
              });
            }
          }}
          formData={supplierData.find(
            (ff) => ff.PartyId === searchData.supplierId
          )}
        />
      </Modal>
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
          selectType={"radio"}
          onItemSelect={async (data) => {
            if (data) {
              let tempTable = ItemTableData;
              let tempData = [];
              if (
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
                let selectedData = [{ ...data }];
                const tax = taxMaster.filter(
                  (xx) => xx.TaxCode === data.TaxCode
                );

                selectedData.map(async (aa) => {
                  tempData.push({
                    key: tempData.length + 1,
                    ItemCode: aa.ItemCode,
                    ItemName: aa.ItemName,
                    InwardSeq: null,
                    BatchNo: null,
                    ExpiryDate: null,
                    Qty: 0,
                    ItemGrossAmount: 0,
                    ItemDiscount: 0,
                    LCostPrice: 0,
                    TaxCode: aa.TaxCode,
                    TaxPer: tax.TaxPer,
                    ItemTotalAmount: 0,
                    TaxAmount: 0,
                    CostPrice: 0,
                    SalePrice: 0,
                    MRP: 0,
                    remark: null,
                    isDeleted: false,
                  });
                });
              }
              // console.log([...tempData], "[...tempTable]");
              if (tempData.length > 0) {
                await setItemTableData([...tempData]);
                refAdd.current.click();
              } else {
                setItemTableData([]);
              }
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
          updateItemMaterData={(data) => {
            setItemMasterData([...data]);
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
          // setInwardSeqData({ data: [], record: null });
        }}
        width={800}
      >
        <SearchAllInwardSeq
          data={inwardSeqData.data}
          record={inwardSeqData.record}
          onItemSelect={async (data) => {
            if (data) {
              let tempTable = ItemTableData;
              let findIndex = ItemTableData.findIndex(
                (aa) => aa.key == inwardSeqData.record.key
              );
              const tax = taxMaster.find((xx) => xx.TaxCode === data.TaxCode);

              let tempCostPrice =
                (parseFloat(data.Cost) / (100 + parseFloat(tax.TaxPer))) * 100;

              //Filtering data according to Inward sequence and ItemCode
              if (
                tempTable.filter(
                  (xx) =>
                    xx.InwardSeq &&
                    xx.ItemCode &&
                    xx.InwardSeq.InwardSeq === data.InwardSeq &&
                    xx.ItemCode === inwardSeqData.record.ItemCode
                ).length > 0
              ) {
                message.error(
                  "Item with this inward sequence already exist in table"
                );
                return;
              } else {
                if (findIndex >= 0) {
                  tempTable[findIndex].Qty = 0;
                  tempTable[findIndex].InwardSeq = data;
                  tempTable[findIndex].CostPrice =
                    parseFloat(tempCostPrice).toFixed(2);
                  tempTable[findIndex].SalePrice = data.Sale;
                  tempTable[findIndex].MRP = data.MRP;
                  tempTable[findIndex].TaxCode = data.TaxCode;
                  tempTable[findIndex].TaxPer = tax.TaxPer;
                  tempTable[findIndex].TaxInfo = tax;
                  CalcFnc([...tempTable]);
                  setItemTableData([...tempTable]);
                  setShowModal();
                }
              }
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>
      <Modal
        visible={showModal === "DISC" || showModal === "ADDIE"}
        // title={"Customer"}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
          // itemBarcodeRef.current.focus();
        }}
        className="search-customer"
        width={window.innerWidth > 800 ? "50%" : "100%"}
        maskClosable={false}
        // closable={false}
      >
        <DiscountAdditionalIncomeExpenseComp
          type={showModal}
          discount={discount}
          addIncomeExpense={addIncomeExpense}
          onBackPress={() => {
            setShowModal();
            // itemBarcodeRef.current.focus();
          }}
          onSaveClick={(data) => {
            setDiscount(data.discount);
            setAddIncomeExpense(data.IncomeExpense);
            CalcFnc(undefined, undefined, data.IncomeExpense);
          }}
        />
      </Modal>
    </div>
  );
};

export default PurchaseReturnCard;
