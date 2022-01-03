import React from "react";
class Promotion {
  constructor(
    PromotionCode,
    BranchCode,
    PromotionType,
    SchemeType,
    PromotionName,
    PromotionDesc,
    DiscountType,
    DiscountValue,
    ApplicableFrom,
    ApplicableTo,
    FromQty,
    ToQty,
    DiscQty,
    FromAmount,
    ToAmount,
    MaxDiscount,
    ApplicableFromHrs,
    ApplicableToHrs,
    App_Sun,
    App_Mon,
    App_Tue,
    App_Wed,
    App_Thu,
    App_Fri,
    App_Sat,
    TaxIncludeExclude,
    Include_SysOption1,
    Include_SysOption2,
    Include_SysOption3,
    Include_SysOption4,
    Include_SysOption5,
    Include_SysOption6,
    Include_SysOption7,
    Include_SysOption8,
    Include_SysOption9,
    Include_SysOption10,
    Exclude_SysOption1,
    Exclude_SysOption2,
    Exclude_SysOption3,
    Exclude_SysOption4,
    Exclude_SysOption5,
    Exclude_SysOption6,
    Exclude_SysOption7,
    Exclude_SysOption8,
    Exclude_SysOption9,
    Exclude_SysOption10,
    IsActive
  ) {
    this.PromotionCode = PromotionCode;
    this.BranchCode = BranchCode;
    this.PromotionType = PromotionType;
    this.SchemeType = SchemeType;
    this.PromotionName = PromotionName;
    this.PromotionDesc = PromotionDesc;
    this.DiscountType = DiscountType;
    this.DiscountValue = DiscountValue;
    this.ApplicableFrom = ApplicableFrom;
    this.ApplicableTo = ApplicableTo;
    this.FromQty = FromQty;
    this.ToQty = ToQty;
    this.DiscQty = DiscQty;
    this.FromAmount = FromAmount;
    this.ToAmount = ToAmount;
    this.MaxDiscount = MaxDiscount;
    this.ApplicableFromHrs = ApplicableFromHrs;
    this.ApplicableToHrs = ApplicableToHrs;
    this.App_Sun = App_Sun;
    this.App_Mon = App_Mon;
    this.App_Tue = App_Tue;
    this.App_Wed = App_Wed;
    this.App_Thu = App_Thu;
    this.App_Fri = App_Fri;
    this.App_Sat = App_Sat;
    this.TaxIncludeExclude = TaxIncludeExclude;
    this.Include_SysOption1 = Include_SysOption1;
    this.Include_SysOption2 = Include_SysOption2;
    this.Include_SysOption3 = Include_SysOption3;
    this.Include_SysOption4 = Include_SysOption4;
    this.Include_SysOption5 = Include_SysOption5;
    this.Include_SysOption6 = Include_SysOption6;
    this.Include_SysOption7 = Include_SysOption7;
    this.Include_SysOption8 = Include_SysOption8;
    this.Include_SysOption9 = Include_SysOption9;
    this.Include_SysOption10 = Include_SysOption10;
    this.Exclude_SysOption1 = Exclude_SysOption1;
    this.Exclude_SysOption2 = Exclude_SysOption2;
    this.Exclude_SysOption3 = Exclude_SysOption3;
    this.Exclude_SysOption4 = Exclude_SysOption4;
    this.Exclude_SysOption5 = Exclude_SysOption5;
    this.Exclude_SysOption6 = Exclude_SysOption6;
    this.Exclude_SysOption7 = Exclude_SysOption7;
    this.Exclude_SysOption8 = Exclude_SysOption8;
    this.Exclude_SysOption9 = Exclude_SysOption9;
    this.Exclude_SysOption10 = Exclude_SysOption10;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}
export default Promotion;
