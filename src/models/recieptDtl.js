import React from "react";

class RecieptDtl {
  constructor(
    Id,
    ReceiptId,
    PaymentMode,
    Amount,
    Remark,
    SysOption1,
    SysOption2,
    SysOption3,
    SysOption4,
    SysOption5
  ) {
    this.Id = Id;
    this.ReceiptId = ReceiptId;
    this.PaymentMode = PaymentMode;
    this.Amount = Amount;
    this.Remark = Remark;
    this.SysOption1 = SysOption1;
    this.SysOption2 = SysOption2;
    this.SysOption3 = SysOption3;
    this.SysOption4 = SysOption4;
    this.SysOption5 = SysOption5;
  }
}
export default RecieptDtl;
