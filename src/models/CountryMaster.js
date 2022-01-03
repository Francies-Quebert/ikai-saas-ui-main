import React from 'react';
import { CheckSquare,Square } from "react-feather";

class CountryMaster {
  constructor(
    CountryCode,
    CountryName,
    MobileCode,
    CurrencySymbolChar,
    CountryCode2Char,
    CurrencyCode,
    IsDefault,
    IsActive
  ) {
    this.CountryCode = CountryCode;
    this.CountryName = CountryName;
    this.MobileCode = MobileCode;
    this.CurrencySymbolChar = CurrencySymbolChar;
    this.CountryCode2Char = CountryCode2Char;
    this.CurrencyCode = CurrencyCode;
    this.IsDefault = IsDefault;
    this.IsActive = IsActive;
    this.IsActiveComponent = <i className={`fa fa-circle font-${IsActive ? 'success' : 'danger'} f-12`} />;
    this.IsDefaultComponent =  IsDefault ? <CheckSquare /> : <Square/> ;
    // console.log(IsDefault ? <CheckSquare /> : <Square/>)
  }
}

export default CountryMaster;

