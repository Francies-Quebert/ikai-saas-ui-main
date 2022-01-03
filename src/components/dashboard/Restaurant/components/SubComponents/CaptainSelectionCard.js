import React, { useState, useEffect } from "react";
import { fetchPOSCaptain } from "../../../../../services/restaurant-pos";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Button,
  Input,
  Radio,
  Table,
  DatePicker,
  Select,
  Modal,
  Divider,
} from "antd";
const { Option } = Select;
const CaptainSelectionCard = (props) => {
  const [captains, setCaptains] = useState([]);
  const [selectedCaptian, setSelectedCaptian] = useState(
    props.data ? props.data : undefined
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    fetchPOSCaptain(CompCode).then((res) => {
      setCaptains(res);
    });
  }, []);

  return (
    <Row style={{ padding: 15 }}>
      <Col flex="0.2" style={{ fontSize: 15, padding: "7px 20px" }}>
        Select Captain:
      </Col>
      <Col flex="1" style={{ fontSize: 15, padding: "5px 20px" }}>
        <Select
          placeholder="Select your captain"
          allowClear={true}
          defaultValue={selectedCaptian ? parseInt(selectedCaptian) : undefined}
          onChange={(e) => {
            setSelectedCaptian(e);
          }}
          style={{ width: "100%" }}
        >
          {captains.map((item) => {
            return (
              <Option
                value={item.Id}
              >{`${item.FirstName} ${item.LastName}`}</Option>
            );
          })}
        </Select>
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
              props.onCaptainSelect(selectedCaptian);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </Row>
  );
};

export default CaptainSelectionCard;
