import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

class SectionMaster {
  constructor(SecCode, BranchCode, SecDesc, ImageURL, IsActive) {
    this.SecCode = SecCode;
    this.BranchCode = BranchCode;
    this.SecDesc = SecDesc;
    this.ImageURL = ImageURL;
    this.ImageURLComp =
      ImageURL && ImageURL.length > 0 ? (
        <Avatar shape="square" src={ImageURL} />
      ) : (
        <Avatar shape="square" icon={<UserOutlined />} />
      );
    this.IsActive = IsActive;
    this.IsActiveComp = (
      <i
        className={`fa fa-circle font-${
          IsActive === true ? "success" : "danger"
        } f-12`}
      />
    );
  }
}
export default SectionMaster;
