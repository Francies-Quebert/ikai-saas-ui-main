import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Input,
  Descriptions,
  DatePicker,
  Button,
  Card,
  Select,
  Empty,
  message,
} from "antd";
import moment from "moment";
import CardHeader from "../../common/CardHeader";
import Icon, {
  SaveOutlined,
  RetweetOutlined,
  RollbackOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getServiceOrderDetail,
  InsOrderSchedule,
} from "../../../services/service-managment/service-management";

const ScheduleCard = (props) => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const [data, setData] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [slotId, setSlotId] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const appMain = useSelector((state) => state.AppMain);
  const SlotsMap = useSelector((state) => state.AppMain.service_slot_loc_mapp);
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT").value1
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  function disabledDate(current) {
    return current && current < moment().endOf("day");
  }

  const onReset = () => {
    setOrderId();
    setSlotId();
    setData([]);
  };

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

  return (
    <div style={{ width: "100%", padding: "10px 15px" }}>
      <div>
        <CardHeader title="Add Schedule" />
        <Row>
          <Col span={10}>
            <Descriptions bordered size="middle">
              <Descriptions.Item label="Order Id" span={3}>
                <Row>
                  <Col flex="1 1 200px">
                    <div style={{ display: "flex" }}>
                      <Input
                        disabled={data.length > 0}
                        allowClear
                        type="number"
                        value={orderId}
                        style={{ width: "calc(100% - 8px)" }}
                        placeholder="Please input order id"
                        onChange={(e) => {
                          setOrderId(e.target.value);
                        }}
                      />
                      <div
                        style={{
                          marginBottom: "auto",
                          marginTop: "auto",
                          marginLeft: 8,
                        }}
                      >
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<SearchOutlined />}
                          size={"small"}
                          onClick={() => {
                            getServiceOrderDetail(CompCode, orderId).then(
                              (res) => {
                                if (
                                  res.filter((i) => i.OrderStatus === "SCH")
                                    .length > 0
                                ) {
                                  setData(res);
                                } else {
                                  message.error(
                                    res.length > 0
                                      ? `This order status is ${res[0].statusDesc.toLowerCase()} only scheduled status order are accepted.`
                                      : `order does not exist`
                                  );
                                }
                              }
                            );
                          }}
                          disabled={!orderId}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Descriptions.Item>
              <Descriptions.Item label="Schedule Date" span={3}>
                <DatePicker
                  allowClear={false}
                  disabledDate={disabledDate}
                  defaultValue={moment(selectedDate)}
                  format={l_ConfigDateFormat}
                  style={{ width: "calc(100% - 8px)" }}
                  disabled={!orderId || data.length <= 0}
                  onChange={(date, dateString) => {
                    setSelectedDate(date);
                  }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Schedule Slot" span={3}>
                <Select
                  showSearch
                  disabled={!orderId || data.length <= 0}
                  style={{ width: "100%" }}
                  placeholder="Select a Slot"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toString().toLowerCase()) >= 0
                  }
                  value={slotId}
                  onChange={(val) => setSlotId(val)}
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
            </Descriptions>
          </Col>
          <Col span={14}>
            <Card bordered bodyStyle={{ padding: 0 }}>
              {data.length <= 0 && (
                <Empty
                  style={{ height: "170px" }}
                  description={"Please enter order id to view detail!!!"}
                />
              )}
              {data.length > 0 && (
                <Descriptions bordered size="small">
                  <Descriptions.Item span={1.5} label="Order Id">
                    {data[0].orderid}
                  </Descriptions.Item>
                  <Descriptions.Item span={1.5} label="Order Date">
                    {moment(data[0].orderdate).format(l_ConfigDateFormat)}
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="Initial Schedule">
                    {data[0].ScheduledFrom === data[0].ScheduledTo
                      ? `${moment(data[0].ScheduledFrom).format(
                          l_ConfigDateFormat
                        )} / ${data[0].slotName}`
                      : `${moment(data[0].ScheduledFrom).format(
                          l_ConfigDateFormat
                        )} -
                        ${moment(data[0].ScheduledTo).format(
                          l_ConfigDateFormat
                        )} / ${data[0].slotName}`}
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="Order Name">
                    {data[0].orderTitle}
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="Customer Name">
                    {data[0].userName} ({data[0].mobile})
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="Address">
                    {data[0].add1}, {data[0].add2}, {data[0].add3},{" "}
                    {data[0].City}, {data[0].Pin}
                    <br />({data[0].geoLocationName})
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </Col>
        </Row>
        <Card style={{ marginTop: 4 }} bodyStyle={{ padding: 0 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            disabled={data.length <= 0}
            onClick={() => {
              dispatch(
                InsOrderSchedule({
                  data: {
                    OrderId: orderId,
                    ScheduleDate: moment(selectedDate).format("YYYY-MM-DD"),
                    SlotId: slotId,
                  },
                })
              );
            }}
            style={{ marginRight: 5 }}
          >
            Save
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            icon={<Icon component={RollbackOutlined} />}
            onClick={() => {
              props.OnScheduleBack();
            }}
          >
            Back
          </Button>

          <Button
            type="primary"
            icon={<RetweetOutlined />}
            style={{ marginRight: 5 }}
            onClick={() => {
              onReset();
            }}
          >
            Reset
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleCard;
