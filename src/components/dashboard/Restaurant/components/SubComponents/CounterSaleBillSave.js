import {
  ArrowLeftOutlined,
  CloseOutlined,
  DeleteTwoTone,
  FileAddOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {
  fetchPrepareInvoiceDataRestaurant,
  getInvoiceHdr,
  saveTableStatus,
  uptRestarantPosKOTHdrStatus,
  uptRestarantPosKOTdtlStatus,
  getRestaurantInvoiceDtl,
  insInvoiceDTL,
  restaurantUptInvoiceHdr,
  restaurantPOSVoidBill,
  updtRestaurantPOSKOTDtlStatus,
  raiseEvent,
  updtPOSKOTInvoiceInfo,
} from "../../../../../services/restaurant-pos";
import Refund from "../../../../../models/refund";
import { fetchPaymodeMaster } from "../../../../../services/payModeMaster";
import { useDispatch, useSelector } from "react-redux";
import DisplayVoidBillFinalCalcData from "./DisplayVoidBillFinalCalcData";
import _ from "lodash";
import DisplayVoidBillCalcData from "./DisplayVoidBillCalcData";
import {
  Col,
  Row,
  Radio,
  Button,
  Table,
  InputNumber,
  Divider,
  message,
  Skeleton,
  Checkbox,
} from "antd";
import moment from "moment";
import AmountInputComponent from "./AmountInputComponent";
import { fetchSequenceNextVal, PrintPdfOrFromElectron } from "../../../../../shared/utility";
import {
  getInvoicePdf,
  SaveInvoice,
} from "../../../../../services/service-managment/service-management";
import fileDownload from "js-file-download";
import {
  getRecieptHdrPOS,
  InsUpdtRcptService,
  updtPosInvoiceSettlementAmount,
} from "../../../../../services/reciept";
const CounterSaleBillSave = (props) => {
  const [paymentMode, setPaymentMode] = useState([]);
  const [InvoiceDtl, setInvoiceDtl] = useState([]);
  const [formData, setFormData] = useState({
    ContainerCharges: 0,
    DeliveryCharges: 0,
    Tip: 0,
    SubTotal: 0,
    Qty: 0,
    Discount: 0,
    Tax: 0,
    RoundOff: 0,
    NetPayable: 0,
    BillAmount: 0,
    TaxInclusiveOrExclusive: "",
    TaxBeforeDiscountOrTaxAfterDiscount: "",
  });
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [saveLoading, setSaveLoading] = useState(false);
  //   const [InvoiceHdr, setInvoiceHdr] = useState([]);
  const [loading, setLoading] = useState(false);

  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const appconfigs = useSelector((state) => state.AppMain.appconfigs);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const sysConfig = useSelector((state) => state.AppMain.sysSequenceConfig);
  const [tableCalc, setTableCalc] = useState({
    amount: 0,
    dueAmount: 0,
  });
  const [billData, setBillData] = useState([]);
  //   const [invoiceHdr, setInvoiceHdr] = useState([]);
  const [preBillInfo, setPreBillInfo] = useState();
  useEffect(() => {
    setLoading(true);
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
    // props.PrpareAndSaveKOT().then((psKot) => {
    fetchPrepareInvoiceDataRestaurant(
      CompCode,
      BranchConfigs.value1,
      props.EntryMode.EntryType,
      props.EntryMode.TableInfo ? props.EntryMode.TableInfo.TableCode : null,
      props.lastKOTId
    ).then((preBillInfo) => {
      setPreBillInfo(preBillInfo);
      setLoading(false);
    });
    // });
  }, []);
  const [showFormType, setshowFormType] = useState("SAVE");
  const [paidAmount, setPaidAmount] = useState(0);
  useEffect(() => {
    let amount = 0;
    paymentMode
      .filter((ii) => ii.isDirty === true && ii.IsChecked === true)
      .forEach((row) => {
        amount += row.Amount;
      });
    setPaidAmount(amount);
  }, [paymentMode]);
  useEffect(() => {
    calcBill();
  }, [
    preBillInfo,
    formData.Discount,
    formData.Tip,
    formData.ContainerCharges,
    formData.DeliveryCharges,
  ]);
  const calcBill = () => {
    if (!preBillInfo) {
      return;
      //   resolve();
    }
    let l_DeliveryCharges = formData.DeliveryCharges;
    let l_ContainerCharges = formData.ContainerCharges;
    let l_Tip = formData.Tip;
    let l_Discount = props.discount;

    let tempBillData = [];

    let l_SumGrossAmount = 0;
    let l_SumDiscValue = 0;
    let l_SumNetAmount = 0;
    let l_SumSubTotal = 0;
    let l_SumSGST = 0;
    let l_SumCGST = 0;
    let l_SumIGST = 0;
    let l_SumUTGST = 0;
    let l_SumCess = 0;
    let l_SumSurcharge = 0;
    let l_SumOfTaxAmount = 0;
    let l_RoundOffAmount = 0;

    //  (preBillInfo.InvoiceConfigs[0].DiscountTaxInclusiveOrExclusive === "I") {
    let l_SumOfNetAmount = 0;
    let l_SumOfQty = 0;
    preBillInfo.KOTDTLs.forEach((row) => {
      l_SumOfNetAmount += parseFloat(row.Amount);
      l_SumOfQty += parseFloat(row.Qty);
    });

    preBillInfo.KOTDTLs.forEach((row) => {
      let totalTaxPerc =
        parseFloat(row.CGSTPer) +
        parseFloat(row.SGSTPer) +
        parseFloat(row.SURCHARGPer) +
        parseFloat(row.CESSPer);

      let l_discValue = 0;
      if (l_Discount.type === "F") {
        l_discValue = _.round(
          (parseFloat(l_Discount.discountAmount) / l_SumOfNetAmount) *
            parseFloat(row.Amount),
          3
        );
      } else if (l_Discount.type === "P") {
        l_discValue = _.round(
          (parseFloat(row.Amount) / 100) *
            parseFloat(l_Discount.discountAmount),
          3
        );
      }
      let l_TaxExclusionAmount = 0;
      let l_SubTotal = 0;

      if (preBillInfo.InvoiceConfigs[0].CalcTaxBeforeDiscOrAfterDisc === "B") {
        if (preBillInfo.InvoiceConfigs[0].TaxInclusiveOrExclusive === "I") {
          l_TaxExclusionAmount = _.round(
            (parseFloat(row.Amount) / (100 + totalTaxPerc)) * 100,
            3
          );
        } else if (
          preBillInfo.InvoiceConfigs[0].TaxInclusiveOrExclusive === "E"
        ) {
          l_TaxExclusionAmount = parseFloat(row.Amount);
        }
      } else {
        if (preBillInfo.InvoiceConfigs[0].TaxInclusiveOrExclusive === "I") {
          l_TaxExclusionAmount = _.round(
            ((parseFloat(row.Amount) - l_discValue) / (100 + totalTaxPerc)) *
              100,
            3
          );
        } else if (
          preBillInfo.InvoiceConfigs[0].TaxInclusiveOrExclusive === "E"
        ) {
          l_TaxExclusionAmount = parseFloat(row.Amount) - l_discValue;
        }
      }

      // l_SumNetAmount += l_TaxExclusionAmount;

      let l_SGST = _.round(
        (l_TaxExclusionAmount * parseFloat(row.SGSTPer)) / 100,
        3
      );

      let l_CGST = _.round(
        (l_TaxExclusionAmount * parseFloat(row.CGSTPer)) / 100,
        3
      );

      let l_IGST = _.round(
        false ? (l_TaxExclusionAmount * parseFloat(row.IGSTPer)) / 100 : 0,
        3
      );

      let l_UTGST = _.round(
        false ? (l_TaxExclusionAmount * parseFloat(row.UTSTPer)) / 100 : 0,
        3
      );

      let l_Cess = _.round(
        (l_TaxExclusionAmount * parseFloat(row.CESSPer)) / 100,
        3
      );

      let l_Surcharge = _.round(
        (l_TaxExclusionAmount * parseFloat(row.SURCHARGPer)) / 100,
        3
      );
      let l_TaxAmount =
        l_SGST + l_CGST + l_IGST + l_UTGST + l_Cess + l_Surcharge;

      l_SumSGST += l_SGST;
      l_SumCGST += l_CGST;
      l_SumIGST += l_IGST;
      l_SumUTGST += l_UTGST;
      l_SumCess += l_Cess;
      l_SumSurcharge += l_Surcharge;

      // l_SumGrossAmount += parseFloat(row.Amount);
      l_SumDiscValue += l_discValue;

      l_SumOfTaxAmount += l_TaxAmount;

      // if (preBillInfo.InvoiceConfigs[0].TaxInclusiveOrExclusive === "I") {
      //   l_SubTotal =
      //     _.round(parseFloat(row.Amount) - l_discValue, 3) -
      //     (l_CGST + l_SGST + l_UTGST + l_IGST + l_Surcharge + l_Cess);
      // } else {
      //   l_SubTotal = _.round(parseFloat(row.Amount) - l_discValue, 3);
      // }
      l_SubTotal = l_TaxExclusionAmount;

      l_SumSubTotal += l_SubTotal;
      l_SumNetAmount += _.round(
        l_SubTotal -
          (preBillInfo.InvoiceConfigs[0].CalcTaxBeforeDiscOrAfterDisc === "A"
            ? 0
            : l_discValue) +
          l_TaxAmount +
          formData.DeliveryCharges +
          formData.ContainerCharges,
        3
      );

      // console.log(
      //   "Hari test",
      //   row,
      //   preBillInfo,
      //   l_TaxAmount,
      //   l_TaxExclusionAmount,
      //   l_discValue,
      //   l_SumNetAmount,
      //   l_TaxAmount,
      //   "ssss",
      //   l_SubTotal,
      //   l_discValue,
      //   l_TaxAmount,
      //   formData.DeliveryCharges,
      //   formData.ContainerCharges
      // );
      // console.log('before round off',l_SumNetAmount,l_RoundOffAmount)
      l_RoundOffAmount = _.round(
        _.round(l_SumNetAmount, 0) - l_SumNetAmount,
        3
      );
      // console.log('after round off',l_SumNetAmount,l_RoundOffAmount)
      /*
      TaxInclusiveOrExclusive:
        preBillInfo.InvoiceConfigs[0].TaxInclusiveOrExclusive,
      TaxBeforeDiscountOrTaxAfterDiscount:
        preBillInfo.InvoiceConfigs[0].CalcTaxBeforeDiscOrAfterDisc,

      */

      tempBillData.push({
        CompCode: CompCode,
        SrNo: tempBillData.length + 1,
        ItemType: "M",
        ItemCode: row.MenuCode,
        ItemName: row.MenuDisplayName,
        ItemDesc: row.MenuDisplayDesc,
        HSNSACCode: row.HSNSACCode,
        TaxCode: row.TaxCode,
        UnitCode: "NOS",
        UnitName: "NOS",
        Qty: row.Qty,
        Rate: row.MenuSumRate,
        Disc: l_discValue,
        Amount: l_SubTotal,
        SGST: l_SGST,
        CGST: l_CGST,
        UGST: l_UTGST,
        IGST: l_IGST,
        Surcharge: l_Surcharge,
        Cess: l_Cess,
        SysOption1: row.KOTId,
        SysOption2: row.Id,
        SysOption3: "",
        SysOption4: preBillInfo.InvoiceConfigs[0].TaxInclusiveOrExclusive,
        SysOption5: preBillInfo.InvoiceConfigs[0].CalcTaxBeforeDiscOrAfterDisc,
        UpdtUsr: loginInfo.username,
      });
    });

    setFormData({
      ...formData,
      SubTotal: l_SumSubTotal,
      Qty: l_SumOfQty,
      Discount: l_SumDiscValue,
      RoundOff: l_RoundOffAmount,
      Tax: l_SumOfTaxAmount,
      NetPayable:
        l_SumSubTotal -
        (preBillInfo.InvoiceConfigs[0].CalcTaxBeforeDiscOrAfterDisc === "A"
          ? 0
          : l_SumDiscValue) +
        l_SumOfTaxAmount +
        formData.DeliveryCharges +
        formData.ContainerCharges +
        formData.Tip +
        l_RoundOffAmount,
      BillAmount:
        l_SumSubTotal -
        (preBillInfo.InvoiceConfigs[0].CalcTaxBeforeDiscOrAfterDisc === "A"
          ? 0
          : l_SumDiscValue) +
        l_SumOfTaxAmount +
        formData.DeliveryCharges +
        formData.ContainerCharges +
        l_RoundOffAmount,
      TaxInclusiveOrExclusive:
        preBillInfo.InvoiceConfigs[0].TaxInclusiveOrExclusive,
      TaxBeforeDiscountOrTaxAfterDiscount:
        preBillInfo.InvoiceConfigs[0].CalcTaxBeforeDiscOrAfterDisc,
    });
    if (formData.ContainerCharges > 0) {
      tempBillData.push({
        CompCode: CompCode,
        SrNo: tempBillData.length + 1,
        ItemType: "V",
        ItemCode: "#CNTR",
        ItemName: "Container Charges",
        ItemDesc: "",
        HSNSACCode: "",
        TaxCode: "",
        UnitCode: "NOS",
        UnitName: "NOS",
        Qty: 0,
        Rate: formData.ContainerCharges,
        Disc: 0,
        Amount: formData.ContainerCharges,
        SGST: 0,
        CGST: 0,
        UGST: 0,
        IGST: 0,
        Surcharge: 0,
        Cess: 0,
        SysOption1: "",
        SysOption2: "",
        SysOption3: "",
        SysOption4: "",
        SysOption5: "",
        UpdtUsr: loginInfo.username,
      });
    }

    if (formData.DeliveryCharges > 0) {
      tempBillData.push({
        CompCode: CompCode,
        SrNo: tempBillData.length + 1,
        ItemType: "V",
        ItemCode: "#DLR",
        ItemName: "Delivery Charges",
        ItemDesc: "",
        HSNSACCode: "",
        TaxCode: "",
        UnitCode: "NOS",
        UnitName: "NOS",
        Qty: 0,
        Rate: formData.DeliveryCharges,
        Disc: 0,
        Amount: formData.DeliveryCharges,
        SGST: 0,
        CGST: 0,
        UGST: 0,
        IGST: 0,
        Surcharge: 0,
        Cess: 0,
        SysOption1: "",
        SysOption2: "",
        SysOption3: "",
        SysOption4: "",
        SysOption5: "",
        UpdtUsr: loginInfo.username,
      });
    }

    setBillData(tempBillData);
    // resolve([tempBillData, tempFormData]);
  };

  const dispatch = useDispatch();

  return (
    <div>
      <div
        className="void-bill-header"
        style={{
          padding: "6px 15px 5px 15px",
          borderBottom: "1px solid #cecece",
        }}
      >
        <span style={{ fontWeight: "600", fontSize: 16 }}>Bill Save </span>
      </div>
      <div>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <div style={{ padding: "0px 0px 5px", fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ padding: "5px 15px", fontWeight: "600" }}>
                  Bill Amount
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "end",
                    padding: "5px 15px",
                    fontWeight: "600",
                  }}
                >
                  Quantity- {formData.Qty}
                </div>
                <div
                  style={{
                    padding: "5px 25px 5px 15px",
                    flex: 0.24,
                    textAlign: "end",
                    fontWeight: "600",
                  }}
                >
                  {formData.BillAmount.toFixed(2)}
                </div>
              </div>
              <Divider style={{ margin: 0, borderColor: "#cecece" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ padding: "5px 15px", fontWeight: "600", flex: 1 }}
                >
                  Sub Total
                </div>
                <div
                  style={{
                    padding: "5px 25px 5px 15px",
                    flex: 0.2,
                    textAlign: "end",
                    fontWeight: "600",
                  }}
                >
                  {formData.SubTotal.toFixed(2)}
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}
                >
                  {`Discount ${
                    formData.TaxBeforeDiscountOrTaxAfterDiscount === "B"
                      ? "Before Tax"
                      : "After Tax"
                  }`}
                </div>
                <div
                  style={{
                    padding: "5px 25px 5px 15px",
                    flex: 0.2,
                    textAlign: "end",
                  }}
                >
                  ({formData.Discount.toFixed(2)})
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    padding: "2px 15px",
                    flex: 1,
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Delivery Charges
                </div>
                <div
                  style={{ padding: "2px 15px", flex: 0.2, textAlign: "end" }}
                >
                  <InputNumber
                    className="bill-input"
                    onChange={(value) => {
                      setFormData({
                        ...formData,
                        DeliveryCharges: value ? (isNaN(value) ? 0 : value) : 0,
                      });
                    }}
                    value={formData.DeliveryCharges.toFixed(2)}
                    // defaultValue={0}
                  />
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    padding: "2px 15px",
                    flex: 1,
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <RedoOutlined
                    style={{ marginRight: 5, transform: "rotate(240deg)" }}
                  />
                  Container Charges
                </div>
                <div
                  style={{ padding: "2px 15px", flex: 0.2, textAlign: "end" }}
                >
                  <InputNumber
                    className="bill-input"
                    onChange={(value) => {
                      setFormData({
                        ...formData,
                        ContainerCharges: value
                          ? isNaN(value)
                            ? 0
                            : value
                          : 0,
                      });
                    }}
                    value={formData.ContainerCharges.toFixed(2)}
                  />
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}
                >
                  {`Tax ${
                    formData.TaxInclusiveOrExclusive === "E"
                      ? "Exclusive"
                      : "Inclusive"
                  }`}
                </div>
                <div
                  style={{
                    padding: "5px 25px 5px 15px",
                    flex: 0.2,
                    textAlign: "end",
                  }}
                >
                  {formData.Tax.toFixed(2)}
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}
                >
                  Round Off
                </div>
                <div
                  style={{
                    padding: "5px 25px 5px 15px",
                    flex: 0.2,
                    textAlign: "end",
                  }}
                >
                  {formData.RoundOff.toFixed(2)}
                </div>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    padding: "2px 15px",
                    flex: 1,
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Tip
                </div>
                <div
                  style={{ padding: "2px 15px", flex: 0.2, textAlign: "end" }}
                >
                  <InputNumber
                    className="bill-input"
                    onChange={(value) => {
                      setFormData({
                        ...formData,
                        Tip: value ? (isNaN(value) ? 0 : value) : 0,
                      });
                    }}
                    value={formData.Tip.toFixed(2)}
                  />
                </div>
              </div>{" "}
              <Divider style={{ margin: 0, borderColor: "#cecece" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}
                >
                  Net Payable
                </div>
                <div
                  style={{
                    padding: "5px 25px 5px 15px",
                    flex: 0.2,
                    textAlign: "end",
                    fontWeight: "600",
                  }}
                >
                  {formData.NetPayable.toFixed(2)}
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#f1f1f1",
                padding: "4px 15px",
                fontWeight: "500",
                border: "1px solid #cbcbcb",
                borderWidth: "1px 0px",
              }}
            >
              Settle Bill
            </div>
            <div
              style={{
                display: "flex",
                margin: "5px 0px",
                flexWrap: "wrap",
                padding: "4px 15px",
              }}
            >
              {paymentMode
                .sort((a, b) => (a.key > b.key ? 1 : -1))
                .map((pp) => {
                  // console.log(pp, "pp");
                  return (
                    <div key={pp.PayCode} style={{ marginRight: 5 }}>
                      <AmountInputComponent
                        title={pp.PayDesc}
                        data={pp}
                        onCheckChange={(e, props) => {
                          let tempData = paymentMode.find(
                            (aa) => aa.PayCode === props.data.PayCode
                          );
                          tempData.IsChecked = e.target.checked;
                          setPaymentMode([
                            ...paymentMode.filter(
                              (aa) => aa.PayCode !== tempData.PayCode
                            ),
                            tempData,
                          ]);
                        }}
                        onValueChange={(val, props, checked) => {
                          let tempData = paymentMode.find(
                            (aa) => aa.PayCode === props.data.PayCode
                          );
                          tempData.IsChecked = checked;
                          tempData.Amount = val;
                          tempData.isDirty = true;
                          setPaymentMode([
                            ...paymentMode.filter(
                              (aa) => aa.PayCode !== tempData.PayCode
                            ),
                            tempData,
                          ]);
                          // console.log(val, props, checked, "value");
                        }}
                      />
                    </div>
                  );
                })}
            </div>
            <div
              style={{
                backgroundColor: "#f1f1f1",
                padding: "4px 20px",
                textAlign: "end",
                border: "1px solid #cbcbcb",
                borderWidth: "1px 0px",
              }}
            >
              Paid Amount:{" "}
              <span
                style={{
                  fontWeight: "500",
                }}
              >
                {currency.value1} {paidAmount}
              </span>
            </div>
            <div style={{ padding: 4, textAlign: "end" }}>
              <div style={{ display: "inline-block" }}>
                <Button
                  //   disabled={
                  //     !InvoiceDtl.filter(
                  //       (ii) => ii.IsChecked === "Y" && ii.IsDeleted === "N"
                  //     ).length > 0
                  //   }
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={async () => {
                    setSaveLoading(true);
                    // props.onBackPress();
                    // props.OnBillSaveClick();
                    let tempData = paymentMode.filter(
                      (ii) => ii.isDirty === true && ii.IsChecked === true
                    );

                    let tempTotalAmount = 0;
                    await tempData.forEach((row) => {
                      tempTotalAmount += row.Amount;
                    });
                    if (
                      tempTotalAmount >
                      parseInt(_.round(formData.NetPayable, 2))
                    ) {
                      message.error("Please re-check your amount");
                      setSaveLoading(false);
                      //   setDisableSave(false);
                    } else {
                      if (
                        tempTotalAmount <
                        parseInt(_.round(formData.NetPayable, 2))
                        //  &&
                        // props.customerForm.customer.userId === null
                      ) {
                        message.error("Please Check Your Amount");
                        // message.error(
                        //   "Please Check Your Amount or No Customer Is selected"
                        // );
                        setSaveLoading(false);
                        // setDisableSave(false);
                      } else {
                        fetchSequenceNextVal(
                          CompCode,
                          "INV",
                          loginInfo.username
                        ).then((seqNextVal) => {
                          let CustId, CustAddressId;

                          try {
                            if (
                              preBillInfo.KOTs[
                                preBillInfo.KOTs.length - 1
                              ].SysOption1.split("~").length === 2
                            ) {
                              CustId = parseInt(
                                preBillInfo.KOTs[
                                  preBillInfo.KOTs.length - 1
                                ].SysOption1.split("~")[0]
                              );
                              CustAddressId = parseInt(
                                preBillInfo.KOTs[
                                  preBillInfo.KOTs.length - 1
                                ].SysOption1.split("~")[1]
                              );
                            } else if (
                              preBillInfo.KOTs[
                                preBillInfo.KOTs.length - 1
                              ].SysOption1.split("~").length === 1
                            ) {
                              CustId = parseInt(
                                preBillInfo.KOTs[
                                  preBillInfo.KOTs.length - 1
                                ].SysOption1.split("~")[0]
                              );
                              CustAddressId = null;
                            } else {
                              CustId = null;
                              CustAddressId = null;
                            }
                          } catch (eee) {}
                          let InvoiceHdr = {
                            InvoiceNo: seqNextVal[0].NextVal,
                            InvoiceDate: moment(
                              preBillInfo.InvoiceConfigs[0].SysTranDate
                            ).format("YYYY-MM-DD"),
                            CompCode:
                              preBillInfo.KOTs[preBillInfo.KOTs.length - 1]
                                .CompCode,
                            BranchCode:
                              preBillInfo.KOTs[preBillInfo.KOTs.length - 1]
                                .BranchCode,
                            CustId: CustId ? CustId : null,
                            CustAddressId: CustAddressId ? CustAddressId : null,
                            SysOption1:
                              preBillInfo.KOTs[preBillInfo.KOTs.length - 1]
                                .TableNo,
                            SysOption2:
                              preBillInfo.KOTs[preBillInfo.KOTs.length - 1]
                                .KOTId,
                            SysOption3:
                              preBillInfo.KOTs[preBillInfo.KOTs.length - 1]
                                .DeptCode,
                            SysOption4:
                              preBillInfo.KOTs[preBillInfo.KOTs.length - 1]
                                .OrderType,
                            SysOption5: "",
                            InvoiceRemark: "",
                            GrossAmount:
                              formData.SubTotal +
                              formData.ContainerCharges +
                              formData.DeliveryCharges +
                              (preBillInfo.InvoiceConfigs[0]
                                .CalcTaxBeforeDiscOrAfterDisc === "A"
                                ? formData.Discount
                                : 0),
                            DiscAmount: formData.Discount,
                            TaxAmount: formData.Tax,
                            RoundOff: formData.RoundOff,
                            // AddCharges:formData.ContainerCharges,
                            InvoiceAmount: formData.NetPayable,
                            SettlementAmount: 0,
                            UpdtUsr: loginInfo.username,
                          };
                          SaveInvoice(CompCode, InvoiceHdr, billData).then(
                            async (res1) => {
                              preBillInfo.KOTs.forEach((row) => {
                                let data = {
                                  pKOIId: row.KOTId,
                                  pInvoiceId: res1.data.data.InvoiceId,
                                  pInvoiceNo: res1.data.data.invoiceNo,
                                  pInvoiceDate: moment(
                                    res1.data.data.InvoiceDate
                                  ).format("YYYY-MM-DD"),
                                  pUpdtUsr: loginInfo.username,
                                };
                                updtPOSKOTInvoiceInfo(data);
                              });
                              let dataType = "pdf";
                              if (window.electron) {
                                dataType = "html";
                              }
                              getInvoicePdf(
                                CompCode,
                                props.printData,
                                res1.data.data.InvoiceId,
                                dataType
                              ).then((res) => {
                                if (res) {
                                  PrintPdfOrFromElectron(
                                    res,
                                    `${res1.data.data.invoiceNo}`,
                                    dataType
                                  );
                                }
                                let tempData = {
                                  InvoiceId: res1.data.data.InvoiceId,
                                };

                                let kotData = {
                                  KOTId: [
                                    preBillInfo.KOTs[
                                      preBillInfo.KOTs.length - 1
                                    ].KOTId,
                                  ],
                                  KOTStatus: "PND",
                                  UpdtUsr: loginInfo.username,
                                };
                                uptRestarantPosKOTHdrStatus(
                                  CompCode,
                                  kotData
                                ).then((res) => {
                                  // props.OnBillSaveClick();
                                  getInvoiceHdr(
                                    CompCode,
                                    res1.data.data.InvoiceId
                                  ).then(async (invoiceHdr) => {
                                    //   setInvoiceHdr(iHdr);
                                    //   console.log(iHdr, "invoice dta");
                                    setTableCalc({
                                      ...tableCalc,
                                      dueAmount: invoiceHdr[0].InvoiceAmount,
                                    });
                                    let Dtldata = [];

                                    // const data = {
                                    //   TranType: "RCPT",
                                    //   updt_usr: loginInfo.username,
                                    // };
                                    fetchSequenceNextVal(
                                      CompCode,
                                      "RCPT",
                                      loginInfo.username
                                    ).then((res) => {
                                      let dtl = [];
                                      let totalAmount = 0;
                                      paymentMode
                                        .filter(
                                          (ii) =>
                                            ii.isDirty === true &&
                                            ii.IsChecked === true
                                        )
                                        .map((ii) => {
                                          totalAmount += parseInt(ii.Amount);
                                          return dtl.push({
                                            Id: 0,
                                            PaymentMode: ii.PayCode,
                                            Amount: ii.Amount,
                                            Remark: null,
                                            SysOption1: null,
                                            SysOption2: null,
                                            SysOption3: null,
                                            SysOption4: null,
                                            SysOption5: null,
                                          });
                                        });
                                      Dtldata = {
                                        Hdr: {
                                          ReceiptId: 0,
                                          ReceiptType: "CUST",
                                          Value1:
                                            invoiceHdr[0].CustId !== null
                                              ? invoiceHdr[0].CustId
                                              : 0,
                                          Value2: "",
                                          Value3: "",
                                          Value4: "",
                                          Value5: "",
                                          ReceiptDate: moment().format(
                                            "YYYY-MM-DD"
                                          ),
                                          ReceiptNo: res[0].NextVal,
                                          Amount: invoiceHdr[0].InvoiceAmount,
                                          BalAmount:
                                            invoiceHdr[0].InvoiceAmount -
                                            totalAmount,
                                          Remark: `#AUTO-RCPT-GENERATED againts POS-BILL-NO #${invoiceHdr[0].InvoiceNo}`,
                                          updt_usr: loginInfo.username,
                                        },
                                        updt_usr: loginInfo.username,
                                      };

                                      InsUpdtRcptService(
                                        CompCode,
                                        Dtldata.Hdr,
                                        dtl
                                      ).then(() => {
                                        getRecieptHdrPOS(
                                          CompCode,
                                          res[0].NextVal
                                        ).then((recpt) => {
                                          let param = {
                                            CompCode: CompCode,
                                            InvoiceId: invoiceHdr[0].InvoiceId,
                                            Amount: totalAmount,
                                            ReceiptId: recpt[0].ReceiptId,
                                            SettlementDate: moment().format(
                                              "YYYY-MM-DD"
                                            ),
                                            SettlementType: "INVOICE",
                                            AdjTranNo: invoiceHdr[0].InvoiceId,
                                            AdjTranDate: moment(
                                              invoiceHdr[0].InvoiceDate
                                            ).format("YYYY-MM-DD"),
                                            Amount: totalAmount,
                                            SettlementRemark: null,
                                            updt_usr: loginInfo.username,
                                          };

                                          updtPosInvoiceSettlementAmount(
                                            param
                                          ).then((res) => {
                                            let kotData = {
                                              KOTId: [props.comp.data.KOTId],
                                              KOTStatus: "CMP",
                                              UpdtUsr: loginInfo.username,
                                            };

                                            uptRestarantPosKOTHdrStatus(
                                              CompCode,
                                              kotData
                                            )
                                              .then((res) => {
                                                uptRestarantPosKOTdtlStatus(
                                                  CompCode,
                                                  kotData
                                                ).catch((err) => {
                                                  setSaveLoading(false);
                                                  // setDisableSave(false);
                                                });
                                              })
                                              .catch((err) => {
                                                setSaveLoading(false);
                                                // setDisableSave(false);
                                                console.error(err);
                                              });
                                            setSaveLoading(false);
                                            // setDisableSave(false);
                                            props.onBackPress();
                                            props.onSavePress();
                                            // props.refreshScreen();
                                            //   setshowFormType("SETTLE");
                                            return res;
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });

                              //   setshowFormType("SETTLE");
                            }
                          );
                        });
                      }
                    }
                  }}
                  // console.log("onsave chamge", billData);

                  // console.log(seq);

                  loading={saveLoading}
                  disabled={saveLoading}
                >
                  Save
                </Button>
              </div>
              <div style={{ display: "inline-block" }}>
                <Button
                  onClick={() => {
                    props.onBackPress();
                  }}
                  icon={<CloseOutlined />}
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CounterSaleBillSave;
