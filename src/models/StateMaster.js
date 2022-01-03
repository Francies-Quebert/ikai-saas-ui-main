import React from "react";
import { CheckSquare, Square } from "react-feather";

class StateMaster {
  constructor(
    StateCode,
    StateName,
    CountryCode,
    StateCode2Char,
    IsDefault,
    IsActive,
    GSTStateCode
  ) {
    this.StateCode = StateCode;
    this.StateName = StateName;
    this.CountryCode = CountryCode;
    this.StateCode2Char = StateCode2Char;
    this.IsDefault = IsDefault;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? `success` : `danger`} f-12`}
      />
    );
    this.IsDefaultComponent = IsDefault ? <CheckSquare /> : <Square />;
    this.GSTStateCode = GSTStateCode;
  }
}
export default StateMaster;
