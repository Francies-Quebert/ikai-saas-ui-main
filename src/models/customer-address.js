import React from "react";
import { CheckSquare, Square } from "react-feather";

class CustomerAddress {
  constructor(
    AddressId,
    UserType,
    UserId,
    add1,
    add2,
    add3,
    AddressTag,
    City,
    PinCode,
    IsDefault,
    MarkDeleted
  ) {
    this.AddressId = AddressId;
    this.UserType = UserType;
    this.UserId = UserId;
    this.add1 = add1;
    this.add2 = add2;
    this.add3 = add3;
    this.AddressTag = AddressTag;
    this.City = City;
    this.PinCode = PinCode;
    this.IsDefault = IsDefault;
    this.MarkDeleted = MarkDeleted;
  }
}
export default CustomerAddress;
