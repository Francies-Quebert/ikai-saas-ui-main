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
  Divider,
  Select,
  DatePicker,
  Tooltip,
  message,
  Drawer,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  RetweetOutlined,
  SearchOutlined,
  BarcodeOutlined,
  ShoppingCartOutlined,
  PlusCircleOutlined,
  EditTwoTone,
  DeleteTwoTone,
  ArrowLeftOutlined,
  UserOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";
import { hasRightToBeUsedNext } from "../../../shared/utility";
import { fetchBranchMasterData } from "../../../services/branch-master";
import { fetchDeptMasterService } from "../../../services/department-master";
import {
  invGetAllInwardSeqInfo,
  InvGetTransactionTypes,
  invSaveSaleReturnInvoice,
} from "../../../services/inventory";
import { getTaxMaster } from "../../../services/taxMaster";
import { fetchCountryMasters } from "../../../store/actions/CountryMaster";
import { fetchStateMasters } from "../../../store/actions/StateMaster";
import { fetchCityMasters } from "../../../store/actions/CityMaster";
import { fetchSupplierMasterComp } from "../../../services/supplier-master-comp";
import {
  getInvItemMasterData,
  getItemCodeFromBarcode,
} from "../../../services/opening-stock";
import PurchaseSummaryComponent from "../../purchases/PurchaseSummaryComponent";
import SearchSupplier from "../../purchases/SearchSupplier";
import SupplierMasterComp from "../../portal/backoffice/SupplierMaster/SupplierMasterComp";
import SearchAllInwardSeq from "../Adjustment/SearchAllInwardSeq";
import SelectableItem from "../Adjustment/SelectableItem";
import CustomerSelectionComponent from "../../dashboard/Restaurant/components/SubComponents/CustomerSelectionComponent";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import SearchCustomer from "../../sales/SearchCustomer";
import DiscountAdditionalIncomeExpenseComp from "../../sales/DiscountAdditionalIncomeExpenseComp";

const { Option } = Select;

