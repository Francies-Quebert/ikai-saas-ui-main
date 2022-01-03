import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  notification,
  Table,
  Modal,
  Divider,
  Select,
  DatePicker,
  Tooltip,
  message,
  Drawer,
  Skeleton,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusOutlined,
  EditOutlined,
  RetweetOutlined,
  ShoppingCartOutlined,
  PlusCircleOutlined,
  DeleteTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import {
  hasRightToBeUsedNext,
  RoundConfiguredValue,
} from "../../../shared/utility";
import ViewHotKeysComponent from "../../common/ViewHotKeysComponent";
import CustomerSelectionComponent from "../../dashboard/Restaurant/components/SubComponents/CustomerSelectionComponent";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import StockDistinctPrice from "../../sales/StockDistinctPrice";
import DiscountAdditionalIncomeExpenseComp from "../../sales/DiscountAdditionalIncomeExpenseComp";
import SelectableItem from "../../Inventory/Adjustment/SelectableItem";
import SearchCustomer from "../../sales/SearchCustomer";
import PaymentModeComponent from "../../sales/PaymentModeComponent";
import { fetchPaymodeMaster } from "../../../services/payModeMaster";
import { fetchBranchMasterData } from "../../../services/branch-master";
import { fetchDeptMasterService } from "../../../services/department-master";
import { getUnitMaster } from "../../../services/unit-master";
import {
  getInvItemMasterData,
  getItemCodeFromBarcode,
  invValidateItemCodeInTransaction,
} from "../../../services/opening-stock";
import {
  InvGetItemBalanceStockDistinctByInwardSeq,
  InvGetItemBalanceStockDistinctByPrices,
  InvGetTransactionTypes,
  invSaveSaleOrderInvoice,
} from "../../../services/inventory";
import SalesRecentTransactionComponent from "../../sales/SalesRecentTransactionComponent";
import SalesSummaryComponent from "../../sales/SalesSummaryComponent";
import { saveInsReceiptAndPayments } from "../../../services/receipts-payments";

