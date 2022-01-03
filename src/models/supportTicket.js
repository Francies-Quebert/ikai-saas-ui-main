import React from "react";
class SupportTicket {
  constructor(
    TicketNo,
    name,
    mobile,
    HelpType,
    HelpTitle,
    HelpDesc,
    CustomHelpText,
    statusCode,
    StatusDesc,
    orderNo,
    Remark,
    crt_usrId,
    crt_dttm,
    updt_dttm,
    updt_usrId,
    ArrSupportStatusCodes
  ) {
    this.TicketNo = TicketNo;
    this.name = name;
    this.mobile = mobile;
    this.HelpType = HelpType;
    this.HelpTitle = HelpTitle;
    this.HelpDesc = HelpDesc;
    this.CustomHelpText = CustomHelpText;
    let BackColor = "white";
    let ForeColor = "black";

    if (ArrSupportStatusCodes) {
      const res = ArrSupportStatusCodes.find(
        item => item.ShortCode === statusCode
      );
      BackColor = res.SysOption1;
      ForeColor = res.SysOption2;
    }
    this.StatusCodeComponent = (
      // <i className={`fa fa-circle f-12`} style={{ color: `${res}` }} />
      <div
        // className="fa"
        
        style={{ backgroundColor: BackColor, color:ForeColor }}
        // style="background-color:green !important"
      >
        {StatusDesc}
        {/* <label style={{ color: ForeColor }}></label> */}
      </div>
    );
    this.statusCode = statusCode;
    this.StatusDesc = StatusDesc;
    this.orderNo = orderNo;
    this.Remark = Remark;
    this.crt_usrId = crt_usrId;
    this.crt_dttm = crt_dttm;
    this.updt_dttm = updt_dttm;
    this.updt_usrId = updt_usrId;
  }
}

export default SupportTicket;
