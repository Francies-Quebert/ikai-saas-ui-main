import React from "react";
import { Button, Form } from "antd";
import { SaveOutlined, RetweetOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import PrinterOutlined from "@ant-design/icons/PrinterOutlined";
import RollbackOutlined from "@ant-design/icons/RollbackOutlined";

const CardFooter = (props) => {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #f0f0f0",
        padding: "8px",
      }}
    >
      {props.showSave && (
        <Button
          type="primary"
          icon={<SaveOutlined />}
          style={{ marginRight: 8 }}
          onClick={props.OnSave}
        >
          Save
        </Button>
      )}

      {props.showCancel && (
        <Button
          type="primary"
          icon={<RetweetOutlined />}
          style={{ marginRight: 8 }}
          onClick={props.OnCancel}
        >
          Cancel
        </Button>
      )}

      {props.showBack && (
        <Button
          type="primary"
          icon={<Icon component={RollbackOutlined} />}
          style={{ marginRight: 8 }}
          onClick={props.OnBack}
        >
          Back
        </Button>
      )}

      {props.showPrint && (
        <Button
          type="primary"
          icon={<Icon component={PrinterOutlined} />}
          style={{ marginRight: 8 }}
          onClick={props.OnPrint}
        >
          Print
        </Button>
      )}
    </div>
  );
};

export default CardFooter;