const SaleReturnCard = (props) => {
  const dispatch = useDispatch();
  const refAdd = useRef();
  const refInwardSeq = useRef([]);
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const [keyboardKey, setKeyboardKey] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const initialSearchData = {
    branch: null,
    department: null,
    voucherNo: null,
    voucherDate: moment(),
    voucherType: null,
    saleType: "GST_INC",
    customerId: null,
    customerName: null,
    refDate: null,
    refNo: null,
    sBillNo: null,
    sBillDate: null,
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
  };

  const initialTable = [
    {
      key: 1,
      ItemCode: null,
      ItemName: null,
      InwardSeq: null,
      BatchNo: null,
      ExpiryDate: null,
      Qty: 0,
      CostPrice: 0,
      LSalePrice: 0,
      ItemGrossAmount: 0,
      ItemDiscount: 0,
      TaxCode: null,
      TaxPer: null,
      TaxAmount: 0,
      LCost: 0,
      SalePrice: 0,
      MRP: 0,
      remark: null,
      ItemTotalAmount: 0,
      isDeleted: false,
    },
  ];

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
  const [discount, setDiscount] = useState(null);
  const [addIncomeExpense, setAddIncomeExpense] = useState([]);

  const currTran = useSelector((state) => state.currentTran);
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const l_Currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );

  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  useEffect(() => {
    // document.title = "Saurav Bevda";
    async function fetchData() {
      setIsLoading(true);
      let branch = null;
      let depart = null;
      let TranType = null;
      // fetchPaymodeMaster().then((res) => {
      //   let tempData = [];
      //   res
      //     .filter((ii) => ii.IsActive)
      //     .forEach((row, index) => {
      //       tempData.push({
      //         ...row,
      //         key: index,
      //         Amount: 0,
      //         isDirty: false,
      //         IsChecked: false,
      //       });
      //     });
      //   setPaymentMode(tempData);
      // });

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

      await InvGetTransactionTypes(CompCode, "SALERTN").then((trantype) => {
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
    dispatch(fetchUserMasters("U"));
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

  useEffect(() => {
    if (ItemTableData.length > 0) {
      let l_totalgross = 0;
      let l_totalDiscount = 0;
      let l_totaltax = 0;
      let l_AdditionalIE = 0;
      let l_roundoff = 0;
      let lv_TaxType = "I";
      let l_NetAmountBeforeRoundOff = 0;

      ItemTableData.filter(
        (aa) => aa.ItemCode !== null && aa.isDeleted === false
      ).forEach((xx, zz) => {
        l_totalgross += xx.ItemGrossAmount ? xx.ItemGrossAmount : 0;
        l_totalDiscount += xx.ItemDiscount ? xx.ItemDiscount : 0;
        l_totaltax += xx.TaxAmount ? xx.TaxAmount : 0;
      });

      // if (addIncomeExpense.length > 0) {
      //   let IEData = addIncomeExpense;
      //   IEData.map((ie) => {
      //     if (ie.IEtype === "I") {
      //       l_AdditionalIE += parseFloat(ie.amount);
      //     } else {
      //       l_AdditionalIE -= parseFloat(ie.amount);
      //     }
      //   });
      //   // console.log(l_AdditionalIE, "amount");
      // }

      if (lv_TaxType === "I") {
        l_NetAmountBeforeRoundOff =
          l_totalgross - l_totalDiscount + l_AdditionalIE + l_totaltax;
      } else if (lv_TaxType === "E") {
        l_NetAmountBeforeRoundOff =
          l_totalgross - l_totalDiscount + l_AdditionalIE;
      }

      setVoucherSummary({
        GrossAmount: parseFloat(l_totalgross).toFixed(2),
        Discount: parseFloat(l_totalDiscount).toFixed(2),
        TaxAmount: parseFloat(l_totaltax).toFixed(2),
        AddIncomeAndExpenses: parseFloat(l_AdditionalIE).toFixed(2),
        RoundOff: parseFloat(l_roundoff).toFixed(2),
        NetAmount: parseFloat(l_NetAmountBeforeRoundOff).toFixed(2),
        // parseFloat(
        //   l_totalgross - l_totalDiscount + l_totaltax
        // ).toFixed(2),
      });
    }
  }, [ItemTableData, addIncomeExpense]);

  const checkItemCode = async (event, record) => {
    // // console.log(record, "check item");
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
            // tempTable[findIndex].ScannedBarcode = await tempData.ItemCode;
            tempTable[findIndex].ItemCode = await tempData.ItemCode;
            tempTable[findIndex].ItemName = await tempData.ItemName;
            tempTable[findIndex].Qty = 0;
            tempTable[findIndex].InwardSeq = null;
            tempTable[findIndex].CostPrice = null;
            tempTable[findIndex].SalePrice = null;
            tempTable[findIndex].MRP = null;

            // // console.log([...tempTable], "after findIndex");
            if (
              !tempTable.find(
                (aa) => aa.ItemCode === null || aa.ItemCode === ""
              )
            ) {
              if (tempTable && tempTable.length > 0) {
                refAdd.current.click();
                await setItemTableData([...tempTable]);
              }
            }
            refInwardSeq.current[record.key].focus();
          } else {
            if (event.target.value !== "" && event.target.value !== null) {
              // // console.log(event.target.value);
              message.error("Incorrect Item Code");
            }
            if (tempTable && tempTable.length > 0) {
              await setItemTableData([...tempTable]);
            }
          }
          // }
        } else {
          notification.error({
            message: "Invalid Code",
            description: "No Item exist with this code",
          });
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

  const calcItemData = (data) => {
    // console.log(data, ItemTableData, "calc");

    let l_Qty =
      data && !_.includes(["", null, undefined], data.Qty) ? data.Qty : 0;

    let l_Discount =
      data && !_.includes(["", null, undefined], data.ItemDiscount)
        ? data.ItemDiscount
        : 0;

    let l_Cost = data && data.CostPrice ? data.CostPrice : 0;

    let l_GrossAmount = parseFloat(l_Cost) * l_Qty;

    let costTaxAmount =
      ((l_GrossAmount - l_Discount) / 100) * parseFloat(data.TaxPer);

    let l_LandingCost =
      (l_GrossAmount - l_Discount + costTaxAmount) / parseFloat(l_Qty);

    let tempTable = ItemTableData;
    let findIndex = ItemTableData.findIndex((xz) => xz.key == data.key);

    tempTable[findIndex].ItemGrossAmount = l_GrossAmount;
    tempTable[findIndex].LSalePrice = l_LandingCost;
    tempTable[findIndex].ItemTotalAmount =
      l_GrossAmount - l_Discount + costTaxAmount;
    tempTable[findIndex].TaxAmount = costTaxAmount;
    setItemTableData([...tempTable]);
    // console.log(tempTable, "after calculation");
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
              tempTable[findIndex].Qty = e;
              setItemTableData([...tempTable]);
              calcItemData(record);
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
            onChange={(e) => {
              let tempTable = ItemTableData;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].ItemDiscount = e;
              // calcItemData({
              //   ...record,
              //   CostPrice: e,
              // });
              setItemTableData([...tempTable]);
              calcItemData(record);
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
      dataIndex: "LSalePrice",
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
    <>
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
                        Customer
                      </div>
                    </Col>
                    <Col xs={24} lg={24} xl={24} style={{ display: "flex" }}>
                      <div
                        style={{ width: "calc(100% - 60px)", display: "flex" }}
                        className="purchase-search-input"
                      >
                        <a
                          onClick={() => {
                            setShowModal("SEARCH_CUSTOMER");
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
                                customerId: value,
                                // customerName: newAtt
                                //   ? newAtt.option.suppName
                                //   : null,
                              };
                            });
                          }}
                          value={searchData.customerId}
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          placeholder="Customer"
                          style={{
                            // padding: "0px 5px",
                            width: "calc(100% - 24px)",
                            flex: 1,
                            alignSelf: "center",
                          }}
                          size="small"
                        >
                          {customer.length > 0 &&
                            customer.map((cc) => (
                              <Option value={cc.userId} key={cc.userId}>
                                {cc.Name} ({cc.mobile})
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
                            searchData.customerId &&
                            searchData.customerId !== null
                          }
                          onClick={() => setShowModal("ADD_SUPPLIER")}
                          icon={<PlusOutlined />}
                        ></Button>
                        <Button
                          type="primary"
                          shape="circle"
                          disabled={
                            !searchData.customerId ||
                            searchData.customerId === null
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
                        Sale Rtn. No / Sale Rtn. Date
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
                              sBillNo: e.target.value,
                            });
                          }}
                          defaultValue={searchData.sBillNo}
                          placeholder="Sale Return Bill No"
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
                              return { ...oldD, sBillDate: e };
                            });
                          }}
                          // className="sales-item-input-date"
                          format={l_ConfigDateFormat}
                          defaultValue={searchData.sBillDate}
                          placeholder="Sale Return Bill Date"
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
          <Col span={24}>
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
                          Qty: 0,
                          CostPrice: 0,
                          ItemGrossAmount: 0,
                          ItemDiscount: 0,
                          TaxCode: null,
                          TaxPer: null,
                          TaxAmount: 0,
                          LCost: 0,
                          SalePrice: 0,
                          MRP: 0,
                          remark: null,
                          ItemTotalAmount: 0,
                          isDeleted: false,
                        },
                      ];
                      // console.log(newData);
                      setItemTableData([...newData]);
                    }
                  }}
                >
                  Add New Row
                </Button>
              </div>
            </div>
          </Col>

          <Col span={24}>
            <div className="card-sales">
              <Button
                icon={<PlusCircleOutlined />}
                style={{ marginRight: 5 }}
                disabled={
                  // _.includes([null, undefined, ""], searchData.customerId) ||
                  ItemTableData.filter(
                    (aa) => aa.ItemCode !== null && aa.isDeleted === false
                  ).length <= 0
                }
                type="primary"
                onClick={() => {
                  setIsLoading(true);
                  let SaleReturnInvoiceDtl = [];
                  let SaleReturnInvoiceHdr = {
                    CompCode: CompCode,
                    BranchCode: searchData.branch,
                    DeptCode: searchData.department,
                    VoucherDate: searchData.voucherDate,
                    VoucherNo: searchData.voucherNo,
                    TaxType: searchData.saleType,
                    CustId: searchData.customerId,
                    CustName: searchData.customerId,
                    CustMobile: null,
                    CustBillingAddress: null,
                    CustDeliveryAddress: null,
                    SaleType: searchData.voucherType,
                    SaleRtnBillNo: searchData.sBillNo,
                    SaleRtnBillDate: searchData.sBillDate,
                    RefNo: searchData.refNo,
                    RefDate: searchData.refDate,
                    EWayBillNo: searchData.eWaybillNo,
                    VehicleNo: searchData.vehicleNo,
                    CreditDays: searchData.creditDays,
                    SaleVoucherId: null,
                    SaleVoucherNo: null,
                    SaleVoucherDate: null,
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

                  ItemTableData.filter(
                    (aa) => aa.ItemCode !== null && aa.isDeleted === false
                  ).forEach((val, inx) => {
                    SaleReturnInvoiceDtl.push({
                      VoucherId: val.VoucherId,
                      SrNo: inx + 1,
                      ItemCode: val.ItemCode,
                      ScannedBarcode: val.ScannedBarcode
                        ? val.ScannedBarcode
                        : null,
                      InwardSeq: val.InwardSeq.InwardSeq,
                      BatchNo: val.BatchNo,
                      ExpiryDate: val.ExpiryDate,
                      SaleQty: val.Qty,
                      CostPrice: val.CostPrice,
                      SalePrice: val.SalePrice,
                      LSalePrice: val.LSalePrice,
                      MRP: val.MRP,
                      DiscPer: null,
                      DiscAmount: val.ItemDiscount,
                      SchemeDiscAmount: null,
                      SchemeCode: null,
                      TaxCode: val.TaxCode,
                      TaxPerc: val.TaxPer,
                      TaxAmount: val.TaxAmount,
                      ItemTotal: val.ItemTotalAmount,
                      Amount: val.ItemTotalAmount * val.Qty,
                      SysOption1: null,
                      SysOption2: null,
                      SysOption3: null,
                      SysOption4: null,
                      SysOption5: null,
                      CGST: val.CGST,
                      SGST: val.SGST,
                      IGST: val.IGST,
                      UTGST: val.UTGST,
                      Surcharge: val.Surcharge,
                      Cess: val.Cess,
                      UpdtUsr: l_loginUser,
                    });
                  });

                  let data = { SaleReturnInvoiceHdr, SaleReturnInvoiceDtl };
                  invSaveSaleReturnInvoice(CompCode, data).then((res) => {
                    setIsLoading(false);
                    props.onBackPress();
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
              >
                Back
              </Button>
            </div>
          </Col>
        </Row>
        <Modal
          visible={showModal === "SEARCH_CUSTOMER"}
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
          <SearchCustomer
            data={customer}
            onItemSelect={(data) => {
              if (data) {
                //console.log(data, "on select");
                setSearchData((oldD) => {
                  return { ...oldD, customerId: data.userId };
                });
                setShowModal();
              }
            }}
            onBackPress={() => {
              setShowModal();
              // itemBarcodeRef.current.focus();
            }}
          />
        </Modal>
        {/* <Modal
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
        </Modal> */}
        <Modal
          visible={
            showModal === "ADD_SUPPLIER" || showModal === "EDIT_SUPPLIER"
          }
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
          <Col style={{ padding: "10px 15px" }} className="card-sales-inner">
            Customer Selection
          </Col>
          <CustomerSelectionComponent
            onBackPress={() => {
              setShowModal();
            }}
            onCustomerSet={(values) => {
              // console.log(values);
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
                      LCost: 0,
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
              // console.log(data, ItemTableData, "inward");
              if (data) {
                let tempTable = ItemTableData;
                let findIndex = ItemTableData.findIndex(
                  (aa) => aa.key == inwardSeqData.record.key
                );

                const tax = taxMaster.find((xx) => xx.TaxCode === data.TaxCode);
                let tempCostPrice =
                  (parseFloat(data.Cost) / (100 + parseFloat(tax.TaxPer))) *
                  100;
                if (
                  tempTable.filter(
                    (xx) =>
                      xx.InwardSeq &&
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
                    tempTable[findIndex].CGST = tax.CGSTPer;
                    tempTable[findIndex].SGST = tax.SGSTPer;
                    tempTable[findIndex].IGST = tax.IGSTPer;
                    tempTable[findIndex].UGST = tax.UTSTPer;
                    tempTable[findIndex].Surcharge = tax.SURCHARGPer;
                    tempTable[findIndex].Cess = tax.CESSPer;
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
          closable={false}
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
              // console.log(data, "on save click");
              setDiscount(data.discount);
              setAddIncomeExpense(data.IncomeExpense);

              // CalcTotal(undefined, undefined, data.IncomeExpense);
            }}
          />
        </Modal>
      </div>
    </>
  );
};

export default SaleReturnCard;
