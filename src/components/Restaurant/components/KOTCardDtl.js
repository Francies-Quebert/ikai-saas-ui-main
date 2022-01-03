import React, { useEffect, useState } from "react";
import { Card, Divider, Row, Col, Button, Radio, Dropdown, Menu } from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
  CompassOutlined,
  FileProtectOutlined,
  FileAddOutlined,
  SettingFilled,
} from "@ant-design/icons";
import moment from "moment";

import { getKOTDtlData, updtKOTStatus } from "../../../services/kot-view";
import { useSelector } from "react-redux";
import icon_delivery from "../../../assets/images/icon/delivery.png";
import icon_DineIn from "../../../assets/images/icon/DineIn.png";
import icon_home from "../../../assets/images/icon/home.png";
import icon_merchant from "../../../assets/images/icon/merchant.png";
import icon_Online from "../../../assets/images/icon/Online.png";
import icon_pickup from "../../../assets/images/icon/pickup.png";
import swal from "sweetalert";
import {
  raiseEvent,
  uptRestarantPosKOTdtlStatus,
} from "../../../services/restaurant-pos";
import SettleBillComponent from "../../dashboard/Restaurant/components/SubComponents/SettleBillComponent";
import Modal from "antd/lib/modal/Modal";
import VoidBillComponent from "../../dashboard/Restaurant/components/SubComponents/VoidBillComponent";
import ReceiptRefundComponent from "../../dashboard/Restaurant/components/SubComponents/ReceiptRefundComponent";

