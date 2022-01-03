import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Select,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  InputNumber,
  Spin,
  message,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SearchOutlined,
  SaveOutlined,
  RetweetOutlined,
  DownloadOutlined,
  PrinterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtserviceratemapping } from "../../../../store/actions/serviceratemap";
import ServiceRateMap from "../../../../models/serviceratemap";
import ServiceRateTable, { getIsEditing } from "./ServiceRateTable";
import ReciepeTable from "../../backoffice/ReciepeMaster/ReciepeTable";
// import ServiceRateTable, { getIsEditing } from "./ServiceRateTable";
import { fetchGetnewserviceratemapping } from "../../../../services/servicenewratemaster";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const ServiceRateMapCardNew = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const Locations = useSelector((state) => state.AppMain.locations);
  const Packages = useSelector((state) => state.AppMain.packageMasters);
  const Service = useSelector((state) => state.serviceMaster.serviceMasters);
  const [servicenewRateMapData, setservicenewRateMapData] = useState([]);
  const [serviceId, setserviceId] = useState();
  const [locationId, setlocationId] = useState();
  const [isfetching, setIsFetching] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [PackageTitle, setpackageTitle] = useState();
  const setnewServiceRate = useSelector(
    (state) => state.serviceratemap.NewService
  );

  const [key, setKey] = useState(1);
  // const initialValues = {
  //   ServiceId: props.formData ? props.formData.ServiceId : "",
  //   LocationId: props.formData ? props.formData.LocationId : "",
  //   PackageId: props.formData ? props.formData.PackageId : "",
  //   Rate: props.formData ? props.formData.Rate : "",
  //   discType: props.formData ? props.formData.discType : "",
  //   discValue: props.formData ? props.formData.discValue : "",
  // };

  const onReset = () => {
    setlocationId();
    setserviceId();
    setDataSource([]);
    // fetchGetnewserviceratemapping(serviceId, locationId).then((res) => {
    //   setDataSource(res);
    // });
    form.resetFields();
  };

  const onFinish = (values) => {
    if (getIsEditing()) {
      message.error("Please save your data");
      return false;
    } else {
      let data = dataSource.filter((iii) => iii.isDirty == true);
      if (data.length > 0) {
        setIsLoading(true);
        dispatch(InsUpdtserviceratemapping("I", data));
      } else {
        message.error("No Data to be Saved");
      }
    }
  };

  useEffect(() => {
    fetchGetnewserviceratemapping(serviceId, locationId).then((res) => {
      setservicenewRateMapData(res);

    });
  }, []);

  useEffect(() => {
    if (currentTran.isSuccess) {
      form.resetFields();
      dispatch(reInitialize());
      // props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);

  const add = async (record) => {
    // const row = await form.validateFields();
    setDataSource([
      ...dataSource,
      {
        key: dataSource.length,
        PackageId: null,
        Rate: 0,
        discType: "P",
        LocationId: locationId,
        ServiceId: serviceId,
        isDirty: true,
      },
    ]);
    form.setFieldsValue({
      key: key,
      PackageId: null,
      PackageId: "",
      Rate: "",
      Discount: "P",
    });
    setEditingKey(key);
    setKey(key + 1);
    setTypeAE("A");
    isEdit = true;
  };

  useEffect(() => {
    setKey(dataSource > 0 ? dataSource[dataSource.length - 1].key + 1 : 1);
  }, [dataSource]);

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={1}>
            <CardHeader title={currentTran.formTitle} />
            <Card bordered={true} bodyStyle={{ padding: "5px 24px" }}>
              <Form
                form={form}
                // initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Row gutter={[8, 4]}>
                  <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                    <Row gutter={[8, 0]}>
                      <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <div style={{ fontSize: 16, lineHeight: 2 }}>
                          {" "}
                          Location:
                        </div>
                      </Col>
                      <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                        <Select
                          showSearch
                          placeholder="Select a location"
                          optionFilterProp="children"
                          allowClear={true}
                          onChange={(val) => setlocationId(val)}
                          style={{ maxWidth: "100%", minWidth: "100%" }}
                          // disabled={serviceType ? true : false}
                          value={locationId}
                          disabled={dataSource.length > 0}
                        >
                          {Locations.map((ii) => (
                            <Option key={ii.LocationId} value={ii.LocationId}>
                              {ii.LocationName}
                            </Option>
                          ))}
                        </Select>
                        {/* </Form.Item> */}
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                    <Row gutter={[8, 0]}>
                      <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <div
                          style={{
                            fontSize: 16,
                            lineHeight: 2,
                            paddingLeft: 10,
                          }}
                        >
                          Service:
                        </div>
                      </Col>
                      <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                        <Select
                          style={{ maxWidth: "100%", minWidth: "100%" }}
                          showSearch
                          disabled={dataSource.length > 0}
                          placeholder="Select a service"
                          optionFilterProp="children"
                          allowClear={true}
                          value={serviceId}
                          onChange={(val) => setserviceId(val)}
                          // disabled={serviceType ? true : false}
                        >
                          {Service.map((ii) => (
                            <Option key={ii.ServiceId} value={ii.ServiceId}>
                              {ii.ServiceTitle}({ii.ServiceType})
                            </Option>
                          ))}
                        </Select>
                        {/* </Form.Item> */}
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                    <Row style={{ margin: "0px 7px" }}>
                      <Col>
                        <Button
                          icon={<SearchOutlined />}
                          type="primary"
                          onClick={() => {
                            fetchGetnewserviceratemapping(
                              serviceId,
                              locationId
                            ).then((res) => {
                              setDataSource(res);
                            });
                          }}
                          disabled={
                            dataSource.length > 0 || !locationId || !serviceId
                          }
                        >
                          Show
                        </Button>
                        {/* </Form.Item> */}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      style={{ marginBottom: 8, marginTop: 8 }}
                      onClick={() => add()}
                      disabled={!serviceId || !locationId}
                    >
                      New Row
                    </Button>
                  </Col>
                </Row>
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                <ServiceRateTable data={dataSource} />
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                <Form.Item noStyle={true}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    style={{ marginRight: 5 }}
                    disabled={
                      !locationId || !serviceId
                      // dataSource.filter((iii) => iii.isDirty == true).length<=0
                    }
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
                      dispatch(reInitialize());
                      props.onBackPress();
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    type="primary"
                    icon={<Icon component={PrinterOutlined} />}
                    style={{ marginRight: 5 }}
                    onClick={props.OnPrint}
                  >
                    Print
                  </Button>
                </Form.Item>

                {/* <Form.Item
                  name="TemplateName"
                  style={{ marginBottom: 5 }}
                  label="Template Name"
                >
                  <Select
                    id="test"
                    allowClear={true}
                    showSearch
                    style={{ width: 250, marginRight: 10 }}
                    placeholder="Select Menu"
                    onChange={(val) => {}}
                  ></Select>
                  
                </Form.Item> */}

                {/* <Form.Item
                  name="LocationId"
                  style={{ marginBottom: 5 }}
                  label="Location Names"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Location name!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a location"
                    optionFilterProp="children"
                    allowClear={true}
                    // disabled={serviceType ? true : false}
                  >
                    {Locations.map((ii) => (
                      <Option key={ii.LocationId} value={ii.LocationId}>
                        {ii.LocationName}
                      </Option>
                    ))}
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  name="ServiceId"
                  style={{ marginBottom: 5 }}
                  label="Service Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your service title!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a service"
                    optionFilterProp="children"
                    allowClear={true}
                    // disabled={serviceType ? true : false}
                  >
                    {Service.map((ii) => (
                      <Option key={ii.ServiceId} value={ii.ServiceId}>
                        {ii.ServiceTitle}
                      </Option>
                    ))}
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  name="PackageId"
                  style={{ marginBottom: 5 }}
                  label="Package Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your package title!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a service"
                    optionFilterProp="children"
                    allowClear={true}
                    // disabled={serviceType ? true : false}
                  >
                    {Packages.map((ii) => (
                      <Option key={ii.PackageId} value={ii.PackageId}>
                        {ii.PackageTitle}
                      </Option>
                    ))}
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="Rate"
                  label="Rate"
                  rules={[
                    {
                      required: true,
                      message: "Please input your rate!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="discValue"
                  label="Discount Value"
                  rules={[
                    {
                      required: true,
                      message: "Please input your discount value!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="discType"
                  label="Discount Type"
                  style={{ marginBottom: 5 }}
                  rules={[
                    { required: true, message: "Please select discount type!" },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="P">Percentage</Radio>
                    <Radio value="V">Value</Radio>
                  </Radio.Group>
                </Form.Item> */}
                {/* <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                <Form.Item noStyle={true}>
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
                      dispatch(reInitialize());
                      props.onBackPress();
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    type="primary"
                    icon={<Icon component={PrinterOutlined} />}
                    style={{ marginRight: 5 }}
                    onClick={props.OnPrint}
                  >
                    Print
                  </Button>
                </Form.Item> */}
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default ServiceRateMapCardNew;
