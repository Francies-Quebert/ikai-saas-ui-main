class HelpCenter {
    constructor(Id,HelpCenterGroupCode, HelpCenterGroupDesc, HelpTitle, HelpDesc, IsAllowFeedback, DisplayFor) {
      this.Id = Id;
      this.HelpCenterGroupCode = HelpCenterGroupCode;
      this.HelpCenterGroupDesc = HelpCenterGroupDesc;
      this.HelpTitle = HelpTitle;
      this.HelpDesc = HelpDesc;
      this.IsAllowFeedback = IsAllowFeedback; 
      this.DisplayFor = DisplayFor;
    }
  }
  
  export default HelpCenter;
  