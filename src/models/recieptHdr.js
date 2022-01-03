import React from "react";

class RecieptHdr {
  constructor(
    ReceiptId,
    ReceiptType,
    Value1,
    Value2,
    Value3,
    Value4,
    Value5,
    ReceiptDate,
    ReceiptNo,
    Amount,
    BalAmount,
    Remark
  ) {
    this.ReceiptId = ReceiptId;
    this.ReceiptType = ReceiptType;
    this.Value1 = Value1;
    this.Value2 = Value2;
    this.Value3 = Value3;
    this.Value4 = Value4;
    this.Value5 = Value5;
    this.ReceiptDate = ReceiptDate;
    this.ReceiptNo = ReceiptNo;
    this.Amount = Amount;
    this.BalAmount = BalAmount;
    this.Remark = Remark;
  }
}
export default RecieptHdr;