const SalesOrderCard = (props) => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const initialSearchData = {
    branch: null,
    department: null,
    voucherNo: null,
    voucherDate: moment(),
    voucherType: null,
    saleType: "GST_INC",
    customerId: null,
    customerAddress: null,
  };
  const initialItemData = {
    itemBarcode: null,
    ItemCode: null,
    ItemName: null,
    Qty: null,
    Mrp: null,
    SaleRate: null,
    BatchNo: null,
    ExpiryDate: null,
    InwardSeq: null,
    unit: null,
    SubCatDesc: null,
  };
  const initialItemDisabled = {
    itemBarcode: false,
    ItemCode: false,
    ItemName: true,
    Qty: false,
    unit: false,
    Mrp: false,
    SaleRate: false,
    BatchNo: true,
    ExpiryDate: true,
    InwardSeq: true,
  };
  const initialVoucherSummary = {
    GrossAmount: 0,
    Discount: 0,
    TaxAmount: 0,
    AddIncomeAndExpenses: 0,
    RoundOff: 0,
    NetAmount: 0,
    TaxType: "I",
  };

  const QtyRef = useRef();
  const ItemAddRef = useRef();
  const ItemResetRef = useRef();
  const itemBarcodeRef = useRef();
  const backSummaryRef = useRef();
  const customerSelectref = useRef();
  const saveRef = useRef();
  const productSelect = useRef();
  const editLastRef = useRef();

  const [IsLoading, setIsLoading] = useState(false);
  const [TranType, setTranType] = useState();
  const [BranchMaster, setBranchMaster] = useState();
  const [DeptMaster, setDeptMaster] = useState();
  const [unitMaster, setUnitMaster] = useState();
  const [distcountInfo, setDiscountInfo] = useState({
    Source: "",
    PercValue: 0,
    AmountValue: 0,
  });
  const [showModal, setShowModal] = useState();
  const [searchData, setSearchData] = useState(initialSearchData);
  const [itemDataDisabled, setItemDataDisabled] = useState(initialItemDisabled);
  const [itemData, setItemData] = useState(initialItemData);
  const [keyboardKey, setKeyboardKey] = useState([]);
  const [stockDistinctPrice, setStockDistinctPrice] = useState();
  const [catchedItemData, setCatchedItemData] = useState([]);
  const [responseData, setResponseData] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [ItemTableData, setItemTableData] = useState([]);
  const [voucherSummary, setVoucherSummary] = useState(initialVoucherSummary);
  const [discount, setDiscount] = useState(null);
  const [addIncomeExpense, setAddIncomeExpense] = useState([]);
  const [paymentMode, setPaymentMode] = useState([]);
  const [lastScanned, setLastScanned] = useState(null);
  const [recentTran, setRecentTran] = useState([]);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const l_ConfigDateTimeFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTTMFORMAT").value1
  );
  const invType = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "INV_TYPE").value1
  );
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const userMasterRights = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 4)[0]
  );
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const keyboardHotkeyConfig = useSelector((state) =>
    state.AppMain.keyboardHotKeyConfig.filter(
      (flt) => flt.CompName === "SalesOrder"
    )
  );
  const roundOffConfigs = useSelector((state) => state.AppMain.roundOffConfigs);

  useEffect(() => {
    async function fetchData() {
      return new Promise(async function (resolve, reject) {
        try {
          let branch = null;
          let depart = null;
          let TranType = null;
          await fetchPaymodeMaster(CompCode).then((res) => {
            let tempData = [];
            res
              .filter((ii) => ii.IsActive)
              .forEach((row, index) => {
                tempData.push({
                  ...row,
                  key: index,
                  Amount: 0,
                  isDirty: false,
                  IsChecked: false,
                });
              });
            setPaymentMode(tempData);
          });
          let tmp = [];
          await keyboardHotkeyConfig.forEach((row, index) => {
            tmp.push({ ...row, key: index, isDirty: false });
          });
          setKeyboardKey(tmp);
          await fetchBranchMasterData(CompCode).then((brnh) => {
            if (brnh.length > 0) {
              setBranchMaster(brnh.filter((ii) => ii.IsActive === true));
              branch = brnh[0].BranchCode;
            }
          });
          await fetchDeptMasterService(CompCode).then((dept) => {
            if (dept.length > 0) {
              depart = dept[0].DeptCode;
              setDeptMaster(dept.filter((dd) => dd.IsActive.data[0] === 1));
            }
          });
          await getUnitMaster(CompCode).then((uu) => {
            if (uu.length > 0) {
              setUnitMaster(uu.filter((uf) => uf.IsActive === true));
            }
          });

          await InvGetTransactionTypes(CompCode, "SALEORDER").then(
            (trantype) => {
              if (trantype.length > 0) {
                TranType = trantype[0].TranConfigCode;
                setTranType(trantype);
              }
            }
          );
          getInvItemMasterData(CompCode, branch).then((res1) => {
            setItemMasterData(res1);
          });
          resolve([
            {
              ...searchData,
              branch: branch,
              department: depart,
              voucherType: TranType,
            },
          ]);
        } catch (error) {
          reject(error);
        }
      });
    }
    setIsLoading(true);
    fetchData().then((res) => {
      setSearchData(...res);
      setIsLoading(false);
    });

    dispatch(fetchUserMasters("U"));
  }, []);

  function getCatchedStockData(pBranchCode, pItemCode) {
    return new Promise(async function (resolve, reject) {
      try {
        let l_index = catchedItemData.findIndex(
          (kk) => kk.BranchCode === pBranchCode && kk.ItemCode === pItemCode
        );
        if (l_index >= 0) {
          resolve(catchedItemData[l_index]);
        } else {
          let tmp_cachedData = {
            BranchCode: pBranchCode,
            ItemCode: pItemCode,
            ItemInfo: [],
            ItemDisctinctPriceWise: [],
            ItemDistinctInwardSeqWise: [],
          };

          await invValidateItemCodeInTransaction(CompCode, pItemCode)
            .then((res) => {
              tmp_cachedData.ItemInfo = res;
            })
            .catch((err) => {
              notification.error({
                message: "Invlid",
                description: "Invlid data",
              });
            });

          await InvGetItemBalanceStockDistinctByPrices(
            CompCode,
            pBranchCode,
            pItemCode
          )
            .then((res) => {
              tmp_cachedData.ItemDisctinctPriceWise = res;
            })
            .catch((err) => {
              notification.error({
                message: "Invlid",
                description: "Invlid data",
              });
            });

          await InvGetItemBalanceStockDistinctByInwardSeq(
            CompCode,
            pBranchCode,
            pItemCode
          )
            .then((res) => {
              tmp_cachedData.ItemDistinctInwardSeqWise = res;
            })
            .catch((err) => {
              notification.error({
                message: "Invalid",
                description: "Invalid data",
              });
            });
          setCatchedItemData([...catchedItemData, tmp_cachedData]);
          resolve(tmp_cachedData);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  function AddItemTableDataAndCalc(
    pItemData,
    pItemCode,
    pItemName,
    pInwardSeq,
    pBatchNo,
    pExpiryDate,
    pSaleQty,
    pMrp,
    pSalePrice,
    pIsDeleted,
    pCatchedData,
    pBarcode
  ) {
    let tmpItemAddInfo = pCatchedData.ItemInfo[0];
    //get item inward info
    let l_CostPrice = 0;
    let l_ItemInwardInfo = pCatchedData.ItemDistinctInwardSeqWise.filter(
      (ff) => ff.InwardSeq === pInwardSeq
    );

    if (l_ItemInwardInfo.length > 0) {
      l_CostPrice = l_ItemInwardInfo[0].Cost;
    } else {
      l_CostPrice = tmpItemAddInfo.Cost;
    }

    let tempItemTableData = ItemTableData;
    let zIndex = tempItemTableData.findIndex(
      (ll) =>
        ll.ItemCode === pItemCode &&
        ll.InwardSeq === pInwardSeq &&
        parseFloat(ll.SalePrice) === parseFloat(pSalePrice) &&
        parseFloat(ll.MRP) === parseFloat(pMrp)
    );

    if (zIndex >= 0) {
      tempItemTableData[zIndex].Qty += pSaleQty;
      setItemTableData([
        ...ItemTableData.filter(
          (ll) => ll.key !== tempItemTableData[zIndex].key
        ),
        tempItemTableData[zIndex],
      ]);
    } else {
      tempItemTableData.push({
        itemBarcode: !_.includes([null, "", undefined], pBarcode)
          ? pBarcode
          : null,
        ItemCode: pItemCode,
        key: moment().format("YYYYMMDDHHmmss"),
        ItemName: pItemName,
        InwardSeq: pInwardSeq,
        BatchNo: pBatchNo,
        ExpiryDate: pExpiryDate,
        SubCatDesc: tmpItemAddInfo.SubCatDesc,
        IsDeleted: pIsDeleted,
        CostPrice: l_CostPrice ? parseFloat(l_CostPrice) : 0,
        SalePrice: pSalePrice ? parseFloat(pSalePrice) : 0,
        LSalePrice: 0,
        Mrp: pMrp ? parseFloat(pMrp) : null,
        DiscPerc: 0,
        DiscAmount: 0,
        SchemeDiscountAmount: 0,
        SchemeCode: "",
        TaxCode: null,
        TaxPerc: 0,
        TaxAmount: 0,
        CGST: 0,
        SGST: 0,
        IGST: 0,
        UTGST: 0,
        Surcharge: 0,
        Cess: 0,
        ItemTotal: 0,
        Qty: pSaleQty ? parseFloat(pSaleQty) : null,
        Amount: 0,
        FinalAmount: 0,
        SysOption1: null,
        SysOption2: null,
        SysOption3: null,
        SysOption4: null,
        SysOption5: null,
        ItemAddInfo: tmpItemAddInfo,
      });
      setItemTableData(tempItemTableData);
    }
    CalcTotal(tempItemTableData);
  }

  async function CalcTotal(pTableData, pDiscountInfo, pAddIncomeExpenses) {
    try {
      console.log(pTableData, "cals");
      let lv_TableData = pTableData
        ? pTableData.filter((aa) => aa.IsDeleted === false)
        : ItemTableData.filter((aa) => aa.IsDeleted === false);
      let lv_DiscInfo = pDiscountInfo ? pDiscountInfo : distcountInfo;
      let lv_AddIncomeExpenses = pAddIncomeExpenses
        ? pAddIncomeExpenses
        : addIncomeExpense;

      let lv_TaxType = "I";
      let lv_TaxAfterDiscOrBeforeDiscount = "A"; // A = After Discount or B = Before Discount
      let lv_GrossTotal = 0;
      let i = 0;
      //Calculate Basic Item Data
      for (i; i < lv_TableData.length; i++) {
        lv_TableData[i].LSalePrice = lv_TableData[i].SalePrice;
        lv_TableData[i].ItemTotal = lv_TableData[i].SalePrice;
        lv_TableData[i].Amount =
          lv_TableData[i].Qty * lv_TableData[i].SalePrice;
        lv_GrossTotal += lv_TableData[i].Amount;
      }

      //set DiscountInfo
      if (lv_DiscInfo.Source === "P") {
        lv_DiscInfo = {
          ...lv_DiscInfo,
          AmountValue: _.round(
            (lv_GrossTotal / 100) * lv_DiscInfo.PercValue,
            3
          ),
        };
      } else {
        lv_DiscInfo = {
          ...lv_DiscInfo,
          PercValue: _.round(
            (lv_DiscInfo.AmountValue / lv_GrossTotal) * 100,
            3
          ),
        };
      }
      setDiscountInfo(lv_DiscInfo);

      i = 0;
      //Calculate Discount & Tax
      for (i; i < lv_TableData.length; i++) {
        let ll_TaxableAmount = 0;

        lv_TableData[i].DiscPer = lv_DiscInfo.PercValue;
        lv_TableData[i].DiscAmount = _.round(
          (lv_DiscInfo.AmountValue / lv_GrossTotal) * lv_TableData[i].Amount,
          3
        );

        if (lv_TaxAfterDiscOrBeforeDiscount === "A") {
          ll_TaxableAmount =
            lv_TableData[i].Amount - lv_TableData[i].DiscAmount;
        } else {
          ll_TaxableAmount = lv_TableData[i].Amount;
        }

        lv_TableData[i].TaxCode = lv_TableData[i].ItemAddInfo.TaxCode;
        lv_TableData[i].TaxPerc = parseFloat(
          lv_TableData[i].ItemAddInfo.TaxPer
        );

        if (lv_TaxType === "I") {
          ll_TaxableAmount = _.round(
            (ll_TaxableAmount / (100 + lv_TableData[i].TaxPerc)) * 100,
            3
          );
        }

        lv_TableData[i].TaxAmount = parseFloat(
          (ll_TaxableAmount * lv_TableData[i].TaxPerc) / 100
        );
        lv_TableData[i].CGST = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].ItemAddInfo.CGSTPer)) /
            100
        );
        lv_TableData[i].SGST = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].ItemAddInfo.CGSTPer)) /
            100
        );
        lv_TableData[i].IGST = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].ItemAddInfo.IGSTPer)) /
            100
        );
        lv_TableData[i].UTGST = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].ItemAddInfo.UTSTPer)) /
            100
        );
        lv_TableData[i].Surcharge = parseFloat(
          (ll_TaxableAmount *
            parseFloat(lv_TableData[i].ItemAddInfo.SURCHARGPer)) /
            100
        );
        lv_TableData[i].Cess = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].ItemAddInfo.CESSPer)) /
            100
        );

        lv_TableData[i].FinalAmount =
          lv_TableData[i].Amount - lv_TableData[i].DiscAmount;
        lv_TableData[i].LSalePrice =
          lv_TableData[i].FinalAmount / lv_TableData[i].Qty;
        lv_TableData[i].ItemTotal =
          lv_TableData[i].FinalAmount / lv_TableData[i].Qty;
      }

      //Calc Summary
      let l_GrossAmount = 0;
      let l_Discount = 0;
      let l_TaxAmount = 0;
      let l_AddIncomeAndExpenses = 0;
      let l_NetAmountBeforeRoundOff = 0;
      let l_RoundOff = 0;

      lv_TableData.forEach((row) => {
        l_GrossAmount += row.Amount;
        l_Discount += row.DiscAmount + row.SchemeDiscountAmount;
        l_TaxAmount += parseFloat(row.TaxAmount);
      });

      // let IncomeExpense = 0;
      if (lv_AddIncomeExpenses.length > 0) {
        lv_AddIncomeExpenses.map((ie) => {
          if (ie.IEtype === "I") {
            l_AddIncomeAndExpenses += parseFloat(ie.amount);
          } else {
            l_AddIncomeAndExpenses -= parseFloat(ie.amount);
          }
        });
      }

      if (lv_TaxType === "I") {
        l_NetAmountBeforeRoundOff =
          l_GrossAmount - l_Discount + l_AddIncomeAndExpenses;
      } else if (lv_TaxType === "E") {
        l_NetAmountBeforeRoundOff =
          l_GrossAmount - l_Discount + l_TaxAmount + l_AddIncomeAndExpenses;
      }

      l_RoundOff = await RoundConfiguredValue(
        roundOffConfigs,
        "SALEORDER",
        l_NetAmountBeforeRoundOff
      );

      setVoucherSummary({
        GrossAmount: _.round(l_GrossAmount, 3),
        Discount: _.round(l_Discount, 0),
        TaxInclusiveOrExclusive: lv_TaxType,
        TaxAmount: l_TaxAmount,
        AddIncomeAndExpenses: l_AddIncomeAndExpenses,
        RoundOff: l_RoundOff,
        NetAmount: l_NetAmountBeforeRoundOff + l_RoundOff,
        TaxType: lv_TaxType,
      });
    } catch (err) {
      console.error("CalcTotal", err);
    }
  }

  const validateItemCode = async (ItemCode, CalledFrom, pBarcode) => {
    await getCatchedStockData(searchData.branch, ItemCode).then(async (res) => {
      if (res.ItemInfo.length > 0) {
        if (res.ItemInfo.filter((i) => i.IsActive).length > 0) {
          setItemData((old) => {
            return {
              ...old,
              ...res.ItemInfo[0],
              ItemName: res.ItemInfo[0].ItemName,
              unit: res.ItemInfo[0].UnitCode,
              SubCatDesc: `${res.ItemInfo[0].SubCatDesc} (${res.ItemInfo[0].CatDesc})`,
              Qty: 1,
            };
          });

          if (res.ItemDisctinctPriceWise.length > 1) {
            setShowModal("STOCK_DISTINCT_PRICE");
            setStockDistinctPrice(
              res.ItemDisctinctPriceWise.map((ii, index) => {
                return { key: index + 1, ...ii };
              })
            );
          } else {
            if (res.ItemDisctinctPriceWise.length === 1) {
              setItemData((old) => {
                return {
                  ...old,
                  Mrp: res.ItemDisctinctPriceWise[0].MRP,
                  SaleRate: res.ItemDisctinctPriceWise[0].SaleRate,
                  BalQty: res.ItemDisctinctPriceWise[0].BalQty,
                };
              });
            } else {
              setItemData((old) => {
                return {
                  ...old,
                  Mrp:
                    res.ItemInfo[0] && res.ItemInfo[0].MRP !== null
                      ? parseFloat(res.ItemInfo[0].MRP)
                      : null,
                  SaleRate:
                    res.ItemInfo[0] && res.ItemInfo[0].SalePrice !== null
                      ? parseFloat(res.ItemInfo[0].SalePrice)
                      : null,
                };
              });
            }

            let l_catchedItemData = res;

            //# Check If sale qty > Total Stock give warning
            let tmp_TotalBalQty;
            let tmp_remainingAdjQty = 1;
            tmp_TotalBalQty = l_catchedItemData.ItemDisctinctPriceWise.filter(
              (kk) =>
                kk.MRP === res.ItemDisctinctPriceWise[0].MRP &&
                kk.SaleRate === res.ItemDisctinctPriceWise[0].SaleRate
            ).BalQty;

            if (1 > tmp_TotalBalQty) {
              //console.log("show warning stock");
            }

            //add with inward seq

            l_catchedItemData.ItemDistinctInwardSeqWise.filter(
              (kk) =>
                kk.MRP === res.ItemDisctinctPriceWise[0].MRP &&
                kk.SaleRate === res.ItemDisctinctPriceWise[0].SaleRate
            ).forEach(async (l_seqRow) => {
              //get recent bal qty
              let tmpAlreadySoldAgainstInwardSeqQty = 0;
              ItemTableData.filter(
                (rr) =>
                  rr.ItemCode === l_seqRow.ItemCode &&
                  rr.InwardSeq === l_seqRow.InwardSeq
              ).forEach((pl) => {
                tmpAlreadySoldAgainstInwardSeqQty += pl.Qty;
              });

              if (
                tmp_remainingAdjQty > 0 &&
                l_seqRow.BalQty - tmpAlreadySoldAgainstInwardSeqQty >
                  tmp_remainingAdjQty &&
                res.ItemInfo[0].ProductType === "D"
              ) {
                QtyRef.current.focus();
                AddItemTableDataAndCalc(
                  itemData,
                  res.ItemInfo[0].ItemCode,
                  res.ItemInfo[0].ItemName,
                  l_seqRow.InwardSeq,
                  l_seqRow.BatchNo,
                  l_seqRow.ExpiryDate,
                  tmp_remainingAdjQty,
                  res.ItemDisctinctPriceWise[0].MRP,
                  res.ItemDisctinctPriceWise[0].SaleRate,
                  false,
                  l_catchedItemData,
                  pBarcode
                );

                tmp_remainingAdjQty -= tmp_remainingAdjQty;
              } else if (
                tmp_remainingAdjQty > 0 &&
                l_seqRow.BalQty - tmpAlreadySoldAgainstInwardSeqQty > 0 &&
                res.ItemInfo[0].ProductType === "D"
              ) {
                // console.log("cc2");
                QtyRef.current.focus();
                AddItemTableDataAndCalc(
                  itemData,
                  res.ItemInfo[0].ItemCode,
                  res.ItemInfo[0].ItemName,
                  l_seqRow.InwardSeq,
                  l_seqRow.BatchNo,
                  l_seqRow.ExpiryDate,
                  l_seqRow.BalQty - tmpAlreadySoldAgainstInwardSeqQty,
                  res.ItemDisctinctPriceWise[0].MRP,
                  res.ItemDisctinctPriceWise[0].SaleRate,
                  false,
                  l_catchedItemData,
                  pBarcode
                );

                tmp_remainingAdjQty -=
                  l_seqRow.BalQty - tmpAlreadySoldAgainstInwardSeqQty;
              }
            });

            //Add Without inward seq
            if (
              tmp_remainingAdjQty > 0 &&
              res.ItemInfo.length > 0 &&
              res.ItemInfo[0].ProductType === "D"
            ) {
              // console.log("cc3");
              QtyRef.current.focus();
              AddItemTableDataAndCalc(
                itemData,
                res.ItemInfo[0].ItemCode,
                res.ItemInfo[0].ItemName,
                -999,
                null,
                null,
                tmp_remainingAdjQty,
                res.ItemDisctinctPriceWise[0]
                  ? res.ItemDisctinctPriceWise[0].MRP
                  : res.ItemInfo[0].MRP,
                res.ItemDisctinctPriceWise[0]
                  ? res.ItemDisctinctPriceWise[0].SaleRate
                  : res.ItemInfo[0].SalePrice,
                false,
                l_catchedItemData,
                pBarcode
              );
              tmp_remainingAdjQty -= tmp_remainingAdjQty;
            }

            if (
              res.ItemInfo.length > 0 &&
              res.ItemInfo[0].ProductType === "D" &&
              (res.ItemDisctinctPriceWise[0] ||
                res.ItemInfo[0].MRP !== null ||
                res.ItemInfo[0].SalePrice !== null)
            ) {
              itemBarcodeRef.current.focus();
              setItemData({
                itemBarcode: null,
                ItemCode: null,
                Qty: null,
                unit: null,
                Mrp: null,
                SaleRate: null,
                BatchNo: null,
                ExpiryDate: null,
                InwardSeq: null,
              });
            } else {
              setItemDataDisabled({ ...itemDataDisabled, itemBarcode: true });
              QtyRef.current.focus();
              QtyRef.current.select();
            }
            // }
          }
        } else {
          setItemData({ ...itemData, ItemCode: null });
          notification.error({
            message: "Item In-Active",
            description: `Selected item is in-active `,
          });
        }
      } else {
        setItemData({ ...itemData, ItemCode: null });
        notification.error({
          message: "Incorrect Value",
          description: `No such item exist with this value`,
        });
      }
      //console.log(res.ItemDisctinctPriceWise, "res.ItemDisctinctPriceWise");
    });
  };

  const onGetItemCode = async (data) => {
    await getItemCodeFromBarcode(CompCode, data)
      .then(async (ires) => {
        if (ires.length > 0) {
          setLastScanned({ Code: ires[0].ItemCode, Barcode: ires[0].Barcode });
          if (props.entryMode === "A" && ires) {
            await validateItemCode(
              ires[0].ItemCode,
              "Barcode",
              ires[0].Barcode
            );
          }
        } else {
          setItemData({ ...itemData, itemBarcode: null });
          notification.error({
            message: "Incorrect Code",
            description: `No such item exist with code: ${data}`,
          });
        }
      })
      .catch((e) => {
        notification.error({ message: "Invalid Data", description: "Invalid" });
      });
  };

  const onAddClick = async () => {
    let l_catchedItemData;
    await getCatchedStockData(searchData.branch, itemData.ItemCode).then(
      (res) => {
        l_catchedItemData = res;
        //console.log("catched data", l_catchedItemData);
      }
    );

    //# Check If sale qty > Total Stock give warning
    let tmp_TotalBalQty;
    let tmp_remainingAdjQty = itemData.Qty;
    tmp_TotalBalQty = l_catchedItemData.ItemDisctinctPriceWise.filter(
      (kk) => kk.MRP === itemData.Mrp && kk.SaleRate === itemData.SaleRate
    ).BalQty;

    if (itemData.Qty > tmp_TotalBalQty) {
      //console.log("show warning of stock");
    }

    //add with inward seq
    l_catchedItemData.ItemDistinctInwardSeqWise.filter(
      (kk) =>
        parseFloat(kk.MRP) === parseFloat(itemData.Mrp) &&
        parseFloat(kk.SaleRate) === parseFloat(itemData.SaleRate)
    ).forEach((l_seqRow) => {
      //get recent bal qty
      let tmpAlreadySoldAgainstInwardSeqQty = 0;
      ItemTableData.filter(
        (rr) =>
          rr.ItemCode === l_seqRow.ItemCode &&
          rr.InwardSeq === l_seqRow.InwardSeq
      ).forEach((pl) => {
        tmpAlreadySoldAgainstInwardSeqQty += pl.Qty;
      });

      if (
        tmp_remainingAdjQty > 0 &&
        l_seqRow.BalQty - tmpAlreadySoldAgainstInwardSeqQty >
          tmp_remainingAdjQty
      ) {
        //console.log("cc1");
        AddItemTableDataAndCalc(
          itemData,
          itemData.ItemCode,
          itemData.ItemName,
          l_seqRow.InwardSeq,
          l_seqRow.BatchNo,
          l_seqRow.ExpiryDate,
          tmp_remainingAdjQty,
          itemData.Mrp,
          itemData.SaleRate,
          false,
          l_catchedItemData,
          itemData.itemBarcode
        );

        tmp_remainingAdjQty -= tmp_remainingAdjQty;
      } else if (
        tmp_remainingAdjQty > 0 &&
        l_seqRow.BalQty - tmpAlreadySoldAgainstInwardSeqQty > 0
      ) {
        //console.log("cc2");
        AddItemTableDataAndCalc(
          itemData,
          itemData.ItemCode,
          itemData.ItemName,
          l_seqRow.InwardSeq,
          l_seqRow.BatchNo,
          l_seqRow.ExpiryDate,
          l_seqRow.BalQty - tmpAlreadySoldAgainstInwardSeqQty,
          itemData.Mrp,
          itemData.SaleRate,
          false,
          l_catchedItemData,
          itemData.itemBarcode
        );

        tmp_remainingAdjQty -=
          l_seqRow.BalQty - tmpAlreadySoldAgainstInwardSeqQty;
      }
    });

    //Add Without inward seq
    if (tmp_remainingAdjQty > 0) {
      AddItemTableDataAndCalc(
        itemData,
        itemData.ItemCode,
        itemData.ItemName,
        -999,
        null,
        null,
        tmp_remainingAdjQty,
        itemData.Mrp,
        itemData.SaleRate,
        false,
        l_catchedItemData,
        itemData.itemBarcode
      );
      tmp_remainingAdjQty -= tmp_remainingAdjQty;
    }

    setItemDataDisabled({
      ...itemDataDisabled,
      ItemCode: false,
      unit: false,
      itemBarcode: false,
    });

    setItemData({
      itemBarcode: null,
      ItemCode: null,
      Qty: null,
      unit: null,
      Mrp: null,
      SaleRate: null,
      BatchNo: null,
      ExpiryDate: null,
      InwardSeq: null,
    });

    itemBarcodeRef.current.focus();
  };
  const columns = [
    { title: "Item Barcode", dataIndex: "itemBarcode", width: 120 },
    { title: "Item Code", dataIndex: "ItemCode", width: 80 },
    { title: "Item Name", dataIndex: "ItemName", ellipsis: true },
    {
      title: "Sub Category",
      width: 160,
      dataIndex: "SubCatDesc",
      ellipsis: true,
    },
    {
      title: "InwardSeq",
      dataIndex: "InwardSeq",
      width: 80,
    },
    {
      title: "Batch No",
      dataIndex: "BatchNo",
      width: 75,
    },
    {
      title: "Expiry Date",
      dataIndex: "ExpiryDate",
      width: 90,
      render(text, record) {
        return (
          <div>
            {record.ExpiryDate
              ? moment(record.ExpiryDate).format(l_ConfigDateFormat)
              : ""}
          </div>
        );
      },
    },
    {
      title: `Quantity`,
      dataIndex: "Qty",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {parseFloat(record.Qty).toFixed(3)}
          </div>
        );
      },
    },
    {
      title: `MRP (${currency.value1})`,
      dataIndex: "Mrp",
      align: "right",
      width: 80,
      render: (text, record) => {
        return <div>{parseFloat(_.round(record.Mrp, 3)).toFixed(3)}</div>;
      },
    },
    {
      title: `Sale (${currency.value1})`,
      dataIndex: "SalePrice",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {parseFloat(_.round(record.SalePrice, 3)).toFixed(3)}
          </div>
        );
      },
    },
    {
      title: `Discount (${currency.value1})`,
      dataIndex: "discount",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {record.DiscAmount ? record.DiscAmount : 0}
          </div>
        );
      },
    },
    {
      title: `Amount (${currency.value1})`,
      dataIndex: "Amount",
      align: "right",
      width: 90,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {parseFloat(_.round(record.FinalAmount, 3)).toFixed(3)}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "x",
      width: 60,
      align: "center",
      render: (text, record) => {
        return (
          <>
            <a
              className={`edit-btn ${
                record.IsAllowModification === "N" ? `disabled` : `edit-btn`
              }`}
              disabled={record.IsAllowModification === "N"}
              onClick={() => {
                let tempTable = [
                  ...ItemTableData.filter((aa) => aa.key !== record.key),
                ];
                CalcTotal(tempTable);
                setItemTableData([...tempTable]);
              }}
            >
              <DeleteTwoTone />
            </a>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ height: "100%" }}>
      {IsLoading ? (
        <div style={{ width: "100%", backgroundColor: "#FFF" }}>
          <Skeleton active={true} size={10} />
        </div>
      ) : (
        <>
          <Row style={{ height: "100%" }}>
            <Col
              style={{
                minWidth: "100%",
                maxWidth: "100%",
                height: "max-content",
              }}
            >
              <div
                className="card-sales"
                style={{ marginRight: 0, marginBottom: 5, paddingBottom: 4 }}
              >
                <Row>
                  <Col xs={3} lg={3} xl={3} style={{ paddingBottom: 0 }}>
                    <Row
                      className="purchase-search-input-container"
                      style={{ marginBottom: 0 }}
                    >
                      <Col xs={24} lg={24} style={{ alignSelf: "center" }}>
                        <div
                          style={{
                            alignSelf: "center",
                            paddingLeft: 5,
                          }}
                          className="sales-item-input-label purchase-search-label"
                        >
                          Voucher No:
                        </div>
                      </Col>
                      <Col xs={24} lg={24} className="purchase-search-input">
                        <Input
                          disabled
                          placeholder="Auto Generated"
                          style={{ width: "100%" }}
                          size="small"
                          className="bold-code"
                          defaultValue={searchData.voucherNo}
                          onChange={(e) => {
                            let oldD = { ...searchData };
                            setSearchData({
                              ...oldD,
                              voucherNo: e.target.value,
                            });
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={3} lg={3} xl={3} style={{ paddingBottom: 0 }}>
                    <Row
                      className="purchase-search-input-container"
                      style={{ marginBottom: 0 }}
                    >
                      <Col
                        xs={24}
                        lg={24}
                        xl={24}
                        style={{ alignSelf: "center" }}
                      >
                        <div
                          style={{
                            alignSelf: "center",
                            paddingLeft: 5,
                          }}
                          className="sales-item-input-label purchase-search-label"
                        >
                          Voucher Date:
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        lg={24}
                        xl={24}
                        className="purchase-search-input"
                      >
                        <DatePicker
                          disabled={true}
                          className="bold-date"
                          placeholder="Date"
                          style={{ width: "100%" }}
                          size="small"
                          format={l_ConfigDateFormat}
                          defaultValue={searchData.voucherDate}
                          onChange={(e) => {
                            setSearchData((oldD) => {
                              return { ...oldD, voucherDate: e };
                            });
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={2}
                    lg={2}
                    xl={2}
                    style={{ paddingBottom: 0, display: "none" }}
                  >
                    <Row className="purchase-search-input-container">
                      <Col xs={24} lg={24} style={{ alignSelf: "center" }}>
                        <div
                          style={{
                            alignSelf: "center",
                            paddingLeft: 5,
                          }}
                          className="sales-item-input-label purchase-search-label"
                        >
                          Voucher Type:
                        </div>
                      </Col>
                      <Col xs={24} lg={24} className="purchase-search-input">
                        <Select
                          placeholder="Type"
                          style={{ width: "100%" }}
                          size="small"
                          value={searchData.voucherType}
                          onChange={(e) => {
                            let oldD = { ...searchData };
                            setSearchData({
                              ...oldD,
                              voucherType: e.target.value,
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
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={3}
                    lg={3}
                    xl={3}
                    style={{ paddingBottom: 3, display: "none" }}
                  >
                    <Row className="purchase-search-input-container">
                      <Col xs={24} lg={24} style={{ alignSelf: "center" }}>
                        <div
                          style={{ alignSelf: "center", paddingLeft: 5 }}
                          className="sales-item-input-label purchase-search-label"
                        >
                          Branch:
                        </div>
                      </Col>
                      <Col xs={24} lg={24} className="purchase-search-input">
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
                            BranchMaster.filter(
                              (bb) => bb.IsActive === true
                            ).map((brn) => {
                              return (
                                <Option
                                  value={brn.BranchCode}
                                  key={brn.BranchCode}
                                >
                                  {brn.BranchName}
                                </Option>
                              );
                            })}
                        </Select>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={3}
                    lg={3}
                    style={{ paddingBottom: 3, display: "none" }}
                  >
                    <Row className="purchase-search-input-container">
                      <Col xs={24} lg={24} style={{ alignSelf: "center" }}>
                        <div
                          style={{
                            alignSelf: "center",
                            paddingLeft: 5,
                          }}
                          className="sales-item-input-label purchase-search-label"
                        >
                          Department:
                        </div>
                      </Col>
                      <Col xs={24} lg={24} className="purchase-search-input">
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
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    lg={3}
                    xl={3}
                    style={{ paddingBottom: 3, display: "none" }}
                  >
                    <Row className="purchase-search-input-container">
                      <Col
                        xs={24}
                        lg={24}
                        xl={24}
                        style={{ alignSelf: "center" }}
                      >
                        <div
                          style={{
                            alignSelf: "center",
                            paddingLeft: 5,
                          }}
                          className="sales-item-input-label purchase-search-label"
                        >
                          Tax Type:
                        </div>
                      </Col>
                      <Col
                        xs={24}
                        lg={24}
                        xl={24}
                        className="purchase-search-input"
                      >
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          placeholder="Sale type"
                          style={{ width: "100%" }}
                          size="small"
                          dropdownStyle={{ fontSize: 12 }}
                          onChange={(value) => {
                            setSearchData((oldD) => {
                              return { ...oldD, saleType: value };
                            });
                          }}
                          value={searchData.saleType}
                        >
                          <Option value="GST_INC">GST Inclusive</Option>
                          <Option value="GST_EXC">GST Exclusive</Option>
                        </Select>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={7}
                    lg={7}
                    xl={7}
                    style={{ paddingBottom: 0, marginRight: 0 }}
                  >
                    <Row
                      className="purchase-search-input-container"
                      style={{
                        marginRight: 0,
                      }}
                    >
                      <Col
                        xs={24}
                        lg={24}
                        xl={24}
                        style={{ alignSelf: "center" }}
                      >
                        <div
                          style={{ alignSelf: "center", paddingLeft: 5 }}
                          className="sales-item-input-label purchase-search-label"
                        >
                          Customer:
                        </div>
                      </Col>
                      <Col xs={24} lg={24} xl={24} style={{ display: "flex" }}>
                        <div
                          style={{
                            width: "calc(100% - 75px)",
                            display: "flex",
                          }}
                          className="purchase-search-input"
                        >
                          <a
                            onClick={() => {
                              setShowModal("SEARCH_CUSTOMER");
                            }}
                            style={{
                              padding: " 0px 5px",
                              height: " 100%",
                              alignSelf: "center",
                              background: "#fafafa",
                              border: "1px solid #d9d9d9",
                              width: 24,
                            }}
                          >
                            <Tooltip title="Search Customer">
                              <span>
                                <i>
                                  <UserOutlined />
                                </i>
                              </span>
                            </Tooltip>
                          </a>
                          <Select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            placeholder="Customer"
                            style={{
                              width: "calc(100% - 24px)",
                              flex: 1,
                              alignSelf: "center",
                            }}
                            size="small"
                            onChange={(value) => {
                              setSearchData((oldD) => {
                                return { ...oldD, customerId: value };
                              });
                            }}
                            ref={customerSelectref}
                            value={searchData.customerId}
                          >
                            {customer.length > 0 &&
                              customer.map((cc) => (
                                <Option value={cc.userId} key={cc.userId}>
                                  {cc.Name} ({cc.mobile})
                                </Option>
                              ))}
                          </Select>
                        </div>
                        <div style={{ width: 75, minWidth: 75 }}>
                          <Button
                            type="primary"
                            shape="circle"
                            size="small"
                            style={{
                              margin: "auto 5px auto",
                            }}
                            disabled={
                              (searchData.customerId &&
                                searchData.customerId !== null) ||
                              !hasRightToBeUsedNext(
                                userMasterRights.Rights,
                                "ADD"
                              )
                            }
                            onClick={() => setShowModal("CUSTOMER")}
                            icon={<PlusOutlined />}
                          ></Button>
                          <Button
                            type="primary"
                            shape="circle"
                            disabled={
                              !searchData.customerId ||
                              searchData.customerId === null ||
                              !hasRightToBeUsedNext(
                                userMasterRights.Rights,
                                "EDIT"
                              )
                            }
                            size="small"
                            onClick={() => setShowModal("CUSTOMER")}
                            style={{}}
                            icon={<EditOutlined />}
                          ></Button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col
              className="card-sales"
              style={{ minWidth: "100%", height: 60 }}
            >
              <Row>
                <Col span={3} style={{}} className="sales-item-input-outer">
                  <Row className="sales-item-input-inner">
                    <Col
                      span={24}
                      className="sales-item-input-label"
                      style={{ alignSelf: "center", paddingRight: 8 }}
                    >
                      Barcode / SKU
                    </Col>
                    <Col span={24} style={{ display: "flex" }}>
                      <Input
                        addonBefore={
                          <a
                            onClick={() => {
                              setShowModal("SEARCH_ITEM");
                            }}
                            ref={productSelect}
                          >
                            <Tooltip title="Search Items">
                              <i>
                                <ShoppingCartOutlined />
                              </i>
                            </Tooltip>
                          </a>
                        }
                        className="bold-code"
                        placeholder="Code"
                        size="small"
                        autoFocus={true}
                        disabled={itemDataDisabled.itemBarcode}
                        ref={itemBarcodeRef}
                        onChange={(e) => {
                          let oldD = { ...itemData };
                          setItemData({ ...oldD, itemBarcode: e.target.value });
                        }}
                        value={itemData.itemBarcode}
                        onKeyDown={(event) => {
                          if (
                            event.keyCode === 13 ||
                            (!event.shiftKey && event.keyCode === 9)
                          ) {
                            if (
                              !_.includes(
                                [null, "", undefined],
                                event.target.value
                              )
                            ) {
                              event.preventDefault();
                              onGetItemCode(event.target.value);
                              //   setLastCalledFrom("Barcode");
                            }
                          }
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={6} className="sales-item-input-outer">
                  <Row className="sales-item-input-inner">
                    <Col
                      className="sales-item-input-label"
                      span={24}
                      style={{
                        alignSelf: "center",
                        paddingRight: 8,
                        paddingLeft: 5,
                      }}
                    >
                      <span style={{ color: "red" }}>* </span> Product Name
                    </Col>
                    <Col span={24} style={{ display: "flex", paddingRight: 5 }}>
                      <Input
                        style={{ maxHeight: 24, fontWeight: 600 }}
                        placeholder="Product Name"
                        size="small"
                        value={itemData.ItemName}
                        readOnly={itemDataDisabled.ItemName}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col
                  span={3}
                  style={{
                    paddingRight: 5,
                  }}
                  className="sales-item-input-outer"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        paddingRight: 5,
                        width: "100%",
                      }}
                    >
                      Sub Category
                    </div>

                    <Input
                      placeholder="Sub Category"
                      style={{ width: "100%" }}
                      size="small"
                      readOnly={true}
                      disabled={itemDataDisabled.unit}
                      value={itemData.SubCatDesc}
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, unit: e });
                      }}
                    />
                  </Row>
                </Col>
                <Col
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                  className="sales-item-input-outer"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        paddingRight: 5,
                        width: "100%",
                      }}
                    >
                      Unit
                    </div>
                    <Select
                      placeholder="Unit"
                      style={{ width: "100%", fontWeight: 600 }}
                      size="small"
                      className="bold-select"
                      disabled={itemDataDisabled.unit}
                      value={itemData.unit}
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, unit: e });
                      }}
                    >
                      {unitMaster &&
                        unitMaster.map((uu) => {
                          return (
                            <Option value={uu.UnitCode} key={uu.UnitCode}>
                              {uu.UnitDesc}
                            </Option>
                          );
                        })}
                    </Select>
                  </Row>
                </Col>
                <Col
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                  className="sales-item-input-outer"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>Quantity
                    </div>
                    <Input
                      step={1}
                      min={0}
                      className="bill-input"
                      placeholder="Quantiy"
                      style={{ width: "100%", textAlign: "right" }}
                      size="small"
                      type="number"
                      ref={QtyRef}
                      onChange={(e) => {
                        let xx = e.target.value;
                        if (
                          xx &&
                          ((itemData && itemData.AllowDecimal === "N") ||
                            itemData.ProductType === "D")
                        ) {
                          let typeValue = xx.toString();
                          let value = typeValue.replace(/[^0-9]*/g, "");
                          let oldD = { ...itemData };
                          setItemData({ ...oldD, Qty: parseFloat(value) });
                        } else {
                          let oldD = { ...itemData };
                          setItemData({
                            ...oldD,
                            Qty: parseFloat(xx),
                          });
                        }
                      }}
                      onKeyDown={(event) => {
                        if (
                          (itemData && itemData.AllowDecimal === "N") ||
                          itemData.ProductType === "D"
                        ) {
                          if (event.key === ".") {
                            event.preventDefault();
                          }
                        }
                        if (event.keyCode === 13) {
                          event.preventDefault();
                          ItemAddRef.current.focus();
                          ItemAddRef.current.click();
                        }
                      }}
                      value={itemData.Qty !== null ? itemData.Qty : null}
                      disabled={itemDataDisabled.Qty}
                    />
                  </Row>
                </Col>
                <Col
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                  className="sales-item-input-outer"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>Sale Price
                    </div>
                    <Input
                      type="number"
                      min={1}
                      className="bill-input"
                      placeholder="Sale Price"
                      size="small"
                      style={{ width: "100%", textAlign: "right" }}
                      onChange={(e) => {
                        let xx = e.target.value;
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, SaleRate: xx });
                      }}
                      value={itemData.SaleRate}
                      disabled={itemDataDisabled.SaleRate}
                    />
                  </Row>
                </Col>
                <Col
                  className="sales-item-input-outer"
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>MRP
                    </div>
                    <Input
                      min={1}
                      className="bill-input"
                      placeholder="MRP"
                      style={{ width: "100%", textAlign: "right" }}
                      size="small"
                      onChange={(e) => {
                        let xx = e.target.value;
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, Mrp: xx });
                      }}
                      value={itemData.Mrp}
                      disabled={itemDataDisabled.Mrp}
                    />
                  </Row>
                </Col>

                <Col
                  span={3}
                  style={{
                    display: "flex",
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      marginRight: 5,
                      height: "100%",
                      fontSize: "16px",
                      fontWeight: "600",
                      flex: 1,
                    }}
                    disabled={_.includes([null, ""], itemData.ItemName)}
                    ref={ItemAddRef}
                    icon={<PlusCircleOutlined style={{ fontSize: 25 }} />}
                    size="small"
                    onClick={async () => {
                      if (
                        _.includes([null, ""], itemData.Qty) ||
                        _.includes([null, ""], itemData.Mrp) ||
                        _.includes([null, ""], itemData.SaleRate)
                      ) {
                        notification.error({
                          message: "Required Fields are Empty",
                          description: (
                            <span>
                              Input's with (
                              <span style={{ color: "red" }}> * </span> ) cannot
                              be empty
                            </span>
                          ),
                          duration: 1,
                        });
                        QtyRef.current.focus();
                      } else {
                        onAddClick();
                        // console.log("add click");
                      }
                    }}
                  ></Button>
                  <Button
                    // ref={ItemResetRef}
                    type="primary"
                    style={{
                      height: "100%",
                      fontSize: "16px",
                      fontWeight: "600",
                      flex: 1,
                    }}
                    icon={<RetweetOutlined style={{ fontSize: 22 }} />}
                    size="small"
                    onClick={() => {
                      setItemData({
                        itemBarcode: null,
                        ItemCode: null,
                        Qty: null,
                        unit: null,
                        Mrp: null,
                        SaleRate: null,
                        BatchNo: null,
                        ExpiryDate: null,
                        InwardSeq: null,
                      });
                      setItemDataDisabled({
                        ...itemDataDisabled,
                        ItemCode: false,
                        unit: false,
                        itemBarcode: false,
                      });
                    }}
                  ></Button>
                </Col>
              </Row>
            </Col>
            <Col
              style={{
                minWidth: "100%",
                maxWidth: "100%",
                display: "flex",
                height: "calc(100vh - 463px)",
                maxHeight: "calc(100vh - 463px)",
              }}
            >
              <div
                className="card-sales"
                style={{
                  marginRight: 0,
                  width: "100%",
                }}
              >
                <Table
                  columns={columns.filter(
                    (cc) =>
                      (props.showBatch === "Y"
                        ? true
                        : !_.includes(
                            ["BatchNo", "ExpiryDate"],
                            cc.dataIndex
                          )) &&
                      (invType === "Y"
                        ? true
                        : !_.includes(["InwardSeq"], cc.dataIndex))
                  )}
                  dataSource={
                    ItemTableData.filter((aa) => aa.IsDeleted === false)
                    // null
                  }
                  pagination={false}
                  bordered={true}
                  key={(data) => {
                    return data.key;
                  }}
                  sort
                  className="sales-table"
                  scroll={{ y: "calc(100% - 30px)", x: "max-content" }}
                  size="small"
                />
              </div>
            </Col>
            <Col
              style={{
                display: "flex",
                flexFlow: "row wrap",
                minWidth: "100%",
                height: 245,
              }}
            >
              <Col
                span={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  paddingBottom: 5,
                  paddingRight: 3,
                }}
              >
                <SalesRecentTransactionComponent
                  lastScanned={lastScanned}
                  recentTran={recentTran}
                  //   TranType={"SALE"}
                />
              </Col>
              <Col
                span={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <SalesSummaryComponent
                  TaxType={voucherSummary.TaxType}
                  GrossAmount={voucherSummary.GrossAmount}
                  DiscountAmount={voucherSummary.Discount}
                  TaxAmount={voucherSummary.TaxAmount}
                  AddIncomeAndExpenses={voucherSummary.AddIncomeAndExpenses}
                  RoundOff={voucherSummary.RoundOff}
                  NetAmount={voucherSummary.NetAmount}
                  onBackClick={() => {
                    props.onBackPress();
                  }}
                  onDiscountFixedChange={(val) => {
                    let l_DiscInfo;
                    if (
                      voucherSummary.GrossAmount > 0 &&
                      (_.isNumber(val) || !isNaN(parseFloat(val)))
                    ) {
                      if (parseFloat(val) > voucherSummary.GrossAmount) {
                        notification.error({
                          message: "Invalid Discount",
                          description:
                            "Discount cannot be in more than gross amount",
                        });
                        l_DiscInfo = {
                          Source: "V",
                          AmountValue: 0,
                          PercValue: 0,
                        };
                      } else {
                        l_DiscInfo = {
                          Source: "V",
                          AmountValue: val,
                          PercValue: _.round(
                            (val / voucherSummary.GrossAmount) * 100,
                            3
                          ),
                        };
                      }
                    } else {
                      l_DiscInfo = {
                        Source: "V",
                        AmountValue: 0,
                        PercValue: 0,
                      };
                    }
                    setDiscountInfo(l_DiscInfo);
                    if (ItemTableData.length > 0) {
                      CalcTotal(undefined, l_DiscInfo);
                    }
                  }}
                  onDiscountPercentageChange={(val) => {
                    let l_DiscInfo;
                    if (
                      voucherSummary.GrossAmount > 0 &&
                      (_.isNumber(val) || !isNaN(parseFloat(val)))
                    ) {
                      l_DiscInfo = {
                        Source: "P",
                        AmountValue: (voucherSummary.GrossAmount / 100) * val,
                        PercValue: val,
                      };
                    } else {
                      l_DiscInfo = {
                        Source: "P",
                        AmountValue: 0,
                        PercValue: 0,
                      };
                    }
                    setDiscountInfo(l_DiscInfo);
                    CalcTotal(undefined, l_DiscInfo);
                  }}
                  Fvalue={distcountInfo.AmountValue}
                  Pvalue={distcountInfo.PercValue}
                  saveRef={saveRef}
                  backSummaryRef={backSummaryRef}
                  onDiscCLick={() => {
                    setShowModal("DISC");
                  }}
                  onAddIECLick={() => {
                    setShowModal("ADDIE");
                  }}
                  disableSave={
                    ItemTableData.filter((aa) => aa.IsDeleted === false)
                      .length === 0
                      ? true
                      : false
                  }
                  onSaveClick={() => {
                    setResponseData(true);
                  }}
                  onSaveAndPrintClick={async () => {}}
                />
              </Col>
            </Col>
            {keyboardKey.length > 0 && (
              <Col span={24}>
                <ViewHotKeysComponent
                  keyboardKey={keyboardKey}
                  title={`Sales Order Screen (Hotkey Config)`}
                  RefreshKeyConfig={() => {
                    // onRefreshKeyConfig("SalesOrder");
                  }}
                />
              </Col>
            )}
          </Row>

          <Modal
            visible={showModal === "CUSTOMER"}
            footer={false}
            bodyStyle={{ padding: "0px 0px" }}
            destroyOnClose={true}
            onCancel={() => {
              setShowModal();
            }}
            width={750}
          >
            <Col style={{ padding: "10px 15px" }} className="card-sales-inner">
              Customer Selection
            </Col>
            <CustomerSelectionComponent
              onBackPress={() => {
                setShowModal();
              }}
              onCustomerSet={(values) => {
                dispatch(fetchUserMasters("U"));
                setSearchData((oldD) => {
                  return {
                    ...oldD,
                    customerId: values.customer.userId,
                    customerAddress:
                      values.customer.address.length > 0
                        ? values.customer.address[0]
                        : null,
                  };
                });
                setShowModal();
              }}
              data={{
                customer:
                  searchData.customerId !== null
                    ? customer.find((aa) => aa.userId === searchData.customerId)
                    : null,
              }}
            />
          </Modal>
          <Modal
            visible={showModal === "SEARCH_ITEM"}
            footer={false}
            bodyStyle={{ padding: "5px 10px" }}
            destroyOnClose={true}
            onCancel={() => {
              setShowModal();
              itemBarcodeRef.current.focus();
            }}
            width={"90%"}
          >
            <SelectableItem
              selectType="radio"
              data={itemMasterData}
              branch={searchData.branch}
              onItemSelect={(data) => {
                if (data) {
                  let oldD = { ...itemData };
                  setShowModal();
                  validateItemCode(data.ItemCode, "Barcode");
                  setLastScanned({ Code: data.ItemCode, Barcode: null });
                }
              }}
              onBackPress={() => {
                setShowModal();
                itemBarcodeRef.current.focus();
              }}
              updateItemMaterData={(data) => {
                setItemMasterData([...data]);
              }}
            />
          </Modal>
          <Modal
            visible={showModal === "SEARCH_CUSTOMER"}
            footer={false}
            bodyStyle={{ padding: "0px 0px" }}
            destroyOnClose={true}
            onCancel={() => {
              setShowModal();
              //   itemBarcodeRef.current.focus();
            }}
            className="search-customer"
            width={750}
          >
            <SearchCustomer
              data={customer}
              onItemSelect={(data) => {
                if (data) {
                  setSearchData((oldD) => {
                    return { ...oldD, customerId: data.userId };
                  });
                  setShowModal();
                }
              }}
              onBackPress={() => {
                setShowModal();
                itemBarcodeRef.current.focus();
              }}
            />
          </Modal>

          <Modal
            visible={showModal === "STOCK_DISTINCT_PRICE"}
            footer={false}
            bodyStyle={{ padding: "0px 0px" }}
            destroyOnClose={true}
            onCancel={() => {
              setShowModal();
              itemBarcodeRef.current.focus();
            }}
            className="search-customer"
            width={"40%"}
            maskClosable={false}
            closable={false}
          >
            <StockDistinctPrice
              data={stockDistinctPrice}
              onItemSelect={(data) => {
                if (data) {
                  setItemData((old) => {
                    return {
                      ...old,
                      Mrp: data.MRP,
                      SaleRate: data.SaleRate,
                      BalQty: data.BalQty,
                    };
                  });
                  setItemDataDisabled((old) => {
                    return { ...old, itemBarcode: true, ItemCode: true };
                  });
                  setShowModal();
                  QtyRef.current.focus();
                }
              }}
              onBackPress={() => {
                setItemData((old) => {
                  return {
                    ...old,
                    ItemName: null,
                    unit: null,
                    Qty: null,
                  };
                });
                setItemDataDisabled((old) => {
                  return {
                    ...old,
                    itemBarcode: false,
                    ItemCode: false,
                  };
                });
                setShowModal();
                itemBarcodeRef.current.focus();
                setStockDistinctPrice();
              }}
            />
          </Modal>
          <Modal
            visible={showModal === "DISC" || showModal === "ADDIE"}
            footer={false}
            bodyStyle={{ padding: "0px 0px" }}
            destroyOnClose={true}
            onCancel={() => {
              setShowModal();
              itemBarcodeRef.current.focus();
            }}
            className="search-customer"
            width={window.innerWidth > 800 ? "50%" : "100%"}
            maskClosable={false}
          >
            <DiscountAdditionalIncomeExpenseComp
              type={showModal}
              discount={discount}
              addIncomeExpense={addIncomeExpense}
              onBackPress={() => {
                setShowModal();
                itemBarcodeRef.current.focus();
              }}
              onSaveClick={(data) => {
                setDiscount(data.discount);
                setAddIncomeExpense(data.IncomeExpense);
                CalcTotal(undefined, undefined, data.IncomeExpense);
              }}
            />
          </Modal>
          <Drawer
            width={"60%"}
            placement="right"
            closable={false}
            onClose={() => {
              setResponseData();
              itemBarcodeRef.current.focus();
            }}
            bodyStyle={{ padding: 0, position: "relative" }}
            getContainer={false}
            style={{ position: "absolute" }}
            visible={responseData ? true : false}
            destroyOnClose={true}
          >
            {responseData ? (
              <PaymentModeComponent
                loading={IsLoading}
                onBackPress={() => {
                  setResponseData();
                  itemBarcodeRef.current.focus();
                }}
                keyboardKey={keyboardKey}
                customer={customer}
                selectedCust={searchData}
                onCustomerEditClick={() => {
                  setShowModal("CUSTOMER");
                }}
                summary={voucherSummary}
                onSaveClick={(rptData, pPrint) => {
                  setIsLoading(true);
                  let SaleOrderHdr = {
                    VoucherDate: moment(searchData.voucherDate).format(
                      "YYYY-MM-DD"
                    ),
                    VoucherNo: null,
                    CompCode: CompCode,
                    BranchCode: searchData.branch,
                    DeptCode: searchData.department,
                    TaxType: searchData.saleType,
                    CustId: rptData.hdrData.customerId,
                    SaleType: "SALEORDER",
                    CustName: rptData.hdrData.customerName,
                    CustMobile: rptData.hdrData.customerMobile,
                    CustBillingAddress: rptData.hdrData.customerAddress,
                    CustDeliveryAddress: null,
                    CreditDays: null,
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
                    SchemeDiscAmount: 0,
                    TaxAmount: voucherSummary.TaxAmount,
                    MiscAmount: 0,
                    RoundOff: voucherSummary.RoundOff,
                    NetAmount: voucherSummary.NetAmount,
                    SettlementAmount: 0,
                    UpdtUsr: l_loginUser,
                  };

                  let SaleOrderDtl = [];
                  ItemTableData.forEach((row, idx) => {
                    SaleOrderDtl.push({
                      SrNo: idx + 1,
                      ItemCode: row.ItemCode,
                      ScannedBarcode: row.itemBarcode,
                      InwardSeq: row.InwardSeq,
                      BatchNo: row.BatchNo,
                      ExpiryDate: _.isDate(row.ExpiryDate)
                        ? moment(row.ExpiryDate).format("YYYY-MM-DD")
                        : null,
                      SaleQty: row.Qty,
                      CostPrice: row.CostPrice,
                      SalePrice: row.SalePrice,
                      LSalePrice: row.LSalePrice,
                      MRP: row.Mrp,
                      DiscPer: row.DiscPer,
                      DiscAmount: row.DiscAmount,
                      SchemeDiscAmount: row.SchemeDiscountAmount,
                      SchemeCode: row.SchemeCode,
                      TaxCode: row.TaxCode,
                      TaxPerc: row.TaxPerc,
                      TaxAmount: row.TaxAmount,
                      ItemTotal: row.ItemTotal,
                      Amount: row.Amount,
                      SysOption1: null,
                      SysOption2: null,
                      SysOption3: null,
                      SysOption4: null,
                      SysOption5: null,
                      CGST: row.CGST,
                      SGST: row.SGST,
                      IGST: row.IGST,
                      UTGST: row.UTGST,
                      Surcharge: row.Surcharge,
                      Cess: row.Cess,
                      UpdtUsr: l_loginUser,
                    });
                  });
                  let AddIncomeExpensesDtl = [];
                  addIncomeExpense.forEach((row, index) => {
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
                  console.log(
                    rptData,
                    // pPrint,
                    "save click"
                  );
                  invSaveSaleOrderInvoice(
                    CompCode,
                    SaleOrderHdr,
                    SaleOrderDtl,
                    AddIncomeExpensesDtl
                  ).then((res) => {
                    let finalData = {
                      ...rptData,
                      hdrData: {
                        ...rptData.hdrData,
                        Remark: `*Auto Generated Receipt Against SALE-ORDER-BILL-NO *${res.VoucherNo}`,
                        currentTime: moment().format(l_ConfigDateTimeFormat),
                        Amount: rptData.hdrData.amountPaid,
                      },
                      stlmntData: {},
                    };
                    setRecentTran([finalData, ...recentTran]);
                    saveInsReceiptAndPayments(CompCode, finalData).then(
                      (res) => {
                        setIsLoading(false);
                        setResponseData();
                        // reInitializeForm();
                        notification.success({
                          message: "Data saved successfully",
                          description: "Sales has been created successfully",
                        });
                        props.onBackPress();
                      }
                    );
                  });
                }}
              />
            ) : (
              "loading"
            )}
          </Drawer>
        </>
      )}
    </div>
  );
};

export default SalesOrderCard;
