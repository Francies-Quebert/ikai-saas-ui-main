class PortalMaster {
  constructor(
    Id,
    PromoTitle,
    PromoImageUri,
    SysOption1,
    SysOption2,
    SysOption3,
    SysOption4,
    SysOption5,
    IsActive,
  ) {
    this.Id = Id;
    this.PromoTitle = PromoTitle;
    this.PromoImageUri = PromoImageUri;
    this.SysOption1 = SysOption1;
    this.SysOption2 = SysOption2;
    this.SysOption3 = SysOption3;
    this.SysOption4 = SysOption4;
    this.SysOption5 = SysOption5;
    this.IsActive = IsActive;
  }
}
export default PortalMaster;