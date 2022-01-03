import React, { useState, useEffect } from "react";
import { Checkbox, Row, Col } from "antd";

const ApplicableDays = (props) => {
  const [checkData, setCheckedData] = useState([]);
  const options = [
    { label: "Monday", value: "MON" },
    { label: "Tuesday", value: "TUE" },
    { label: "Wednesday", value: "WED" },
    { label: "Thursday", value: "THU" },
    { label: "Friday", value: "FRI" },
    { label: "Saturday", value: "SAT" },
    { label: "Sunday", value: "SUN" },
  ];
  const onChange = (value) => {
    setCheckedData(value);
    props.onValueChange(value);
  };

  useEffect(() => {
    let tempData = [];
    if (props.data) {
      if (props.data.App_Mon === "Y") {
        tempData = [...tempData, "MON"];
      }
      if (props.data.App_Tue === "Y") {
        tempData = [...tempData, "TUE"];
      }
      if (props.data.App_Wed === "Y") {
        tempData = [...tempData, "WED"];
      }
      if (props.data.App_Thu === "Y") {
        tempData = [...tempData, "THU"];
      }
      if (props.data.App_Fri === "Y") {
        tempData = [...tempData, "FRI"];
      }
      if (props.data.App_Sat === "Y") {
        tempData = [...tempData, "SAT"];
      }
      if (props.data.App_Sun === "Y") {
        tempData = [...tempData, "SUN"];
      }
      setCheckedData(tempData);
    }
  }, []);

  useEffect(() => {
    let tempData = [];
    if (props.data) {
      if (props.data.App_Mon === "Y") {
        tempData = [...tempData, "MON"];
      }
      if (props.data.App_Tue === "Y") {
        tempData = [...tempData, "TUE"];
      }
      if (props.data.App_Wed === "Y") {
        tempData = [...tempData, "WED"];
      }
      if (props.data.App_Thu === "Y") {
        tempData = [...tempData, "THU"];
      }
      if (props.data.App_Fri === "Y") {
        tempData = [...tempData, "FRI"];
      }
      if (props.data.App_Sat === "Y") {
        tempData = [...tempData, "SAT"];
      }
      if (props.data.App_Sun === "Y") {
        tempData = [...tempData, "SUN"];
      }
      setCheckedData(tempData);
    }
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
        <Col flex={1} style={{ padding: "5px 7px" }}>
          <Checkbox.Group
            value={checkData}
            options={options}
            // defaultValue={["Pear"]}
            onChange={onChange}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ApplicableDays;
