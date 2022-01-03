class OrdersPortal {
  constructor(
    orderid,
    orderTitle,
    orderdate,
    OrderStatus,
    statusDesc,
    GrossTotal,
    disc,
    RoundOff,
    NetPayable,
    userName,
    email,
    mobile,
    gender,
    ScheduledFrom,
    ScheduledTo,
    slotName,
    latitude,
    longitude,
    add1,
    add2,
    Pin,
    City,
    geoLocationName,
    PaymentStatus,
    ActionRequired,
    AttendantId,
    EmpName,
    AttendantMobile,
    AttendantEmail,
    Category,
    Qualification,
    Experience,
    Grade,
    Designation,
    StsBackColor,
    StsForeColor,
    IsShowAccept,
    IsShowReject,
    IsShowShcedule,
    IsShowCancel,
    UpComingScheduleDate,
    UpComingScheduleSlot
  ) {
    this.orderid = orderid;
    this.orderTitle = orderTitle;
    this.orderdate = orderdate;
    this.OrderStatus = OrderStatus;
    this.statusDesc = statusDesc;
    this.GrossTotal = GrossTotal;
    this.disc = disc;
    this.RoundOff = RoundOff;
    this.NetPayable = NetPayable;
    this.userName = userName;
    this.email = email;
    this.mobile = mobile;
    this.gender = gender;
    this.ScheduledFrom = ScheduledFrom;
    this.ScheduledTo = ScheduledTo;
    this.slotName = slotName;
    this.latitude = latitude;
    this.longitude = longitude;
    this.add1 = add1;
    this.add2 = add2;
    this.Pin = Pin;
    this.City = City;
    this.geoLocationName = geoLocationName;
    this.PaymentStatus = PaymentStatus;
    this.ActionRequired = ActionRequired;
    this.AttendantId = AttendantId;
    this.EmpName = EmpName;
    this.AttendantMobile = AttendantMobile;
    this.AttendantEmail = AttendantEmail;
    this.Category = Category;
    this.Qualification = Qualification;
    this.Experience = Experience;
    this.Grade = Grade;
    this.Designation = Designation;
    this.StsBackColor = StsBackColor;
    this.StsForeColor = StsForeColor;
    this.IsShowAccept = IsShowAccept;
    this.IsShowReject = IsShowReject;
    this.IsShowShcedule = IsShowShcedule;
    this.IsShowCancel = IsShowCancel;
    this.UpComingScheduleDate = UpComingScheduleDate;
    this.UpComingScheduleSlot = UpComingScheduleSlot;
  }
}

export default OrdersPortal;
