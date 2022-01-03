class UserLoginLogsMaster {
  constructor(
    Id,
    UserType,
    UserId,
    Name,
    MobileNo,
    DeviceName,
    ExpoDeviceId,
    SystemOS,
    SystemOSVerNo,
    LoginDttm,
    ExpoNotificationToken,

  ) {
    this.Id = Id;
    this.UserType = UserType;
    this.UserId = UserId;
    this.Name = Name;
    this.MobileNo = MobileNo;
    this.DeviceName = DeviceName;
    this.ExpoDeviceId = ExpoDeviceId;
    this.SystemOS = SystemOS;
    this.SystemOSVerNo = SystemOSVerNo;
    this.LoginDttm = LoginDttm;
    this.ExpoNotificationToken = ExpoNotificationToken;

  }
}


export default UserLoginLogsMaster;
