import React from "react";
class PromoMaster {
  constructor(
    Id,
    PromoTitle,
    PromoImageUri,
    PathType,
    SysOption1,
    SysOption2,
    SysOption3,
    SysOption4,
    SysOption5,
    IsActive,
    Path
  ) {
    this.Id = Id;
    this.PromoTitle = PromoTitle;
    this.PromoImageUri = PromoImageUri;
    this.PathType = PathType;
    this.SysOption1 = SysOption1;
    this.SysOption2 = SysOption2;
    this.SysOption3 = SysOption3;
    this.SysOption4 = SysOption4;
    this.SysOption5 = SysOption5;
    this.IsActive = IsActive;
    this.PromoImage = <img width="30px" height="30px" src={Path} />;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}
export default PromoMaster;
