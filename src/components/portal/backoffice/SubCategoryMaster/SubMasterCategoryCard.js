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
  Select,
  Checkbox,
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
import { InsUpdtSubCategoryMaster } from "../../../../store/actions/subCategoryMaster";
import SubCategoryMaster from "../../../../models/subCategoryMaster";
import { getHSNSACmaster } from "../../../../services/hsnsac";
import { UploadImageFirebase } from "../../../../shared/utility";
import { getAddInfoTemplate } from "../../../../services/subCategory";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const { TextArea } = Input;

const SubMasterCategoryCard = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const categoryMaster = useSelector((state) => state.categoryMaster);
  const [form] = Form.useForm();
  const [hsnsacMaster, setHSNSACmaster] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState(props.formData ? props.formData.ImageUrl : "");
  const onReset = () => {
    form.resetFields();
  };
  const [addInfoTemplate, setAddInfoTemplate] = useState([]);

  useEffect(() => {
    getHSNSACmaster().then((res) => {
      setHSNSACmaster([]);
      setHSNSACmaster(res);
    });
    getAddInfoTemplate().then((res) => {
      setAddInfoTemplate([]);
      setAddInfoTemplate(res);
    });
  }, []);

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const initialValues = {
    SubCatCode: props.formData ? props.formData.SubCatCode : "",
    CatCode: props.formData ? props.formData.CatCode : "",
    SubCatDesc: props.formData ? props.formData.SubCatDesc : "",
    SubCatDetailDesc: props.formData ? props.formData.SubCatDetailDesc : "",
    ImageUrl: props.formData ? props.formData.ImageUrl : "",
    DefHSNSACCode: props.formData ? props.formData.DefHSNSACCode : "",
    InfoTempCode: props.formData ? props.formData.ItemInfoTemplate : "",
    IsActive: props.formData ? props.formData.IsActive : true,
    IsInventory: props.formData ? props.formData.IsInventory : true,
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new SubCategoryMaster(
      values.SubCatCode,
      values.CatCode,
      values.SubCatDesc,
      values.SubCatDetailDesc,
      url,
      values.DefHSNSACCode,
      values.InfoTempCode ? values.InfoTempCode : null,
      values.IsActive,
      values.IsInventory
    );
    dispatch(InsUpdtSubCategoryMaster(val));
    props.onSavePress(val.SubCatCode);
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
          <Col span={24}>
            <CardHeader
              title={props.title ? props.title : currentTran.formTitle}
            />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                form={form}
                initialValues={initialValues}
                name="userbody"
                labelAlign="left"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  // justify="center"
                  name="SubCatCode"
                  style={{ marginBottom: 5 }}
                  label="Sub Category Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Sub Category Code",
                    },
                  ]}
                >
                  <Input
                    maxLength={10}
                    disabled={props.formData ? true : false}
                  />
                </Form.Item>
                <Form.Item
                  // justify="center"
                  name="CatCode"
                  style={{ marginBottom: 5 }}
                  label="Category"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Category Code!",
                    },
                  ]}
                >
                  <Select>
                    {categoryMaster.categoryMasters.length > 0 &&
                      categoryMaster.categoryMasters.map((ii) => {
                        return (
                          <Option key={ii.CatCode} value={ii.CatCode}>
                            {ii.CatDesc}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
                <Form.Item
                  // justify="center"
                  name="SubCatDesc"
                  style={{ marginBottom: 5 }}
                  label="Sub Category Name"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  // justify="center"
                  name="SubCatDetailDesc"
                  style={{ marginBottom: 5 }}
                  label="Sub Category Description"
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                  // justify="center"
                  name="ImageUrl"
                  style={{ marginBottom: 5 }}
                  label="Image Url"
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
                        UploadImageFirebase(`SubCategoryImages`, file).then(
                          (res) => {
                            setUrl(res.url);
                            setImageLoading(false);
                          }
                        );
                      });
                    }}
                    listType="picture-card"
                    multiple={false}
                  >
                    {url ? (
                      <img src={url} style={{ width: "100%" }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
                <Form.Item
                  // justify="center"
                  name="DefHSNSACCode"
                  style={{ marginBottom: 5 }}
                  label="HSNSAC Code"
                >
                  <Select allowClear showSearch optionFilterProp="children">
                    {hsnsacMaster.length > 0 &&
                      hsnsacMaster.map((ii) => {
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
                  // justify="center"
                  name="InfoTempCode"
                  style={{ marginBottom: 5 }}
                  label="Info Template Code"
                >
                  <Select allowClear showSearch optionFilterProp="children">
                    {addInfoTemplate.length > 0 &&
                      addInfoTemplate.map((ii) => {
                        return (
                          <Option
                            key={ii.TempId}
                            value={ii.TempId}
                          >{`${ii.TemplateName}`}</Option>
                        );
                      })}
                  </Select>
                </Form.Item>
                <Form.Item
                  // justify="center"
                  name="IsInventory"
                  label="Maintain Inventory"
                  style={{ marginBottom: 5 }}
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
                <Form.Item
                  // justify="center"
                  name="IsActive"
                  label="Status"
                  style={{ marginBottom: 5 }}
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

export default SubMasterCategoryCard;
