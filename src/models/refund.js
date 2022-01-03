import React from "react";

class Refund {
  constructor(
    RefundId,
    RefundType,
    Value1,
    Value2,
    Value3,
    Value4,
    Value5,
    RefundDate,
    RefundNo,
    Amount,
    ReceiptId,
    ReceiptDate,
    Remark
  ) {
    this.RefundId = RefundId;
    this.RefundType = RefundType;
    this.Value1 = Value1;
    this.Value2 = Value2;
    this.Value3 = Value3;
    this.Value4 = Value4;
    this.Value5 = Value5;
    this.RefundDate = RefundDate;
    this.RefundNo = RefundNo;
    this.Amount = Amount;
    this.ReceiptId = ReceiptId;
    this.ReceiptDate = ReceiptDate;
    this.Remark = Remark;
  }
}
export default Refund;
