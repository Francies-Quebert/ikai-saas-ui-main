import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  notification,
  Table,
  Modal,
  Select,
  DatePicker,
  Tooltip,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  RetweetOutlined,
  BarcodeOutlined,
  ShoppingCartOutlined,
  PlusCircleOutlined,
  EditTwoTone,
  DeleteTwoTone,
  UserOutlined,
  PrinterOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  hasRight,
  hasRightToBeUsedNext,
  RoundConfiguredValue,
} from "../../../shared/utility";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymodeMaster } from "../../../services/payModeMaster";
import { fetchBranchMasterData } from "../../../services/branch-master";
import { fetchDeptMasterService } from "../../../services/department-master";
import {
  invGetDataTranPurchase,
  invSavePurchaseInvoice,
  invSaveUpdatePurchaseInvoice,
} from "../../../services/inventory";
import {
  getInvItemMasterData,
  getItemCodeFromBarcode,
  invValidateItemCodeInTransaction,
} from "../../../services/opening-stock";
import _ from "lodash";
import {
  InvGetTransactionTypes,
  InvGetItemBalanceStockDistinctByPrices,
  InvGetItemBalanceStockDistinctByInwardSeq,
} from "../../../services/inventory";
import { getUnitMaster } from "../../../services/unit-master";
import StockDistinctPrice from "../../sales/StockDistinctPrice";
import SelectableItem from "../../Inventory/Adjustment/SelectableItem";
import SupplierMasterComp from "../../portal/backoffice/SupplierMaster/SupplierMasterComp";
import { fetchSupplierMasterComp } from "../../../services/supplier-master-comp";
import { fetchStateMasters } from "../../../store/actions/StateMaster";
import { fetchCountryMasters } from "../../../store/actions/CountryMaster";
import { fetchCityMasters } from "../../../store/actions/CityMaster";
import PurchaseSummaryComponent from "../PurchaseSummaryComponent";
import SearchSupplier from "../SearchSupplier";
import { getTaxMaster } from "../../../services/taxMaster";
import AppLoader from "../../common/AppLoader";
import { RotateCcw } from "react-feather";
import DiscountAdditionalIncomeExpenseComp from "../../sales/DiscountAdditionalIncomeExpenseComp";
import swal from "sweetalert";

const { Option } = Select;

const NewPurchaseCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const roundOffConfigs = useSelector((state) => state.AppMain.roundOffConfigs);

  const initialSearchData = {
    branch: null,
    department: null,
    voucherNo: null,
    voucherDate: moment(),
    voucherType: null,
    saleType: "GST_INC",
    supplierId: null,
    supplierName: null,
    deliveryChallanDate: null,
    deliveryChallanNo: null,
    billNo: null,
    billDate: null,
    creditDays: null,
    eWaybillNo: null,
    vehicleNo: null,
    sysoption1: null,
  };
  const initialItemDataValues = {
    id: null,
    itemBarcode: null,
    ItemCode: null,
    ItemName: null,
    Qty: null,
    Mrp: null,
    SalePrice: null,
    BatchNo: null,
    ExpiryDate: null,
    InwardSeq: null,
    UnitCode: null,
    TaxAmount: null,
    Cost: null,
    LandingCost: null,
    discount: null,
    freeQty: null,
    TaxCode: null,
    totalQty: null,
    SubCatDesc: null,
    TaxPer: null,
  };
  const [itemDataDisabled, setItemDataDisabled] = useState({
    itemBarcode: false,
    ItemCode: false,
    ItemName: true,
    Qty: false,
    UnitCode: true,
    Mrp: false,
    SalePrice: false,
    BatchNo: false,
    ExpiryDate: false,
    InwardSeq: true,
    TaxCode: false,
    Cost: false,
    LandingCost: true,
    discount: false,
    freeQty: false,
    TaxAmount: true,
    totalQty: true,
    SubCatDesc: true,
  });

  const [searchData, setSearchData] = useState(initialSearchData);
  const [itemData, setItemData] = useState(initialItemDataValues);
  const [editData, setEditData] = useState({
    itemData: initialItemDataValues,
    table: [],
  });
  const [voucherSummary, setVoucherSummary] = useState();
  const [IsLoading, setIsLoading] = useState(false);
  const [BranchMaster, setBranchMaster] = useState();
  const [DeptMaster, setDeptMaster] = useState();
  const [TranType, setTranType] = useState();
  const [showModal, setShowModal] = useState();
  const [itemMasterData, setItemMasterData] = useState([]);
  const [ItemTableData, setItemTableData] = useState([]);
  const [unitMaster, setUnitMaster] = useState();
  const [paymentMode, setPaymentMode] = useState([]);
  const [stockDistinctPrice, setStockDistinctPrice] = useState();
  const [supplierData, setSupplierData] = useState([]);
  const [taxMaster, setTaxMaster] = useState([]);
  const [lastCalledFrom, setLastCalledFrom] = useState();
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [prevData, setPrevData] = useState([]);
  const [mode, setMode] = useState("A");
  // const [isLoading, setIsLoading] = useState(false);
  const [addIncomeExpense, setAddIncomeExpense] = useState([]);
  const [prevIEData, setPrevIEData] = useState([]);

  const itemCodeRef = useRef();
  const QtyRef = useRef();
  const ItemAddRef = useRef();
  const ItemResetRef = useRef();
  const itemBarcodeRef = useRef();

  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const suppMasterRights = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 89)[0]
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const l_ConfigPrevDates = useSelector((state) =>
    state.AppMain.appconfigs.find(
      (cur) => cur.configCode === "ENABLE_PREV_DATES"
    )
  );

  useEffect(() => {
    let tempTotalPaid = 0;
    paymentMode
      .filter((bb) => bb.IsChecked === true && bb.IsActive === 1)
      .map((aa) => {
        tempTotalPaid += aa.Amount;
      });
    setTotalAmountPaid(tempTotalPaid);
  }, [paymentMode]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      async function fetchData() {
        let branch = null;
        let depart = null;
        let TranType = null;
        fetchPaymodeMaster(CompCode).then((res) => {
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

        await InvGetTransactionTypes(CompCode, "PUR").then((trantype) => {
          if (trantype.length > 0) {
            TranType = trantype[0].TranConfigCode;
            setTranType(trantype);
          }
        });
        await getTaxMaster(CompCode).then((res) => {
          setTaxMaster(res.filter((tx) => tx.IsActive === true));
        });

        if (props.VoucherId) {
          invGetDataTranPurchase(CompCode, props.VoucherId).then((res) => {
            // // console.log(res, "new get data");
            mappData(res, { branch: branch });
          });
        } else {
          setSearchData({
            ...searchData,
            branch: branch,
            department: depart,
            voucherType: TranType,
          });
        }
      }
      fetchData();
      dispatch(fetchCountryMasters());
      dispatch(fetchStateMasters());
      dispatch(fetchCityMasters());
      fetchSupplierMasterComp(CompCode).then((res) => {
        setSupplierData(res.filter((aa) => aa.IsActive === true));
      });

      if (props.entryMode === "A") {
        setIsLoading(false);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (searchData.branch !== null) {
      getInvItemMasterData(CompCode, searchData.branch.BranchCode).then(
        (res1) => {
          setItemMasterData(res1);
        }
      );
    }
    return () => {
      setItemMasterData([]);
    };
  }, [searchData.branch]);

  const mappData = (data) => {
    // console.log(data, "step 1");
    let tempTableData = [];
    let tempIEData = [];

    try {
      if (data[0]) {
        data[0].map(async (item) => {
          await setSearchData({
            branch: item.BranchCode,
            department: item.DeptCode,
            voucherNo: item.VoucherNo,
            voucherDate: item.VoucherDate,
            voucherType: item.PurchaseType,
            saleType: item.TaxType,
            supplierId: item.SuppId,
            deliveryChallanDate:
              item.DeliveryChallanDate !== null
                ? moment(item.DeliveryChallanDate)
                : null,
            deliveryChallanNo: item.DeliveryChallanNo,
            billNo: item.PurchaseBillNo,
            billDate:
              item.PurchaseBillDate !== null
                ? moment(item.PurchaseBillDate)
                : null,
            creditDays: item.CreditDays,
            eWaybillNo: item.EWayBillNo,
            vehicleNo: item.VehicleNo,
            sysoption1: item.SysOption1,
          });
        });
        // console.log("step 2");
      } else {
        setSearchData(initialSearchData);
      }
      setPrevData(data[1]);
      if (data[1]) {
        let vouchSumm;

        let l_GrossAmount = 0;
        let costTaxAmount = 0;
        let l_Discount = 0;
        let itemTotalCost = 0;
        let l_taxAmt = 0;
        // console.log("step 3");
        data[1].forEach((row, ind) => {
          let l_Qty = 0;
          let lFreeQty = 0;
          let l_Total_Qty = 0;
          let l_Cost = 0;
          let l_LandingCost = 0;

          l_taxAmt += parseFloat(row.TaxAmount);
          l_Qty +=
            row && !_.includes(["", null, undefined], row.Qty)
              ? parseFloat(row.Qty)
              : 0;
          lFreeQty +=
            row && !_.includes(["", null, undefined, undefined], row.FreeQty)
              ? parseFloat(row.FreeQty)
              : 0;
          l_Total_Qty += l_Qty + lFreeQty;
          l_Discount +=
            row && !_.includes(["", null, undefined], row.DiscAmount)
              ? parseFloat(row.DiscAmount)
              : 0;
          l_Cost += row && row.CostPrice ? parseFloat(row.CostPrice) : 0;
          l_GrossAmount += parseFloat(l_Cost) * l_Qty;

          itemTotalCost = l_GrossAmount - l_Discount + l_taxAmt;
          costTaxAmount = parseFloat(l_taxAmt);

          tempTableData.push({
            ...row,
            rowIndex: ItemTableData.length,
            key: ind,
            IsDeleted: false,
            itemBarcode: row.ScannedBarcode,
            ItemCode: row.ItemCode,
            ItemName: row.ItemName,
            Qty: parseFloat(row.Qty).toFixed(2),
            UnitCode: row.UnitCode,
            freeQty: parseFloat(row.FreeQty),
            Tax: `${parseFloat(row.TaxAmount).toFixed(2)} (${parseFloat(
              row.TaxPerc
            ).toFixed(2)})`,
            Cost: parseFloat(row.CostPrice) * 10,
            DiscPer: parseFloat(row.DiscPer),
            discount: parseFloat(row.DiscAmount),
            TaxCode: row.TaxCode,
            TaxPer: parseFloat(row.TaxPerc),
            LandingCost: parseFloat(row.ItemTotalCost),
            grossTotal:
              parseFloat(row.CostPrice) * parseFloat(row.Qty) +
              parseFloat(row.DiscAmount),
            ItemTotalCost: parseFloat(row.Amount),
            TaxAmount: parseFloat(row.TaxAmount),
            totalQty: parseFloat(row.TotalPurQty),
            Mrp: parseFloat(row.MRP),
            CGSTPer: parseFloat(row.CGST),
            SGSTPer: parseFloat(row.SGST),
            IGSTPer: parseFloat(row.IGST),
            UGSTPer: parseFloat(row.UGST),
            SURCHARGPer: parseFloat(row.Surcharge),
            CESSPer: parseFloat(row.Cess),
          });

          // vouchSumm = {
          //   GrossAmount: voucherSummary
          //     ? parseFloat(voucherSummary.GrossAmount) -
          //       parseFloat(l_GrossAmount)
          //     : parseFloat(l_GrossAmount),
          //   Discount: voucherSummary
          //     ? voucherSummary.Discount - parseFloat(l_Discount)
          //     : parseFloat(l_Discount),
          //   TaxAmount: voucherSummary
          //     ? voucherSummary.TaxAmount - parseFloat(costTaxAmount)
          //     : parseFloat(costTaxAmount),
          //   AddIncomeAndExpenses: 0,
          //   RoundOff: 0,
          //   NetAmount: voucherSummary
          //     ? voucherSummary.NetAmount - parseFloat(itemTotalCost)
          //     : parseFloat(itemTotalCost),
          // };
        });

        // setVoucherSummary(vouchSumm);
        setItemTableData(tempTableData);
      }

      if (data[2] && data[2].length > 0) {
        // console.log("step 4");
        setPrevIEData(data[2]);
        data[2].forEach((row, indx) => {
          tempIEData.push({
            key: indx,
            reason: row.Particular,
            amount: parseFloat(row.Amount),
            IEtype: row.IEType,
            IsDeleted: false,
          });
        });
        setAddIncomeExpense(tempIEData);
      }
      // console.log("step 5");
      CalcTotal(tempTableData, undefined, tempIEData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calcItemData = (data) => {
    let l_Qty =
      data && !_.includes(["", null, undefined], data.Qty)
        ? parseFloat(data.Qty)
        : 0;

    let lFreeQty =
      data && !_.includes(["", null, undefined], data.freeQty)
        ? parseFloat(data.freeQty)
        : 0;

    let l_Total_Qty = l_Qty + lFreeQty;
    // let l_Total_Qty = l_Qty;
    let l_Discount =
      data && !_.includes(["", null, undefined], data.discount)
        ? data.discount
        : 0;

    let l_Cost = data && data.Cost ? data.Cost : 0;
    l_Cost = l_Cost / 10;
    l_Cost = isNaN(l_Cost) ? 0 : l_Cost;
    let l_GrossAmount = parseFloat(l_Cost) * l_Qty;
    let costTaxAmount =
      ((l_GrossAmount - l_Discount) / 100) * parseFloat(data.TaxPer);

    let l_LandingCost =
      (l_GrossAmount - l_Discount + costTaxAmount) /
      (parseFloat(l_Total_Qty) === 0 ? 1 : parseFloat(l_Total_Qty));
    console.log(
      data.freeQty && !_.includes(["", null, undefined], data.freeQty)
        ? data.freeQty
        : 0
    );
    setItemData({
      ...data,
      itemBarcode: data.itemBarcode,
      BatchNo: null,
      ExpiryDate: null,
      InwardSeq: null,
      Qty: data && !_.includes(["", null, undefined], data.Qty) ? data.Qty : 0,
      freeQty:
        data && !_.includes(["", null, undefined], data.freeQty)
          ? data.freeQty
          : 0,
      TaxAmount: costTaxAmount.toFixed(2),
      LandingCost: l_LandingCost ? parseFloat(l_LandingCost).toFixed(2) : 0,
      totalQty: parseFloat(l_Total_Qty),
      grossTotal:
        l_GrossAmount && !_.includes(["", null, undefined, NaN], l_GrossAmount)
          ? l_GrossAmount.toFixed(2)
          : 0,
      UnitCode: data.UnitCode,
      discount: l_Discount,
      ItemTotalCost: l_GrossAmount - l_Discount + costTaxAmount,
      Mrp: l_LandingCost ? l_LandingCost : 0,
      SalePrice: l_LandingCost ? l_LandingCost : 0,
    });
  };

  const validateItemCode = async (ItemCode, barcode) => {
    await invValidateItemCodeInTransaction(CompCode, ItemCode).then(
      (valData) => {
        if (valData.length > 0) {
          calcItemData({
            ...valData[0],
            Cost: null,
            itemBarcode: barcode ? barcode : null,
          });
          QtyRef.current.focus();
        } else {
          setItemData({ ...itemData, itemBarcode: null });
          notification.error({
            message: "Incorrect Code",
            description: `No such item exist`,
          });
        }
      }
    );
  };

  const onGetItemCode = (data, event) => {
    getItemCodeFromBarcode(CompCode, data).then(async (ires) => {
      if (ires.length > 0) {
        validateItemCode(ires[0].ItemCode, data);
      } else {
        setItemData({ ...itemData, itemBarcode: data });
        notification.error({
          message: "Incorrect Barcode",
          description: `No such item exist with barcode: ${data}`,
        });
      }
    });
  };

  const columns = [
    {
      title: "Item Barcode",
      dataIndex: "itemBarcode",
      width: 100,
      ellipsis: true,
    },
    { title: "Item Code", dataIndex: "ItemCode", width: 80 },
    { title: "Item Name", dataIndex: "ItemName" },
    {
      title: `Cost Price`,
      dataIndex: "Cost",
      align: "right",
      width: 80,
      render: (text, record) => {
        const costPrice = (parseFloat(record.Cost) / 10).toFixed(2);
        return (
          <div style={{ fontWeight: "600" }}>
            {!isNaN(costPrice) ? costPrice : 0.0}
          </div>
        );
      },
    },
    {
      title: `Pur. Qty`,
      dataIndex: "Qty",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {parseFloat(record.Qty).toFixed(2)}
          </div>
        );
      },
    },
    {
      title: `Stock Qty`,
      dataIndex: "totalQty",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {(
              parseFloat(record.Qty) +
              (record.freeQty ? parseFloat(record.freeQty) : 0)
            ).toFixed(2)}
          </div>
        );
      },
    },

    // {
    //   title: `L Cost`,
    //   dataIndex: "LandingCost",
    //   align: "right",
    //   width: 120,
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         {record.LandingCost
    //           ? _.round(record.LandingCost, 3).toFixed(2)
    //           : null}
    //       </div>
    //     );
    //   },
    // },

    {
      title: `Gross`,
      dataIndex: "GrossTotal",
      align: "right",
      width: 110,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {record.grossTotal
              ? _.round(record.grossTotal, 3).toFixed(2)
              : null}
          </div>
        );
      },
    },
    {
      title: `Discount`,
      dataIndex: "discount",
      align: "right",
      width: 90,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {record.discount ? _.round(record.discount, 3).toFixed(2) : null}
          </div>
        );
      },
    },

    {
      title: "Tax",
      dataIndex: "Tax",
      width: 100,
      ellipsis: true,
    },

    {
      title: `Amount`,
      dataIndex: "Amount",
      align: "right",
      width: 110,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {record.ItemTotalCost
              ? _.round(record.ItemTotalCost, 3).toFixed(2)
              : null}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "x",
      width: 60,
      align: "center",
      render: (text, record, idx) => {
        return (
          <>
            <a
              className={`edit-btn ${
                // hasRight(currTran.moduleRights, "EDIT") ||
                itemData.ItemCode !== null || record.IsAllowModification === "N"
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={
                // hasRight(currTran.moduleRights, "EDIT") ||
                itemData.ItemCode !== null || record.IsAllowModification === "N"
              }
              style={{ marginRight: 5 }}
              onClick={() => {
                const tdata = {
                  ...record,
                  rowIndex: idx,
                  id: record.Id,
                  IsDeleted: true,
                  itemBarcode: record.itemBarcode,
                  ItemCode: record.ItemCode,
                  ItemName: record.ItemName,
                  Qty: record.Qty,
                  // Mrp: record.LandingCost,
                  Cost: record.Cost,
                  SalePrice: record.SalePrice,
                  InwardSeq: record.InwardSeq,
                  UnitCode: record.UnitCode,
                  TaxAmount: record.TaxAmount,
                  LandingCost: parseFloat(record.LandingCost).toFixed(2),
                  discount: record.discount,
                  freeQty: record.freeQty,
                  TaxCode: record.TaxCode,
                  totalQty: record.totalQty,
                  TaxPer: record.TaxPer,
                  grossTotal: record.grossTotal,
                  Mrp: record.LandingCost,
                };
                setItemData(tdata);

                // let tempTableData = ItemTableData;
                // let findIndex = tempTableData.findIndex(
                //   (aa) => aa.key == record.key
                // );
                // tempTableData[findIndex].IsDeleted = true;
                setEditData({ itemData: tdata, table: ItemTableData });
                let tempTableData = [
                  ...ItemTableData.filter((aa) => aa.key !== record.key),
                ];
                setItemTableData([...tempTableData]);
                CalcTotal([...tempTableData]);
                // if (tempTableData.length >= 1) {
                //   let vouchSumm = {
                //     GrossAmount: voucherSummary
                //       ? parseFloat(voucherSummary.GrossAmount) -
                //         parseFloat(record.grossTotal)
                //       : parseFloat(record.grossTotal),
                //     Discount: voucherSummary
                //       ? voucherSummary.Discount - parseFloat(record.discount)
                //       : parseFloat(record.discount),
                //     TaxAmount: voucherSummary
                //       ? voucherSummary.TaxAmount - parseFloat(record.TaxAmount)
                //       : parseFloat(record.TaxAmount),
                //     AddIncomeAndExpenses: 0,
                //     RoundOff: 0,
                //     NetAmount: voucherSummary
                //       ? voucherSummary.NetAmount -
                //         parseFloat(record.ItemTotalCost)
                //       : parseFloat(record.ItemTotalCost),
                //   };
                //   setVoucherSummary(vouchSumm);
                // } else {
                //   setVoucherSummary();
                // }
              }}
            >
              <EditTwoTone />
            </a>
            <a
              className={`edit-btn ${
                record.IsAllowModification === "N" ? `disabled` : `edit-btn`
              }`}
              style={{ color: "red" }}
              disabled={record.IsAllowModification === "N"}
              onClick={() => {
                let tempTable = [
                  ...ItemTableData.filter((aa) => aa.key !== record.key),
                ];

                // if (tempTable.length >= 1) {
                //   let vouchSumm = {
                //     GrossAmount: voucherSummary
                //       ? parseFloat(voucherSummary.GrossAmount) -
                //         parseFloat(record.grossTotal)
                //       : parseFloat(record.grossTotal),
                //     Discount: voucherSummary
                //       ? voucherSummary.Discount - parseFloat(record.discount)
                //       : parseFloat(record.discount),
                //     TaxAmount: voucherSummary
                //       ? voucherSummary.TaxAmount - parseFloat(record.TaxAmount)
                //       : parseFloat(record.TaxAmount),
                //     AddIncomeAndExpenses: 0,
                //     RoundOff: 0,
                //     NetAmount: voucherSummary
                //       ? voucherSummary.NetAmount -
                //         parseFloat(record.ItemTotalCost)
                //       : parseFloat(record.ItemTotalCost),
                //   };

                //   setVoucherSummary(vouchSumm);
                // } else {
                //   setVoucherSummary();
                // }
                setItemTableData([...tempTable]);
                CalcTotal([...tempTable]);
                // handleDelete(record);
              }}
            >
              <DeleteTwoTone twoToneColor="#ff1919" />
            </a>
          </>
        );
      },
    },
  ];
  // console.log(ItemTableData);
  const onAddClick = async () => {
    let oldData = ItemTableData;

    // if (
    //   oldData.length > 0 &&
    //   oldData.filter((i) => i.ItemCode === itemData.ItemCode).length > 0
    // ) {
    //   message.error(
    //     `Item for this item code ${itemData.ItemCode} has already exist`
    //   );
    // } else {
    if (
      itemData.Mrp ||
      itemData.SalePrice ||
      itemData.Cost ||
      itemData.Qty ||
      itemData.totalQty
    ) {
      setItemTableData([
        ...oldData,
        // ...oldData.filter(xx => xx.rowIndex !== itemData.rowIndex),
        {
          ...itemData,
          Id: null,
          key: moment().format("x"),
          ItemCode: itemData.ItemCode,
          rowIndex: ItemTableData.length,
          ItemName: itemData.ItemName,
          InwardSeq: null,
          BatchNo: null,
          ExpiryDate: null,
          Qty: itemData.Qty,
          Mrp: itemData.Mrp,
          SalePrice: itemData.SalePrice,
          Tax: `${itemData.TaxAmount} (${parseFloat(itemData.TaxPer).toFixed(
            2
          )})`,
          IsDeleted: false,
        },
      ]);
      console.log("step 1");
      CalcTotal([
        ...oldData,
        {
          ...itemData,
          Id: null,
          key: moment().format("x"),
          ItemCode: itemData.ItemCode,
          rowIndex: ItemTableData.length,
          ItemName: itemData.ItemName,
          InwardSeq: null,
          BatchNo: null,
          ExpiryDate: null,
          Qty: itemData.Qty,
          Mrp: itemData.Mrp,
          SalePrice: itemData.SalePrice,
          Tax: `${itemData.TaxAmount} (${parseFloat(itemData.TaxPer).toFixed(
            2
          )})`,
          IsDeleted: false,
        },
      ]);

      // let vouchSumm = {
      //   GrossAmount: voucherSummary
      //     ? parseFloat(voucherSummary.GrossAmount) +
      //       parseFloat(itemData.grossTotal)
      //     : parseFloat(itemData.grossTotal),
      //   Discount: voucherSummary
      //     ? voucherSummary.Discount + parseFloat(itemData.discount)
      //     : parseFloat(itemData.discount),
      //   TaxAmount: voucherSummary
      //     ? voucherSummary.TaxAmount + parseFloat(itemData.TaxAmount)
      //     : parseFloat(itemData.TaxAmount),
      //   AddIncomeAndExpenses: 0,
      //   RoundOff: 0,
      //   NetAmount: voucherSummary
      //     ? voucherSummary.NetAmount + parseFloat(itemData.ItemTotalCost)
      //     : parseFloat(itemData.ItemTotalCost),
      // };

      // setVoucherSummary(vouchSumm);

      setItemDataDisabled({
        ...itemDataDisabled,
        ItemCode: false,
        UnitCode: false,
        itemBarcode: false,
      });

      if (itemBarcodeRef.current && lastCalledFrom === "Barcode") {
        itemBarcodeRef.current.focus();
      } else if (itemCodeRef.current) {
        itemCodeRef.current.focus();
      }
    } else {
      notification.error({
        message: "Empty Fields",
        description: "Required fields are empty",
      });
    }
    setItemData(initialItemDataValues);
    setEditData({
      itemData: initialItemDataValues,
      table: [],
    });
    // }
  };

  async function CalcTotal(pTableData, pDiscountInfo, pAddIncomeExpenses) {
    try {
      // console.log("step 6");
      let lv_TableData = pTableData
        ? pTableData.filter((aa) => aa.IsDeleted === false)
        : ItemTableData.filter((aa) => aa.IsDeleted === false);

      let lv_AddIncomeExpenses = pAddIncomeExpenses
        ? pAddIncomeExpenses
        : addIncomeExpense;

      let i = 0;
      for (i; i < lv_TableData.length; i++) {
        let ll_TaxableAmount = 0;

        ll_TaxableAmount =
          parseFloat(lv_TableData[i].grossTotal) -
          parseFloat(lv_TableData[i].discount);

        lv_TableData[i].CGSTAmount = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].CGSTPer)) / 100
        );
        lv_TableData[i].SGSTAmount = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].SGSTPer)) / 100
        );
        lv_TableData[i].IGSTAmount = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].IGSTPer)) / 100
        );
        lv_TableData[i].UTGSTAmount = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].UTSTPer)) / 100
        );
        lv_TableData[i].SurchargeAmount = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].SURCHARGPer)) / 100
        );
        lv_TableData[i].CessAmount = parseFloat(
          (ll_TaxableAmount * parseFloat(lv_TableData[i].CESSPer)) / 100
        );
      }
      // // console.log([...lv_TableData], "ss");
      // console.log("step 7");
      setItemTableData([...lv_TableData]);
      //Calc Summary
      let l_GrossAmount = 0;
      let l_Discount = 0;
      let l_TaxAmount = 0;
      let l_AddIncomeAndExpenses = 0;
      let l_NetAmountBeforeRoundOff = 0;
      let l_RoundOff = 0;

      lv_TableData.forEach((row) => {
        l_GrossAmount += parseFloat(row.grossTotal);
        l_Discount += parseFloat(row.discount);
        l_TaxAmount += parseFloat(row.TaxAmount);
      });
      if (lv_AddIncomeExpenses.length > 0) {
        // console.log(lv_AddIncomeExpenses);
        lv_AddIncomeExpenses.map((ie) => {
          if (ie.IEtype === "I") {
            l_AddIncomeAndExpenses += parseFloat(ie.amount);
          } else {
            l_AddIncomeAndExpenses -= parseFloat(ie.amount);
          }
        });
      }
      console.log(
        l_GrossAmount,
        l_Discount,
        l_TaxAmount,
        l_AddIncomeAndExpenses,
        "s"
      );

      l_NetAmountBeforeRoundOff =
        l_GrossAmount - l_Discount + l_TaxAmount + l_AddIncomeAndExpenses;

      RoundConfiguredValue(
        roundOffConfigs,
        "PUR",
        l_NetAmountBeforeRoundOff
      ).then((rndConf) => {
        setVoucherSummary({
          GrossAmount: _.round(l_GrossAmount, 3),
          Discount: _.round(l_Discount, 0),
          TaxAmount: l_TaxAmount,
          AddIncomeAndExpenses: l_AddIncomeAndExpenses,
          RoundOff: rndConf,
          NetAmount: l_NetAmountBeforeRoundOff + rndConf,
        });
      });
    } catch (error) {}
  }

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
        {/* <LoadingOutlined spin style={{ fontSize: 85, color: "blue" }} /> */}
        <AppLoader />
      </div>
      <Row style={{ height: "100%", display: IsLoading ? "none" : "flex" }}>
        <Col span={14} style={{ height: 172 }}>
          <div
            className="card-sales"
            style={{ paddingRight: 0, paddingBottom: 2 }}
          >
            <div style={{}}>
              <div style={{ flex: 1, display: "flex" }}>
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
                            value={searchData.voucherNo}
                            disabled
                            placeholder="Auto Generated"
                            style={{ width: "100%" }}
                            size="small"
                            onChange={(e) => {
                              let oldD = { ...searchData };
                              setSearchData({
                                ...oldD,
                                voucherNo: e.target.value,
                              });
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
                            // className="sales-item-input-date"
                            format={l_ConfigDateFormat}
                            value={moment(searchData.voucherDate)}
                            placeholder="Voucher Date"
                            // className="sales-item-input-date"
                            style={{ width: "100%" }}
                            size="small"
                            disabledDate={(current) => {
                              return (
                                current > moment().endOf("day") ||
                                (l_ConfigPrevDates.value1 === "N" &&
                                  current < moment().endOf("day"))
                              );
                            }}
                          />
                        </div>
                        {/* Commented by atul */}
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

                  {/* Commented by atul 2020-02-06 */}
                  {/* <Col
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
                      Delivery Challan
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
                      style={{ width: "40%" }}
                      className="border-right-style"
                    >
                      <Input
                        onChange={(e) => {
                          setSearchData({
                            ...searchData,
                            deliveryChallanNo: e.target.value,
                          });
                        }}
                        defaultValue={searchData.deliveryChallanNo}
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
                    <div style={{ width: "60%" }}>
                      <DatePicker
                        size="small"
                        onChange={(e) => {
                          setSearchData((oldD) => {
                            return { ...oldD, deliveryChallanDate: e };
                          });
                        }}
                        format={l_ConfigDateFormat}
                        defaultValue={searchData.deliveryChallanDate}
                        placeholder="Challan Date"
                        className="sales-item-input-date"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </Col>
                </Row>
              </Col> */}
                </div>
                <div style={{ width: "50%", display: "inline-block" }}>
                  {false && (
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
                                      // value="ANDHERI"
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
                  )}
                  <Col xs={24} lg={24} xl={24} style={{ paddingBottom: 3 }}>
                    <Row className="purchase-search-input-container">
                      <Col xs={24} lg={24} style={{ alignSelf: "center" }}>
                        <div
                          style={{ alignSelf: "center", paddingLeft: 5 }}
                          className="sales-item-input-label purchase-search-label"
                        >
                          Bill No / Bill Date
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
                                billNo: e.target.value,
                              });
                            }}
                            value={searchData.billNo}
                            // allowClear
                            placeholder="Bill No."
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
                            onChange={(e) => {
                              setSearchData((oldD) => {
                                return { ...oldD, billDate: e };
                              });
                            }}
                            // className="sales-item-input-date"
                            format={l_ConfigDateFormat}
                            value={searchData.billDate}
                            placeholder="Bill Date"
                            // className="sales-item-input-date"
                            style={{ width: "100%", height: "100%" }}
                            size="small"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  {/* <Col
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
                          // padding: "0px 5px",
                          //   width: "calc(100% - 24px)"
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
                          // padding: "0px 5px",
                          //   width: "calc(100% - 24px)"
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
                          // padding: "0px 5px",
                          //   width: "calc(100% - 24px)"
                          width: "100%",
                          flex: 1,
                          alignSelf: "center",
                        }}
                        size="small"
                      />
                    </div>
                  </Col>
                </Row>
              </Col> */}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ width: "100%" }}>
                  {/* Added By atul 2020-15-02 */}
                  <Col
                    xs={24}
                    lg={24}
                    xl={24}
                    style={{ paddingBottom: 3, marginRight: 0 }}
                  >
                    <Row className="purchase-search-input-container">
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
                          Supplier
                        </div>
                      </Col>
                      <Col xs={24} lg={24} xl={24} style={{ display: "flex" }}>
                        <div
                          style={{
                            width: "calc(100% - 60px)",
                            display: "flex",
                          }}
                          className="purchase-search-input"
                        >
                          <a
                            onClick={() => {
                              setShowModal("SEARCH_SUPPLIER");
                            }}
                            style={{
                              padding: "0px 5px",

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
                              // // console.log("supp", newAtt);
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
                              (searchData.supplierId &&
                                searchData.supplierId !== null) ||
                              !hasRightToBeUsedNext(
                                suppMasterRights.Rights,
                                "ADD"
                              )
                            }
                            onClick={() => setShowModal("ADD_SUPPLIER")}
                            icon={<PlusOutlined />}
                          />
                          <Button
                            type="primary"
                            shape="circle"
                            disabled={
                              !searchData.supplierId ||
                              searchData.supplierId === null ||
                              !hasRightToBeUsedNext(
                                suppMasterRights.Rights,
                                "EDIT"
                              )
                            }
                            size="small"
                            onClick={() => setShowModal("EDIT_SUPPLIER")}
                            style={{}}
                            icon={<EditOutlined />}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ width: "100%" }}>
                  {/* Added By atul 2020-06-02 */}
                  <Col
                    xs={24}
                    lg={24}
                    xl={24}
                    style={{ paddingBottom: 3, marginRight: 0 }}
                  >
                    <Row className="purchase-search-input-container">
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
                          Remark
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
                          style={{ width: "100%" }}
                          className="border-right-style"
                        >
                          <Input
                            onChange={(e) => {
                              setSearchData({
                                ...searchData,
                                sysoption1: e.target.value,
                              });
                            }}
                            value={searchData.sysoption1}
                            allowClear
                            placeholder="Remark"
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
            </div>
          </div>
        </Col>
        <Col span={10} style={{ height: 172 }}>
          <div className="card-sales" style={{ padding: 0, height: "98%" }}>
            <PurchaseSummaryComponent
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
        <Col className="card-sales" style={{ minWidth: "100%", height: 108 }}>
          <Row>
            <Col span={24}>
              <Row>
                <Col
                  span={6}
                  style={{}}
                  className="sales-item-input-outer m-b-5"
                >
                  <Row className="sales-item-input-inner">
                    <Col
                      span={24}
                      className="sales-item-input-label"
                      style={{ alignSelf: "center", paddingRight: 8 }}
                    >
                      Scan Barcode
                    </Col>
                    <Col span={24} style={{ display: "flex" }}>
                      <Input
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
                        placeholder="Barcode"
                        size="small"
                        disabled={itemDataDisabled.itemBarcode}
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
                            event.preventDefault();
                            onGetItemCode(event.target.value, event);
                            setLastCalledFrom("Barcode");
                          }
                        }}
                        ref={itemBarcodeRef}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={12} className="sales-item-input-outer m-b-5">
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
                      <span style={{ color: "red" }}>* </span> Product (SKU)
                    </Col>
                    <Col span={24} style={{ display: "flex", paddingRight: 5 }}>
                      {/* <Input
                        style={{ width: 200 }}
                        placeholder="Code"
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
                            </Tooltip>
                          </a>
                        }
                        size="small"
                        disabled={itemDataDisabled.ItemCode}
                        ref={itemCodeRef}
                        onChange={(event) => {
                          let oldD = { ...itemData };
                          setItemData({
                            ...oldD,
                            ItemCode: event.target.value,
                          });
                        }}
                        value={itemData.ItemCode}
                        onKeyDown={async (event) => {
                          if (
                            event.keyCode === 13 ||
                            (!event.shiftKey && event.keyCode === 9)
                          ) {
                            event.preventDefault();
                            let tempData = itemMasterData.find(
                              (aa) => aa.ItemCode === event.target.value
                            );
                            if (tempData) {
                              QtyRef.current.focus();
                              let oldD = { ...itemData };
                              validateItemCode(tempData.ItemCode);
                              setLastCalledFrom("Item_Code");
                            } else {
                              notification.error({
                                message: "Item Code Does not Exist",
                                description: "this item code does not exist",
                              });
                            }
                          }
                        }}
                      /> */}
                      <Input
                        disabled={itemDataDisabled.ItemName}
                        style={{
                          maxHeight: 24,
                          fontWeight: 500,
                          color: "#000000",
                        }}
                        placeholder="Item Name"
                        size="small"
                        value={itemData.ItemName}
                      />
                    </Col>
                  </Row>
                </Col>
                {/* </Row>
        <Row> */}
                <Col
                  span={3}
                  style={{
                    paddingRight: 5,
                  }}
                  className="sales-item-input-outer m-b-5"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        // textAlign: "end",
                        width: "100%",
                      }}
                    >
                      Unit
                    </div>
                    <Select
                      disabled={itemDataDisabled.UnitCode}
                      value={itemData.UnitCode}
                      placeholder="Unit"
                      style={{ width: "100%" }}
                      size="small"
                      disabled={true}
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, UnitCode: e });
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
                  span={3}
                  style={{
                    paddingRight: 5,
                  }}
                  className="sales-item-input-outer m-b-5"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        // textAlign: "end",
                        width: "100%",
                      }}
                    >
                      Tax
                    </div>
                    <Select
                      className="purchase-select"
                      disabled={itemDataDisabled.TaxCode}
                      value={itemData.TaxCode}
                      placeholder="Tax"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, TaxCode: e });
                        if (
                          !_.includes(
                            [null, "", undefined],
                            itemData.ItemCode
                          ) ||
                          !_.includes([null, "", undefined], itemData.ItemName)
                        ) {
                          let selectedTaxCode =
                            e && !_.includes(["", null, undefined], e)
                              ? e
                              : null;

                          let tempTax = taxMaster.find(
                            (tt) => tt.TaxCode === selectedTaxCode
                          );
                          // // console.log(tempTax);
                          // // console.log({ ...oldD, TaxCode: e }, "sending data");
                          if (tempTax) {
                            calcItemData({
                              ...oldD,
                              TaxCode: e,
                              TaxPer: tempTax.TaxPer,
                            });
                          }
                        }
                      }}
                    >
                      {taxMaster &&
                        taxMaster.map((tx) => (
                          <Option value={tx.TaxCode} key={tx.TaxCode}>
                            {tx.TaxName}
                          </Option>
                        ))}
                    </Select>
                  </Row>
                </Col>
                {/* {props.showBatch === "Y" ? (
                  <>
                    <Col
                      className="sales-item-input-outer m-b-5"
                      span={2}
                      style={{
                        paddingRight: 5,
                      }}
                    >
                      <Row className="sales-item-input-inner">
                        <div
                          className="sales-item-input-label"
                          style={{
                            // alignSelf: "center",
                            paddingRight: 5,
                            textAlign: "end",
                            width: "100%",
                          }}
                        >
                          Batch No
                        </div>
                        <Input
                          // className="bill-input"
                          placeholder="Batch No"
                          style={{ width: "100%" }}
                          size="small"
                          onChange={(e) => {
                            let oldD = { ...itemData };
                            setItemData({ ...oldD, BatchNo: e.target.value });
                          }}
                          value={itemData.BatchNo}
                          disabled={itemDataDisabled.BatchNo}
                        />
                      </Row>
                    </Col>
                    <Col
                      className="sales-item-input-outer m-b-5"
                      span={3}
                      style={{
                        paddingRight: 5,
                      }}
                    >
                      <Row className="sales-item-input-inner">
                        <div
                          className="sales-item-input-label"
                          style={{
                            // alignSelf: "center",
                            paddingRight: 5,
                            textAlign: "end",
                            width: "100%",
                          }}
                        >
                          Expiry Date
                        </div>
                        <DatePicker
                          size="small"
                          onChange={(e) => {
                            setItemData((oldD) => {
                              return { ...oldD, ExpiryDate: e };
                            });
                          }}
                          format={l_ConfigDateFormat}
                          defaultValue={itemData.ExpiryDate}
                          disabled={itemDataDisabled.ExpiryDate}
                          placeholder="Expiry Date"
                          className="sales-item-input-date"
                          style={{ width: "100%" }}
                        />
                      </Row>
                    </Col>
                  </>
                ) : (
                  <Col
                    className="sales-item-input-outer m-b-5"
                    span={5}
                    style={{
                      paddingRight: 5,
                    }}
                  >
                    <Row className="sales-item-input-inner">
                      <div
                        className="sales-item-input-label"
                        style={{
                          // alignSelf: "center",
                          paddingRight: 5,
                          textAlign: "end",
                          width: "100%",
                        }}
                      >
                        Sub Category
                      </div>
                      <Input
                        // className="bill-input"
                        placeholder="Sub Category"
                        style={{ width: "100%" }}
                        size="small"
                        onChange={(e) => {
                          let oldD = { ...itemData };
                          setItemData({ ...oldD, SubCatDesc: e.target.value });
                        }}
                        value={itemData.SubCatDesc}
                        disabled={itemDataDisabled.SubCatDesc}
                      />
                    </Row>
                  </Col>
                )} */}

                <Col
                  className="sales-item-input-outer m-b-5"
                  span={3}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span> Pur Qty.
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="Pur Qty."
                      style={{ width: "100%", textAlign: "right" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };

                        if (
                          !_.includes(
                            [null, "", undefined],
                            itemData.ItemCode
                          ) ||
                          !_.includes([null, "", undefined], itemData.ItemName)
                        ) {
                          setItemData({ ...oldD, Qty: e.target.value });
                          calcItemData({ ...oldD, Qty: e.target.value });
                        }
                      }}
                      ref={QtyRef}
                      onKeyDown={async (event) => {
                        if (event.keyCode === 13) {
                          event.preventDefault();
                          ItemAddRef.current.click();
                        }
                      }}
                      value={itemData.Qty}
                      disabled={itemDataDisabled.Qty}
                    />
                  </Row>
                </Col>
                <Col
                  className="sales-item-input-outer m-b-5"
                  span={3}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span> Stock Qty.
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="Stock Qty."
                      style={{ width: "100%", textAlign: "right" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({
                          ...oldD,
                          totalQty: e.target.value,
                          freeQty: e.target.value - parseFloat(oldD.Qty),
                        });
                        if (
                          !_.includes(
                            [null, "", undefined],
                            itemData.ItemCode
                          ) ||
                          !_.includes([null, "", undefined], itemData.ItemName)
                        ) {
                          calcItemData({
                            ...oldD,
                            freeQty: e.target.value - parseFloat(oldD.Qty),
                          });
                        }
                      }}
                      onKeyDown={async (event) => {
                        if (event.keyCode === 13) {
                          event.preventDefault();
                          ItemAddRef.current.click();
                        }
                      }}
                      value={itemData.totalQty}
                      // disabled={itemDataDisabled.totalQty}
                    />
                  </Row>
                </Col>
                {/* <Col
                  span={5}
                  style={{
                    paddingRight: 5,
                  }}
                  className="sales-item-input-outer m-b-5"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,

                        width: "100%",
                      }}
                    >
                      Quantity
                    </div>
                    <div style={{ display: "flex" }}>
                      <InputNumber
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            ItemAddRef.current.focus();
                          }
                        }}
                        
                        ref={QtyRef}
                        className="bill-input"
                        placeholder="Quantity"
                        style={{ width: "24%" }}
                        size="small"
                        onChange={(e) => {
                          let oldD = { ...itemData };
                          setItemData({ ...oldD, Qty: e });
                          if (
                            !_.includes(
                              [null, "", undefined],
                              itemData.ItemCode
                            ) ||
                            !_.includes(
                              [null, "", undefined],
                              itemData.ItemName
                            )
                          ) {
                            // // console.log({ ...oldD, Qty: e }, "sending data");
                            calcItemData({ ...oldD, Qty: e });
                          }
                        }}
                        min={1}
                        value={itemData.Qty}
                        onKeyDown={async (event) => {
                          if (event.keyCode === 13) {
                            event.preventDefault();
                            ItemAddRef.current.click();
                          }
                        }}
                        disabled={itemDataDisabled.Qty}
                      />
                      <InputNumber
                        className="bill-input"
                        placeholder="Free Quantity"
                        style={{ width: "38%" }}
                        size="small"
                        min={0}
                        onChange={(e) => {
                          let oldD = { ...itemData };
                          setItemData({ ...oldD, freeQty: e });
                          if (
                            !_.includes(
                              [null, "", undefined],
                              itemData.ItemCode
                            ) ||
                            !_.includes(
                              [null, "", undefined],
                              itemData.ItemName
                            )
                          ) {
                           
                            calcItemData({ ...oldD, freeQty: e });
                          }
                        }}
                        value={itemData.freeQty}
                        disabled={itemDataDisabled.freeQty}
                      />
                      <InputNumber
                        className="bill-input"
                        placeholder="Total Quantity"
                        style={{ width: "38%" }}
                        size="small"
                        min={1}
                        onChange={(e) => {
                          let oldD = { ...itemData };
                          setItemData({ ...oldD, totalQty: e });
                        }}
                        value={itemData.totalQty}
                        disabled={itemDataDisabled.totalQty}
                      />
                    </div>
                  </Row>
                </Col> */}
                <Col
                  className="sales-item-input-outer m-b-5"
                  span={3}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>Cost Price
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="Cost Price"
                      style={{ width: "100%", textAlign: "right" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, Cost: e.target.value });
                        if (
                          !_.includes(
                            [null, "", undefined],
                            itemData.ItemCode
                          ) ||
                          !_.includes([null, "", undefined], itemData.ItemName)
                        ) {
                          // // console.log({ ...oldD, Cost: e }, "sending data");
                          calcItemData({ ...oldD, Cost: e.target.value });
                        }
                      }}
                      value={itemData.Cost}
                      disabled={itemDataDisabled.Cost}
                    />
                  </Row>
                </Col>
                <Col
                  className="sales-item-input-outer"
                  span={3}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner m-b-5">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      Gross Total
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      style={{ width: "100%" }}
                      size="small"
                      placeholder="Gross total"
                      // onChange={(e) => {
                      //   let oldD = { ...itemData };
                      //   setItemData({ ...oldD, Mrp: e });
                      // }}
                      value={itemData.grossTotal ? itemData.grossTotal : null}
                      disabled={true}
                    />
                  </Row>
                </Col>
                <Col
                  className="sales-item-input-outer m-b-5 hidden"
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      Discount
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="Discount"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        if (itemData.grossTotal < parseFloat(e.target.value)) {
                          message.error(
                            "Discount Cannot be Less Than Gross Amount"
                          );
                          setItemData({ ...oldD, discount: null });
                        } else {
                          setItemData({ ...oldD, discount: e.target.value });
                          if (
                            !_.includes(
                              [null, "", undefined],
                              itemData.ItemCode
                            ) ||
                            !_.includes(
                              [null, "", undefined],
                              itemData.ItemName
                            )
                          ) {
                            calcItemData({
                              ...oldD,
                              discount: e.target.value,
                            });
                          }
                        }
                      }}
                      value={itemData.discount}
                      disabled={itemDataDisabled.discount}
                    />
                  </Row>
                </Col>
                <Col
                  className="sales-item-input-outer m-b-5 hidden"
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      Tax Amount
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="Tax Amount"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, TaxAmount: e.target.value });
                      }}
                      value={itemData.TaxAmount}
                      disabled={itemDataDisabled.TaxAmount}
                    />
                  </Row>
                </Col>
                <Col
                  className="sales-item-input-outer m-b-5 d-none"
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      L. Cost
                    </div>
                    <InputNumber
                      className="bill-input"
                      placeholder="Landing Cost"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, LandingCost: e });
                      }}
                      value={itemData.LandingCost}
                      disabled={itemDataDisabled.LandingCost}
                    />
                  </Row>
                </Col>
                {/* <Col
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                  className="sales-item-input-outer m-b-5"
                >
                  <Row className="sales-item-input-inner">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>Sale Price
                    </div>
                    <InputNumber
                      className="bill-input"
                      placeholder="Sale Price"
                      size="small"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, SalePrice: e });
                      }}
                      value={itemData.SalePrice}
                      disabled={itemDataDisabled.SalePrice}
                    />
                  </Row>
                </Col> */}
                {/* <Col
                  className="sales-item-input-outer"
                  span={2}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Row className="sales-item-input-inner m-b-5">
                    <div
                      className="sales-item-input-label"
                      style={{
                        // alignSelf: "center",
                        paddingRight: 5,
                        textAlign: "end",
                        width: "100%",
                      }}
                    >
                      <span style={{ color: "red" }}>* </span>MRP
                    </div>
                    <InputNumber
                      className="bill-input"
                      placeholder="MRP"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, Mrp: e });
                      }}
                      value={itemData.Mrp}
                      disabled={itemDataDisabled.Mrp}
                    />
                  </Row>
                </Col> */}
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    // alignSelf: "flex-end",
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      marginBottom: 5,
                      height: 45,
                      // padding: "0 12px",
                      fontSize: "16px",
                      fontWeight: "600",
                      flex: 1,
                      width: "49%",
                      marginRight: 5,
                    }}
                    // disabled={_.includes([null, ""], itemData.ItemName)}

                    ref={ItemAddRef}
                    icon={<PlusCircleOutlined style={{ fontSize: 25 }} />}
                    size="small"
                    onClick={async () => {
                      if (
                        _.includes([null, ""], itemData.Qty) ||
                        _.includes([null, ""], itemData.Mrp) ||
                        _.includes([null, ""], itemData.SalePrice) ||
                        _.includes([null, ""], itemData.Cost)
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
                      } else {
                        // itemCodeRef.current.focus();
                        onAddClick();
                      }
                    }}
                    disabled={
                      _.includes([null, "", undefined], itemData.ItemCode) ||
                      _.includes([null, "", undefined], itemData.ItemName)
                    }
                  />

                  <Button
                    ref={ItemResetRef}
                    type="primary"
                    style={{
                      height: 45,
                      // padding: "0 12px",
                      fontSize: "16px",
                      fontWeight: "600",
                      flex: 1,
                      width: "49%",
                    }}
                    disabled={itemData.ItemCode === null}
                    icon={<RetweetOutlined style={{ fontSize: 22 }} />}
                    size="small"
                    onClick={() => {
                      swal(
                        "Are you sure you want to revert the Modifications?",

                        {
                          buttons: ["No", "Yes!"],
                        }
                      ).then(async (val) => {
                        if (val) {
                          console.log("yes", editData);
                          setItemData(initialItemDataValues);
                          if (editData.itemData.ItemCode !== null) {
                            setItemTableData(editData.table);
                            setItemDataDisabled({
                              ...itemDataDisabled,
                              ItemCode: false,
                              UnitCode: false,
                              itemBarcode: false,
                            });
                            CalcTotal(editData.table);
                          }
                        } else {
                          setEditData(
                            editData.itemData.ItemCode !== null
                              ? editData
                              : {
                                  itemData: initialItemDataValues,
                                  table: [],
                                }
                          );

                          // console.log("no");
                        }
                      });
                    }}
                  ></Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          style={{
            minWidth: "100%",
            maxWidth: "100%",
            display: "flex",
            height: "calc(100vh - 386px)",
          }}
        >
          <div
            className="card-sales"
            style={{
              marginRight: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Table
              columns={columns.filter((cc) =>
                props.showBatch === "Y"
                  ? true
                  : !_.includes(["BatchNo", "ExpiryDate"], cc.dataIndex)
              )}
              loading={IsLoading}
              dataSource={ItemTableData.filter((aa) => aa.IsDeleted === false)}
              pagination={false}
              bordered={true}
              key={(data) => {
                return data.key;
              }}
              className="adjustmentTable"
              // scroll={{ y: "calc(100% - 30px)", x: "max-content" }}
              scroll={{ y: "auto" }}
            />
          </div>
        </Col>

        <Col span={24} style={{ height: 40 }}>
          <div className="card-sales">
            <Button
              icon={<PlusCircleOutlined />}
              style={{ marginRight: 5 }}
              disabled={
                _.includes([null, undefined, ""], searchData.supplierId) ||
                ItemTableData.filter((aa) => aa.IsDeleted === false).length <=
                  0 ||
                itemData.ItemCode !== null
              }
              type="primary"
              onClick={() => {
                setIsLoading(true);
                let tempHdr = {
                  CompCode: CompCode,
                  BranchCode: searchData.branch,
                  DeptCode: searchData.department,
                  TaxType: searchData.saleType,
                  SuppId: searchData.supplierId,
                  SuppName: searchData.supplierName,
                  PurchaseType: searchData.voucherType,
                  DeliveryChallanNo: searchData.deliveryChallanNo,
                  DeliveryChallanDate: searchData.deliveryChallanDate,
                  PurchaseBillNo: searchData.billNo,
                  PurchaseBillDate: searchData.billDate,
                  EWayBillNo: searchData.eWaybillNo,
                  VehicleNo: searchData.vehicleNo,
                  CreditDays: searchData.creditDays,
                  POId: null,
                  PONo: null,
                  PODate: null,
                  SysOption1: searchData.sysoption1,
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
                  VoucherId: props.VoucherId,
                  VoucherNo: searchData.voucherNo,
                  VoucherDate: searchData.voucherDate,
                };
                let tempDtl = [];
                ItemTableData.filter((xx) => xx.IsDeleted === false).forEach(
                  (row, i) => {
                    // console.log(row, "bed");
                    tempDtl.push({
                      Id: row.Id,
                      SrNo: i + 1,
                      ItemCode: row.ItemCode,
                      ScannedBarcode: row.itemBarcode,
                      InwardSeq: row.InwardSeq,
                      BatchNo: row.BatchNo,
                      ExpiryDate: row.ExpiryDate,
                      Qty: row.Qty,
                      FreeQty: row.freeQty,
                      TotalPurQty:
                        parseFloat(row.Qty) + parseFloat(row.freeQty),
                      CostPrice: parseFloat(row.Cost)
                        ? parseFloat(row.Cost) / 10
                        : 0,
                      SalePrice: row.SalePrice,
                      MRP: row.Mrp,
                      DiscPer: null,
                      DiscAmount: row.discount,
                      TaxCode: row.TaxCode,
                      TaxPerc: row.TaxPer,
                      TaxAmount: row.TaxAmount,
                      ItemTotalCost: parseFloat(row.Cost)
                        ? parseFloat(row.Cost) / 10
                        : 0,
                      CostPrice: parseFloat(row.Cost)
                        ? parseFloat(row.Cost) / 10
                        : 0,
                      Amount: row.ItemTotalCost,
                      SysOption1: null,
                      SysOption2: null,
                      SysOption3: null,
                      SysOption4: null,
                      SysOption5: null,
                      CGST: row.CGSTPer,
                      SGST: row.SGSTPer,
                      IGST: row.IGSTPer,
                      UGST: row.UGSTPer,
                      Surcharge: row.SURCHARGPer,
                      Cess: row.CESSPer,
                      UpdtUsr: l_loginUser,
                    });
                  }
                );
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

                let data = {
                  PurchaseInvoiceHdr: tempHdr,
                  PurchaseInvoiceDtl: tempDtl,
                  PurchaseInvoicePrevDtl: prevData,
                  AddIncomeExpensesDtl,
                  AddIncomeExpensesPrevDtl: prevIEData,
                };
                // console.log(data);
                // return;
                setTimeout(() => {
                  if (!props.VoucherId) {
                    invSavePurchaseInvoice(CompCode, data)
                      .then((res) => {
                        notification.success({
                          message: "Data Saved Successfully",
                          description: "data Saved Successfully",
                        });

                        setIsLoading(false);
                        setItemData(initialItemDataValues);
                        setItemTableData([]);
                        setVoucherSummary();
                        props.onBackPress();
                        setSearchData(initialSearchData);
                      })
                      .catch((err) => {
                        setIsLoading(false);
                        notification.error({
                          message: "Error Saving Data",
                          description: err,
                        });
                      });
                  } else {
                    // // console.log("before save", data);
                    invSaveUpdatePurchaseInvoice(CompCode, data)
                      .then((res) => {
                        notification.success({
                          message: "Data Saved Successfully",
                          description: "data Saved Successfully",
                        });
                        setIsLoading(false);
                        setItemData(initialItemDataValues);
                        setItemTableData([]);
                        setVoucherSummary();
                        props.onBackPress();
                        setSearchData(initialSearchData);
                      })
                      .catch((err) => {
                        setIsLoading(false);
                        notification.error({
                          message: "Error Saving Data",
                          description: err,
                        });
                      });
                  }
                }, 200);
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
        visible={showModal === "SEARCH_ITEM"}
        // title={"Product (SKU) Help"}
        footer={false}
        bodyStyle={{ padding: "10px 10px" }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal();
        }}
        width={"90%"}
      >
        <SelectableItem
          selectType="radio"
          data={itemMasterData}
          branch={searchData.branch}
          onItemSelect={(data) => {
            if (data) {
              // setItemData({ ...oldD, itemCode: data.ItemCode });
              setShowModal();
              onGetItemCode(data.ItemCode);
              // validateItemCode(data.ItemCode);
              // validateItemCode(data.ItemCode, "Item_Code");
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
        visible={showModal === "SEARCH_SUPPLIER"}
        // title={"Customer"}
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
              // // console.log(data, "on select");
              setSearchData((oldD) => {
                return { ...oldD, supplierId: data.suppCode };
              });
              setShowModal();
            }
          }}
          onBackPress={() => {
            setShowModal();
          }}
        />
      </Modal>

      {/* <Modal
        visible={showModal === "STOCK_DISTINCT_PRICE"}
        // title={"Customer"}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        destroyOnClose={true}
        onCancel={() => {
          setItemData((old) => {
            return {
              ...old,
              ItemName: null,
              UnitCode: null,
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
          setStockDistinctPrice();
          itemCodeRef.current.focus();
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
                  SalePrice: data.SalePrice,
                  BalQty: data.BalQty,
                };
              });
              setItemDataDisabled((old) => {
                return { ...old, itemBarcode: true, ItemCode: true };
              });
              setShowModal();
              // // console.log(QtyRef);
              QtyRef.current.focus();
            }
          }}
          onBackPress={() => {
            setItemData((old) => {
              return {
                ...old,
                ItemName: null,
                UnitCode: null,
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
            setStockDistinctPrice();
            itemCodeRef.current.focus();
          }}
        />
      </Modal> */}

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
          // discount={discount}
          addIncomeExpense={addIncomeExpense}
          onBackPress={() => {
            setShowModal();
            // itemBarcodeRef.current.focus();
          }}
          onSaveClick={(data) => {
            // console.log(data.IncomeExpense);
            setAddIncomeExpense(data.IncomeExpense);
            CalcTotal(undefined, undefined, data.IncomeExpense);
          }}
        />
      </Modal>
    </div>
  );
};

export default NewPurchaseCard;
