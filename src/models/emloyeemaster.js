import React from 'react';
class EmployeeMaster {
  constructor(
    Id,
    EmpType,
    FirstName,
    MiddleName,
    LastName,
    bio,
    CategoryCode,
    QualificationCode,
    ExperienceCode,
    GradeCode,
    DOB,
    Gender,
    Address1,
    Address2,
    Address3,
    City,
    PinCode,
    State,
    Country,
    tel,
    mobile1,
    mobile2,
    email,
    AadharNo,
    PanNo,
    IsActive,
    DesignationCode,
    ProfilePicture,
    pathType
  ) {
    this.Id = Id;
    this.EmpType = EmpType;
    this.Name = FirstName + " "  + MiddleName+ " "  +LastName;
    this.FirstName = FirstName;
    this.MiddleName = MiddleName;
    this.LastName = LastName;
    this.bio = bio;
    this.CategoryCode = CategoryCode;
    this.QualificationCode = QualificationCode;
    this.ExperienceCode = ExperienceCode;
    this.GradeCode = GradeCode;
    this.DOB = DOB;
    this.Gender = Gender;
    this.Address1 = Address1;
    this.Address2 = Address2;
    this.Address3 = Address3;
    this.City = City;
    this.PinCode = PinCode;
    this.State = State;
    this.Country = Country;
    this.tel = tel;
    this.mobile1 = mobile1;
    this.mobile2 = mobile2;
    this.email = email;
    this.AadharNo = AadharNo;
    this.PanNo = PanNo;
    this.IsActive = IsActive;
    this.DesignationCode = DesignationCode;
    this.ProfilePicture = ProfilePicture;
    this.pathType=pathType;
    this.IsActiveComponent = <i className={`fa fa-circle font-${IsActive ? 'success' : 'danger'} f-12`} />;
    this.IsGenderComponent =  <h6>{Gender==='M' ? 'Male' : 'Female'}</h6>;

    // let base64Image = new Buffer(
    //   ProfilePicture,
    //   "binary"
    // ).toString("base64");

    // this.ProfilePictureBase64 = base64Image
    // this.DisplayProfilePicture = <img width="30px" height="30px" src={base64Image}/>;
    // console.log("Mai hu tera bhai",base64Image)

  }
}
export default EmployeeMaster;
