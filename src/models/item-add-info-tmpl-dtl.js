class ItemAddInfoTmplDtl {
  constructor(
    TempId,
    SrNo,
    FieldTitle,
    DefaultValue,
    IsReadOnly,
    IsCompulsary,
    orderBy,
    key
  ) {
    this.TempId = TempId;
    this.SrNo = SrNo;
    this.FieldTitle = FieldTitle;
    this.DefaultValue = DefaultValue;
    this.IsReadOnly = IsReadOnly;
    this.IsCompulsary = IsCompulsary;
    this.orderBy = orderBy;
    this.key = key;
    this.isDeleted = false;
  }
}

export default ItemAddInfoTmplDtl;
