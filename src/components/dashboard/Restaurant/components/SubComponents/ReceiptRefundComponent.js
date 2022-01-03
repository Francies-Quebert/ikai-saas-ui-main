import {
  CloseOutlined,
  DeleteTwoTone,
  FileAddOutlined,
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
import CheckboxGroup from "antd/lib/checkbox/Group";
import AmountInputComponent from "./AmountInputComponent";
import {
  fetchSequenceNextVal,
  sysGenCode,
} from "../../../../../shared/utility";
import {
  InsUpdtRefund,
  InsUpdtRefundService,
} from "../../../../../services/reciept-refund";
import {
  InsRcptSettlement,
  UpdateReceiptSettlementAmount,
} from "../../../../../services/reciept";
const ReceiptRefundComponent = (props) => {
  const [paymentMode, setPaymentMode] = useState([]);
  const [InvoiceDtl, setInvoiceDtl] = useState([]);
  const [InvoiceHdr, setInvoiceHdr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returnSummary, setReturnSummary] = useState({
    SubTotal: 0,
    Qty: 0,
    Disc: 0,
    TaxAmount: 0,
    RoundOff: 0,
    NetPayable: 0,
  });
  const [finalBillSummary, setFinalBillSummary] = useState({
    SubTotal: 0,
    Qty: 0,
    Disc: 0,
    TaxAmount: 0,
    RoundOff: 0,
    NetPayable: 0,
  });
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const appconfigs = useSelector((state) => state.AppMain.appconfigs);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const sysConfig = useSelector((state) => state.AppMain.sysSequenceConfig);
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const columns = [
    {
      title: "Sr No",
      dataIndex: "SrNo",
      align: "center",
      width: "50px",
    },

    {
      title: "Item Name",
      dataIndex: "ItemName",
    },
    {
      title: "Item Code",
      dataIndex: "ItemCode",
      align: "center",
    },
    {
      title: "Qty",
      dataIndex: "Qty",
      align: "center",
      width: 80,
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      align: "center",
      width: 80,
    },
    {
      title: "Discount",
      dataIndex: "Disc",
      align: "center",
      width: 80,
    },
    {
      title: "Tax Amount",
      width: 90,
      render: (value, row, index) => {
        let tempTaxAmount = 0.0;
        tempTaxAmount += parseFloat(row.CGST);
        tempTaxAmount += parseFloat(row.IGST);
        tempTaxAmount += parseFloat(row.SGST);
        tempTaxAmount += parseFloat(row.UGST);
        tempTaxAmount += parseFloat(row.Cess);
        tempTaxAmount += parseFloat(row.Surcharge);
        return tempTaxAmount.toFixed(2);
      },
      align: "right",
    },
    {
      title: "Amount",
      width: 90,
      dataIndex: "Amount",
      align: "right",
    },
  ];
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
    getRestaurantInvoiceDtl(CompCode, props.InvoiceId).then((res) => {
      getInvoiceHdr(CompCode, props.InvoiceId).then(async (res1) => {
        let tempInvDtl = [];
        await res.forEach((element, index) => {
          tempInvDtl.push({
            ...element,
            IsDeleted: "N",
            IsChecked: "N",
            key: index,
          });
        });
        // console.log(res1, "invoice HDR");
        setInvoiceDtl(tempInvDtl);
        setInvoiceHdr(res1);
        onRowSelectChange(tempInvDtl, res1);
        setLoading(false);
      });
    });
  }, []);

  const dispatch = useDispatch();

  const onRowSelectChange = (pInvoiceDtl, pInvoiceHdr) => {
    //Cal Return Summary
    let l_R_Qty = 0;
    let l_R_SubTotal = 0;
    let l_R_Tax = 0;
    let l_R_Disc = 0;
    let l_R_RoundOff = 0;
    let l_R_NetPayable = 0;
    let l_F_Qty = 0;
    let l_F_SubTotal = 0;
    let l_F_Tax = 0;
    let l_F_Disc = 0;
    let l_F_RoundOff = 0;
    let l_F_NetPayable = 0;
    pInvoiceDtl.forEach((item) => {
      if (item.IsChecked === "Y") {
        l_R_Qty += parseFloat(item.Qty);
        l_R_SubTotal +=
          parseFloat(item.Amount) +
          (item.SysOption5 === "B" ? 0 : parseFloat(item.Disc));
        l_R_Disc += parseFloat(item.Disc);
        l_R_Tax +=
          parseFloat(item.CGST) +
          parseFloat(item.SGST) +
          parseFloat(item.UGST) +
          parseFloat(item.IGST) +
          parseFloat(item.Cess) +
          parseFloat(item.Surcharge);
        l_R_RoundOff += 0;
        l_R_NetPayable = l_R_SubTotal - l_R_Disc + l_R_Tax;
        // l_R_NetPayable+=
        setReturnSummary({
          SubTotal: l_R_SubTotal,
          Qty: l_R_Qty,
          Disc: l_R_Disc,
          TaxAmount: l_R_Tax,
          RoundOff: l_R_RoundOff,
          NetPayable: l_R_NetPayable,
        });
      } else {
        setReturnSummary({
          SubTotal: l_R_SubTotal,
          Qty: l_R_Qty,
          Disc: l_R_Disc,
          TaxAmount: l_R_Tax,
          RoundOff: l_R_RoundOff,
          NetPayable: l_R_NetPayable,
        });
        l_F_Qty += parseFloat(item.Qty);
      }
    });
    l_F_SubTotal = pInvoiceHdr[0].GrossAmount - _.round(l_R_SubTotal, 3);
    // console.log(pInvoiceHdr[0].GrossAmount, _.round(l_R_SubTotal), "subTotal");
    l_F_Tax = _.round(pInvoiceHdr[0].TaxAmount - l_R_Tax, 3);
    l_F_Disc = pInvoiceHdr[0].DiscAmount - l_R_Disc;
    l_F_NetPayable = l_F_SubTotal - l_F_Disc + l_F_Tax;
    // l_F_RoundOff=
    // console.log(l_F_SubTotal, l_F_Disc, l_F_Tax, "net ");
    l_F_RoundOff = _.round(_.round(l_F_NetPayable, 0) - l_F_NetPayable, 3);
    // console.log(l_F_NetPayable, l_F_RoundOff, "net payable");
    l_F_NetPayable = l_F_NetPayable + l_F_RoundOff;
    setFinalBillSummary({
      SubTotal: l_F_SubTotal,
      Qty: l_F_Qty,
      Disc: l_F_Disc,
      TaxAmount: l_F_Tax,
      RoundOff: l_F_RoundOff,
      NetPayable: l_F_NetPayable,
    });
  };

  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      // console.log("selected");
      record.IsChecked = selected ? "Y" : "N";
      setInvoiceDtl([
        ...InvoiceDtl.filter((ii) => ii.key !== record.key),
        record,
      ]);

      onRowSelectChange(
        [...InvoiceDtl.filter((ii) => ii.key !== record.key), record],
        InvoiceHdr
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.AllowVoid === "N",
    }),
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      let tempData = [];
      InvoiceDtl.forEach((row) => {
        tempData.push({
          ...row,
          IsChecked: row.AllowVoid === "Y" && selected ? "Y" : "N",
        });
      });
      setInvoiceDtl(tempData);
      onRowSelectChange(tempData, InvoiceHdr);
    },
    selectedRowKeys: InvoiceDtl.filter(
      (dd) => dd.IsDeleted === "N" && dd.IsChecked === "Y"
    ).map((a) => a.key),
  };

  return (
    <div>
      <div
        className="void-bill-header"
        style={{
          padding: "6px 15px 5px 15px",
          borderBottom: "1px solid #cecece",
        }}
      >
        <span style={{ fontWeight: "600", fontSize: 16 }}>Void Bill </span>
      </div>
      <div>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <div style={{ padding: "4px 15px" }}>
              <Table
                dataSource={InvoiceDtl.sort((a, b) =>
                  a.key > b.key ? 1 : -1
                ).filter((id) => id.IsDeleted !== "Y")}
                columns={columns}
                bordered={true}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                rowKey={"key"}
                pagination={false}
                scroll={{
                  y:
                    InvoiceDtl.filter((id) => id.IsDeleted !== "Y").length > 5
                      ? 200
                      : "hidden",
                }}
              />

              <div
                style={{
                  border: "1px solid #cecece",
                  marginTop: 4,
                  display: "flex",
                  backgroundColor: "#fff9f0",
                }}
              >
                <div style={{ display: "inline-block", width: "50%" }}>
                  <DisplayVoidBillCalcData
                    data={returnSummary}
                    title="Return Summary"
                  />
                </div>
                <div
                  style={{
                    display: "inline-block",
                    width: "50%",
                    borderLeft: "1px solid #cecece",
                  }}
                >
                  <DisplayVoidBillFinalCalcData
                    data={finalBillSummary}
                    title="Final Bill Summary"
                  />
                </div>
              </div>
            </div>
            <div
              className="void-bill-header"
              style={{
                padding: "6px 15px 5px 15px",
                borderBottom: "1px solid #cecece",
              }}
            >
              <span style={{ fontWeight: "600", fontSize: 16 }}>
                Receipt Refund
              </span>
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
              Total Returned Amount:{" "}
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
                  disabled={
                    !InvoiceDtl.filter(
                      (ii) => ii.IsChecked === "Y" && ii.IsDeleted === "N"
                    ).length > 0
                  }
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={async () => {
                    // console.log("CLICKED");
                    let tempData = paymentMode.filter(
                      (ii) => ii.isDirty === true && ii.IsChecked === true
                    );

                    let tempTotalAmount = 0;
                    await tempData.forEach((row) => {
                      tempTotalAmount += row.Amount;
                    });
                    if (
                      tempTotalAmount >
                      parseInt(_.round(returnSummary.NetPayable, 2))
                    ) {
                      message.error("Please re-check your amount");
                    } else {
                      if (
                        tempTotalAmount <
                        parseInt(_.round(returnSummary.NetPayable, 2))
                      ) {
                        message.error("Please Check Your Amount");
                      } else {
                        let amount = 0;
                        let dtlDataSource = [];
                        paymentMode
                          .filter(
                            (bb) => bb.isDirty === true && bb.IsChecked === true
                          )
                          .forEach((pm) => {
                            amount += pm.Amount !== null ? pm.Amount : 0;
                            dtlDataSource.push({
                              Id: 0,
                              PaymentMode: pm.PayCode,
                              Amount: pm.Amount,
                              Remark: "",
                            });
                          });
                        fetchSequenceNextVal(
                          CompCode,
                          "RFND",
                          loginInfo.username
                        ).then((seq) => {
                          const val = new Refund(
                            0,
                            "CUST",
                            0,
                            "",
                            "",
                            "",
                            "",
                            moment().format("YYYY-MM-DD"),
                            seq[0].NextVal,
                            returnSummary.NetPayable,
                            props.EntryMode.TableInfo
                              ? props.EntryMode.TableInfo.SysOption5
                              : "",
                            moment().format("YYYY-MM-DD"),
                            "counter sale bill"
                          );

                          InsUpdtRefundService(
                            CompCode,
                            val,
                            dtlDataSource,
                            finalBillSummary.NetPayable,
                            false,
                            loginInfo.username
                          ).then((res) => {
                            InsRcptSettlement(CompCode, {
                              ReceiptId: props.EntryMode.TableInfo.SysOption5,
                              SettlementDate: moment().format("YYYY-MM-DD"),
                              SettlementType: "REFUND",
                              AdjTranNo: res.data.hdrRes[0][0].RefundId,
                              AdjTranDate: moment(
                                res.data.hdrRes[0][0].crt_dttm
                              ).format("YYYY-MM-DD"),
                              Amount: returnSummary.NetPayable,
                              SettlementRemark: "refund from point of sale",
                              updt_usr: loginInfo.username,
                            }).then((InsRptslt) => {
                              // console.log("inserted");
                            });
                          });

                          UpdateReceiptSettlementAmount(CompCode, {
                            ReceiptId: props.EntryMode.TableInfo.SysOption5,
                            Amount: finalBillSummary.NetPayable,
                            updt_usr: loginInfo.username,
                          }).then(async (res) => {
                            let VoidItems = [];
                            await InvoiceDtl.filter(
                              (ii) =>
                                ii.IsChecked === "Y" && ii.IsDeleted === "N"
                            ).forEach((filtInDtl) => {
                              VoidItems.push({
                                ...filtInDtl,
                                Qty: parseFloat(filtInDtl.Qty) * -1,
                                Disc: parseFloat(filtInDtl.Disc) * -1,
                                Amount: parseFloat(filtInDtl.Amount) * -1,
                                SGST: parseFloat(filtInDtl.SGST) * -1,
                                CGST: parseFloat(filtInDtl.CGST) * -1,
                                UGST: parseFloat(filtInDtl.UGST) * -1,
                                IGST: parseFloat(filtInDtl.IGST) * -1,
                                Cess: parseFloat(filtInDtl.Cess) * -1,
                                Surcharge: parseFloat(filtInDtl.Surcharge) * -1,
                                // UpdtUsr: loginInfo.username,
                              });
                            });
                            let InvoiceHdr = {
                              GrossAmount: finalBillSummary.SubTotal,
                              DiscAmount: finalBillSummary.Disc,
                              TaxAmount: finalBillSummary.TaxAmount,
                              RoundOff: finalBillSummary.RoundOff,
                              InvoiceAmount: finalBillSummary.NetPayable,
                              SettlementAmount: finalBillSummary.NetPayable,
                              InvoiceId: props.InvoiceId,
                              pUpdtUsr: loginInfo.username,
                            };
                            let data = {
                              VoidItems,
                              InvoiceHdr,
                              UpdtUsr: loginInfo.username,
                              PrevDataLength: InvoiceDtl.length,
                              CompCode: CompCode,
                            };

                            // console.log(data);
                            let gg = await restaurantPOSVoidBill(
                              CompCode,
                              data
                            );
                            // console.log(gg);

                            if (finalBillSummary.NetPayable === 0) {
                              let kotData = {
                                KOTId: [
                                  ...new Set(
                                    props.selectedMenu.map((item) => item.KOTId)
                                  ),
                                ],
                                KOTStatus: "CMP",
                                UpdtUsr: loginInfo.username,
                              };
                              uptRestarantPosKOTHdrStatus(
                                CompCode,
                                kotData
                              ).then((res) => {
                                // let kotDataDtl = {
                                //   KOTId: [
                                //     ...new Set(selectedMenu.map((item) => item.KOTId)),
                                //   ],
                                //   KOTStatus: "RJCT",
                                //   UpdtUsr: loginInfo.username,
                                // };
                                let kotDataDtl = [];
                                InvoiceDtl.filter(
                                  (ii) =>
                                    ii.IsChecked === "Y" && ii.IsDeleted === "N"
                                ).forEach(async (row) => {
                                  await kotDataDtl.push({
                                    Id: row.SysOption2,
                                    KOTId: row.SysOption1,
                                    ItemStatus: "RJCT",
                                    UpdtUsr: loginInfo.username,
                                    CompCode: CompCode,
                                  });
                                });
                                updtRestaurantPOSKOTDtlStatus(
                                  CompCode,
                                  kotDataDtl
                                )
                                  .then((res) => {
                                    // uptRestarantPosKOTdtlStatus(kotDataDtl)
                                    //   .then(() => {
                                    if (
                                      props.EntryMode.EntryType === "DINEIN"
                                    ) {
                                      let tblData = {
                                        data: {
                                          ...props.EntryMode.TableInfo,
                                          SysOption1: null,
                                          SysOption2: null,
                                          SysOption3: null,
                                          SysOption4: null,
                                          SysOption5: null,
                                          Status: "BLANK",
                                          UpdtUsr: loginInfo.username,
                                          CompCode: CompCode,
                                          BranchCode: BranchConfigs.value1,
                                          DeptCode: "DINEIN",
                                          TableType:
                                            props.EntryMode.TableInfo.TableType,
                                          TableSec:
                                            props.EntryMode.TableInfo.SecCode,
                                          IsActive: 1,
                                        },
                                      };
                                      saveTableStatus(
                                        CompCode,
                                        tblData
                                      ).then((res) => {});
                                    }
                                    props.onBackPress();
                                    props.onSavePress();
                                  })
                                  .catch((err) => {
                                    console.error(err);
                                  });
                              });
                              // console.log("in IF here");
                            } else {
                              // console.log("in else here");
                              let kotDataDtl = [];
                              InvoiceDtl.filter(
                                (ii) =>
                                  ii.IsChecked === "Y" && ii.IsDeleted === "N"
                              ).forEach(async (row) => {
                                await kotDataDtl.push({
                                  Id: row.SysOption2,
                                  KOTId: row.SysOption1,
                                  ItemStatus: "RJCT",
                                  UpdtUsr: loginInfo.username,
                                  CompCode: CompCode,
                                });
                              });
                              updtRestaurantPOSKOTDtlStatus(
                                CompCode,
                                kotDataDtl
                              )
                                .then((res) => {
                                  // uptRestarantPosKOTdtlStatus(kotDataDtl)
                                  //   .then(() => {
                                  if (props.EntryMode.EntryType === "DINEIN") {
                                    let tblData = {
                                      data: {
                                        ...props.EntryMode.TableInfo,
                                        SysOption1: null,
                                        SysOption2: null,
                                        SysOption3: null,
                                        SysOption4: null,
                                        SysOption5: null,
                                        Status: "BLANK",
                                        UpdtUsr: loginInfo.username,
                                        CompCode: CompCode,
                                        BranchCode: BranchConfigs.value1,
                                        DeptCode: "DINEIN",
                                        TableType:
                                          props.EntryMode.TableInfo.TableType,
                                        TableSec:
                                          props.EntryMode.TableInfo.SecCode,
                                        IsActive: 1,
                                      },
                                    };
                                  }
                                  props.onBackPress();
                                  props.onSavePress();
                                })
                                .catch((err) => {
                                  console.error(err);
                                });
                            }
                          });
                          // console.log(seq);
                        });
                      }
                    }
                  }}
                >
                  Save
                </Button>
              </div>
              <div style={{ display: "inline-block" }}>
                <Button
                  onClick={() => {
                    // console.log(
                    //   paymentMode,
                    //   "payment mode",
                    //   finalBillSummary.NetPayable,
                    //   amount - finalBillSummary.NetPayable,
                    //   amount
                    // );
                    props.onBackPress();
                  }}
                  icon={<CloseOutlined />}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReceiptRefundComponent;
