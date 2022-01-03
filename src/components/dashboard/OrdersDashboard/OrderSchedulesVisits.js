import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import AppLoader from "../../common/AppLoader";
import AppError from "../../common/AppError";
import {
  fetchOrderScheduleVisits,
  ProcessOrderScheduleVisits,
} from "../../../store/actions/ordersPortal";
import moment from "moment";
import OrderSchedulesVisitsItem from "./OrderSchedulesVisitsItem";
import { DatePicker, Modal, Descriptions, Select, Input, Button } from "antd";
import { SaveOutlined, RetweetOutlined } from "@ant-design/icons";
import SelectableItem from "../OrderBookingMain/SelectableItem";
import DisplayEmployeeCard from "../OrdersDashboard/DisplayEmployeeCard";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
import { fetchEmployeeMasters } from "../../../store/actions/employeemaster";
import {
  InsUpdateOrderSchedule,
  sendScheduleSms,
} from "../../../store/actions/ordersPortal";
import ScheduleDetail from "./ScheduleDetail";
import SweetAlert from "react-bootstrap-sweetalert";
import { hasRight } from "../../../shared/utility";
import { toast } from "react-toastify";

const OrderScheduleVisits = (props) => {
  const { TextArea } = Input;
  const { Option } = Select;
  const dispatch = useDispatch();

  // useState
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [remark, setRemark] = useState();
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isShowModal, setisShowModal] = useState(false);
  const [ssAleart, setSsAlert] = useState();
  const [status, setStatus] = useState();

  //useSelector
  const employeeMaster = useSelector(
    (state) => state.employeeMaster.employeeMasters
  );
  const currentTran = useSelector((state) => state.currentTran);
  const ordersPortal = useSelector((state) => state.ordersPortal);
  const SlotsMap = useSelector((state) => state.AppMain.service_slot_loc_mapp);
  const appMain = useSelector((state) => state.AppMain);
  const [dataSaved, setDataSaved] = useState();
  const [scheduleId, setScheduleId] = useState();
  const currTran = useSelector((state) => state.currentTran);

  // useEffect

  useEffect(() => {
    dispatch(fetchOrderScheduleVisits(props.OrderId));
    dispatch(fetchEmployeeMasters("A"));
  }, [dataSaved, ordersPortal.refreshRequired]);

  useEffect(() => {
    if (currentTran.lastSavedData !== null) {
      dispatch(fetchOrderScheduleVisits(props.OrderId));
      dispatch(fetchEmployeeMasters("A"));
    }
  }, [currTran.lastSavedData]);

  // Disabled date
  function disabledDate(current) {
    return current && current < moment().endOf("day");
  }

  //Submit
  const onSubmit = () => {
    dispatch(
      InsUpdateOrderSchedule(
        "U",
        selectedSchedule.ScheduleId,
        selectedSchedule.OrderId,
        moment(selectedDate).format("YYYY-MM-DD"),
        selectedSlotId,
        selectedEmployee,
        remark,
        selectedEmployee ? "ASC" : "UAS"
      )
    );
    // setTimeout(setDataSaved(!dataSaved),4000)

    setisShowModal(false);
  };

  //onReset
  const onReset = () => {
    setSelectedDate();
    setSelectedSlotId();
    setRemark();
    setSelectedEmployee();
  };

  //Alert
  const showAlert = (actiontype, message, scheduleId) => {
    setSsAlert(
      <SweetAlert
        showCancel
        confirmBtnText="Continue"
        title="Are you sure?"
        onCancel={() => setSsAlert()}
        onConfirm={() => {
          setSsAlert();
          if (actiontype === "sendScheduleOTP") {
            dispatch(sendScheduleSms(scheduleId));
          }
        }}
      >
        {message}
      </SweetAlert>
    );
  };

  //let Availaable slots
  let avalibleSlots = [];
  appMain.slots.map((slot) => {
    const arrApplicableforService = SlotsMap.filter(
      (iiii) =>
        iiii.ServiceId === 1 && iiii.LocationId === 1 && iiii.SlotId === slot.Id
    );
    if (arrApplicableforService.length > 0) {
      avalibleSlots.push(slot);
    }
  });

  let renderItem = null;
  if (ordersPortal.isLoading === true) {
    renderItem = <AppLoader />;
  } else if (ordersPortal.error) {
    renderItem = <AppError ErrorTitle="Error" ErrorDesc={ordersPortal.error} />;
  } else if (
    ordersPortal.currentOrderScheduleVisits &&
    ordersPortal.currentOrderScheduleVisits.length > 0
  ) {
    renderItem = (
      <div className="table-responsive topper-lists">
        <table className="table table-bordernone">
          <thead>
            <tr>
              <th></th>
              <th>Attendant</th>
              <th style={{ paddingLeft: 3, textAlign: "center" }}>Schedule</th>
              <th style={{ paddingLeft: 3, textAlign: "center" }}>Remark</th>
              <th style={{ paddingLeft: 3 }}>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ordersPortal.currentOrderScheduleVisits.map((item) => {
              return (
                <OrderSchedulesVisitsItem
                  IsSelected={scheduleId === item.ScheduleId}
                  onScheduleSelect={() => {
                    if (scheduleId === item.ScheduleId) {
                      setScheduleId();
                      setStatus();
                    } else {
                      setScheduleId(item.ScheduleId);
                      setStatus(item.Status);
                    }
                  }}
                  key={item.ScheduleId}
                  EmpName={item.EmpName}
                  // ProfilePic={item.ProfilePicture}
                  EmpId={item.AttendantId}
                  mobileNo={item.mobileNo}
                  ScheduleDate={item.ScheduleDate}
                  slotname={`${item.slotname} OTP-${
                    item.VerificationCode
                      ? item.VerificationCode
                      : "Not Generated"
                  }`}
                  Remark={item.Remark}
                  Status={item.Status}
                  isDisabled={true}
                  StatusDesc={item.StatusDesc}
                  onButtonClick={() => {
                    // setShowDispatchModal(true);
                    setisShowModal(true);
                    setSelectedDate(new Date(item.ScheduleDate));
                    setSelectedSlotId(item.SlotId);
                    setRemark(item.Remark);
                    setSelectedSchedule(item);
                    setSelectedEmployee(item.AttendantId);
                    // const ss = employeeMaster.find(
                    //   (uu) => uu.Id === item.AttendantId
                    // );
                    // {
                    //   ss && setSelectedEmployee(ss);
                    // }
                  }}
                  onSendOtpClick={() => {
                    showAlert(
                      "sendScheduleOTP",
                      "Do you want to send OTP for this Schedule",
                      item.ScheduleId
                    );
                  }}
                />
              );
            })}
          </tbody>
        </table>
        <Modal
          key={isShowModal}
          title="Schedule Visit"
          visible={isShowModal}
          onCancel={() => {
            setisShowModal(false);
          }}
          bodyStyle={{ padding: 0, height: "380px" }}
          closable={false}
          width="75%"
          footer={[
            <Button
              type="primary"
              key="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => onSubmit()}
            >
              Save
            </Button>,
            // <Button
            //   type="primary"
            //   icon={<RetweetOutlined />}
            //   style={{ marginRight: 5 }}
            //   onClick={() => onReset()}
            // >
            //   Reset
            // </Button>,
          ]}
        >
          <Descriptions bordered>
            <Descriptions.Item label="Schedule Date" span={1.5}>
              <DatePicker
                allowClear={false}
                disabledDate={disabledDate}
                value={moment(selectedDate)}
                onChange={(date, dateString) => {
                  setSelectedDate(dateString);
                }}
                style={{ display: "flex", flex: 1 }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Schedule Slot" span={1.5}>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a Slot"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={selectedSlotId}
                onChange={(val) => {
                  setSelectedSlotId(val);
                }}
              >
                {avalibleSlots &&
                  avalibleSlots.map((item) => {
                    return (
                      <Option key={item.Id} value={item.Id}>
                        {item.SlotName}
                      </Option>
                    );
                  })}
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="Schedule Remark" span={3}>
              <TextArea
                rows={5}
                placeholder="Your Remark"
                onChange={(evt) => {
                  // console.log(evt.target.value);
                  setRemark(evt.target.value);
                }}
                value={remark}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Select Attendant" span={1.5}>
              <Select
                allowClear={true}
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Attendant"
                optionFilterProp="children"
                value={selectedEmployee}
                onChange={(val) => {
                  setSelectedEmployee(val);
                }}
              >
                {employeeMaster &&
                  employeeMaster.map((item) => {
                    return (
                      <Option key={item.Id} value={item.Id}>
                        {item.Name} ({item.mobile1})
                      </Option>
                    );
                  })}
              </Select>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>
    );
  } else {
    renderItem = (
      <>
        <h4>Visits not schedule yet. </h4>
        <div className="btn-sm">
          <button
            className="btn btn-square btn-primary btn-sm m-5 "
            type="button"
            onClick={() => {
              dispatch(ProcessOrderScheduleVisits(props.OrderId));
            }}
            disabled={hasRight(currTran.moduleRights, "SCHEDULE")}
          >
            Schedule Visit
          </button>
        </div>
      </>
    );
  }

  return (
    <Fragment>
      {ssAleart}
      <div className="row">
        <div className="col-md-7 p-0">
          <div
            className="card m-5"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // minHeight: 350,
              padding: "30px 0px",
            }}
          >
            {renderItem}
          </div>
        </div>
        <div className="col-md-5 p-0">
          <div className="card m-5">
            {
              <ScheduleDetail
                scheduleId={scheduleId}
                OrderId={props.OrderId}
                Status={status}
              />
            }
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export const columnProperties = [
  new ColumnProperties("Id", false, "Id", true, 50),
  new ColumnProperties("EmpType", false, "EmpType", true, 50),
  new ColumnProperties("Name", true, "Name", true, 250),
  new ColumnProperties("FirstName", false, "First Name", true, 100),
  new ColumnProperties("MiddleName", false, "Middle Name", true, 100),
  new ColumnProperties("LastName", false, "Last Name", true, 100),
  new ColumnProperties("bio", false, "bio", true, 250),
  new ColumnProperties("CategoryCode", false, "CategoryCode", true, 50),
  new ColumnProperties(
    "QualificationCode",
    false,
    "QualificationCode",
    true,
    50
  ),
  new ColumnProperties("ExperienceCode", false, "Experience Code", true, 50),
  new ColumnProperties("GradeCode", false, "Grade Code", true, 50),
  new ColumnProperties("DOB", false, "DOB", true, 150),
  new ColumnProperties("Gender", false, "Gender", true, 150),
  new ColumnProperties("IsGenderComponent", false, "Gender Status", false, 150),
  new ColumnProperties("Address1", false, "Address1", true, 150),
  new ColumnProperties("Address2", false, "Address2", true, 150),
  new ColumnProperties("Address3", false, "Address3", true, 150),
  new ColumnProperties("City", false, "City", true, 150),
  new ColumnProperties("PinCode", false, "PinCode", true, 100),
  new ColumnProperties("State", false, "State", true, 150),
  new ColumnProperties("Country", false, "Country", true, 150),
  new ColumnProperties("tel", false, "tel", true, 100),
  new ColumnProperties("mobile1", true, "Contact No.", true, 130),
  new ColumnProperties("mobile2", false, "mobile2", true, 130),
  new ColumnProperties("email", true, "email", true, 250),
  new ColumnProperties("AadharNo", false, "AadharNo", true, 150),
  new ColumnProperties("PanNo", false, "PanNo", true, 150),
  new ColumnProperties("DesignationCode", false, "DesignationCode", true, 80),
  new ColumnProperties("ProfilePicture", false, "ProfilePicture", true, 150),
  new ColumnProperties("IsActive", false, "Active Status", false, 350),
  new ColumnProperties("IsActiveComponent", false, "Active Status", false, 150),
  new ColumnProperties("ProfilePicture", false, "Profile Picture", true, 350),
];

export default OrderScheduleVisits;
