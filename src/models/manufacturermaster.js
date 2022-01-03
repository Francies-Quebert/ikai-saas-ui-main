import React from "react";
class ManufacturerMaster {
  constructor(MfrCode, MfrDesc, IsActive) {
    this.MfrCode = MfrCode;
    this.MfrDesc = MfrDesc;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.key = MfrCode;
  }
}
export default ManufacturerMaster;
