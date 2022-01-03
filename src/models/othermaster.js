import React from "react";
class OtherMaster {
  constructor(
    Id,
    MasterType,
    ShortCode,
    MasterDesc,
    IsActive,
    SysOption1,
    SysOption2,
    SysOption3,
    SysOption4,
    SysOption5
  ) {
    this.Id = Id;
    this.MasterType = MasterType;
    this.ShortCode = ShortCode;
    this.MasterDesc = MasterDesc;
    this.IsActive = IsActive;
    this.SysOption1 = SysOption1;
    this.SysOption2 = SysOption2;
    this.SysOption3 = SysOption3;
    this.SysOption4 = SysOption4;
    this.SysOption5 = SysOption5;
    this.IsActiveComponent = <i className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`} />
  }
}
export default OtherMaster;
