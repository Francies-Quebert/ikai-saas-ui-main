import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Card,
  Input,
  Switch,
  Select,
  InputNumber,
  Form,
  Button,
  Radio,
  Collapse,
} from "antd";
import Icon, {
  SaveOutlined,
  RetweetOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { fetchSysReportPrintHdr } from "../../../services/report-master";
const { Option } = Select;
const { Panel } = Collapse;

const ReportPrintConfig = (props) => {
  const [form] = Form.useForm();
  const [sysReportPrintHdrData, setSysReportPrintHdrData] = useState();
  const [isResetClicked, setIsResetClicked] = useState();
  const [formData, setFormData] = useState({
    template_name: null,
    template_path: null,
    chrome_config_page_format: null,
    chrome_config_printbackground: null,
    chrome_config_landscape: null,
    chrome_config_height: null,
    chrome_config_width: null,
    chrome_config_footer: null,
    chrome_config_header: null,
    chrome_config_margin_bottom: null,
    chrome_config_margin_left: null,
    chrome_config_margin_right: null,
    chrome_config_margin_top: null,
  });

  const loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  useEffect(() => {
    fetchSysReportPrintHdr().then((res) => {
      setSysReportPrintHdrData(res);
    });
  }, []);

  const onReset = () => {
    setIsResetClicked(!isResetClicked);
    // setICodeDisable(false);
    formData.setFieldsValue({
      template_name: null,
    template_path: null,
    chrome_config_page_format: null,
    chrome_config_printbackground: null,
    chrome_config_landscape: null,
    chrome_config_height: null,
    chrome_config_width: null,
    chrome_config_footer: null,
    chrome_config_header: null,
    chrome_config_margin_bottom: null,
    chrome_config_margin_left: null,
    chrome_config_margin_right: null,
    chrome_config_margin_top: null,
    });
  };
  const onFinish = () => {}

  return (
    <>
      <Row>
        <Col span={24}>
          <Card
            bodyStyle={{
              padding: "5px 5px",
            }}
          >
            <Row>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Row style={{ margin: "5px 10px 5px 0px" }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    Template Name:
                  </Col>
                  <Col xl={18} lg={18} md={18} sm={18} xs={18}>
                    <div style={{ display: "flex" }}></div>
                    <Select
                      allowClear={true}
                      showSearch
                      style={{ width: 300, marginRight: 10 }}
                      placeholder={"Select Template Name"}
                      value={formData.template_name}
                      onChange={(value) => {
                        let tempData = sysReportPrintHdrData.find(
                          (dd) => dd.template_name === value
                        );
                        if (tempData) {
                          setFormData({
                            ...formData,
                            ...tempData,
                          });
                        }
                      }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .indexOf(input.toString().toLowerCase()) >= 0
                      }
                      disabled={formData.template_name!== null}
                    >
                      {sysReportPrintHdrData &&
                        sysReportPrintHdrData.length > 0 &&
                        sysReportPrintHdrData.map((item) => {
                          return (
                            <Option
                              key={item.template_name}
                              value={item.template_name}
                            >{`${item.template_name}`}</Option>
                          );
                        })}
                    </Select>
                  </Col>
                </Row>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Row style={{ margin: "5px 10px 5px 0px" }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    Template Path:
                  </Col>
                  <Col xl={10} lg={10} md={10} sm={10} xs={24}>
                    <div style={{ display: "flex" }}></div>
                    <Input
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          template_path: e.target.value,
                        })
                      }
                      value={formData.template_path}
                      disabled
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                <Row style={{ margin: "5px 10px 5px 0px" }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={24}
                  >
                    Page Format:
                  </Col>
                  <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <div style={{ display: "flex" }}></div>
                    <Select
                      style={{ width: "100%" }}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          chrome_config_page_format: val,
                        })
                      }
                      value={formData.chrome_config_page_format}
                    >
                      <Option value="Letter">Letter (8.5 x 1)</Option>
                      <Option value="Legal">Legal (8.5 x 14)</Option>
                      <Option value="Tabloid">Tabloid (11 x 17)</Option>
                      <Option value="Ledger">Ledger (17 x 11)</Option>
                      <Option value="A0">A0 (33.1 x 46.8)</Option>
                      <Option value="A1">A1 (23.4 x 33.1)</Option>
                      <Option value="A2">A2 (16.54 x 23.4)</Option>
                      <Option value="A3">A3 (11.7 x 16.54)</Option>
                      <Option value="A4">A4 (8.27 x 11.7)</Option>
                      <Option value="A5">A5 (5.83 x 8.27)</Option>
                      <Option value="A6">A6 (4.13 x 5.83)</Option>
                    </Select>
                  </Col>
                </Row>
              </Col>
              <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                <Row style={{ margin: "5px 0px 5px 0px" }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={10}
                    lg={10}
                    md={10}
                    sm={10}
                    xs={24}
                  >
                    Print Background :
                  </Col>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={4}
                    lg={4}
                    md={4}
                    sm={4}
                    xs={4}
                  >
                    <Switch 
                    checked={formData.chrome_config_printbackground === "Y" ? true : false }
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        chrome_config_printbackground: e,
                      })
                    }} />
                  </Col>
                </Row>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Row style={{ margin: "5px 0px 5px 0px" }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    Page Layout :
                  </Col>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={10}
                    lg={10}
                    md={10}
                    sm={10}
                    xs={10}
                  >
                    <Radio.Group 
                    defaultValue="Y" 
                    buttonStyle="solid" 
                    value={formData.chrome_config_landscape} 
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chrome_config_landscape: e.target.value,
                      })}
                    >
                      <Radio.Button value="Y">Landscape</Radio.Button>
                      <Radio.Button value="N">Portrait</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Card
              bodyStyle={{
                padding: "5px 5px",
              }}
            >
              <Collapse>
                <Panel header="Custom Page Format" key="1">
                  <Row>
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      md={4}
                      md={4}
                      style={{ paddingRight: 5, paddingBottom: 5 }}
                    >
                      <div style={{ alignSelf: "center" }}>Height:</div>
                      <div style={{ flex: 1 }}>
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chrome_config_height: e,
                            })
                          }
                          value={formData.chrome_config_height}
                        />
                      </div>
                    </Col>
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      md={4}
                      md={4}
                      style={{ paddingRight: 5, paddingBottom: 5 }}
                    >
                      <div style={{ alignSelf: "center" }}>Width:</div>
                      <div style={{ flex: 1 }}>
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chrome_config_width: e,
                            })
                          }
                          value={formData.chrome_config_width}
                        />
                      </div>
                    </Col>{" "}
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      md={4}
                      md={4}
                      style={{ paddingRight: 5, paddingBottom: 5 }}
                    >
                      <div style={{ alignSelf: "center" }}>Margin Top:</div>
                      <div style={{ flex: 1 }}>
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chrome_config_margin_top: e,
                            })
                          }
                          value={formData.chrome_config_margin_top}
                        />
                      </div>
                    </Col>{" "}
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      md={4}
                      md={4}
                      style={{ paddingRight: 5, paddingBottom: 5 }}
                    >
                      <div style={{ alignSelf: "center" }}>Margin Bottom:</div>
                      <div style={{ flex: 1 }}>
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chrome_config_margin_bottom: e,
                            })
                          }
                          value={formData.chrome_config_margin_bottom}
                        />
                      </div>
                    </Col>{" "}
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      md={4}
                      md={4}
                      style={{ paddingRight: 5, paddingBottom: 5 }}
                    >
                      <div style={{ alignSelf: "center" }}>Margin Left:</div>
                      <div style={{ flex: 1 }}>
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chrome_config_margin_left: e,
                            })
                          }
                          value={formData.chrome_config_margin_left}
                        />
                      </div>
                    </Col>{" "}
                    <Col
                      xl={4}
                      lg={4}
                      md={4}
                      md={4}
                      md={4}
                      style={{ paddingRight: 5, paddingBottom: 5 }}
                    >
                      <div style={{ alignSelf: "center" }}>Margin Right:</div>
                      <div style={{ flex: 1 }}>
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chrome_config_margin_right: e,
                            })
                          }
                          value={formData.chrome_config_margin_right}
                        />
                      </div>
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            </Card>
            <Row>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Row style={{ margin: "5px 10px 5px 0px" }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    Template Header:
                  </Col>
                  <Col xl={18} lg={18} md={18} sm={18} xs={18}>
                    <div style={{ display: "flex" }}></div>
                    <Input
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chrome_config_header: e.target.value,
                            })
                          }
                      value={formData.chrome_config_header}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Row style={{ margin: "5px 10px 5px 0px" }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    Template Footer:
                  </Col>
                  <Col xl={18} lg={18} md={18} sm={18} xs={18}>
                    <div style={{ display: "flex" }}></div>
                    <Input
                         onChange={(e) =>
                          setFormData({
                            ...formData,
                            chrome_config_footer: e.target.value,
                          })
                        }
                      value={formData.chrome_config_footer}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ marginRight: 5 }}
          >
            Save
          </Button>

          <Button
            type="primary"
            icon={<RetweetOutlined />}
            style={{ marginRight: 5 }}
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            type="primary"
            icon={<Icon component={RollbackOutlined} />}
            style={{ marginRight: 5 }}
            onClick={() => {
              props.onBackPress();
            }}
          >
            Back
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ReportPrintConfig;
