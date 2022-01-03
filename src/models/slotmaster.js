import React from 'react';

class SlotMaster {
    constructor(
        Id,
        SlotName,
        IsActive,
     starttime
    

    ) {
     this.Id = Id;
     this.SlotName = SlotName;
     this.IsActive = IsActive;
     this.starttime = starttime; 
     this.IsActiveComponent = <i className={`fa fa-circle font-${IsActive ? 'success' : 'danger'} f-12`} />;
    }
}


export default SlotMaster;