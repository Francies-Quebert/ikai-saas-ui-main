class Notificationlog {
  constructor(
    EventCode,
    EventDesc,
    NotificationType,
    SendDTTM,
    Status,
    crt_dttm
  ) {
    this.EventCode = EventCode;
    this.EventDesc = EventDesc;
    this.NotificationType = NotificationType;
    this.SendDTTM = SendDTTM;
    this.Status = Status;
    this.crt_dttm = crt_dttm;
  }
}

export default Notificationlog;
