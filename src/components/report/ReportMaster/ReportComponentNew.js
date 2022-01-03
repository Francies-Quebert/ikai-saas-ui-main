/* eslint-disable no-loop-func */
import React, { useEffect, useState } from "react";
import {
  fetchReportMaster,
  getReportDetailsData,
  fetchParamSelectQuery,
  getSysReportHdr,
} from "../../../services/report-master";
import {
  Button,
  Form,
  Divider,
  Empty,
  message,
  Radio,
  Select,
  DatePicker,
  InputNumber,
  Input,
  TimePicker,
  Switch,
  Row,
  Col,
  Typography,
  Card,
  Modal,
} from "antd";
import AppLoader from "../../common/AppLoader";
import _ from "lodash";
import moment, { isMoment } from "moment";
import ReportTableComponent from "./ReportTableComponent";
import { CheckDataKeys } from "../../../shared/utility";
import { useSelector, useDispatch } from "react-redux";
import ReportConfigComponent from "./ReportConfigComponent";
import {
  ArrowLeftOutlined,
  TableOutlined,
  RollbackOutlined,
  EyeOutlined,
  RetweetOutlined,
  FilterOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  PrinterOutlined,
  SettingOutlined,
} from "@ant-design/icons";
// import { fetchReportConfigComponent } from "../../../services/report";
import ReactComponentGoogleChart from "./ReportComponentGoogleChart";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const { Option } = Select;
const { Paragraph } = Typography;
const { Text } = Typography;

