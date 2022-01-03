class Config {
    constructor(
        id,
        ConfigCode,
        ConfigAccessLevel,
        ConfigType,
        ConfigName,
        Value1,
        Value2,
        ConfigDesc,
        SysOption1,
        SysOption2
    ) {
        this.id = id;
        this.ConfigCode = ConfigCode;
        this.ConfigAccessLevel = ConfigAccessLevel;
        this.ConfigType = ConfigType;
        this.ConfigName = ConfigName;
        this.Value1 = Value1;
        this.Value2 = Value2;
        this.ConfigDesc = ConfigDesc;
        this.SysOption1 = SysOption1;
        this.SysOption2 = SysOption2;

    }
}
export default Config;