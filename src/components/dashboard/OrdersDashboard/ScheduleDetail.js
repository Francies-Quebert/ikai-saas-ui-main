import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DatePicker,
  Modal,
  Descriptions,
  Select,
  Input,
  Button,
  Avatar,
  TimePicker,
} from "antd";
import {
  SaveOutlined,
  RetweetOutlined,
  RollbackOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  fetchCheckInOrder,
  fetchCheckOutOrder,
  fetchAddOnCostOrder,
  InsUpdateCheckInOrder,
  InsUpdateCheckOutOrder,
  InsUpdateScheduleAddOnCostOrder,
} from "../../../store/actions/orders";

import AppLoader from "../../common/AppLoader";
import AppError from "../../common/AppError";
import moment from "moment";
// import AddOnTable from "./AddOnTable";
import AddOnTable from "./AddOnTableNew";
const ScheduleItem = (props) => {
  return (
    <>
      <div className="col-md-5 m-t-2">
        <p className="f-w-600 m-0" style={{ fontSize: 12 }}>
          {props.label} :
        </p>
      </div>
      <div
        className="col-md-7"
        style={{
          textAlign: "justify",
          color: "#777",
          fontSize: 12,
          alignItems: "flex-end",
          display: "flex",
        }}
      >
        {props.desc}
      </div>
    </>
  );
};

const ScheduleHeader = (props) => {
  return (
    <div className="d-flex justify-content-center">
      <h6>{props.title} </h6>
      {props.showEditButton === true && (
        <div style={{ position: "absolute", right: 15 }}>
          <i className="fa fa-pencil" onClick={props.onEditClick}></i>
        </div>
      )}
    </div>
  );
};

const AdditionalCostItem = (props) => {
  return (
    <div
      className="row m-t-5"
      style={{ paddingLeft: 30, display: "flex", paddingRight: 30 }}
    >
      <div style={{ flex: 0.1 }}>{props.srNo}</div>
      <div style={{ flex: 1 }}>{props.description} </div>
      <span>&#8377;{props.amount}</span>
    </div>
  );
};

