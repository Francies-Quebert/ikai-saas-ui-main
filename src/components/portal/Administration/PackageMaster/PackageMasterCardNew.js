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
import CKEditors from "react-ckeditor-component";
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
import { InsUpdtPackageMaster } from "../../../../store/actions/PackageMaster";
import PackageMaster from "../../../../models/package-master";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const ServiceTypeMasterCardNew = (props) => {
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [ChkEditContent, setChkEditContent] = useState(
    props.formData ? props.formData.PackageDiscHtml : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);

  const onReset = () => {
    form.resetFields();
  };

  const handleblur = (evt) => {
    // console.log(evt);
    var newContent = evt.editor.getData();
    setChkEditContent(newContent);
  };
  const onChange = (evt) => {
    var newContent = evt.editor.getData();
  };

  useEffect(() => {}, [ChkEditContent]);

  const initialValues = {
    PackageId: props.formData ? props.formData.PackageId : 0,
    PackageTitle: props.formData ? props.formData.PackageTitle : "",
    PackageDesc: props.formData ? props.formData.PackageDesc : "",
    PackageUnit: props.formData ? props.formData.PackageUnit : "",
    PackageUnitDesc: props.formData ? props.formData.PackageUnitDesc : "",
    PackageDiscType: props.formData ? props.formData.PackageDiscType : "",
    PackageDiscValue: props.formData ? props.formData.PackageDiscValue : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
    VisitType: props.formData ? props.formData.VisitType : "",
    PackageDiscHtml: props.formData ? props.formData.PackageDiscHtml : "",
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new PackageMaster(
      values.PackageId ? values.PackageId : initialValues.PackageId,
      values.PackageTitle,
      values.PackageDesc,
      values.PackageUnit,
      values.PackageUnitDesc,
      null,
      null,
      values.Status === "true" ? true : false,
      values.VisitType,
      ChkEditContent
    );
    // console.log(val);
    dispatch(InsUpdtPackageMaster(props.formData ? "U" : "I", val));
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
                  name="PackageTitle"
                  style={{ marginBottom: 5 }}
                  label="Package Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your package title",
                    },
                  ]}
                >
                  <Input
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="PackageDesc"
                  label="Package Description"
                >
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5, marginTop: 12 }}
                  name="PackageDiscHtml"
                  label="Package Description Html"
                >
                  <CKEditors
                    value={ChkEditContent}
                    content={ChkEditContent}
                    events={{
                      blur: handleblur,
                      change: onChange,
                    }}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5, marginTop: 12 }}
                  name="PackageUnit"
                  label="Package Unit"
                  rules={[
                    { required: true, message: "Please input package unit!" },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="PackageUnitDesc"
                  label="Package Unit Description"
                >
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5, marginTop: 12 }}
                  name="VisitType"
                  label="Visit Type"
                  rules={[
                    { required: true, message: "Please input visit type!" },
                  ]}
                >
                  <Input
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
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

export default ServiceTypeMasterCardNew;
