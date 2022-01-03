class ScheduleCalendar {
  constructor(
    ScheduleId,
    OrderId,
    ScheduleDate,
    SlotId,
    SlotName,
    ServiceDesc,
    orderTitle,
    orderdate,
    OrderStatus,
    ScheduleStatusCode,
    ScheduleStatus,
    GrossTotal,
    disc,
    addOnCost,
    RoundOff,
    NetPayable,
    userName,
    email,
    mobile,
    gender,
    latitude,
    longitude,
    add1,
    add2,
    Pin,
    City,
    geoLocationName,
    PaymentStatus,
    AttendantId,
    EmpName,
    AttendantMobile,
    AttendantEmail,
    Category,
    Qualification,
    Experience,
    Grade,
    Designation
  ) {
    this.ScheduleId = ScheduleId;
    this.OrderId = OrderId;
    this.ScheduleDate = ScheduleDate;
    this.SlotId = SlotId;
    this.SlotName = SlotName;
    this.ServiceDesc = ServiceDesc;
    this.orderTitle = orderTitle;
    this.orderdate = orderdate;
    this.OrderStatus = OrderStatus;
    this.ScheduleStatusCode = ScheduleStatusCode;
    this.ScheduleStatus = ScheduleStatus;
    this.GrossTotal = GrossTotal;
    this.disc = disc;
    this.addOnCost = addOnCost;
    this.RoundOff = RoundOff;
    this.NetPayable = NetPayable;
    this.userName = userName;
    this.email = email;
    this.mobile = mobile;
    this.gender = gender;
    this.latitude = latitude;
    this.longitude = longitude;
    this.add1 = add1;
    this.add2 = add2;
    this.Pin = Pin;
    this.City = City;
    this.geoLocationName = geoLocationName;
    this.PaymentStatus = PaymentStatus;
    this.AttendantId = AttendantId;
    this.EmpName = EmpName;
    this.AttendantMobile = AttendantMobile;
    this.AttendantEmail = AttendantEmail;
    this.Category = Category;
    this.Qualification = Qualification;
    this.Experience = Experience;
    this.Grade = Grade;
    this.Designation = Designation;
  }
}

export default ScheduleCalendar;
