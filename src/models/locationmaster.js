import React from "react";

class LocationMaster {
  constructor(LocationId, LocationName, IsActive) {
    this.LocationId = LocationId;
    this.LocationName = LocationName;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default LocationMaster;
