class UserInfo {
  constructor(
    userType,
    userId,
    userTypeRef,
    userName,
    email,
    mobileNo,
    gender,
    hasDemographyInfo,
    defaultPath
  ) {
    this.userType = userType;
    this.userId = userId;
    this.userTypeRef = userTypeRef;
    this.userName = userName;
    this.email = email;
    this.mobileNo = mobileNo;
    this.gender = gender;
    this.hasDemographyInfo = hasDemographyInfo;
    this.defaultPath = defaultPath;
  }
}
export default UserInfo;
