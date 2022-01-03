import React from "react";

class PaymodeMaster {
  constructor(
    PayCode,
    PayDesc,
    IsPaymentGateway,
    PaymentGatewayComp,
    PaymentType,
    OpeningBalance,
    SysOption1,
    SysOption2,
    SysOption3,
    SysOption4,
    SysOption5,
    SysOption6,
    SysOption7,
    SysOption8,
    SysOption9,
    SysOption10,
    IsActive
  ) {
    this.PayCode = PayCode;
    this.PayDesc = PayDesc;
    this.IsPaymentGateway = IsPaymentGateway;
    this.PaymentGatewayComp = PaymentGatewayComp;
    this.PaymentType = PaymentType;
    this.OpeningBalance = OpeningBalance;
    this.SysOption1 = SysOption1;
    this.SysOption2 = SysOption2;
    this.SysOption3 = SysOption3;
    this.SysOption4 = SysOption4;
    this.SysOption5 = SysOption5;
    this.SysOption6 = SysOption6;
    this.SysOption7 = SysOption7;
    this.SysOption8 = SysOption8;
    this.SysOption9 = SysOption9;
    this.SysOption10 = SysOption10;

    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default PaymodeMaster;
