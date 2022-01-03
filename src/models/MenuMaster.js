import React from "react";
class MenuMaster {
  constructor(
    MenuCode,
    ShortCode,
    MenuName,
    MenuDesc,
    DietType,
    UnitCode,
    MenuCatCode,
    MenuCatName,
    MenuGroupCode,
    HSNSACCode,
    TaxCode,
    ApplyForDineIn,
    ApplyForPickUp,
    ApplyForDelivery,
    ApplyForOnline,
    IsActive
  ) {
    this.MenuCode = MenuCode;
    this.ShortCode = ShortCode;
    this.MenuName = MenuName;
    this.MenuDesc = MenuDesc;
    this.DietType = DietType;
    this.DietTypeFull = DietType=="N" ? "Non-Vegetarian" : "Vegetarian";
    this.UnitCode = UnitCode;
    this.MenuCatCode = MenuCatCode;
    this.MenuCatName = MenuCatName;
    this.MenuGroupCode = MenuGroupCode;
    this.HSNSACCode = HSNSACCode;
    this.TaxCode = TaxCode;
    this.ApplyForDineIn = ApplyForDineIn === "Y" ? true : false;
    this.ApplyForPickUp = ApplyForPickUp === "Y" ? true : false;
    this.ApplyForDelivery = ApplyForDelivery === "Y" ? true : false;
    this.ApplyForOnline = ApplyForOnline === "Y" ? true : false;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}
export default MenuMaster;
