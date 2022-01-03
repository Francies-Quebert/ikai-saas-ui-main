import { Tooltip } from "antd";
import React, { Fragment } from "react";

const ExtendedHotKeyTooltip = (props) => {
  let KeyboardConfigs=Fragment;
  if (
    props.keyboardHotkeyConfig
      ? props.keyboardHotkeyConfig.find(
          (ff) => ff.EventCode === props.EventCode
        )
      : false
  ) {
    KeyboardConfigs = (
      <Tooltip
        title={`${
          props.keyboardHotkeyConfig.find(
            (key) => key.EventCode === props.EventCode
          ).EventName
        } (${
          props.keyboardHotkeyConfig.find(
            (key) => key.EventCode === props.EventCode
          ).HotKey
        })`}
      ></Tooltip>
    );
  }
  return <KeyboardConfigs>{props.children}</KeyboardConfigs>;
};

export default ExtendedHotKeyTooltip;
