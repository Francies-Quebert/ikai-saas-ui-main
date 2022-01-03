import React, { useState, useEffect } from "react";
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
  InputNumber,
  Upload,
  message,
  Tooltip,
  Modal,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { reInitialize } from "../../../../store/actions/currentTran";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  RetweetOutlined,
  PrinterOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";
// import { InsUpdtMenuCategoryMaster } from "../../../../store/actions/menucategorymaster";
import MenuCategoryMaster from "../../../../models/menucategorymaster";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getHSNSACmaster } from "../../../../services/hsnsac";
import { getTaxMaster } from "../../../../services/taxMaster";
import { InsUpdtMenuCategory } from "../../../../services/menu-category-master";
import swal from "sweetalert";
import HSNSACMasterCard from "../../Administration/HSNSACmaster/hsnacCardNew";
import TaxMasterCard from "../../Administration/TaxMaster/TaxMasterCard";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const { TextArea } = Input;

const MenuCategoryMasterCard = (props) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState();
  const [hsnsacMaster, setHSNSACmaster] = useState([]);
  const [taxMaster, setTaxMaster] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const UpdtUsr = useSelector((state) => state.LoginReducer.userData.username);
  const [btnDisable, setBtnDisable] = useState({
    hsnsac: !props.formData ? true : false,
    tax: !props.formData ? true : false,
  });
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [isShowModal, setIsShowModal] = useState();
  const UserAccess = useSelector((state) => state.AppMain.userAccess);

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
    MenuCatCode: props.formData ? props.formData.MenuCatCode : "",
    MenuCatName: props.formData ? props.formData.MenuCatName : "",
    MenuCatDesc: props.formData ? props.formData.MenuCatDesc : "",
    ImageURL: props.formData ? props.formData.ImageURL : "",
    DefHSNSACCode: props.formData ? props.formData.DefHSNSACCode : "",
    IsActive: props.formData ? props.formData.IsActive : true,
    TaxCode: props.formData ? props.formData.TaxCode : "",
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    setUrl({
      url: props.formData ? props.formData.ImageURL : null,
      path: props.formData ? `${props.formData.ImageURL}` : null,
      pathType: props.formData ? props.formData.pathType : null,
    });
    getHSNSACmaster(CompCode).then((res) => {
      setHSNSACmaster([]);
      setHSNSACmaster(res);
    });
    getTaxMaster(CompCode).then((res) => {
      setTaxMaster([]);
      setTaxMaster(res);
    });
  }, []);

  const onFinish = (values) => {
    // setIsLoading(true);
    const val = {
      InsUpdtType: props.formData ? "U" : "I",
      MenuCatCode: values.MenuCatCode,
      MenuCatName: values.MenuCatName,
      MenuCatDesc: values.MenuCatDesc,
      ImageURL: url ? url.path : null,
      pathType: url ? url.pathType : null,
      DefHSNSACCode: values.DefHSNSACCode,
      IsActive: values.IsActive,
      TaxCode: values.TaxCode,
      updt_usrId: UpdtUsr,
    };

    console.log(val, "finaldata");

    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((resp) => {
      if (resp) {
        InsUpdtMenuCategory(CompCode, val).then((res) => {
          if (res.data.message === "successful") {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress(values);
            props.onBackPress();
          } else if (res.data.message === "unsuccessful") {
            swal(
              `${
                res.data.data.code === "ER_DUP_ENTRY"
                  ? "Duplicate Entry"
                  : "Something Went Wrong Try Again Later...."
              }`,
              {
                icon: "error",
              }
            );
          }
        });
      }
    });

    // dispatch(InsUpdtMenuCategoryMaster(props.formData ? "U" : "I", val));
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
    <>
      <Row>
        <Col span={24}>
          <CardHeader
            title={props.title ? props.title : currentTran.formTitle}
          />
          <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
            <Form
              labelAlign="left"
              name="userbody"
              {...formItemLayout}
              initialValues={initialValues}
              form={form}
              onFinish={onFinish}
            >
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> Menu Category Code :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="MenuCatCode"
                      style={{
                        marginBottom: 5,
                        flex: 1,
                      }}
                      // label="Menu Category Code"
                      wrapperCol={24}
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Code",
                        },
                      ]}
                    >
                      <Input
                        maxLength={10}
                        placeholder="Please Enter Code"
                        style={{ textTransform: "uppercase" }}
                        disabled={props.formData ? true : false}
                        style={{ textTransform: "uppercase" }}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> Menu Category Name :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="MenuCatName"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="Menu Category Name"
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Menu Category Name",
                        },
                      ]}
                    >
                      <Input placeholder="Please Enter Menu Category Name" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  <span style={{ color: "red" }}>*</span> Menu Category
                  Description :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="MenuCatDesc"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="Menu Category Description :"
                    >
                      <TextArea
                        rows={4}
                        placeholder="Please Enter Menu Category Description"
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  HSNSAC Code :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="DefHSNSACCode"
                      style={{ marginBottom: 5, flex: 1, width: "85%" }}
                      wrapperCol={24}
                      // label="HSNSAC Code"
                    >
                      <Select
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        placeholder="Please Select HSN SAC"
                        onChange={(val) => {
                          if (val) {
                            form.setFieldsValue({
                              TaxCode: hsnsacMaster.filter(
                                (i) => i.hsnsaccode === val
                              )[0].DefTaxCode,
                            });
                            setBtnDisable({
                              ...btnDisable,
                              hsnsac: false,
                              tax: false,
                            });
                          } else {
                            form.setFieldsValue({
                              TaxCode: null,
                            });
                            setBtnDisable({
                              ...btnDisable,
                              hsnsac: true,
                              tax: true,
                            });
                          }
                        }}
                      >
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
                    <Tooltip title="Add New HSNSAC" style={{ width: "5%" }}>
                      <Button
                        icon={<FileAddOutlined />}
                        style={{ margin: "3px 3px" }}
                        type="primary"
                        size="small"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 46).Rights.find(
                            (i) => i.RightCode === "ADD"
                          ).RightVal === "N"
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "HSNSAC",
                            entryMode: "A",
                          });
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Edit this HSNSAC" style={{ width: "5%" }}>
                      <Button
                        icon={<EditOutlined />}
                        style={{ margin: "3px 3px" }}
                        size="small"
                        type="primary"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 46).Rights.find(
                            (i) => i.RightCode === "EDIT"
                          ).RightVal === "N" || btnDisable.hsnsac
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "HSNSAC",
                            entryMode: "E",
                            formData: hsnsacMaster.find(
                              (i) =>
                                i.hsnsaccode ===
                                form.getFieldValue("DefHSNSACCode")
                            ),
                          });
                        }}
                      />
                    </Tooltip>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Default Tax Code :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="TaxCode"
                      style={{ marginBottom: 5, flex: 1, width: "85%" }}
                      // label="Default Tax Code"
                      wrapperCol={24}
                    >
                      <Select
                        allowClear
                        placeholder="Please Select Tax"
                        showSearch
                        optionFilterProp="children"
                        onChange={(val) => {
                          if (val) {
                            setBtnDisable({
                              ...btnDisable,
                              tax: false,
                            });
                          } else {
                            setBtnDisable({
                              ...btnDisable,
                              tax: true,
                            });
                          }
                        }}
                      >
                        {taxMaster.length > 0 &&
                          taxMaster
                            .filter(
                              (i) => i.IsActive === true
                              // i.TaxCode === HSNSACCodeTax
                            )
                            .map((ii) => {
                              return (
                                <Option key={ii.TaxCode} value={ii.TaxCode}>
                                  {ii.TaxName}
                                </Option>
                              );
                            })}
                      </Select>
                    </Form.Item>
                    <Tooltip title="Add New TAX" style={{ width: "5%" }}>
                      <Button
                        icon={<FileAddOutlined />}
                        style={{ margin: "3px 3px" }}
                        type="primary"
                        size="small"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 43).Rights.find(
                            (i) => i.RightCode === "ADD"
                          ).RightVal === "N"
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "TAX",
                            entryMode: "A",
                          });
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Edit this TAX" style={{ width: "5%" }}>
                      <Button
                        icon={<EditOutlined />}
                        style={{ margin: "3px 3px" }}
                        size="small"
                        type="primary"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 43).Rights.find(
                            (i) => i.RightCode === "EDIT"
                          ).RightVal === "N" || btnDisable.tax
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "TAX",
                            entryMode: "E",
                            formData: taxMaster.find(
                              (i) => i.TaxCode === form.getFieldValue("TaxCode")
                            ),
                          });
                        }}
                      />
                    </Tooltip>
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Image Url :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="ImageURL"
                      wrapperCol={24}
                      style={{ marginBottom: 5, flex: 1 }}
                      // label="Image Url"
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
                                `${CompCode}/MenuCategory`,
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
                                `${CompCode}/${"MenuCategory"}/`,
                                file
                              ).then((res) => {
                                setUrl({
                                  url: `${
                                    FileUploadPath.value1
                                  }/${CompCode}/${"MenuCategory"}/${
                                    res.fileName
                                  }`,
                                  path: `${CompCode}/${"MenuCategory"}/${
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
                  </div>
                </Col>
              </Row>
              <Row style={{ margin: "0px 0px 5px 0px" }}>
                <Col
                  style={{ alignSelf: "center" }}
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={24}
                >
                  Status :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="IsActive"
                      // label="Status"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                    >
                      <Radio.Group>
                        <Radio value={true}>Active</Radio>
                        <Radio value={false}>InActive</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
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
                >
                  Print
                </Button>
              </Form.Item>
            </Form>
            {isShowModal && (
              <Modal
                visible={isShowModal}
                onCancel={() => {
                  setIsShowModal();
                }}
                footer={null}
                bodyStyle={{ padding: 0 }}
                closable={true}
                width={750}
                destroyOnClose={true}
              >
                {isShowModal.modalType === "HSNSAC" && (
                  <HSNSACMasterCard
                    title={"HSNSAC Master"}
                    formData={isShowModal.formData}
                    onBackPress={() => {
                      setIsShowModal();
                    }}
                    onSavePress={(val) => {
                      if (val.IsActive) {
                        getHSNSACmaster(CompCode).then(async (res) => {
                          if (res) {
                            setHSNSACmaster(res);
                            form.setFieldsValue({
                              DefHSNSACCode: val.hsnsaccode,
                              TaxCode: res.filter(
                                (i) => i.hsnsaccode === val.hsnsaccode
                              )[0].DefTaxCode,
                            });
                            setBtnDisable({
                              ...btnDisable,
                              hsnsac: false,
                              tax: false,
                            });
                          }
                        });
                      } else {
                        getHSNSACmaster(CompCode).then((res) => {
                          if (res) {
                            setHSNSACmaster(res);
                            form.setFieldsValue({
                              DefHSNSACCode: null,
                              TaxCode: null,
                            });
                            setBtnDisable({
                              ...btnDisable,
                              hsnsac: true,
                            });
                          }
                        });
                      }
                    }}
                  />
                )}
                {isShowModal.modalType === "TAX" && (
                  <TaxMasterCard
                    title={"Tax Master"}
                    formData={isShowModal.formData}
                    onBackPress={() => {
                      setIsShowModal();
                    }}
                    onSavePress={(val) => {
                      if (val.IsActive) {
                        getTaxMaster(CompCode).then((res) => {
                          if (res) {
                            setTaxMaster(res);
                            form.setFieldsValue({
                              TaxCode: val.TaxCode,
                            });
                          }
                        });
                      } else {
                        getTaxMaster(CompCode).then((res) => {
                          if (res) {
                            setTaxMaster(res);
                            form.setFieldsValue({
                              TaxCode: null,
                            });
                            setBtnDisable({ ...btnDisable, tax: true });
                          }
                        });
                      }
                    }}
                  />
                )}
              </Modal>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default MenuCategoryMasterCard;
