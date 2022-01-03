import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

class ServiceMaster {
  constructor(
    ServiceId,
    ServiceType,
    ServiceTitle,
    ServiceDesc,
    // ServiceDescDetail,
    ServiceImageURI,
    IsActive,
    // ServiceTypeTitle,
    HSNSACCode,
    TaxCode,
    pathType,
    FileUploadPath
  ) {
    this.ServiceId = ServiceId;
    this.ServiceType = ServiceType;
    this.ServiceTitle = ServiceTitle;
    // this.ServiceTypeTitle = ServiceTypeTitle;
    this.ServiceDesc = ServiceDesc;
    // this.ServiceDescDetail = ServiceDescDetail;
    this.ServiceImageURI = ServiceImageURI;
    this.IsActive = IsActive;
    this.ImageUrlComponent =
      ServiceImageURI && ServiceImageURI ? (
        <Avatar
          shape="square"
          src={
            pathType === "U"
              ? ServiceImageURI
              : `${FileUploadPath}/${ServiceImageURI}`
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
    this.HSNSACCode = HSNSACCode;
    this.TaxCode = TaxCode;

    this.pathType = pathType;
  }
}
export default ServiceMaster;
