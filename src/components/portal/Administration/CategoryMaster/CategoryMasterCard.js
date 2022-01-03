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
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  fetchSequenceNextVal,
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtCategoryMaster } from "../../../../store/actions/categoryMaster";
import CategoryMaster from "../../../../models/categorymaster";
import { fetchCatMasterCard } from "../../../../services/category-master";
import Swal from "sweetalert2";
import swal from "sweetalert";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const CategoryMasterCard = (props) => {
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState();
  const [iCode, setICode] = useState(
    props.formData ? props.formData.CatCode : null
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const l_LoginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [mode, setmode] = useState();

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
    CatCode: props.formData ? props.formData.CatCode : iCode,
    CatDesc: props.formData ? props.formData.CatDesc : "",
    CatDetailDesc: props.formData ? props.formData.CatDetailDesc : "",
    ImageUrl: props.formData
      ? props.formData.pathType === "C"
        ? `${FileUploadPath.value1}/${props.formData.ImageUrl}`
        : props.formData.ImageUrl
      : null,
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new CategoryMaster(
      values.CatCode,
      values.CatDesc,
      values.CatDetailDesc,
      url ? url.path : null,
      url ? url.pathType : "C",
      values.IsActive
    );
    dispatch(InsUpdtCategoryMaster(mode === "U" ? "U" : "I", val));
    props.onSavePress(values);
  };

  useEffect(() => {
    setUrl({
      url: props.formData
        ? props.formData.pathType === "C"
          ? `${FileUploadPath.value1}/${props.formData.ImageUrl}`
          : props.formData.ImageUrl
        : null,
      path: props.formData ? `${props.formData.ImageUrl}` : null,
      pathType: props.formData ? props.formData.pathType : "U",
    });

    if (props.entryMode === "A") {
      fetchSequenceNextVal(CompCode, "CAT", l_LoginUser).then((seqNextVal) => {
        if (seqNextVal.length > 0) {
          form.setFieldsValue({
            CatCode: seqNextVal[0].NextVal,
          });
          if (seqNextVal[0].NextVal) {
            setICode(seqNextVal[0].NextVal);
            setICodeDisable(true);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    fetchCatMasterCard(CompCode, iCode).then((resp) => {
      try {
        if (resp.length > 0) {
          if (props.entryMode === "A") {
            swal(
              "Are you sure you want to edit this item?",
              `This category code: ${iCode} already exist`,
              {
                buttons: ["Cancel", "Yes!"],
              }
            ).then(async (val) => {
              if (val) {
                await mapData(resp);
                setIsLoading(false);
                setmode("U");
              } else {
                props.onBackPress();
              }
            });
          } else {
            mapData(resp);
            setmode("U");
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  }, [iCode]);

  const mapData = (data) => {
    data.map(async (i) => {
      await form.setFieldsValue({
        CatCode: i.CatCode,
        CatDesc: i.CatDesc,
        CatDetailDesc: i.CatDetailDesc,
        ImageUrl: i.ImageUrl,
        IsActive: i.IsActive,
        pathType: i.pathType,
      });
      setUrl({
        url:
          i.pathType === "C" ? (
            `${FileUploadPath.value1}/${i.ImageUrl}`
          ) : (
            <UserOutlined />
          ),
        path: i.ImageUrl,
        pathType: i.pathType,
      });
    });
    setICodeDisable(true);
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
          <Col flex={1}>
            <CardHeader
              title={props.title ? props.title : currentTran.formTitle}
            />
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
                  name="CatCode"
                  style={{ marginBottom: 5 }}
                  label="Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your category code!",
                    },
                  ]}
                >
                  <Input
                    // disabled={catCode ? true : false}
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                    placeholder="Category Code"
                    maxLength={10}
                    disabled={iCodeDisable ? true : false}
                    onBlur={(val) => {
                      if (val.target.value !== "") {
                        setICode(val.target.value);
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="CatDesc"
                  style={{ marginBottom: 5 }}
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your category name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Category Name"
                    onChange={(e) => {
                      if (props.entryMode === "A")
                        form.setFieldsValue({
                          CatDetailDesc: e.target.value,
                        });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="CatDetailDesc"
                  style={{ marginBottom: 5 }}
                  label="Description Detail"
                >
                  <TextArea rows={4} placeholder="Category Description" />
                </Form.Item>
                <Form.Item
                  name="ImageUrl"
                  style={{ marginBottom: 5 }}
                  label="Image Url"
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
                            `${CompCode}/CategoryImages`,
                            file
                          ).then((res) => {
                            setUrl(res.url);
                            setImageLoading(false);
                          });
                        } else {
                          UploadImageOwnWebServer(
                            `${CompCode}/${"CategoryImages"}/`,
                            file
                          ).then((res) => {
                            setUrl({
                              url: `${
                                FileUploadPath.value1
                                // `http://192.168.0.114:3010`
                              }/${CompCode}/${"CategoryImages"}/${
                                res.fileName
                              }`,
                              path: `${CompCode}/${"CategoryImages"}/${
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
                      <img
                        src={url.url}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
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

export default CategoryMasterCard;
