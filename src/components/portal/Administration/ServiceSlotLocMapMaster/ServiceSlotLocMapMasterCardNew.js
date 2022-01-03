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
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtserviceSlotLocMapMaster } from "../../../../store/actions/ServiceSlotLocMap";
import ServiceSlotLocMapp from "../../../../models/ServiceSlotLocMap";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const ServiceRateMapCardNew = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const Locations = useSelector((state) => state.AppMain.locations);
  const Slots = useSelector((state) => state.AppMain.slots);
  const Service = useSelector((state) => state.serviceMaster.serviceMasters);

  const initialValues = {
    ServiceTitle: props.formData
      ? Service.find((ii) => ii.ServiceTitle === props.formData.ServiceTitle)
          .ServiceId
      : "",
    SlotName: props.formData
      ? Slots.find((ii) => ii.SlotName === props.formData.SlotName).Id
      : "",
    LocationName: props.formData
      ? Locations.find((ii) => ii.LocationName === props.formData.LocationName)
          .LocationId
      : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new ServiceSlotLocMapp(
      values.ServiceTitle,
      values.SlotName,
      values.LocationName,
      values.Status === "true" ? true : false
    );
    // console.log(val);
    dispatch(InsUpdtserviceSlotLocMapMaster(props.formData ? "U" : "I", val));
  };
  useEffect(() => {
    if (currentTran.isSuccess) {
      form.resetFields();
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);
  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={0.37}>
            <CardHeader title={currentTran.formTitle} />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="LocationName"
                  style={{ marginBottom: 5 }}
                  label="Location Name"
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
                  name="ServiceTitle"
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
                  name="SlotName"
                  style={{ marginBottom: 5 }}
                  label="Slot Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your slot!",
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
                    {Slots.map((ii) => (
                      <Option key={ii.Id} value={ii.Id}>
                        {ii.SlotName}
                      </Option>
                    ))}
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  name="Status"
                  label="Status"
                  style={{ marginBottom: 5 }}
                  rules={[{ required: true, message: "Please select Status!" }]}
                >
                  <Radio.Group>
                    <Radio value="true">Active</Radio>
                    <Radio value="false">InActive</Radio>
                  </Radio.Group>
                </Form.Item>
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
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
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default ServiceRateMapCardNew;
