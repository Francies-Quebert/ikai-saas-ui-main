import React, { useState } from "react";
import { Form, Input, InputNumber, Switch, DatePicker, TimePicker } from "antd";

export const EditableCell = ({
  editing,
  dataIndex,
  requiredValidation,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "switch" ? (
      <Switch />
    ) : inputType === "date" ? (
      <DatePicker />
    ) : inputType === "time" ? (
      <TimePicker />
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={
            requiredValidation
              ? [
                  {
                    required: true,
                    message: `Please Input ${title}!`,
                  },
                ]
              : []
          }
          valuePropName={inputType === "switch" ? "checked" : "value"}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
