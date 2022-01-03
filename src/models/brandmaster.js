import React from "react";
import { CheckSquare, Square } from "react-feather";

class BrandMaster {
  constructor(MfrCode, MfrDesc, BrandCode, BrandDesc, IsDefault, IsActive) {
    this.MfrCode = MfrCode;
    this.MfrDesc = MfrDesc;
    this.BrandCode = BrandCode;
    this.BrandDesc = BrandDesc;
    this.IsDefault = IsDefault;
    this.IsActive = IsActive;
    this.IsDefaultComponent = IsDefault ? <CheckSquare /> : <Square />;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.key = BrandCode;
  }
}
export default BrandMaster;
