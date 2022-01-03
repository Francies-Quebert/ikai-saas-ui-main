import React, { useEffect, useState } from "react";
import {
  fetchReportMaster,
  fetchSysReportPrintHdr,
  updtSystemReportConfigs,
} from "../../../services/report-master";
import _ from "lodash";
import {
  Button,
  Form,
  Select,
  InputNumber,
  Input,
  Switch,
  Row,
  Col,
  Card,
  Tabs,
  Table,
  Checkbox,
} from "antd";
import Icon, {
  SaveOutlined,
  RetweetOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
const { Option } = Select;
const { TabPane } = Tabs;

const ReportConfigComponent = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [report_Data_Col, setReport_Data_Col] = useState();
  const [report_Data_Hdr, setReport_Data_Hdr] = useState();
  const [report_Chart_Hdr, setReport_Chart_Hdr] = useState([]);
  const [report_Chart_Dtl, setReport_Chart_Dtl] = useState();
  const [reportTableInitialValue, setReportTableInitialValue] = useState({
    initialColData: [],
    initialDataHdr: [],
    initialChartHdr: [],
  });
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const handleColumnWidthChange = (record, val) => {
    let tempData = report_Data_Col;
    let indexData = tempData.findIndex((aa) => aa.Id === record.Id);
    tempData[indexData].ColumnWidth = val;
    tempData[indexData].IsDirty = true;
    setReport_Data_Col([...tempData]);
  };

  const handleColumnAlignChange = (record, val) => {
    let tempData = report_Data_Col;
    let indexData = tempData.findIndex((aa) => aa.Id === record.Id);
    tempData[indexData].ColumnAlign = val;
    tempData[indexData].IsDirty = true;
    setReport_Data_Col([...tempData]);
  };

  const handleColumnPositionChange = (record, val) => {
    let tempData = report_Data_Col;
    let indexData = tempData.findIndex((aa) => aa.Id === record.Id);
    tempData[indexData].ColumnPosition = val;
    tempData[indexData].IsDirty = true;
    setReport_Data_Col([...tempData]);
  };

  const handleColumnParentNameChange = (record, checked) => {
    let tempData = report_Data_Col;
    let indexData = tempData.findIndex((aa) => aa.Id === record.Id);
    tempData[indexData].ColumnParentName = checked;
    tempData[indexData].IsDirty = true;
    setReport_Data_Col([...tempData]);
  };

  const handleColumnSummaryTypeChange = (record, val) => {
    let tempData = report_Data_Col;
    let indexData = tempData.findIndex((aa) => aa.Id === record.Id);
    tempData[indexData].ColumnSummaryType = val;
    tempData[indexData].IsDirty = true;
    setReport_Data_Col([...tempData]);
  };

  const handelPrintBackgroundChange = (res, val) => {
    let tempData = data;
    let indexData = tempData.findIndex((aa) => aa.ReportId === res.ReportId);
    tempData[indexData].chrome_config_printbackground = val;
    tempData[indexData].IsDirty = true;
    setData([...tempData]);
  };

  const handelPrintFormatChange = (res, val) => {
    let tempData = data;
    let indexData = tempData.findIndex((aa) => aa.ReportId === res.ReportId);
    tempData[indexData].chrome_config_page_format = val;
    tempData[indexData].IsDirty = true;
    setData([...tempData]);
  };

  const handelChartTypeChange = (record, val) => {
    let tempData = report_Chart_Hdr;
    let indexData = tempData.findIndex((aa) => aa.ChartId === record.ChartId);
    tempData[indexData].ChartType = val;
    tempData[indexData].IsDirty = true;
    setReport_Chart_Hdr([...tempData]);
  };

  const handelChartHeightChange = (record, val) => {
    let tempData = report_Chart_Hdr;
    let indexData = tempData.findIndex((aa) => aa.ChartId === record.ChartId);
    tempData[indexData].ChartHeight = val;
    tempData[indexData].IsDirty = true;
    setReport_Chart_Hdr([...tempData]);
  };

  useEffect(() => {
    let ReportId = props.reportId;
    // console.log(props.reportId, "props.reportId");
    if (props.reportId) {
      fetchReportMaster(CompCode, ReportId).then((res) => {
        setReport_Data_Col(
          res.reportMasterCol.map((aa) => {
            return { ...aa, IsDirty: false };
          })
        );
        setReport_Data_Hdr(res.reportMasterHdr);
        form.setFieldsValue({
          rptName: res.reportMasterHdr[0].ReportName,
          rptDesc: res.reportMasterHdr[0].ReportDesc,
          rptSource: res.reportMasterHdr[0].ReportSource,
        });
        setReport_Chart_Hdr(res.reportChartHdr);
        setReportTableInitialValue({
          initialColData: res.reportMasterCol.map((aa) => {
            return { ...aa, IsDirty: false };
          }),
          initialDataHdr: res.reportMasterHdr,
          initialChartHdr: res.reportChartHdr,
        });
      });
      fetchSysReportPrintHdr(CompCode, ReportId).then((res) => {
        setData(res);
      });
    }
  }, [props.reportId]);

  const onFinish = () => {
    let tempReportHdr = {
      ...report_Data_Hdr[0],
      IsActive: report_Data_Hdr[0].IsActive.data[0],
      UpdtUsr: loginUser,
    };
    let tempReportColCofig = report_Data_Col.map((ii) => {
      return {
        ...ii,
        ColumnShowSummary: ii.ColumnSummaryType !== null ? "Y" : "N",
        UpdtUsr: loginUser,
      };
    });
    const pData = {
      ReportHdr: tempReportHdr,
      ReportColConfig: tempReportColCofig,
    };
    updtSystemReportConfigs(CompCode, pData).then((res) => {
      props.onFinish();
    });
  };

  const columns1 = [
    {
      title: "Column Name",
      dataIndex: "ColumnName",
      key: "id",
    },
    {
      title: "Column Title",
      dataIndex: "ColumnTitle",
    },
    {
      title: "Data Type",
      dataIndex: "ColumnDataType",
      width: 100,
    },
    {
      title: "Fixed",
      dataIndex: "ColumnFixed",
      width: 80,
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={text === "true"}
            onChange={(e) => {
              let tempData = report_Data_Col;
              let indexData = tempData.findIndex((aa) => aa.Id === record.Id);
              tempData[indexData].ColumnFixed = e === true ? "true" : "false";
              tempData[indexData].IsDirty = true;
              setReport_Data_Col([...tempData]);
            }}
          />
        );
      },
    },
    {
      title: "Allow Filter",
      dataIndex: "ColumnAllowFilter",
      width: 90,
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={text === "Y"}
            onChange={(e) => {
              let tempData = report_Data_Col;
              let indexData = tempData.findIndex((aa) => aa.Id === record.Id);
              tempData[indexData].ColumnAllowFilter = e === true ? "Y" : "N";
              tempData[indexData].IsDirty = true;
              setReport_Data_Col([...tempData]);
            }}
          />
        );
      },
    },
    {
      title: "Width",
      dataIndex: "ColumnWidth",
      width: 80,
      render: (text, record) => {
        return (
          <InputNumber
            style={{ width: "100%" }}
            value={text}
            min={0}
            onChange={(val) => handleColumnWidthChange(record, val)}
          />
        );
      },
    },
    {
      title: "Position",
      dataIndex: "ColumnPosition",
      width: 30,
      render: (text, record) => {
        return (
          <InputNumber
            style={{ width: "100%" }}
            value={text}
            min={0}
            onChange={(val) => handleColumnPositionChange(record, val)}
          />
        );
      },
    },
    {
      title: "Column Align",
      dataIndex: "ColumnAlign",
      render: (text, record) => {
        return (
          <Select
            style={{ width: "100%" }}
            value={text}
            onChange={(val) => handleColumnAlignChange(record, val)}
          >
            <Option value="left">left</Option>
            <Option value="right">right</Option>
            <Option value="center">center</Option>
          </Select>
        );
      },
    },
    {
      title: "Column Parent Name",
      dataIndex: "ColumnParentName",
      render: (text, record) => {
        return (
          <Input
            style={{ width: "100%" }}
            value={text}
            onChange={(val) => handleColumnParentNameChange(record, val)}
          />
        );
      },
    },
    {
      title: "Column Show Summary",
      dataIndex: "ColumnShowSummary",
      width: 200,
      render: (text, record) => {
        return (
          <div style={{ display: "flex" }}>
            {/* <Select
              style={{ width: 70 }}
              value={record.ColumnShowSummary}
              onChange={(val) => handleColumnShowSummaryChange(record, val)}
            >
              <Option value="Y">Yes</Option>
              <Option value="N">No</Option>
            </Select> */}
            <Select
              style={{ width: "calc(100% - 70px)" }}
              value={record.ColumnSummaryType}
              onChange={(val) => handleColumnSummaryTypeChange(record, val)}
            >
              <Option value={null}> </Option>
              <Option value="sum">Sum</Option>
              <Option value="count">Count</Option>
              <Option value="avg">Average</Option>
              <Option value="min">Minimum</Option>
              <Option value="max">Maximum</Option>
            </Select>
          </div>
        );
      },
    },
    // {
    //   title: "Column Summary Type",
    //   dataIndex: "ColumnSummaryType",
    //   render: (text, record) => {
    //     return (
    //       <Select
    //         style={{ width: "100%" }}
    //         value={text}
    //         onChange={(val) => handleColumnSummaryTypeChange(record, val)}
    //       >
    //         <Option value="null"> </Option>
    //         <Option value="sum">Sum</Option>
    //         <Option value="count">Count</Option>
    //         <Option value="avg">Average</Option>
    //         <Option value="min">Minimum</Option>
    //         <Option value="max">Maximum</Option>
    //       </Select>
    //     );
    //   },
    // },
  ];
  const columns2 = [
    {
      title: "TemplateName",
      dataIndex: "template_name",
      key: "id",
    },
    {
      title: "TemplatePath",
      dataIndex: "template_path",
    },
    {
      title: "PrintBackground",
      dataIndex: "chrome_config_printbackground",
      render: (text, res) => {
        return (
          <Select
            style={{ width: "100%" }}
            value={text}
            onChange={(val) => handelPrintBackgroundChange(res, val)}
          >
            <Option value="Y">Yes</Option>
            <Option value="N">No</Option>
          </Select>
        );
      },
    },
    {
      title: "PageFormat",
      dataIndex: "chrome_config_page_format",
      render: (text, res) => {
        return (
          <Select
            style={{ width: "100%" }}
            value={text}
            onChange={(val) => handelPrintFormatChange(res, val)}
          >
            <Option value="A4">A4</Option>
            <Option value="A3">A3</Option>
          </Select>
        );
      },
    },
  ];

  const columns3 = [
    {
      title: "Chart Id",
      dataIndex: "ChartId",
      key: "id",
    },
    {
      title: "Chart Source",
      dataIndex: "ChartSource",
    },
    {
      title: "Chart Title",
      dataIndex: "ChartTitle",
    },
    {
      title: "Chart Type",
      dataIndex: "ChartType",
      render: (text, record) => {
        return (
          <Select
            style={{ width: "100%" }}
            value={text}
            onChange={(val) => handelChartTypeChange(record, val)}
          >
            <Option value="BarChart">BarChart</Option>
            <Option value="AreaChart">AreaChart</Option>
            <Option value="BubbleChart">BubbleChart</Option>
            <Option value="CandlestickChart">CandlestickChart</Option>
            <Option value="ComboChart">ComboChart</Option>
            <Option value="Histogram">Histogram</Option>
            <Option value="LineChart">LineChart</Option>
            <Option value="PieChart">PieChart</Option>
            <Option value="ScatterChart">ScatterChart</Option>
            <Option value="SteppedAreaChart">SteppedAreaChart</Option>
          </Select>
        );
      },
    },
    {
      title: "Chart Height",
      dataIndex: "ChartHeight",
      render: (text, record) => {
        return (
          <InputNumber
            style={{ width: "100%" }}
            value={text}
            min={0}
            onChange={(val) => handelChartHeightChange(record, val)}
          />
        );
      },
    },
  ];
  return (
    <div>
      <Card>
        <Row>
          {report_Data_Hdr && report_Data_Hdr.length > 0 && (
            <Col span={24}>
              <Card
                bodyStyle={{
                  padding: "0px 0px 5px 0px",
                }}
              >
                <Form form={form} labelAlign="left" size="middle">
                  <Row>
                    <Col
                      xl={12}
                      lg={12}
                      md={24}
                      sm={24}
                      xs={24}
                      style={{ borderRight: "1px solid #f0f0fo" }}
                    >
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Report Name :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="rptName"
                                style={{ marginBottom: 0, flex: 1 }}
                                wrapperCol={24}
                                defaultValue={report_Data_Hdr[0].rptName}
                                onChange={(e) => {
                                  setReport_Data_Hdr([
                                    {
                                      ...report_Data_Hdr[0],
                                      ReportName: e.target.value,
                                    },
                                  ]);
                                }}
                              >
                                <Input />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xl={12}
                      lg={12}
                      md={24}
                      sm={24}
                      xs={24}
                      style={{ borderRight: "1px solid #f0f0fo" }}
                    >
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Report Description :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="rptDesc"
                                style={{ marginBottom: 0, flex: 1 }}
                                wrapperCol={24}
                                defaultValue={report_Data_Hdr[0].rptDesc}
                                onChange={(e) => {
                                  setReport_Data_Hdr([
                                    {
                                      ...report_Data_Hdr[0],
                                      ReportDesc: e.target.value,
                                    },
                                  ]);
                                }}
                              >
                                <Input />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xl={12}
                      lg={12}
                      md={24}
                      sm={24}
                      xs={24}
                      style={{ borderRight: "1px solid #f0f0fo" }}
                    >
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Row style={{ margin: "0px 0px 5px 0px" }}>
                          <Col
                            style={{ alignSelf: "center" }}
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={24}
                          >
                            Report Source :
                          </Col>
                          <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                            <div style={{ display: "flex" }}>
                              <Form.Item
                                name="rptSource"
                                style={{ marginBottom: 0, flex: 1 }}
                                wrapperCol={24}
                                disabled
                                defaultValue={report_Data_Hdr[0].rptSource}
                                onChange={(e) => {
                                  setReport_Data_Hdr([
                                    {
                                      ...report_Data_Hdr[0],
                                      ReportSource: e.target.value,
                                    },
                                  ]);
                                }}
                              >
                                <Input disabled />
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Row>
                          <Col span={24}>
                            <span>
                              <Checkbox
                                name="hasView"
                                checked={report_Data_Hdr[0].hasView === "Y"}
                                onChange={(e) => {
                                  setReport_Data_Hdr([
                                    {
                                      ...report_Data_Hdr[0],
                                      hasView:
                                        e.target.checked === true ? "Y" : "N",
                                    },
                                  ]);
                                }}
                              ></Checkbox>
                              {"  "}Enable View
                            </span>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col>
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Row>
                          <Col span={24}>
                            <span>
                              <Checkbox
                                checked={
                                  report_Data_Hdr[0].hasPrintable === "Y"
                                }
                                onChange={(e) => {
                                  setReport_Data_Hdr([
                                    {
                                      ...report_Data_Hdr[0],
                                      hasPrintable:
                                        e.target.checked === true ? "Y" : "N",
                                    },
                                  ]);
                                }}
                              ></Checkbox>
                              {"  "}Enable Printable
                            </span>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col>
                      <Card
                        bordered={false}
                        bodyStyle={{ padding: "7px 12px" }}
                      >
                        <Row>
                          <Col span={24}>
                            <Checkbox
                              checked={report_Data_Hdr[0].hasGraph === "Y"}
                              onChange={(e) => {
                                setReport_Data_Hdr([
                                  {
                                    ...report_Data_Hdr[0],
                                    hasGraph:
                                      e.target.checked === true ? "Y" : "N",
                                  },
                                ]);
                              }}
                            >
                              Enable Graph
                            </Checkbox>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          )}
        </Row>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Column Configuration" key="2">
            <Table
              columns={columns1}
              dataSource={report_Data_Col}
              key={1}
              pagination={false}
              rowKey={"Id"}
            />
          </TabPane>
          <TabPane tab="Print Configuration" key="3">
            <Table
              key={2}
              columns={columns2}
              dataSource={data}
              pagination={false}
            />
          </TabPane>
          <TabPane tab="Chart Configuration" key="4">
            <Table
              columns={columns3}
              dataSource={report_Chart_Hdr}
              key={3}
              pagination={false}
            />
          </TabPane>
        </Tabs>
        <Form.Item noStyle={true}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ marginRight: 5 }}
            onClick={() => {
              onFinish();
              // success();
            }}
          >
            Save
          </Button>

          {/* {props.entryMode == "A" && ( */}
          <Button
            type="primary"
            icon={<RetweetOutlined />}
            style={{ marginRight: 5 }}
            onClick={() => {
              form.setFieldsValue({
                rptName: reportTableInitialValue.initialDataHdr[0].ReportName,
                rptDesc: reportTableInitialValue.initialDataHdr[0].ReportDesc,
                rptSource:
                  reportTableInitialValue.initialDataHdr[0].ReportSource,
              });
              setReport_Data_Col([...reportTableInitialValue.initialColData]);
              setReport_Data_Hdr([...reportTableInitialValue.initialDataHdr]);
              setReport_Chart_Hdr([...reportTableInitialValue.initialChartHdr]);
            }}
          >
            Reset
          </Button>
          {/* )} */}
          <Button
            type="primary"
            icon={<Icon component={RollbackOutlined} />}
            style={{ marginRight: 5 }}
            onClick={props.onBackPress}
          >
            Back
          </Button>
        </Form.Item>
      </Card>
    </div>
  );
};

export default ReportConfigComponent;
