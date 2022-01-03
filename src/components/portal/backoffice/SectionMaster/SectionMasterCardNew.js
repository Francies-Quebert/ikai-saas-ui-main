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
  Select,
  Tooltip,
  Modal,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PlusOutlined,
  FileAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  UploadImageFirebase,
  UploadImageOwnWebServer,
} from "../../../../shared/utility";
import { fetchDeptMaster } from "../../../../store/actions/deptmaster";
import {
  InsUpdtSectionMaster,
  fetchSectionMaster,
  InsUpdtSecMaster,
} from "../../../../services/section-master";
import swal from "sweetalert";
import BranchMasterCard from "../../Administration/BranchMaster/BranchMasterCardNew";
import { fetchBranchMasterData } from "../../../../services/branch-master";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const { Option } = Select;

const SectionMasterCardNew = (props) => {
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState();
  const [branch, setBranch] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState(props.formData ? props.formData.ImageURL : "");
  // const branch = useSelector((state) => state.branchMaster.branchMaster);
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const currentTran = useSelector((state) => state.currentTran);
  const [isDisable, setIsDisable] = useState({ add: false, edit: false });
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setUrl({
      url: props.formData
        ? props.formData.pathType === "C"
          ? `${FileUploadPath.value1}/${props.formData.ImageURL}`
          : props.formData.ImageURL
        : null,
      path: props.formData ? `${props.formData.ImageURL}` : null,
      pathType: props.formData ? props.formData.pathType : null,
    });
    fetchBranchMasterData(CompCode).then((res) => {
      setBranch(res);
      setIsDisable({
        add: props.formData && props.formData.BranchCode ? true : false,
        edit: !props.formData ? true : false,
      });
    });
  }, []);

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
    SecCode: props.formData ? props.formData.SecCode : "",
    BranchCode: props.formData ? props.formData.BranchCode : null,
    SecDesc: props.formData ? props.formData.SecDesc : "",
    ImageURL: props.formData
      ? props.formData.pathType === "C"
        ? `${FileUploadPath.value1}/${props.formData.ImageURL}`
        : props.formData.ImageURL
      : null,
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    // setIsLoading(true);
    // const val = new SectionMaster(
    //   values.SecCode,
    //   values.BranchCode,
    //   values.SecDesc,
    //   url,
    //   values.IsActive === true ? true : false
    // );
    // // console.log(val);
    // dispatch(InsUpdtSectionMaster(val));
    const data = {
      SecCode: values.SecCode,
      BranchCode: values.BranchCode,
      SecDesc: values.SecDesc,
      ImageURL: url ? url.path : null,
      pathType: url ? url.pathType : null,
      IsActive: values.IsActive,
      updt_usr: l_loginUser,
    };
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtSecMaster(CompCode, data).then((res) => {
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
  };

  return (
    <div>
      <CardHeader title={props.title ? props.title : currentTran.formTitle} />
      <Row>
        <Col flex={1}>
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
                  <span style={{ color: "red" }}>*</span> Branch Code :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="BranchCode"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="Section Code"
                      rules={[
                        {
                          required: true,
                          message: "Please select your branch code!",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        allowClear={true}
                        style={{ width: "100%" }}
                        optionFilterProp="children"
                        placeholder="Select Branch Code"
                        disabled={props.formData}
                        onChange={(val) => {
                          if (val) {
                            setIsDisable({
                              ...isDisable,
                              add: false,
                              edit: false,
                            });
                          } else {
                            setIsDisable({
                              ...isDisable,
                              add: false,
                              edit: true,
                            });
                          }
                        }}
                      >
                        {branch &&
                          branch
                            .filter((i) => i.IsActive === true)
                            .map((h) => {
                              return (
                                <Option key={h.BranchCode} value={h.BranchCode}>
                                  {h.BranchName}
                                </Option>
                              );
                            })}
                      </Select>
                    </Form.Item>
                    <Tooltip title="Add New Branch">
                      <Button
                        icon={<FileAddOutlined />}
                        style={{ margin: "3px 3px" }}
                        type="primary"
                        size="small"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 51).Rights.find(
                            (i) => i.RightCode === "ADD"
                          ).RightVal === "N" || isDisable.add
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "BRNCH",
                            entryMode: "A",
                          });
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Edit this Branch">
                      <Button
                        icon={<EditOutlined />}
                        style={{ margin: "3px 3px" }}
                        size="small"
                        type="primary"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 51).Rights.find(
                            (i) => i.RightCode === "EDIT"
                          ).RightVal === "N" || isDisable.edit
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "BRNCH",
                            entryMode: "E",
                            formData: branch.find(
                              (i) =>
                                i.BranchCode ===
                                form.getFieldValue("BranchCode")
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
                  <span style={{ color: "red" }}>*</span> Section Code :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="SecCode"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="TableShort Code :"
                      rules={[
                        {
                          required: true,
                          message: "Please input your section code!",
                        },
                      ]}
                    >
                      <Input
                        disabled={props.formData ? true : false}
                        onInput={(e) => {
                          e.target.value = ("" + e.target.value).toUpperCase();
                        }}
                        placeholder="Please input section code!"
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
                  Section Description :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="SecDesc"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // label="Table Name :"
                    >
                      <Input placeholder="Please input section description!" />
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
                  Section Image :
                </Col>
                <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                  <div style={{ display: "flex" }}>
                    <Form.Item
                      name="ImageURL"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      valuePropName="upload"
                      // label="Table Name :"
                    >
                      {" "}
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
                                `${CompCode}/Section-Images`,
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
                                `${CompCode}/${"Section-Images"}/`,
                                file
                              ).then((res) => {
                                setUrl({
                                  url: `${
                                    FileUploadPath.value1
                                  }/${CompCode}/${"Section-Images"}/${
                                    res.fileName
                                  }`,
                                  path: `${CompCode}/${"Section-Images"}/${
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
                      // label="Status :"
                      style={{ marginBottom: 5, flex: 1 }}
                      wrapperCol={24}
                      // rules={[{ required: true, message: "Please select Status!" }]}
                    >
                      <Radio.Group>
                        <Radio value={true}>Active</Radio>
                        <Radio value={false}>InActive</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
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
                  onClick={props.onBackPress}
                >
                  Back
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
                <BranchMasterCard
                  title="Branch Master"
                  onBackPress={() => setIsShowModal()}
                  formData={isShowModal.formData}
                  onSavePress={(val) => {
                    if (val.IsActive) {
                      fetchBranchMasterData(CompCode).then((res) => {
                        setBranch(res);
                        form.setFieldsValue({ BranchCode: val.BranchCode });
                        setIsDisable({
                          ...isDisable,
                          edit: false,
                        });
                      });
                    } else {
                      fetchBranchMasterData(CompCode).then((res) => {
                        setBranch(res);
                        form.setFieldsValue({
                          BranchCode: props.formData
                            ? props.formData.BranchCode
                            : null,
                        });
                        setIsDisable({
                          ...isDisable,
                          edit: true,
                        });
                      });
                    }
                  }}
                />
              </Modal>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SectionMasterCardNew;
