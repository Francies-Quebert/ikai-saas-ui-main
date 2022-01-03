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
  Upload,
  message,
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
  DownloadOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import ServiceMaster from "../../../../models/servicemaster";
import { InsUpdtServiceMaster } from "../../../../store/actions/servicemaster";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";

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
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const ServiceType = useSelector((state) => state.AppMain.serviceTypes);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [serviceType, setServiceType] = useState(
    props.formData ? props.formData.ServiceType : ""
  );
  const hsnsacMaster = useSelector((state) => state.hsnsacMaster.hsnsacMaster);
  const taxMaster = useSelector((state) => state.taxMaster.taxMaster);
  const currentTran = useSelector((state) => state.currentTran);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState(
    props.formData ? props.formData.ServiceImageURI : ""
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    setUrl({
      url: props.formData
        ? props.formData.pathType === "C"
          ? `${FileUploadPath.value1}/${props.formData.ServiceImageURI}`
          : props.formData.ServiceImageURI
        : null,
      path: props.formData ? `${props.formData.ServiceImageURI}` : null,
      pathType: props.formData ? props.formData.pathType : null,
    });
  }, []);

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const initialValues = {
    ServiceId: props.formData ? props.formData.ServiceId : 0,
    ServiceType: props.formData ? props.formData.ServiceType : "",
    ServiceTitle: props.formData ? props.formData.ServiceTitle : "",
    ServiceDesc: props.formData ? props.formData.ServiceDesc : "",
    ServiceImageURI: props.formData ? props.formData.ServiceImageURI : "",
    Status: props.formData ? props.formData.IsActive : true,
    HSNSACCode: props.formData ? props.formData.HSNSACCode : "",
    TaxCode: props.formData ? props.formData.TaxCode : "",
  };
  const onFinish = (values) => {
    setIsLoading(true);

    const val = new ServiceMaster(
      values.ServiceId ? values.ServiceId : initialValues.ServiceId,
      values.ServiceType,
      values.ServiceTitle,
      values.ServiceDesc,
      url ? url.path : null,
      values.Status,
      values.HSNSACCode,
      values.TaxCode,
      url ? url.pathType : null
    );
    // console.log(val, "card");
    dispatch(InsUpdtServiceMaster(props.formData ? "U" : "I", val));
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
                  name="ServiceType"
                  style={{ marginBottom: 5 }}
                  label=" Service Type"
                  rules={[
                    {
                      required: true,
                      message: "Please input your service type!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a service"
                    optionFilterProp="children"
                    allowClear={true}
                    disabled={serviceType ? true : false}
                  >
                    {ServiceType.map((ii) => (
                      <Option
                        key={ii.serviceTypeCode}
                        value={ii.serviceTypeCode}
                      >
                        {ii.serviceTypeTitle}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="ServiceTitle"
                  label=" Service Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your service title!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="ServiceDesc"
                  label=" Service Description"
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5, marginTop: 12 }}
                  name="ServiceImageURI"
                  label="Image URL"
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
                            `${CompCode}/ServiceImages`,
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
                            `${CompCode}/${"ServiceImages"}/`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: `${
                                FileUploadPath.value1
                              }/${CompCode}/${"ServiceImages"}/${res.fileName}`,
                              path: `${CompCode}/${"ServiceImages"}/${
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
                  name="HSNSACCode"
                  style={{ marginBottom: 5 }}
                  label="HSNSAC Code"
                  rules={[
                    {
                      required: true,
                      message: "Please select your HSNSAC Code!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a HSNSACCode"
                    optionFilterProp="children"
                    allowClear={true}
                  >
                    {hsnsacMaster.length > 0 &&
                      hsnsacMaster
                        .filter((i) => i.IsActive === true)
                        .map((ii) => {
                          return (
                            <Option
                              key={ii.hsnsaccode}
                              value={ii.hsnsaccode}
                            >{`${ii.hsnsaccode} (${ii.hsnsacdesc})`}</Option>
                          );
                        })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="TaxCode"
                  style={{ marginBottom: 5 }}
                  label="Tax Code"
                  rules={[
                    {
                      required: true,
                      message: "Please select your tax!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select a tax"
                    optionFilterProp="children"
                    allowClear={true}
                  >
                    {taxMaster.length > 0 &&
                      taxMaster
                        .filter((i) => i.IsActive === true)
                        .map((ii) => {
                          return (
                            <Option
                              key={ii.TaxCode}
                              value={ii.TaxCode}
                            >{`${ii.TaxCode} (${ii.TaxName})`}</Option>
                          );
                        })}
                  </Select>
                </Form.Item>
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
