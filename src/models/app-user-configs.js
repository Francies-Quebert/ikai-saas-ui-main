class AppUserConfigs {
    constructor(
        UserType,
        UserId,
        IsReceivePushNotifications,
        IsReceivePromoEmails,
        IsReceivePromoSMS,
        ExpoNotificationToken,
        LL_DeviceName,
        LL_ExpoDeviceId,
        LL_SystemOS,
        LL_SystemOSVerNo,
        LL_LoginDttm,
        isLocked,
    ) {
        this.UserType = UserType;
        this.UserId = UserId;
        this.IsReceivePushNotifications = IsReceivePushNotifications;
        this.IsReceivePromoEmails = IsReceivePromoEmails;
        this.IsReceivePromoSMS = IsReceivePromoSMS;
        this.ExpoNotificationToken = ExpoNotificationToken;
        this.LL_DeviceName = LL_DeviceName;
        this.LL_ExpoDeviceId = LL_ExpoDeviceId;
        this.LL_SystemOS = LL_SystemOS;
        this.LL_SystemOSVerNo = LL_SystemOSVerNo;
        this.LL_LoginDttm = LL_LoginDttm;
        this.isLocked = isLocked;
        
    }
  }
  
  export default AppUserConfigs;
  