import React, { useState } from "react";
import { Button, Card, DatePicker, Radio, Select, Form } from "antd";
import { useSelector } from "react-redux";
import _ from "lodash";
import { SearchOutlined, RetweetOutlined } from "@ant-design/icons";
import moment from "moment";
import { getConfig } from "../../../shared/utility";

const NotificationLogCard = (props) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const config = useSelector((state) => state.AppMain.appconfigs);
  const [fromDate, setFromDate] = useState(moment(new moment())._d);
  const [toDate, setToDate] = useState(moment(new moment())._d);
  const [notifyMode, setNotifyMode] = useState();
  const [notifyType, setNotifyType] = useState();

  const onReset = () => {
    setNotifyMode();
    setNotifyType();
    props.onReset();
  };

  return (
    <div>
      <Card bodyStyle={{ padding: 10 }}>
        <Select
          showSearch={true}
          allowClear={true}
          value={notifyMode}
          style={{ width: 160, marginRight: 8 }}
          onChange={(e) => {
            setNotifyMode(e);
          }}
          placeholder="Notification mode"
        >
          <Option key="1" value="P">
            Promotional
          </Option>
          <Option key="2" value="T">
            Transactional
          </Option>
          <Option key="3" value=" ">
            All
          </Option>
        </Select>
        <Select
          showSearch={true}
          allowClear={true}
          value={notifyType}
          style={{ width: 150, marginRight: 8 }}
          onChange={(e) => {
            setNotifyType(e);
          }}
          placeholder="Notification type"
        >
          <Option value="E">Email</Option>
          <Option value="S">SMS</Option>
          <Option value="P">Push Notification</Option>
          <Option value=" ">All</Option>
        </Select>

        <DatePicker
          style={{ marginRight: 10, width: "calc(17% - 8px)" }}
          format={getConfig(config, "DTFORMAT").value1}
          onChange={(evt) => {
            setFromDate(evt);
          }}
          placeholder="Select From Date"
        />
        {}
        <DatePicker
          style={{ marginRight: 10, width: "calc(17% - 8px)" }}
          format={getConfig(config, "DTFORMAT").value1}
          onChange={(evt) => {
            setToDate(evt);
          }}
          placeholder="Select To Date"
        />

        <Button
          type="primary"
          htmlType="submit"
          style={{ marginRight: 5 }}
          icon={<SearchOutlined />}
          disabled={!notifyMode || !notifyType}
          onClick={() =>
            props.onSearchClick(
              notifyMode,
              notifyType,
              moment(fromDate).format("YYYY-MM-DD"),
              moment(toDate).format("YYYY-MM-DD")
            )
          }
        >
          Show
        </Button>
        <Button
          type="primary"
          icon={<RetweetOutlined />}
          style={{ marginRight: 5 }}
          onClick={onReset}
        >
          Reset
        </Button>
      </Card>
    </div>
  );
};

export default NotificationLogCard;
