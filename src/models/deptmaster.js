import React from "react";

class DeptMaster {
    constructor(
        BranchCode,
        DeptCode,
        DeptName,
        EnablePurchase,
        EnablePurchaseReturn,
        EnableSale,
        EnableSaleReturn,
        EnableTransferIN,
        EnableTransferOUT,
        EnableAdjustments,
        IsActive,
    ) {
        this.BranchCode = BranchCode;
        this.DeptCode = DeptCode;
        this.DeptName = DeptName;
        this.EnablePurchase = EnablePurchase;
        this.EnablePurchaseReturn = EnablePurchaseReturn;
        this.EnableSale = EnableSale;
        this.EnableSaleReturn = EnableSaleReturn;
        this.EnableTransferIN = EnableTransferIN;
        this.EnableTransferOUT = EnableTransferOUT;
        this.EnableAdjustments = EnableAdjustments;
        this.IsActive = IsActive;
        this.IsActiveComponent = (<
            i className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
        />
        );
    }
}
export default DeptMaster;