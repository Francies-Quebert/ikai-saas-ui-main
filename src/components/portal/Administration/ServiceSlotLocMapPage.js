import React, { Fragment, useEffect, useState } from "react";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import SerSlotLocTable from "./ServiceSlotLocMapMaster/SerSlotLocTable";
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
  Table,
  Checkbox,
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
import { fetchGetnewserslotlocmapp } from "../../../services/SerSlotLocMapp";
import { fetchServiceMaster } from "../../../store/actions/servicemaster";
import { InsUpdtserviceSlotLocMapMaster } from "../../../store/actions/ServiceSlotLocMap";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const ServiceSlotLocMapPage = () => {
  const [form] = Form.useForm();
  const [serviceId, setserviceId] = useState();
  const [locationId, setlocationId] = useState();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const Locations = useSelector((state) => state.AppMain.locations);
  const Service = useSelector((state) => state.serviceMaster.serviceMasters);
  const [dataSource, setDataSource] = useState();
  const [key, setKey] = useState(1);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(fetchServiceMaster());
    dispatch(setFormCaption(19));
  }, []);

  useEffect(() => {
    if (currentTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      onReset();
    }
  }, [currentTran.lastSavedData]);

  const onReset = () => {
    setlocationId();
    setserviceId();
    setDataSource();
    form.resetFields();
  };
  useEffect(() => {
    setKey(
      dataSource && dataSource.length > 0
        ? parseInt(dataSource[dataSource.length - 1].key) + 1
        : 1
    );
  }, [dataSource]);
  const columns = [
    {
      key: "IsMapped",
      title: "",
      dataIndex: "IsMapped",
      width: 50,
      render: (text, record) => {
        return (
          <Checkbox
            defaultChecked={record.IsMapped === "Y"}
            onChange={(e) => {
              record.IsMapped = e.target.checked;
              record.IsDirty = true;
            }}
          />
        );
      },
    },
    {
      title: "Slot Name",
      dataIndex: "SlotName",
      width: 200,
    },
    {
      title: "Slot Start Time",
      dataIndex: "starttime",
      width: 200,
    },
  ];

  return (
    <div>
      <Row>
        <Col flex={1}>
          <CardHeader title={currentTran.formTitle} />
          <Card bordered={true} bodyStyle={{ padding: "5px 24px" }}>
            <Form form={form} name="userbody" {...formItemLayout}>
              <Row>
                <Col>
                  <div style={{ flexDirection: "row", display: "flex" }}>
                    <div style={{ fontSize: 16, lineHeight: 2 }}>Location:</div>
                    <Select
                      showSearch
                      placeholder="Select a location"
                      optionFilterProp="children"
                      allowClear={true}
                      onChange={(val) => {
                        setlocationId(val);
                      }}
                      style={{
                        maxWidth: "100%",
                        minWidth: "40%",
                        marginLeft: 8,
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
                    <div
                      style={{
                        fontSize: 16,
                        lineHeight: 2,
                        paddingLeft: 10,
                      }}
                    >
                      Service:
                    </div>
                    <Select
                      style={{
                        //  width: "calc(100% - 240px)",
                        maxWidth: "100%",
                        minWidth: "60%",
                        marginLeft: 8,
                      }}
                      showSearch
                      disabled={dataSource ? true : false}
                      placeholder="Select a service"
                      optionFilterProp="children"
                      allowClear={true}
                      value={serviceId}
                      onChange={(val) => setserviceId(val)}
                    >
                      {Service.map((ii) => (
                        <Option key={ii.ServiceId} value={ii.ServiceId}>
                          {ii.ServiceTitle} ({ii.ServiceDesc})
                        </Option>
                      ))}
                    </Select>
                    <Button
                      style={{ marginLeft: 6 }}
                      icon={<SearchOutlined />}
                      type="primary"
                      onClick={() => {
                        setIsLoading(true);
                        fetchGetnewserslotlocmapp(
                          CompCode,
                          locationId,
                          serviceId
                        ).then((res) => {
                          setDataSource(res);
                          setIsLoading(true);
                        });
                      }}
                      disabled={dataSource ? true : false}
                    >
                      Show
                    </Button>
                  </div>
                  <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered={true}
                    pagination={false}
                    rowClassName="editable-row"
                  />
                  <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                  <Form.Item noStyle={true}>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      style={{ marginRight: 5 }}
                      disabled={!locationId || !serviceId}
                      onClick={() => {
                        let dataArray = [];
                        dataSource
                          .filter((ll) => ll.IsDirty === true)
                          .map((ii) => {
                            dataArray.push({
                              LocationId: locationId,
                              ServiceId: serviceId,
                              SlotId: ii.Id,
                              IsActive: ii.IsMapped,
                            });
                          });
                        dispatch(InsUpdtserviceSlotLocMapMaster(dataArray));
                      }}
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
                      icon={<Icon component={PrinterOutlined} />}
                      style={{ marginRight: 5 }}
                    >
                      Print
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServiceSlotLocMapPage;
