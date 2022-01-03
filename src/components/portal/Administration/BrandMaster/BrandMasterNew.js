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
  Checkbox,
  Spin,
  Modal,
  Tooltip,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  EditOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import BrandMaster from "../../../../models/brandmaster";
// import { InsUpdtBrandMaster } from "../../../../store/actions/brandmaster";
import swal from "sweetalert";
import ManufacturerCard from "../ManufactureMaster/ManufacturerMasterCard";
import {
  fetchBrandMasterCard,
  getManufacturerData,
  InsUpdtBrandMaster,
} from "../../../../services/brand-master";
import { fetchManufacturerMasters } from "../../../../store/actions/manufactureMaster";
import { fetchSequenceNextVal } from "../../../../shared/utility";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const BrandMasterCard = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // const manufacturer = useSelector((state) => state.manufacturermaster);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [isDisable, setIsDisable] = useState({ add: false, edit: false });
  const [isShowModal, setIsShowModal] = useState();
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [mfrData, setMfrData] = useState([]);
  const [iCode, setICode] = useState(
    props.formData ? props.formData.BrandCode : null
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );

  useEffect(() => {
    getManufacturerData(CompCode).then((res) => {
      setMfrData(res);
    });
    setIsDisable({
      add: props.formData ? true : false,
      edit: !props.formData ? true : false,
    });

    //generateNextSequence
    if (props.entryMode === "A") {
      fetchSequenceNextVal(CompCode, "BRAND", l_loginUser).then(
        (seqNextVal) => {
          if (seqNextVal.length > 0) {
            form.setFieldsValue({
              BrandCode: seqNextVal[0].NextVal,
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

  const initialValues = {
    MfrCode: props.formData ? props.formData.MfrCode : "",
    BrandCode: props.formData ? props.formData.BrandCode : "",
    BrandDesc: props.formData ? props.formData.BrandDesc : "",
    IsDefault: props.formData ? props.formData.IsDefault : true,
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    const data = {
      MfrCode: values.MfrCode,
      BrandCode: values.BrandCode,
      BrandDesc: values.BrandDesc,
      IsDefault: values.IsDefault,
      IsActive: values.IsActive,
      updt_usrId: l_loginUser,
    };

    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtBrandMaster(CompCode, data).then((res) => {
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

  const mapData = (data) => {
    data.map(async (i) => {
      await form.setFieldsValue({
        MfrCode: i.MfrCode,
        BrandCode: i.BrandCode,
        BrandDesc: i.BrandDesc,
        IsDefault: i.IsDefault,
        IsActive: i.IsActive,
      });
    });
    setICodeDisable(true);
  };

  useEffect(() => {
    fetchBrandMasterCard(CompCode, iCode).then((resp) => {
      // console.log(resp,"saura")
      try {
        if (resp.length > 0) {
          if (props.entryMode === "A") {
            swal(
              "Are you sure you want to edit this item?",
              `This brand code: ${iCode} already exist`,
              {
                buttons: ["Cancel", "Yes!"],
              }
            ).then(async (val) => {
              if (val) {
                console.log(val,"saurav")
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
                    <span style={{ color: "red" }}>*</span> Manufacturer :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="MfrCode"
                        style={{ marginBottom: 5, flex: 1 }}
                        // label="Manufacturer"
                        wrapperCol={24}
                        rules={[
                          {
                            required: true,
                            message: "Please select your Manufacturer !",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Please select your Manufacturer !"
                          disabled={props.formData ? true : false}
                          showSearch
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
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.children
                              .toLowerCase()
                              .localeCompare(optionB.children.toLowerCase())
                          }
                          allowClear
                        >
                          {mfrData.map((ii) => {
                            return (
                              <Option key={ii.MfrCode} value={ii.MfrCode}>
                                {ii.MfrDesc}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      <Tooltip title="Add New Manufacturer">
                        <Button
                          icon={<FileAddOutlined />}
                          style={{ margin: "3px 3px" }}
                          type="primary"
                          size="small"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 44
                            ).Rights.find((i) => i.RightCode === "ADD")
                              .RightVal === "N" || isDisable.add
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "MFR",
                              entryMode: "A",
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Edit this Manufacturer">
                        <Button
                          icon={<EditOutlined />}
                          style={{ margin: "3px 3px" }}
                          size="small"
                          type="primary"
                          shape="circle"
                          disabled={
                            UserAccess.find(
                              (i) => i.ModuleId === 44
                            ).Rights.find((i) => i.RightCode === "EDIT")
                              .RightVal === "N" || isDisable.edit
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsShowModal({
                              modalType: "MFR",
                              entryMode: "E",
                              formData: mfrData.find(
                                (i) =>
                                  i.MfrCode === form.getFieldValue("MfrCode")
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
                    <span style={{ color: "red" }}>*</span> Brand Code :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="BrandCode"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Brand Code"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Brand Code",
                          },
                        ]}
                      >
                        <Input
                          style={{ textTransform: "uppercase" }}
                          placeholder="Brand Code"
                          disabled={iCodeDisable ? true : false}
                          maxLength={10}
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
                    <span style={{ color: "red" }}>*</span> Brand Description :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="BrandDesc"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Brand Description"
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
                    <span style={{ color: "red" }}>*</span> Default :
                  </Col>
                  <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                    <div style={{ display: "flex" }}>
                      <Form.Item
                        name="IsDefault"
                        style={{ marginBottom: 5, flex: 1 }}
                        wrapperCol={24}
                        // label="Default Brand"
                        valuePropName="checked"
                      >
                        <Checkbox
                        // onChange={(e) => {
                        //   setIsDefault(e.target.checked);
                        // }}
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
                    <span style={{ color: "red" }}>*</span> Status :
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
              </Form>{" "}
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
                  <ManufacturerCard
                    title="Manufacturer Master"
                    entryMode={isShowModal.entryMode}
                    onBackPress={() => setIsShowModal()}
                    formData={isShowModal.formData}
                    onSavePress={(val) => {
                      if (val.IsActive) {
                        getManufacturerData(CompCode).then((res) => {
                          setMfrData(res);
                          form.setFieldsValue({ MfrCode: val.MfrCode });
                          setIsDisable({ ...isDisable, edit: false });
                        });
                      } else {
                        getManufacturerData(CompCode).then((res) => {
                          setMfrData(res);
                          form.setFieldsValue({ MfrCode: null });
                          setIsDisable({ ...isDisable, edit: true });
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

export default BrandMasterCard;
