class AppService {
    constructor(
      serviceType,
      serviceId,
      serviceTitle,
      serviceDesc,
      locationId,
      locationName,
      rate,
      discType,
      discValue,
      totalDisc,
      actualrate,
      packageId,
    ) {
      this.serviceType = serviceType;
      this.serviceId = serviceId;
      this.serviceTitle = serviceTitle;
      this.serviceDesc = serviceDesc;
      this.locationId = locationId;
      this.locationName = locationName;
      this.rate = rate;
      this.discType = discType;
      this.discValue = discValue;
      this.actualrate = actualrate;
      this.totalDisc = totalDisc;
      this.packageId = packageId;
    }
  }
  
  export default AppService;
  
  
  