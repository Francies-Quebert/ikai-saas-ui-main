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
  Tooltip,
  Modal,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
  PlusOutlined,
  FileAddOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtSubCategoryMaster } from "../../../../store/actions/subCategoryMaster";
import SubCategoryMaster from "../../../../models/subCategoryMaster";
import { getHSNSACmaster } from "../../../../services/hsnsac";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";
import {
  fetchSubCatMasterCard,
  getAddInfoTemplate,
  getSubCategoryMaster,
  InsUpdtSubCategory,
} from "../../../../services/subCategory";
import CategoryMasterCard from "../../Administration/CategoryMaster/CategoryMasterCard";
import swal from "sweetalert";
import _ from "lodash";
import HSNSACMasterCard from "../../Administration/HSNSACmaster/hsnacCardNew";
import ItemAddInfoTmplCard from "../../Administration/ItemAddInfoTemplate/ItemAddInfoCardNew";
import { fetchSequenceNextVal } from "../../../../shared/utility";
import { Avatar } from "antd";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SubCategoryCardNew = (props) => {
  const { TextArea } = Input;
  const { Option } = Select;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [hsnsacMaster, setHSNSACmaster] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState();
  const [addInfoTemplate, setAddInfoTemplate] = useState([]);
  const [isShowModal, setIsShowModal] = useState();
  const [btnDisable, setBtnDisable] = useState({
    cat: !props.formData ? true : false,
    hsnsac: !props.formData ? true : false,
    template: !props.formData ? true : false,
  });
  const [iCode, setICode] = useState(
    props.formData ? props.formData.SubCatCode : null
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );

  //useSelector
  const currentTran = useSelector((state) => state.currentTran);
  const l_LoginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const categoryMaster = useSelector((state) => state.categoryMaster);
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const DefaultUplodConfig = useSelector((state) =>
    state.AppMain.appconfigs.find((up) => up.configCode === "UPLOADS")
  );
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );

  const initialValues = {
    SubCatCode: props.formData ? props.formData.SubCatCode : iCode,
    CatCode: props.formData ? props.formData.CatCode : null,
    SubCatDesc: props.formData ? props.formData.SubCatDesc : "",
    SubCatDetailDesc: props.formData ? props.formData.SubCatDetailDesc : "",
    ImageUrl: props.formData ? props.formData.ImageUrl : null,
    DefHSNSACCode: props.formData ? props.formData.DefHSNSACCode : null,
    InfoTempCode: props.formData ? props.formData.ItemInfoTemplate : null,
    IsActive: props.formData ? props.formData.IsActive : true,
    IsInventory: props.formData ? props.formData.IsInventory : true,
  };

  //useEffects
  useEffect(() => {
    //getHsnsac
    getHSNSACmaster(CompCode).then((res) => {
      setHSNSACmaster([]);
      setHSNSACmaster(res);
    });
    //getAddInfoTemplate
    getAddInfoTemplate(CompCode).then((res) => {
      setAddInfoTemplate([]);
      setAddInfoTemplate(res);
    });

    //generateNextSequence
    if (props.entryMode === "A") {
      fetchSequenceNextVal(CompCode, "SUBCAT", l_LoginUser).then(
        (seqNextVal) => {
          if (seqNextVal.length > 0) {
            form.setFieldsValue({
              SubCatCode: seqNextVal[0].NextVal,
            });
            if (seqNextVal[0].NextVal) {
              setICodeDisable(true);
              setICode(seqNextVal[0].NextVal);
            }
          }
        }
      );
    }
  }, []);

  //useEffect
  useEffect(() => {
    fetchSubCatMasterCard(CompCode, iCode).then((resp) => {
      try {
        if (resp.length > 0) {
          if (props.entryMode === "A") {
            swal(
              "Are you sure you want to edit this item?",
              `This subcategory code: ${iCode} already exist`,
              {
                buttons: ["Cancel", "Yes!"],
              }
            ).then(async (val) => {
              if (val) {
                await mapData(resp);
                setIsLoading(false);
              } else {
                props.onBackPress();
              }
            });
          } else {
            mapData(resp);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  }, [iCode]);

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const onReset = () => {
    form.resetFields();
  };

  const mapData = (data) => {
    data.map(async (i) => {
      await form.setFieldsValue({
        SubCatCode: i.SubCatCode,
        CatCode: i.CatCode,
        SubCatDesc: i.SubCatDesc,
        SubCatDetailDesc: i.SubCatDetailDesc,
        ImageUrl: i.ImageUrl,
        DefHSNSACCode: i.DefHSNSACCode,
        InfoTempCode: i.ItemInfoTemplate,
        IsActive: i.IsActive,
        IsInventory: i.IsInventory,
      });
      setUrl({
        url:
          i.PathType === "C" ? (
            `${FileUploadPath.value1}/${i.ImageUrl}`
          ) : i.PathType === "U" ? (
            `${i.ImageUrl}`
          ) : (
            <UserOutlined />
          ),
        path: i.ImageUrl,
        pathType: i.PathType,
      });
    });
    setICodeDisable(true);
  };

  const onFinish = (values) => {
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((resp) => {
      if (resp) {
        const val = {
          SubCatCode: values.SubCatCode,
          CatCode: values.CatCode,
          SubCatDesc: values.SubCatDesc,
          SubCatDetailDesc: values.SubCatDetailDesc,
          ImageUrl: url ? url.path : null,
          PathType: url ? url.pathType : "C",
          DefHSNSACCode: values.DefHSNSACCode,
          ItemInfoTemplate: values.InfoTempCode ? values.InfoTempCode : null,
          IsActive: values.IsActive,
          IsInventory: values.IsInventory,
          updt_usrId: l_LoginUser,
        };

        InsUpdtSubCategory(CompCode, val).then((res) => {
          if (res.data.message === "successful") {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onBackPress();
            props.onSavePress(values);
          } else if (res.data.message === "unsuccessfull") {
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
  };

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
                form={form}
                initialValues={initialValues}
                name="userbody"
                labelAlign="left"
                {...formItemLayout}
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
                    <span style={{ color: "red" }}>*</span> Sub Category Code :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="SubCatCode"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        rules={[
                          {
                            required: true,
                            message: "Please input your Sub Category Code",
                          },
                        ]}
                      >
                        <Input
                          onBlur={(val) => {
                            if (val.target.value !== "") {
                              setICodeDisable(true);
                              setICode(val.target.value);
                            }
                          }}
                          style={{ textTransform: "uppercase" }}
                          placeholder="Sub Category Code"
                          maxLength={10}
                          disabled={iCodeDisable ? true : false}
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
                    <span style={{ color: "red" }}>*</span> Category :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="CatCode"
                        style={{ marginBottom: 5, flex: 1, width: "85%" }}
                        //   label="Category"
                        wrapperCol={24}
                        rules={[
                          {
                            required: true,
                            message: "Please select your Category Code!",
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          placeholder="Please select your Category Code!"
                          onChange={(val) => {
                            if (val) {
                              setBtnDisable({
                                ...btnDisable,
                                cat: false,
                              });
                            } else {
                              setBtnDisable({
                                ...btnDisable,
                                cat: true,
                              });
                            }
                          }}
                        >
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
                      <Tooltip style={{ width: "5%" }} title="Add New Category">
                        <Button
                          icon={<FileAddOutlined />}
                          style={{ margin: "3px 3px" }}
                          type="primary"
                          size="small"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 41
                            ).Rights.find((i) => i.RightCode === "ADD")
                              .RightVal === "N"
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "CAT",
                              entryMode: "A",
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        style={{ width: "5%" }}
                        title="Edit this Category"
                      >
                        <Button
                          icon={<EditOutlined />}
                          style={{ margin: "3px 3px" }}
                          size="small"
                          type="primary"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 41
                            ).Rights.find((i) => i.RightCode === "EDIT")
                              .RightVal === "N" || btnDisable.cat
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "CAT",
                              entryMode: "E",
                              formData: categoryMaster.categoryMasters.find(
                                (i) =>
                                  i.CatCode === form.getFieldValue("CatCode")
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
                    <span style={{ color: "red" }}>*</span> Sub Category Name :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="SubCatDesc"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Sub Category Name",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Sub Category Name"
                          onChange={(e) => {
                            if (props.entryMode === "A")
                              form.setFieldsValue({
                                SubCatDetailDesc: e.target.value,
                              });
                          }}
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
                    Sub Category Description :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        wrapperCol={24}
                        name="SubCatDetailDesc"
                        style={{ marginBottom: 5, flex: 1 }}
                        // label="Sub Category Description"
                      >
                        <TextArea rows={4} />
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
                    Image Url :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="ImageUrl"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        valuePropName="file"
                        // label="Image Url"
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
                                  `${CompCode}/SubCategoryImages`,
                                  file
                                ).then((res) => {
                                  setUrl(res.url);
                                  setImageLoading(false);
                                });
                              } else {
                                UploadImageOwnWebServer(
                                  `${CompCode}/${"SubCategoryImages"}`,
                                  file
                                ).then((res) => {
                                  setUrl({
                                    url: `${
                                      FileUploadPath.value1
                                    }/${CompCode}/${"SubCategoryImages"}/${
                                      res.fileName
                                    }`,
                                    path: `${CompCode}/${"SubCategoryImages"}/${
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
                            url.url ? (
                              <img
                                src={url.url}
                                style={{ width: "100%", height: "100%" }}
                              />
                            ) : (
                              <Avatar
                                icon={<UserOutlined />}
                                shape="square"
                                size={32}
                              />
                            )
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
                    HSNSAC Code :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        // justify="center"
                        name="DefHSNSACCode"
                        style={{ marginBottom: 5, flex: 1, width: "85%" }}
                        // label="HSNSAC Code"
                        wrapperCol={24}
                      >
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          placeholder="HSNSAC Code"
                          onChange={(val) => {
                            if (val) {
                              setBtnDisable({
                                ...btnDisable,
                                hsnsac: false,
                              });
                            } else {
                              setBtnDisable({
                                ...btnDisable,
                                hsnsac: true,
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
                      <Tooltip style={{ width: "5%" }} title="Add New HSNSAC">
                        <Button
                          icon={<FileAddOutlined />}
                          style={{ margin: "3px 3px" }}
                          type="primary"
                          size="small"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 46
                            ).Rights.find((i) => i.RightCode === "ADD")
                              .RightVal === "N"
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
                      <Tooltip style={{ width: "5%" }} title="Edit this HSNSAC">
                        <Button
                          icon={<EditOutlined />}
                          style={{ margin: "3px 3px" }}
                          size="small"
                          type="primary"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 46
                            ).Rights.find((i) => i.RightCode === "EDIT")
                              .RightVal === "N" || btnDisable.hsnsac
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
                    Info Template Code :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="InfoTempCode"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Info Template Code"
                      >
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          placeholder="Please Select Template"
                          onChange={(val) => {
                            if (val) {
                              setBtnDisable({
                                ...btnDisable,
                                template: false,
                              });
                            } else {
                              setBtnDisable({
                                ...btnDisable,
                                template: true,
                              });
                            }
                          }}
                        >
                          {addInfoTemplate.length > 0 &&
                            addInfoTemplate
                              .filter((i) => i.IsActive)
                              .map((ii) => {
                                return (
                                  <Option
                                    key={ii.TempId}
                                    value={ii.TempId}
                                  >{`${ii.TemplateName}`}</Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                      <Tooltip
                        style={{ width: "5%" }}
                        title="Add New Item Template"
                      >
                        <Button
                          icon={<FileAddOutlined />}
                          style={{ margin: "3px 3px" }}
                          type="primary"
                          size="small"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 52
                            ).Rights.find((i) => i.RightCode === "ADD")
                              .RightVal === "N"
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "ITEM",
                              entryMode: "A",
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        style={{ width: "5%" }}
                        title="Edit this  Item Template"
                      >
                        <Button
                          icon={<EditOutlined />}
                          style={{ margin: "3px 3px" }}
                          size="small"
                          type="primary"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 52
                            ).Rights.find((i) => i.RightCode === "EDIT")
                              .RightVal === "N" || btnDisable.template
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "ITEM",
                              entryMode: "E",
                              formData: addInfoTemplate.find(
                                (i) =>
                                  i.TempId ===
                                  form.getFieldValue("InfoTempCode")
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
                    Maintain Inventory :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="IsInventory"
                        // label="Maintain Inventory"
                        style={{ marginBottom: 5 }}
                        valuePropName="checked"
                      >
                        <Checkbox />
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
                  <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        // justify="center"
                        name="IsActive"
                        wrapperCol={24}
                        // label="Status"
                        style={{ marginBottom: 5 }}
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
              {isShowModal && (
                <Modal
                  visible={isShowModal}
                  onCancel={() => {
                    setIsShowModal();
                  }}
                  footer={null}
                  bodyStyle={{ padding: 0 }}
                  closable={true}
                  width={isShowModal.modalType === "ITEM" ? "90%" : 750}
                  destroyOnClose={true}
                >
                  {isShowModal.modalType === "CAT" && (
                    <CategoryMasterCard
                      title="Category Master"
                      entryMode={isShowModal.entryMode}
                      onBackPress={() => setIsShowModal()}
                      formData={isShowModal.formData}
                      onSavePress={(val) => {
                        if (val.IsActive) {
                          form.setFieldsValue({ CatCode: val.CatCode });
                          setBtnDisable({
                            ...btnDisable,
                            cat: false,
                          });
                        } else {
                          form.setFieldsValue({ CatCode: null });
                          setBtnDisable({
                            ...btnDisable,
                            cat: true,
                          });
                        }
                      }}
                    />
                  )}
                  {isShowModal.modalType === "HSNSAC" && (
                    <HSNSACMasterCard
                      title={"HSNSAC Master"}
                      formData={isShowModal.formData}
                      onBackPress={() => {
                        setIsShowModal();
                      }}
                      onSavePress={async (val) => {
                        if (val.hsnsaccode && val.IsActive) {
                          await getHSNSACmaster(CompCode).then((res) => {
                            setHSNSACmaster(res);
                            form.setFieldsValue({
                              DefHSNSACCode: val.hsnsaccode,
                            });
                            setBtnDisable({
                              ...btnDisable,
                              hsnsac: false,
                            });
                          });
                        } else {
                          getHSNSACmaster(CompCode).then((res) => {
                            setHSNSACmaster(res);
                            form.setFieldsValue({
                              DefHSNSACCode: null,
                            });
                            setBtnDisable({
                              ...btnDisable,
                              hsnsac: true,
                            });
                          });
                        }
                      }}
                    />
                  )}
                  {isShowModal.modalType === "ITEM" && (
                    <ItemAddInfoTmplCard
                      title={"Item Add Info Template"}
                      formData={isShowModal.formData}
                      onBackPress={() => {
                        setIsShowModal();
                      }}
                      onSavePress={(val) => {
                        if (val) {
                          getAddInfoTemplate(CompCode).then((res) => {
                            form.setFieldsValue({
                              InfoTempCode: val.l_templateId,
                            });
                            setAddInfoTemplate(res);
                            setBtnDisable({
                              ...btnDisable,
                              template: false,
                            });
                          });
                        } else {
                          getAddInfoTemplate(CompCode).then((res) => {
                            setAddInfoTemplate(res);
                            form.setFieldsValue({ InfoTempCode: null });
                            setBtnDisable({
                              ...btnDisable,
                              template: true,
                            });
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
      </Spin>
    </div>
  );
};

export default SubCategoryCardNew;
