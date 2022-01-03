import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Spin,
  Upload,
  message,
  Divider,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import HomeScreenAppLayoutDtl from "../../../../models/homescreen-app-layout-Dtl";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";
import { InsUpdtHomeScreenAppLayoutDtl } from "../../../../store/actions/homescreen-app-layout";
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const HomeScreenAppLayoutDtlCard = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState(
    props.formData ? props.formData.PromoImageUri : ""
  );
  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const initialValues = {
    LayoutId: props.formData ? props.formData.LayoutId : "",
    Id: props.formData ? props.formData.Id : 0,
    LayoutId: props.formData ? props.formData.LayoutId : "",
    PromoTitle: props.formData ? props.formData.PromoTitle : "",
    PromoImageUri: props.formData
      ? props.formData.pathType === "C"
        ? `${FileUploadPath.value1}/${props.formData.PromoImageUri}`
        : props.formData.PromoImageUri
      : "",
    SysOption1: props.formData ? props.formData.SysOption1 : "",
    SysOption2: props.formData ? props.formData.SysOption2 : "",
    SysOption3: props.formData ? props.formData.SysOption3 : "",
    SysOption4: props.formData ? props.formData.SysOption4 : "",
    SysOption5: props.formData ? props.formData.SysOption5 : "",
    OrderBy: props.formData ? props.formData.OrderBy : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new HomeScreenAppLayoutDtl(
      values.Id ? values.Id : initialValues.Id,
      values.LayoutId ? values.LayoutId : initialValues.LayoutId,
      values.PromoTitle,
      url ? url.path : null,
      url ? url.pathType : null,
      values.SysOption1,
      values.SysOption2,
      values.SysOption3,
      values.SysOption4,
      values.SysOption5,
      values.OrderBy,
      values.IsActive === true ? true : false
    );
    dispatch(InsUpdtHomeScreenAppLayoutDtl(val));
  };
  useEffect(() => {
    setUrl({
      url: props.formData
        ? props.formData.pathType === "C"
          ? `${FileUploadPath.value1}/${props.formData.PromoImageUri}`
          : props.formData.PromoImageUri
        : null,
      path: props.formData ? `${props.formData.PromoImageUri}` : null,
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
            <CardHeader title="App Layout Detail Form" />
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
                  label="Homescreen Title"
                >
                  <Input placeholder="Please input Homescreen Title!" />
                </Form.Item>
                <Form.Item
                  name="PromoImageUri"
                  style={{ marginBottom: 5 }}
                  label="Homescreen Image"
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
                            `${CompCode}/HomescreenAppLayout`,
                            file
                          ).then((res) => {
                            setUrl(res.url);
                            setImageLoading(false);
                          });
                        } else {
                          UploadImageOwnWebServer(
                            `${CompCode}/${"HomescreenAppLayout"}/`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: `${
                                FileUploadPath.value1
                              }/${CompCode}/${"HomescreenAppLayout"}/${
                                res.fileName
                              }`,
                              path: `${CompCode}/${"HomescreenAppLayout"}/${
                                res.fileName
                              }`,
                              pathType:
                                DefaultUplodConfig.value1 === "OWN" ? "C" : "U",
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
                  name="SysOption1"
                  style={{ marginBottom: 5 }}
                  label="SysOption 1"
                >
                  <Input placeholder="Please input sysoption 1!" />
                </Form.Item>

                <Form.Item
                  name="SysOption2"
                  style={{ marginBottom: 5 }}
                  label="SysOption 2"
                >
                  <Input placeholder="Please input sysoption 2!" />
                </Form.Item>
                <Form.Item
                  name="SysOption3"
                  style={{ marginBottom: 5 }}
                  label="SysOption 3"
                >
                  <Input placeholder="Please input sysoption 3!" />
                </Form.Item>
                <Form.Item
                  name="SysOption4"
                  style={{ marginBottom: 5 }}
                  label="SysOption 4"
                >
                  <Input placeholder="Please input sysoption 4!" />
                </Form.Item>
                <Form.Item
                  name="SysOption5"
                  style={{ marginBottom: 5 }}
                  label="SysOption 5"
                >
                  <Input placeholder="Please input sysoption 5!" />
                </Form.Item>
                <Form.Item
                  name="OrderBy"
                  style={{ marginBottom: 5 }}
                  label="Order By"
                >
                  <Input type="number" />
                </Form.Item>

                <Form.Item
                  name="IsActive"
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

export default HomeScreenAppLayoutDtlCard;
