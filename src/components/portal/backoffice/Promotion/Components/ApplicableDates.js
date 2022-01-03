import React, { useState, useEffect } from "react";
import { DatePicker, Row, Col } from "antd";
import moment, { isMoment } from "moment";

const ApplicableDates = (props) => {
  const [from, setFrom] = useState(
    moment(props.data ? props.data.ApplicableFrom : moment()._d)
  );
  const [to, setTo] = useState(
    moment(props.data ? props.data.ApplicableTo : moment()._d)
  );

  useEffect(() => {
    props.OnSaveClick(from, to);
  }, [from, to]);

  function disabledDate(current) {
    return moment(current).add(1, "days") < moment().endOf("day");
  }

  useEffect(() => {
    setFrom(moment(props.data ? props.data.ApplicableFrom : moment()));
    setTo(moment(props.data ? props.data.ApplicableTo : moment()));
  }, [props.valuereset]);

  return (
    <div style={{ border: "1px solid #d9d9d9", flex: "1" }}>
      <div
        style={{
          padding: "5px 13px",
          fontWeight: "600",
          borderBottom: "1px solid #d9d9d9",
        }}
        className="header-title-promo"
      >
        {props.Title}
      </div>
      <Row style={{ display: "flex" }}>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          md={24}
          sm={24}
          xs={24}
          style={{
            padding: "5px 5px",
            borderRight: "1px solid #d9d9d9",
            display: "flex",
          }}
        >
          <DatePicker
            placeholder="From Date"
            style={{ flex: 1 }}
            value={from}
            disabledDate={disabledDate}
            format={"YYYY-MM-DD"}
            onChange={(e) => {
              if (isMoment(e)) {
                setFrom(moment(e));
              }
            }}
          />
        </Col>
        <Col
          xxl={12}
          xl={12}
          lg={12}
          md={24}
          sm={24}
          xs={24}
          style={{ padding: "5px 5px", display: "flex" }}
        >
          <DatePicker
            placeholder="To Date"
            style={{ flex: 1 }}
            value={to}
            disabledDate={disabledDate}
            format={"YYYY-MM-DD"}
            onChange={(e) => {
              if (isMoment(e)) {
                setTo(moment(e));
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ApplicableDates;
