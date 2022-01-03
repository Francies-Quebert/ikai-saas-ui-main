import React from "react";
import { Avatar } from "antd";
import { PlusCircleOutlined, UserOutlined } from "@ant-design/icons";

class AppServiceType {
  constructor(
    serviceTypeCode,
    serviceTypeTitle,
    serviceTypeDesc,
    serviceTypeDescDetail,
    serviceTypeImageURI,
    IsActive,
    orderby,
    pathType,
    FileUploadPath
  ) {
    this.serviceTypeCode = serviceTypeCode;
    this.serviceTypeTitle = serviceTypeTitle;
    this.serviceTypeDesc = serviceTypeDesc;
    this.serviceTypeDescDetail = serviceTypeDescDetail;
    this.serviceTypeImageURI = serviceTypeImageURI;
    this.IsActive = IsActive;
    this.orderby = orderby;
    this.serviceTypeImage =
      serviceTypeImageURI && serviceTypeImageURI ? (
        <Avatar
          shape="square"
          src={
            pathType === "U"
              ? serviceTypeImageURI
              : `${FileUploadPath}/${serviceTypeImageURI}`
          }
        />
      ) : (
        <Avatar shape="square" icon={<UserOutlined />} />
      );
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.pathType = pathType;
  }
}

export default AppServiceType;
