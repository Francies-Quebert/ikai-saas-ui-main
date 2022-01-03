import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import { hasRight } from "../../../shared/utility";
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
import CardHeader from "../../common/CardHeader";
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
import { reInitialize } from "../../../store/actions/currentTran";
import { InsUpdtserviceratemapping } from "../../../store/actions/serviceratemap";
import ServiceRateTable, {
  getIsEditing,
} from "./ServiceRateMapMaster/ServiceRateTable";
import { fetchGetnewserviceratemapping } from "../../../services/servicenewratemaster";
import { fetchServiceMaster } from "../../../store/actions/servicemaster";
import { fetchPackageMaster } from "../../../store/actions/PackageMaster";
let temp = null;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const ServiceRateMap = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const Locations = useSelector((state) => state.AppMain.locations);
  const CompCode = useSelector((state) => state.AppMain.CompCode);
  const Service = useSelector((state) => state.serviceMaster.serviceMasters);
  const [servicenewRateMapData, setservicenewRateMapData] = useState([]);
  const [serviceId, setserviceId] = useState();
  const [locationId, setlocationId] = useState();
  const [isfetching, setIsFetching] = useState(true);
  const [dataSource, setDataSource] = useState();
  const [PackageTitle, setpackageTitle] = useState("");
  const setnewServiceRate = useSelector(
    (state) => state.serviceratemap.NewService
  );

  useEffect(() => {
    if (currentTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      onReset();
    }
  }, [currentTran.lastSavedData]);

  const [key, setKey] = useState(1);

  const onReset = () => {
    setlocationId();
    setserviceId();
    setDataSource();
    form.resetFields();
  };

  const onFinish = (values) => {
    if (getIsEditing()) {
      message.error("Please save your data");
      return false;
    } else {
      let data = dataSource.filter((iii) => iii.isDirty == true);
      if (
        dataSource.length <= 0 ||
        (dataSource[dataSource.length - 1].Rate !== "" &&
          dataSource[dataSource.length - 1].PackageId !== null) ||
        dataSource[dataSource.length - 1].isDeleted === true
      ) {
        setIsLoading(true);
        dispatch(InsUpdtserviceratemapping("I", data));
      } else {
        message.error("Rate and Package Title is required");
      }
    }
  };

  useEffect(() => {
    fetchGetnewserviceratemapping(CompCode,serviceId, locationId).then((res) => {
      setservicenewRateMapData(res);
    });
    dispatch(fetchServiceMaster());
    dispatch(fetchPackageMaster());
    dispatch(setFormCaption(26));
  }, []);

  useEffect(() => {
    if (currentTran.isSuccess) {
      form.resetFields();
      dispatch(reInitialize());
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);

  const add = async (record) => {
    if (
      dataSource.length <= 0 ||
      (dataSource[dataSource.length - 1].Rate !== "" &&
        dataSource[dataSource.length - 1].PackageId !== null) ||
      dataSource[dataSource.length - 1].isDeleted === true
    ) {
      setDataSource([
        ...dataSource,
        {
          key: key,
          PackageId: 0,
          PackageTitle: "",
          Rate: "",
          discType: "P",
          LocationId: locationId,
          ServiceId: serviceId,
          isDirty: true,
          isDeleted: false,
          FromDatabase: false,
        },
      ]);
      setKey(key + 1);
    } else {
      message.error("Rate and Package Title Cannot be empty");
    }
  };

  useEffect(() => {
    setKey(
      dataSource && dataSource.length > 0
        ? parseInt(dataSource[dataSource.length - 1].key) + 1
        : 1
    );
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
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Row style={{ display: "flex" }}>
                  <Col
                    style={{ margin: "0px 5px 5px 0px" }}
                    // xxl={8}
                    // xl={8}
                    // lg={12}
                    // md={12}
                    // sm={24}
                    // xs={24}
                  >
                    <span style={{ fontSize: 16, marginRight: 5 }}>
                      Location:
                    </span>

                    <Select
                      showSearch
                      placeholder="Select a location"
                      optionFilterProp="children"
                      allowClear={true}
                      onChange={(val) => setlocationId(val)}
                      style={{
                        // flex: 1,
                        // maxWidth: 250,
                        // minWidth: "40%",
                        width: 250,
                      }}
                      value={locationId}
                      disabled={dataSource ? true : false}
                    >
                      {Locations.map((ii) => (
                        <Option key={ii.LocationId} value={ii.LocationId}>
                          {ii.LocationName}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col
                    style={{ margin: "0px 5px 5px 0px" }}
                    // style={{ flex: 1 }}
                    // xxl={8}
                    // xl={8}
                    // lg={12}
                    // md={12}
                    // sm={24}
                    // xs={24}
                  >
                    {" "}
                    <span style={{ fontSize: 16, marginRight: 5 }}>
                      Service:
                    </span>
                    {/* </div> */}
                    <Select
                      style={{
                        width: 250,
                        // maxWidth: "100%",
                        // minWidth: "60%",
                      }}
                      showSearch
                      disabled={dataSource ? true : false}
                      placeholder="Select a service"
                      optionFilterProp="children"
                      allowClear={true}
                      value={serviceId}
                      onChange={(val) => setserviceId(val)}
                      // disabled={serviceType ? true : false}
                    >
                      {Service.map((ii) => (
                        <Option key={ii.ServiceId} value={ii.ServiceId}>
                          {ii.ServiceTitle} ({ii.ServiceDesc})
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col
                    style={{ margin: "0px 5px 5px 0px" }}
                    // style={{ flex: 1 }}
                    // xxl={8}
                    // xl={8}
                    // lg={8}
                    // md={12}
                    // sm={24}
                    // xs={24}
                  >
                    <Button
                      // style={{ marginLeft: 5 }}
                      icon={<SearchOutlined />}
                      type="primary"
                      onClick={() => {
                        fetchGetnewserviceratemapping(
                          CompCode,
                          serviceId,
                          locationId
                        ).then((res) => {
                          setDataSource(res);
                          // temp= { ...[res] }
                        });
                      }}
                      disabled={dataSource ? true : false}
                    >
                      Show
                    </Button>
                  </Col>
                </Row>
                <Divider style={{ marginBottom: 5, }} />
                <Row>
                  <Col>
                    <Button
                      type="primary"
                      icon={<PlusCircleOutlined />}
                      style={{ marginBottom: 5, marginTop: 2 }}
                      onClick={() => add()}
                      disabled={dataSource ? false : true}
                    >
                      New Row
                    </Button>
                  </Col>
                </Row>
                <ServiceRateTable data={dataSource} />
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                <Form.Item noStyle={true}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    style={{ marginRight: 5, marginBottom: 5 }}
                    disabled={!locationId || !serviceId}
                  >
                    Save
                  </Button>
                  <Button
                    type="primary"
                    icon={<RetweetOutlined />}
                    style={{ marginRight: 5, marginBottom: 5 }}
                    onClick={onReset}
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    icon={<Icon component={PrinterOutlined} />}
                    style={{ marginRight: 5, marginBottom: 5 }}
                  >
                    Print
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default ServiceRateMap;
