import React from "react";
class OrderScheduleVisit {
  constructor(
    ScheduleId,
    OrderId,
    ScheduleDate,
    SlotId,
    slotname,
    Remark,
    Status,
    StatusDesc,
    IsActive,
    AttendantId,
    EmpName,
    mobileNo,
    email,
    Category,
    Qualification,
    Experience,
    Grade,
    Designation,
    VerificationCode
  ) {
    this.ScheduleId = ScheduleId;
    this.OrderId = OrderId;
    this.ScheduleDate = ScheduleDate;
    this.SlotId = SlotId;
    this.slotname = slotname;
    this.Remark = Remark;
    this.Status = Status;
    this.StatusDesc = StatusDesc;
    this.IsActive = IsActive;
    this.AttendantId = AttendantId;
    this.EmpName = EmpName;
    this.mobileNo = mobileNo;
    this.email = email;
    this.Category = Category;
    this.Qualification = Qualification;
    this.Experience = Experience;
    this.Grade = Grade;
    this.Designation = Designation;
    this.VerificationCode = VerificationCode;
  }
}
export default OrderScheduleVisit;
