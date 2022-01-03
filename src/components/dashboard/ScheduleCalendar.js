import React, { useState, Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../store/actions/currentTran";
import { fetchScheduleCalendarData } from "../../services/schedule-calendar";
import { Calendar, Badge, Card, Typography, Button, Divider } from "antd";
import moment from "moment";
import AppLoader from "../common/AppLoader";
import _ from "lodash";
import AntDataTable from "../common/AntDataTable";
import ColumnPropertiesAnt from "../../models/columnPropertiesAnt.js";

const { Text } = Typography;
const ScheduleCalendar = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [dataOfMonth, setDataOfMonth] = useState();
  const [selectedDateValue, setSelectedDateValue] = useState(moment());
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState();
  const statusColor = useSelector(
    (state) => state.AppMain.otherMasterOrderStatus
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const columns = [
    new ColumnPropertiesAnt("ScheduleId", "Schedule Id", true, true, 120),
    new ColumnPropertiesAnt("OrderId", "Order Id", true, true, 95),
    new ColumnPropertiesAnt("userName", "Customer Name", true, true, 200),
    new ColumnPropertiesAnt("orderTitle", "Order Title", false, false, 150),
    new ColumnPropertiesAnt("SlotName", "Slot", false, false, 90),
    new ColumnPropertiesAnt("EmpName", "Attendant Name", false, true, 200),
    new ColumnPropertiesAnt("City", "Location", false, true, 100),
    new ColumnPropertiesAnt(
      "ScheduleStatus",
      "Schedule Status",
      false,
      false,
      130
    ),
  ];

  useEffect(() => {
    dispatch(setFormCaption(38));
    setDataOfMonth(moment().format("YYYYMM"));
  }, []);

  useEffect(() => {}, [data]);

  useEffect(() => {
    if (dataOfMonth) {
      setIsLoading(true);
      fetchScheduleCalendarData(CompCode, dataOfMonth)
        .then((res) => setData(res))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dataOfMonth]);

  function dateCellRender(value) {
    let hhh = [];
    if (data) {
      hhh = data.filter(
        (ii) =>
          moment(ii.ScheduleDate).format("YYYY-MM-DD") ===
          value.format("YYYY-MM-DD")
      );
      if (hhh.length > 0) {
        let statusWiseCount = [];
        hhh.map((kk) => {
          let inx = statusWiseCount.findIndex(
            (uu) => uu.StsCode === kk.ScheduleStatusCode
          );
          if (inx >= 0) {
            statusWiseCount[inx].Count = statusWiseCount[inx].Count + 1;
          } else {
            statusWiseCount.push({
              StsCode: kk.ScheduleStatusCode,
              StsDesc: kk.ScheduleStatus,
              Count: 1,
            });
          }
        });

        return (
          <ul className="events">
            {statusWiseCount &&
              statusWiseCount.map((kk) => {
                const colVal = statusColor
                  ? statusColor.find((col) => col.ShortCode === kk.StsCode)
                  : null;
                return (
                  <li
                    key={kk.StsCode}
                    onClick={() => {
                      setEditedData(hhh);
                    }}
                  >
                    <Badge color={colVal ? colVal.SysOption1 : ""} />
                    <Text code>{`${kk.StsDesc}: ${kk.Count}`}</Text>
                  </li>
                );
              })}
          </ul>
        );
      }
    }

    return null;
  }
  const onSelect = (value) => {
    setSelectedDateValue(value);
    if (dataOfMonth !== moment(value).format("YYYYMM")) {
      setDataOfMonth(moment(value).format("YYYYMM"));
    }
  };

  const onPanelChange = (value) => {
    setSelectedDateValue(value);
  };

  return (
    <div>
      <Card title="Schedule Calendar">
        {isLoading && <AppLoader />}
        {!isLoading && !editedData && (
          <Calendar
            mode="month"
            dateCellRender={dateCellRender}
            value={selectedDateValue}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
            // onChange={(value) => {
            //   if (dataOfMonth !== moment(value).format("YYYYMM")) {

            //     setDataOfMonth(moment(value).format("YYYYMM"));
            //   }
            // }}
          />
        )}
        {editedData && (
          <div>
            <AntDataTable
              data={editedData}
              columns={columns}
              pagination={{ pageSize: 25 }}
              bordered={true}
            />
            <Divider />
            <Button
              type="primary"
              onClick={() => {
                setEditedData(!editedData);
              }}
            >
              Back
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ScheduleCalendar;
