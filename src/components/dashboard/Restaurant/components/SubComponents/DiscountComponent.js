import React, { useState, useEffect } from "react";
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
  InputNumber,
  message,
} from "antd";
const { Option } = Select;

const DiscountComponent = (props) => {
  const [discount, setDiscount] = useState({
    reason: "",
    type: "P",
    discountAmount: 0,
    couponCode: "",
  });

  useEffect(() => {
    setDiscount(props.data);
  }, [props]);
  return (
    <div style={{ padding: 15 }}>
      <div style={{ marginBottom: 5 }}>Discount</div>
      {/* <div style={{ marginBottom: 5 }}>
        <Select size="middle" style={{ width: "100%" }} defaultValue="A">
          <Option value="A">All</Option>
        </Select>
      </div> */}
      <div style={{ marginBottom: 5 }}>
        <Input
          placeholder="Reason"
          value={discount.reason}
          onChange={(e) => {
            setDiscount({ ...discount, reason: e.target.value });
          }}
        />
      </div>
      <div style={{ marginBottom: 5, display: "flex" }}>
        <Radio.Group
          style={{ flex: 1 }}
          onChange={(val) => {
            return setDiscount({ ...discount, type: val.target.value });
          }}
          value={discount.type}
        >
          <Radio value={"P"}>Percentage</Radio>
          <Radio value={"F"}>Fixed</Radio>
        </Radio.Group>
        <div>
          <InputNumber
            value={discount.discountAmount}
            placeholder="Value"
            onChange={(e) => {
              setDiscount({ ...discount, discountAmount: e });
            }}
          />
        </div>
      </div>
      <div style={{ marginBottom: 5 }}>Coupon Code</div>
      <div style={{ display: "flex" }}>
        <Input
          value={discount.couponCode}
          placeholder="Enter Coupon Code"
          onChange={(e) => {
            setDiscount({ ...discount, couponCode: e.target.value });
          }}
        />

        <div style={{ padding: "0px 7px" }}>
          <Button style={{ background: "#03ac13", border: 0, color: "#fff" }}>
            Apply
          </Button>
        </div>
        <div style={{ padding: "0px 7px" }}>
          <Button type="dashed">Clear</Button>
        </div>
      </div>
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
              if (discount.type === "P" && discount.discountAmount > 100) {
                message.error(
                  "Invalid Amount!! Percentage Amount Cannot Be Greater Than 100% "
                );
              } else {
                props.onDiscountSave(discount);
              }
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscountComponent;
