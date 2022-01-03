import React, { useState, useEffect } from "react";
import { Checkbox, Row, Col, Table, DatePicker, TimePicker } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import _ from "lodash";

const PromoSchedule = (props) => {
  const [reRender, setReRender] = useState(false);

  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT").value1
  );
  const l_ConfigTimeFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((kk) => kk.configCode === "TIMEFORMAT")
        .value1
  );

  useEffect(() => {
    props.onSetSchData(props.data);
    setReRender(false);
  }, [reRender, props.data]);

  const columns = [
    {
      title: "Days",
      dataIndex: "SchDay",
      width: 150,
      render: (text, record) => {
        return text === "ALL"
          ? "All"
          : text === "MON"
          ? "Monday"
          : text === "TUE"
          ? "Tuesday"
          : text === "WED"
          ? "Wednesday"
          : text === "THU"
          ? "Thursday"
          : text === "FRI"
          ? "Friday"
          : text === "SAT"
          ? "Saturday"
          : text === "SUN"
          ? "Sunday"
          : null;
      },
    },
    {
      title: "From Date",
      dataIndex: "FromDate",
      width: 150,
      align: "center",
      render: (text, record) => {
        // console.log(record, "record");
        return (
          <DatePicker
            className="promo-schedule-date-time"
            disabled={
              record.SchDay !== "ALL" &&
              props.data.find((ii) => ii.SchDay === "ALL").IsChecked === true
                ? true
                : false
            }
            defaultValue={record.FromDate ? moment(record.FromDate) : ""}
            format={l_ConfigDateFormat}
            onChange={(e, dateString) => {
              record.FromDate = e;
              record.IsChecked = true;
              record.IsDirty = true;
              setReRender(true);
              // console.log(moment(e).format("YYYY-MM-DD"));
            }}
          />
        );
      },
    },
    {
      title: "To Date",
      dataIndex: "ToDate",
      width: 150,
      align: "center",
      render: (text, record) => {
        return (
          <DatePicker
            className="promo-schedule-date-time"
            disabled={
              record.SchDay !== "ALL" &&
              props.data.find((ii) => ii.SchDay === "ALL").IsChecked === true
                ? true
                : false
            }
            defaultValue={record.ToDate ? moment(record.ToDate) : ""}
            format={l_ConfigDateFormat}
            onChange={(e, dateString) => {
              record.ToDate = e;
              record.IsChecked = true;
              record.IsDirty = true;
              setReRender(true);
            }}
          />
        );
      },
    },
    {
      title: "From Time",
      dataIndex: "FromTime",
      width: 150,
      align: "center",
      render: (text, record) => {
        return (
          <TimePicker
            className="promo-schedule-date-time"
            disabled={
              record.SchDay !== "ALL" &&
              props.data.find((ii) => ii.SchDay === "ALL").IsChecked === true
                ? true
                : false
            }
            defaultValue={
              record.FromTime ? moment(record.FromTime, l_ConfigTimeFormat) : ""
            }
            onChange={(time, timeString) => {
              record.FromTime = time;
              record.IsChecked = true;
              record.IsDirty = true;
              setReRender(true);
            }}
          />
        );
      },
    },
    {
      title: "To Time",
      dataIndex: "ToTime",
      width: 150,
      align: "center",
      render: (text, record) => {
        return (
          <TimePicker
            className="promo-schedule-date-time"
            disabled={
              record.SchDay !== "ALL" &&
              props.data.find((ii) => ii.SchDay === "ALL").IsChecked === true
                ? true
                : false
            }
            defaultValue={
              record.ToTime ? moment(record.ToTime, l_ConfigTimeFormat) : ""
            }
            onChange={(time, timeString) => {
              record.ToTime = time;
              record.IsChecked = true;
              record.IsDirty = true;
              setReRender(true);
            }}
          />
        );
      },
    },
  ];

  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      setReRender(true);
      record.IsChecked = selected;
      record.IsDirty = true;
      // setData();
    },
    selectedRowKeys:
      props.data &&
      props.data.length > 0 &&
      props.data.filter((dd) => dd.IsChecked).map((a) => a.key),

    getCheckboxProps: (record) => ({
      disabled:
        record.SchDay !== "ALL" &&
        props.data &&
        props.data.length > 0 &&
        props.data.find((ii) => ii.SchDay === "ALL").IsChecked === true
          ? true
          : false,
    }),
  };

  return (
    <div style={{ border: "1px solid #d9d9d9", flex: "1" }}>
      <Row
        style={{
          flex: "auto",
          padding: "5px 13px",
          fontWeight: "600",
          borderBottom: "1px solid #d9d9d9",
        }}
        className="header-title-promo"
      >
        {props.Title}
      </Row>
      <Row style={{ flex: 1 }}>
        {props.data && props.data.length > 0 ? (
          <>
            <Table
              dataSource={props.data}
              columns={columns}
              bordered={false}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
                hideSelectAll: true,
              }}
              rowClassName="editable-row"
              pagination={false}
            />
          </>
        ) : (
          <div>Loading</div>
        )}
      </Row>
    </div>
  );
};

export default PromoSchedule;
