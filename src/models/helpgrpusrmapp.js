import React from "react";
import { CheckSquare,Square } from "react-feather";
class HelpGrpUserMap {
  constructor(Id, HelpTitle, IsVisible) {
    this.isDirty = false;
    this.Id = Id;
    this.HelpTitle = HelpTitle;
    this.IsVisible = IsVisible;
    this.IsVisibleComponent = IsVisible ? <CheckSquare /> : <Square />;
  }
}
export default HelpGrpUserMap;
