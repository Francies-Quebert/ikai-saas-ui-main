class Orders {
  constructor(
    orderId,
    OrderDate,
    OrderStatus,
    OrderStatusCode,
    PatientId,
    AddressId,
    GrossTotal,
    disc,
    RoundOff,
    NetPayable,
    ScheduledFrom,
    ScheduledTo,
    ServiceId,
    ServiceTitle,
    IsOnGoing,
    message
  ) {
    this.orderId = orderId;
    this.OrderDate = OrderDate;
    this.OrderStatus = OrderStatus;
    this.OrderStatusCode = OrderStatusCode;
    this.PatientId = PatientId;
    this.AddressId = AddressId;
    this.GrossTotal = GrossTotal;
    this.disc = disc;
    this.RoundOff = RoundOff;
    this.NetPayable = NetPayable;
    this.ScheduledFrom = ScheduledFrom;
    this.ScheduledTo = ScheduledTo;
    this.ServiceId = ServiceId;
    this.ServiceTitle = ServiceTitle;
    this.IsOnGoing = IsOnGoing;
    this.message = message;
  }
}

export default Orders;
