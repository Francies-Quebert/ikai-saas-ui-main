import React, { useState, useEffect } from "react";
import {
  Select,
  Row,
  Col,
  DatePicker,
  Button,
  Form,
  InputNumber,
  Card,
  Input,
  Table,
  Divider,
  Tooltip,
  Empty,
  message,
  TimePicker,
  Switch,
  Avatar,
} from "antd";
import {
  fetchReportMaster,
  getReportDetailsData,
  fetchParamSelectQuery,
  getResponseData,
} from "../../../services/report-master";
import { useSelector, useDispatch } from "react-redux";
import { DatabaseOutlined } from "@ant-design/icons";
import AppLoader from "../../common/AppLoader";
import _ from "lodash";
import moment from "moment";

const { Option } = Select;

const ReportComponent = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [coloumnProperties, setColoumnProperties] = useState([]);
  const [parameterRender, setParameterRender] = useState([]);
  const [data, setData] = useState([]);
  const [reportDetailResponse, setReportDetailResponse] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [selectOption, setSelectOption] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    FetchReportDetails(props.reportId);
  }, [props.reportId]);

  const FetchReportDetails = (pReportId) => {
    setIsLoading(true);
    return fetchReportMaster(pReportId)
      .then((res) => {
        // fetchParamSelectQuery()
        // console.log(res);

        // Coloumn Properties
        let tempColoumn = [];
        let reportMasterColData = res.reportMasterCol;
        for (const key in reportMasterColData) {
          tempColoumn.push({
            key: "key",
            dataIndex: reportMasterColData[key].ColumnName,
            title:
              reportMasterColData[key].ColumnParentName === null
                ? reportMasterColData[key].ColumnTitle
                : reportMasterColData[key].ColumnParentName,
            sorter:
              reportMasterColData[key].ColumnAllowFilter === "Y"
                ? (a, b) => {
                    return (
                      a[reportMasterColData[key].ColumnName].toString().length -
                      b[reportMasterColData[key].ColumnName].toString().length
                    );
                  }
                : null,
            fixed:
              reportMasterColData[key].ColumnFixed === "true"
                ? "right"
                : reportMasterColData[key].ColumnFixed === "left"
                ? "left"
                : reportMasterColData[key].ColumnFixed === "right"
                ? "right"
                : false,
            align: reportMasterColData[key].ColumnAlign,
            width: reportMasterColData[key].ColumnWidth,
            render: (value, record) => {
              if (reportMasterColData[key].ColumnDataType === "image") {
                return <Avatar shape="square" size="small" src={value} />;
              } else if (
                reportMasterColData[key].ColumnDataType === "boolean"
              ) {
                if (typeof (value === "object")) {
                  if (value.data[0]) {
                    return <i class="fa fa-circle font-success f-12"></i>;
                  } else {
                    return <i class="fa fa-circle font-danger f-12"></i>;
                  }
                } else {
                  if (value === "Y") {
                    return <i class="fa fa-circle font-success f-12"></i>;
                  } else {
                    return <i class="fa fa-circle font-danger f-12"></i>;
                  }
                }
              } else {
                return value;
              }
            },
          });
        }

        setColoumnProperties(tempColoumn);

        // Parameter

        let tempParameter = [];
        // let reportMasterParamData = res.reportMasterParam;
        let reportMasterParamData = [];
        let tempInitialValue = {};
        let tempSelectState = [];

        res.reportMasterParam.map((iii, index) => {
          if (iii.ParamDataSource !== null) {
            let spltParam = iii.ParamDataSource.split("|");
            if (iii.ParamDataSource.includes("SP")) {
              fetchParamSelectQuery(spltParam[1]).then((resp) => {
                iii.dataSource = resp;
              });
            }
          }
          reportMasterParamData.push(iii);
        });
        reportMasterParamData.forEach((element) => {});

        for (const key in reportMasterParamData) {
          let selectDataSource = [];
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
              type: type[key1],
              placeHolder: placeHolder[key1],
              Name: Name[key1],
              Position: Position[key1],
              DataSourcePosition: parseInt(DataSourcePosition[key1]),
            });
          }

          tempParamData.forEach((element, index) => {
            if (element.type === "date") {
              tempInitialValue = {
                ...tempInitialValue,
                [`${element.DataSourcePosition}#${element.type}#${element.Position}`]:
                  spltInitialValue[0] !== ""
                    ? moment(spltInitialValue[index])
                    : null,
              };

              tempParameter.push({
                position: parseInt(element.Position),
                html: (
                  <Form.Item
                    label={element.Name}
                    name={`${element.DataSourcePosition}#${element.type}#${element.Position}`}
                    rules={
                      reportMasterParamData[key].ParamIsCompulsary === "Y"
                        ? [{ required: true, message: "Required" }]
                        : []
                    }
                  >
                    <DatePicker
                      placeholder={element.placeHolder}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                ),
              });
            } else if (element.type === "datetime") {
              tempInitialValue = {
                ...tempInitialValue,
                [`${element.DataSourcePosition}#${element.type}#${element.Position}`]:
                  spltInitialValue[0] !== ""
                    ? moment(spltInitialValue[index])
                    : null,
              };
              tempParameter.push({
                position: parseInt(element.Position),
                html: (
                  <Form.Item
                    label={element.Name}
                    name={`${element.DataSourcePosition}#${element.type}#${element.Position}`}
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
                ),
              });
            } else if (element.type === "time") {
              tempInitialValue = {
                ...tempInitialValue,
                [`${element.DataSourcePosition}#${element.type}#${element.Position}`]:
                  spltInitialValue.length > 0
                    ? moment(spltInitialValue[index], "HH:mmm:dd")
                    : "",
              };
              tempParameter.push({
                position: parseInt(element.Position),
                html: (
                  <Form.Item
                    label={element.Name}
                    name={`${element.DataSourcePosition}#${element.type}#${element.Position}`}
                    rules={
                      reportMasterParamData[key].ParamIsCompulsary === "Y"
                        ? [{ required: true, message: "Required" }]
                        : []
                    }
                  >
                    <TimePicker placeholder={element.placeHolder} />
                  </Form.Item>
                ),
              });
            } else if (element.type === "number") {
              tempInitialValue = {
                ...tempInitialValue,
                [`${element.DataSourcePosition}#${element.type}#${element.Position}`]:
                  spltInitialValue.length > 0 ? spltInitialValue[index] : null,
              };
              tempParameter.push({
                position: parseInt(element.Position),
                html: (
                  <Form.Item
                    label={element.Name}
                    name={`${element.DataSourcePosition}#${element.type}#${element.Position}`}
                    rules={
                      reportMasterParamData[key].ParamIsCompulsary === "Y"
                        ? [{ required: true, message: "Required" }]
                        : []
                    }
                  >
                    <InputNumber placeholder={element.placeHolder} />
                  </Form.Item>
                ),
              });
            } else if (element.type === "boolean") {
              tempInitialValue = {
                ...tempInitialValue,
                [`${element.DataSourcePosition}#${element.type}#${element.Position}`]:
                  spltInitialValue.length > 0
                    ? spltInitialValue[index] === "Y"
                      ? true
                      : false
                    : "",
              };
              tempParameter.push({
                position: parseInt(element.Position),
                html: (
                  <Form.Item
                    label={element.Name}
                    name={`${element.DataSourcePosition}#${element.type}#${element.Position}`}
                    rules={
                      reportMasterParamData[key].ParamIsCompulsary === "Y"
                        ? [{ required: true, message: "Required" }]
                        : []
                    }
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                ),
              });
            } else if (element.type === "select") {
              tempInitialValue = {
                ...tempInitialValue,
                [`${element.DataSourcePosition}#${element.type}#${element.Position}`]:
                  spltInitialValue.length > 0 ? spltInitialValue[index] : "",
              };
              // select option data start
              if (reportMasterParamData[key].ParamDataSource !== null) {
                let tempSplitQuery = _.split(
                  reportMasterParamData[key].ParamDataSource,
                  "|"
                );
                if (tempSplitQuery[0] === "SP") {
                  fetchParamSelectQuery(tempSplitQuery[1]).then(async (res) => {
                    res.forEach((element, index) => {
                      selectDataSource.push({
                        0: element.ValueMember,
                        1: element.DisplayMember,
                      });
                    });
                    // console.log(tempSelectState, "sadhsadf");
                    tempSelectState = [
                      ...tempSelectState,
                      {
                        Id: reportMasterParamData[key].Id,
                        data: selectDataSource,
                      },
                    ];
                    setSelectOption(tempSelectState);
                  });
                } else {
                  tempSelectState = [
                    ...tempSelectState,
                    { Id: element.Position, data: [{ 0: 1, 1: "sad" }] },
                  ];
                  setSelectOption([tempSelectState]);
                }
              }
              // select option data end

              tempParameter.push({
                position: parseInt(element.Position),
                html: (
                  <>
                    <Form.Item
                      label={element.Name}
                      name={`${element.DataSourcePosition}#${element.type}#${element.Position}`}
                      rules={
                        reportMasterParamData[key].ParamIsCompulsary === "Y"
                          ? [{ required: true, message: "Required" }]
                          : []
                      }
                      style={{ width: "100%" }}
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
                        // style={{ minWidth: 150 }}
                      >
                        {reportMasterParamData[key].dataSource.length > 0 &&
                          reportMasterParamData[key].dataSource.map((itm) => {
                            return (
                              <Option value={itm.ValueMember}>
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
              tempInitialValue = {
                ...tempInitialValue,
                [`${element.DataSourcePosition}#${element.type}#${element.Position}`]:
                  spltInitialValue.length > 0 ? spltInitialValue[index] : "",
              };
              tempParameter.push({
                position: parseInt(element.Position),
                html: (
                  <Form.Item
                    label={element.Name}
                    name={`${element.DataSourcePosition}#${element.type}#${element.Position}`}
                    rules={
                      reportMasterParamData[key].ParamIsCompulsary === "Y"
                        ? [{ required: true, message: "Required" }]
                        : []
                    }
                  >
                    <Input />
                  </Form.Item>
                ),
              });
            }
          });
          // console.log(tempInitialValue);
          setInitialValue(tempInitialValue);
          setParameterRender(tempParameter);
        }
        setReportDetailResponse(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // console.log(initialValue)
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // fetchReportMaster(props.reportId)
    // console.log("chane", selectOption.length > 0 && selectOption);
    // console.log(selectOption.length);
  }, [selectOption]);

  // useEffect(()=>{console.log(parameterRender)},[parameterRender])

  const onFinish = (val) => {
    let finalData = [];
    let reportMasterHdr = reportDetailResponse.reportMasterHdr;
    let keys = Object.keys(val);
    Object.values(val).forEach((element, index) => {
      let valSplit = _.split(keys[index], "#");

      if (valSplit[1] === "date") {
        finalData.push({
          dataSourcePostion: parseInt(valSplit[0]),
          data: element.format("YYYY-MM-DD"),
        });
      } else if (valSplit[1] === "datetime") {
        finalData.push({
          dataSourcePostion: parseInt(valSplit[0]),
          data: element.format("YYYY-MM-DD HH:mm:ss"),
        });
      } else if (valSplit[1] === "time") {
        finalData.push({
          dataSourcePostion: parseInt(valSplit[0]),
          data: element.format("HH:mm:ss"),
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

    getReportDetailsData(CompCode, reportMasterHdr[0].ReportSource, pParameter)
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
  };
  return (
    <div>
      {isLoading === true ? (
        <AppLoader />
      ) : (
        <>
          {parameterRender.length > 0 && (
            <>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {reportDetailResponse.reportMasterHdr[0].ReportName}
              </div>
              <Divider style={{ margin: "5px 0px" }} />

              <Form
                // {...formItemLayout}
                layout="inline"
                form={form}
                onFinish={onFinish}
                style={{ marginBottom: 5 }}
                initialValues={initialValue}
              >
                {parameterRender
                  .sort((a, b) => (a.position > b.position ? 1 : -1))
                  .map((item, index) => {
                    return (
                      <div key={index} style={{ margin: "0px 8px" }}>
                        {item.html}
                      </div>
                    );
                  })}
                <div style={{ width: "100%", margin: "0px 8px" }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        form.resetFields();
                        setData([]);
                      }}
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "#d9d9d9",
                        marginRight: 7,
                        color: "rgba(0, 0, 0, 0.85)",
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ marginRight: 7 }}
                    >
                      View
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </>
          )}
          {data.length > 0 ? (
            <>
              <Table
                dataSource={data}
                columns={coloumnProperties}
                bordered={true}
                scroll={{ x: 400 }}
                size="small"
                pagination={false}
              />
            </>
          ) : (
            <>
              <Divider style={{ margin: "5px 0px" }} />
              <Empty style={{ border: "1px solid #f0f0f0" }} />
            </>
          )}
          <div style={{ textAlign: "end", margin: "10px 8px" }}>
            <Button
              type="primary"
              style={{
                marginRight: 7,
                backgroundColor: "#48b792",
                borderColor: "#48b792",
              }}
              onClick={() => {
                form.resetFields();
                setData([]);
                setColoumnProperties([]);
                props.onBackPress();
              }}
            >
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportComponent;
