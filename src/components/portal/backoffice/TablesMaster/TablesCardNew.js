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
  Modal,
  Tooltip,
} from "antd";
import { Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionMaster } from "../../../../services/section-master";
import { InsUpdtTablesMaster } from "../../../../store/actions/tablesmaster";
import TablesMaster from "../../../../models/tablesmaster";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import CardHeader from "../../../common/CardHeader";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  EditOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import swal from "sweetalert";
import SectionMasterCard from "../SectionMaster/SectionMasterCardNew";
import { InsUpdtTableMaster } from "../../../../services/table-master";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const { Option } = Select;

const TablesCardNew = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [sectionData, setSectionData] = useState([]);
  const currentTran = useSelector((state) => state.currentTran);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isShowModal, setIsShowModal] = useState();
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const [isDisable, setIsDisable] = useState({ add: false, edit: false });
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    fetchSectionMaster(CompCode).then((res) => {
      console.log(res, "section data");
      setSectionData(res);
    });
    setIsDisable({
      add: props.formData && props.formData.SecCode ? true : false,
      edit: !props.formData ? true : false,
    });
  }, []);

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    ShortCode: props.formData ? props.formData.ShortCode : "",
    TableName: props.formData ? props.formData.TableName : "",
    SecCode: props.formData ? props.formData.SecCode : null,
    Icon: props.formData ? props.formData.Icon : "",
    SittingCapacity: props.formData ? props.formData.SittingCapacity : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onFinish = (values) => {
    // dispatch(InsUpdtTablesMaster(props.formData ? "U" : "I", val));
    const data = {
      InsUpdtType: props.formData ? "U" : "I",
      ShortCode: values.ShortCode,
      TableName: values.TableName,
      SecCode: values.SecCode,
      Icon: values.Icon,
      SittingCapacity: values.SittingCapacity,
      IsActive: values.IsActive,
      updt_usr: l_loginUser,
    };
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      console.log(val, "ssssssss");
      if (val) {
        InsUpdtTableMaster(CompCode, data).then((res) => {
          console.log(res);
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

  //   useEffect(() => {
  //     if (currentTran.isSuccess) {
  //       form.resetFields();
  //       dispatch(reInitialize());
  //       props.onBackPress();
  //     } else if (currentTran.error) {
  //       toast.error(currentTran.error);
  //     }
  //     setIsLoading(false);
  //   }, [currentTran.error, currentTran.isSuccess]);

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <CardHeader title={currentTran.formTitle} />
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
                    <span style={{ color: "red" }}>*</span> Section Code :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="SecCode"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Section Code"
                        rules={[
                          {
                            required: true,
                            message: "Please select your section code!",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          allowClear={true}
                          style={{ width: "100%" }}
                          optionFilterProp="children"
                          placeholder="Select Section Code"
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
                          {sectionData
                            .filter((i) => i.IsActive === true)
                            .map((h) => {
                              return (
                                <Option key={h.SecCode} value={h.SecCode}>
                                  {h.SecDesc}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                      <Tooltip title="Add New Section">
                        <Button
                          icon={<FileAddOutlined />}
                          style={{ margin: "3px 3px" }}
                          type="primary"
                          size="small"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 56
                            ).Rights.find((i) => i.RightCode === "ADD")
                              .RightVal === "N" || isDisable.add
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "SEC",
                              entryMode: "A",
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Edit this Section">
                        <Button
                          icon={<EditOutlined />}
                          style={{ margin: "3px 3px" }}
                          size="small"
                          type="primary"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 56
                            ).Rights.find((i) => i.RightCode === "EDIT")
                              .RightVal === "N" || isDisable.edit
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "SEC",
                              entryMode: "E",
                              formData: sectionData.find(
                                (i) =>
                                  i.SecCode === form.getFieldValue("SecCode")
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
                    <span style={{ color: "red" }}>*</span> TableShort Code :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="ShortCode"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="TableShort Code :"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter your code!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Please Enter your code!"
                          disabled={props.formData ? true : false}
                          maxLength={10}
                          onInput={(e) => {
                            e.target.value = (
                              "" + e.target.value
                            ).toUpperCase();
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
                    <span style={{ color: "red" }}>*</span> Table Name :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="TableName"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Table Name :"
                        rules={[
                          {
                            required: true,
                            message: "Please Enter Table name!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Please Enter Table name!"
                          maxLength={100}
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
                    Icon :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="Icon"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Icon :"
                      >
                        <Input />
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
                    <span style={{ color: "red" }}>*</span> Sitting Capacity :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="SittingCapacity"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        rules={[
                          {
                            required: true,
                            message: "Please Enter  sitting capacity!",
                          },
                        ]}
                        // label="Sitting Capacity :"
                      >
                        <InputNumber
                          placeholder="Enter sitting capacity"
                          min={0}
                          max={100}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>{" "}
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
                  <SectionMasterCard
                    title="Section Master"
                    onBackPress={() => setIsShowModal()}
                    formData={isShowModal.formData}
                    onSavePress={(val) => {
                      if (val.IsActive) {
                        fetchSectionMaster(CompCode).then((res) => {
                          // console.log("m here");
                          setSectionData(res);
                          form.setFieldsValue({ SecCode: val.SecCode });
                          setIsDisable({
                            ...isDisable,
                            edit: false,
                          });
                        });
                      } else {
                        fetchSectionMaster(CompCode).then((res) => {
                          setSectionData(res);
                          form.setFieldsValue({
                            SecCode: initialValues
                              ? initialValues.SecCode
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
      </Spin>
    </div>
  );
};

export default TablesCardNew;
