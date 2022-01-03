class OrderCheckIN {
  constructor(
    ScheduleId,
    OrderId,
    CheckInDTTM,
    latitude,
    longitude,
    CheckInImage
  ) {
    this.ScheduleId = ScheduleId;
    this.OrderId = OrderId;
    this.CheckInDTTM = CheckInDTTM;
    this.latitude = latitude;
    this.longitude = longitude;
    this.CheckInImage = CheckInImage;
  }
}

export default OrderCheckIN;
