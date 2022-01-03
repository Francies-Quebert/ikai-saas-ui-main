import React from "react";

class BranchMaster {
  constructor(
    CompCode,
    BranchCode,
    BranchName,
    Add1,
    Add2,
    Add3,
    City,
    Pin,
    tel1,
    tel2,
    mobile,
    email,
    website,
    BranchType,
    IsActive
  ) {
    this.CompCode = CompCode;
    this.BranchCode = BranchCode;
    this.BranchName = BranchName;
    this.Add1 = Add1;
    this.Add2 = Add2;
    this.Add3 = Add3;
    this.City = City;
    this.Pin = Pin;
    this.tel1 = tel1;
    this.tel2 = tel2;
    this.mobile = mobile;
    this.email = email;
    this.website = website;
    this.BranchType = BranchType;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${
          IsActive === true ? "success" : "danger"
        } f-12`}
      />
    );
  }
}
export default BranchMaster;
