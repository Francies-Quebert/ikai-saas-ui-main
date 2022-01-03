import React from "react";
class SysSequenceConfig {
  constructor(
    Id,
    TranType,
    ConfigType,
    ResetOn,
    Preffix,
    Suffix,
    Value,
    LastGenNo,
    EnablePadding,
    PaddingLength,
    PaddingChar,
    TranDesc,
    IsActive,
    ConfigTypeDesc
  ) {
    this.Id = Id;
    this.TranType = TranType;
    this.ConfigType = ConfigType;
    this.ResetOn = ResetOn;
    this.Preffix = Preffix;
    this.Suffix = Suffix;
    this.Value = Value;
    this.LastGenNo = LastGenNo;
    this.EnablePadding = EnablePadding;
    this.PaddingLength = PaddingLength;
    this.PaddingChar = PaddingChar;
    this.IsActive = IsActive;
    this.TranDesc = TranDesc;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.ConfigTypeDesc = ConfigTypeDesc;
  }
}

export default SysSequenceConfig;
