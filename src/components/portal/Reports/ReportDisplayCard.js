import React, { useState, useEffect } from "react";
import {
  Menu,
  notification,
  Spin,
  Form,
  Button,
  Switch,
  InputNumber,
  Select,
  Input,
  DatePicker,
  TimePicker,
  message,
  Radio,
  Divider,
  Empty,
  Modal,
} from "antd";
import {
  SettingOutlined,
  DownloadOutlined,
  RollbackOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  fetchReportMasterNew,
  fetchParamSelectQuery,
  getReportDetailsData,
  getReportPrintData,
} from "../../../services/report-master";
import _ from "lodash";
import moment from "moment";
import { CheckDataKeys, CheckDataKeysNew } from "../../../shared/utility";
import ReportTableComponent from "../../report/ReportMaster/ReportTableComponent";
import { Carousel } from "react-responsive-carousel";
import ReportConfigComponent from "../../report/ReportMaster/ReportConfigComponent";
import ReactComponentGoogleChart from "../../report/ReportMaster/ReportComponentGoogleChart";
// import Rpt from "./PUR-10078.pdf";
import renderHTML from "react-render-html";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import "./Sample.less";
import ReportHeadCard from "./ReportHeadCard";
import fileDownload from "js-file-download";
const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const { Option } = Select;
const ReportDisplayCard = (props) => {
  const appMainData = useSelector((state) => state.AppMain);
  const [form] = Form.useForm();
  const [showParameter, setShowParameter] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [selectOptions, setSelectOptions] = useState([]);
  const [parameterRender, setParameterRender] = useState([]);
  const [displayType, setDisplayType] = useState();
  const [data, setData] = useState([]);
  // const [DisplayParameter, setDisplayParameter] = useState([]);
  const [report_Data_Hdr, setReport_Data_Hdr] = useState();
  const [TableData, setTableData] = useState([]);
  const dataKeys = useSelector((state) => state.AppMain);
  const [report_Data_Col, setReport_Data_Col] = useState();
  const [TableLoading, setTableLoading] = useState(false);
  const [report_Chart_Hdr, setReport_Chart_Hdr] = useState();
  const [report_Chart_Dtl, setReport_Chart_Dtl] = useState();

  const [report_Data_Param, setReport_Data_Param] = useState([]);
  const [report_Print_Hdr, setReport_Print_Hdr] = useState([]);
  const [modal, setModal] = useState(false);
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const [displayParameter, setDisplayParameter] = useState();
  const [pdfReport, setPdfReport] = useState();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [formSize, setformSize] = useState("small");
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  // useEffect(() => {
  //   if (report_Data_Hdr && (report_Data_Col || report_Print_Hdr)) {
  //     onFinish(form.getFieldsValue(), report_Data_Hdr);
  //   }
  // }, [displayType]);

  useEffect(() => {
    setParameterRender([]);
    setReport_Data_Hdr();
    setPdfReport();
    setDisplayType();
    if (props.selectedReport && props.selectedReport.ModuleSysOption1) {
      setIsLoading(true);
      fetchReportMasterNew(
        CompCode,
        props.selectedReport.ModuleSysOption1
      ).then(async (res) => {
        setReport_Data_Col(res.reportMasterCol);
        setReport_Data_Hdr(res.reportMasterHdr);
        setReport_Chart_Hdr(res.reportChartHdr);
        setReport_Chart_Dtl(res.reportChartDtl);
        setReport_Print_Hdr(res.reportPrintHdr);

        let tempData = await fetchParamDataSource(res.reportMasterParam);
        let displayInitial = res.reportMasterHdr[0].defaultReportViewType;
        let dType =
          displayInitial === "V"
            ? "TABL"
            : displayInitial === "P"
            ? "PRINT"
            : displayInitial === "G"
            ? "GRAPHS"
            : undefined;
        setDisplayType(dType);
        setReport_Data_Param(tempData);
        // if (tempData) {
        if (
          res.reportMasterHdr.length > 0 &&
          _.includes(res.reportMasterHdr[0].ReportSource, "?")
        ) {
          await fetchParameter(tempData).then(async (param) => {
            setInitialValue(param.initialValue);
            let htmlData = [];
            param.paramter.map((aa) => {
              let findHtmlIndex = htmlData.findIndex((e) => e.Id === aa.Id);
              if (findHtmlIndex >= 0) {
                htmlData[findHtmlIndex].parameter.push({
                  ...aa,
                  key: htmlData[findHtmlIndex].parameter.length + 1,
                });
              } else {
                htmlData.push({ Id: aa.Id, parameter: [{ ...aa, key: 1 }] });
              }
            });
            setParameterRender(htmlData);
            onFinish(
              param.initialValue,
              res.reportMasterHdr,
              dType,
              res.reportPrintHdr
            )
              .then((res) => {
                setTableLoading(false);
              })
              .catch((err) => {
                notification.error({
                  message: "Error Occured",
                  description: err,
                });
              });
          });
        } else {
          onFinish(null, res.reportMasterHdr, dType, res.reportPrintHdr)
            .then((res) => {
              setTableLoading(false);
            })
            .catch((err) => {
              notification.error({
                message: "Error Occured",
                description: err,
              });
            });
        }
        setIsLoading(false);
        // } else {
        //   setIsLoading(false);
        // }
      });
    }
    return () => {};
  }, [props.selectedReport]);

  const fetchParameter = (parameterArr) => {
    return new Promise(async (resolve, reject) => {
      try {
        let tempParameter = [];
        let reportMasterParamData = parameterArr;
        let tempInitialValue = {};

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
          let ParamDesc = _.split(reportMasterParamData[key].ParamDesc, "~");
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
              dataSource: reportMasterParamData[key].dataSource
                ? reportMasterParamData[key].dataSource
                : [],
              NewLine:
                reportMasterParamData[key].ParamNewLineAfter === "Y"
                  ? true
                  : false,
              ParamIsVisible:
                reportMasterParamData[key].ParamIsVisible === "Y"
                  ? true
                  : false,
              ParamDesc: ParamDesc[key1],
            });
          }

          await tempParamData.map(async (element, index) => {
            if (element.type === "date") {
              const getParamValue = CheckDataKeys(
                dataKeys,
                spltInitialValue[index]
              );
              tempInitialValue = {
                ...tempInitialValue,
                [`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`]:
                  getParamValue === undefined || getParamValue === null
                    ? null
                    : moment(getParamValue),
              };
              await tempParameter.push({
                position: parseInt(element.Position),
                Id: element.Id,
                type: element.type,
                ParamIsVisible: element.ParamIsVisible,
                html: (
                  <>
                    {element.NewLine && <div style={{ width: "100%" }}></div>}
                    <Form.Item
                      label={element.ParamDesc}
                      name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                      rules={
                        reportMasterParamData[key].ParamIsCompulsary === "Y"
                          ? [{ required: true, message: "Required" }]
                          : []
                      }
                    >
                      <DatePicker
                        // style={{ display: element.ParamIsVisible ? "block" : "none" }}
                        placeholder={element.placeHolder}
                        format={l_ConfigDateFormat}
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

              await tempParameter.push({
                Id: element.Id,
                type: element.type,
                position: parseInt(element.Position),
                ParamIsVisible: element.ParamIsVisible,
                html: (
                  <>
                    {element.NewLine && <div style={{ width: "100%" }}></div>}
                    <Form.Item
                      label={element.ParamDesc}
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
              await tempParameter.push({
                Id: element.Id,
                type: element.type,
                position: parseInt(element.Position),
                ParamIsVisible: element.ParamIsVisible,
                html: (
                  <>
                    {element.NewLine && <div style={{ width: "100%" }}></div>}
                    <Form.Item
                      label={element.ParamDesc}
                      name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                      rules={
                        reportMasterParamData[key].ParamIsCompulsary === "Y"
                          ? [{ required: true, message: "Required" }]
                          : []
                      }
                    >
                      <TimePicker
                        placeholder={element.placeHolder}
                        onChange={(val, time) => {}}
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
              await tempParameter.push({
                Id: element.Id,
                type: element.type,
                position: parseInt(element.Position),
                ParamIsVisible: element.ParamIsVisible,
                html: (
                  <>
                    {element.NewLine && <div style={{ width: "100%" }}></div>}
                    <Form.Item
                      label={element.ParamDesc}
                      name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                      rules={
                        reportMasterParamData[key].ParamIsCompulsary === "Y"
                          ? [{ required: true, message: "Required" }]
                          : []
                      }
                    >
                      <InputNumber
                        placeholder={element.placeHolder}
                        onChange={(val) => {}}
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
              await tempParameter.push({
                Id: element.Id,
                type: element.type,
                position: parseInt(element.Position),
                ParamIsVisible: element.ParamIsVisible,
                html: (
                  <>
                    {element.NewLine && <div style={{ width: "100%" }}></div>}
                    <Form.Item
                      label={element.ParamDesc}
                      name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                      rules={
                        reportMasterParamData[key].ParamIsCompulsary === "Y"
                          ? [{ required: true, message: "Required" }]
                          : []
                      }
                      valuePropName="checked"
                    >
                      <Switch onChange={(val, test) => {}} />
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
              let temp_report_Data_Param = [];
              tempParameter.push({
                Id: element.Id,
                type: element.type,
                position: parseInt(element.Position),
                ParamIsVisible: element.ParamIsVisible,
                html: (
                  <>
                    <Form.Item
                      label={element.ParamDesc}
                      name={`${element.DataSourcePosition}#${element.type}#${element.Position}#${element.Name}`}
                      rules={
                        reportMasterParamData[key].ParamIsCompulsary === "Y"
                          ? [{ required: true, message: "Required" }]
                          : []
                      }
                      style={{
                        display: element.ParamIsVisible ? "flex" : "none",
                      }}
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
                      >
                        {element.dataSource &&
                          element.dataSource.map((itm) => {
                            return (
                              <Option
                                key={itm.ValueMember}
                                value={itm.ValueMember}
                              >
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

              // if (getParamValue !== null && getParamValue) {
              //   tempDisplayParameter = [
              //     ...tempDisplayParameter.filter(
              //       (ii) => ii.Name !== element.Name
              //     ),
              //     {
              //       Position: element.Position,
              //       Name: element.Name,
              //       Param: getParamValue !== null ? getParamValue : null,
              //     },
              //   ];
              // }

              await tempParameter.push({
                Id: element.Id,
                type: element.type,
                position: parseInt(element.Position),
                ParamIsVisible: element.ParamIsVisible,
                html: (
                  <>
                    {element.NewLine && <div style={{ width: "100%" }}></div>}
                    <Form.Item
                      label={element.ParamDesc}
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
                          // tempDisplayParameter = [
                          //   ...tempDisplayParameter.filter(
                          //     (ii) => ii.Name !== element.Name
                          //   ),
                          //   {
                          //     Position: element.Position,
                          //     Name: element.Name,
                          //     Param:
                          //       e.target.value !== "" ? e.target.value : null,
                          //   },
                          // ];
                          // setDisplayParameter(tempDisplayParameter);
                        }}
                      />
                    </Form.Item>
                  </>
                ),
              });
            }
          });
        }
        resolve({
          paramter: await tempParameter,
          initialValue: await tempInitialValue,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const fetchParamDataSource = async (dataSource) => {
    return new Promise(async (resolve, reject) => {
      try {
        let temp_report_Data_Param = [];

        for (let i = 0; i < dataSource.length; i++) {
          const param = dataSource[i];
          if (
            param.ParamDataSource &&
            param.ParamDataSource !== null &&
            param.ParamDataSource.split("|")[0] === "SP"
          ) {
            let tempParamData =
              param.ParamDataSource.split("|")[1].match(/\(([^)]+)\)/);
            let tempQueryParam = "";
            if (tempParamData !== null) {
              let parmArr = tempParamData[1].split(",");
              parmArr.map((p, idx) => {
                // console.log("hari-tt", p);
                let data = CheckDataKeysNew(appMainData, p);
                if (idx <= 0) {
                  tempQueryParam += `'${data}'`;
                } else {
                  tempQueryParam += `,'${data}'`;
                }
              });
            }

            let tempQuery = param.ParamDataSource.split("|")[1].replace(
              /\((.+?)\)/g,
              "(" + tempQueryParam + ")"
            );
            await fetchParamSelectQuery(tempQuery).then(async (ds) => {
              temp_report_Data_Param.push({ ...param, dataSource: ds[0] });
            });
          } else if (
            param.ParamDataSource &&
            param.ParamDataSource !== null &&
            param.ParamDataSource.split("|")[0] === "FIXED"
          ) {
            // console.log("in fixed");
            let param_values = param.ParamDataSource.split("|")[1];
            let paramDataSource = [];
            param_values.split("#").map((bb) => {
              paramDataSource.push({
                ValueMember: bb.split("~")[0],
                DisplayMember: bb.split("~")[1],
              });
            });
            temp_report_Data_Param.push({
              ...param,
              dataSource: paramDataSource,
            });
            // console.log("in fixed");
          } else {
            // console.log("in else");
            temp_report_Data_Param.push(param);
          }
        }
        resolve(temp_report_Data_Param);
        // console.log("loop end", temp_report_Data_Param);
        resolve(await temp_report_Data_Param);
      } catch (error) {
        reject(error);
      }
    });
  };

  const onFinish = (val, rptHdr, pDisType, rptPrintHdr) => {
    return new Promise(async function (resolve, reject) {
      try {
        setTableLoading(true);
        let finalData = [];
        // console.log(val);
        let reportMasterHdr = rptHdr ? rptHdr : report_Data_Hdr;
        let reportMasterPrintHdr = rptPrintHdr ? rptPrintHdr : report_Print_Hdr;
        let disType = pDisType ? pDisType : displayType;

        if (val !== null) {
          let keys = Object.keys(val);

          // setShowDisplayParam(DisplayParameter);

          Object.values(val).forEach((element, index) => {
            let valSplit = _.split(keys[index], "#");

            if (valSplit[1] === "date") {
              finalData.push({
                dataSourcePostion: parseInt(valSplit[0]),
                data: element === null ? null : element.format("YYYY-MM-DD"),
                label: valSplit[3],
              });
            } else if (valSplit[1] === "datetime") {
              finalData.push({
                dataSourcePostion: parseInt(valSplit[0]),
                data:
                  element === null
                    ? null
                    : element.format("YYYY-MM-DD HH:mm:ss"),
                label: valSplit[3],
              });
            } else if (valSplit[1] === "time") {
              finalData.push({
                dataSourcePostion: parseInt(valSplit[0]),
                data: element === null ? null : element.format("HH:mm:ss"),
                label: valSplit[3],
              });
            } else if (valSplit[1] === "boolean") {
              finalData.push({
                dataSourcePostion: parseInt(valSplit[0]),
                data: element === true ? "Y" : "N",
                label: valSplit[3],
              });
            } else if (valSplit[1] === "number") {
              finalData.push({
                dataSourcePostion: parseInt(valSplit[0]),
                data: element === "" ? null : element,
                label: valSplit[3],
              });
            } else if (valSplit[1] === "select") {
              finalData.push({
                dataSourcePostion: parseInt(valSplit[0]),
                data: element === "" ? null : element,
                label: valSplit[3],
              });
            } else {
              finalData.push({
                dataSourcePostion: parseInt(valSplit[0]),
                data: element === "" ? null : element,
                label: valSplit[3],
              });
            }
          });

          const pParameter = finalData.sort((a, b) =>
            a.dataSourcePostion > b.dataSourcePostion ? 1 : -1
          );

          let displayParam = "";
          pParameter.forEach((aa) => {
            if (!_.includes([null, undefined, ""], aa.data)) {
              return (displayParam += `${aa.data}#`);
            }
          });
          setDisplayParameter({ type: "array", data: pParameter });
          if (disType === "TABL") {
            getReportDetailsData(
              CompCode,
              reportMasterHdr[0].ReportSource,
              pParameter
            )
              .then(async (res) => {
                // setIsLoading(true);
                resolve(res);
                let tempData = [];
                await res.forEach((dd, index) => {
                  tempData.push({
                    ...dd,
                    key: dd.key ? dd.key : dd.Id ? dd.Id : index,
                  });
                });
                setData([...tempData]);
              })
              .catch((err) => {
                setTableLoading(false);
                notification.error({
                  message: "Error Occured",
                  description: err + ". Contact adminstrator",
                });
              });
            // .finally(() => {
            //   setTableLoading(false);
            //   // setIsLoading(false);
            // });
          } else if (disType === "PRINT") {
            let apiParam = { OutputType: "HTML", CompCode: CompCode };

            pParameter.map((pp) => {
              apiParam = { ...apiParam, [pp.label]: pp.data };
            });

            const apiData = {
              api_endpoint: reportMasterPrintHdr[0].api_endpoint,
              parameter: apiParam,
            };

            setPdfReport();
            getReportPrintData(apiData, "HTML")
              .then((res) => {
                resolve(res);
                setPdfReport(res.data);
              })
              .catch((err) => {
                notification.error({
                  message: "Error Occured",
                  description: err + ". Contact adminstrator",
                });
              });
            // .finally(() => {
            //   setTableLoading(false);
            //   // setIsLoading(false);
            // });
          } else {
            resolve(true);
          }
        } else if (
          reportMasterHdr &&
          reportMasterHdr.length > 0 &&
          val === null
        ) {
          // console.log("null val");
          if (disType === "TABL") {
            let tempParamData =
              reportMasterHdr[0].ReportSource.match(/\(([^)]+)\)/);
            let tempQueryParam = "";
            if (tempParamData !== null) {
              let parmArr = tempParamData[1].split(",");
              parmArr.map((p, idx) => {
                let data = CheckDataKeysNew(appMainData, p);
                if (idx <= 0) {
                  tempQueryParam += `${data}`;
                } else {
                  tempQueryParam += `,${data}`;
                }
              });
            }

            let tempQuery = reportMasterHdr[0].ReportSource.replace(
              /\((.+?)\)/g,
              "(" + tempQueryParam + ")"
            );
            getReportDetailsData(CompCode, tempQuery, null)
              .then(async (res) => {
                resolve(res);
                // setIsLoading(true);
                let tempData = [];
                await res.forEach(async (dd, index) => {
                  await tempData.push({
                    ...dd,
                    key: dd.key ? dd.key : dd.Id ? dd.Id : index,
                  });
                });
                setData([...tempData]);
              })
              .catch((err) => {
                message.error("An error has occured please try again", err);
              });
          } else if (disType === "PRINT") {
            let apiParam = { OutputType: "HTML" };

            const apiData = {
              api_endpoint: reportMasterPrintHdr[0].api_endpoint,
              parameter: apiParam,
            };
            setPdfReport();
            getReportPrintData(apiData, "HTML")
              .then((res) => {
                resolve(res);
                setPdfReport(res.data);
              })
              .catch((err) => {
                notification.error({
                  message: "Error Occured",
                  description: err + ". Contact adminstrator",
                });
              });
          } else {
            resolve(true);
          }
        } else {
          setTableLoading(false);
        }
      } catch (error) {
        setTableLoading(false);
      }
    });
  };

  return (
    <div
    // style={
    //   {
    //     // height: "calc(100% - 57px)",
    //   }
    // }
    >
      <>
        <ReportHeadCard
          isModal={props.isModal}
          onCollapsePress={() => {
            props.onCollapsePress();
          }}
          onClosePress={() => {
            props.onClosePress();
          }}
          isCollapsed={props.isCollapsed}
          selectedReport={props.selectedReport}
          onDisplayTypeChange={(val) => {
            setDisplayType(val);
          }}
          displayType={displayType}
          onReportSettingClick={() => {
            setModal(true);
          }}
          reportHdr={
            report_Data_Hdr && report_Data_Hdr.length > 0
              ? report_Data_Hdr[0]
              : null
          }
          showParameter={showParameter}
          onParameterChange={(show) => {
            setShowParameter(show);
          }}
        />
        {props.selectedReport ? (
          <>
            <div
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                marginTop: 5,
                flex: "1",
                minHeight: 0,
                display: "flex",
                border: "1px solid var(--app-theme-color-rbga)",
                borderRadius: "3px",
                flexDirection: "column",
              }}
              className="style-3"
            >
              {parameterRender && parameterRender.length > 0 && (
                <>
                  {/* <div
                    onClick={() => {
                      setShowParameter(!showParameter);
                    }}
                    style={{
                      borderBottom: "1px solid var(--app-theme-color)",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Report Parameter
                  </div> */}
                  <div
                    className={`parameter-content ${
                      showParameter ? "show" : ""
                    } style-3`}
                  >
                    {isLoading ? (
                      <div style={{ textAlign: "center", padding: "15px 0px" }}>
                        <Spin />
                      </div>
                    ) : (
                      <>
                        <Form
                          // layout="inline"
                          size={formSize}
                          className="report-form-style"
                          {...layout}
                          form={form}
                          onFinish={(val) => {
                            // setIsLoading(true)
                            onFinish(val, report_Data_Hdr, displayType)
                              .then((res) => {
                                // setIsLoading(false)
                                setTableLoading(false);
                              })
                              .catch((err) => {
                                notification.error({
                                  message: "Error Occured",
                                  description: err,
                                });
                              });
                          }}
                          style={{ marginBottom: 5, padding: 10 }}
                          initialValues={initialValue}
                          // layout={{ labelCol: 8, wrapperCol: 16 }}
                        >
                          {parameterRender.map((itm, i) => {
                            return (
                              <div
                                key={itm.Id}
                                style={{ display: "block", width: "100%" }}
                                // change display flex to render 2 data in one line
                              >
                                {itm.parameter
                                  .sort((a, b) =>
                                    a.position > b.position ? 1 : -1
                                  )
                                  .map((aa) => {
                                    return (
                                      <div
                                        key={`${aa.key}-${aa.Id}`}
                                        style={{
                                          display: aa.ParamIsVisible
                                            ? "block"
                                            : "none",
                                        }}
                                      >
                                        {aa.html}
                                      </div>
                                    );
                                  })}
                              </div>
                            );
                          })}
                          <div style={{ width: "100%", margin: "0px 0px" }}>
                            <Form.Item>
                              <Button
                                type="primary"
                                htmlType="submit"
                                icon={<FileOutlined />}
                                style={{ marginRight: 7 }}
                                size="middle"
                              >
                                View
                              </Button>
                              <Button
                                size="middle"
                                type="primary"
                                onClick={() => {
                                  form.resetFields();
                                  // setData([]);
                                }}
                                icon={<RollbackOutlined />}
                                style={{
                                  backgroundColor: "transparent",
                                  borderColor: "#d9d9d9",
                                  marginRight: 20,
                                  color: "rgba(0, 0, 0, 0.85)",
                                }}
                              >
                                Reset
                              </Button>
                              {displayType && displayType === "PRINT" && (
                                <>
                                  <Button
                                    size="middle"
                                    style={{ marginRight: 0 }}
                                    icon={<SettingOutlined />}
                                    onClick={() => {
                                      // props.onReportSettingClick();
                                      // setModal(true);
                                      // setEditedData({ entryMode: "A" });
                                    }}
                                  />
                                  <Button
                                    size="middle"
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    style={{ marginRight: 7 }}
                                    loading={downloadLoading}
                                    onClick={() => {
                                      if (displayParameter) {
                                        setDownloadLoading(true);

                                        let apiParam = { OutputType: "PDF" };

                                        displayParameter.data.map((pp) => {
                                          apiParam = {
                                            ...apiParam,
                                            [pp.label]: pp.data,
                                          };
                                        });

                                        const apiData = {
                                          api_endpoint:
                                            report_Print_Hdr[0].api_endpoint,
                                          parameter: apiParam,
                                        };
                                        let dataType = "pdf";
                                        if (window.electron) {
                                          dataType = "html";
                                        }
                                        getReportPrintData(apiData, dataType)
                                          .then((res) => {
                                            if (res) {
                                              let fileName = `${
                                                report_Data_Hdr[0].ReportDesc
                                              }-${moment().format(
                                                "YYYY-MM-DD HH:mm:ss"
                                              )}`;
                                              if (window.electron) {
                                                window.electron.ipcRenderer.send(
                                                  "store-data",
                                                  {
                                                    pdf: res.data,
                                                    name: `${fileName}.${dataType}`,
                                                    type: dataType,
                                                  }
                                                );
                                                window.electron.ipcRenderer.on(
                                                  "data-stored",
                                                  (event, arg) => {
                                                    console.log(
                                                      "data stored",
                                                      arg
                                                    );
                                                  }
                                                );
                                              } else {
                                                fileDownload(
                                                  res.data,
                                                  `${fileName}.${dataType}`
                                                );
                                              }
                                            }
                                          })
                                          .catch((err) => {
                                            notification.error({
                                              message: "Error Occured",
                                              description:
                                                err + ". Contact adminstrator",
                                            });
                                            setDownloadLoading(false);
                                          })

                                          .finally(() => {
                                            setDownloadLoading(false);
                                            // setTableLoading(false);
                                            // setIsLoading(false);
                                          });
                                      }
                                    }}
                                  >
                                    Download
                                  </Button>
                                </>
                              )}
                            </Form.Item>
                          </div>
                        </Form>
                      </>
                    )}
                    {/* sad */}
                  </div>
                </>
              )}
              {/* <div style={{ minHeight: 800 }}>Top Hand Side Component</div> */}
            </div>

            <div
              style={{
                width: "100%",
                backgroundColor: "#FFF",
                padding: "10px",
                marginTop: 5,
                flex: "1",
                transition: "height 1s ease-out",
                // height: !showParameter ? "max-content" : "calc(70vh - 57px)",
                // height: "70vh",
                // height: "50%",
                minHeight: 40,
                display: "flex",
                overflowY: "auto",
                border: "1px solid var(--app-theme-color-rbga)",
                borderRadius: "3px",
                flexFlow: "row wrap",
              }}
              className="style-3"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0px 0px 2px 0px",
                }}
              >
                <div style={{ lineHeight: 2, display: "flex" }}>
                  {displayParameter &&
                  displayParameter.type === "array" &&
                  displayParameter.data.length > 0
                    ? displayParameter.data.map((pp, i) => {
                        if (pp.data !== null) {
                          return (
                            <div style={{ marginRight: 3 }} key={i}>
                              {/* <span>{pp.label} : </span>
                          <span style={{ fontWeight: "600" }}>
                            {pp.type === "date"
                              ? moment(pp.data).format(l_ConfigDateFormat)
                              : pp.data}
                          </span> */}
                            </div>
                          );
                        }
                      })
                    : ""}
                </div>
                <div style={{ textAlign: "end" }}>
                  {/* {report_Data_Hdr && (
                <Radio.Group
                  defaultValue={displayType}
                  buttonStyle="solid"
                  onChange={(e) => {
                    setDisplayType(e.target.value);
                  }}
                  size="middle"
                >
                  <Radio.Button
                    // disabled={props.hdrDtl.hasView === "N"}
                    value="TABL"
                  >
                    <TableOutlined />
                  </Radio.Button>
                  <Radio.Button
                    // disabled={props.hdrDtl.hasPrintable === "N"}
                    value="PRINT"
                  >
                    <PrinterOutlined />
                  </Radio.Button>
                  <Radio.Button
                    // disabled={props.hdrDtl.hasGraph === "N"}
                    value="GRAPHS"
                  >
                    <LineChartOutlined style={{ padding: "0px 3px" }} />
                    <PieChartOutlined style={{ padding: "0px 3px" }} />
                    <BarChartOutlined style={{ padding: "0px 3px" }} />
                  </Radio.Button>
                </Radio.Group>
              )} */}
                  {/* <Button
                style={{ marginRight: 7 }}
                icon={<SettingOutlined />}
                onClick={() => {
                  setModal(true);
                  // setEditedData({ entryMode: "A" });
                }}
              /> */}
                </div>
              </div>
              <Modal
                visible={modal}
                footer={false}
                bodyStyle={{ padding: "10px 10px" }}
                destroyOnClose={true}
                onCancel={() => {
                  // props.onCloseModal();
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
                  reportId={props.selectedReport}
                  onBackPress={() => {
                    // props.onCloseModal();
                    setModal(false);
                  }}
                  onFinish={() => {
                    // props.onCloseModal();
                    setModal(false);
                    notification.success({
                      message: "Succesfull",
                      description:
                        "Data saved Successfully, To See Changes Reload the Page",
                    });
                  }}
                />
              </Modal>
              <Spin
                spinning={isLoading || TableLoading}
                wrapperClassName="spin-reports-display"
              >
                {/* <div style={{ height: 800, width: "100%" }}> */}
                {!TableLoading && displayType ? (
                  <>
                    {displayType === "TABL" &&
                      report_Data_Col &&
                      report_Data_Col.length > 0 &&
                      data.length > 0 && (
                        <ReportTableComponent
                          colData={report_Data_Col}
                          data={data}
                        />
                      )}

                    {displayType === "PRINT" && (
                      <div>
                        {pdfReport ? renderHTML(pdfReport) : null}
                        {/* <Document
                          file={pdfReport ? pdfReport : null}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={console.error}
                          options={options}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document>
                        <div>
                          <p>
                            Page {pageNumber || (numPages ? 1 : "--")} of{" "}
                            {numPages || "--"}
                          </p>
                          <button
                            type="button"
                            disabled={pageNumber <= 1}
                            onClick={previousPage}
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            disabled={pageNumber >= numPages}
                            onClick={nextPage}
                          >
                            Next
                          </button>
                        </div> */}
                      </div>
                    )}

                    {displayType === "GRAPHS" && (
                      <div>
                        <div>
                          <Carousel autoplay>
                            {report_Chart_Hdr &&
                              report_Chart_Hdr.length > 0 &&
                              report_Chart_Hdr.map((chart) => {
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
                {/* </div> */}
              </Spin>
            </div>
          </>
        ) : (
          "No Report Selected"
        )}
      </>
    </div>
  );
};

export default ReportDisplayCard;
