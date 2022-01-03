class AppUserPushNotification {
  constructor(
    Id,
    NotificationCode,
    NotificationType,
    UserType,
    UserId,
    Subject,
    Title,
    Message,
    NotificationDttm,
    DeliveryStatus
  ) {
    this.Id = Id;
    this.NotificationCode = NotificationCode;
    this.NotificationType = NotificationType;
    this.UserType = UserType;
    this.UserId = UserId;
    this.Subject = Subject;
    this.Title = Title;
    this.Message = Message;
    this.NotificationDttm = NotificationDttm;
    this.DeliveryStatus = DeliveryStatus;
  }
}

export default AppUserPushNotification;
