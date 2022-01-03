class ServiceMaster {
    constructor(
        ServiceId,
        ServiceType,
        ServiceTitle,
        ServiceDesc,
        // ServiceDescDetail,
        ServiceImageURI,
        IsActive,
    ) {
        this.ServiceId = ServiceId;
        this.ServiceType = ServiceType;
        this.ServiceTitle = ServiceTitle;
        this.ServiceDesc = ServiceDesc;
        // this.ServiceDescDetail = ServiceDescDetail;
        this.ServiceImageURI = ServiceImageURI;
        this.IsActive = IsActive;

    }
}
export default ServiceMaster;