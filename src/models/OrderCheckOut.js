class OrderCheckOut {
  constructor(
    ScheduleId,
    OrderId,
    CheckOutDTTM,
    Observation,
    Resolution,
    CheckOutRemark
  ) {
    this.ScheduleId = ScheduleId;
    this.OrderId = OrderId;
    this.CheckOutDTTM = CheckOutDTTM;
    this.Observation = Observation;
    this.Resolution = Resolution;
    this.CheckOutRemark = CheckOutRemark;    
  }
}

export default OrderCheckOut;