const KOTCardDtl = (props) => {
  var startTime = moment("06:10:00 pm", "hh:mm:ss a");
  var endTime = moment("06:12:00 pm", "hh:mm:ss a");
  const [settleModal, setSettleModal] = useState(false);
  const [KOTDtl, setKOTdtl] = useState([]);
  const [calcDtl, setCalcDtl] = useState({
    Qty: 0,
    Total: 0,
  });
  const currency = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "CURRENCY")
  );
  const [voidBillModal, setVoidBillModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    getKOTDtlData(CompCode, props.data.KOTId).then((res) => {
      let tempQty = 0;
      let tempTotal = 0;
      res.forEach((item) => {
        tempQty += item.Qty;
        tempTotal += parseFloat(item.Amount);
      });
      setCalcDtl({
        Qty: tempQty,
        Total: tempTotal,
      });
      setKOTdtl(res);
    });
  }, []);
  return (
    <Card
      style={{ width: "100%", height: "100%" }}
      bodyStyle={{
        width: "100%",
        height: "100%",
        padding: "32px 8px 0px",
        position: "relative",
        fontFamily: `Montserrat, sans-serif`,
        fontSize: 13,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "35%",
          top: "35%",
          //   bottom: "50%",
          opacity: 0.2,
        }}
      >
        <img
          className="icon-order-type"
          style={{ userSelect: "none" }}
          src={
            props.data.OrderType === "PICKUP"
              ? icon_pickup
              : props.data.OrderType === "DELIVERY"
              ? icon_delivery
              : props.data.OrderType === "ONLINE"
              ? icon_Online
              : props.data.OrderType === "MERCHANT"
              ? icon_merchant
              : icon_DineIn
          }
          height="auto"
          width="90px"
        />
      </div>
      {/* <div className="KOT-title">Delivery</div> */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: -6,
          padding: 5,
          border: "1px solid #cecece",
          fontSize: 10,
          background: "cadetblue",
          color: "#fff",
        }}
      >
        {props.data.OrderType === "PICKUP"
          ? "Pick Up"
          : props.data.OrderType === "DELIVERY"
          ? "Home Delivery"
          : "DINE IN"}
      </div>
      {props.data.DispatchDTTM !== null ? (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            padding: 5,
            border: "1px solid #cecece",
            fontSize: 10,
            background: "#fff",
            borderRadius: 5,
          }}
        >
          Dispatched{" "}
          <span style={{ fontWeight: "600" }}>
            {moment().diff(moment(props.data.DispatchDTTM), "minutes")} min ago
          </span>
        </div>
      ) : props.data.ReadyDTTM !== null ? (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            padding: 5,
            border: "1px solid #cecece",
            fontSize: 10,
            background: "#fff",
            borderRadius: 5,
          }}
        >
          Ready{" "}
          <span style={{ fontWeight: "600" }}>
            {moment().diff(moment(props.data.ReadyDTTM), "minutes")} min ago
          </span>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            padding: 5,
            border: "1px solid #cecece",
            fontSize: 10,
            background: "#fff",
            borderRadius: 5,
          }}
        >
          Time Elapsed:{" "}
          <span style={{ fontWeight: "600" }}>
            {moment().diff(moment(props.data.crt_dttm), "minutes")} min ago
          </span>
        </div>
      )}

      <div style={{ height: "35%", flex: 1 }}>
        <div>
          <span
            style={{
              fontWeight: "600",
            }}
          >
            Invoice :
          </span>
          {`${props.data.InvoiceNo} / ${moment(props.data.InvoiceDate).format(
            "DD-MM-YYYY hh:mm:ss"
          )}`}
        </div>
        <div style={{ position: "relative" }}>
          {props.data.Name} ({props.data.mobile})
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              fontWeight: "600",
            }}
          >
            #{props.data.KOTId}
          </div>
        </div>
        <div>{props.data.add1}, </div>
        <div>
          {props.data.add2} {props.data.add}.
        </div>
      </div>
      <Divider style={{ margin: "5px 0px" }} />

      <div
        className="table-KOT"
        id="style-1"
        style={{ overflow: "hidden auto", height: "55%" }}
      >
        <table
          style={{
            width: "100%",
            flex: 1,
            overflowY: "auto",
            msOverflowY: "auto",
            fontSize: 12,
          }}
        >
          <tbody>
            {KOTDtl.length > 0 &&
              KOTDtl.map((kot) => {
                return (
                  <tr key={kot.SrNo}>
                    <td>
                      {kot.ItemStatus === "RJCT" ? (
                        <span style={{ color: "Red" }}>
                          <strike>
                            {kot.MenuDisplayName}
                            {kot.MenuDisplayDesc !== "" && (
                              <>
                                <br />
                                <i>{kot.MenuDisplayDesc}</i>
                              </>
                            )}
                          </strike>
                        </span>
                      ) : (
                        <>
                          {kot.MenuDisplayName}
                          {kot.MenuDisplayDesc !== "" && (
                            <>
                              <br />
                              <i>{kot.MenuDisplayDesc}</i>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td style={{ width: "10%" }}>
                      {kot.ItemStatus === "RJCT" ? (
                        <span style={{ color: "Red" }}>
                          <strike>{kot.Qty}</strike>
                        </span>
                      ) : (
                        <>{kot.Qty}</>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {kot.ItemStatus === "RJCT" ? (
                        <span style={{ color: "Red" }}>
                          <strike>
                            {currency.value1}
                            {kot.Amount}
                          </strike>
                        </span>
                      ) : (
                        <>
                          {currency.value1}
                          {kot.Amount}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div>
        <table
          style={{
            width: "100%",
          }}
        >
          <tbody>
            <tr style={{ borderTop: "2px dashed #cecece", fontWeight: "600" }}>
              <td width="130">Total</td>
              <td style={{ fontWeight: "600", width: "20%" }}>{calcDtl.Qty}</td>
              <td style={{ textAlign: "right", fontWeight: "600" }}>
                {currency.value1}
                {parseInt(props.data.InvoiceAmount).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        style={{
          height: "20%",
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: 7,
          position: "relative",
          top: 12,
        }}
      >
        {props.data.IsShowDispatch === "Y" && (
          <Button
            size="small"
            type="primary"
            style={{
              // flex: 1,
              margin: "0px 3px",
              backgroundColor: "#54a2b8",
              borderColor: "#54a2b8",
            }}
            disabled={props.data.DispatchDTTM !== null}
            icon={<CompassOutlined />}
            onClick={() => {
              swal("Are you sure you want to do this?", {
                buttons: ["Cancel", "Yes!"],
              }).then((val) => {
                if (val) {
                  let data = {
                    KOTId: props.data.KOTId,
                    KOTStatus: "DISPATCH",
                    KOTRemark: "",
                    UpdtUsr: props.data.username,
                  };
                  updtKOTStatus(CompCode, data).then((res) => {
                    if (res.message && res.message === "successful") {
                      let tempData = {
                        InvoiceId: props.data.InvoiceId,
                      };
                      raiseEvent(CompCode, "DISPATCH", tempData).then((res) => {
                        if (res) {
                          props.refreshScreen();
                        }
                      });
                    }
                  });
                }
              });
            }}
          >
            <span style={{ fontWeight: "600" }}>Dispatch</span>
          </Button>
        )}
        {props.data.IsShowReady === "Y" && (
          <Button
            size="small"
            type="primary"
            style={{
              // flex: 1,
              margin: "0px 3px",
            }}
            onClick={() => {
              swal("Are you sure you want to do this?", {
                buttons: ["Cancel", "Yes!"],
              }).then((val) => {
                if (val) {
                  let data = {
                    KOTId: props.data.KOTId,
                    KOTStatus: "RDY",
                    KOTRemark: "",
                    UpdtUsr: props.data.username,
                  };
                  updtKOTStatus(CompCode, data).then((res) => {
                    if (res.message && res.message === "successful") {
                      let kotData = {
                        KOTId: [props.data.KOTId],
                        KOTStatus: "RDY",
                        KOTRemark: "",
                        UpdtUsr: props.data.username,
                      };
                      uptRestarantPosKOTdtlStatus(CompCode, kotData)
                        .then((res) => props.refreshScreen())
                        .catch((err) => console.log(err));
                    }
                  });
                }
              });
            }}
            icon={<CheckCircleOutlined />}
          >
            <span style={{ fontWeight: "600" }}>Ready</span>
          </Button>
        )}
        {props.data.IsShowSettled === "Y" && (
          <Button
            size="small"
            type="primary"
            style={{
              // flex: 1,
              margin: "0px 3px",
              backgroundColor: "#ffc117",
              borderColor: "#ffc117",
            }}
            icon={<FileProtectOutlined />}
            onClick={() => {
              setSettleModal(true);
            }}
          >
            <span style={{ fontWeight: "600" }}>Settle</span>
          </Button>
        )}
        {props.data.IsShowCancel === "Y" && (
          <Button
            size="small"
            type="danger"
            style={{
              //  flex: 0.25,
              margin: "0px 3px",
            }}
            icon={<StopOutlined />}
            onClick={() => {
              swal("Are you sure you want to cancel please give a Remark?", {
                buttons: ["Cancel", "Yes!"],
                content: "input",
              }).then((val) => {
                if (val) {
                  let pData = {
                    KOTId: props.data.KOTId,
                    KOTStatus: "CNL",
                    KOTRemark: val,
                    UpdtUsr: props.data.username,
                    ReadyDTTM: null,
                    DispatchDTTM: null,
                  };
                  updtKOTStatus(CompCode, pData).then((res) => {
                    if (res.message && res.message === "successful") {
                      props.refreshScreen();
                    }
                  });
                }
              });
            }}
          >
            <span style={{ fontWeight: "600" }}>Cancel</span>
          </Button>
        )}
        {props.data.KOT_Status === "PND" && (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item className="custom-menu">
                  <div
                    className="ant-btn ant-btn-primary"
                    type="primary"
                    icon={<FileAddOutlined />}
                    style={{
                      margin: "0px 0px",
                      marginRight: 0,
                    }}
                    onClick={() => {
                      setVoidBillModal(true);
                    }}
                  >
                    Void Bill
                  </div>
                </Menu.Item>
              </Menu>
            }
            placement="topCenter"
          >
            <Button
              size="small"
              style={{ flex: 1, margin: "0px 3px", marginRight: 5 }}
              icon={<SettingFilled />}
              type="primary"
            />
          </Dropdown>
        )}
        {props.data.KOT_Status === "RDY" && (
          <Button
            type="primary"
            size="small"
            style={{
              //  flex: 0.25,
              margin: "0px 3px",
            }}
            onClick={async () => {
              setShowRefundModal(true);
            }}
          >
            Void Bill
          </Button>
        )}
      </div>
      <Modal
        maskClosable={false}
        visible={settleModal}
        title={"Bill Settlement"}
        onCancel={() => setSettleModal(false)}
        footer={false}
        bodyStyle={{ padding: 0 }}
        destroyOnClose={true}
        width={750}
        closeIcon={null}
      >
        <SettleBillComponent
          comp={{ ...props, EntryMode: { EntryType: props.data.OrderType } }}
          // totalData={TotalData}
          // lastKOTId={lastKOTId}
          // customer={customerForm}
          refreshScreen={() => props.refreshScreen()}
          onBackPress={() => setSettleModal(false)}
          // CloseKOT={() => props.onBackPress()}
        />
      </Modal>
      <Modal
        maskClosable={false}
        visible={voidBillModal}
        // title={"Void Bill"}
        onCancel={() => setVoidBillModal(false)}
        footer={false}
        bodyStyle={{ padding: 0 }}
        destroyOnClose={true}
        width={750}
        closeIcon={null}
        closable={false}
      >
        {KOTDtl.length > 0 ? (
          <VoidBillComponent
            EntryMode={props.data}
            InvoiceId={props.data.InvoiceId}
            onBackPress={() => {
              setVoidBillModal(false);
            }}
            onSavePress={() => {
              setVoidBillModal(false);
              props.refreshScreen();
            }}
            selectedMenu={KOTDtl}
            // onClearTable={(invDtl) => {
            //   let kotData = {
            //     KOTId: [...new Set(selectedMenu.map((item) => item.KOTId))],
            //     KOTStatus: "CMP",
            //     UpdtUsr: loginInfo.username,
            //   };
            //   uptRestarantPosKOTHdrStatus(kotData).then((res) => {
            //     let kotDataDtl = [];
            //     invDtl.forEach(async (row) => {
            //       await kotDataDtl.push({
            //         Id: row.SysOption2,
            //         KOTId: row.SysOption1,
            //         ItemStatus: "RJCT",
            //         UpdtUsr: loginInfo.username,
            //       });
            //     });
            //     updtRestaurantPOSKOTDtlStatus(kotDataDtl)
            //       .then((res) => {
            //         let tblData = {
            //           data: {
            //             ...props.EntryMode.TableInfo,
            //             SysOption1: null,
            //             SysOption2: null,
            //             SysOption3: null,
            //             SysOption4: null,
            //             SysOption5: null,
            //             Status: "BLANK",
            //             UpdtUsr: loginInfo.username,
            //             CompCode: CompCode,
            //             BranchCode: BranchConfigs.value1,
            //             DeptCode: "DINEIN",
            //             TableType: props.EntryMode.TableInfo.TableType,
            //             TableSec: props.EntryMode.TableInfo.SecCode,
            //             IsActive: 1,
            //           },
            //         };
            //         saveTableStatus(tblData).then((res) => {
            //           props.onBackPress();
            //         });
            //       })
            //       .catch((err) => {
            //       });
            //   });
            // }}
            CloseKOT={() => setVoidBillModal(false)}
          />
        ) : (
          <div>Generate A Bill</div>
        )}
      </Modal>
      <Modal
        maskClosable={false}
        visible={showRefundModal}
        onCancel={() => setShowRefundModal(false)}
        footer={false}
        bodyStyle={{ padding: 0 }}
        destroyOnClose={true}
        width={815}
        closeIcon={null}
        closable={false}
      >
        <ReceiptRefundComponent
          selectedMenu={KOTDtl}
          onBackPress={() => {
            setShowRefundModal(false);
          }}
          onSavePress={() => {
            props.onBackPress();
            props.refreshScreen();
          }}
          customerForm={null}
          comp={props.data}
          EntryMode={props.data}
          InvoiceId={props.data ? props.data.InvoiceId : null}
        />
      </Modal>
    </Card>
  );
};

export default KOTCardDtl;
