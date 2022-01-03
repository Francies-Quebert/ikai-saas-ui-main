class AppConfig {
  constructor(
    id,
    configCode,
    configName,
    value1,
    value2,
    configDesc,
    configAccessLevel,
    configType,
    SysOption1,
    SysOption2
  ) {
    this.id = id;
    this.configCode = configCode;
    this.configName = configName;
    this.value1 = value1;
    this.value2 = value2;
    this.configDesc = configDesc;
    this.configAccessLevel = configAccessLevel;
    this.configType = configType;
    this.SysOption1 = SysOption1;
    this.SysOption2 = SysOption2;
  }
}

export default AppConfig;
