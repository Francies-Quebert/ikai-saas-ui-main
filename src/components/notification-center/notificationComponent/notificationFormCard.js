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
import CKEdtors from "react-ckeditor-component";
import { Divider } from "antd";
import { InsUpdtNotificationTranDtl } from "../../../store/actions/notificationCenter";
import { useSelector, useDispatch } from "react-redux";
import { reInitialize } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import swal from "sweetalert";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 14,
  },
};

const NotificationFormCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const currentTran = useSelector((state) => state.currentTran);
  const [notificationType, setNotificationType] = useState(
    props.formData ? props.formData.NotificationType : null
  );
  const [deliveryType, setDeliveryType] = useState(
    props.formData ? props.formData.DeliveryType : ""
  );
  const [ckEditorData, setCkEditorData] = useState(
    props.formData ? props.formData.DataValue1 : ""
  );
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

  const onFinish = (val) => {
    if (val) {
      swal("Are you sure you want to do this ?", {
        buttons: ["Cancel", "Yes!"],
      }).then((value) => {
        if (value) {
          dispatch(
            InsUpdtNotificationTranDtl(
              val,
              props.formData ? props.formData.PkId : null,
              props.tranId
            )
          );
          swal("Data saved successfully.....!", {
            icon: "success",
          });
          props.onBackPress();
        }
      });
    }
  };

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
        ConfigValue1: "host",
        ConfigValue2: "port",
        ConfigValue3: "auth-username",
        ConfigValue4: "auth-password",
        ConfigValue5: "Sender Email",
        ConfigValue6: "",
        ConfigValue7: "",
      });
    } else if (notificationType === "S") {
      setCaptions({
        ...captions,
        DataValue1: "SMS API Link",
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
  // useEffect(() => {}, [ckEditorData]);

  useEffect(() => {
    setFormCaption();
    // console.log("on notification type change", notificationType);
  }, [notificationType]);

  useEffect(() => {
    if (currentTran.success) {
      form.resetFields();
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
  }, [currentTran.error, currentTran.isSuccess]);

  const initialValues = {
    NotificationType: props.formData ? props.formData.NotificationType : "",
    title: props.formData ? props.formData.title : "",
    DeliveryType: props.formData ? props.formData.DeliveryType : "",
    WaitInSeconds: props.formData ? props.formData.WaitInSeconds : "",
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

  const handleblur = (evt) => {
    var newContent = evt.editor.getData();
    setCkEditorData(newContent);
  };

  const onChange = (evt) => {};

  return (
    <Row>
      <Col span={24}>
        <Form
          form={form}
          initialValues={initialValues}
          name="userbody"
          {...formItemLayout}
          onFinish={onFinish}
          labelAlign="left"
          onValuesChange={() => {
            setNotificationType(form.getFieldValue("NotificationType"));
            setDeliveryType(form.getFieldValue("DeliveryType"));
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
            label="Delivery Type"
            name="DeliveryType"
            rules={[{ required: true, message: "Please input Title!" }]}
            style={{ marginBottom: 5 }}
          >
            <Select
              showSearch
              placeholder="Select a Notification Type"
              optionFilterProp="children"
              allowClear={true}
            >
              <Option value={`H`}>Add Hoc</Option>
              <Option value={`P`}>Pool</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Wait In Seconds"
            name="WaitInSeconds"
            rules={
              deliveryType === "P"
                ? [{ required: true, message: "Please input Title!" }]
                : []
            }
            style={{ marginBottom: 5 }}
          >
            <Input
              disabled={deliveryType !== "P"}
              placeholder="Enter Wait In Seconds"
            />
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
          {captions.DataValue1 !== "" && (
            <Form.Item
              style={{ marginBottom: 5 }}
              label={captions.DataValue1}
              name="DataValue1"
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
              // rules={
              //   notificationType !== "E"
              //     ? [{ required: true, message: "Please input Data Value 1!" }]
              //     : [
              //         {
              //           validator(rule, value) {
              //             return new Promise((resolve, reject) => {
              //               if (ckEditorData === "") {
              //                 reject("Please input Data Value 1!");
              //               } else {
              //                 resolve(ckEditorData);
              //               }
              //             });
              //           },
              //         },
              //       ]
              // }
            >
              <Input.TextArea rows={6} placeholder="Enter Data Value" />
              {/* {notificationType === "E" ? (
          <CKEdtors
            content={ckEditorData}
            events={{
              blur: handleblur,
              change: onChange,
            }}
          />
        ) : (
          <Input.TextArea placeholder="Enter Data Value" />
        )} */}
            </Form.Item>
          )}
          {captions.DataValue2 !== "" && (
            <Form.Item
              label={captions.DataValue2}
              name="DataValue2"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.DataValue2}`} />
            </Form.Item>
          )}
          {captions.DataValue3 !== "" && (
            <Form.Item
              label={captions.DataValue3}
              name="DataValue3"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.DataValue3}`} />
            </Form.Item>
          )}

          {captions.DataValue4 !== "" && (
            <Form.Item
              label={captions.DataValue4}
              name="DataValue4"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.DataValue4}`} />
            </Form.Item>
          )}

          {captions.DataValue5 !== "" && (
            <Form.Item
              label={captions.DataValue5}
              name="DataValue5"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.DataValue5}`} />
            </Form.Item>
          )}

          {captions.DataValue6 !== "" && (
            <Form.Item
              label={captions.DataValue6}
              name="DataValue6"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.DataValue6}`} />
            </Form.Item>
          )}

          {captions.DataValue7 !== "" && (
            <Form.Item
              label={captions.DataValue7}
              name="DataValue7"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.DataValue7}`} />
            </Form.Item>
          )}

          {captions.ConfigValue1 !== "" && (
            <Form.Item
              label={captions.ConfigValue1}
              name="ConfigValue1"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.ConfigValue1}`} />
            </Form.Item>
          )}

          {captions.ConfigValue2 !== "" && (
            <Form.Item
              label={captions.ConfigValue2}
              name="ConfigValue2"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.ConfigValue2}`} />
            </Form.Item>
          )}

          {captions.ConfigValue3 !== "" && (
            <Form.Item
              label={captions.ConfigValue3}
              name="ConfigValue3"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.ConfigValue3}`} />
            </Form.Item>
          )}

          {captions.ConfigValue4 !== "" && (
            <Form.Item
              label={captions.ConfigValue4}
              name="ConfigValue4"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.ConfigValue4}`} />
            </Form.Item>
          )}

          {captions.ConfigValue5 !== "" && (
            <Form.Item
              label={captions.ConfigValue5}
              name="ConfigValue5"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.ConfigValue5}`} />
            </Form.Item>
          )}

          {captions.ConfigValue6 !== "" && (
            <Form.Item
              label={captions.ConfigValue6}
              name="ConfigValue6"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.ConfigValue6}`} />
            </Form.Item>
          )}

          {captions.ConfigValue7 !== "" && (
            <Form.Item
              label={captions.ConfigValue7}
              name="ConfigValue7"
              style={{ marginBottom: 5 }}
              rules={[{ required: true, message: "Please field cannot be empty!" }]}
            >
              <Input placeholder={`Enter ${captions.ConfigValue7}`} />
            </Form.Item>
          )}

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
      </Col>
      {/* <Col flex="0 1 300px">0 1 300px</Col> */}
    </Row>
  );
};

export default NotificationFormCard;
