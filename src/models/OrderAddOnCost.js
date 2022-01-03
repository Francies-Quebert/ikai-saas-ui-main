class OrderAddOnCost {
  constructor(ScheduleId, OrderId, SrNo, ItemDesc, Rate) {
    this.key = SrNo;
    this.ScheduleId = ScheduleId;
    this.OrderId = OrderId;
    this.srNo = SrNo;
    this.desc = ItemDesc;
    this.amount = Rate;
  }
}

export default OrderAddOnCost;
