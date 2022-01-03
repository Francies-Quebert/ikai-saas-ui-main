import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Input,
  Radio,
  Table,
  InputNumber,
  Select,
  Modal,
  Divider,
} from "antd";
const { Option } = Select;

const NoOfPersonComponent = (props) => {
  const [selectedNoOfPerson, setSelectedNoOfPerson] = useState(
    props.data ? props.data : 0
  );
  return (
    <Row style={{ padding: 15 }}>
      <Col flex="0.2" style={{ fontSize: 15, padding: "7px 20px" }}>
        No.of Persons:
      </Col>
      <Col flex="1" style={{ fontSize: 15, padding: "5px 20px" }}>
        <InputNumber
          defaultValue={selectedNoOfPerson}
          onChange={(e) => {
            setSelectedNoOfPerson(e);
          }}
          style={{ width: "100%" }}
        />
      </Col>
      <Divider style={{ margin: "15px 0px" }} />
      <div style={{ justifyContent: "flex-end", display: "flex" }}>
        <div style={{ padding: "0px 7px" }}>
          <Button
            type="default"
            onClick={() => {
              props.onBackPress();
            }}
          >
            Cancel
          </Button>
        </div>
        <div>
          <Button
            type="primary"
            onClick={() => {
              props.onNoSaved(selectedNoOfPerson);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </Row>
  );
};
export default NoOfPersonComponent;
