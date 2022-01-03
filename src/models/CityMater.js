import React from 'react';
import { CheckSquare,Square } from "react-feather";

class CityMaster {
  constructor(
    CityCode,	
    CityName,	
    CountryCode,	
    StateCode,	
    lat,	
    lng,	
    IsDefault,	
    IsActive
    
  ) {
    this.CityCode = CityCode;		
    this.CityName = CityName;		
    this.CountryCode = CountryCode;		
    this.StateCode = StateCode;		
    this.lat = lat;		
    this.lng = lng;		
    this.IsDefault = IsDefault;		
    this.IsActive = IsActive;	
    this.IsActiveComponent = <i className={`fa fa-circle font-${IsActive ? 'success' : 'danger'} f-12`} />;
    this.IsDefaultComponent =  IsDefault ? <CheckSquare /> : <Square/> ;
  }
}
export default CityMaster;




