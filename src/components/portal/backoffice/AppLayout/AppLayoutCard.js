import {
  PrinterOutlined,
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
// import { Card } from "@material-ui/core";
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Radio,
  Card,
  Select,
  Switch,
  InputNumber,
  notification,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  InsUpdtAppLayout,
  fetchLayoutTypeConfigHdr,
  fetchLayoutTypeConfigDtl,
} from "../../../../services/app-layout";
import CardHeader from "../../../common/CardHeader";
import { useSelector } from "react-redux";
import _ from "lodash";
// import { number } from "yup";
const { Option } = Select;

const labelColSpan = 6;
const TextColSpan = 18;

const AppLayoutCard = (props) => {
  // console.log(props, "fdg");
  const initialValue = {
    LayoutId: props.data && props.data.LayoutId ? props.data.LayoutId : null,
    LayoutType:
      props.data && props.data.LayoutType ? props.data.LayoutType : null,
    LayoutTitle:
      props.data && props.data.LayoutTitle ? props.data.LayoutTitle : null,
    SysOption1:
      props.data && props.data.SysOption1 ? props.data.SysOption1 : null,
    SysOption2:
      props.data && props.data.SysOption2 ? props.data.SysOption2 : null,
    SysOption3:
      props.data && props.data.SysOption3 ? props.data.SysOption3 : null,
    SysOption4:
      props.data && props.data.SysOption4 ? props.data.SysOption4 : null,
    SysOption5:
      props.data && props.data.SysOption5 ? props.data.SysOption5 : null,
    SysOption6:
      props.data && props.data.SysOption6 ? props.data.SysOption6 : null,
    SysOption7:
      props.data && props.data.SysOption7 ? props.data.SysOption7 : null,
    SysOption8:
      props.data && props.data.SysOption8 ? props.data.SysOption8 : null,
    SysOption9:
      props.data && props.data.SysOption9 ? props.data.SysOption9 : null,
    SysOption10:
      props.data && props.data.SysOption10 ? props.data.SysOption10 : null,
    SysOption11:
      props.data && props.data.SysOption11 ? props.data.SysOption11 : null,
    SysOption12:
      props.data && props.data.SysOption12 ? props.data.SysOption12 : null,
    SysOption13:
      props.data && props.data.SysOption13 ? props.data.SysOption13 : null,
    SysOption14:
      props.data && props.data.SysOption14 ? props.data.SysOption14 : null,
    SysOption15:
      props.data && props.data.SysOption15 ? props.data.SysOption15 : null,
    SysOption16:
      props.data && props.data.SysOption16 ? props.data.SysOption16 : null,
    SysOption17:
      props.data && props.data.SysOption17 ? props.data.SysOption17 : null,
    SysOption18:
      props.data && props.data.SysOption18 ? props.data.SysOption18 : null,
    SysOption19:
      props.data && props.data.SysOption19 ? props.data.SysOption19 : null,
    SysOption20:
      props.data && props.data.SysOption20 ? props.data.SysOption20 : null,
    OrderBy: props.data && props.data.OrderBy ? props.data.OrderBy : null,
    status: props.data && props.data.status ? props.data.status : true,
  };

  const [data, setData] = useState(initialValue);
  const [isLoading, setIsLoading] = useState();
  const [layoutType, setLayoutType] = useState([]);

  const [layoutFieldTitle, setLayoutFieldTitle] = useState([]);

  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    fetchLayoutTypeConfigHdr(CompCode).then((res) => {
      setLayoutType(res);
    });
    if (props.entryMode === "E") {
      fetchLayoutTypeConfigDtl(CompCode, props.data.LayoutType).then((res) => {
        let data = res.map((aa, index) => {
          return {
            ...aa,
            OptionType: `SysOption${index + 1}`,
            OptionValue: props.data[`SysOption${index + 1}`],
            key: index + 1,
          };
        });
        setLayoutFieldTitle(data);
      });
    }
  }, []);

  const onFinish = () => {
    setIsLoading(true);
    let tdata = [];
    layoutFieldTitle.map((aa, i) => {
      let obj = {
        [aa.OptionType]: aa.OptionValue,
      };
      return tdata.push({
        ...obj,
      });
    });
    tdata = _.reduce(tdata, _.extend);
    if (data) {
      let finalData = {
        CompCode: CompCode,
        DeviceType: props.DeviceType,
        LayoutId: data.LayoutId,
        LayoutTitle: data.LayoutTitle,
        LayoutType: data.LayoutType,
        ...tdata,
        OrderBy: data.OrderBy,
        IsActive: data.status,
        updt_usr: l_loginUser,
      };
      InsUpdtAppLayout([finalData]).then((res) => {
        notification.success({
          message: "Succesfull",
          description: "Data saved Successfully, ",
        });
        setIsLoading(false);
        props.onBackPress();
      });
    }
  };

  return (
    <div>
      <Row>
        <Col flex={0.37}>
          <CardHeader title="App Layout Form" />
          <Card bordered={true} bodyStyle={{ padding: 6 }}>
            <Col>
              <Row style={{ padding: 6 }}>
                <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                  <span style={{ color: "red" }}>*</span> Layout Title :
                </Col>
                <Col span={TextColSpan}>
                  <Input
                    placeholder="Please input layout title!"
                    value={data.LayoutTitle}
                    onChange={(e) => {
                      setData({ ...data, LayoutTitle: e.target.value });
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row style={{ padding: 6 }}>
                <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                  Layout Type :
                </Col>
                <Col span={TextColSpan}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Please input layout title!"
                    value={data.LayoutType}
                    onChange={(val) => {
                      setData({ ...data, LayoutType: val });
                      fetchLayoutTypeConfigDtl(CompCode, val).then((res) => {
                        // console.log(res, "dtl data");
                        let data = res.map((aa, index) => {
                          return {
                            ...aa,
                            OptionType: `SysOption${index + 1}`,
                            OptionValue: null,
                            key: index + 1,
                          };
                        });
                        // console.log(data);
                        setLayoutFieldTitle(data);
                      });
                    }}
                  >
                    {layoutType.map((aa) => {
                      return (
                        <Option
                          key={aa.LayoutTypeCode}
                          value={aa.LayoutTypeCode}
                        >
                          {aa.LayoutTypeDesc}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Col>
            {layoutFieldTitle.map((aa) => {
              return (
                <Row style={{ padding: 6 }} key={aa.key}>
                  <Col span={labelColSpan} style={{ alignSelf: "center" }}>
                    {aa.ColName} :
                  </Col>
                  <Col span={TextColSpan} style={{ alignSelf: "center" }}>
                    {aa.ColDataType === "boolean" && (
                      <Switch
                        checked={
                          aa.OptionValue && aa.OptionValue === "Y"
                            ? true
                            : false
                        }
                        onChange={(val) => {
                          let dataSrc = [...layoutFieldTitle];
                          let dataSrcIdx = dataSrc.findIndex(
                            (cc) => cc.key === aa.key
                          );
                          dataSrc[dataSrcIdx].OptionValue = val ? "Y" : "N";
                          setLayoutFieldTitle([...dataSrc]);
                        }}
                      />
                    )}

                    {aa.ColDataType === "number" && (
                      <InputNumber
                        placeholder={`Enter ${aa.ColName}`}
                        value={aa.OptionValue}
                        onChange={(val) => {
                          let dataSrc = [...layoutFieldTitle];
                          let dataSrcIdx = dataSrc.findIndex(
                            (cc) => cc.key === aa.key
                          );
                          dataSrc[dataSrcIdx].OptionValue = val;
                          setLayoutFieldTitle([...dataSrc]);
                        }}
                      />
                    )}

                    {aa.ColDataType === "text" && (
                      <Input
                        placeholder={`Enter ${aa.ColName}`}
                        value={aa.OptionValue}
                        onChange={(e) => {
                          let dataSrc = [...layoutFieldTitle];
                          let dataSrcIdx = dataSrc.findIndex(
                            (cc) => cc.key === aa.key
                          );
                          dataSrc[dataSrcIdx].OptionValue = e.target.value;
                          setLayoutFieldTitle([...dataSrc]);
                        }}
                      />
                    )}
                    {aa.ColDataType === "select" && (
                      <Select
                        placeholder={`Enter ${aa.ColName}`}
                        value={aa.OptionValue}
                        onChange={(val) => {
                          let dataSrc = [...layoutFieldTitle];
                          let dataSrcIdx = dataSrc.findIndex(
                            (cc) => cc.key === aa.key
                          );
                          dataSrc[dataSrcIdx].OptionValue = val;
                          setLayoutFieldTitle([...dataSrc]);
                        }}
                      >
                        <Option></Option>
                      </Select>
                    )}
                  </Col>
                </Row>
              );
            })}
            <Col>
              <Row style={{ padding: 6 }}>
                <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                  OrderBy <span style={{ color: "red" }}>*</span> :
                </Col>
                <Col span={TextColSpan}>
                  <InputNumber
                    placeholder="Please input layout title!"
                    value={data.OrderBy}
                    onChange={(val) => {
                      setData({ ...data, OrderBy: val });
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row style={{ padding: 6 }}>
                <Col style={{ alignSelf: "center" }} span={labelColSpan}>
                  Status :
                </Col>
                <Col span={TextColSpan}>
                  <Radio.Group
                    onChange={(e) => {
                      // console.log(e, "say");
                      setData({ ...data, status: e.target.value });
                    }}
                    value={data.status}
                  >
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>InActive</Radio>
                  </Radio.Group>
                </Col>
              </Row>
            </Col>
            <Divider style={{ marginBottom: 5, marginTop: 5 }} />

            <Col>
              <Row style={{ padding: 6 }}>
                <Button
                  disabled={
                    (_.includes([null, undefined, ""], data.LayoutTitle),
                    _.includes([null, undefined, ""], data.OrderBy))
                  }
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    onFinish();
                    props.onBackPress();
                  }}
                >
                  Save
                </Button>
                <Button
                  type="primary"
                  icon={<RetweetOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    if (props.entryMode === "A" || props.entryMode === "E") {
                      setData(initialValue);
                    }
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  icon={<RollbackOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    props.onBackPress();
                  }}
                >
                  Back
                </Button>
                {/* <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  style={{ marginRight: 5 }}
                >
                  Print
                </Button> */}
              </Row>
            </Col>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AppLayoutCard;
