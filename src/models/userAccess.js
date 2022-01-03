class UserAccess {
  constructor(
    ModGroupId,
    ModGroupDesc,
    ModuleId,
    ModuleName,
    Rights,
    ModType
  ) {
    this.key = ModuleId;
    this.ModGroupId = ModGroupId;
    this.ModGroupDesc = ModGroupDesc;
    this.ModuleId = ModuleId;
    this.ModuleName = ModuleName;

    this.Rights = Rights;
    this.ModType = ModType;
  }
}

export default UserAccess;
