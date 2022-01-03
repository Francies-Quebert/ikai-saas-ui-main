class OrderDetails {
  constructor(
    orderId,
    OrderDate,
    PatientId,
    PatientName,
    Relationship,
    Gender,
    Age,
    Weight,
    MedicalCondition,
    knownLanguages,
    DietPreference,
    AddressId,
    latitude,
    longitude,
    geoLocationName,
    add1,
    add2,
    add3,
    AddressTag,
    ServiceId,
    ServiceTitle,
    ServiceType,
    PackageId,
    itemRate,
    itemUnit,
    itemUnitDesc,
    itemAmount,
    itemDiscVal,
    itemNetValue,
    GrossTotal,
    disc,
    RoundOff,
    NetPayable,
    ScheduledFrom,
    ScheduledTo,
    SlotId,
    SlotName
  ) {
    this.orderId = orderId;
    this.OrderDate = OrderDate;
    this.PatientId = PatientId;
    this.PatientName = PatientName;
    this.Relationship = Relationship;
    this.Gender = Gender;
    this.Age = Age;
    this.Weight = Weight;
    this.MedicalCondition = MedicalCondition;
    this.knownLanguages = knownLanguages;
    this.DietPreference = DietPreference;
    this.AddressId = AddressId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.geoLocationName = geoLocationName;
    this.add1 = add1;
    this.add2 = add2;
    this.add3 = add3;
    this.AddressTag = AddressTag;
    this.ServiceId = ServiceId;
    this.ServiceTitle = ServiceTitle;
    this.ServiceType = ServiceType;
    this.PackageId = PackageId;
    this.itemRate = itemRate;
    this.itemUnit = itemUnit;
    this.itemUnitDesc = itemUnitDesc;
    this.itemAmount = itemAmount;
    this.itemDiscVal = itemDiscVal;
    this.itemNetValue = itemNetValue;
    this.GrossTotal = GrossTotal;
    this.disc = disc;
    this.RoundOff = RoundOff;
    this.NetPayable = NetPayable;
    this.ScheduledFrom = ScheduledFrom;
    this.ScheduledTo = ScheduledTo;
    this.SlotId = SlotId;
    this.SlotName = SlotName;
  }
}

export default OrderDetails;
