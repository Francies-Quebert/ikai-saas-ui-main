import React from "react";
import { Row, Col, Button, Input, Radio, Divider, InputNumber } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  fetchPrepareInvoiceDataRestaurant,
  updtPOSKOTInvoiceInfo,
  saveTableStatus,
  raiseEvent,
  uptRestarantPosKOTHdrStatus,
  getRestaurantInvoicePdf,
} from "../../../../../services/restaurant-pos";
import {
  SaveInvoice,
  getInvoicePdf,
} from "../../../../../services/service-managment/service-management";
import {
  fetchSequenceNextVal,
  PrintPdfOrFromElectron,
} from "../../../../../shared/utility";
import _ from "lodash";
import moment from "moment";
import { useSelector } from "react-redux";
import fileDownload from "js-file-download";
import swal from "sweetalert";

const BillSettlementComponent = (props) => {
  const [subTotal, setSubTotal] = useState({ quantity: 0, amount: 0 });
  const [discount, setDiscount] = useState(0);
  const l_LoginUserInfo = useSelector((state) => state.LoginReducer.userData);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [preBillInfo, setPreBillInfo] = useState();
  const [saveLoading, setSaveLoading] = useState(false);
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
  const [billData, setBillData] = useState([]);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  // const [billDataDtl, setBillDataDtl] = useState();
  // useEffect(() => {
  //   let quantity = 0;
  //   let amount = 0;
  //   props.menu.map((ii) => {
  //     quantity += ii.Qty;
  //     amount += ii.Amount;
  //     return setSubTotal({ ...subTotal, quantity: quantity, amount: amount });
  //   });

  //   let discount = 0;
  //   if (props.discount.type === "P") {
  //     discount = (subTotal.amount / 100) * props.discount.discountAmount;
  //   } else {
  //     discount = props.discount.discountAmount;
  //   }
  //   setDiscount(discount);
  // }, []);

  // useEffect(() => {
  //   setDiscount((subTotal.amount / 100) * props.discount.discountAmount);
  // }, [subTotal.amount]);
  useEffect(() => {
    if (
      props.EntryMode.EntryType === "PICKUP" &&
      props.customerForm.customer.userId === null
    ) {
      props.onBackPress();
      swal({
        title: "Customer Not Selected",
        icon: "warning",
        dangerMode: true,
        // dangerMode: true,
      });
    } else if (
      props.EntryMode.EntryType === "DELIVERY" &&
      props.customerForm.customer.userId === null
    ) {
      props.onBackPress();
      swal({
        title: "Customer Not Selected",
        icon: "warning",
        dangerMode: true,
        // dangerMode: true,
      });
    } else if (
      props.EntryMode.EntryType === "DELIVERY" &&
      props.customerForm.customer.address.length <= 0
    ) {
      props.onBackPress();
      swal({
        title: "Customer Address Not Selected",
        icon: "warning",
        dangerMode: true,
        // dangerMode: true,
      });
    } else {
      fetchPrepareInvoiceDataRestaurant(
        CompCode,
        BranchConfigs.value1,
        props.EntryMode.EntryType,
        props.EntryMode.TableInfo ? props.EntryMode.TableInfo.TableCode : null,
        props.lastKOTId
      ).then((PreBillInfo) => {
        console.log(PreBillInfo);
        setPreBillInfo(PreBillInfo);
      });
    }
  }, []);

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
    preBillInfo.KOTDTLs.filter(
      (fil) => !_.includes(["RJCT", "CNL"], fil.ItemStatus)
    ).forEach((row) => {
      l_SumOfNetAmount += parseFloat(row.Amount);
      l_SumOfQty += parseFloat(row.Qty);
    });

    preBillInfo.KOTDTLs.filter(
      (fil) => !_.includes(["RJCT", "CNL"], fil.ItemStatus)
    ).forEach((row) => {
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
        UpdtUsr: l_LoginUserInfo.username,
        CompCode: CompCode,
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
        UpdtUsr: l_LoginUserInfo.username,
        CompCode: CompCode,
      });
    }

    if (formData.DeliveryCharges > 0) {
      tempBillData.push({
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
        UpdtUsr: l_LoginUserInfo.username,
        CompCode: CompCode,
      });
    }

    setBillData(tempBillData);
  };

  return (
    <div style={{ padding: "0px 15px 5px", fontSize: 14 }}>
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
        <div style={{ padding: "5px 15px", fontWeight: "600", flex: 1 }}>
          Sub Total
        </div>
        {/* <div
          style={{
            flex: 1,
            textAlign: "end",
            padding: "5px 15px",
            fontWeight: "600",
          }}
        >
          Quantity- {formData.Qty}
        </div> */}
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
        <div style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}>
          {`Discount ${
            formData.TaxBeforeDiscountOrTaxAfterDiscount === "B"
              ? "Before Tax"
              : "After Tax"
          }`}
        </div>
        <div
          style={{ padding: "5px 25px 5px 15px", flex: 0.2, textAlign: "end" }}
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
        <div style={{ padding: "2px 15px", flex: 0.2, textAlign: "end" }}>
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
        <div style={{ padding: "2px 15px", flex: 0.2, textAlign: "end" }}>
          <InputNumber
            className="bill-input"
            onChange={(value) => {
              setFormData({
                ...formData,
                ContainerCharges: value ? (isNaN(value) ? 0 : value) : 0,
              });
            }}
            value={formData.ContainerCharges.toFixed(2)}
          />
        </div>
      </div>
      <Divider style={{ margin: 0 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}>
          {`Tax ${
            formData.TaxInclusiveOrExclusive === "E" ? "Exclusive" : "Inclusive"
          }`}
        </div>
        <div
          style={{ padding: "5px 25px 5px 15px", flex: 0.2, textAlign: "end" }}
        >
          {formData.Tax.toFixed(2)}
        </div>
      </div>
      <Divider style={{ margin: 0 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}>
          Round Off
        </div>
        <div
          style={{ padding: "5px 25px 5px 15px", flex: 0.2, textAlign: "end" }}
        >
          {formData.RoundOff.toFixed(2)}
        </div>
      </div>
      {/* <Divider style={{ margin: 0 }} /> */}
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            padding: "2px 15px",
            flex: 1,
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
          }}
        >
          Customer Paid
        </div>
        <div style={{ padding: "2px 15px", flex: 0.2, textAlign: "end" }}>
          <InputNumber
            className="bill-input"
            onChange={(value) => {
            }}
            defaultValue={0}
            style={{ fontWeight: "600" }}
          />
        </div>
      </div> */}
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
        <div style={{ padding: "2px 15px", flex: 0.2, textAlign: "end" }}>
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
        <div style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}>
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
      {/* <Divider style={{ margin: 0 }} /> */}
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ padding: "5px 15px", flex: 1, fontWeight: "600" }}>
          Return to Customer
        </div>
        <div
          style={{
            padding: "5px 25px 5px 15px",
            flex: 0.2,
            textAlign: "end",
            fontWeight: "600",
          }}
        >
          0
        </div>
      </div> */}
      <Divider style={{ margin: "5px 0px 7px", borderColor: "#cecece" }} />
      <div
        style={{
          justifyContent: "flex-end",
          display: "flex",
          paddingRight: 15,
        }}
      >
        <div style={{ padding: "0px 7px" }}>
          <Button
            type="default"
            onClick={() => {
              props.onBackPress();
            }}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            style={{ fontSize: 12 }}
            onClick={() => {
              setSaveLoading(true);
              // props.onBackPress();
              // props.OnBillSaveClick();
              fetchSequenceNextVal(
                CompCode,
                "INV",
                l_LoginUserInfo.username
              ).then((seqNextVal) => {
                let CustId, CustAddressId;
                console.log(seqNextVal, "seqNextVal");
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
                    preBillInfo.KOTs[preBillInfo.KOTs.length - 1].CompCode,
                  BranchCode:
                    preBillInfo.KOTs[preBillInfo.KOTs.length - 1].BranchCode,
                  CustId: CustId,
                  CustAddressId: CustAddressId,
                  SysOption1:
                    preBillInfo.KOTs[preBillInfo.KOTs.length - 1].TableNo,
                  SysOption2:
                    preBillInfo.KOTs[preBillInfo.KOTs.length - 1].KOTId,
                  SysOption3:
                    preBillInfo.KOTs[preBillInfo.KOTs.length - 1].DeptCode,
                  SysOption4:
                    preBillInfo.KOTs[preBillInfo.KOTs.length - 1].OrderType,
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
                  UpdtUsr: l_LoginUserInfo.username,
                };

                SaveInvoice(CompCode, InvoiceHdr, billData).then(
                  async (res1) => {
                    preBillInfo.KOTs.forEach((row) => {
                      let data = {
                        pKOIId: row.KOTId,
                        pInvoiceId: res1.data.data.InvoiceId,
                        pInvoiceNo: res1.data.data.invoiceNo,
                        pInvoiceDate: moment(res1.data.data.InvoiceDate).format(
                          "YYYY-MM-DD"
                        ),
                        pUpdtUsr: l_LoginUserInfo.username,
                        CompCode: CompCode,
                      };
                      updtPOSKOTInvoiceInfo(data);
                    });
                    let dataType = "pdf";
                    if (window.electron) {
                      dataType = "html";
                    }

                    getRestaurantInvoicePdf(
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

                      if (props.EntryMode.EntryType === "DINEIN") {
                        raiseEvent(CompCode, "DIINVSAVE", tempData);
                        if (props.EntryMode.TableInfo) {
                          let dataTableStatus = {
                            data: {
                              ...props.EntryMode.TableInfo,
                              CompCode: CompCode,
                              BranchCode: BranchConfigs.value1,
                              DeptCode: props.EntryMode.EntryType,
                              TableType:
                                props.EntryMode.TableInfo &&
                                props.EntryMode.TableInfo.TableType
                                  ? props.EntryMode.TableInfo.TableType
                                  : "REG",
                              TableSec: props.EntryMode.TableInfo
                                ? props.EntryMode.TableInfo.SecCode
                                : null,
                              TableCode: props.EntryMode.TableInfo
                                ? props.EntryMode.TableInfo.TableCode
                                : null,
                              TableName: props.EntryMode.TableInfo
                                ? props.EntryMode.TableInfo.TableName
                                : null,
                              ParentTableCodes: props.EntryMode.TableInfo
                                ? props.EntryMode.TableInfo.ParentTableCodes
                                : null,
                              SysOption1: `${
                                props.customerForm.customer.userId
                                  ? props.customerForm.customer.userId
                                  : ""
                              }${
                                props.customerForm.customer.address &&
                                props.customerForm.customer.address.length > 0
                                  ? "~" + props.customerForm.customer.address[0]
                                  : ""
                              }`,
                              SysOption2:
                                props.selectedNoOfPerson &&
                                props.selectedNoOfPerson !== ""
                                  ? props.selectedNoOfPerson
                                  : 0,
                              SysOption3: props.selectedCaptain
                                ? props.selectedCaptain
                                : null,
                              SysOption4: `${props.discount.reason}~${props.discount.type}~${props.discount.discountAmount}~${props.discount.couponCode}`,
                              SysOption5: "",
                              Status: "PRINTED",
                              Remark: "",
                              IsActive: true,
                              UpdtUsr: l_LoginUserInfo.username,
                            },
                          };

                          saveTableStatus(CompCode, dataTableStatus)
                            .then((res) => {
                              setSaveLoading(false);
                              props.OnBillSaveClick();
                              return res;

                              // console.log("save response table status", res);
                            })
                            .catch((err) => console.log(err));
                        }
                      } else if (props.EntryMode.EntryType === "PICKUP") {
                        let kotData = {
                          KOTId: [
                            preBillInfo.KOTs[preBillInfo.KOTs.length - 1].KOTId,
                          ],
                          KOTStatus: "PND",
                          UpdtUsr: l_LoginUserInfo.username,
                        };
                        uptRestarantPosKOTHdrStatus(CompCode, kotData).then(
                          (res) => {
                            setSaveLoading(false);
                            props.OnBillSaveClick();
                          }
                        );
                        raiseEvent(CompCode, "PUINVSAVE", tempData);
                      } else if (props.EntryMode.EntryType === "DELIVERY") {
                        let kotData = {
                          KOTId: [
                            preBillInfo.KOTs[preBillInfo.KOTs.length - 1].KOTId,
                          ],
                          KOTStatus: "PND",
                          UpdtUsr: l_LoginUserInfo.username,
                        };
                        uptRestarantPosKOTHdrStatus(CompCode, kotData).then(
                          (res) => {
                            setSaveLoading(false);
                            props.OnBillSaveClick();
                          }
                        );
                        raiseEvent(CompCode, "HDINVSAVE", tempData);
                      }
                    });
                  }
                );

                // console.log("onsave chamge", billData);
              });
            }}
            loading={saveLoading}
            disabled={saveLoading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillSettlementComponent;
