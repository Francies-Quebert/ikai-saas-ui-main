class UserMaster {
  constructor(
    SrNo,
    userType,
    userId,
    userTypeRef,
    userName,
    Gender,
    email,
    mobile,
    password,
    RegisterFrom,
    hasDemographyInfo,
    Name,
    DOBmmdd,
    DOByyyy,
    AnniversaryMMDD,
    AnniversaryYYYY,
    Add1,
    Add2,
    Add3,
    GstNo,
    User_Group,
    IsActive,
    Show_Cashier_Alert,
    Show_Kitchen_Alert,
    Show_Admin_Alert,
    Show_Waiter_Alert
  ) {
    this.SrNo = SrNo;
    this.userType = userType;
    this.userId = userId;
    this.Name = Name;
    this.userTypeRef = userTypeRef;
    this.userName = userName;
    this.Gender = Gender;
    this.email = email;
    this.mobile = mobile;
    this.password = password;
    this.RegisterFrom = RegisterFrom;
    this.hasDemographyInfo = hasDemographyInfo;
    this.DOBmmdd = DOBmmdd;
    this.DOByyyy = DOByyyy;
    this.AnniversaryMMDD = AnniversaryMMDD;
    this.AnniversaryYYYY = AnniversaryYYYY;
    this.Add1 = Add1;
    this.Add2 = Add2;
    this.Add3 = Add3;
    this.GstNo = GstNo;
    this.User_Group = User_Group;
    this.IsActive = IsActive;
    this.Show_Cashier_Alert = Show_Cashier_Alert;
    this.Show_Kitchen_Alert = Show_Kitchen_Alert;
    this.Show_Admin_Alert = Show_Admin_Alert;
    this.Show_Waiter_Alert = Show_Waiter_Alert;
  }
}

export default UserMaster;
