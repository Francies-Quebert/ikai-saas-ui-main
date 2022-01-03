import React, { useState } from "react";
import { Button, Card, DatePicker } from "antd";
import _ from "lodash";
import moment from "moment";
import { PlusCircleOutlined, RedoOutlined } from "@ant-design/icons";
import { hasRight } from "../../../shared/utility";
import { useSelector, useDispatch } from "react-redux";

const SupportResolvedCardNew = (props) => {
  const [fromDate, setFromDate] = useState(moment(new moment())._d);
  const [toDate, setToDate] = useState(moment(new moment())._d);
  const currTran = useSelector((state) => state.currentTran);
  return (
    <div>
      <Card bodyStyle={{ padding: 0 }} bordered={false}>
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
          icon={<PlusCircleOutlined />}
          style={{ marginRight: 5 }}
          onClick={props.onAddClick}
          disabled={hasRight(currTran.moduleRights, "ADD")}
        >
          Add Support Ticket
        </Button>
        <Button
          type="primary"
          icon={<RedoOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => props.onRefreshClick()}
        >
          Refresh
        </Button>
      </Card>
    </div>
  );
};

export default SupportResolvedCardNew;
