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
  ShoppingCartOutlined,
  PlusCircleOutlined,
  DeleteTwoTone,
  UserOutlined,
  PrinterOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";
import PurchaseSummaryComponent from "./PurchaseSummaryComponent";
import { fetchBranchMasterData } from "../../services/branch-master";
import { fetchDeptMasterService } from "../../services/department-master";
import { getUnitMaster } from "../../services/unit-master";
import { InvGetTransactionTypes } from "../../services/inventory";
import { getTaxMaster } from "../../services/taxMaster";
import { hasRightToBeUsedNext } from "../../shared/utility";
import { fetchSupplierMasterComp } from "../../services/supplier-master-comp";
import SupplierMasterComp from "../portal/backoffice/SupplierMaster/SupplierMasterComp";
import SearchSupplier from "./SearchSupplier";
import StockDistinctPrice from "../sales/StockDistinctPrice";
import SelectableItem from "../Inventory/Adjustment/SelectableItem";
import DiscountAdditionalIncomeExpenseComp from "../sales/DiscountAdditionalIncomeExpenseComp";

const { Option } = Select;

const PurchaseNewCard = (props) => {
  const dispatch = useDispatch();

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
  const initialItemDataValues = {
    itemBarcode: null,
    itemCode: null,
    itemName: null,
    subcatDesc: null,
    qty: null,
    freeQty: null,
    totalQty: null,
    batchNo: null,
    expiryDate: null,
    inwardSeq: null,
    taxCode: null,
    taxPer: null,
    unit: null,
    Cost: null,
    landingCost: null,
    taxAmount: null,
    discount: null,
    mrp: null,
    salePrice: null,
    itemTotalCost: null,
    grossTotal: null,
  };

  const disabledItem = {
    itemBarcode: false,
    itemCode: false,
    itemName: true,
    qty: false,
    unit: true,
    mrp: false,
    salePrice: false,
    batchNo: false,
    expiryDate: false,
    inwardSeq: true,
    taxCode: false,
    Cost: false,
    landingCost: true,
    discount: false,
    freeQty: false,
    taxAmount: true,
    totalQty: true,
    subcatDesc: true,
  };

  const initialSummaryValues = {
    GrossAmount: 0,
    Discount: 0,
    TaxAmount: 0,
    AddIncomeAndExpenses: 0,
    RoundOff: 0,
    NetAmount: 0,
  };

  //useStates
  const [searchData, setSearchData] = useState(initialSearchData);
  const [itemData, setItemData] = useState(initialItemDataValues);
  const [itemDataDisabled, setItemDataDisabled] = useState(disabledItem);
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
  const [addIncomeExpense, setAddIncomeExpense] = useState([]);

  //useSelector
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const roundOffConfigs = useSelector((state) => state.AppMain.roundOffConfigs);
  const l_ConfigInWardSeqType = useSelector((state) =>
    state.AppMain.appconfigs.find((i) => i.configCode === "INV_TYPE")
  );
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const suppMasterRights = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 89)[0]
  );

  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  //useRef
  const itemCodeRef = useRef();
  const QtyRef = useRef();
  const ItemAddRef = useRef();
  const ItemResetRef = useRef();
  const itemBarcodeRef = useRef();

  //useEffect;
  useEffect(() => {
    async function fetchData() {
      let branch = null;
      let depart = null;
      let TranType = null;

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
      await fetchSupplierMasterComp(CompCode).then((res) => {
        setSupplierData(res.filter((aa) => aa.IsActive === true));
      });
      setSearchData({
        ...searchData,
        branch: branch,
        department: depart,
        voucherType: TranType,
      });
    }
    fetchData();
  }, []);

  const columns = [
    {
      title: "Item Barcode",
      dataIndex: "itemBarcode",
      width: 100,
      ellipsis: true,
    },
    { title: "Item Code", dataIndex: "itemCode", width: 80 },
    { title: "Item Name", dataIndex: "itemName" },
    {
      title: "Batch No",
      dataIndex: "batchNo",
      width: 75,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      width: 90,
      render(text, record) {
        return (
          <div>
            {record.expiryDate
              ? moment(record.expiryDate).format(l_ConfigDateFormat)
              : ""}
          </div>
        );
      },
    },
    {
      title: `Quantity`,
      dataIndex: "qty",
      align: "right",
      width: 70,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {parseFloat(record.qty) +
              (record.freeQty ? parseFloat(record.freeQty) : 0)}
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
            {record.landingCost
              ? _.round(record.landingCost, 3).toFixed(2)
              : null}
          </div>
        );
      },
    },
    {
      title: `Sale Rate`,
      dataIndex: "salePrice",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div style={{ fontWeight: "600" }}>
            {record.SalePrice ? _.round(record.salePrice, 3).toFixed(2) : null}
          </div>
        );
      },
    },
    {
      title: `MRP`,
      dataIndex: "mrp",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <div>{record.Mrp ? _.round(record.mrp, 3).toFixed(2) : null}</div>
        );
      },
    },

    {
      title: `Gross`,
      dataIndex: "grossTotal",
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
      dataIndex: "taxAmount",
      width: 100,
      ellipsis: true,
    },

    {
      title: `Amount`,
      align: "right",
      width: 80,
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
      render: (text, record) => {
        return (
          <>
            <a
              className={`edit-btn ${
                record.IsAllowModification === "N" ? `disabled` : `edit-btn`
              }`}
              disabled={record.IsAllowModification === "N"}
              onClick={() => {
                // setMode("U");
                let tempTable = [
                  ...ItemTableData.filter((aa) => aa.key !== record.key),
                  // { ...record, IsDeleted: true },
                ];
                setItemTableData([...tempTable]);
                // CalcTotal([...tempTable]);
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
                    <div style={{ width: "35%" }}>
                      <DatePicker
                        onChange={(e) => {
                          setSearchData({ ...searchData, voucherDate: e });
                        }}
                        format={l_ConfigDateFormat}
                        defaultValue={searchData.voucherDate}
                        placeholder="Voucher Date"
                        style={{ width: "100%" }}
                        size="small"
                      />
                    </div>
                    <div style={{ width: "35%" }}>
                      <Select
                        onChange={(value) => {
                          setSearchData({ ...searchData, saleType: value });
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
                          setSearchData({
                            ...searchData,
                            supplierId: value,
                            supplierName: newAtt
                              ? newAtt.option.suppName
                              : null,
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
                          !hasRightToBeUsedNext(suppMasterRights.Rights, "ADD")
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
                          !hasRightToBeUsedNext(suppMasterRights.Rights, "EDIT")
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
                        defaultValue={searchData.deliveryChallanNo}
                        allowClear
                        placeholder="Challan No."
                        style={{
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
                          setSearchData({ ...searchData, branch: val });
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
                        defaultValue={searchData.billNo}
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
                        defaultValue={searchData.billDate}
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
                        // type="number"
                        onChange={(e) => {
                          setSearchData({
                            ...searchData,
                            creditDays: e,
                          });
                        }}
                        value={searchData.creditDays}
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
              </Col>
            </div>
          </div>
        </Col>
        <Col span={10} style={{ height: 172 }}>
          <div className="card-sales" style={{ padding: 0, height: "98%" }}>
            <PurchaseSummaryComponent
              GrossAmount={voucherSummary ? voucherSummary.GrossAmount : 0.0}
              DiscountAmount={voucherSummary ? voucherSummary.Discount : 0.0}
              TaxAmount={voucherSummary ? voucherSummary.TaxAmount : 0.0}
              AddIncomeAndExpenses={
                voucherSummary ? voucherSummary.AddIncomeAndExpenses : 0.0
              }
              RoundOff={voucherSummary ? voucherSummary.RoundOff : 0.0}
              NetAmount={voucherSummary ? voucherSummary.NetAmount : 0.0}
              onAddIECLick={() => {
                setShowModal("ADDIE");
              }}
            />
          </div>
        </Col>{" "}
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
                            // onGetItemCode(event.target.value, event); need to add
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
                      <Input
                        disabled={itemDataDisabled.itemName}
                        style={{ maxHeight: 24 }}
                        placeholder="Item Name"
                        size="small"
                        value={itemData.itemName}
                      />
                    </Col>
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
                        paddingRight: 5,
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
                        paddingRight: 5,
                        width: "100%",
                      }}
                    >
                      Tax
                    </div>
                    <Select
                      className="purchase-select"
                      disabled={itemDataDisabled.taxCode}
                      value={itemData.taxCode}
                      placeholder="Tax"
                      style={{ width: "100%" }}
                      size="small"
                      onChange={(e) => {
                        let oldD = { ...itemData };
                        setItemData({ ...oldD, taxCode: e });
                        // if (
                        //   !_.includes(
                        //     [null, "", undefined],
                        //     itemData.ItemCode
                        //   ) ||
                        //   !_.includes([null, "", undefined], itemData.ItemName)
                        // ) {
                        //   let selectedTaxCode =
                        //     e && !_.includes(["", null, undefined], e)
                        //       ? e
                        //       : null;

                        //   let tempTax = taxMaster.find(
                        //     (tt) => tt.TaxCode === selectedTaxCode
                        //   );

                        //   if (tempTax) {
                        //     calcItemData({
                        //       ...oldD,
                        //       TaxCode: e,
                        //       TaxPer: tempTax.TaxPer,
                        //     });
                        //   }
                        // }
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
                {props.showBatch === "Y" &&
                l_ConfigInWardSeqType.value1 === "Y" ? (
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
                            paddingRight: 5,
                            textAlign: "end",
                            width: "100%",
                          }}
                        >
                          Batch No
                        </div>
                        <Input
                          placeholder="Batch No"
                          style={{ width: "100%" }}
                          size="small"
                          onChange={(e) => {
                            let oldD = { ...itemData };
                            setItemData({ ...oldD, batchNo: e.target.value });
                          }}
                          value={itemData.batchNo}
                          disabled={itemDataDisabled.batchNo}
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
                              return { ...oldD, expiryDate: e };
                            });
                          }}
                          format={l_ConfigDateFormat}
                          defaultValue={itemData.expiryDate}
                          disabled={itemDataDisabled.expiryDate}
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
                          setItemData({ ...oldD, subcatDesc: e.target.value });
                        }}
                        value={itemData.subcatDesc}
                        disabled={itemDataDisabled.subcatDesc}
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
                            qty: parseFloat(e.target.value),
                          });
                          // if (
                          //   !_.includes(
                          //     [null, "", undefined],
                          //     itemData.ItemCode
                          //   ) ||
                          //   !_.includes(
                          //     [null, "", undefined],
                          //     itemData.ItemName
                          //   )
                          // ) {
                          //   calcItemData({
                          //     ...oldD,
                          //     Qty: parseFloat(e.target.value),
                          //   });
                          // }
                        }}
                        min={1}
                        value={itemData.qty}
                        onKeyDown={async (event) => {
                          if (event.keyCode === 13) {
                            event.preventDefault();
                            // ItemAddRef.current.click();
                          }
                        }}
                        disabled={itemDataDisabled.qty}
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
                          setItemData({
                            ...oldD,
                            freeQty: parseFloat(e.target.value),
                          });
                          // if (
                          //   !_.includes(
                          //     [null, "", undefined],
                          //     itemData.ItemCode
                          //   ) ||
                          //   !_.includes(
                          //     [null, "", undefined],
                          //     itemData.ItemName
                          //   )
                          // ) {
                          //   calcItemData({
                          //     ...oldD,
                          //     freeQty: parseFloat(e.target.value),
                          //   });
                          // }
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
                        // onChange={(e) => {
                        //   let oldD = { ...itemData };
                        //   setItemData({ ...oldD, totalQty: e.target.value });
                        // }}
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
                        // if (
                        //   !_.includes(
                        //     [null, "", undefined],
                        //     itemData.ItemCode
                        //   ) ||
                        //   !_.includes([null, "", undefined], itemData.ItemName)
                        // ) {
                        //   calcItemData({ ...oldD, Cost: e.target.value });
                        // }
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
                        if (itemData.grossTotal < e.target.value) {
                          message.error(
                            "Discount Cannot be Less Than Gross Amount"
                          );
                          setItemData({ ...oldD, discount: null });
                        } else {
                          setItemData({ ...oldD, discount: e.target.value });
                          // if (
                          //   !_.includes(
                          //     [null, "", undefined],
                          //     itemData.ItemCode
                          //   ) ||
                          //   !_.includes(
                          //     [null, "", undefined],
                          //     itemData.ItemName
                          //   )
                          // ) {
                          //   calcItemData({
                          //     ...oldD,
                          //     discount: e.target.value,
                          //   });
                          // }
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
                        setItemData({ ...oldD, taxAmount: e.target.value });
                      }}
                      value={itemData.taxAmount}
                      disabled={itemDataDisabled.taxAmount}
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
                        setItemData({ ...oldD, landingCost: e.target.value });
                      }}
                      value={itemData.landingCost}
                      disabled={itemDataDisabled.landingCost}
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
                        setItemData({
                          ...oldD,
                          salePrice: parseFloat(e.target.value),
                        });
                      }}
                      value={itemData.salePrice}
                      disabled={itemDataDisabled.salePrice}
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
                        setItemData({
                          ...oldD,
                          mrp: parseFloat(e.target.value),
                        });
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
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      marginBottom: 5,
                      height: 45,
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
                        // onAddClick();
                      }
                    }}
                    disabled={
                      _.includes([null, "", undefined], itemData.itemCode) ||
                      _.includes([null, "", undefined], itemData.itemName)
                    }
                  ></Button>
                  <Button
                    ref={ItemResetRef}
                    type="primary"
                    style={{
                      height: 45,
                      fontSize: "16px",
                      fontWeight: "600",
                      flex: 1,
                      width: "49%",
                    }}
                    icon={<RetweetOutlined style={{ fontSize: 22 }} />}
                    size="small"
                    onClick={() => {
                      setItemData(initialItemDataValues);
                      setItemDataDisabled({
                        ...itemDataDisabled,
                        itemCode: false,
                        unit: false,
                        itemBarcode: false,
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
            }}
          >
            <Table
              columns={columns.filter((cc) =>
                props.showBatch === "Y"
                  ? true
                  : !_.includes(["batchNo", "expiryDate"], cc.dataIndex)
              )}
              dataSource={ItemTableData.filter((aa) => aa.IsDeleted === false)}
              pagination={false}
              bordered={true}
              key={(data) => {
                return data.key;
              }}
              className="adjustmentTable"
              scroll={{ y: "calc(100% - 30px)", x: "max-content" }}
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
                ItemTableData.filter((aa) => aa.IsDeleted === false).length <= 0
              }
              type="primary"
              onClick={() => {
                // setIsLoading(true);
                // let tempHdr = {
                //   CompCode: CompCode,
                //   BranchCode: searchData.branch,
                //   DeptCode: searchData.department,
                //   TaxType: searchData.saleType,
                //   SuppId: searchData.supplierId,
                //   SuppName: searchData.supplierName,
                //   PurchaseType: searchData.voucherType,
                //   DeliveryChallanNo: searchData.deliveryChallanNo,
                //   DeliveryChallanDate: searchData.deliveryChallanDate,
                //   PurchaseBillNo: searchData.billNo,
                //   PurchaseBillDate: searchData.billDate,
                //   EWayBillNo: searchData.eWaybillNo,
                //   VehicleNo: searchData.vehicleNo,
                //   CreditDays: searchData.creditDays,
                //   POIdPONo: null,
                //   PODate: null,
                //   SysOption1: null,
                //   SysOption2: null,
                //   SysOption3: null,
                //   SysOption4: null,
                //   SysOption5: null,
                //   SysOption6: null,
                //   SysOption7: null,
                //   SysOption8: null,
                //   SysOption9: null,
                //   SysOption10: null,
                //   GrossAmount: voucherSummary.GrossAmount,
                //   DiscAmount: voucherSummary.Discount,
                //   TaxAmount: voucherSummary.TaxAmount,
                //   MiscAmount: voucherSummary.MiscAmount,
                //   RoundOff: voucherSummary.RoundOff,
                //   NetAmount: voucherSummary.NetAmount,
                //   SettlementAmount: 0,
                //   UpdtUsr: l_loginUser,
                // };
                // let tempDtl = [];
                // let AddIncomeExpensesDtl = [];
                // ItemTableData.filter((aa) => aa.IsDeleted === false).forEach(
                //   (row, i) => {
                //     // console.log(row);
                //     tempDtl.push({
                //       SrNo: i + 1,
                //       ItemCode: row.ItemCode,
                //       ScannedBarcode: row.itemBarcode,
                //       InwardSeq: row.InwardSeq,
                //       BatchNo: row.BatchNo,
                //       ExpiryDate: row.ExpiryDate,
                //       Qty: row.Qty,
                //       FreeQty: row.freeQty,
                //       TotalPurQty: row.Qty + row.freeQty,
                //       CostPrice: row.Cost,
                //       SalePrice: row.SalePrice,
                //       MRP: row.Mrp,
                //       DiscPer: null,
                //       DiscAmount: row.discount,
                //       TaxCode: row.TaxCode,
                //       TaxPerc: row.TaxPer,
                //       TaxAmount: row.TaxAmount,
                //       ItemTotalCost: row.LandingCost,
                //       Amount: row.ItemTotalCost,
                //       SysOption1: null,
                //       SysOption2: null,
                //       SysOption3: null,
                //       SysOption4: null,
                //       SysOption5: null,
                //       CGST: row.CGSTAmount,
                //       SGST: row.SGSTAmount,
                //       IGST: row.IGSTAmount,
                //       UTGST: row.UGSTAmount,
                //       Surcharge: row.SurchargeAmount,
                //       Cess: row.CessAmount,
                //       UpdtUsr: l_loginUser,
                //     });
                //   }
                // );
                // addIncomeExpense.forEach((row, index) => {
                //   console.log(row);
                //   AddIncomeExpensesDtl.push({
                //     SrNo: index + 1,
                //     IEType: row.IEtype,
                //     Particular: row.reason,
                //     Amount: parseFloat(row.amount),
                //     SysOption1: null,
                //     SysOption2: null,
                //     SysOption3: null,
                //     SysOption4: null,
                //     SysOption5: null,
                //   });
                // });
                // let data = {
                //   PurchaseInvoiceHdr: tempHdr,
                //   PurchaseInvoiceDtl: tempDtl,
                //   AddIncomeExpensesDtl,
                // };
                // console.log(data);
                // setTimeout(() => {
                //   invSavePurchaseInvoice(CompCode, data)
                //     .then((res) => {
                //       console.log(data);
                //       notification.success({
                //         message: "Data Saved Successfully",
                //         description: "data Saved Successfully",
                //       });
                //       setIsLoading(false);
                //       setItemData(initialItemDataValues);
                //       setItemTableData([]);
                //       setVoucherSummary();
                //       props.onBackPress();
                //       setSearchData(initialSearchData);
                //     })
                //     .catch((err) => {
                //       setIsLoading(false);
                //       notification.error({
                //         message: "Error Saving Data",
                //         description: err,
                //       });
                //     });
                // }, 200);
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
        bodyStyle={{ padding: "5px" }}
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
              setShowModal();
              // validateItemCode(data.ItemCode);
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
              itemName: null,
              unit: null,
              qty: null,
            };
          });
          setItemDataDisabled((old) => {
            return {
              ...old,
              itemBarcode: false,
              itemCode: false,
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
                  mrp: data.MRP,
                  salePrice: data.SalePrice,
                };
              });
              setItemDataDisabled((old) => {
                return { ...old, itemBarcode: true, itemCode: true };
              });
              setShowModal();
              QtyRef.current.focus();
            }
          }}
          onBackPress={() => {
            setItemData((old) => {
              return {
                ...old,
                itemName: null,
                unit: null,
                Qty: null,
              };
            });
            setItemDataDisabled((old) => {
              return {
                ...old,
                itemBarcode: false,
                itemCode: false,
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
            setAddIncomeExpense(data.IncomeExpense);
            // CalcTotal(undefined, undefined, data.IncomeExpense);
          }}
        />
      </Modal>
    </div>
  );
};

export default PurchaseNewCard;
