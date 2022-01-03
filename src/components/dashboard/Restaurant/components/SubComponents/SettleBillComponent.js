import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Radio,
  Button,
  Table,
  InputNumber,
  Divider,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymodeMaster } from "../../../../../services/payModeMaster";
import {
  fetchPrepareInvoiceDataRestaurant,
  getInvoiceHdr,
  saveTableStatus,
  uptRestarantPosKOTHdrStatus,
  uptRestarantPosKOTdtlStatus,
} from "../../../../../services/restaurant-pos";
import {
  InsUpdtRcpt,
  updtPosInvoiceSettlementAmount,
  getRecieptHdrPOS,
  InsUpdtRcptService,
} from "../../../../../services/reciept";
import { fetchSequenceNextVal } from "../../../../../services/sys-sequence-config";
import moment from "moment";
import Modal from "antd/lib/modal/Modal";

const SettleBillComponent = (props) => {
  const dispatch = useDispatch();
  const [showMultiplePayment, setshowMultiplePayment] = useState(false);
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const [paymentMode, setPaymentMode] = useState({
    table: [],
    radio: "CASH",
  });
  const [invoiceHdr, setInvoiceHdr] = useState([]);
  const [disableSave, setDisableSave] = useState(false);
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [tableCalc, setTableCalc] = useState({
    amount: 0,
    dueAmount: 0,
  });
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const Autocode = useSelector(
    (state) => state.sysSequenceConfig.SequenceNextVal
  );
  useEffect(() => {
    // dispatch(fetchPaymodeMaster());
    fetchPaymodeMaster(CompCode).then((res) => {
      let tempData = [];
      res
        .filter((ii) => ii.IsActive)
        .forEach((row) => {
          tempData.push({
            ...row,
            Amount: 0,
            isDirty: false,
          });
        });

      setPaymentMode({
        table: tempData,
        radio: "CASH",
      });
    });
    if (props.comp.EntryMode.EntryType === "DINEIN") {
      fetchPrepareInvoiceDataRestaurant(
        CompCode,
        BranchConfigs.value1,
        props.comp.EntryMode.EntryType,
        props.comp.EntryMode.TableInfo
          ? props.comp.EntryMode.TableInfo.TableCode
          : null,
        props.lastKOTId
      ).then((PreBillInfo) => {
        if (PreBillInfo.KOTs.length > 0) {
          getInvoiceHdr(CompCode, PreBillInfo.KOTs[0].InvoiceId).then(
            (iHdr) => {
              setInvoiceHdr(iHdr);
              setTableCalc({
                ...tableCalc,
                dueAmount: iHdr[0].InvoiceAmount,
              });
            }
          );
        }

        // console.log(PreBillInfo.KOTs[0].InvoiceId, "bill info");
      });
    } else {
      getInvoiceHdr(CompCode, props.comp.data.InvoiceId).then((iHdr) => {
        setInvoiceHdr(iHdr);
        // console.log(iHdr, "invoice dta");
        setTableCalc({
          ...tableCalc,
          dueAmount: iHdr[0].InvoiceAmount,
        });
      });
    }
  }, []);

  const coloumn = [
    {
      title: "Payment Type",
      dataIndex: "PayDesc",
      align: "center",
      key: "PayCode",
      width: "75%",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      align: "center",
      key: "PayCode",
      render: (value, record) => {
        return (
          // <div style={{padding:"5px 0px"}}>
          <InputNumber
            className="skyelient-number"
            style={{ width: "100%" }}
            defaultValue={value}
            onChange={(value) => {
              record.Amount = value;
              let tempTotalAmount = 0;
              paymentMode.table.forEach(
                (row) => (tempTotalAmount += row.Amount)
              );
              // console.log(tempTotalAmount, "temp amount");
              setTableCalc({
                amount: tempTotalAmount,
                dueAmount:
                  parseInt(invoiceHdr[0].InvoiceAmount) - tempTotalAmount,
              });
              record.isDirty = true;
            }}
            min={0}
          />
          // </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 15 }}>
      <div style={{ display: "flex" }}>
        <Row style={{ border: "1px solid #f0f0f0", flex: 1 }}>
          <Col
            style={{
              backgroundColor: "#fafafa",
              padding: "12px 24px",
              borderRight: "1px solid #f0f0f0",
            }}
          >
            Invoice No
          </Col>
          <Col style={{ padding: "12px 24px" }}>
            {invoiceHdr.length > 0 && `#${invoiceHdr[0].InvoiceNo}`}
          </Col>
        </Row>
        <Row style={{ border: "1px solid #f0f0f0", flex: 1 }}>
          <Col
            style={{
              backgroundColor: "#fafafa",
              padding: "12px 24px",
              borderRight: "1px solid #f0f0f0",
            }}
          >
            Amount
          </Col>
          <Col style={{ padding: "12px 24px" }}>
            {`${currency.value1} ${
              invoiceHdr.length > 0 && `${invoiceHdr[0].InvoiceAmount}`
            }`}
          </Col>
        </Row>
      </div>
      {!showMultiplePayment && (
        <div style={{ padding: "15px 0px 0px" }}>
          <Radio.Group
            onChange={(e) => {
              let tempState = paymentMode;
              setPaymentMode({ ...tempState, radio: e.target.value });
            }}
            defaultValue={paymentMode.radio}
          >
            {paymentMode.table.map((pm) => {
              return (
                <Radio key={pm.PayCode} value={pm.PayCode}>
                  {pm.PayDesc}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
      )}
      <div style={{ padding: "15px 0px 0px" }}>
        <Button
          onClick={() => {
            setshowMultiplePayment(!showMultiplePayment);
          }}
          type={!showMultiplePayment ? `primary` : `default`}
        >
          Multiple Payment Mode
        </Button>
      </div>
      {showMultiplePayment && (
        <>
          <div
            style={{ padding: "15px 0px 0px", transition: "all 1s ease-in" }}
          >
            <Table
              columns={coloumn}
              bordered={true}
              dataSource={paymentMode.table}
              pagination={false}
              rowKey="PayCode"
              size="small"
            />
          </div>
          <div style={{ padding: "10px 5px" }}>
            <div
              style={{
                display: "inline-block",
                width: "80%",
                fontWeight: "600",
              }}
            >
              Amount Paid
            </div>
            <div
              style={{
                display: "inline-block",
                width: "20%",
                textAlign: "end",
                fontWeight: "600",
              }}
            >
              {`${currency.value1} ${tableCalc.amount}`}
            </div>
          </div>

          <Divider style={{ margin: "10px 0px" }} />
          <div style={{ padding: "0px 5px" }}>
            <div
              style={{
                display: "inline-block",
                width: "80%",
                fontWeight: "600",
              }}
            >
              Due Amount
            </div>
            <div
              style={{
                display: "inline-block",
                width: "20%",
                textAlign: "end",
                fontWeight: "600",
              }}
            >
              {`${currency.value1} ${tableCalc.dueAmount}`}
            </div>
          </div>
        </>
      )}
      <Divider style={{ margin: "10px 0px" }} />
      <div style={{ padding: "0px 0px 0px", textAlign: "end" }}>
        <Button
          type="primary"
          disabled={disableSave}
          onClick={async () => {
            setDisableSave(true);
            let Dtldata = [];
            if (showMultiplePayment) {
              let tempData = paymentMode.table.filter(
                (ii) => ii.isDirty === true
              );
              let tempTotalAmount = 0;
              await tempData.forEach((row) => {
                tempTotalAmount += row.Amount;
              });
              if (tempTotalAmount > parseInt(invoiceHdr[0].InvoiceAmount)) {
                message.error("Please re-check your amount");
                setDisableSave(false);
              } else {
                if (
                  tempTotalAmount < parseInt(invoiceHdr[0].InvoiceAmount) &&
                  invoiceHdr[0].CustId === null
                ) {
                  message.error(
                    "Please Check Your Amount or No Customer Is selected"
                  );
                  setDisableSave(false);
                } else {
                  const data = {
                    TranType: "RCPT",
                    updt_usr: loginInfo.username,
                  };
                  fetchSequenceNextVal(CompCode, data).then((res) => {
                    let dtl = [];
                    let totalAmount = 0;
                    paymentMode.table
                      .filter((ii) => ii.isDirty === true)
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
                        ReceiptDate: moment().format("YYYY-MM-DD"),
                        ReceiptNo: res[0].NextVal,
                        Amount: invoiceHdr[0].InvoiceAmount,
                        BalAmount: invoiceHdr[0].InvoiceAmount - totalAmount,
                        Remark: `#AUTO-RCPT-GENERATED againts POS-BILL-NO #${invoiceHdr[0].InvoiceNo}`,
                        updt_usr: loginInfo.username,
                      },
                      updt_usr: loginInfo.username,
                    };
                    InsUpdtRcptService(CompCode, Dtldata.Hdr, dtl).then(() => {
                      getRecieptHdrPOS(CompCode, res[0].NextVal).then(
                        (recpt) => {
                          let param = {
                            InvoiceId: invoiceHdr[0].InvoiceId,
                            Amount: totalAmount,
                            ReceiptId: recpt[0].ReceiptId,
                            SettlementDate: moment().format("YYYY-MM-DD"),
                            SettlementType: "INVOICE",
                            AdjTranNo: invoiceHdr[0].InvoiceId,
                            AdjTranDate: moment(
                              invoiceHdr[0].InvoiceDate
                            ).format("YYYY-MM-DD"),
                            Amount: totalAmount,
                            SettlementRemark: null,
                            updt_usr: loginInfo.username,
                            CompCode: CompCode,
                          };
                          if (props.comp.EntryMode.EntryType === "DINEIN") {
                            updtPosInvoiceSettlementAmount(param).then(
                              (res) => {
                                let tblData = {
                                  data: {
                                    ...props.comp.EntryMode.TableInfo,
                                    // ...props.comp.EntryMode.TableInfo,
                                    SysOption5: recpt[0].ReceiptId,
                                    Status: "PAID",
                                    UpdtUsr: loginInfo.username,
                                    CompCode: CompCode,
                                    BranchCode: BranchConfigs.value1,
                                    DeptCode: "DINEIN",
                                    TableType:
                                      props.comp.EntryMode.TableInfo.TableType,
                                    TableSec:
                                      props.comp.EntryMode.TableInfo.SecCode,
                                    IsActive: 1,
                                  },
                                };
                                saveTableStatus(CompCode, tblData).then(
                                  (res) => {
                                    setDisableSave(false);
                                    props.onBackPress();
                                    props.CloseKOT();
                                  }
                                );
                              }
                            );
                          } else {
                            updtPosInvoiceSettlementAmount(param).then(
                              (res) => {
                                let kotData = {
                                  KOTId: [props.comp.data.KOTId],
                                  KOTStatus: "CMP",
                                  UpdtUsr: loginInfo.username,
                                };

                                // console.log(
                                //   props.comp.data.KOTId,
                                //   "kot id on save"
                                // );
                                uptRestarantPosKOTHdrStatus(CompCode, kotData)
                                  .then((res) => {
                                    uptRestarantPosKOTdtlStatus(
                                      CompCode,
                                      kotData
                                    ).catch((err) => {
                                      setDisableSave(false);
                                      console.error(err);
                                    });
                                  })
                                  .catch((err) => {
                                    setDisableSave(false);
                                    console.error(err);
                                  });
                                setDisableSave(false);
                                props.onBackPress();
                                props.refreshScreen();
                                return res;
                              }
                            );
                          }
                        }
                      );
                    });
                  });
                }
              }
            } else {
              const data = {
                TranType: "RCPT",
                updt_usr: loginInfo.username,
              };
              fetchSequenceNextVal(CompCode, data).then((res) => {
                Dtldata = {
                  Hdr: {
                    ReceiptId: 0,
                    ReceiptType: "CUST",
                    Value1:
                      invoiceHdr[0].CustId !== null ? invoiceHdr[0].CustId : 0,
                    Value2: "",
                    Value3: "",
                    Value4: "",
                    Value5: "",
                    ReceiptDate: moment().format("YYYY-MM-DD"),
                    ReceiptNo: res[0].NextVal,
                    Amount: invoiceHdr[0].InvoiceAmount,
                    BalAmount: 0,
                    Remark: `#AUTO-RCPT-GENERATED againts POS-BILL-NO #${invoiceHdr[0].InvoiceNo}`,
                    updt_usr: loginInfo.username,
                  },
                  Dtl: [
                    {
                      Id: 0,
                      PaymentMode: paymentMode.radio,
                      Amount: invoiceHdr[0].InvoiceAmount,
                      Remark: null,
                      SysOption1: null,
                      SysOption2: null,
                      SysOption3: null,
                      SysOption4: null,
                      SysOption5: null,
                    },
                  ],
                  updt_usr: loginInfo.username,
                };
                InsUpdtRcptService(CompCode, Dtldata.Hdr, Dtldata.Dtl).then(
                  () => {
                    getRecieptHdrPOS(CompCode, res[0].NextVal)
                      .then((recpt) => {
                        let param = {
                          InvoiceId: invoiceHdr[0].InvoiceId,
                          Amount: invoiceHdr[0].InvoiceAmount,
                          ReceiptId: recpt[0].ReceiptId,
                          SettlementDate: moment().format("YYYY-MM-DD"),
                          SettlementType: "INVOICE",
                          AdjTranNo: invoiceHdr[0].InvoiceId,
                          AdjTranDate: moment(invoiceHdr[0].InvoiceDate).format(
                            "YYYY-MM-DD"
                          ),
                          Amount: invoiceHdr[0].InvoiceAmount,
                          SettlementRemark: null,
                          updt_usr: loginInfo.username,
                          CompCode: CompCode,
                        };
                        if (props.comp.EntryMode.EntryType === "DINEIN") {
                          updtPosInvoiceSettlementAmount(param)
                            .then((res) => {
                              let tblData = {
                                data: {
                                  ...props.comp.EntryMode.TableInfo,
                                  SysOption5: recpt[0].ReceiptId,
                                  Status: "PAID",
                                  UpdtUsr: loginInfo.username,
                                  CompCode: CompCode,
                                  BranchCode: BranchConfigs.value1,
                                  DeptCode: "DINEIN",
                                  TableType:
                                    props.comp.EntryMode.TableInfo.TableType,
                                  TableSec:
                                    props.comp.EntryMode.TableInfo.SecCode,
                                  IsActive: 1,
                                },
                              };
                              saveTableStatus(CompCode, tblData)
                                .then((res) => {
                                  setDisableSave(false);
                                  props.onBackPress();
                                  props.CloseKOT();
                                })
                                .catch((err) => console.log(err));
                            })
                            .catch((err) => console.log(err));
                        } else {
                          updtPosInvoiceSettlementAmount(param)
                            .then((res) => {
                              // console.log(
                              //   props.comp.data.KOTId,
                              //   "kot id on save"
                              // );
                              let kotData = {
                                KOTId: [props.comp.data.KOTId],
                                KOTStatus: "CMP",
                                UpdtUsr: loginInfo.username,
                              };
                              uptRestarantPosKOTHdrStatus(CompCode, kotData)
                                .then((res) => {
                                  uptRestarantPosKOTdtlStatus(
                                    CompCode,
                                    kotData
                                  ).catch((err) => console.log(err));
                                })
                                .catch((err) => console.log(err));
                              props.onBackPress();
                              props.refreshScreen();
                              return res;
                            })
                            .catch((err) => console.log(err));
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                );
                // dispatch(InsUpdtRcpt(Dtldata.Hdr, Dtldata.Dtl));
                // let param = {
                //   InvoiceId: invoiceHdr[0].InvoiceId,
                //   Amount: invoiceHdr[0].InvoiceAmount,
                // };
                // console.log(param, "parameter");
                // updtPosInvoiceSettlementAmount(param);
                // console.log(paymentMode.radio, Dtldata);
              });
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SettleBillComponent;
