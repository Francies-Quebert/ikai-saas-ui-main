import React, { Fragment, useEffect, useState } from "react";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { hasRight } from "../../../shared/utility";
import {
  Collapse,
  Tooltip,
  Input,
  Switch,
  InputNumber,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  Divider,
  Button,
  Spin,
  TimePicker,
} from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  fetchConfigData,
  fetchHomeScreenAppLayout,
} from "../../../services/config";
import { QuestionCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import { UpdtConfig } from "../../../store/actions/config";

const { Panel } = Collapse;
const { Option } = Select;
const Config = () => {
  const [form] = Form.useForm();
  const currTran = useSelector((state) => state.currentTran);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [configData, setConfigData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const dateFormat = "YYYY-MM-DD";
  const dateTimeFormat = "YYYY-MM-DD hh:mm:ss";
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const onReset = () => {};

  useEffect(() => {
    dispatch(setFormCaption(27));
    fetchConfigData(CompCode).then((res) => {
      setConfigData(res);
      setGroupData(Object.keys(_.groupBy(res, "ConfigGroup")));
    });
  }, []);

  useEffect(() => {
    if (currentTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      onReset();
      setIsLoading(false);
    }
  }, [currentTran.lastSavedData]);

  let renderItem = null;
  renderItem = (
    <Spin indicator={antIcon} spinning={isLoading}>
      <Fragment>
        <Collapse accordion defaultActiveKey={1}>
          {groupData &&
            groupData.map((item, gIndex) => (
              <Panel header={item} key={gIndex + 1}>
                {configData &&
                  configData
                    .filter(
                      (i) => i.ConfigGroup === item //&& i.ConfigAccessLevel === "U"
                    )
                    .map((i, index) => (
                      <Row
                        key={i.key}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                          {i.ConfigName}
                          <Tooltip title={i.ConfigDesc}>
                            <span style={{ marginLeft: 5 }}>
                              <QuestionCircleOutlined
                                style={{ fontSize: "16px" }}
                              />
                            </span>
                          </Tooltip>
                        </Col>
                        <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                          <div style={{ display: "flex", marginBottom: 5 }}>
                            {i.ConfigType.split("~").map(
                              (l_ConfigType, l_index) => {
                                return (
                                  <>
                                    {l_ConfigType === "string" && (
                                      <Input
                                        // value={i.Value1}
                                        defaultValue={i[`Value${l_index + 1}`]}
                                        placeholder={`Enter value ${
                                          l_index + 1
                                        }`}
                                        style={{ marginRight: 5 }}
                                        onChange={(e) => {
                                          let prevArray = configData;
                                          prevArray[
                                            prevArray.findIndex(
                                              (iii) => iii.id === i.id
                                            )
                                          ] = {
                                            ...prevArray.find(
                                              (iii) => iii.id === i.id
                                            ),
                                            [`Value${l_index + 1}`]: e.target
                                              .value,
                                            IsDirty: true,
                                          };

                                          setConfigData(prevArray);
                                        }}
                                      />
                                    )}

                                    {l_ConfigType === "boolean" && (
                                      <Switch
                                        style={{ marginRight: 5, marginTop: 5 }}
                                        // checked={i.Value1 === "Y"}
                                        defaultChecked={
                                          i[`Value${l_index + 1}`] === "Y"
                                        }
                                        onChange={(val) => {
                                          let prevArray = configData;
                                          prevArray[
                                            prevArray.findIndex(
                                              (iii) => iii.id === i.id
                                            )
                                          ] = {
                                            ...prevArray.find(
                                              (iii) => iii.id === i.id
                                            ),
                                            [`Value${l_index + 1}`]: val
                                              ? "Y"
                                              : "N",
                                            IsDirty: true,
                                          };

                                          setConfigData(prevArray);
                                        }}
                                      />
                                    )}
                                    {l_ConfigType === "select" && (
                                      <>
                                        <Select
                                          defaultValue={
                                            i[`Value${l_index + 1}`]
                                          }
                                          style={{ width: 300, marginRight: 5 }}
                                          onChange={(val) => {
                                            let prevArray = configData;
                                            prevArray[
                                              prevArray.findIndex(
                                                (iii) => iii.id === i.id
                                              )
                                            ] = {
                                              ...prevArray.find(
                                                (iii) => iii.id === i.id
                                              ),
                                              [`Value${l_index + 1}`]: val,
                                              IsDirty: true,
                                            };

                                            setConfigData(prevArray);
                                          }}
                                        >
                                          {i[`SysOption${l_index + 1}`] &&
                                            i[`SysOption${l_index + 1}`]
                                              .split("#")
                                              .map((rrr) => {
                                                return (
                                                  <Option
                                                    value={rrr.split("~")[0]}
                                                  >
                                                    {rrr.split("~")[1]}
                                                  </Option>
                                                );
                                              })}
                                        </Select>
                                      </>
                                    )}
                                    {l_ConfigType === "multiselect" && (
                                      <>
                                        <Select
                                          mode="multiple"
                                          defaultValue={_.split(
                                            i[`Value${l_index + 1}`],
                                            "#"
                                          )}
                                          style={{ width: 300, marginRight: 5 }}
                                          onChange={(val) => {
                                            let mode = "";
                                            let prevArray = configData;

                                            val.map((value, index) => {
                                              return (mode += `${
                                                index > 0 ? "#" : ""
                                              }${value}`);
                                            });

                                            prevArray[
                                              prevArray.findIndex(
                                                (iii) => iii.id === i.id
                                              )
                                            ] = {
                                              ...prevArray.find(
                                                (iii) => iii.id === i.id
                                              ),
                                              [`Value${l_index + 1}`]: mode,
                                              IsDirty: true,
                                            };

                                            setConfigData(prevArray);
                                          }}
                                        >
                                          {i[`SysOption${l_index + 1}`] &&
                                            i[`SysOption${l_index + 1}`]
                                              .split("#")
                                              .map((rrr) => {
                                                return (
                                                  <Option
                                                    value={rrr.split("~")[0]}
                                                  >
                                                    {rrr.split("~")[1]}
                                                  </Option>
                                                );
                                              })}
                                        </Select>
                                      </>
                                    )}
                                    {l_ConfigType === "number" && (
                                      <>
                                        <InputNumber
                                          style={{ marginRight: 5 }}
                                          defaultValue={
                                            i[`Value${l_index + 1}`]
                                          }
                                          onChange={(val) => {
                                            let prevArray = configData;
                                            prevArray[
                                              prevArray.findIndex(
                                                (iii) => iii.id === i.id
                                              )
                                            ] = {
                                              ...prevArray.find(
                                                (iii) => iii.id === i.id
                                              ),
                                              [`Value${l_index + 1}`]: val,
                                              IsDirty: true,
                                            };

                                            setConfigData(prevArray);
                                          }}
                                        />
                                      </>
                                    )}
                                    {l_ConfigType === "date" && (
                                      <DatePicker
                                        defaultValue={moment(
                                          i[`Value${l_index + 1}`],
                                          dateFormat
                                        )}
                                        format={dateFormat}
                                        onChange={(val) => {
                                          let prevArray = configData;
                                          prevArray[
                                            prevArray.findIndex(
                                              (iii) => iii.id === i.id
                                            )
                                          ] = {
                                            ...prevArray.find(
                                              (iii) => iii.id === i.id
                                            ),
                                            [`Value${l_index + 1}`]: val.format(
                                              dateFormat
                                            ),
                                            IsDirty: true,
                                          };

                                          setConfigData(prevArray);
                                        }}
                                        // onOk={() => {}}
                                      />
                                    )}
                                    {l_ConfigType === "time" && (
                                      <TimePicker
                                        defaultValue={moment(
                                          i[`Value${l_index + 1}`],
                                          "HH:mm"
                                        )}
                                        format={"HH:mm"}
                                        onChange={(val) => {
                                          let prevArray = configData;
                                          prevArray[
                                            prevArray.findIndex(
                                              (iii) => iii.id === i.id
                                            )
                                          ] = {
                                            ...prevArray.find(
                                              (iii) => iii.id === i.id
                                            ),
                                            [`Value${l_index + 1}`]: val.format(
                                              "HH:mm"
                                            ),
                                            IsDirty: true,
                                          };

                                          setConfigData(prevArray);
                                        }}
                                        // onOk={() => {}}
                                      />
                                    )}
                                    {l_ConfigType === "datetime" && (
                                      <DatePicker
                                        showTime
                                        defaultValue={moment(
                                          i[`Value${l_index + 1}`],
                                          dateTimeFormat
                                        )}
                                        onChange={(val) => {
                                          let prevArray = configData;
                                          prevArray[
                                            prevArray.findIndex(
                                              (iii) => iii.id === i.id
                                            )
                                          ] = {
                                            ...prevArray.find(
                                              (iii) => iii.id === i.id
                                            ),
                                            [`Value${l_index + 1}`]: val.format(
                                              dateTimeFormat
                                            ),
                                            IsDirty: true,
                                          };

                                          setConfigData(prevArray);
                                        }}
                                        // onOk={() => {}}
                                      />
                                    )}
                                  </>
                                );
                              }
                            )}
                          </div>
                        </Col>
                        <Divider dashed={true} style={{ margin: 3 }} />
                      </Row>
                    ))}
              </Panel>
            ))}
        </Collapse>
        <Divider style={{ marginBottom: 5, marginTop: 5 }} />
        <Form.Item noStyle={true}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            disabled={hasRight(currTran.moduleRights, "EDIT")}
            style={{ marginRight: 5 }}
            onClick={() => {
              let data = [];
              configData
                .filter((item) => item.IsDirty === true)
                .map((ii) => {
                  data.push({
                    ConfigCode: ii.ConfigCode,
                    Value1: ii.Value1,
                    Value2: ii.Value2,
                  });
                });
              setIsLoading(true);
              dispatch(UpdtConfig(data));
            }}
          >
            Save
          </Button>

          <Button
            type="primary"
            icon={<RetweetOutlined />}
            style={{ marginRight: 5 }}
            onClick={() => onReset()}
          >
            Reset
          </Button>
        </Form.Item>
      </Fragment>
    </Spin>
  );

  return renderItem;
};

export default Config;
