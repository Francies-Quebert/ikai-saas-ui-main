import React from 'react';

class serviceRateMap {
    constructor(
        ServiceId,
        ServiceTitle,
        LocationId,
        LocationName,
        PackageId,
        PackageTitle,
        Rate,
        discType,
        discValue,
       
    ) {
        this.ServiceId = ServiceId;		
        this.ServiceTitle = ServiceTitle;
        this.LocationId = LocationId;	
        this.LocationName = LocationName;
        this.PackageId = PackageId;
        this.PackageTitle = PackageTitle;
        this.Rate = Rate;					
        this.discType = discType;		
        this.discValue = discValue;		
    }
}
 export default serviceRateMap;