import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Radio, Button, Row, Col, Card, Input, Spin } from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtOtherMaster } from "../../../../store/actions/othermaster";
import OtherMaster from "../../../../models/othermaster";
import swal from "sweetalert";

const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const MenuOtherMaster = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const initialValues = {
    Id: props.formData ? props.formData.Id : 0,
    MasterType: props.formData ? props.formData.MasterType : "",
    ShortCode: props.formData ? props.formData.ShortCode : "",
    MasterDesc: props.formData ? props.formData.MasterDesc : "",
    Status: props.formData ? props.formData.IsActive : true,
    SysOption1: props.formData ? props.formData.SysOption1 : "",
    SysOption2: props.formData ? props.formData.SysOption2 : "",
    SysOption3: props.formData ? props.formData.SysOption3 : "",
    SysOption4: props.formData ? props.formData.SysOption4 : "",
    SysOption5: props.formData ? props.formData.SysOption5 : "",
  };

  const onFinish = (values) => {
    // setIsLoading(true);
    const val = new OtherMaster(
      values.Id ? values.Id : initialValues.Id,
      props.trnType,
      values.ShortCode,
      values.MasterDesc,
      values.Status,
      values.SysOption1,
      values.SysOption2,
      values.SysOption3,
      values.SysOption4,
      values.SysOption5,
      props.trnType
    );
    // console.log(val);
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((rsp) => {
      if (rsp) {
        dispatch(InsUpdtOtherMaster(props.formData ? "U" : "I", val));
        props.onSavePress(values);
        props.onBackPress();
      }
      swal("Data saved successfully   !!!", { icon: "success" });
    });
  };

  const onReset = () => {
    form.resetFields();
  };
  // useEffect(() => {
  //   if (currentTran.isSuccess) {
  //     form.resetFields();
  //     dispatch(reInitialize());
  //     props.onBackPress();
  //   } else if (currentTran.error) {
  //     toast.error(currentTran.error);
  //   }
  //   setIsLoading(false);
  // }, [currentTran.error, currentTran.isSuccess]);
  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={0.37}>
            <CardHeader
              title={props.title ? props.title : currentTran.formTitle}
            />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
                labelAlign="left"
              >
                <Form.Item
                  name="ShortCode"
                  style={{ marginBottom: 5 }}
                  label="Short Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your short code!",
                    },
                  ]}
                >
                  <Input
                    disabled={props.formData ? true : false}
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="MasterDesc"
                  label="Master Description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your master description!",
                    },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                {!props.customLabelSysOption1 ||
                  (props.customLabelSysOption1 !== "" && (
                    <Form.Item
                      style={{ marginBottom: 5 }}
                      name="SysOption1"
                      label={
                        props.customLabelSysOption1 !== ""
                          ? props.customLabelSysOption1
                          : "SysOption1"
                      }
                    >
                      <Input />
                    </Form.Item>
                  ))}

                {!props.customLabelSysOption2 ||
                  (props.customLabelSysOption2 !== "" && (
                    <Form.Item
                      style={{ marginBottom: 5 }}
                      name="SysOption2"
                      label={
                        props.customLabelSysOption2 !== ""
                          ? props.customLabelSysOption2
                          : "SysOption2"
                      }
                    >
                      <Input />
                    </Form.Item>
                  ))}

                {!props.customLabelSysOption3 ||
                  (props.customLabelSysOption3 !== "" && (
                    <Form.Item
                      style={{ marginBottom: 5 }}
                      name="SysOption3"
                      label={
                        props.customLabelSysOption3 !== ""
                          ? props.customLabelSysOption3
                          : "SysOption3"
                      }
                    >
                      <Input />
                    </Form.Item>
                  ))}

                {!props.customLabelSysOption4 ||
                  (props.customLabelSysOption4 !== "" && (
                    <Form.Item
                      style={{ marginBottom: 5 }}
                      name="SysOption4"
                      label={
                        props.customLabelSysOption4 !== ""
                          ? props.customLabelSysOption4
                          : "SysOption4"
                      }
                    >
                      <Input />
                    </Form.Item>
                  ))}

                {!props.customLabelSysOption5 ||
                  (props.customLabelSysOption5 !== "" && (
                    <Form.Item
                      style={{ marginBottom: 5 }}
                      name="SysOption5"
                      label={
                        props.customLabelSysOption5 !== ""
                          ? props.customLabelSysOption5
                          : "SysOption5"
                      }
                    >
                      <Input />
                    </Form.Item>
                  ))}
                <Form.Item
                  name="Status"
                  label="Status"
                  style={{ marginBottom: 5 }}
                  rules={[{ required: true, message: "Please select Status!" }]}
                >
                  <Radio.Group>
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>InActive</Radio>
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

export default MenuOtherMaster;
