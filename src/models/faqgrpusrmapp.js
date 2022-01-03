import React from "react";
import { CheckSquare, Square } from "react-feather";
class FaqGrpUserMap {
  constructor(Id, Question, IsVisible) {
    this.isDirty = false;
    this.Id = Id;
    this.Question = Question;
    this.IsVisible = IsVisible;
    this.IsVisibleComponent = IsVisible ? <CheckSquare /> : <Square />;
  }
}
export default FaqGrpUserMap;
