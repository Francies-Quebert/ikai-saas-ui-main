import React from 'react';
class PackageMaster {
    constructor(
        PackageId,
        PackageTitle,
        PackageDesc,
        PackageUnit,
        PackageUnitDesc,
        PackageDiscType,
        PackageDiscValue,
        IsActive,
        VisitType,
        PackageDiscHtml  
    ) {
        this.PackageId = PackageId;
        this.PackageTitle = PackageTitle;
        this.PackageDesc = PackageDesc;
        this.PackageUnit = PackageUnit;
        this.PackageUnitDesc = PackageUnitDesc;
        this.PackageDiscType = PackageDiscType;
        this.PackageDiscValue = PackageDiscValue;        
        this.IsActive = IsActive; 
        this.VisitType = VisitType;	
        this.PackageDiscHtml = PackageDiscHtml;		
        this.IsActiveComponent = <i className={`fa fa-circle font-${IsActive ? 'success' : 'danger'} f-12`} />;
    }
  }
  export default PackageMaster;
  
  
  