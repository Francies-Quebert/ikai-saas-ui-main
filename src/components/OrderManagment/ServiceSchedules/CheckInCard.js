import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DatePicker,
  Descriptions,
  Avatar,
  TimePicker,
  Button,
  Divider,
  Checkbox,
  message,
  Empty,
} from "antd";
import moment, { isMoment } from "moment";
import { getServiceSchedulesVisit } from "../../../services/service-managment/service-management";
import {
  SaveOutlined,
  RollbackOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { InsUpdateCheckInOrder } from "../../../store/actions/orders";
import { reInitialize } from "../../../store/actions/currentTran";
// import { UserOutlined } from "@ant-design/icons";

const CheckInCard = (props) => {
  const dispatch = useDispatch();
  const [checkInData, setCheckInData] = useState();

  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currentTran = useSelector((state) => state.currentTran);
  const l_ConfigTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "TIMEFORMAT")
  );

  useEffect(() => {
    if (currentTran.isSuccess) {
      getServiceSchedulesVisit(CompCode, props.ScheduleId, props.OrderId).then(
        (res) => {
          setCheckInData({
            ...res[0],
            CheckInDate: res[0].CheckInDTTM ? moment(res[0].CheckInDTTM) : null,
            CheckInTime: res[0].CheckInDTTM ? moment(res[0].CheckInDTTM) : null,
            markedCheckeddIn:
              res[0].Status === "CIN" || res[0].Status === "COT" ? true : false,
          });
          dispatch(reInitialize());
        }
      );
    }
  }, [currentTran.isSuccess]);

  useEffect(() => {
    getServiceSchedulesVisit(CompCode, props.ScheduleId, props.OrderId).then(
      (res) => {
        setCheckInData({
          ...res[0],
          CheckInDate: res[0].CheckInDTTM ? moment(res[0].CheckInDTTM) : null,
          CheckInTime: res[0].CheckInDTTM ? moment(res[0].CheckInDTTM) : null,
          markedCheckeddIn:
            res[0].Status === "CIN" ||
            res[0].Status === "COT" ||
            res[0].Status === "CMP"
              ? true
              : false,
        });
      }
    );
  }, []);

  // Disabled date
  function disabledDate(current) {
    return moment(current).add(1, "days") < moment().endOf("day");
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "1 0 50%", width: "50%" }}>
          <Descriptions bordered>
            {/* <Descriptions.Item label="Check In Picture" span={3}>
          <Avatar shape="square" size={64} src={} />
        </Descriptions.Item> */}
            <Descriptions.Item label="Check In Date" span={3}>
              <DatePicker
                allowClear={false}
                // disabledDate={disabledDate}
                value={
                  checkInData && checkInData.CheckInDate !== null
                    ? checkInData.CheckInDate
                    : null
                }
                format={l_ConfigDateFormat.value1}
                onChange={(date, dateString) => {
                  setCheckInData({
                    ...checkInData,
                    CheckInDate: date,
                  });
                }}
                style={{ display: "flex", flex: 1 }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Check In Time" span={3}>
              <TimePicker
                onChange={(time, timeString) => {
                  setCheckInData({
                    ...checkInData,
                    CheckInTime: time,
                  });
                }}
                value={
                  checkInData && checkInData.CheckInTime !== null
                    ? checkInData.CheckInTime
                    : null
                }
                format={l_ConfigTimeFormat.value1}
                style={{ display: "flex", flex: 1 }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Mark Check In" span={3}>
              <Checkbox
                checked={checkInData ? checkInData.markedCheckeddIn : false}
                onChange={(e) => {
                  setCheckInData({
                    ...checkInData,
                    markedCheckeddIn: e.target.checked,
                  });
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div style={{ flex: "1 0 50%", width: "50%" }}>
          {checkInData && checkInData.CheckInImage ? (
            <img
              style={{
                width: "50%",
                height: "100%",
                objectFit: "contain",
                padding: 10,
              }}
              src={`data:image/jpg;base64,${checkInData.CheckInImage}`}
            />
          ) : (
            <Empty description="Check In image not found" />
          )}
        </div>
      </div>{" "}
      <Divider style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ marginRight: 5, left: 10, marginBottom: 5 }}>
        <Button
          type="primary"
          disabled={
            checkInData &&
            (checkInData.Status === "COT" ||
              checkInData.Status === "CIN" ||
              checkInData.Status === "CNL" ||
              checkInData.Status === "UAS" ||
              checkInData.Status === "CMP")
          }
          style={{ marginRight: 5 }}
          onClick={() => {
            if (
              isMoment(checkInData.CheckInDate) &&
              isMoment(checkInData.CheckInTime)
            ) {
              dispatch(
                InsUpdateCheckInOrder(
                  props.ScheduleId,
                  props.OrderId,
                  checkInData
                    ? checkInData.CheckInDate.format("YYYY-MM-DD").concat(
                        " ",
                        checkInData.CheckInTime.format("HH:mm")
                      )
                    : null,
                  checkInData
                )
              );
              props.onCheckInBack();
            } else {
              message.error("Please Input the details");
            }
          }}
        >
          Save and close
        </Button>
        <Button
          type="primary"
          key="submit"
          icon={<SaveOutlined />}
          disabled={
            checkInData &&
            (checkInData.Status === "COT" ||
              checkInData.Status === "CIN" ||
              checkInData.Status === "CNL" ||
              checkInData.Status === "UAS" ||
              checkInData.Status === "CMP")
          }
          style={{ marginRight: 5 }}
          onClick={() => {
            if (
              isMoment(checkInData.CheckInDate) &&
              isMoment(checkInData.CheckInTime)
            ) {
              dispatch(
                InsUpdateCheckInOrder(
                  props.ScheduleId,
                  props.OrderId,
                  checkInData
                    ? checkInData.CheckInDate.format("YYYY-MM-DD").concat(
                        " ",
                        checkInData.CheckInTime.format("HH:mm")
                      )
                    : null,
                  checkInData
                )
              );
            } else {
              message.error("Please Input the details");
            }
          }}
        >
          Save
        </Button>
        <Button
          type="primary"
          key="back"
          icon={<RollbackOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => props.onCheckInBack()}
        >
          Back
        </Button>
      </div>
    </>
  );
};

export default CheckInCard;
