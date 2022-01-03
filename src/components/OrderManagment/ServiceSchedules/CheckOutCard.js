import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DatePicker,
  Descriptions,
  TimePicker,
  Input,
  Divider,
  Button,
  Checkbox,
  message,
} from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import moment, { isMoment } from "moment";
import { getServiceSchedulesVisit } from "../../../services/service-managment/service-management";
import { InsUpdateCheckOutOrder } from "../../../store/actions/orders";
import { reInitialize } from "../../../store/actions/currentTran";

const CheckOutCard = (props) => {
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const [checkOutData, setCheckOutData] = useState();
  const currentTran = useSelector((state) => state.currentTran);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_ConfigTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "TIMEFORMAT")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    if (currentTran.isSuccess) {
      getServiceSchedulesVisit(CompCode, props.ScheduleId, props.OrderId).then(
        (res) => {
          setCheckOutData({
            ...res[0],
            CheckOutDate: res[0].CheckOutDTTM
              ? moment(res[0].CheckOutDTTM)
              : null,
            CheckOutTime: res[0].CheckOutDTTM
              ? moment(res[0].CheckOutDTTM)
              : null,
            markedCheckeddOut: res[0].Status === "COT" ? true : false,
          });
          dispatch(reInitialize());
        }
      );
    }
  }, [currentTran.isSuccess]);

  useEffect(() => {
    getServiceSchedulesVisit(CompCode, props.ScheduleId, props.OrderId).then(
      (res) => {
        setCheckOutData({
          ...res[0],
          CheckOutDate: res[0].CheckOutDTTM
            ? moment(res[0].CheckOutDTTM)
            : null,
          CheckOutTime: res[0].CheckOutDTTM
            ? moment(res[0].CheckOutDTTM)
            : null,
          markedCheckeddOut:
            res[0].Status === "COT" || res[0].Status === "CMP" ? true : false,
        });
      }
    );
  }, []);

  // Disabled date
  function disabledDate(current) {
    return moment(current).add(1, "days") < moment().endOf("day");
  }

  return (
    <div>
      <Descriptions bordered>
        <Descriptions.Item label="Check Out Date" span={1.5}>
          <DatePicker
            // disabledDate={disabledDate}
            value={
              checkOutData && checkOutData.CheckOutDate !== null
                ? checkOutData.CheckOutDate
                : null
            }
            format={l_ConfigDateFormat.value1}
            onChange={(date, dateString) => {
              setCheckOutData({
                ...checkOutData,
                CheckOutDate: date,
              });
            }}
            style={{ display: "flex", flex: 1 }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Check Out Time" span={1.5}>
          <TimePicker
            value={
              checkOutData && checkOutData.CheckOutTime
                ? moment(checkOutData.CheckOutTime)
                : null
            }
            format={l_ConfigTimeFormat.value1}
            onChange={(time, timeString) => {
              // console.log(timeString);
              setCheckOutData({
                ...checkOutData,
                CheckOutTime: time,
              });
            }}
            style={{ display: "flex", flex: 1 }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Resolution" span={3}>
          <TextArea
            placeholder="Please enter resolution"
            rows="3"
            value={checkOutData && checkOutData.Resolution}
            onChange={(evt) => {
              setCheckOutData({
                ...checkOutData,
                Resolution: evt.target.value,
              });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Observation" span={3}>
          <TextArea
            placeholder="Please enter observation"
            rows="3"
            value={checkOutData && checkOutData.Observation}
            onChange={(evt) => {
              setCheckOutData({
                ...checkOutData,
                Observation: evt.target.value,
              });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Remark" span={3}>
          <TextArea
            placeholder="Please enter remark"
            rows="3"
            value={checkOutData && checkOutData.CheckOutRemark}
            onChange={(evt) => {
              setCheckOutData({
                ...checkOutData,
                CheckOutRemark: evt.target.value,
              });
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Mark Check Out" span={3}>
          <Checkbox
            checked={checkOutData ? checkOutData.markedCheckeddOut : false}
            onChange={(e) => {
              setCheckOutData({
                ...checkOutData,
                markedCheckeddOut: e.target.checked,
              });
            }}
          ></Checkbox>
        </Descriptions.Item>
      </Descriptions>
      <Divider style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ marginRight: 5, left: 10, marginBottom: 5 }}>
        <Button
          type="primary"
          disabled={
            checkOutData &&
            (checkOutData.Status === "COT" ||
              checkOutData.Status === "CNL" ||
              checkOutData.Status === "UAS" ||
              checkOutData.Status === "CMP")
          }
          style={{ marginRight: 5 }}
          onClick={() => {
            if (
              isMoment(checkOutData.CheckOutDate) &&
              isMoment(checkOutData.CheckOutTime)
            ) {
              dispatch(
                InsUpdateCheckOutOrder(
                  props.ScheduleId,
                  props.OrderId,
                  checkOutData
                    ? checkOutData.CheckOutDate.format("YYYY-MM-DD").concat(
                        " ",
                        checkOutData.CheckOutTime.format("HH:mm")
                      )
                    : null,
                  checkOutData ? checkOutData.Observation : null,
                  checkOutData ? checkOutData.Resolution : null,
                  checkOutData ? checkOutData.CheckOutRemark : null,
                  checkOutData ? checkOutData.markedCheckeddOut : null
                )
              );
              props.onCheckOutBack();
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
          style={{ marginRight: 5 }}
          disabled={
            checkOutData &&
            (checkOutData.Status === "COT" ||
              checkOutData.Status === "CNL" ||
              checkOutData.Status === "UAS" ||
              checkOutData.Status === "CMP")
          }
          onClick={() => {
            // console.log(checkOutData);
            if (
              isMoment(checkOutData.CheckOutDate) &&
              isMoment(checkOutData.CheckOutTime)
            ) {
              dispatch(
                InsUpdateCheckOutOrder(
                  props.ScheduleId,
                  props.OrderId,
                  checkOutData
                    ? checkOutData.CheckOutDate.format("YYYY-MM-DD").concat(
                        " ",
                        checkOutData.CheckOutTime.format("HH:mm")
                      )
                    : null,
                  checkOutData ? checkOutData.Observation : null,
                  checkOutData ? checkOutData.Resolution : null,
                  checkOutData ? checkOutData.CheckOutRemark : null,
                  checkOutData ? checkOutData.markedCheckeddOut : null
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
          onClick={() => props.onCheckOutBack()}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default CheckOutCard;
