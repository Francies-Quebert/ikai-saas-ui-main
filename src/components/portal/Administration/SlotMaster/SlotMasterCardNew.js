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
  TimePicker,
  Spin,
} from "antd";
import CardHeader from "../../../common/CardHeader";

import { Divider } from "antd";
import { toast } from "react-toastify";
import moment from "moment";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtSlotMaster } from "../../../../store/actions/slotmaster";
import SlotMaster from "../../../../models/slotmaster";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SlotMasterCardNew = (props) => {
  const [form] = Form.useForm();
  // const [selectedTime, setSelectedTime] = useState();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);

  const initialValues = {
    Id: props.formData ? props.formData.Id : 0,
    SlotName: props.formData ? props.formData.SlotName : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
    // starttime: props.formData ? props.formData.starttime : null,
    starttime: props.formData
      ? moment(props.formData.starttime, "HH:mm:ss")
      : null,
  };
  // console.log(
  //   moment("12:30:00", "HH:mm:ss").format("HH:mm:ss"),
  //   "initialvalues"
  // );
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    // setIsLoading(true);

    const val = new SlotMaster(
      values.Id ? values.Id : initialValues.Id,
      values.SlotName,
      values.Status === "true" ? true : false,
      values["starttime"].format("HH:mm:ss")
    );
    dispatch(InsUpdtSlotMaster(props.formData ? "U" : "I", val));
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
                labelAlign="left"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="SlotName"
                  style={{ marginBottom: 5 }}
                  label="Slot Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your slot name!",
                    },
                  ]}
                >
                  <Input style={{ textTransform: "uppercase" }} />
                </Form.Item>
                <Form.Item
                  name="starttime"
                  style={{ marginBottom: 5 }}
                  label="Start Time"
                  rules={[
                    {
                      required: true,
                      message: "Please input your start time!",
                    },
                  ]}
                >
                  {/* <TimePicker
                    defaultValue={moment("00:00:00", "HH:mm:ss")}
                  /> */}

                  <TimePicker
                    bordered={true}
                    style={{ width: "40%" }}
                    format={"HH:mm:ss"}
                    // defaultValue={initialValues.starttime}

                    // defaultValue={moment('12:08:23', 'HH:mm:ss')}
                  />
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

export default SlotMasterCardNew;
