import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DatePicker, Descriptions, Select, Button, Divider, Input } from "antd";
import moment from "moment";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import { getServiceSchedulesVisit } from "../../../services/service-managment/service-management";
import { InsUpdateOrderScheduleVisit } from "../../../store/actions/ordersPortal";
import { reInitialize } from "../../../store/actions/currentTran";

const RescheduleCard = (props) => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const { TextArea } = Input;
  const [scheduleData, setScheduleData] = useState();
  const appMain = useSelector((state) => state.AppMain);
  const SlotsMap = useSelector((state) => state.AppMain.service_slot_loc_mapp);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const employeeMaster = useSelector(
    (state) => state.employeeMaster.employeeMasters
  );
  const currentTran = useSelector((state) => state.currentTran);

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    if (currentTran.isSuccess) {
      getServiceSchedulesVisit(CompCode, props.ScheduleId, props.OrderId).then(
        (res) => {
          setScheduleData(res[0]);
          dispatch(reInitialize());
        }
      );
    }
  }, [currentTran.isSuccess]);

  // Disabled date
  function disabledDate(current) {
    return moment(current).add(1, "days") < moment().endOf("day");
  }
  //let Availaable slots
  const avalibleSlots = [];
  appMain.slots.map((slot) => {
    const arrApplicableforService = SlotsMap.filter(
      (iiii) =>
        iiii.ServiceId === 1 && iiii.LocationId === 1 && iiii.SlotId === slot.Id
    );
    if (arrApplicableforService.length > 0) {
      avalibleSlots.push(slot);
    }
  });

  useEffect(() => {
    getServiceSchedulesVisit(CompCode, props.ScheduleId, props.OrderId).then(
      (res) => {
        setScheduleData(res[0]);
      }
    );
  }, []);

  return (
    <div>
      {/* {`Order Id: ${props.OrderId}, ScheduleId:${props.ScheduleId}`} */}
      <Descriptions bordered>
        <Descriptions.Item label="Schedule Date" span={3}>
          <DatePicker
            allowClear={false}
            // disabledDate={disabledDate}
            value={scheduleData && moment(scheduleData.ScheduleDate)}
            format={l_ConfigDateFormat.value1}
            onChange={(evt) => {
              setScheduleData({
                ...scheduleData,
                ScheduleDate: moment(evt).format("YYYY-MM-DD"),
              });
            }}
            style={{ display: "flex", flex: 1 }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Schedule Slot" span={3}>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a Slot"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children
                .toString()
                .toLowerCase()
                .indexOf(input.toString().toLowerCase()) >= 0
            }
            value={scheduleData && scheduleData.SlotId}
            onChange={(val) => {
              setScheduleData({ ...scheduleData, SlotId: val });
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
              setScheduleData({ ...scheduleData, Remark: evt.target.value });
            }}
            value={scheduleData && scheduleData.Remark}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Select Attendant" span={1.5}>
          <Select
            allowClear={true}
            showSearch
            style={{ width: "100%" }}
            placeholder="Select Attendant"
            optionFilterProp="children"
            value={scheduleData && scheduleData.AttendantId}
            onChange={(val) => {
              setScheduleData({ ...scheduleData, AttendantId: val });
            }}
          >
            {employeeMaster &&
              employeeMaster
                .filter((ii) => ii.IsActive === true)
                .map((item) => {
                  return (
                    <Option key={item.Id} value={item.Id}>
                      {item.Name} ({item.mobile1})
                    </Option>
                  );
                })}
          </Select>
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ marginRight: 5, left: 10, marginBottom: 5 }}>
        <Button
          type="primary"
          key="submit"
          icon={<SaveOutlined />}
          disabled={
            scheduleData &&
            (scheduleData.Status === "CIN" ||
              scheduleData.Status === "COT" ||
              scheduleData.Status === "CNL" ||
              scheduleData.Status === "CMP")
          }
          style={{ marginRight: 5 }}
          onClick={() => {
            // onScheduleSubmit();
            dispatch(
              InsUpdateOrderScheduleVisit({
                ...scheduleData,
                ScheduleId: props.ScheduleId,
                OrderId: props.OrderId,
                ScheduleDate: moment(scheduleData.ScheduleDate).format(
                  "YYYY-MM-DD"
                ),
              })
            );
          }}
        >
          Save
        </Button>
        <Button
          type="primary"
          key="back"
          icon={<RollbackOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => props.onScheduleBack()}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default RescheduleCard;
