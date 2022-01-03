import React from "react";
class KeyboardHotKeyConfig {
  constructor(
    CompId,
    CompName,
    CompDesc,
    ModuleGroup,
    OrderBy,
    EventSrNo,
    EventCode,
    EventName,
    HotKey
  ) {
    this.CompId = CompId;
    this.CompName = CompName;
    this.CompDesc = CompDesc;
    this.ModuleGroup = ModuleGroup;
    this.OrderBy = OrderBy;
    this.EventSrNo = EventSrNo;
    this.EventCode = EventCode;
    this.EventName = EventName;
    this.HotKey = HotKey;
    this.IsVisible = true;
    this.IsDisabled = false;
  }
}
export default KeyboardHotKeyConfig;
