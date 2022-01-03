import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Descriptions,
  Button,
  Avatar,
  Modal,
  Menu,
  Tabs,
} from "antd";
import { toast } from "react-toastify";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector, useDispatch } from "react-redux";
import { hasRight, PrintPdfOrFromElectron } from "../../../shared/utility";
import {
  CalendarOutlined,
  StopOutlined,
  MessageOutlined,
  SnippetsOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import CheckInCard from "./CheckInCard";
import RescheduleCard from "./RescheduleCard";
import CheckOutCard from "./CheckOutCard";
import { reInitialize } from "../../../store/actions/currentTran";
import AdditonalCost from "./AdditonalCost";
import {
  CancelSchedule,
  SaveInvoice,
  getInvoicePdf,
  getPreInvoiceDataService,
} from "../../../services/service-managment/service-management";
import { fetchSequenceNextVal } from "../../../shared/utility";
import { sendScheduleSms } from "../../../store/actions/ordersPortal";
import _ from "lodash";
import { Document, Page } from "react-pdf";
import fileDownload from "js-file-download";
import AcknowledgeCard from "./AcknowledgeCard";

const ServiceSchedules = (props) => {
  const { Text } = Typography;
  const { TabPane } = Tabs;
  const dispatch = useDispatch();
  const orderColor = props.orderColor;
  const dateFormat = props.dateFormat.value1;
  const [ssAleart, setSsAlert] = useState();
  const [orderId, setOrderId] = useState();
  const [acknow, setAcknow] = useState({ value: false, data: {} });
  const [scheduleId, setScheduleId] = useState();
  const [viewDetail, setViewDetail] = useState(false);
  const l_LoginUserInfo = useSelector((state) => state.LoginReducer.userData);
  const [refresh, setRefresh] = useState(false);
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  const l_ConfigDateTimeFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((kk) => kk.configCode === "DTTMFORMAT")
        .value1
  );
  const currentTran = useSelector((state) => state.currentTran);
  const ordersPortal = useSelector((state) => state.ordersPortal);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    if (currentTran.isSuccess) {
      toast.success("Data saved successfully...!");
      dispatch(reInitialize());
      props.refreshSaved(orderId ? orderId : null);
    }
  }, [currentTran.isSuccess, props.data]);

  useEffect(() => {
    if (ordersPortal.refreshRequired || refresh) {
      toast.success("Data saved successfully...!");
      // console.log(orderId);
      setRefresh(false);
      props.refreshSaved(orderId ? orderId : null);
    }
  }, [ordersPortal.refreshRequired, refresh]);

  // useEffect(() => {
  //   console.log("re-render");
  //   props.refreshSaved(orderId);
  // }, [refresh]);

  const showAlert = (actiontype, message, orderid, scheduleId) => {
    setSsAlert(
      <SweetAlert
        showCancel
        confirmBtnText="Continue"
        title="Are you sure?"
        onCancel={() => setSsAlert()}
        onConfirm={() => {
          setSsAlert();
          if (actiontype === "cancel") {
            props.ActionCompleted(true);
            dispatch(CancelSchedule(orderid));
          }
        }}
      >
        {message}
      </SweetAlert>
    );
  };

  const showVerificationAlert = (actiontype, message, scheduleId) => {
    return setSsAlert(
      <SweetAlert
        showCancel
        confirmBtnText="Continue"
        title="Are you sure?"
        onCancel={() => setSsAlert()}
        onConfirm={() => {
          setSsAlert();
          if (actiontype === "sendScheduleOTP") {
            dispatch(sendScheduleSms(scheduleId));
            // props.onOTPsend();
          }
        }}
      >
        {message}
      </SweetAlert>
    );
  };

  const columns = [
    { title: "Schedule Id", dataIndex: "ScheduleId", key: "key", width: "8%" },
    { title: "Order Id", dataIndex: "orderid", width: "8%", align: "center" },
    {
      title: "Schedule Date and Slot",
      dataIndex: "ScheduleDate",
      align: "center",
      width: "15%",
      render: (value, record) => (
        <Text>
          {moment(record.ScheduleDate).format(dateFormat)} /{" "}
          {record.ScheduleSlotName}
        </Text>
      ),
    },
    {
      title: "Schedule Status",
      width: "15%",
      dataIndex: "ScheduleStatus",
      align: "center",
      render: (value, record) => {
        return (
          <>
            <div
              style={{
                backgroundColor: orderColor.find(
                  (i) => i.ShortCode === record.ScheduleStatusCode
                ).SysOption1,
                borderRadius: 2,
                height: 30,
              }}
            >
              <div style={{ paddingTop: 3 }}>
                <Text
                  style={{
                    color: orderColor.find(
                      (i) => i.ShortCode === record.ScheduleStatusCode
                    ).SysOption2,
                  }}
                >
                  {value}
                </Text>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: "Customer Name",
      dataIndex: "userName",
      width: "20%",
      align: "center",
      render: (value, record) => (
        <Text>
          {value} ({record.mobile})
        </Text>
      ),
    },
    {
      title: "Order Title",
      dataIndex: "orderTitle",
      align: "center",
      render: (value, record) => <Text>{value}</Text>,
    },

    {
      title: "Package Name",
      dataIndex: "PackageTitle",
      align: "center",
      width: "20%",
      render: (value, record) => {
        return <Text>{record.PackageTitle}</Text>;
      },
    },
  ];

  // console.log(viewDetail, "data");

  const border = { borderBottom: "1px solid #f0f0f0" };
  return (
    <>
      {ssAleart}
      <Modal
        title="Acknowledge"
        bodyStyle={{ padding: "0px 0px", height: "auto" }}
        width="70%"
        onCancel={() => {
          setAcknow({ value: false });
        }}
        visible={acknow.value}
        footer={null}
        destroyOnClose={true}
      >
        <AcknowledgeCard
          data={acknow.data}
          onBackPress={(id) => {
            setOrderId(id);
            setRefresh(true);
            setAcknow({ value: false });
          }}
        />
      </Modal>
      <Modal
        title="View Detail"
        bodyStyle={{ padding: "0px 0px", height: "auto" }}
        width="70%"
        onCancel={() => {
          setViewDetail(false);
        }}
        visible={viewDetail}
        footer={null}
        destroyOnClose={true}
      >
        <Tabs tabPosition={"left"} tabBarStyle={{ textAlign: "left" }}>
          <TabPane tab="Schedule Info" key="1">
            <RescheduleCard
              OrderId={orderId}
              ScheduleId={scheduleId}
              onScheduleBack={() => setViewDetail(false)}
            />
          </TabPane>
          <TabPane tab="Checked In" key="2" forceRender={true}>
            <CheckInCard
              viewDetail={viewDetail}
              OrderId={orderId}
              ScheduleId={scheduleId}
              onCheckInBack={() => setViewDetail(false)}
            />
          </TabPane>
          <TabPane tab="Checked Out" key="3">
            <CheckOutCard
              OrderId={orderId}
              ScheduleId={scheduleId}
              onCheckOutBack={() => setViewDetail(false)}
            />
          </TabPane>
          <TabPane tab="Additional Cost" key="4">
            <AdditonalCost
              OrderId={orderId}
              ScheduleId={scheduleId}
              IsSaveDisabled={
                viewDetail &&
                (viewDetail.ScheduleStatusCode === "CMP" ||
                  viewDetail.InvoiceGenStatus === "Y")
                  ? true
                  : false
              }
              onAddCostBack={() => setViewDetail(false)}
            />
          </TabPane>
        </Tabs>
      </Modal>
      <Table
        columns={columns}
        bordered={true}
        expandable={{
          expandedRowRender: (record) => {
            // console.log(record, "data");
            return (
              <>
                <Descriptions
                  style={{ backgroundColor: "#fff" }}
                  size="middle"
                  bordered
                  className="schedule-descriptions"
                >
                  <Descriptions.Item style={border} span={2} label="Service">
                    <Text style={{ fontWeight: "600" }}>
                      {record.ServiceTitle}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item style={border} span={1} label="Unit">
                    {record.PackageUnit}
                  </Descriptions.Item>
                  <Descriptions.Item style={border} span={2} label="Package">
                    <Text style={{ fontWeight: "600" }}>
                      {record.PackageTitle}{" "}
                    </Text>
                    {record.PackageDesc !== "" && (
                      <Text type="secondary">{`(${record.PackageDesc})`}</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    style={border}
                    span={1}
                    label="Package Unit"
                  >
                    {`${record.PackageUnit}  ${record.PackageUnitDesc}`}
                  </Descriptions.Item>

                  <Descriptions.Item style={border} span={2} label="Address">
                    <Text>
                      {record.add1},&nbsp;{record.add2}
                      {record.add3 ? `, ${record.add3}` : ""}
                      ,&nbsp;{record.City},&nbsp;{record.Pin}
                    </Text>
                    <br />
                    {record.geoLocationName && (
                      <Text>({record.geoLocationName})</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    style={border}
                    span={1}
                    label="Balance Deposit"
                  >
                    {l_ConfigCurrency.value1} {record.BalDeposit.toFixed(2)}
                    {/* {record.PaymentStatus === "UNPAID" ? (
                      <Text type="danger">{record.PaymentStatus}</Text>
                    ) : (
                      <Text style={{ color: "green" }}>
                        {record.PaymentStatus}
                      </Text>
                    )} */}
                  </Descriptions.Item>
                  <Descriptions.Item
                    style={border}
                    span={1}
                    label="Gross Total"
                  >
                    {l_ConfigCurrency.value1} {record.GrossTotal}
                  </Descriptions.Item>
                  <Descriptions.Item style={border} span={1} label="Discount">
                    {l_ConfigCurrency.value1} {record.disc}
                  </Descriptions.Item>
                  <Descriptions.Item style={border} span={1} label="Amount">
                    {l_ConfigCurrency.value1}{" "}
                    <Text style={{ fontWeight: "600" }}>
                      {record.NetPayable}
                    </Text>
                  </Descriptions.Item>

                  {record.ScheduleStatusCode !== "UAS" && (
                    <>
                      <Descriptions.Item
                        style={border}
                        span={1}
                        label="Attendant Name"
                      >
                        <div style={{ display: "flex" }}>
                          <Avatar
                            size={32}
                            shape="square"
                            src={record.ProfilePicture}
                          />
                          <div
                            style={{
                              marginLeft: 5,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {record.EmpName}
                          </div>
                        </div>
                      </Descriptions.Item>
                      <Descriptions.Item
                        style={border}
                        span={1}
                        label="Verification Code"
                      >
                        <Text style={{ fontWeight: "600" }}>
                          {record.VerificationCode}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item
                        style={border}
                        span={1}
                        label="Variable Cost"
                      >
                        {l_ConfigCurrency.value1} {record.VariableCost}
                      </Descriptions.Item>
                      <Descriptions.Item
                        style={border}
                        span={1}
                        label="Checked In"
                      >
                        {record && record.CheckInDTTM === null
                          ? "Not checked in yet"
                          : moment(record.CheckInDTTM).format(
                              l_ConfigDateTimeFormat
                            )}
                      </Descriptions.Item>
                      <Descriptions.Item
                        style={border}
                        span={1}
                        label="Checked Out"
                      >
                        {record && record.CheckOutDTTM === null
                          ? "Not checked out yet"
                          : moment(record.CheckOutDTTM).format(
                              l_ConfigDateTimeFormat
                            )}
                      </Descriptions.Item>
                    </>
                  )}
                </Descriptions>
                <div style={{ padding: "8px 0px" }}>
                  <Button
                    icon={<CalendarOutlined />}
                    type="primary"
                    style={{ marginLeft: 5 }}
                    onClick={() => {
                      // console.log(record, "daata");
                      setViewDetail(record);
                      setOrderId(record.orderid);
                      setScheduleId(record.ScheduleId);
                    }}
                  >
                    View Detail
                  </Button>
                  {record.InvoiceId === null && (
                    <Button
                      icon={<StopOutlined />}
                      type="primary"
                      style={{ marginLeft: 5 }}
                      disabled={hasRight(currentTran.moduleRights, "CANCEL")}
                      onClick={() => {
                        showAlert(
                          "cancel",
                          "Do you want to cancel this booking",
                          record.orderid
                        );
                      }}
                    >
                      Cancel Schedule
                    </Button>
                  )}
                  {record.ScheduleStatusCode !== ("COT", "UAS") && (
                    <Button
                      icon={<MessageOutlined />}
                      type="danger"
                      style={{ marginLeft: 5 }}
                      onClick={() => {
                        // console.log(record, "daata");
                        // setViewDetail(true);
                        // setOrderId(record.orderid);
                        // setScheduleId(record.ScheduleId);
                        setOrderId(record.orderid);
                        showVerificationAlert(
                          "sendScheduleOTP",
                          "Do you want to send OTP for this Schedule",
                          record.ScheduleId
                        );
                        // showAlert(
                        //   "verification",
                        //   "Do you want to send verification code for this schedule.",
                        //   record.orderid,
                        //   scheduleId
                        // );
                      }}
                      disabled={record.VerificationCode}
                    >
                      {record.VerificationCode
                        ? record.VerificationCode
                        : `Send Verification Code`}
                    </Button>
                  )}
                  {record.InvoiceId > 0 && (
                    <Button
                      icon={<SnippetsOutlined />}
                      type="primary"
                      style={{
                        marginLeft: 5,
                        backgroundColor: "#4275db",
                        borderColor: "#4275db",
                      }}
                      onClick={() => {
                        let dataType = "pdf";
                        if (window.electron) {
                          dataType = "html";
                        }
                        getInvoicePdf(
                          CompCode,
                          true,
                          record.InvoiceId,
                          dataType
                        ).then((res) => {
                          PrintPdfOrFromElectron(
                            res,
                            `#${record.InvoiceNo}`,
                            dataType
                          );
                        });
                      }}
                    >
                      {`View Invoice #${record.InvoiceNo}`}
                    </Button>
                  )}
                  {record.ScheduleStatusCode === "COT" && (
                    <Button
                      icon={<CheckCircleOutlined />}
                      type="primary"
                      style={{
                        marginLeft: 5,
                        backgroundColor: "#54a2b8",
                        borderColor: "#54a2b8",
                      }}
                      disabled={hasRight(currentTran.moduleRights, "ACKNOW")}
                      onClick={() => {
                        setAcknow({ value: true, data: record });
                      }}
                    >
                      Acknowledge
                    </Button>
                  )}
                  {record.ScheduleStatusCode === "COT" &&
                    record.InvoiceId === null && (
                      <Button
                        icon={<SnippetsOutlined />}
                        type="primary"
                        style={{
                          marginLeft: 5,
                          backgroundColor: "#4275db",
                          borderColor: "#4275db",
                        }}
                        disabled={!parseFloat(record.InvoicableAmount) > 0}
                        onClick={() => {
                          //Get Invoicable Data
                          // console.log();

                          getPreInvoiceDataService(
                            CompCode,
                            record.orderid,
                            record.ScheduleId
                          ).then((invoicebleData) => {
                            // console.log("got some data", invoicebleData);
                            if (invoicebleData.length > 0) {
                              let InvoiceHdr;
                              let InvoiceDtl = [];

                              let CustGSTStateCode = 27;
                              let CompanyGSTStateCode = 27;

                              //

                              //Get New Invoice No first
                              fetchSequenceNextVal(
                                CompCode,
                                "INV",
                                l_LoginUserInfo.username
                              ).then((seqNextVal) => {
                                if (seqNextVal[0].NextVal) {
                                  // console.log(
                                  //   "Invoice No",
                                  //   seqNextVal[0].NextVal
                                  // );

                                  //prepare data

                                  let l_SumGrossAmount = 0;
                                  let l_SumDiscValue = 0;
                                  let l_SumNetAmount = 0;
                                  let l_SumSGST = 0;
                                  let l_SumCGST = 0;
                                  let l_SumIGST = 0;
                                  let l_SumUTGST = 0;
                                  let l_SumCess = 0;
                                  let l_SumSurcharge = 0;

                                  invoicebleData.forEach((row) => {
                                    // console.log("each row", row);
                                    let totalTaxPerc =
                                      parseFloat(row.CGSTPer) +
                                      parseFloat(row.SGSTPer) +
                                      parseFloat(row.SURCHARGPer) +
                                      parseFloat(row.CESSPer);
                                    let l_TaxExclusionAmount = _.round(
                                      (parseFloat(row.netValue) /
                                        (100 + totalTaxPerc)) *
                                        100,
                                      3
                                    );

                                    // console.log(
                                    //   "ssss",
                                    //   totalTaxPerc,
                                    //   l_TaxExclusionAmount
                                    // );

                                    l_SumGrossAmount += parseFloat(row.rate);
                                    l_SumDiscValue += parseFloat(row.discVal);
                                    l_SumNetAmount += l_TaxExclusionAmount;
                                    let l_SGST = _.round(
                                      (l_TaxExclusionAmount *
                                        parseFloat(row.SGSTPer)) /
                                        100,
                                      3
                                    );

                                    let l_CGST = _.round(
                                      (l_TaxExclusionAmount *
                                        parseFloat(row.CGSTPer)) /
                                        100,
                                      3
                                    );

                                    let l_IGST = _.round(
                                      false
                                        ? (l_TaxExclusionAmount *
                                            parseFloat(row.IGSTPer)) /
                                            100
                                        : 0,
                                      3
                                    );

                                    let l_UTGST = _.round(
                                      false
                                        ? (l_TaxExclusionAmount *
                                            parseFloat(row.UTSTPer)) /
                                            100
                                        : 0,
                                      3
                                    );

                                    let l_Cess = _.round(
                                      (l_TaxExclusionAmount *
                                        parseFloat(row.CESSPer)) /
                                        100,
                                      3
                                    );

                                    let l_Surcharge = _.round(
                                      (l_TaxExclusionAmount *
                                        parseFloat(row.SURCHARGPer)) /
                                        100,
                                      3
                                    );

                                    l_SumSGST += l_SGST;
                                    l_SumCGST += l_CGST;
                                    l_SumIGST += l_IGST;
                                    l_SumUTGST += l_UTGST;
                                    l_SumCess += l_Cess;
                                    l_SumSurcharge += l_Surcharge;

                                    InvoiceDtl.push({
                                      SrNo: row.row_num,
                                      ItemType: row.ItemType,
                                      ItemCode: row.ItemCode,
                                      ItemName: row.ItemName,
                                      ItemDesc: row.ItemDesc,
                                      HSNSACCode: row.HSNSACCode,
                                      TaxCode: row.TaxCode,
                                      UnitCode: row.unitDesc,
                                      UnitName: row.unitDesc,
                                      Qty: row.Qty,
                                      Rate: row.rate,
                                      Disc: row.discVal,
                                      Amount: l_TaxExclusionAmount,
                                      SGST: l_SGST,
                                      CGST: l_CGST,
                                      UGST: l_UTGST,
                                      IGST: l_IGST,
                                      Surcharge: l_Surcharge,
                                      Cess: l_Cess,
                                      SysOption1: row.OrderId,
                                      SysOption2: row.ScheduleId,
                                      SysOption3: "",
                                      SysOption4: "",
                                      SysOption5: "",
                                      UpdtUsr: l_LoginUserInfo.username,
                                    });
                                  });
                                  let l_SumOfTaxAmount =
                                    l_SumCGST +
                                    l_SumSGST +
                                    l_SumUTGST +
                                    l_SumIGST +
                                    l_SumSurcharge +
                                    l_SumCess;

                                  let l_NetValue = _.round(
                                    l_SumNetAmount + l_SumOfTaxAmount,
                                    3
                                  );
                                  let l_RoundOffAmount = _.round(
                                    _.round(l_NetValue, 0) - l_NetValue,
                                    3
                                  );

                                  let InvoiceScheduleNo = 0;
                                  InvoiceDtl.forEach((row) => {
                                    if (row.SysOption2 > 0) {
                                      InvoiceScheduleNo = row.SysOption2;
                                    }
                                  });
                                  InvoiceHdr = {
                                    InvoiceNo: seqNextVal[0].NextVal,
                                    InvoiceDate: moment().format("YYYY-MM-DD"),
                                    CustId: invoicebleData[0].OrderedUserId,
                                    CustAddressId: invoicebleData[0].AddressId,
                                    SysOption1: invoicebleData[0].OrderId,
                                    SysOption2: InvoiceScheduleNo, // invoicebleData[0].ScheduleId,
                                    SysOption3: "",
                                    SysOption4: "",
                                    SysOption5: "",
                                    InvoiceRemark: "",
                                    GrossAmount: _.round(l_SumGrossAmount, 3),
                                    DiscAmount: _.round(l_SumDiscValue, 3),
                                    TaxAmount: _.round(l_SumOfTaxAmount, 3),
                                    RoundOff: l_RoundOffAmount,
                                    InvoiceAmount:
                                      l_NetValue + l_RoundOffAmount,
                                    SettlementAmount: 0,
                                    UpdtUsr: l_LoginUserInfo.username,
                                  };
                                  // console.log("invdtl", InvoiceDtl, InvoiceHdr);

                                  //Save call
                                  SaveInvoice(
                                    CompCode,
                                    InvoiceHdr,
                                    InvoiceDtl
                                  ).then((res) => {
                                    // console.log(
                                    //   "invoice save response",
                                    //   res,
                                    //   record
                                    // );
                                    let dataType = "pdf";
                                    if (window.electron) {
                                      dataType = "html";
                                    }
                                    if (res.data.data) {
                                      getInvoicePdf(
                                        CompCode,
                                        true,
                                        res.data.data.InvoiceId,
                                        dataType
                                      ).then((response) => {
                                        PrintPdfOrFromElectron(
                                          res,
                                          `#${res.data.data.invoiceNo}`,
                                          dataType
                                        );
                                      });
                                      setRefresh(true);
                                    }
                                  });
                                } else {
                                  alert(
                                    "Invoice Number config not defined. Contact System Administrator"
                                  );
                                }
                              });
                            }
                          });
                          setOrderId(record.orderid);
                        }}
                      >
                        Generate Invoice
                      </Button>
                    )}
                </div>
              </>
            );
          },
        }}
        pagination={{ pageSize: 25 }}
        dataSource={props.data}
      />
    </>
  );
};

export default ServiceSchedules;
