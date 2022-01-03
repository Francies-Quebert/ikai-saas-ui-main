import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Input,
  Switch,
  Spin,
  Card,
  Select,
  Row,
  Col,
} from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getOtherMater } from "../../../services/sendPromoMaster";
import { InsUpdtNotificationPromoTemplate } from "../../../store/actions/notificationCenter";
import { toast } from "react-toastify";
import { reInitialize } from "../../../store/actions/currentTran";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 14,
  },
};

const NotificationPromoForm = (props) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [notificationType, setNotificationType] = useState(
    props.formData ? props.formData.NotificationType : null
  );
  const [otherMaster, setOtherMaster] = useState([]);
  const [ckEditorData, setCkEditorData] = useState(
    props.formData ? props.formData.DataValue1 : ""
  );
  const currentTran = useSelector((state) => state.currentTran);
  useEffect(() => {
    getOtherMater(CompCode, "PCONFIG", 1).then((res) => {
      setOtherMaster([]);
      setOtherMaster(res);
    });
  }, []);
  const [captions, setCaptions] = useState({
    DataValue1: "",
    DataValue2: "",
    DataValue3: "",
    DataValue4: "",
    DataValue5: "",
    DataValue6: "",
    DataValue7: "",
    ConfigValue1: "",
    ConfigValue2: "",
    ConfigValue3: "",
    ConfigValue4: "",
    ConfigValue5: "",
    ConfigValue6: "",
    ConfigValue7: "",
  });

  const setFormCaption = () => {
    if (notificationType === "E") {
      setCaptions({
        ...captions,
        DataValue1: "Email HTML Input",
        DataValue2: "Recipient email Id",
        DataValue3: "Subject",
        DataValue4: "",
        DataValue5: "",
        DataValue6: "",
        DataValue7: "",
        ConfigValue1: "",
        ConfigValue2: "",
        ConfigValue3: "",
        ConfigValue4: "",
        ConfigValue5: "",
        ConfigValue6: "",
        ConfigValue7: "",
      });
    } else if (notificationType === "S") {
      setCaptions({
        ...captions,
        DataValue1: "Message Text",
        DataValue2: "Send To",
        DataValue3: "",
        DataValue4: "",
        DataValue5: "",
        DataValue6: "",
        DataValue7: "",
        ConfigValue1: "",
        ConfigValue2: "",
        ConfigValue3: "",
        ConfigValue4: "",
        ConfigValue5: "",
        ConfigValue6: "",
        ConfigValue7: "",
      });
    } else if (notificationType === "P") {
      setCaptions({
        ...captions,
        DataValue1: "Notification Body",
        DataValue2: "Notification Title",
        DataValue3: "Recipient Token",
        DataValue4: "",
        DataValue5: "",
        DataValue6: "",
        DataValue7: "",
        ConfigValue1: "",
        ConfigValue2: "",
        ConfigValue3: "",
        ConfigValue4: "",
        ConfigValue5: "",
        ConfigValue6: "",
        ConfigValue7: "",
      });
    }
  };

  useEffect(() => {
    setFormCaption();
    // console.log("on notification type change", notificationType);
  }, [notificationType]);

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

  const onFinish = (val) => {
    const CofigValue = otherMaster.filter(
      (ii) => ii.ShortCode === val.NotificationType
    )[0];
    const data = {
      TemplateId: props.formData ? props.formData.Id : null,
      TemplateName: val.title,
      NotificationType: val.NotificationType,
      DataValue1: val.DataValue1,
      DataValue2: val.DataValue2,
      DataValue3: val.DataValue3,
      DataValue4: val.DataValue4,
      DataValue5: val.DataValue5,
      DataValue6: val.DataValue6,
      DataValue7: val.DataValue7,
      ConfigValue1: CofigValue ? CofigValue.SysOption1 : "",
      ConfigValue2: CofigValue ? CofigValue.SysOption2 : "",
      ConfigValue3: CofigValue ? CofigValue.SysOption3 : "",
      ConfigValue4: CofigValue ? CofigValue.SysOption4 : "",
      ConfigValue5: CofigValue ? CofigValue.SysOption5 : "",
      ConfigValue6: val.ConfigValue6,
      ConfigValue7: val.ConfigValue7,
      IsEnabled: val.IsEnabled === true ? "Y" : "N",
    };

    console.log(data,"sending notification");
    dispatch(InsUpdtNotificationPromoTemplate(data));

    // console.log(val, "object");
  };

  const initialValues = {
    NotificationType: props.formData ? props.formData.NotificationType : "",
    title: props.formData ? props.formData.title : "",
    IsEnabled: props.formData
      ? props.formData.IsEnabled === "Y"
        ? true
        : false
      : false,
    DataValue1: ckEditorData,
    DataValue2: props.formData ? props.formData.DataValue2 : "",
    DataValue3: props.formData ? props.formData.DataValue3 : "",
    DataValue4: props.formData ? props.formData.DataValue4 : "",
    DataValue5: props.formData ? props.formData.DataValue5 : "",
    DataValue6: props.formData ? props.formData.DataValue6 : "",
    DataValue7: props.formData ? props.formData.DataValue7 : "",
    ConfigValue1: props.formData ? props.formData.ConfigValue1 : "",
    ConfigValue2: props.formData ? props.formData.ConfigValue2 : "",
    ConfigValue3: props.formData ? props.formData.ConfigValue3 : "",
    ConfigValue4: props.formData ? props.formData.ConfigValue4 : "",
    ConfigValue5: props.formData ? props.formData.ConfigValue5 : "",
    ConfigValue6: props.formData ? props.formData.ConfigValue6 : "",
    ConfigValue7: props.formData ? props.formData.ConfigValue7 : "",
  };

  return (
    <Spin indicator={antIcon} spinning={isLoading}>
      <Form
        form={form}
        initialValues={initialValues}
        name="userbody"
        {...formItemLayout}
        onFinish={onFinish}
        labelAlign="right"
        onValuesChange={() => {
          setNotificationType(form.getFieldValue("NotificationType"));
        }}
      >
        <Form.Item
          label="Notification Type"
          name="NotificationType"
          rules={[
            { required: true, message: "Please input notification type!" },
          ]}
          style={{ marginBottom: 5 }}
        >
          <Select
            // disabled={props.formData ? true : false}
            showSearch
            placeholder="Select a Notification Type"
            optionFilterProp="children"
            allowClear={true}
            onChange={(sss) => setNotificationType(sss)}
          >
            <Option value={`S`}>SMS</Option>
            <Option value={`E`}>Email</Option>
            <Option value={`P`}>Push Notification</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input Title!" }]}
          style={{ marginBottom: 5 }}
        >
          <Input placeholder="Enter Title" />
        </Form.Item>

        <Form.Item
          label="Enabled"
          name="IsEnabled"
          rules={[{ required: true, message: "Please input first name!" }]}
          style={{ marginBottom: 5 }}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          style={{
            marginBottom: 5,
            display: captions.DataValue1 === "" ? "none" : "flex",
          }}
          label={captions.DataValue1}
          name="DataValue1"
        >
          <Input.TextArea rows={6} placeholder="Enter Data Value" />
        </Form.Item>

        <Form.Item
          label={captions.DataValue2}
          name="DataValue2"
          style={{
            marginBottom: 5,
            display: captions.DataValue2 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.DataValue2}`} />
        </Form.Item>

        <Form.Item
          label={captions.DataValue3}
          name="DataValue3"
          style={{
            marginBottom: 5,
            display: captions.DataValue3 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.DataValue3}`} />
        </Form.Item>

        <Form.Item
          label={captions.DataValue4}
          name="DataValue4"
          style={{
            marginBottom: 5,
            display: captions.DataValue4 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.DataValue4}`} />
        </Form.Item>

        <Form.Item
          label={captions.DataValue5}
          name="DataValue5"
          style={{
            marginBottom: 5,
            display: captions.DataValue5 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.DataValue5}`} />
        </Form.Item>

        <Form.Item
          label={captions.DataValue6}
          name="DataValue6"
          style={{
            marginBottom: 5,
            display: captions.DataValue6 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.DataValue6}`} />
        </Form.Item>

        <Form.Item
          label={captions.DataValue7}
          name="DataValue7"
          style={{
            marginBottom: 5,
            display: captions.DataValue7 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.DataValue7}`} />
        </Form.Item>

        <Form.Item
          label={captions.ConfigValue1}
          name="ConfigValue1"
          style={{
            marginBottom: 5,
            display: captions.ConfigValue1 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.ConfigValue1}`} />
        </Form.Item>

        <Form.Item
          label={captions.ConfigValue2}
          name="ConfigValue2"
          style={{
            marginBottom: 5,
            display: captions.ConfigValue2 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.ConfigValue2}`} />
        </Form.Item>

        <Form.Item
          label={captions.ConfigValue3}
          name="ConfigValue3"
          style={{
            marginBottom: 5,
            display: captions.ConfigValue3 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.ConfigValue3}`} />
        </Form.Item>

        <Form.Item
          label={captions.ConfigValue4}
          name="ConfigValue4"
          style={{
            marginBottom: 5,
            display: captions.ConfigValue4 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.ConfigValue4}`} />
        </Form.Item>

        <Form.Item
          label={captions.ConfigValue5}
          name="ConfigValue5"
          style={{
            marginBottom: 5,
            display: captions.ConfigValue5 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.ConfigValue5}`} />
        </Form.Item>

        <Form.Item
          label={captions.ConfigValue6}
          name="ConfigValue6"
          style={{
            marginBottom: 5,
            display: captions.ConfigValue6 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.ConfigValue6}`} />
        </Form.Item>

        <Form.Item
          label={captions.ConfigValue7}
          name="ConfigValue7"
          style={{
            marginBottom: 5,
            display: captions.ConfigValue7 === "" ? "none" : "flex",
          }}
        >
          <Input placeholder={`Enter ${captions.ConfigValue7}`} />
        </Form.Item>

        <Divider />
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

          <Button
            type="primary"
            icon={<Icon component={PrinterOutlined} />}
            style={{ marginRight: 5 }}
          >
            Print
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default NotificationPromoForm;