const ReportComponentNew = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [parameterRender, setParameterRender] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [report_Data_Col, setReport_Data_Col] = useState();
  const [report_Data_Param, setReport_Data_Param] = useState([]);
  const [report_Data_Hdr, setReport_Data_Hdr] = useState();
  const [report_Print_Hdr, setReport_Print_Hdr] = useState([]);
  const [report_Chart_Hdr, setReport_Chart_Hdr] = useState();
  const [report_Chart_Dtl, setReport_Chart_Dtl] = useState();
  const [displayType, setDisplayType] = useState("TABL");
  const [DisplayParameter, setDisplayParameter] = useState([]);
  const [showDisplayParam, setShowDisplayParam] = useState([]);
  const [editedData, setEditedData] = useState();
  const [data, setData] = useState([]);
  const dataKeys = useSelector((state) => state.AppMain);
  const [showParam, setShowParam] = useState(props.showParamFilter);
  const [modal, setModal] = useState(false);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    let ReportId = props.reportId;
    // fetchReportConfigComponent().then((res) => {
    //   setData(res);
    // });
    fetchReportMaster(CompCode, ReportId).then((res) => {
      // console.log(res);
      setReport_Data_Col(res.reportMasterCol);
      setReport_Data_Param(res.reportMasterParam);
      setReport_Data_Hdr(res.reportMasterHdr);
      setReport_Chart_Hdr(res.reportChartHdr);
      setReport_Chart_Dtl(res.reportChartDtl);
      setReport_Print_Hdr(res.reportPrintHdr);
    });
  }, []);
  let renderParamValue = [];
  useEffect(() => {
    let temp_report_Data_Param = report_Data_Param;
    if (temp_report_Data_Param.length > 0) {
      temp_report_Data_Param.forEach((param) => {
        if (
          param.ParamDataSource &&
          param.ParamDataSource.split("|")[0] === "SP"
        ) {
          fetchParamSelectQuery(
            CompCode,
            param.ParamDataSource.split("|")[1]
          ).then((ds) => {
            temp_report_Data_Param = [
              ...temp_report_Data_Param.filter((ii) => ii.Id !== param.Id),
              { ...param, dataSource: ds },
            ];
            // console.log(temp_report_Data_Param, "Sp");
            setReport_Data_Param(temp_report_Data_Param);
          });
        } else if (
          param.ParamDataSource &&
          param.ParamDataSource.split("|")[0] === "FIXED"
        ) {
          let param_values = param.ParamDataSource.split("|")[1];
          let paramDataSource = [];
          param_values.split("#").map((bb) => {
            paramDataSource.push({
              ValueMember: bb.split("~")[0],
              DisplayMember: bb.split("~")[1],
            });
          });
          temp_report_Data_Param = [
            ...report_Data_Param.filter((ii) => ii.Id !== param.Id),
            { ...param, dataSource: paramDataSource },
          ];
          setReport_Data_Param(temp_report_Data_Param);
        }
      });
    }
  }, [report_Data_Hdr]);

  useEffect(() => {
    let reportMasterParamData = report_Data_Param;
    let tempInitialValue = {};
    let tempParameter = [];
    let tempDisplayParameter = DisplayParameter;

    for (const key in reportMasterParamData) {
      let type = _.split(reportMasterParamData[key].ParamType, "~");
      let placeHolder = _.split(
        reportMasterParamData[key].ParamPlaceHolder,
        "~"
      );
      let Position = _.split(reportMasterParamData[key].ParamPosition, "~");
      let Name = _.split(reportMasterParamData[key].ParamName, "~");
      let DataSourcePosition = _.split(
        reportMasterParamData[key].ParamDataSourcePosition,
        "~"
      );

      let tempParamData = [];

      let spltInitialValue = _.split(
        reportMasterParamData[key].ParamDefValue,
        "~"
      );

      for (const key1 in type) {
        tempParamData.push({
          Id: reportMasterParamData[key].Id,
          type: type[key1],
          placeHolder: placeHolder[key1],
          Name: Name[key1],
          Position: Position[key1],
          DataSourcePosition: parseInt(DataSourcePosition[key1]),
          dataSource: reportMasterParamData[key].dataSource,
          NewLine:
            reportMasterParamData[key].ParamNewLineAfter === "Y" ? true : false,
          ParamIsVisible:
            reportMasterParamData[key].ParamIsVisible === "Y" ? true : false,
        });
      }

      tempParamData.map((element, index) => {
        if (element.type === "date") {
          const getParamValue = CheckDataKeys(
            dataKeys,
            spltInitialValue[index]
          );
          // console.log(getParamValue===undefined || getParamValue === null ? null : moment(getParamValue),"initial",getParamValue)
          tempInitialValue = {
            ...tempInitialValue,
            [`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`]:
              getParamValue === undefined || getParamValue === null
                ? null
                : moment(getParamValue),
          };

          if (getParamValue !== null && getParamValue) {
            tempDisplayParameter = [
              ...tempDisplayParameter.filter((ii) => ii.Name !== element.Name),
              {
                Position: element.Position,
                Name: element.Name,
                Param:
                  getParamValue === null
                    ? null
                    : moment(getParamValue).format("DD-MM-YYYY"),
              },
            ];
          }

          tempParameter.push({
            position: parseInt(element.Position),
            html: (
              <>
                {element.NewLine && <div style={{ width: "100%" }}></div>}
                <Form.Item
                  label={element.Name}
                  name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                  rules={
                    reportMasterParamData[key].ParamIsCompulsary === "Y"
                      ? [{ required: true, message: "Required" }]
                      : []
                  }
                >
                  <DatePicker
                    placeholder={element.placeHolder}
                    format="YYYY-MM-DD"
                    onChange={(date, datestring) => {
                      tempDisplayParameter = [
                        ...tempDisplayParameter.filter(
                          (ii) => ii.Name !== element.Name
                        ),
                        {
                          Position: element.Position,
                          Name: element.Name,
                          Param: !date ? null : date.format("DD-MM-YYYY"),
                        },
                      ];
                      setDisplayParameter(tempDisplayParameter);
                    }}
                  />
                </Form.Item>
              </>
            ),
          });
        } else if (element.type === "datetime") {
          const getParamValue = CheckDataKeys(
            dataKeys,
            spltInitialValue[index]
          );
          tempInitialValue = {
            ...tempInitialValue,
            [`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`]:
              getParamValue === null ? null : moment(getParamValue),
          };

          if (getParamValue !== null && getParamValue) {
            tempDisplayParameter = [
              ...tempDisplayParameter.filter((ii) => ii.Name !== element.Name),
              {
                Position: element.Position,
                Name: element.Name,
                Param:
                  getParamValue === null
                    ? null
                    : moment(getParamValue).format("DD-MM-YYYY HH:mm"),
              },
            ];
          }

          tempParameter.push({
            position: parseInt(element.Position),
            html: (
              <>
                {element.NewLine && <div style={{ width: "100%" }}></div>}
                <Form.Item
                  label={element.Name}
                  name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                  rules={
                    reportMasterParamData[key].ParamIsCompulsary === "Y"
                      ? [{ required: true, message: "Required" }]
                      : []
                  }
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={element.placeHolder}
                    onChange={(date, datestring) => {
                      tempDisplayParameter = [
                        ...tempDisplayParameter.filter(
                          (ii) => ii.Name !== element.Name
                        ),
                        {
                          Position: element.Position,
                          Name: element.Name,
                          Param: !date ? null : date.format("DD-MM-YYYY HH:mm"),
                        },
                      ];
                      setDisplayParameter(tempDisplayParameter);
                    }}
                  />
                </Form.Item>
              </>
            ),
          });
        } else if (element.type === "time") {
          const getParamValue = CheckDataKeys(
            dataKeys,
            spltInitialValue[index]
          );
          tempInitialValue = {
            ...tempInitialValue,
            [`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`]:
              getParamValue === null
                ? null
                : moment(getParamValue, "HH:mmm:ss"),
          };

          if (getParamValue !== null && getParamValue) {
            tempDisplayParameter = [
              ...tempDisplayParameter.filter((ii) => ii.Name !== element.Name),
              {
                Position: element.Position,
                Name: element.Name,
                Param:
                  getParamValue === null
                    ? null
                    : isMoment(getParamValue)
                    ? getParamValue.format("HH:mm:ss")
                    : getParamValue,
              },
            ];
          }

          tempParameter.push({
            position: parseInt(element.Position),
            html: (
              <>
                {element.NewLine && <div style={{ width: "100%" }}></div>}
                <Form.Item
                  label={element.Name}
                  name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                  rules={
                    reportMasterParamData[key].ParamIsCompulsary === "Y"
                      ? [{ required: true, message: "Required" }]
                      : []
                  }
                >
                  <TimePicker
                    placeholder={element.placeHolder}
                    onChange={(val, time) => {
                      tempDisplayParameter = [
                        ...tempDisplayParameter.filter(
                          (ii) => ii.Name !== element.Name
                        ),
                        {
                          Position: element.Position,
                          Name: element.Name,
                          Param: time !== null ? time : null,
                        },
                      ];
                      setDisplayParameter(tempDisplayParameter);
                    }}
                  />
                </Form.Item>
              </>
            ),
          });
        } else if (element.type === "number") {
          const getParamValue = CheckDataKeys(
            dataKeys,
            spltInitialValue[index]
          );

          tempInitialValue = {
            ...tempInitialValue,
            [`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`]:
              getParamValue,
          };
          if (getParamValue !== null && getParamValue) {
            tempDisplayParameter = [
              ...tempDisplayParameter.filter((ii) => ii.Name !== element.Name),
              {
                Position: element.Position,
                Name: element.Name,
                Param: getParamValue === null ? null : getParamValue,
              },
            ];
          }
          tempParameter.push({
            position: parseInt(element.Position),
            html: (
              <>
                {element.NewLine && <div style={{ width: "100%" }}></div>}
                <Form.Item
                  label={element.Name}
                  name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                  rules={
                    reportMasterParamData[key].ParamIsCompulsary === "Y"
                      ? [{ required: true, message: "Required" }]
                      : []
                  }
                >
                  <InputNumber
                    placeholder={element.placeHolder}
                    onChange={(val) => {
                      tempDisplayParameter = [
                        ...tempDisplayParameter.filter(
                          (ii) => ii.Name !== element.Name
                        ),
                        {
                          Position: element.Position,
                          Name: element.Name,
                          Param: val !== null ? val : null,
                        },
                      ];
                      setDisplayParameter(tempDisplayParameter);
                    }}
                  />
                </Form.Item>
              </>
            ),
          });
        } else if (element.type === "boolean") {
          const getParamValue = CheckDataKeys(
            dataKeys,
            spltInitialValue[index]
          );

          tempInitialValue = {
            ...tempInitialValue,
            [`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`]:
              getParamValue === null
                ? false
                : getParamValue === "Y" || getParamValue === "1"
                ? true
                : false,
          };

          if (getParamValue !== null && getParamValue) {
            tempDisplayParameter = [
              ...tempDisplayParameter.filter((ii) => ii.Name !== element.Name),
              {
                Position: element.Position,
                Name: element.Name,
                Param:
                  getParamValue === "Y" ||
                  (getParamValue === "1" && getParamValue !== null)
                    ? true
                    : false,
              },
            ];
          }

          tempParameter.push({
            position: parseInt(element.Position),
            html: (
              <>
                {element.NewLine && <div style={{ width: "100%" }}></div>}
                <Form.Item
                  label={element.Name}
                  name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                  rules={
                    reportMasterParamData[key].ParamIsCompulsary === "Y"
                      ? [{ required: true, message: "Required" }]
                      : []
                  }
                  valuePropName="checked"
                >
                  <Switch
                    onChange={(val, test) => {
                      tempDisplayParameter = [
                        ...tempDisplayParameter.filter(
                          (ii) => ii.Name !== element.Name
                        ),
                        {
                          Position: element.Position,
                          Name: element.Name,
                          Param: val,
                        },
                      ];
                      setDisplayParameter(tempDisplayParameter);
                    }}
                  />
                </Form.Item>
              </>
            ),
          });
        } else if (element.type === "select") {
          const getParamValue = CheckDataKeys(
            dataKeys,
            spltInitialValue[index]
          );
          tempInitialValue = {
            ...tempInitialValue,
            [`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`]:
              getParamValue,
          };

          if (
            getParamValue !== null &&
            getParamValue &&
            element.dataSource.length > 0
          ) {
            tempDisplayParameter = [
              ...tempDisplayParameter.filter((ii) => ii.Name !== element.Name),
              {
                Position: element.Position,
                Name: element.Name,
                Param:
                  getParamValue === null
                    ? null
                    : element.dataSource.find(
                        (ii) => ii.ValueMember === getParamValue
                      ).DisplayMember,
              },
            ];
          }

          tempParameter.push({
            position: parseInt(element.Position),
            html: (
              <>
                {element.NewLine && <div style={{ width: "100%" }}></div>}
                <Form.Item
                  label={element.Name}
                  name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                  rules={
                    reportMasterParamData[key].ParamIsCompulsary === "Y"
                      ? [{ required: true, message: "Required" }]
                      : []
                  }
                  style={{ display: element.ParamIsVisible ? "flex" : "none" }}
                >
                  <Select
                    placeholder={element.placeHolder}
                    allowClear={true}
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: "100%", minWidth: 180 }}
                    onChange={(value, option) => {
                      tempDisplayParameter = [
                        ...tempDisplayParameter.filter(
                          (ii) => ii.Name !== element.Name
                        ),
                        {
                          Position: element.Position,
                          Name: element.Name,
                          Param:
                            option && option.children ? option.children : null,
                        },
                      ];
                      setDisplayParameter(tempDisplayParameter);
                    }}
                  >
                    {element.dataSource.map((itm) => {
                      return (
                        <Option key={itm.ValueMember} value={itm.ValueMember}>
                          {itm.DisplayMember}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </>
            ),
          });
        } else {
          const getParamValue = CheckDataKeys(
            dataKeys,
            spltInitialValue[index]
          );
          tempInitialValue = {
            ...tempInitialValue,
            [`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`]:
              getParamValue === null ? "" : getParamValue,
          };

          if (getParamValue !== null && getParamValue) {
            tempDisplayParameter = [
              ...tempDisplayParameter.filter((ii) => ii.Name !== element.Name),
              {
                Position: element.Position,
                Name: element.Name,
                Param: getParamValue !== null ? getParamValue : null,
              },
            ];
          }

          tempParameter.push({
            position: parseInt(element.Position),
            html: (
              <>
                {element.NewLine && <div style={{ width: "100%" }}></div>}
                <Form.Item
                  label={element.Name}
                  name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                  rules={
                    reportMasterParamData[key].ParamIsCompulsary === "Y"
                      ? [{ required: true, message: "Required" }]
                      : []
                  }
                >
                  <Input
                    placeholder={element.placeHolder}
                    onChange={(e) => {
                      tempDisplayParameter = [
                        ...tempDisplayParameter.filter(
                          (ii) => ii.Name !== element.Name
                        ),
                        {
                          Position: element.Position,
                          Name: element.Name,
                          Param: e.target.value !== "" ? e.target.value : null,
                        },
                      ];
                      setDisplayParameter(tempDisplayParameter);
                    }}
                  />
                </Form.Item>
              </>
            ),
          });
        }
      });
    }
    setInitialValue(tempInitialValue);
    setParameterRender(tempParameter);
    setDisplayParameter(tempDisplayParameter);
  }, [report_Data_Param]);

  useEffect(() => {
    if (
      !_.isEmpty(initialValue) &&
      report_Data_Hdr &&
      report_Data_Param.length > 0
    ) {
      onFinish(initialValue);
    } else if (initialValue) {
      onFinish(null);
    }
  }, [report_Data_Hdr, report_Data_Param]);

  const onFinish = (val) => {
    let finalData = [];
    let reportMasterHdr = report_Data_Hdr;

    if (val !== null) {
      let keys = Object.keys(val);

      setShowDisplayParam(DisplayParameter);

      Object.values(val).forEach((element, index) => {
        let valSplit = _.split(keys[index], "#");

        if (valSplit[1] === "date") {
          finalData.push({
            dataSourcePostion: parseInt(valSplit[0]),
            data: element === null ? null : element.format("YYYY-MM-DD"),
          });
        } else if (valSplit[1] === "datetime") {
          finalData.push({
            dataSourcePostion: parseInt(valSplit[0]),
            data:
              element === null ? null : element.format("YYYY-MM-DD HH:mm:ss"),
          });
        } else if (valSplit[1] === "time") {
          finalData.push({
            dataSourcePostion: parseInt(valSplit[0]),
            data: element === null ? null : element.format("HH:mm:ss"),
          });
        } else if (valSplit[1] === "boolean") {
          finalData.push({
            dataSourcePostion: parseInt(valSplit[0]),
            data: element === true ? "Y" : "N",
          });
        } else if (valSplit[1] === "number") {
          finalData.push({
            dataSourcePostion: parseInt(valSplit[0]),
            data: element === "" ? null : element,
          });
        } else if (valSplit[1] === "select") {
          finalData.push({
            dataSourcePostion: parseInt(valSplit[0]),
            data: element === "" ? null : element,
          });
        } else {
          finalData.push({
            dataSourcePostion: parseInt(valSplit[0]),
            data: element === "" ? null : element,
          });
        }
      });

      const pParameter = finalData.sort((a, b) =>
        a.dataSourcePostion > b.dataSourcePostion ? 1 : -1
      );
      console.log(val, "ss");
      

      getReportDetailsData(
        CompCode,
        reportMasterHdr[0].ReportSource,
        pParameter
      )
        .then((res) => {
          setIsLoading(true);
          setData(res);
        })
        .catch((err) => {
          message.error("An error has occured please try again", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (reportMasterHdr && reportMasterHdr.length > 0) {
      getReportDetailsData(CompCode, reportMasterHdr[0].ReportSource, null)
        .then((res) => {
          setIsLoading(true);
          setData(res);
        })
        .catch((err) => {
          message.error("An error has occured please try again", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div>
      {isLoading === true ? (
        <AppLoader />
      ) : (
        <>
          {
            <>
              <Card
                style={{ marginBottom: 3 }}
                bodyStyle={{
                  padding: 0,
                  margin: "2px 0px",
                  // border: "1px solid #cecece",
                  // padding:"5px 2px"
                }}
              >
                <Form
                  layout="inline"
                  form={form}
                  onFinish={onFinish}
                  style={{ marginBottom: 5 }}
                  initialValues={initialValue}
                >
                  <Row style={{ display: showParam ? "flex" : "none" }}>
                    {parameterRender
                      .sort((a, b) => (a.position > b.position ? 1 : -1))
                      .map((item, index) => {
                        return <>{item.html}</>;
                      })}

                    {/* <div style={{ width: "100%", margin: "0px 0px" }}>*/}
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: 7 }}
                        size="middle"
                        icon={<EyeOutlined />}
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => {
                          form.resetFields();
                        }}
                        style={{
                          marginRight: 7,
                        }}
                        size="middle"
                        icon={<RetweetOutlined />}
                      >
                        Reset
                      </Button>
                    </Form.Item>

                    {/* <Divider style={{ margin: 0, marginTop: 5 }} /> */}
                    {/* </Row></div>  */}
                  </Row>

                  <Row style={{ width: "100%" }}>
                    <Col
                      flex="1 1 200px"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 10,
                      }}
                    >
                      <Row style={{ width: "100%" }}>
                        <Col>
                          <Text strong>
                            {report_Data_Hdr && report_Data_Hdr[0].ReportName}
                          </Text>
                        </Col>
                        <Col flex="auto">
                          <Paragraph
                            style={{ marginBottom: 0, display: "flex" }}
                            ellipsis={{
                              rows: 1,
                              expandable: true,
                            }}
                          >
                            &nbsp;&nbsp;
                            {showDisplayParam.length > 0 &&
                              showDisplayParam
                                .filter(
                                  (item) =>
                                    item.Param !== null && item.Param !== ""
                                )
                                .sort((a, b) =>
                                  a.Position > b.Position ? 1 : -1
                                )
                                .map((ii) => {
                                  return (
                                    <Text type="secondary">
                                      {` ${ii.Name}`}: {`${ii.Param}`}
                                    </Text>
                                  );
                                })}
                          </Paragraph>
                        </Col>
                      </Row>
                    </Col>

                    <Col
                      flex="0 1 300px"
                      style={{
                        textAlign: "end",
                        margin: "2px 5px",
                      }}
                    >
                      <Switch
                        checkedChildren={<FilterOutlined />}
                        unCheckedChildren={<FilterOutlined />}
                        checked={showParam}
                        onChange={(val) => {
                          setShowParam(val);
                        }}
                        style={{ marginRight: 7 }}
                      />
                      {props.hdrDtl && (
                        <Radio.Group
                          defaultValue={displayType}
                          buttonStyle="solid"
                          onChange={(e) => {
                            setDisplayType(e.target.value);
                          }}
                          size="middle"
                        >
                          <Radio.Button
                            disabled={props.hdrDtl.hasView === "N"}
                            value="TABL"
                          >
                            <TableOutlined />
                          </Radio.Button>
                          <Radio.Button
                            disabled={props.hdrDtl.hasPrintable === "N"}
                            value="PRINT"
                          >
                            <PrinterOutlined />
                          </Radio.Button>
                          <Radio.Button
                            disabled={props.hdrDtl.hasGraph === "N"}
                            value="GRAPHS"
                          >
                            <LineChartOutlined />
                            {"  "}
                            <PieChartOutlined /> {"  "}
                            <BarChartOutlined />
                          </Radio.Button>
                        </Radio.Group>
                      )}

                      <Button
                        style={{ marginRight: 7 }}
                        icon={<SettingOutlined />}
                        onClick={() => {
                          setModal(true);
                          // setEditedData({ entryMode: "A" });
                        }}
                      />
                    </Col>
                  </Row>
                </Form>

                {modal && (
                  <Modal
                    visible={modal}
                    footer={false}
                    bodyStyle={{ padding: "10px 10px" }}
                    destroyOnClose={true}
                    onCancel={() => {
                      setModal(false);
                    }}
                    width={"90%"}
                  >
                    <ReportConfigComponent
                      colData={
                        (report_Data_Col,
                        report_Data_Hdr,
                        report_Data_Param,
                        report_Chart_Hdr,
                        report_Print_Hdr)
                      }
                      reportId={props.reportId}
                      onBackPress={() => {
                        setModal(false);
                      }}
                      onFinish={() => {
                        setModal(false);
                        message.success(
                          "Data saved Successfully, To See Changes Reload the Page",
                          10
                        );
                      }}
                    />
                  </Modal>
                )}
              </Card>
            </>
          }

          {report_Data_Col ? (
            <>
              {displayType === "TABL" && (
                <ReportTableComponent colData={report_Data_Col} data={data} />
              )}

              {displayType === "GRAPHS" && (
                <div>
                  <div>
                    <Carousel autoplay>
                      {report_Chart_Hdr &&
                        report_Chart_Hdr.length > 0 &&
                        report_Chart_Hdr.map((chart) => {
                          // console.log('some chat', chart)
                          return (
                            <div key={chart.ChartId}>
                              <ReactComponentGoogleChart
                                config={{
                                  ChartHdr: chart,
                                  ChartDtl:
                                    report_Chart_Dtl &&
                                    report_Chart_Dtl.filter(
                                      (ii) => ii.ChartId === chart.ChartId
                                    ),
                                }}
                                data={data}
                              />
                            </div>
                          );
                        })}
                    </Carousel>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Divider style={{ margin: "5px 0px" }} />
              <Empty style={{ border: "1px solid #f0f0f0" }} />
            </>
          )}
          {props.showBackButton && (
            <div
              style={{
                textAlign: "end",
                marginTop: 2,
                background: "#fff",
                padding: "5px 6px",
                border: "1px solid #cecece",
              }}
            >
              <Button
                type="primary"
                style={{
                  marginLeft: 7,
                  // backgroundColor: "#48b792",
                  // borderColor: "#48b792",
                }}
                icon={<ArrowLeftOutlined />}
                size="middle"
                onClick={() => {
                  form.resetFields();
                  props.onBackPress();
                }}
              >
                Back
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportComponentNew;
