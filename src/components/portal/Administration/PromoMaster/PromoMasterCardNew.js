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
  PrinterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import PromoMaster from "../../../../models/promomaster";
import { InsUpdtPromoMaster } from "../../../../store/actions/promomaster";
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
const PromoMasterCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState(
    props.formData ? props.formData.PromoImageUri : ""
  );
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const onReset = () => {
    form.resetFields();
  };

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const initialValues = {
    Id: props.formData ? props.formData.Id : 0,
    PromoTitle: props.formData ? props.formData.PromoTitle : "",
    PromoImageUri: props.formData
      ? props.formData.PathType === "C"
        ? `${FileUploadPath.value1}/${props.formData.PromoImageUri}`
        : props.formData.PromoImageUri
      : "",
    SysOption1: props.formData ? props.formData.SysOption1 : "",
    SysOption2: props.formData ? props.formData.SysOption2 : "",
    SysOption3: props.formData ? props.formData.SysOption3 : "",
    SysOption4: props.formData ? props.formData.SysOption4 : "",
    SysOption5: props.formData ? props.formData.SysOption5 : "",
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new PromoMaster(
      values.Id ? values.Id : initialValues.Id,
      values.PromoTitle,
      url ? url.path : null,
      url ? url.pathType : null,
      values.SysOption1,
      values.SysOption2,
      values.SysOption3,
      values.SysOption4,
      values.SysOption5,
      values.IsActive === "true" ? true : false
    );

    // console.log(url);
    dispatch(InsUpdtPromoMaster(props.formData ? "U" : "I", val));
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

  useEffect(() => {
    setUrl({
      url: props.formData
        ? props.formData.PathType === "C"
          ? `${FileUploadPath.value1}/${props.formData.PromoImageUri}`
          : props.formData.PromoImageUri
        : null,
      path: props.formData ? `${props.formData.PromoImageUri}` : null,
      pathType: props.formData ? props.formData.PathType : null,
    });
  }, []);

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
                  name="PromoTitle"
                  style={{ marginBottom: 5 }}
                  label="Promo Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your promo title!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="PromoImageUri"
                  label=" Promo Image URL"
                  valuePropName="upload"
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
                            `${CompCode}/PromoImages`,
                            file
                          ).then((res) => {
                            setUrl(res.url);

                            setImageLoading(false);
                          });
                        } else {
                          UploadImageOwnWebServer(
                            `${CompCode}/${"PromoImages"}/`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: `${
                                FileUploadPath.value1
                              }/${CompCode}/${"PromoImages"}/${res.fileName}`,
                              path: `${CompCode}/${"PromoImages"}/${
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
                  name="SysOption1"
                  label="SysOption1"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="SysOption2"
                  label="SysOption2"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="SysOption3"
                  label="SysOption3"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="SysOption4"
                  label="SysOption4"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="SysOption5"
                  label="SysOption5"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="IsActive"
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

export default PromoMasterCard;
