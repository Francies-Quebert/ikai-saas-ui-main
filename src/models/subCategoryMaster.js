import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import _ from "lodash";
class SubCategoryMaster {
  constructor(
    SubCatCode,
    CatCode,
    SubCatDesc,
    SubCatDetailDesc,
    ImageUrl,
    PathType,
    DefHSNSACCode,
    ItemInfoTemplate,
    IsActive,
    IsInventory,
    PathUrl,
    CatDesc
  ) {
    this.SubCatCode = SubCatCode;
    this.CatCode = CatCode;
    this.SubCatDesc = SubCatDesc;
    this.SubCatDetailDesc = SubCatDetailDesc;
    this.ImageUrl = ImageUrl;
    this.PathType = PathType;
    this.Image = !_.includes(["", null, undefined, " "], PathUrl) ? (
      <img width="30px" height="30px" src={`${PathUrl}`} />
    ) : (
      <Avatar size={30} shape="square" icon={<UserOutlined />} />
    );
    this.DefHSNSACCode = DefHSNSACCode;
    this.ItemInfoTemplate = ItemInfoTemplate;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.IsInventory = IsInventory;
    this.IsInventoryComponent = (
      <i
        className={`fa fa-circle font-${
          IsInventory ? "success" : "danger"
        } f-12`}
      />
    );
    this.CatDesc = CatDesc;
    this.key = SubCatCode;
  }
}
export default SubCategoryMaster;
