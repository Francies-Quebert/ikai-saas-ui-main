import React, { useState, useEffect } from "react";
import { Table, Typography, Descriptions, Button } from "antd";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector, useDispatch } from "react-redux";
import {
  acceptOrderPortal,
  rejectOrderPortal,
  cancelOrderPortal,
  ProcessOrderScheduleVisits,
} from "../../../store/actions/ordersPortal";
import { hasRight } from "../../../shared/utility";
import {
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined,
  StopOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ServiceOrderTable = (props) => {
  const dispatch = useDispatch();
  const [orderColor, setOrderColor] = useState(props.orderColor);
  const [dateFormat, setDateFormat] = useState(props.dateFormat.value1);
  const currentTran = useSelector((state) => state.currentTran);
  const [ssAleart, setSsAlert] = useState();
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  const showAlert = (actiontype, message) => {
    setSsAlert(
      <SweetAlert
        showCancel
        confirmBtnText="Continue"
        title="Are you sure?"
        onCancel={() => setSsAlert()}
        onConfirm={() => {
          setSsAlert();
          if (actiontype === "accept") {
            props.ActionCompleted(true);
          } else if (actiontype === "reject") {
            props.ActionCompleted(true);
          } else if (actiontype === "cancel") {
            props.ActionCompleted(true);
          } else if (actiontype === "schedule") {
            props.ActionCompleted(true);
          }
        }}
      >
        {message}
      </SweetAlert>
    );
  };

  const columns = [
    { title: "Order Id", dataIndex: "orderid", key: "key", width: "8%" },
    {
      title: "Ordered Date",
      dataIndex: "orderdate",
      align: "center",
      width: "10%",
      render: (value, record) => (
        <Text>{moment(record.orderdate).format(dateFormat)}</Text>
      ),
    },
    {
      title: "Order Status",
      width: "12%",
      dataIndex: "statusDesc",
      align: "center",
      render: (value, record) => {
        return (
          <>
            <div
              style={{
                backgroundColor: orderColor.find(
                  (i) => i.ShortCode === record.OrderStatus
                ).SysOption1,
                borderRadius: 2,
                height: 30,
              }}
            >
              <div style={{ paddingTop: 3 }}>
                <Text
                  style={{
                    color: orderColor.find(
                      (i) => i.ShortCode === record.OrderStatus
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
      title: "Initial Schedule",
      dataIndex: "ScheduledFrom",
      align: "center",
      width: "20%",
      render: (value, record) => {
        return record.ScheduledFrom === record.ScheduledTo ? (
          <Text>
            {moment(record.ScheduledFrom).format(dateFormat)} -{" "}
            {record.slotName}
          </Text>
        ) : (
          <Text>
            {`${moment(record.ScheduledFrom).format(dateFormat)} To 
            ${moment(record.ScheduledTo).format(dateFormat)} ${
              record.slotName
            }`}
          </Text>
        );
      },
    },
  ];

  const border = { borderBottom: "1px solid #f0f0f0" };
  return (
    <>
      {ssAleart}

      <Table
        columns={columns}
        bordered={true}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <>
                <Descriptions
                  style={{ backgroundColor: "#fff" }}
                  size="middle"
                  bordered
                >
                  <Descriptions.Item style={border} span={2} label="Service">
                    <Text style={{ fontWeight: "600" }}>
                      {" "}
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
                  {/* <Descriptions.Item
                    style={border}
                    span={1}
                    label="Payment Status"
                  >
                    {record.PaymentStatus === "UNPAID" ? (
                      <Text type="danger">{record.PaymentStatus}</Text>
                    ) : (
                      <Text style={{ color: "green" }}>
                        {record.PaymentStatus}
                      </Text>
                    )}
                  </Descriptions.Item> */}
                  <Descriptions.Item
                    style={border}
                    span={1}
                    label="Balance Deposit"
                  >
                    <Text >
                      {l_ConfigCurrency.value1} {record.BalDeposit.toFixed(2)}
                    </Text>
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
                  <Descriptions.Item
                    style={(border, { paddingRight: 0 })}
                    span={1}
                    label="Amount"
                  >
                    <Text style={{ fontWeight: "600" }}>
                      {`${l_ConfigCurrency.value1} ${record.NetPayable}`}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ padding: "8px 0px" }}>
                  {record.isShowAccept === "Y" && (
                    <Button
                      icon={<CheckOutlined />}
                      type="primary"
                      style={{ marginLeft: 5 }}
                      disabled={hasRight(currentTran.moduleRights, "ACCEPT")}
                      onClick={() => {
                        showAlert(
                          "accept",
                          "Do you want to accept this booking"
                        );
                        dispatch(acceptOrderPortal(record.orderid));
                      }}
                    >
                      Accept
                    </Button>
                  )}
                  {record.isShowReject === "Y" && (
                    <Button
                      icon={<CloseOutlined />}
                      type="primary"
                      style={{ marginLeft: 5 }}
                      disabled={hasRight(currentTran.moduleRights, "REJECT")}
                      onClick={() => {
                        showAlert(
                          "reject",
                          "Do you want to reject this booking"
                        );
                        dispatch(rejectOrderPortal(record.orderid));
                      }}
                    >
                      Reject
                    </Button>
                  )}
                  {record.isShowSchedule === "Y" && (
                    <Button
                      icon={<CalendarOutlined />}
                      type="primary"
                      style={{ marginLeft: 5 }}
                      onClick={() => {
                        showAlert(
                          "schedule",
                          "Do you want to schedule this booking"
                        );
                        dispatch(ProcessOrderScheduleVisits(record.orderid));
                      }}
                      disabled={hasRight(currentTran.moduleRights, "SCHEDULE")}
                    >
                      Schedule
                    </Button>
                  )}

                  {record.isShowCancel === "Y" && (
                    <Button
                      icon={<StopOutlined />}
                      type="primary"
                      style={{ marginLeft: 5 }}
                      disabled={hasRight(currentTran.moduleRights, "CANCEL")}
                      onClick={() => {
                        showAlert(
                          "cancel",
                          "Do you want to cancel this booking"
                        );
                        dispatch(cancelOrderPortal(record.orderid));
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </>
            );
          },
        }}
        // pagination={{ pageSizeOptions: 25 }}
        pagination={{ pageSize: 25 }}
        dataSource={props.data}
      />
    </>
  );
};

export default ServiceOrderTable;
