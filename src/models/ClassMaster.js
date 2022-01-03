import React from "react";

class ClassMaster {
  constructor(ClassId, ClassCode, ClassName, IsActive) {
    this.ClassId = ClassId;
    this.ClassCode = ClassCode;
    this.ClassName = ClassName;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default ClassMaster;
