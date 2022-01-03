class UserPatientAddress {
    constructor(
        addressId,
        latitude,
        longitude,
        geoLocationName,
        add1,
        add2,
        add3,
        addressTag
    ) {
      this.addressId = addressId;
      this.latitude = latitude;
      this.longitude = longitude;
      this.geoLocationName = geoLocationName;
      this.add1 = add1;
      this.add2 = add2;
      this.add3 = add3;
      this.addressTag = addressTag;
    }
  }
  
  export default UserPatientAddress;