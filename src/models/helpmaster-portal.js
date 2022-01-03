import React from 'react';
import { CheckSquare,Square } from "react-feather";
class HelpMasterPortal {
  constructor(Id, HelpTitle, HelpDesc, IsAllowFeedback, DisplayFor, IsActive) {
    this.Id = Id;
    this.HelpTitle = HelpTitle;
    this.HelpDesc = HelpDesc;
    this.IsAllowFeedback = IsAllowFeedback;
    this.DisplayFor = DisplayFor;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
    this.IsAllowFeedbackComponent =  IsAllowFeedback ? <CheckSquare /> : <Square/> ;
  }
}

export default HelpMasterPortal;
    