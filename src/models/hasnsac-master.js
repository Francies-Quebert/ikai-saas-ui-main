import React from "react";

class HSNSACmaster {
  constructor(hsnsaccode, hsnsacdesc, DefTaxCode, IsActive, TaxName) {
    this.hsnsaccode = hsnsaccode;
    this.hsnsacdesc = hsnsacdesc;
    this.DefTaxCode = DefTaxCode;
    this.TaxName = TaxName;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default HSNSACmaster;
