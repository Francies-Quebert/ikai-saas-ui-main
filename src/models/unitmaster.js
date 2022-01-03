import React from "react";
import { CheckSquare, Square } from "react-feather";
class UnitMaster {
  constructor(UnitCode, UnitDesc,ParentUnitCode,UnitMeasureToParent, AllowDecimal, IsActive) {
    this.UnitCode = UnitCode;
    this.UnitDesc = UnitDesc;
    this.ParentUnitCode = ParentUnitCode;
    this.UnitMeasureToParent = UnitMeasureToParent;
    this.AllowDecimal = AllowDecimal;
    this.IsActive = IsActive;
    this.AllowDecimalComponent = AllowDecimal==="Y" ? <CheckSquare /> : <Square />;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default UnitMaster;
