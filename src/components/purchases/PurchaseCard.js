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
import React, { useState, useEffect, useRef } from "react";
import {
  PlusOutlined,
  EditOutlined,
  RetweetOutlined,
  ShoppingCartOutlined,
  PlusCircleOutlined,
  DeleteTwoTone,
  UserOutlined,
  PrinterOutlined,
  LoadingOutlined,
  EditTwoTone,
} from "@ant-design/icons";
import {
  hasRightToBeUsedNext,
  RoundConfiguredValue,
} from "../../shared/utility";
import { useHotkeys } from "react-hotkeys-hook";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymodeMaster } from "../../services/payModeMaster";
import { fetchBranchMasterData } from "../../services/branch-master";
import { fetchDeptMasterService } from "../../services/department-master";
import {
  invGetDataTranPurchase,
  invSavePurchaseInvoice,
  invSaveUpdatePurchaseInvoice,
} from "../../services/inventory";
import {
  getInvItemMasterData,
  getItemCodeFromBarcode,
  invValidateItemCodeInTransaction,
} from "../../services/opening-stock";
import SelectableItem from "../Inventory/Adjustment/SelectableItem";
import _ from "lodash";
import { InvGetTransactionTypes } from "../../services/inventory";
import { getUnitMaster } from "../../services/unit-master";
import StockDistinctPrice from "../sales/StockDistinctPrice";
import SupplierMasterComp from "../portal/backoffice/SupplierMaster/SupplierMasterComp";
import { fetchSupplierMasterComp } from "../../services/supplier-master-comp";
import { fetchStateMasters } from "../../store/actions/StateMaster";
import { fetchCountryMasters } from "../../store/actions/CountryMaster";
import { fetchCityMasters } from "../../store/actions/CityMaster";
import PurchaseSummaryComponent from "./PurchaseSummaryComponent";
import SearchSupplier from "./SearchSupplier";
import { getTaxMaster } from "../../services/taxMaster";
import DiscountAdditionalIncomeExpenseComp from "../sales/DiscountAdditionalIncomeExpenseComp";
import { fetchKeyboardHotKeyConfig } from "../../services/keyboard-hotkey-config";
import ViewHotKeysComponent from "../common/ViewHotKeysComponent";
import swal from "sweetalert";
const { Option } = Select;
const PurchaseCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
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
    deliveryChallanDate: null,
    deliveryChallanNo: null,
    billNo: null,
    billDate: null,
    creditDays: null,
    eWaybillNo: null,
    vehicleNo: null,
  };
  const [searchData, setSearchData] = useState(initialSearchData);
  const initialItemDataValues = {
    itemBarcode: null,
    ItemCode: null,
    ItemName: null,
    Qty: null,
    Mrp: null,
    SalePrice: null,
    BatchNo: null,
    ExpiryDate: null,
    InwardSeq: null,
    unit: null,
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
  const [itemData, setItemData] = useState(initialItemDataValues);
  const [itemDataDisabled, setItemDataDisabled] = useState({
    itemBarcode: false,
    ItemCode: false,
    ItemName: true,
    Qty: false,
    unit: true,
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

  const initialSummaryValues = {
    GrossAmount: 0,
    Discount: 0,
    TaxAmount: 0,
    AddIncomeAndExpenses: 0,
    RoundOff: 0,
    NetAmount: 0,
  };
  const [addIncomeExpense, setAddIncomeExpense] = useState([]);
  const [voucherSummary, setVoucherSummary] = useState();
  const [keyboardKey, setKeyboardKey] = useState([]);
  const itemCodeRef = useRef();
  const QtyRef = useRef();
  const ItemAddRef = useRef();
  const ItemResetRef = useRef();
  const itemBarcodeRef = useRef();
  const currTran = useSelector((state) => state.currentTran);
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const keyboardHotkeyConfig = useSelector((state) =>
    state.AppMain.keyboardHotKeyConfig.filter(
      (flt) => flt.CompName === "Purchase"
    )
  );
  const [IsLoading, setIsLoading] = useState(false);
  const [SummaryData, setSummaryData] = useState();
  //   const dateFormat = useSelector((state) =>
  //   state.AppMain.appconfigs.find((cur) => cur.configCode === "DTFORMAT")
  // );
  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const suppMasterRights = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 89)[0]
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
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const [BranchMaster, setBranchMaster] = useState();
  const [DeptMaster, setDeptMaster] = useState();
  const [TranType, setTranType] = useState();
  const [showModal, setShowModal] = useState();
  const [itemMasterData, setItemMasterData] = useState([]);
  const [ItemTableData, setItemTableData] = useState([]);
  const [unitMaster, setUnitMaster] = useState();
  const [paymentMode, setPaymentMode] = useState([]);
  const [stockDistinctPrice, setStockDistinctPrice] = useState();
  const [totalAmountPaid, setTotalAmountPaid] = useState(0);
  const [catchedItemData, setCatchedItemData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [taxMaster, setTaxMaster] = useState([]);
  const [editData, setEditData] = useState({
    itemData: initialItemDataValues,
    table: [],
  });
  const [prevData, setPrevData] = useState([]);
  const [prevIEData, setPrevIEData] = useState([]);
  const saveRef = useRef();
  const backRef = useRef();
  const supplierSelectref = useRef();
  const productSelect = useRef();

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "save")
      ? keyboardKey.find((key) => key.EventCode === "save").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      saveRef.current.click();
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "back")
      ? keyboardKey.find((key) => key.EventCode === "back").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      backRef.current.click();
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "select-supp")
      ? keyboardKey.find((key) => key.EventCode === "select-supp").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      console.log(supplierSelectref);
      supplierSelectref.current.focus();
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "item-search")
      ? keyboardKey.find((key) => key.EventCode === "item-search").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      productSelect.current.click();
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
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
        let tmp = [];
        await keyboardHotkeyConfig.forEach((row, index) => {
          tmp.push({ ...row, key: index, isDirty: false });
        });
        setKeyboardKey(tmp);
        await fetchBranchMasterData(CompCode).then((brnh) => {
          if (brnh.length > 0) {
            setBranchMaster(brnh.filter((ii) => ii.IsActive === true));
            branch = brnh.filter((ii) => ii.IsActive === true)[0].BranchCode;
          }
        });
        await fetchDeptMasterService(CompCode).then((dept) => {
          if (dept.length > 0) {
            depart = dept.filter((dd) => dd.IsActive.data[0] === 1)[0].DeptCode;
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
        }
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
        // console.log(res, "supplierData");
        setSupplierData(res.filter((aa) => aa.IsActive === true));
      });

      if (props.entryMode === "A") {
        setIsLoading(false);
      }
    }, 100);
  }, []);

  const onRefreshKeyConfig = (mode) => {
    fetchKeyboardHotKeyConfig(CompCode).then((res) => {
      // console.log(res, "config keyboad");
      if (res && res.length > 0) {
        let tmp = [];
        res
          .filter((flt) => flt.CompName === mode)
          .forEach((row, index) => {
            tmp.push({ ...row, key: index, isDirty: false });
          });
        setKeyboardKey(tmp);
      }
    });
  };

  const mappData = (data) => {
    let tempTableData = [];
    let tempIEData = [];

    try {
      if (data[0]) {
        data[0].map(async (item) => {
          await setSearchData({
            branch: item.BranchCode,
            department: item.DeptCode,
            voucherNo: item.VoucherNo,
            voucherDate:
              item.VoucherDate !== null ? moment(item.VoucherDate) : null,
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
            Cost: parseFloat(row.CostPrice),
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
            CGST: parseFloat(row.CGST),
            SGST: parseFloat(row.SGST),
            IGST: parseFloat(row.IGST),
            UGST: parseFloat(row.UGST),
            SURCHARG: parseFloat(row.Surcharge),
            CESS: parseFloat(row.Cess),
          });
        });

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
    // console.log(data, "sentd data");
    let l_Qty =
      data && !_.includes(["", null, undefined], data.Qty) ? data.Qty : 1;
    let lFreeQty =
      data && !_.includes(["", null, undefined, undefined], data.freeQty)
        ? data.freeQty
        : 0;
    let l_Total_Qty = l_Qty + lFreeQty;
    let l_Discount =
      data && !_.includes(["", null, undefined], data.discount)
        ? data.discount
        : 0;

    let l_Cost = data && data.Cost ? data.Cost : 0;
    let l_GrossAmount = parseFloat(l_Cost) * l_Qty;

    let costTaxAmount =
      ((l_GrossAmount - l_Discount) / 100) * parseFloat(data.TaxPer);

    let l_LandingCost =
      (l_GrossAmount - l_Discount + costTaxAmount) / parseFloat(l_Total_Qty);

    setItemData({
      ...data,
      itemBarcode: data.itemBarcode,
      BatchNo: null,
      ExpiryDate: null,
      InwardSeq: null,
      Qty: data && !_.includes(["", null, undefined], data.Qty) ? data.Qty : 1,
      freeQty:
        data && !_.includes(["", null, undefined], data.freeQty)
          ? data.freeQty
          : 0,
      TaxAmount: costTaxAmount.toFixed(2),
      LandingCost: l_LandingCost.toFixed(2),
      totalQty: l_Total_Qty,
      grossTotal:
        l_GrossAmount && !_.includes(["", null, undefined, NaN], l_GrossAmount)
          ? l_GrossAmount.toFixed(2)
          : null,
      unit: data.UnitCode,
      discount: l_Discount,
      ItemTotalCost: l_GrossAmount - l_Discount + costTaxAmount,
      Mrp: data.MRP,
    });
  };

  const validateItemCode = async (ItemCode, barcode) => {
    await invValidateItemCodeInTransaction(CompCode, ItemCode).then(
      (valData) => {
        if (valData.length > 0) {
          calcItemData({
            ...valData[0],
            itemBarcode: barcode ? barcode : null,
          });

          QtyRef.current.focus();
          QtyRef.current.select();
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

  const columns = [
    {
      title: "Sr.No.",
      dataIndex: "",
      width: 50,
      render(text, record, index) {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Item Barcode",
      dataIndex: "itemBarcode",
      width: 100,
      ellipsis: true,
    },
    { title: "Item Code", dataIndex: "ItemCode", width: 80 },
    { title: "Item Name", dataIndex: "ItemName" },

    // {
    //   title: "InwardSeq",
    //   dataIndex: "InwardSeq",
    //   width: 80,
    // },
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
      width: 70,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {parseFloat(record.Qty) + (record.freeQty ? record.freeQty : 0)}
          </div>
        );
      },
    },
    {
      title: `L Cost`,
      dataIndex: "LandingCost",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div>
            {record.LandingCost
              ? _.round(record.LandingCost, 3).toFixed(2)
              : null}
          </div>
        );
      },
    },
    {
      title: `Sale Rate`,
      dataIndex: "SalePrice",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {record.SalePrice ? _.round(record.SalePrice, 3).toFixed(2) : null}
          </div>
        );
      },
    },
    {
      title: `MRP`,
      dataIndex: "MRP",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div>{record.Mrp ? _.round(record.Mrp, 3).toFixed(2) : null}</div>
        );
      },
    },

    {
      title: `Gross`,
      dataIndex: "GrossTotal",
      align: "right",
      width: 80,
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
      width: 80,
      render: (text, record) => {
        // console.log(record);
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
                itemData.ItemCode !== null || record.IsAllowModification === "N"
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={
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
                setEditData({ itemData: tdata, table: ItemTableData });
                let tempTableData = [
                  ...ItemTableData.filter((aa) => aa.key !== record.key),
                ];
                setItemTableData([...tempTableData]);
                CalcTotal([...tempTableData]);
              }}
            >
              <EditTwoTone />
            </a>
            <a
              className={`edit-btn ${
                record.IsAllowModification === "N" ? `disabled` : `edit-btn`
              }`}
              disabled={record.IsAllowModification === "N"}
              onClick={() => {
                let tempTable = [
                  ...ItemTableData.filter((aa) => aa.key !== record.key),
                  // { ...record, IsDeleted: true },
                ];
                setItemTableData([...tempTable]);
                CalcTotal([...tempTable]);
              }}
            >
              <DeleteTwoTone />
            </a>
          </>
        );
      },
    },
  ];

  const onAddClick = async () => {
    // console.log(itemData);
    let oldData = ItemTableData;
    if (itemData.Mrp && itemData.SalePrice && itemData.Qty && itemData.Cost) {
      setItemTableData([
        ...oldData,
        {
          ...itemData,
          ItemCode: itemData.ItemCode,
          key: moment().format("YYYYMMDDHHmmss"),
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

      CalcTotal([
        ...oldData,
        {
          ...itemData,
          ItemCode: itemData.ItemCode,
          key: moment().format("YYYYMMDDHHmmss"),
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
      // }
      setItemDataDisabled({
        ...itemDataDisabled,
        ItemCode: false,
        unit: false,
        itemBarcode: false,
      });

      // if (lastCalledFrom === "Barcode") {
      itemBarcodeRef.current.focus();
      // } else {
      //   itemCodeRef.current.focus();
      // }
    } else {
      notification.error({
        message: "Empty Fields",
        description: "Required fields are empty",
      });
    }
    setItemData(initialItemDataValues);
  };

  async function CalcTotal(pTableData, pDiscountInfo, pAddIncomeExpenses) {
    try {
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
          lv_TableData[i].grossTotal - lv_TableData[i].discount;

        lv_TableData[i].CGSTAmount = parseFloat(
          lv_TableData[i].CGST
            ? lv_TableData[i].CGST
            : (ll_TaxableAmount * parseFloat(lv_TableData[i].CGSTPer)) / 100
        ).toFixed(2);
        lv_TableData[i].SGSTAmount = parseFloat(
          lv_TableData[i].SGST
            ? lv_TableData[i].SGST
            : (ll_TaxableAmount * parseFloat(lv_TableData[i].SGSTPer)) / 100
        ).toFixed(2);
        lv_TableData[i].IGSTAmount = parseFloat(
          lv_TableData[i].IGST
            ? lv_TableData[i].IGST
            : (ll_TaxableAmount * parseFloat(lv_TableData[i].IGSTPer)) / 100
        ).toFixed(2);
        lv_TableData[i].UTGSTAmount = parseFloat(
          lv_TableData[i].UGST
            ? lv_TableData[i].UGST
            : (ll_TaxableAmount * parseFloat(lv_TableData[i].UTSTPer)) / 100
        ).toFixed(2);
        lv_TableData[i].SurchargeAmount = parseFloat(
          lv_TableData[i].Surcharge
            ? lv_TableData[i].Surcharge
            : (ll_TaxableAmount * parseFloat(lv_TableData[i].SURCHARGPer)) / 100
        ).toFixed(2);
        lv_TableData[i].CessAmount = parseFloat(
          lv_TableData[i].Cess
            ? lv_TableData[i].Cess
            : (ll_TaxableAmount * parseFloat(lv_TableData[i].CESSPer)) / 100
        ).toFixed(2);
      }

      // console.log([...lv_TableData], "calc");
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

      // l_RoundOff = await RoundConfiguredValue(
      //   roundOffConfigs,
      //   "PUR",
      //   l_NetAmountBeforeRoundOff
      // );
      // console.log(l_RoundOff, "s");
      // setVoucherSummary({
      //   GrossAmount: _.round(l_GrossAmount, 3),
      //   Discount: _.round(l_Discount, 0),
      //   TaxAmount: l_TaxAmount,
      //   AddIncomeAndExpenses: l_AddIncomeAndExpenses,
      //   RoundOff: l_RoundOff,
      //   NetAmount: l_NetAmountBeforeRoundOff + l_RoundOff,
      // });
      // console.log(l_RoundOff)
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
        <LoadingOutlined spin style={{ fontSize: 85 }} />
      </div>
      <Row style={{ height: "100%", display: IsLoading ? "none" : "flex" }}>
        <Col span={14} style={{ height: 172 }}>
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
                      Voucher No / Voucher Date / Tax Type
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    lg={24}
                    style={{ display: "flex" }}
                    className="purchase-search-input"
                  >
                    <div
                      style={{ width: "30%" }}
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
                          setSearchData({ ...oldD, voucherNo: e.target.value });
                        }}
                      />
                    </div>
                    <div style={{ width: "35%" }}>
                      <DatePicker
                        onChange={(e) => {
                          setSearchData((oldD) => {
                            return { ...oldD, voucherDate: e };
                          });
                        }}
                        // className="sales-item-input-date"
                        format={l_ConfigDateFormat}
                        disabledDate={(current) => {
                          return (
                            current > moment().endOf("day") ||
                            (l_ConfigPrevDates.value1 === "N" &&
                              current < moment().endOf("day"))
                          );
                        }}
                        value={searchData.voucherDate}
                        placeholder="Voucher Date"
                        // className="sales-item-input-date"
                        style={{ width: "100%" }}
                        size="small"
                      />
                    </div>
                    <div style={{ width: "35%" }}>
                      <Select
                        onChange={(value) => {
                          setSearchData((oldD) => {
                            return { ...oldD, saleType: value };
                          });
                        }}
                        value={searchData.saleType}
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
                      Supplier
                    </div>
                  </Col>
                  <Col xs={24} lg={24} xl={24} style={{ display: "flex" }}>
                    <div
                      style={{ width: "calc(100% - 60px)", display: "flex" }}
                      className="purchase-search-input"
                    >
                      {/* <div> */}
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
                          // console.log("supp", newAtt);
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
                        ref={supplierSelectref}
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
                      {/* </div> */}
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
                          !hasRightToBeUsedNext(suppMasterRights.Rights, "ADD")
                        }
                        onClick={() => setShowModal("ADD_SUPPLIER")}
                        icon={<PlusOutlined />}
                      ></Button>
                      <Button
                        type="primary"
                        shape="circle"
                        disabled={
                          !searchData.supplierId ||
                          searchData.supplierId === null ||
                          !hasRightToBeUsedNext(suppMasterRights.Rights, "EDIT")
                        }
                        size="small"
                        onClick={() => setShowModal("EDIT_SUPPLIER")}
                        style={
                          {
                            // margin: "0 0px ",
                          }
                        }
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
                        value={searchData.deliveryChallanNo}
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
                        value={searchData.deliveryChallanDate}
                        placeholder="Challan Date"
                        className="sales-item-input-date"
                        style={{ width: "100%", height: "100%" }}
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
                              <Option value={brn.DeptCode} key={brn.DeptCode}>
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
                        className="sales-item-input-date"
                        format={l_ConfigDateFormat}
                        value={searchData.billDate}
                        placeholder="Bill Date"
                        className="sales-item-input-date"
                        style={{ width: "100%", height: "100%" }}
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
                        value={searchData.eWaybillNo}
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
                        value={searchData.vehicleNo}
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
                        // type="number"
                        onChange={(e) => {
                          setSearchData({
                            ...searchData,
                            creditDays: e,
                          });
                        }}
                        value={searchData.creditDays}
                        allowclear="true"
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
              </Col>
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
                voucherSummary ? voucherSummary.AddIncomeAndExpenses : "0.00"
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
                      Scan Barcode / Product (SKU)
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
                            // setLastCalledFrom("Barcode");
                          }
                        }}
                        ref={itemBarcodeRef}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={7} className="sales-item-input-outer m-b-5">
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
                        // onBlur={(event) => {
                        //   if (!_.includes([null, ""], event.target.value)) {
                        //     validateItemCode(event.target.value, "Item_Code");
                        //   }
                        // }}
                      /> */}
                      <Input
                        disabled={itemDataDisabled.ItemName}
                        style={{ maxHeight: 24 }}
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
                      disabled={itemDataDisabled.unit}
                      value={itemData.unit}
                      placeholder="Unit"
                      style={{ width: "100%" }}
                      size="small"
                      disabled={true}
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
                          // console.log(tempTax);
                          // console.log({ ...oldD, TaxCode: e }, "sending data");
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
                {props.showBatch === "Y" ? (
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
                          value={itemData.ExpiryDate}
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
                )}
                <Col
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
                        // textAlign: "end",
                        width: "100%",
                      }}
                    >
                      Quantity
                    </div>
                    <div style={{ display: "flex" }}>
                      <Input
                        type="number"
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            ItemAddRef.current.focus();
                          }
                        }}
                        // step={3}
                        ref={QtyRef}
                        className="bill-input"
                        placeholder="Quantity"
                        style={{
                          width: "33%",
                          display: "block",
                          textAlign: "right",
                        }}
                        size="small"
                        onChange={(e) => {
                          let oldD = { ...itemData };
                          setItemData({
                            ...oldD,
                            Qty: parseFloat(e.target.value),
                          });
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
                              Qty: parseFloat(e.target.value),
                            });
                          }
                        }}
                        min={1}
                        value={itemData.Qty}
                        onKeyDown={async (event) => {
                          if (event.keyCode === 13) {
                            event.preventDefault();
                            ItemAddRef.current.click();
                            // let tempData = itemMasterData.find(
                            //   (aa) => aa.ItemCode === event.target.value
                            // );
                            //   if (
                            //     !_.includes(
                            //       [null, "", undefined],
                            //       itemData.ItemCode
                            //     ) ||
                            //     !_.includes(
                            //       [null, "", undefined],
                            //       itemData.ItemName
                            //     )
                            //   ) {

                            //     calcItemData({ ...itemData });
                            //   } else {
                            //     notification.error({
                            //       message: "Item Code Does not Exist",
                            //       description: "this item code does not exist",
                            //     });
                            //   }
                            // }
                          }
                        }}
                        disabled={itemDataDisabled.Qty}
                      />
                      <Input
                        type="number"
                        className="bill-input"
                        placeholder="Free Quantity"
                        style={{ width: "33%" }}
                        size="small"
                        min={0}
                        onChange={(e) => {
                          let oldD = { ...itemData };

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
                            setItemData({
                              ...oldD,
                              freeQty: parseFloat(e.target.value),
                            });
                            calcItemData({
                              ...oldD,
                              freeQty: parseFloat(e.target.value),
                            });
                          }
                        }}
                        value={itemData.freeQty}
                        disabled={itemDataDisabled.freeQty}
                      />
                      <Input
                        type="number"
                        className="bill-input"
                        placeholder="Total Quantity"
                        style={{ width: "33%" }}
                        size="small"
                        min={1}
                        onChange={(e) => {
                          let oldD = { ...itemData };
                          setItemData({ ...oldD, totalQty: e.target.value });
                        }}
                        value={itemData.totalQty}
                        disabled={itemDataDisabled.totalQty}
                      />
                    </div>
                  </Row>
                </Col>
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
                      <span style={{ color: "red" }}>* </span>Cost Price
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="Cost Price"
                      style={{ width: "100%" }}
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
                      Gross Total
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      style={{ width: "100%" }}
                      size="small"
                      placeholder="Gross"
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
                        if (
                          parseFloat(itemData.grossTotal) <
                          parseFloat(e.target.value)
                        ) {
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
                      Landing Cost
                    </div>
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="Landing Cost"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, LandingCost: e.target.value });
                      }}
                      value={itemData.LandingCost}
                      disabled={itemDataDisabled.LandingCost}
                    />
                  </Row>
                </Col>
                <Col
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
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="Sale Price"
                      size="small"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, SalePrice: e.target.value });
                      }}
                      value={itemData.SalePrice}
                      disabled={itemDataDisabled.SalePrice}
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
                    <Input
                      type="number"
                      className="bill-input"
                      placeholder="MRP"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, Mrp: e.target.value });
                      }}
                      value={itemData.Mrp}
                      disabled={itemDataDisabled.Mrp}
                    />
                  </Row>
                </Col>
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
                    disabled={_.includes([null, ""], itemData.ItemName)}
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
                  ></Button>
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
                      // setItemData(initialItemDataValues);
                      // setItemDataDisabled({
                      //   ...itemDataDisabled,
                      //   ItemCode: false,
                      //   unit: false,
                      //   itemBarcode: false,
                      // });
                      swal(
                        "Are you sure you want to revert the Modifications?",
                        {
                          buttons: ["No", "Yes!"],
                        }
                      ).then(async (val) => {
                        if (val) {
                          // console.log("yes", editData);
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
            height: "calc(100vh - 420px)",
            // maxHeight: "calc(100vh - 440px)",
            // maxHeight: 300,
          }}
        >
          <div
            className="card-sales"
            style={{
              // minHeight: 300,
              // minHeight: 300,
              // flex: 1,
              marginRight: 0,
              width: "100%",
              // overflowY: "auto",
            }}
          >
            <Table
              columns={columns.filter((cc) =>
                props.showBatch === "Y"
                  ? true
                  : !_.includes(["BatchNo", "ExpiryDate"], cc.dataIndex)
              )}
              dataSource={ItemTableData.filter(
                (aa) => aa.IsDeleted === false
              ).sort((a, b) => {
                return a.key - b.key ? -1 : 1;
              })}
              pagination={false}
              bordered={true}
              key={(data) => {
                return data.key;
              }}
              className="adjustmentTable"
              scroll={{ y: "calc(100% - 30px)", x: "max-content" }}
              // size="small"
            />
          </div>
        </Col>
        <Col span={24} style={{ height: 40 }}>
          <div className="card-sales" style={{ margin: "0px 0px 5px 0px" }}>
            <Button
              icon={<PlusCircleOutlined />}
              style={{ marginRight: 5 }}
              disabled={
                _.includes([null, undefined, ""], searchData.supplierId) ||
                ItemTableData.filter((aa) => aa.IsDeleted === false).length <= 0
              }
              ref={saveRef}
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
                  MiscAmount: 0,
                  RoundOff: voucherSummary.RoundOff,
                  NetAmount: voucherSummary.NetAmount,
                  SettlementAmount: 0,
                  UpdtUsr: l_loginUser,
                  VoucherId: props.VoucherId,
                  VoucherNo: searchData.voucherNo,
                  VoucherDate: searchData.voucherDate,
                };
                let tempDtl = [];
                let AddIncomeExpensesDtl = [];
                ItemTableData.filter((aa) => aa.IsDeleted === false).forEach(
                  (row, i) => {
                    // console.log(row);
                    tempDtl.push({
                      SrNo: i + 1,
                      ItemCode: row.ItemCode,
                      ScannedBarcode: row.itemBarcode,
                      InwardSeq: row.InwardSeq,
                      BatchNo: row.BatchNo,
                      ExpiryDate: row.ExpiryDate,
                      Qty: row.Qty,
                      FreeQty: row.freeQty,
                      TotalPurQty: row.Qty + row.freeQty,
                      CostPrice: row.Cost,
                      SalePrice: row.SalePrice,
                      MRP: row.Mrp,
                      DiscPer: null,
                      DiscAmount: row.discount,
                      TaxCode: row.TaxCode,
                      TaxPerc: row.TaxPer,
                      TaxAmount: row.TaxAmount,
                      ItemTotalCost: row.LandingCost,
                      Amount: row.ItemTotalCost,
                      SysOption1: null,
                      SysOption2: null,
                      SysOption3: null,
                      SysOption4: null,
                      SysOption5: null,
                      CGST: row.CGSTAmount,
                      SGST: row.SGSTAmount,
                      IGST: row.IGSTAmount,
                      UTGST: row.UGSTAmount,
                      Surcharge: row.SurchargeAmount,
                      Cess: row.CessAmount,
                      UpdtUsr: l_loginUser,
                    });
                  }
                );

                addIncomeExpense.forEach((row, index) => {
                  // console.log(row);
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
                  AddIncomeExpensesDtl,
                  PurchaseInvoicePrevDtl: prevData,
                  AddIncomeExpensesPrevDtl: prevIEData,
                };
                // console.log(data);
                setTimeout(() => {
                  if (!props.VoucherId) {
                    invSavePurchaseInvoice(CompCode, data)
                      .then((res) => {
                        // console.log(data);
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
            {/* <Button
              icon={<PrinterOutlined />}
              style={{ marginRight: 5 }}
              type="primary"
            >
              Save &amp; Print
            </Button> */}
            <Button
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                props.onBackPress();
              }}
              type="primary"
              ref={backRef}
            >
              Back
            </Button>
          </div>
        </Col>{" "}
        {keyboardKey.length > 0 && (
          <Col span={24} style={{ margin: "8px 0px 0px 0px" }}>
            <ViewHotKeysComponent
              keyboardKey={keyboardKey}
              title={`Purchase Screen (Hotkey Config)`}
              RefreshKeyConfig={() => {
                onRefreshKeyConfig("Purchase");
              }}
            />
          </Col>
        )}
      </Row>
      <Modal
        visible={showModal === "SEARCH_ITEM"}
        // title={"Product (SKU) Help"}
        footer={false}
        bodyStyle={{ padding: "5px" }}
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
              // setItemData({ ...oldD, itemCode: data.ItemCode });
              setShowModal();
              validateItemCode(data.ItemCode);
              // validateItemCode(data.ItemCode, "Item_Code");
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
            setStockDistinctPrice();
            itemCodeRef.current.focus();
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
          // discount={discount}
          addIncomeExpense={addIncomeExpense}
          onBackPress={() => {
            setShowModal();
            // itemBarcodeRef.current.focus();
          }}
          onSaveClick={(data) => {
            // setDiscount(data.discount);
            setAddIncomeExpense(data.IncomeExpense);
            CalcTotal(undefined, undefined, data.IncomeExpense);
          }}
        />
      </Modal>
    </div>
  );
};

export default PurchaseCard;
