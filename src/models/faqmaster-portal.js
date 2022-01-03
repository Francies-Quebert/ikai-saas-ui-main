import React from "react";

class FAQMasterPortal {
  constructor(Id, Question, Answer, IsActive) {
    this.Id = Id;
    this.Question = Question;
    this.Answer = Answer;
    this.IsActive = IsActive;
    this.IsActiveComponent = (
      <i
        className={`fa fa-circle font-${IsActive ? "success" : "danger"} f-12`}
      />
    );
  }
}

export default FAQMasterPortal;