const ScheduleDetail = (props) => {
  const dispatch = useDispatch();
  const { TextArea } = Input;

  //useState
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [showAddOn, setShowAddOn] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [selectedTime, setSelectedTime] = useState();
  const [remark, setRemark] = useState("");
  const [observation, setObservation] = useState("");
  const [resolution, setResolution] = useState("");
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState(new Date());
  const [selectedCheckOutTime, setSelectedCheckOutTime] = useState({
    hour: moment(new Date()).format("HH"),
    minute: moment(new Date()).format("mm"),
  });

  //useSelector
  const currentTran = useSelector((state) => state.currentTran);
  const employeeMaster = useSelector(
    (state) => state.employeeMaster.employeeMasters
  );
  const ordersDetail = useSelector((state) => state.orders);
  const ordersPortal = useSelector(
    (state) => state.ordersPortal.currentOrderScheduleVisits
  );
  const addOnCost = useSelector((state) => state.orders.addOnCost);

  //useEffect
  useEffect(() => {
    {
      props.scheduleId &&
        dispatch(fetchCheckInOrder(props.scheduleId)) &&
        dispatch(fetchCheckOutOrder(props.scheduleId)) &&
        dispatch(fetchAddOnCostOrder(props.scheduleId));
    }
  }, [props.scheduleId]);

  useEffect(() => {
    {
      props.scheduleId &&
        dispatch(fetchCheckInOrder(props.scheduleId)) &&
        dispatch(fetchCheckOutOrder(props.scheduleId)) &&
        dispatch(fetchAddOnCostOrder(props.scheduleId));
    }
  }, [currentTran.lastSavedData]);

  useEffect(() => {
    setSelectedTime(
      props.scheduleId &&
        ordersDetail[0] &&
        ordersDetail.orderCheckIn[0] &&
        ordersDetail.orderCheckIn[0].CheckInDTTM != null
        ? `${moment(ordersDetail.orderCheckIn[0].CheckInDTTM).format(
            "HH"
          )}:${moment(ordersDetail.orderCheckIn[0].CheckInDTTM).format(
            "HH"
          )}:00`
        : `${moment().format("HH")}:${moment().format("mm")}:00`
    );
  }, [ordersDetail.orderCheckIn]);

  useEffect(() => {
    setSelectedCheckOutTime(
      props.scheduleId &&
        ordersDetail[0] &&
        ordersDetail.orderCheckOut[0] &&
        ordersDetail.orderCheckOut[0].CheckOutDTTM != null
        ? `${moment(ordersDetail.orderCheckOut[0].CheckOutDTTM).format(
            "HH"
          )}:${moment(ordersDetail.orderCheckOut[0].CheckOutDTTM).format(
            "HH"
          )}:00`
        : `${moment().format("HH")}:${moment().format("mm")}:00`
    );
  }, [ordersDetail.orderCheckOut]);

  //onCheckinSubmit
  const onCheckinSubmit = () => {
    dispatch(
      InsUpdateCheckInOrder(
        props.scheduleId,
        props.OrderId,
        moment(selectedDate).format("YYYY-MM-DD").concat(" ", selectedTime)
      )
    );
    setShowCheckIn(!showCheckIn);
    dispatch(fetchCheckInOrder(props.scheduleId));
    setDataSaved(!dataSaved);
  };

  //onCheckOutSubmit
  const onCheckOutSubmit = () => {
    dispatch(
      InsUpdateCheckOutOrder(
        props.scheduleId,
        props.OrderId,
        moment(selectedCheckOutDate)
          .format("YYYY-MM-DD")
          .concat(" ", selectedCheckOutTime),
        observation,
        resolution,
        remark
      )
    );
    setDataSaved(!dataSaved);
    setShowCheckOut(!showCheckOut);
  };

  //AddOnSubmit
  const onAddOnSubmit = () => {
    // console.log(addOnCost, "addon");
    dispatch(InsUpdateScheduleAddOnCostOrder(addOnCost));
    setDataSaved(!dataSaved);
    setShowAddOn(!showAddOn);
  };

  // onBackPress
  const onCheckInBack = () => {
    setShowCheckIn(!showCheckIn);
  };

  const onCheckOutBack = () => {
    setShowCheckOut(!showCheckOut);
  };

  const onAddonBack = () => {
    setShowAddOn(!showAddOn);
  };

  // Disabled date
  function disabledDate(current) {
    return current && current < moment().endOf("day");
  }

  let renderItems = null;
  if (ordersDetail.isLoading) {
    renderItems = <AppLoader />;
  } else if (props.EmpAssigned) {
    renderItems = (
      <AppError
        ErrorTitle="No Employee Selected"
        ErrorDesc="Assign An Employee"
      />
    );
  } else if (ordersDetail.error) {
    renderItems = (
      <AppError ErrorTitle="Error" ErrorDesc={ordersDetail.error} />
    );
  } else if (!props.scheduleId) {
    renderItems = (
      <div className="card-body typography">
        <blockquote className="blockquote p-b-0">
          <h4 className="h4 txt-info">No Schedule selected</h4>
          <footer className="blockquote-footer p-t-0 p-b-0">
            Select a Schedule
          </footer>
        </blockquote>
      </div>
    );
  } else if (props.scheduleId && ordersDetail.orderCheckIn) {
    renderItems = (
      <div className="checkout m-1">
        <div className="checkout-details p-2">
          <ScheduleHeader
            showEditButton={props.Status !== "COT"}
            title="Check In"
            onEditClick={() => {
              setShowCheckIn(!showCheckIn);
            }}
          />
          <hr className="m-0" />
          <div className="row">
            <div className="col-3">
              {/* <div class="col-3 p-r-0"> */}
              <div className="m-1">
                {ordersPortal &&
                  ordersPortal
                    .filter((i) => i.ScheduleId === props.scheduleId)
                    .map((item) => {
                      const profilePic = employeeMaster
                        ? employeeMaster.find(
                            (ii) => ii.Id === item.AttendantId
                          )
                        : null;
                      return (
                        <Avatar
                          shape="square"
                          size={64}
                          src={
                            profilePic ? (
                              profilePic.ProfilePicture
                            ) : (
                              <UserOutlined />
                            )
                          }
                        />
                      );
                    })}
              </div>
            </div>
            <div
              className="col-9 align-items-center p-0"
              style={{
                display: "block",
                marginTop: "auto",
                marginBottom: "auto",
                textAlign: "left",
              }}
            >
              <div className="">
                <p className="f-w-600 m-0" style={{ fontSize: 12 }}>
                  Check In Date Time :
                  <span
                    className="price"
                    style={{ color: "#777", fontSize: 11 }}
                  >
                    {ordersDetail.orderCheckIn &&
                    ordersDetail.orderCheckIn[0] &&
                    ordersDetail.orderCheckIn[0] != null
                      ? moment(ordersDetail.orderCheckIn[0].CheckInDTTM).format(
                          "DD-MM-YYYY HH:mm"
                        )
                      : `Not Checked in yet`}
                  </span>
                </p>
              </div>
              <div className="">
                <p className="f-w-600 m-0" style={{ fontSize: 12 }}>
                  Check In Location :
                  <span
                    className="price"
                    style={{ color: "#777", fontSize: 10 }}
                  >
                    <input
                      type="button"
                      value="Go to location"
                      className="btn btn-info btn-sm customBtn"
                    />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="checkout-details p-2 m-t-10">
          <ScheduleHeader
            showEditButton={props.Status !== "COT"}
            title="Check Out"
            onEditClick={() => {
              setObservation(
                ordersDetail.orderCheckOut.length > 0
                  ? ordersDetail.orderCheckOut[0].Observation
                  : ""
              );
              setRemark(
                ordersDetail.orderCheckOut.length > 0
                  ? ordersDetail.orderCheckOut[0].CheckOutRemark
                  : ""
              );
              setResolution(
                ordersDetail.orderCheckOut.length > 0
                  ? ordersDetail.orderCheckOut[0].Resolution
                  : ""
              );
              setShowCheckOut(true);
            }}
          />
          <hr className="m-0" />
          {ordersDetail.orderCheckOut != null &&
            ordersDetail.orderCheckOut.length > 0 &&
            ordersDetail.orderCheckOut.map((iii) => (
              <div
                className="row m-t-5"
                style={{ paddingLeft: 12, paddingRight: 12 }}
              >
                <ScheduleItem
                  label="Observation"
                  desc={iii.Observation != null ? `${iii.Observation}` : `N/A`}
                />

                <ScheduleItem
                  label="Resolution"
                  desc={iii.Resolution != null ? `${iii.Resolution}` : `N/A`}
                />

                <ScheduleItem
                  label="Remark"
                  desc={
                    iii.CheckOutRemark != null ? `${iii.CheckOutRemark}` : `N/A`
                  }
                />

                <ScheduleItem
                  label="Check Out Date &amp; Time"
                  desc={
                    iii.CheckOutDTTM != null
                      ? `${moment(iii.CheckOutDTTM).format("DD-MM-YYYY/HH:mm")}`
                      : `N/A`
                  }
                />
              </div>
            ))}
          {ordersDetail.orderCheckOut &&
            ordersDetail.orderCheckOut.length <= 0 && (
              <div className="col-md-12 m-t-2">
                <p
                  className="f-w-600 m-0 d-flex justify-content-center"
                  style={{ fontSize: 12 }}
                >
                  Attendant has Not Check Out Yet
                </p>
              </div>
            )}
        </div>
        <div className="checkout-details p-2 m-t-10">
          <ScheduleHeader
            showEditButton={props.Status !== "COT"}
            title="Additional Cost"
            onEditClick={() => {
              setShowAddOn(!showAddOn);
            }}
          />
          <hr className="m-0" />
          {ordersDetail.orderAddOnCost !== null &&
            ordersDetail.orderAddOnCost.length <= 0 && (
              <AdditionalCostItem
                srNo="#"
                description="No Product"
                amount="0"
              />
            )}
          {ordersDetail.orderAddOnCost !== null &&
            ordersDetail.orderAddOnCost.length > 0 &&
            ordersDetail.orderAddOnCost.map((item) => (
              <AdditionalCostItem
                srNo={item.srNo}
                description={item.desc}
                amount={item.amount}
              />
            ))}
          <hr className="m-0" />
          <div
            className="row m-t-5"
            style={{ paddingLeft: 30, display: "flex", paddingRight: 30 }}
          >
            <div style={{ flex: 0.3 }}>
              <strong>{`Total`}</strong>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              &#8377;{ordersDetail.total}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {props.scheduleId && (
        <>
          <Modal
            key={showCheckIn}
            title="Check In"
            visible={showCheckIn}
            onCancel={() => {
              setShowCheckIn(false);
            }}
            bodyStyle={{ padding: 8, height: "380px" }}
            closable={true}
            // width="50%"
            centered={true}
            footer={[
              <div style={{ marginRight: 5, position: "absolute", left: 10 }}>
                <Button
                  type="primary"
                  key="submit"
                  icon={<SaveOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => onCheckinSubmit()}
                >
                  Save
                </Button>
                <Button
                  type="primary"
                  key="back"
                  icon={<RollbackOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => onCheckInBack()}
                >
                  Back
                </Button>
              </div>,
              <Button />,
            ]}
          >
            <Descriptions bordered>
              <Descriptions.Item label="Profile Picture" span={3}>
                {ordersPortal &&
                  ordersPortal
                    .filter((i) => i.ScheduleId === props.scheduleId)
                    .map((item) => {
                      const profilePic = employeeMaster
                        ? employeeMaster.find(
                            (ii) => ii.Id === item.AttendantId
                          )
                        : null;
                      return (
                        <Avatar
                          shape="square"
                          size={64}
                          src={
                            profilePic ? (
                              profilePic.ProfilePicture
                            ) : (
                              <UserOutlined />
                            )
                          }
                        />
                      );
                    })}
              </Descriptions.Item>
              <Descriptions.Item label="Check In Date" span={3}>
                <DatePicker
                  disabledDate={disabledDate}
                  defaultValue={moment(selectedDate)}
                  onChange={(date, dateString) => {
                    setSelectedDate(dateString);
                  }}
                  style={{ display: "flex", flex: 1 }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Check In Time" span={3}>
                <TimePicker
                  onChange={(time, timeString) => {
                    setSelectedTime(timeString);
                  }}
                  format="HH:mm"
                  style={{ display: "flex", flex: 1 }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Modal>
          <Modal
            key={showCheckOut}
            title="Check Out"
            visible={showCheckOut}
            onCancel={() => {
              setShowCheckOut(false);
            }}
            bodyStyle={{ padding: 8 }}
            closable={true}
            width="75%"
            centered={true}
            footer={[
              <div style={{ marginRight: 5, position: "absolute", left: 10 }}>
                <Button
                  type="primary"
                  key="submit"
                  icon={<SaveOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => onCheckOutSubmit()}
                >
                  Save
                </Button>
                <Button
                  type="primary"
                  key="back"
                  icon={<RollbackOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => onCheckOutBack()}
                >
                  Back
                </Button>
              </div>,
              <Button />,
            ]}
          >
            <Descriptions bordered>
              <Descriptions.Item label="Check Out Date" span={1.5}>
                <DatePicker
                  disabledDate={disabledDate}
                  defaultValue={moment(selectedCheckOutDate)}
                  onChange={(date, dateString) => {
                    setSelectedCheckOutDate(dateString);
                  }}
                  style={{ display: "flex", flex: 1 }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Check Out Time" span={1.5}>
                <TimePicker
                  onChange={(time, timeString) => {
                    setSelectedCheckOutTime(timeString);
                  }}
                  format="HH:mm"
                  style={{ display: "flex", flex: 1 }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Resolution" span={3}>
                <TextArea
                  placeholder="Please enter resolution"
                  rows="3"
                  onChange={(evt) => {
                    setResolution(evt.target.value);
                  }}
                  value={resolution}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Observation" span={3}>
                <TextArea
                  placeholder="Please enter observation"
                  rows="3"
                  onChange={(evt) => {
                    setObservation(evt.target.value);
                  }}
                  value={observation}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Remark" span={3}>
                <TextArea
                  placeholder="Please enter remark"
                  rows="3"
                  onChange={(evt) => {
                    setRemark(evt.target.value);
                  }}
                  value={remark}
                />
              </Descriptions.Item>
            </Descriptions>
          </Modal>

          <Modal
            key={showAddOn}
            title="Addon Cost"
            visible={showAddOn}
            onCancel={() => {
              setShowAddOn(false);
            }}
            bodyStyle={{ padding: 8 }}
            closable={true}
            width="75%"
            centered={true}
            footer={[
              <div style={{ marginRight: 5, position: "absolute", left: 10 }}>
                <Button
                  type="primary"
                  key="submit"
                  icon={<SaveOutlined />}
                  onClick={() => onAddOnSubmit()}
                >
                  Save
                </Button>
                <Button
                  type="primary"
                  key="back"
                  icon={<RollbackOutlined />}
                  onClick={() => onAddonBack()}
                >
                  Back
                </Button>
              </div>,
              <Button />,
            ]}
          >
            <AddOnTable
              scheduleId={props.scheduleId}
              orderId={props.OrderId}
              data={ordersDetail.orderAddOnCost}
              onBackPress={() => {
                setShowAddOn(!showAddOn);
              }}
            />
          </Modal>
        </>
      )}

      {renderItems}
    </>
  );
};

export default ScheduleDetail;
