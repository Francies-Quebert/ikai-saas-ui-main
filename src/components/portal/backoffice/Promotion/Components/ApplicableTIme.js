import React, { useState, useEffect } from "react";
import { TimePicker, Row, Col } from "antd";
import { useSelector } from "react-redux";
import moment, { isMoment } from "moment";

const ApplicableTIme = (props) => {
  const [from, setFrom] = useState(
    props.data ? props.data.ApplicableFromHrs : moment()._d
  );
  const [to, setTo] = useState(
    props.data ? props.data.ApplicableToHrs : moment()._d
  );

  const l_ConfigTimeFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((kk) => kk.configCode === "TIMEFORMAT")
        .value1
  );

  useEffect(() => {
    props.OnSaveClick(from, to);
  }, [from, to]);

  useEffect(() => {
    setFrom(props.data ? props.data.ApplicableFromHrs : moment());
    setTo(props.data ? props.data.ApplicableToHrs : moment());
  }, [props.valuereset]);

  // console.log(
  //   props.data.ApplicableFromHrs,
  //   props.data.ApplicableToHrs,
  //   l_ConfigTimeFormat
  // );

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
          style={{ padding: "5px 7px", borderRight: "1px solid #d9d9d9" }}
        >
          <TimePicker
            placeholder="From Hours"
            format={l_ConfigTimeFormat}
            style={{ flex: 1, width: "100%" }}
            value={moment(from, l_ConfigTimeFormat)}
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
          style={{ padding: "5px 7px" }}
        >
          <TimePicker
            placeholder="To Hours"
            style={{ flex: 1, width: "100%" }}
            value={moment(to, l_ConfigTimeFormat)}
            format={l_ConfigTimeFormat}
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

export default ApplicableTIme;
