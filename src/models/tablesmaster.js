import React from "react";

class TablesMaster {
  constructor(ShortCode, TableName, SecCode, Icon, SittingCapacity, IsActive) {
    this.ShortCode = ShortCode;
    this.TableName = TableName;
    this.SecCode = SecCode;
    this.Icon = Icon;
    this.SittingCapacity = SittingCapacity;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default TablesMaster;
