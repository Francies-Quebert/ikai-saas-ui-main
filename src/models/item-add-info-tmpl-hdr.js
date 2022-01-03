import React from "react";

class ItemAddInfoTmplHdr {
  constructor(TempId, TemplateName, IsActive) {
    this.key = TempId;
    this.TempId = TempId;
    this.TemplateName = TemplateName;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}
export default ItemAddInfoTmplHdr;
