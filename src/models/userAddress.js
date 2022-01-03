class UserAddress {
  constructor(
    AddressId,
    UserType,
    UserId,
    latitude,
    longitude,
    geoLocationName,
    add1,
    add2,
    add3,
    AddressTag,
    City,
    PinCode,
    IsDefault
  ) {
    this.AddressId = AddressId;
    this.UserType = UserType;
    this.UserId = UserId;
    this.latitude = latitude;
    this.longitude = longitude;
    this.geoLocationName = geoLocationName;
    this.add1 = add1;
    this.add2 = add2;
    this.add3 = add3;
    this.AddressTag = AddressTag;
    this.City = City;
    this.PinCode = PinCode;
    this.IsDefault = IsDefault;
  }
}

export default UserAddress;
