import React from "react";
class TaxMaster {
  constructor(
    TaxCode,
    TaxName,
    TaxType,
    TranType,
    TaxPer,
    IGSTPer,
    CGSTPer,
    SGSTPer,
    UTSTPer,
    CESSPer,
    SURCHARGPer,
    IsActive
  ) {
    this.TaxCode = TaxCode;
    this.TaxName = TaxName;
    this.TaxType = TaxType;
    this.TaxTypeFF = TaxType === "G" ? "GST" : "VAT";
    this.TranType = TranType;
    this.TranTypeFF =
      TranType === "I" ? "Inward" : TranType === "O" ? "Outward" : "Both";
    this.TaxPer = TaxPer;
    this.IGSTPer = IGSTPer;
    this.CGSTPer = CGSTPer;
    this.SGSTPer = SGSTPer;
    this.UTSTPer = UTSTPer;
    this.CESSPer = CESSPer;
    this.SURCHARGPer = SURCHARGPer;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default TaxMaster;
