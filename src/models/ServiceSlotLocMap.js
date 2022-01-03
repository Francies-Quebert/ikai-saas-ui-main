import React from "react";

class ServiceSlotLocMapp {
  constructor(ServiceTitle, SlotName, LocationName, IsActive) {
    this.ServiceTitle = ServiceTitle;
    this.SlotName = SlotName;
    this.LocationName = LocationName;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default ServiceSlotLocMapp;
