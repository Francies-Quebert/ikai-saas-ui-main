import React, { useState } from "react";
import { Button, Card, DatePicker } from "antd";
import _ from "lodash";
import moment from "moment";
import { PrinterOutlined } from '@ant-design/icons';

const UserLoginLogsMasterCardNew = (props) => {
  const [fromDate, setFromDate] = useState(moment(new moment())._d);
  const [toDate, setToDate] = useState(moment(new moment())._d);
  return (
    <div>
      <Card bodyStyle={{ padding: 10 }}>
        <DatePicker
          style={{ marginRight: 10, width: "calc(17% - 8px)" }}
          format="MM/DD/YYYY"
          onChange={(evt) => {
            setFromDate(evt);
          }}
          placeholder="Select From Date"
        />

        <DatePicker
          style={{ marginRight: 10, width: "calc(17% - 8px)" }}
          format="MM/DD/YYYY"
          onChange={(evt) => {
            setToDate(evt);
          }}
          placeholder="Select To Date"
        />

        <Button
          type="primary"
          htmlType="submit"
          style={{ marginRight: 5 }}
          onClick={() =>
            props.onSearchClick(
              moment(fromDate).format("YYYY-MM-DD"),
              moment(toDate).format("YYYY-MM-DD")
            )
          }
        >
          Show
        </Button>

        <Button
          type="primary"
          htmlType="submit"
          icon={<PrinterOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => props.onPrintClick()}
        >
          Print
        </Button>
      </Card>
    </div>
  );
};

export default UserLoginLogsMasterCardNew;
