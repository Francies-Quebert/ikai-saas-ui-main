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
  Upload,
  message,
} from "antd";
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
  PlusOutlined,
} from "@ant-design/icons";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";
import { reInitialize } from "../../../../store/actions/currentTran";
import AppServiceType from "../../../../models/app-servicetypes";
import { insUpdtServiceTypeMaster } from "../../../../store/actions/servicetype";

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
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState(
    props.formData ? props.formData.serviceTypeImageURI : ""
  );
  const [serviceCode, setServiceCode] = useState(
    props.formData ? props.formData.serviceTypeCode : ""
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const onReset = () => {
    form.resetFields();
  };
  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const initialValues = {
    ServiceTypeCode: props.formData ? props.formData.serviceTypeCode : "",
    ServiceTypeTitle: props.formData ? props.formData.serviceTypeTitle : "",
    ServiceTypeDesc: props.formData ? props.formData.serviceTypeDesc : "",
    ImageURL: props.formData ? props.formData.serviceTypeImageURI : "",
    Orderby: props.formData ? props.formData.orderby : "",
    Status: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new AppServiceType(
      values.ServiceTypeCode,
      values.ServiceTypeTitle,
      values.ServiceTypeDesc,
      null,
      url ? url.path : null,
      values.Status === "true" ? true : false,
      values.Orderby,
      url ? url.pathType : null
    );
    dispatch(insUpdtServiceTypeMaster(props.formData ? "U" : "I", val));
  };

  useEffect(() => {
    setUrl({
      url: props.formData
        ? props.formData.pathType === "C"
          ? `${FileUploadPath.value1}/${props.formData.serviceTypeImageURI}`
          : props.formData.serviceTypeImageURI
        : null,
      path: props.formData ? `${props.formData.serviceTypeImageURI}` : null,
      pathType: props.formData ? props.formData.pathType : null,
    });
  }, []);
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
                labelAlign="left"
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="ServiceTypeCode"
                  style={{ marginBottom: 5 }}
                  label=" Service Type Code:"
                  rules={[
                    {
                      required: true,
                      message: "Please input your service type code!",
                    },
                  ]}
                >
                  <Input
                    disabled={serviceCode ? true : false}
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5, maxHeight: 45 }}
                  name="ServiceTypeTitle"
                  label=" Service Type Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your service type title!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="ServiceTypeDesc"
                  label=" Description"
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5, marginTop: 12 }}
                  name="ImageURL"
                  label="Image"
                  valuePropName="filelist"
                >
                  <Upload
                    style={{ width: "128px", height: "128px" }}
                    beforeUpload={(file) => {
                      return new Promise(function (resolve, reject) {
                        if (file.size / 1024 <= 3000) {
                          return resolve(true);
                        } else {
                          message.error("Image must smaller than 3MB!");
                          return reject(false);
                        }
                      });
                    }}
                    action={(file) => {
                      setImageLoading(true);
                      return new Promise(function (resolve, reject) {
                        if (DefaultUplodConfig.value1 === "FIREBASE") {
                          UploadImageFirebase(
                            `${CompCode}/ServiceTypeImages`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: res.url,
                              path: res.url,
                              pathType: "U",
                            });
                            setImageLoading(false);
                          });
                        } else {
                          UploadImageOwnWebServer(
                            `${CompCode}/${"ServiceTypeImages"}/`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: `${
                                FileUploadPath.value1
                              }/${CompCode}/${"ServiceTypeImages"}/${
                                res.fileName
                              }`,
                              path: `${CompCode}/${"ServiceTypeImages"}/${
                                res.fileName
                              }`,
                              pathType: "C",
                            });
                          });
                        }
                      });
                    }}
                    listType="picture-card"
                    multiple={false}
                  >
                    {url ? (
                      <img src={url.url} style={{ width: "100%" }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="Orderby"
                  label="Orderby"
                >
                  <InputNumber />
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
