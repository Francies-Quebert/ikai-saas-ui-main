import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Input,
  Card,
  Select,
  Row,
  Col,
  Switch,
  DatePicker,
} from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import NotificationPromoTable, {
  fetchTableData,
} from "./NotificationPromoTable";
import { InsUpdtNotificationPromo } from "../../../store/actions/notificationCenter";
import _ from "lodash";
import { getOtherMater } from "../../../services/sendPromoMaster";
import { toast } from "react-toastify";
import { reInitialize } from "../../../store/actions/currentTran";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};

const NotificationSendForm = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [notificationType, setNotificationType] = useState(
    props.formData ? props.formData.NotificationType : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currentTran = useSelector((state) => state.currentTran);
  const username = useSelector((state) => state.LoginReducer.userData.username);
  const [disableDatePicker, setDisableDatePicker] = useState(true);
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

  const [ckEditorData, setCkEditorData] = useState(
    props.formData ? props.formData.DataValue1 : ""
  );
  const [otherMaster, setOtherMaster] = useState([]);
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
    getOtherMater(CompCode, "PCONFIG", 1).then((res) => {
      setOtherMaster([]);
      setOtherMaster(res);
    });
  }, []);

  useEffect(() => {
    setFormCaption();
  }, [notificationType]);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current < moment().startOf("day");
  };

  const onFinish = (val) => {
    try {
      const l_tableData = fetchTableData();
      // console.log(
      //   val["WaitInSeconds"].format("YYYY-MM-DD HH:mm:ss"),
      //   l_tableData
      // );
      //set Val based on config defined in OtherMaster configs for notification type before proceeding for loop
      const CofigValue = otherMaster.filter(
        (ii) => ii.ShortCode === val.NotificationType
      )[0];
      // console.log(CofigValue);
      // const curDate = moment().format("YYYY-MM-DD HH:mm:ss");
      //end
      // const selectedDate = val["WaitInSeconds"].format("YYYY-MM-DD HH:mm:ss");
      // const diffSeconds = curDate.diff(selectedDate, "seconds");

      // console.log(diffSeconds);

      const finalData = [];
      l_tableData.map((row) => {
        let tempObj = {
          TemplateId: props.formData ? props.formData.Id : null,
          NotificationType: val.NotificationType,
          DeliveryType: "P",
          WaitInSeconds: disableDatePicker
            ? 0
            : val["WaitInSeconds"].format("YYYY-MM-DD HH:mm:ss"),
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
          UpdtUserId: username,
        };
        Object.keys(row).map((cells) => {
          if (cells !== "key") {
            // console.log(cells, cells.toUpperCase(), row);
            // console.log("data", row[`${cells}`]);
            tempObj.DataValue1 = _.replace(
              tempObj.DataValue1,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.DataValue2 = _.replace(
              tempObj.DataValue2,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.DataValue3 = _.replace(
              tempObj.DataValue3,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.DataValue4 = _.replace(
              tempObj.DataValue4,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.DataValue5 = _.replace(
              tempObj.DataValue5,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.DataValue6 = _.replace(
              tempObj.DataValue6,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.DataValue7 = _.replace(
              tempObj.DataValue7,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.ConfigValue1 = _.replace(
              tempObj.ConfigValue1,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.ConfigValue2 = _.replace(
              tempObj.ConfigValue2,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.ConfigValue3 = _.replace(
              tempObj.ConfigValue3,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.ConfigValue4 = _.replace(
              tempObj.ConfigValue4,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.ConfigValue5 = _.replace(
              tempObj.ConfigValue5,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.ConfigValue6 = _.replace(
              tempObj.ConfigValue6,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
            tempObj.ConfigValue7 = _.replace(
              tempObj.ConfigValue7,
              `<<${cells.toUpperCase()}>>`,
              row[`${cells}`]
            );
          }
        });
        finalData.push(tempObj);
      });
      console.log(finalData,"final Data");
      dispatch(InsUpdtNotificationPromo(finalData));
    } catch (err) {}
  };

  const initialValues = {
    TemplateId: props.formData ? props.formData.Id : null,
    NotificationType: props.formData ? props.formData.NotificationType : "",
    title: props.formData ? props.formData.title : "",
    // IsEnabled: props.formData
    //   ? props.formData.IsEnabled === "Y"
    //     ? true
    //     : false
    //   : false,
    // WaitInSeconds: props.formData ? props.formData.title : "",
    DataValue1: props.formData ? props.formData.DataValue1 : "",
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
    WaitInSeconds: "",
    schedule: !disableDatePicker,
  };

  return (
    <Row>
      <Col span={10}>
        <Card bodyStyle={{ padding: "10px 14px" }}>
          <NotificationPromoTable NotificationType={notificationType} />
        </Card>
      </Col>
      <Col span={14}>
        <Card bodyStyle={{ padding: "10px 14px" }}>
          <Form
            form={form}
            initialValues={initialValues}
            name="userbody"
            {...formItemLayout}
            onFinish={onFinish}
            labelAlign="left"
            // size="small"
            // onValuesChange={() => {
            //   setNotificationType(form.getFieldValue("NotificationType"));
            // }}
          >
            <Form.Item
              label="Notification Type"
              name="NotificationType"
              rules={[
                { required: true, message: "Please input notification type!" },
              ]}
              style={{ marginBottom: -3 }}
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
              rules={
                props.entryMode !== "QS"
                  ? [{ required: true, message: "Please input Title!" }]
                  : []
              }
              style={{
                marginBottom: -3,
                display: props.entryMode === "QS" ? "none" : "flex",
              }}
            >
              <Input
                placeholder="Enter Title"
                disabled={props.formData ? true : false}
              />
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
                marginBottom: -3,
                display: captions.DataValue2 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.DataValue2}`} />
            </Form.Item>

            <Form.Item
              label={captions.DataValue3}
              name="DataValue3"
              style={{
                marginBottom: -3,
                display: captions.DataValue3 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.DataValue3}`} />
            </Form.Item>

            <Form.Item
              label={captions.DataValue4}
              name="DataValue4"
              style={{
                marginBottom: -3,
                display: captions.DataValue4 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.DataValue4}`} />
            </Form.Item>

            <Form.Item
              label={captions.DataValue5}
              name="DataValue5"
              style={{
                marginBottom: -3,
                display: captions.DataValue5 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.DataValue5}`} />
            </Form.Item>

            <Form.Item
              label={captions.DataValue6}
              name="DataValue6"
              style={{
                marginBottom: -3,
                display: captions.DataValue6 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.DataValue6}`} />
            </Form.Item>

            <Form.Item
              label={captions.DataValue7}
              name="DataValue7"
              style={{
                marginBottom: -3,
                display: captions.DataValue7 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.DataValue7}`} />
            </Form.Item>

            <Form.Item
              label={captions.ConfigValue1}
              name="ConfigValue1"
              style={{
                marginBottom: -3,
                display: captions.ConfigValue1 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.ConfigValue1}`} />
            </Form.Item>

            <Form.Item
              label={captions.ConfigValue2}
              name="ConfigValue2"
              style={{
                marginBottom: -3,
                display: captions.ConfigValue2 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.ConfigValue2}`} />
            </Form.Item>

            <Form.Item
              label={captions.ConfigValue3}
              name="ConfigValue3"
              style={{
                marginBottom: 2,
                display: captions.ConfigValue3 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.ConfigValue3}`} />
            </Form.Item>

            <Form.Item
              label={captions.ConfigValue4}
              name="ConfigValue4"
              style={{
                marginBottom: 2,
                display: captions.ConfigValue4 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.ConfigValue4}`} />
            </Form.Item>

            <Form.Item
              label={captions.ConfigValue5}
              name="ConfigValue5"
              style={{
                marginBottom: 2,
                display: captions.ConfigValue5 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.ConfigValue5}`} />
            </Form.Item>

            <Form.Item
              label={captions.ConfigValue6}
              name="ConfigValue6"
              style={{
                marginBottom: 2,
                display: captions.ConfigValue6 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.ConfigValue6}`} />
            </Form.Item>

            <Form.Item
              label={captions.ConfigValue7}
              name="ConfigValue7"
              style={{
                marginBottom: 2,
                display: captions.ConfigValue7 === "" ? "none" : "flex",
              }}
            >
              <Input placeholder={`Enter ${captions.ConfigValue7}`} />
            </Form.Item>
            <Form.Item
              label="Schedule"
              name="schedule"
              // rules={[{ required: true, message: "Please input first name!" }]}
              style={{ marginBottom: -3 }}
              valuePropName="checked"
            >
              <Switch
                onChange={(val) => {
                  if (val) {
                    setDisableDatePicker(false);
                  } else {
                    setDisableDatePicker(true);
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              name="WaitInSeconds"
              label="Schedule On"
              // {...config}
              rules={
                !disableDatePicker
                  ? [
                      {
                        type: "object",
                        required: true,
                        message: "Please input notification type!",
                      },
                    ]
                  : []
              }
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                disabled={disableDatePicker}
              />
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <Card bodyStyle={{ padding: "5px 15px" }}>
          <Form
            form={form}
            initialValues={initialValues}
            name="userbody"
            {...formItemLayout}
            onFinish={onFinish}
            labelAlign="left"
            // size="small"
          >
            <Form.Item noStyle={true}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{ marginRight: 5 }}
              >
                Send
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
        </Card>
      </Col>
    </Row>
  );
};

export default NotificationSendForm;
