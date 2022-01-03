import React from "react";

class MenuCategoryMaster {
  constructor(
    MenuCatCode,
    MenuCatName,
    MenuCatDesc,
    ImageURL,
    pathType,
    DefHSNSACCode,
    IsActive,
    TaxCode,
    uploadPath
  ) {
    this.MenuCatCode = MenuCatCode;
    this.MenuCatName = MenuCatName;
    this.MenuCatDesc = MenuCatDesc;
    this.ImageURL =
      pathType === "C" ? `${uploadPath}/${ImageURL}` : `${ImageURL}`;
    this.Image = (
      <img
        width="30px"
        height="30px"
        src={pathType === "C" ? `${uploadPath}/${ImageURL}` : `${ImageURL}`}
      />
    );
    this.pathType = pathType;
    this.DefHSNSACCode = DefHSNSACCode;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.TaxCode = TaxCode;
  }
}

export default MenuCategoryMaster;
