import React from "react";

class CompMain {
  constructor(
    compCode,
    compShortName,
    compName,
    validity,
    address1,
    address2,
    address3,
    City,
    Pin,
    Country,
    GST,
    PAN,
    ContantPerson,
    Directors,
    tel,
    tel2,
    mobile,
    email,
    website
  ) {
    this.compCode = compCode;
    this.compShortName = compShortName;
    this.compName = compName;
    this.validity = validity;
    this.address1 = address1;
    this.address2 = address2;
    this.address3 = address3;
    this.City = City;
    this.Pin = Pin;
    this.Country = Country;
    this.GST = GST;
    this.PAN = PAN;
    this.ContantPerson = ContantPerson;
    this.Directors = Directors;
    this.tel = tel;
    this.tel2 = tel2;
    this.mobile = mobile;
    this.email = email;
    this.website = website;
  }
}
export default CompMain;
