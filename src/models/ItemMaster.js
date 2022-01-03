import React from "react";
class ItemMaster {
  constructor(
    ItemCode,
    ItemName,
    ItemDesc,
    UnitCode,
    SubCategoryCode,
    BrandCode,
    classCode,
    className,
    IsActive,
    ProductType,
    PrintLabel,
    HSNSACCode,
    TaxCode,
    SubCatDesc,
    CatDesc,
    MarkUpDown,
    MarkUpDownPV,
    Cost,
    MRP,
    SalePrice,
    IsSaleOnMRP,
    SecondaryUnitCode,
    ConversionRate,
    MaintainInventory,
    MBQ,
    LabelCopies,
    TaxType,
    Barcode,
    BrandDesc,
    cnt
  ) {
    this.ItemCode = ItemCode;
    this.ItemName = ItemName;
    this.ItemDesc = ItemDesc;
    this.UnitCode = UnitCode;

    this.SubCatDesc = SubCatDesc;
    this.CatDesc = CatDesc;

    this.SubCategoryCode = SubCategoryCode;
    this.BrandCode = BrandCode;
    this.classCode = classCode;
    this.className = className;
    this.ProductType = ProductType;
    this.PrintLabel = PrintLabel;
    this.HSNSACCode = HSNSACCode;
    this.TaxCode = TaxCode;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.MarkUpDown = MarkUpDown;
    this.MarkUpDownPV = MarkUpDownPV;
    this.Cost = Cost;
    this.MRP = MRP;
    this.SalePrice = SalePrice;
    this.IsSaleOnMRP = IsSaleOnMRP;
    this.SecondaryUnitCode = SecondaryUnitCode;
    this.ConversionRate = ConversionRate;
    this.MaintainInventory = MaintainInventory;
    this.key = ItemCode;
    this.MBQ = MBQ;
    this.LabelCopies = LabelCopies;
    this.TaxType = TaxType;
    this.Barcode = Barcode;
    this.BrandDesc = BrandDesc;
    this.count = cnt;
  }
}
export default ItemMaster;
