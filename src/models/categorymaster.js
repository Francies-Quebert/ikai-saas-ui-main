import React from "react";
import { Avatar } from "antd";
import { PlusCircleOutlined, UserOutlined } from "@ant-design/icons";

class CategoryMaster {
  constructor(
    CatCode,
    CatDesc,
    CatDetailDesc,
    ImageUrl,
    pathType,
    IsActive,
    path
  ) {
    this.CatCode = CatCode;
    this.CatDesc = CatDesc;
    this.CatDetailDesc = CatDetailDesc;
    this.ImageUrl = ImageUrl;
    this.pathType = pathType;
    this.IsActive = IsActive;
    this.ImageUrlComponent =
      ImageUrl && ImageUrl.length > 0 ? (
        <Avatar shape="square" src={`${path}`} />
      ) : (
        <Avatar shape="square" icon={<UserOutlined />} />
      );
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.key = CatCode;
  }
}
export default CategoryMaster;
