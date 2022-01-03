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
  Cascader,
  Modal,
  Tooltip,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  FileAddOutlined,
  EditOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
// import { InsUpdtHsnsacMaster } from "../../../../store/actions/hsnsacMaster";
import HSNSACmaster from "../../../../models/hasnsac-master";
import { getTaxMaster } from "../../../../services/taxMaster";
import TaxMasterCard from "../TaxMaster/TaxMasterCard";
import swal from "sweetalert";
import { InsUpdtHsnsacMaster } from "../../../../services/hsnsac";

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

const HsnacCardNew = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const [taxMaster, setTaxMaster] = useState([]);
  const [isShowModal, setIsShowModal] = useState();
  const [isDisable, setIsDisable] = useState({ add: false, edit: false });
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    getTaxMaster(CompCode).then((res) => {
      setTaxMaster([]);
      setTaxMaster(res);
    });
    setIsDisable({
      add: props.formData ? false : false,
      edit: !props.formData ? true : false,
    });
  }, []);

  const initialValues = {
    hsnsaccode: props.formData ? props.formData.hsnsaccode : "",
    hsnsacdesc: props.formData ? props.formData.hsnsacdesc : "",
    DefTaxCode: props.formData ? props.formData.DefTaxCode : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onFinish = (values) => {
    const val = {
      CompCode: CompCode,
      hsnsaccode: values.hsnsaccode,
      hsnsacdesc: values.hsnsacdesc,
      DefTaxCode: values.DefTaxCode,
      IsActive: values.IsActive,
      updt_usrId: l_loginUser,
    };
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((resp) => {
      if (resp) {
        // dispatch(InsUpdtHsnsacMaster(val));
        InsUpdtHsnsacMaster( val).then((res) => {
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
                <Row style={{ margin: "0px 0px 5px 0px" }}>
                  <Col
                    style={{ alignSelf: "center" }}
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={24}
                  >
                    <span style={{ color: "red" }}>*</span> Code :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="hsnsaccode"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Code"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Code",
                          },
                        ]}
                      >
                        <Input
                          maxLength={10}
                          placeholder="Please enter Code"
                          disabled={props.formData ? true : false}
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
                    <span style={{ color: "red" }}>*</span> Description :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="hsnsacdesc"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Description"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your Description!",
                          },
                        ]}
                      >
                        <Input placeholder="Please enter your Description!" />
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
                    Default Tax Code :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        // justify="center"
                        name="DefTaxCode"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Default Tax Code"
                      >
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          placeholder="Please select tax"
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
                          {taxMaster.length > 0 &&
                            taxMaster
                              .filter((ii) => ii.IsActive)
                              .map((ii) => {
                                return (
                                  <Option key={ii.TaxCode} value={ii.TaxCode}>
                                    {ii.TaxName}
                                  </Option>
                                );
                              })}
                        </Select>
                      </Form.Item>
                      <Tooltip title="Add New Tax">
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
                              .RightVal === "N" || isDisable.add
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
                      <Tooltip title="Edit this Tax">
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
                              .RightVal === "N" || isDisable.edit
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "TAX",
                              entryMode: "E",
                              formData: taxMaster.find(
                                (i) =>
                                  i.TaxCode === form.getFieldValue("DefTaxCode")
                              ),
                            });
                          }}
                        />
                      </Tooltip>
                    </div>
                  </Col>
                </Row>
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
                  <TaxMasterCard
                    title="TAX Master"
                    onSavePress={(val) => {
                      if (val.IsActive) {
                        getTaxMaster(CompCode).then(async (res) => {
                          await setTaxMaster(res);
                          form.setFieldsValue({ DefTaxCode: val.TaxCode });
                        });
                      }
                    }}
                    onBackPress={() => setIsShowModal()}
                    formData={isShowModal.formData}
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

export default HsnacCardNew;
