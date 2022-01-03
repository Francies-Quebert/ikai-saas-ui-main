import React, { useState, useEffect, useRef } from "react";
import {
  Col,
  Row,
  Radio,
  Button,
  Table,
  InputNumber,
  Divider,
  Input,
  Menu,
  Tooltip,
  Select,
  Dropdown,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymodeMaster } from "../../services/payModeMaster";
import moment from "moment";
import {
  RetweetOutlined,
  FileAddOutlined,
  SettingOutlined,
  InteractionTwoTone,
  AlignLeftOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { getUserDetails } from "../../services/user-master";
import { useHotkeys } from "react-hotkeys-hook";
import { getCustomerAddress } from "../../services/customer-address";
import _ from "lodash";
import { fetchKeyboardHotKeyConfig } from "../../services/keyboard-hotkey-config";
import ViewHotKeysComponent from "../common/ViewHotKeysComponent";
const { Option } = Select;
const { TextArea } = Input;

const PaymentModeComponent = (props) => {
  const dispatch = useDispatch();
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [showMultiplePayment, setshowMultiplePayment] = useState(false);
  const [showRemark, setshowRemark] = useState();
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const [paymentMode, setPaymentMode] = useState({
    table: [],
    radio: 0,
    remark: null,
  });
  const [selectedAddress, setSelectedAddress] = useState();
  const [invoiceHdr, setInvoiceHdr] = useState([]);
  const [disableSave, setDisableSave] = useState(false);
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CURRENCY")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const sequenceConfig = useSelector(
    (state) => state.sysSequenceConfig.sysSequenceConfig
  ).find((ff) => ff.TranType === "RCPT");
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
  const [userData, setUserData] = useState({ user: null, address: [] });
  const [keyboardKey, setKeyboardKey] = useState([]);
  const switchModeRef = useRef();
  const saveDataRef = useRef();
  const customerSelectRef = useRef();
  const backDataRef = useRef();
  const saveAndPrintDataRef = useRef();
  const keyboardHotkeyConfig = useSelector((state) =>
    state.AppMain.keyboardHotKeyConfig.filter(
      (flt) => flt.CompName === "SalesPayment"
    )
  );
  useEffect(() => {
    // dispatch(fetchPaymodeMaster());
    // console.log(props);

    fetchPaymodeMaster(CompCode).then((res) => {
      let tmp = [];
      keyboardHotkeyConfig.forEach((row, index) => {
        tmp.push({ ...row, key: index, isDirty: false });
      });
      setKeyboardKey(tmp);
      let tempData = [];
      res
        .filter((ii) => ii.IsActive)
        .forEach((row, idx) => {
          tempData.push({
            ...row,
            index: idx,
            Amount: 0,
            isDirty: false,
            remark: null,
          });
        });
      tempData.push({
        PayCode: "DUE",
        PayDesc: "Due",
        index: tempData.length,
        Amount: 0,
        isDirty: false,
        remark: null,
      });
      setPaymentMode({
        table: tempData,
        radio: "CASH",
        remark: null,
      });
    });
  }, []);
  useEffect(() => {
    setTableCalc({ ...tableCalc, amount: props.summary.NetAmount });
  }, [props.summary]);

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "save")
      ? keyboardKey.find((key) => key.EventCode === "save").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      saveDataRef.current.click();
    }
  );
  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "save-print")
      ? keyboardKey.find((key) => key.EventCode === "save-print").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      if (saveAndPrintDataRef.current) {
        saveAndPrintDataRef.current.click();
      }
    }
  );
  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "select-cust")
      ? keyboardKey.find((key) => key.EventCode === "select-cust").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      customerSelectRef.current.click();
      // props.onBackPress();
    }
  );
  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "back")
      ? keyboardKey.find((key) => key.EventCode === "back").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      backDataRef.current.click();
    }
  );

  useHotkeys(
    keyboardKey.find((key) => key.EventCode === "payment-mode")
      ? keyboardKey.find((key) => key.EventCode === "payment-mode").HotKey
      : null,
    (a, b) => {
      a.preventDefault();
      if (switchModeRef.current) {
        switchModeRef.current.click();
      }
    }
  );
  useEffect(() => {
    if (
      props.selectedCust.customerId &&
      props.selectedCust.customerId !== null
    ) {
      getUserDetails(CompCode, "U", props.selectedCust.customerId).then(
        (cc) => {
          getCustomerAddress(CompCode, "U", cc[0].UserId).then((val) => {
            setUserData({ user: cc[0], address: val });
          });
        }
      );
    } else {
      setUserData({ user: null, address: [] });
    }
  }, [props.selectedCust.customerId]);

  useEffect(() => {
    if (userData.address.length > 0) {
      if (props.selectedCust.customerAddress !== null) {
        setSelectedAddress(props.selectedCust.customerAddress);
      } else {
        let findDefAdd = userData.address.find((dd) => dd.IsDefault === "1");
        if (findDefAdd) {
          setSelectedAddress(findDefAdd.AddressId);
        } else {
          setSelectedAddress(userData.address[0].AddressId);
        }
      }
    }
  }, [userData.address, props.selectedCust.customerAddress]);

  const onRefreshKeyConfig = (mode) => {
    fetchKeyboardHotKeyConfig(CompCode).then((res) => {
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
  const coloumn = [
    {
      title: "Payment Type",
      dataIndex: "PayDesc",
      align: "left",
      key: "PayCode",

      render: (text, record) => {
        return (
          <span
            className="color-style"
            style={{ fontWeight: "600", height: 26 }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      align: "center",
      key: "PayCode",
      width: 120,
      className: "input-table-sales",
      render: (value, record) => {
        return (
          <div style={{ padding: "0px 0px", display: "flex", height: 26 }}>
            <Tooltip
              title={`Add Remark For ${record.PayDesc} Payment`}
              placement="leftTop"
            >
              <div
                onClick={() => {
                  setshowRemark(record.PayCode);
                }}
                style={{
                  width: 20,
                  textAlign: "center",
                  background: "#f1f1f1",
                  border: "1px solid #d0d0d0",
                  cursor: "pointer",
                }}
              >
                <AlignLeftOutlined />
              </div>
            </Tooltip>
            <InputNumber
              autoFocus={record.index === 0 ? true : false}
              bordered={false}
              size="small"
              className="bill-input"
              style={{ width: "calc(100% - 20px)" }}
              value={
                record.PayCode !== "DUE"
                  ? value
                  : props.summary.NetAmount - parseFloat(tableCalc.amount)
              }
              onFocus={() => {
                setshowRemark(record.PayCode);
              }}
              readOnly={record.PayCode === "DUE"}
              onChange={(value) => {
                record.Amount = value;
                let tempTotalAmount = 0;
                paymentMode.table.forEach(
                  (row) => (tempTotalAmount += row.Amount)
                );
                // console.log(tempTotalAmount, "temp amount");
                setTableCalc({
                  amount: tempTotalAmount,
                  dueAmount: 0,
                  //   parseInt(invoiceHdr[0].InvoiceAmount) - tempTotalAmount,
                });
                record.isDirty = true;
              }}
              min={0}
            />
          </div>
        );
      },
    },
  ];

  const [selectedRow, setSelectedRow] = useState(0);
  const coloumnSingle = [
    {
      dataIndex: null,
      width: 30,
      render: (record) => {
        return (
          <div style={{ textAlign: "center", height: 26 }}>
            <Radio
              onChange={(e) => {
                setPaymentMode({ ...paymentMode, radio: e.target.value });
                setshowRemark(e.target.value);
              }}
              style={{ marginRight: 0 }}
              value={record.PayCode}
              autoFocus={record.PayCode === "CASH" ? true : false}
              checked={paymentMode.radio === record.PayCode}
            ></Radio>
          </div>
        );
      },
    },
    {
      title: "Payment Type",
      dataIndex: "PayDesc",
      align: "center",
      key: "PayCode",
      render: (text, record) => {
        return (
          <span className="color-style" style={{ fontWeight: "600" }}>
            {text}
          </span>
        );
      },
    },
  ];

  const switchPaymentMode = async () => {
    setshowMultiplePayment(!showMultiplePayment);

    if (!showMultiplePayment === true) {
      let tempTotalAmount = 0;
      paymentMode.table.forEach((row) => (tempTotalAmount += row.Amount));
      setTableCalc({
        amount: tempTotalAmount,
        dueAmount: 0,
      });
      setshowRemark();
    } else {
      setshowRemark(paymentMode.radio);
    }
  };
  const onSaveClick = async (pPrint) => {
    let tempTotalAmount = 0;
    let Dtldata = [];
    if (showMultiplePayment) {
      let tempData = paymentMode.table.filter(
        (ii) =>
          ii.isDirty === true &&
          !_.includes([null, "", NaN, undefined], ii.Amount) &&
          ii.PayCode !== "DUE"
      );
      await tempData.forEach((row) => {
        tempTotalAmount += row.Amount;
      });
      // console.log(tempData, "tempData");
      tempData.forEach((rr, idx) => {
        Dtldata.push({
          key: idx + 1,
          TranType: "RCT",
          Id: idx + 1,
          TranId: 0,
          PaymentMode: rr.PayCode,
          PayDesc: rr.PayDesc,
          Amount:
            rr.Amount && rr.Amount !== "" && rr.Amount !== null
              ? parseFloat(rr.Amount).toFixed(2)
              : null,
          Remark: rr.remark,
          fromDatabase: false,
        });
      });
    } else {
      Dtldata.push({
        key: 1,
        TranType: "RCT",
        Id: 1,
        TranId: 0,
        PaymentMode: paymentMode.radio,
        PayDesc: null,
        Amount:
          !showMultiplePayment &&
          props.summary.NetAmount - tableCalc.amount > 0 &&
          paymentMode.radio === "CASH"
            ? parseFloat(tableCalc.amount).toFixed(2)
            : props.summary.NetAmount &&
              props.summary.NetAmount !== "" &&
              props.summary.NetAmount !== null
            ? parseFloat(props.summary.NetAmount).toFixed(2)
            : null,
        Remark: tableCalc.remark,
        fromDatabase: false,
      });
    }

    let finalData = {
      hdrData: {
        TranType: "RCT",
        TranId: 0,
        TranNo: "",
        TranDate: moment().format("YYYY-MM-DD"),
        RefCode:
          props.selectedCust.customerId !== null
            ? props.selectedCust.customerId
            : 0,
        Remark: paymentMode.remark,
        Amount: props.summary.NetAmount,
        BalAmount:
          !showMultiplePayment && paymentMode.radio === "CASH"
            ? props.summary.NetAmount - tableCalc.amount
            : showMultiplePayment
            ? props.summary.NetAmount - tempTotalAmount
            : props.summary.NetAmount,
        customerId: userData.user !== null ? userData.user.UserId : null,
        customerAddress: selectedAddress ? selectedAddress : null,
        customerName: userData.user !== null ? userData.user.Name : null,
        customerMobile: userData.user !== null ? userData.user.mobile : null,
        UpdtUsr: l_loginUser,
        // amountPaid: paymentMode.radio === "CASH" ? tableCalc.amount : 0,
        amountPaid: tableCalc.amount,
      },
      dtlData: Dtldata,
      stlmntData: {
        Amount: showMultiplePayment ? tempTotalAmount : tableCalc.amount,
      },
    };
    if (showMultiplePayment && tempTotalAmount - props.summary.NetAmount > 0) {
      notification.error({
        message: "In-Valid Amount",
        description: `Your inserted amount is ${tempTotalAmount}, required amount is ${props.summary.NetAmount}`,
      });
      return false;
    } else {
      if (
        (showMultiplePayment &&
          tempTotalAmount < props.summary.NetAmount &&
          props.selectedCust.customerId === null) ||
        (!showMultiplePayment &&
          props.summary.NetAmount - tableCalc.amount > 0 &&
          paymentMode.radio === "CASH" &&
          props.selectedCust.customerId === null)
      ) {
        notification.error({
          message: "No Customer Selected",
          description: `Your inserted amount is ${tempTotalAmount},
            which is less than required amount (${props.summary.NetAmount}).
            Please add a customer to record credits`,
        });
      } else {
        props.onSaveClick(finalData, pPrint);
        fetchPaymodeMaster(CompCode).then((res) => {
          let tempData = [];
          res
            .filter((ii) => ii.IsActive)
            .forEach((row, idx) => {
              tempData.push({
                ...row,
                index: idx,
                Amount: 0,
                isDirty: false,
                remark: null,
              });
            });

          setPaymentMode({
            table: tempData,
            radio: "CASH",
            remark: null,
          });
        });
      }
    }
  };

  return (
    <>
      <div style={{ padding: "0px 5px" }} className="sales-payment">
        <div
          style={{
            display: "flex",
            flexFlow: "row wrap",
            marginTop: 5,
            border: "1px solid var(--app-theme-color)",
            borderRadius: 4,
          }}
        >
          <div style={{ width: "100%", display: "flex", padding: "5px" }}>
            <div
              style={{
                width: "30%",
                position: "relative",
                cursor: "pointer",
                display: "flex",
                height: "100%",
                userSelect: "none",
              }}
              ref={customerSelectRef}
              onClick={props.onCustomerEditClick}
            >
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  right: 5,
                  color: "var(--app-theme-color)",
                }}
              >
                <EditOutlined />
              </div>
              <div
                style={{
                  border: "1px dashed var(--app-theme-color)",
                  backgroundColor: "var(--app-theme-color-rbga)",
                  padding: "10px",
                  width: "100%",
                  alignSelf: "center",
                  display: "flex",
                  height: "100%",
                }}
              >
                {/* <div
                    style={{
                      fontWeight: "600",
                      color: "var(--app-theme-color)",
                    }}
                  >
                    Customer :
                  </div> */}
                <div
                  style={{
                    fontWeight: "600",
                    padding: "10px 0px",
                    color: "var(--app-theme-color)",
                    width: "100%",
                    alignSelf: "center",
                    color: "var(--app-theme-color)",
                    textAlign: "center",
                  }}
                >
                  {userData.user !== null ? (
                    <>
                      {userData.user.Name} <br /> ({userData.user.mobile})
                    </>
                  ) : (
                    `No Customer Selected`
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                width: "70%",
                position: "relative",
                padding: "0px 0px 0px 5px",
              }}
            >
              <div
                style={{
                  border: "1px dashed var(--app-theme-color)",
                  backgroundColor: "var(--app-theme-color-rbga)",
                  padding: "2px 5px",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    overflowX: "auto",
                    height: "100%",
                  }}
                  className="style-2"
                >
                  {userData.address.length > 0 ? (
                    userData.address.map((aa) => {
                      return (
                        <div
                          key={aa.AddressId}
                          onClick={() => setSelectedAddress(aa.AddressId)}
                          style={{
                            color: "var(--app-theme-color)",
                            border: "1px solid var(--app-theme-color)",
                            minWidth: 200,
                            maxWidth: 200,
                            borderRadius: 3,
                            padding: "2px 7px",
                            cursor: "pointer",
                            lineHeight: "18px",
                            display: "flex",
                            backgroundColor: "#FFF",
                            marginRight: 5,
                          }}
                        >
                          <div>
                            <Radio checked={selectedAddress === aa.AddressId} />
                          </div>
                          <div style={{ padding: "2px 5px 2px 0px" }}>
                            {aa.add1 !== null ? (
                              <>
                                {aa.add1}
                                <br />
                                {aa.add2}
                                <br />
                                {aa.add3}
                              </>
                            ) : (
                              aa.geoLocationName
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        color: "var(--app-theme-color)",
                        margin: "auto",
                        textAlign: "center",
                      }}
                    >
                      No address Exist
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "var(--app-theme-color)",
              fontSize: 16,
              width: "100%",
              color: "#FFF",
              padding: "3px 0px 3px 8px",
              fontWeight: "600",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              {!showMultiplePayment ? "Single" : "Multiple"} Payment Mode
            </div>
            <div>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="1"
                      icon={<InteractionTwoTone style={{ fontSize: 16 }} />}
                      onClick={() => {
                        switchPaymentMode();
                      }}
                    >
                      Switch To
                      {showMultiplePayment ? " Single " : " Multiple "}
                      Payment
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <div
                  style={{
                    cursor: "pointer",
                    borderLeft: "1px solid #FFFFFF",
                    padding: "0px 4px",
                  }}
                >
                  <SettingOutlined />
                </div>
              </Dropdown>
            </div>
          </div>
          <div
            style={{
              padding: "0x 0px 0px",
              transition: "all 1s ease-in",
              width: "40%",
              borderRight: "1px solid var(--app-theme-color)",
            }}
            className="sales-payment-table"
          >
            <Table
              showHeader={false}
              columns={showMultiplePayment ? coloumn : coloumnSingle}
              bordered={true}
              dataSource={
                showMultiplePayment
                  ? paymentMode.table
                  : paymentMode.table.filter((aa) => aa.PayCode !== "DUE")
              }
              pagination={false}
              rowKey="PayCode"
              size="small"
            />
          </div>
          <div
            style={{
              width: "60%",
              display: "flex",
              flexFlow: "row wrap",
              background: "var(--app-theme-color-rbga)",
              // border: "1px solid var(--app-theme-color)",
              color: "var(--app-theme-color)",
              borderRadius: 3,
            }}
          >
            {(paymentMode.radio === "CASH" || paymentMode.radio === "DUE") &&
              !showMultiplePayment && (
                <div>
                  <div
                    style={{
                      padding: "3px 5px",
                      width: "100%",
                      display: "inline-block",
                      borderBottom: " 1px dashed var(--app-theme-color)",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        width: "50%",
                        fontWeight: "600",
                        fontSize: 33,
                      }}
                    >
                      Received
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        width: "50%",
                        textAlign: "end",
                        fontWeight: "600",
                        border: "1px solid var(--app-theme-color)",
                        backgroundColor: "#f1f1f1",
                        borderRadius: 4,
                        fontSize: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          display: "inline-block",
                          borderRight: "1px solid #d0d0d0",
                          textAlign: "center",
                          fontSize: 38,
                          borderRight: " 1px solid var(--app-theme-color)",
                        }}
                      >
                        {currency.value1}
                      </div>
                      <div
                        className="style-2"
                        style={{
                          width: "calc(100% - 40px)",
                          // width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <InputNumber
                          size="large"
                          style={{
                            width: "100%",
                            fontSize: 38,
                            // border: " 1px solid var(--app-theme-color)",
                            color: "var(--app-theme-color)",
                          }}
                          value={tableCalc.amount}
                          className="bill-input"
                          min={0}
                          onChange={(val) => {
                            setTableCalc({ ...tableCalc, amount: val });
                          }}
                          disabled={showMultiplePayment ? true : false}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "3px 5px",
                      width: "100%",
                      display: "inline-block",
                      borderBottom: "1px dashed var(--app-theme-color)",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        width: "50%",
                        fontWeight: "600",
                        fontSize: 33,
                      }}
                    >
                      Return
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        width: "50%",
                        textAlign: "end",
                        fontWeight: "600",
                        border: "1px solid var(--app-theme-color)",
                        borderRadius: 4,
                        backgroundColor: "#f1f1f1",
                        fontSize: 38,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          display: "inline-block",
                          borderRight: "1px solid var(--app-theme-color)",
                          textAlign: "center",
                        }}
                      >
                        {currency.value1}
                      </div>
                      <div
                        className="style-2"
                        style={{
                          width: "calc(100% - 40px)",
                          // width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <InputNumber
                          style={{
                            width: "100%",
                            fontSize: 38,
                            // border: "1px solid var(--app-theme-color)",
                            color: "var(--app-theme-color)",
                          }}
                          value={tableCalc.amount - props.summary.NetAmount}
                          className="bill-input"
                          min={0}
                          // onChange={(val) => {
                          //   setTableCalc({ ...tableCalc, amount: val });
                          // }}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {showRemark && (showMultiplePayment || showRemark !== "CASH") && (
              <div style={{ width: "100%", padding: "0px 5px" }}>
                <div
                  style={{
                    color: "var(--app-theme-color)",
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  Remark{" "}
                  {showMultiplePayment && showRemark
                    ? `(${
                        paymentMode.table.find(
                          (pp) => pp.PayCode === showRemark
                        ).PayDesc
                      })`
                    : ""}
                  :
                </div>
                <TextArea
                  rows={4}
                  style={{ width: "100%" }}
                  placeholder="Remark"
                  value={
                    showMultiplePayment
                      ? paymentMode.table.find(
                          (ff) => ff.PayCode === showRemark
                        ).remark
                      : paymentMode.remark
                  }
                  onChange={(e) => {
                    if (showMultiplePayment) {
                      let temppaymentMode = paymentMode.table;
                      let findIndex = temppaymentMode.findIndex(
                        (aa) => aa.PayCode === showRemark
                      );
                      temppaymentMode[findIndex].remark = e.target.value;
                      setPaymentMode({
                        ...paymentMode,
                        table: temppaymentMode,
                      });
                    } else {
                      setPaymentMode({
                        ...paymentMode,
                        remark: e.target.value,
                      });
                    }
                  }}
                />
              </div>
            )}
            <div
              style={{
                padding: "5px 5px",
                margin: "auto auto 0px auto",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "100%",
                  fontWeight: "600",
                  fontSize: 33,
                }}
              >
                Total Amount
              </div>
              <div
                style={{
                  display: "inline-block",
                  width: "100%",
                  textAlign: "end",
                  fontWeight: "600",
                  border: "1px solid var(--app-theme-color)",
                  borderRadius: 4,
                  backgroundColor: "#f1f1f1",
                  fontSize: 38,
                }}
              >
                <div
                  style={{
                    width: 40,
                    display: "inline-block",
                    borderRight: "1px solid var(--app-theme-color)",
                    textAlign: "center",
                  }}
                >
                  {currency.value1}
                </div>
                <div
                  style={{
                    width: "calc(100% - 40px)",
                    // width: "100%",
                    display: "inline-block",
                  }}
                >
                  {/* <InputNumber
                    style={{
                      width: "100%",
                      fontSize: 38,
                      color: "var(--app-theme-color)",
                    }}
                    min={0}
                    value={props.summary.NetAmount}
                    className="bill-input"
                    disabled={true}
                    placeholder="Due Amount"
                  /> */}
                  <div
                    // className="bill-input"
                    style={{
                      padding: "0px 20px",
                      width: "100%",
                      fontSize: 40,
                      fontWeight: 700,
                      color: "var(--app-theme-color)",
                    }}
                  >
                    {props.summary.NetAmount}
                  </div>
                </div>
              </div>
            </div>
            {/* <Divider style={{ margin: "10px 0px" }} /> */}
            {/* <div style={{ padding: "0px 5px" }}>
                <div
                  style={{
                    display: "inline-block",
                    width: "80%",
                    fontWeight: "600",
                    fontSize: 16,
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
                    border: "1px solid #d0d0d0",
                    backgroundColor: "#f1f1f1",
                    fontSize: 16,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      display: "inline-block",
                      borderRight: "1px solid #d0d0d0",
                      textAlign: "center",
                    }}
                  >
                    {currency.value1}{" "}
                  </div>
                  <div
                    style={{
                      width: "calc(100% - 20px)",
                      display: "inline-block",
                    }}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      value={tableCalc.dueAmount}
                      className="border-0 bill-input"
                      disabled={true}
                      placeholder="Due Amount"
                      onChange={(val) => {
                        setTableCalc({ ...tableCalc, dueAmount: val });
                      }}
                    />
                  </div>
                </div>
              </div> */}
          </div>
        </div>
      </div>
      <Divider style={{ margin: "10px 0px" }} />
      <div
        style={{ padding: "0px 0px 0px", textAlign: "end", marginBottom: 5 }}
      >
        <Button
          type="primary"
          loading={props.loading}
          disabled={disableSave}
          style={{ marginRight: 5 }}
          onClick={async () => {
            onSaveClick();
            // setDisableSave(true);
          }}
          icon={<FileAddOutlined />}
          ref={saveDataRef}
        >
          Save
        </Button>
        <Button
          type="primary"
          loading={props.loading}
          icon={<RetweetOutlined />}
          onClick={() => {
            onSaveClick(true);
          }}
          ref={saveAndPrintDataRef}
          style={{ marginRight: 5 }}
        >
          Save and Print
        </Button>
        <Button
          type="primary"
          icon={<RetweetOutlined />}
          onClick={() => {
            props.onBackPress();
          }}
          ref={backDataRef}
        >
          Back
        </Button>
        <Button
          style={{ display: "none" }}
          ref={switchModeRef}
          onClick={() => {
            switchPaymentMode();
          }}
        ></Button>
      </div>
      {keyboardKey.length > 0 && (
        <Col
          span={24}
          style={{
            // position: "absolute",
            width: "100%",
            margin: "0px 0px",
            bottom: 0,
            padding: "0px 4px",
          }}
        >
          <ViewHotKeysComponent
            keyboardKey={keyboardKey}
            title={`Sales Payment Screen (Hotkey Config)`}
            RefreshKeyConfig={() => {
              onRefreshKeyConfig("SalesPayment");
            }}
          />
        </Col>
      )}
    </>
  );
};

export default PaymentModeComponent;
