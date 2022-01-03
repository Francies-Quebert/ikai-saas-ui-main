import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Select,
  Input,
  InputNumber,
  Radio,
  Button,
  Divider,
  Tooltip,
  Modal,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import { fetchSectionMaster } from "../../../../../services/section-master";
import { InsUpdtTableMaster } from "../../../../../services/table-master";
import CardHeader from "../../../../common/CardHeader";
import Icon, {
  EditOutlined,
  FileAddOutlined,
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import SectionMasterCardNew from "../../SectionMaster/SectionMasterCardNew";
import swal from "sweetalert";

const TableMasterNewCard = (props) => {
  const initialValues = {
    ShortCode: props.formData ? props.formData.ShortCode : null,
    TableName: props.formData ? props.formData.TableName : null,
    SecCode: props.formData ? props.formData.SecCode : null,
    Icon: props.formData ? props.formData.Icon : null,
    SittingCapacity: props.formData ? props.formData.SittingCapacity : null,
    IsActive: props.formData ? props.formData.IsActive : true,
  };
  //useStates
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [sectionData, setSectionData] = useState([]);
  const [btnDisable, setBtnDisable] = useState({
    secCode: !props.formData ? true : false,
  });
  const [btnLoading, setBtnLoading] = useState(false);

  //useSelectors
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const currTran = useSelector((state) => state.currentTran);
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const [isShowModal, setIsShowModal] = useState();

  //useEffect
  useEffect(() => {
    setIsLoading(true);
    fetchSectionMaster(CompCode).then((res) => {
      setSectionData(res);
      setIsLoading(false);
    });
  }, []);

  const onReset = () => {
    setFormData(initialValues);
  };
  const onSubmit = () => {
    setBtnLoading(true);
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      const TTdata = {
        InsUpdtType: props.formData ? "U" : "I",
        ShortCode: formData.ShortCode,
        TableName: formData.TableName,
        SecCode: formData.SecCode,
        Icon: formData.Icon,
        SittingCapacity: formData.SittingCapacity,
        IsActive: formData.IsActive,
        updt_usr: l_loginUser,
        CompCode: CompCode,
      };
      // console.log(TTdata, "sss");
      setBtnLoading(false);
      if (val) {
        InsUpdtTableMaster(CompCode, TTdata)
          .then((res) => {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress();
            props.onBackPress();
          })
          .catch((err) => {
            swal("Something went wrong   !!!", {
              icon: "error",
            });
          })
          .finally(() => {
            setBtnLoading(false);
          });
      }
    });
  };

  return (
    <>
      <Row>
        <Col flex={0.5}>
          <CardHeader title={currTran.formTitle} />
          <Card
            bordered={true}
            bodyStyle={{ paddingBottom: 5 }}
            loading={isLoading}
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
                  <Row style={{ marginBottom: 5, flex: 1 }}>
                    <Select
                      value={formData.SecCode}
                      showSearch
                      allowClear={true}
                      style={{ width: "100%" }}
                      placeholder="Select Section Code"
                      disabled={props.formData}
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
                      onChange={(value) => {
                        setFormData({ ...formData, SecCode: value });
                        if (value) {
                          setBtnDisable({
                            secCode: false,
                          });
                        } else {
                          setBtnDisable({
                            secCode: true,
                          });
                        }
                      }}
                    >
                      {sectionData.map((h) => {
                        return (
                          <Select.Option key={h.SecCode} value={h.SecCode}>
                            {h.SecDesc}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Row>
                  <Row>
                    <Tooltip style={{ width: "5%" }} title="Add New Section">
                      <Button
                        icon={<FileAddOutlined />}
                        style={{ margin: "3px 3px" }}
                        type="primary"
                        size="small"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 45).Rights.find(
                            (i) => i.RightCode === "ADD"
                          ).RightVal === "N"
                            ? true
                            : false
                        }
                        disabled={formData.SecCode !== null}
                        onClick={() => {
                          setIsShowModal({
                            modalType: "SEC",
                            entryMode: "A",
                          });
                        }}
                      />
                    </Tooltip>
                    <Tooltip style={{ width: "5%" }} title="Edit this Section">
                      <Button
                        icon={<EditOutlined />}
                        style={{ margin: "3px 3px" }}
                        size="small"
                        type="primary"
                        shape="circle"
                        disabled={
                          UserAccess.find((i) => i.ModuleId === 45).Rights.find(
                            (i) => i.RightCode === "EDIT"
                          ).RightVal === "N" || btnDisable.secCode
                            ? true
                            : false
                        }
                        onClick={() => {
                          setIsShowModal({
                            modalType: "SEC",
                            entryMode: "E",
                            formData: sectionData.find(
                              (i) => i.SecCode === formData.SecCode
                            ),
                          });
                        }}
                      />
                    </Tooltip>
                  </Row>
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
                <span style={{ color: "red" }}>*</span> Table Code :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Input
                  value={formData.ShortCode}
                  disabled={props.formData ? true : false}
                  placeholder="Please Enter Code"
                  maxLength={10}
                  onInput={(e) => {
                    e.target.value = ("" + e.target.value).toUpperCase();
                  }}
                  onChange={(e) =>
                    setFormData({ ...formData, ShortCode: e.target.value })
                  }
                />
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
                <Input
                  value={formData.TableName}
                  placeholder="Please Enter Table Code"
                  maxLength={100}
                  onChange={(e) =>
                    setFormData({ ...formData, TableName: e.target.value })
                  }
                />
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
                <span style={{ color: "red" }}>*</span> Icon :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Input
                  value={formData.Icon}
                  maxLength={100}
                  onChange={(e) =>
                    setFormData({ ...formData, Icon: e.target.value })
                  }
                />
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
                <InputNumber
                  value={formData.SittingCapacity}
                  min={0}
                  max={100}
                  onChange={(value) =>
                    setFormData({ ...formData, SittingCapacity: value })
                  }
                />
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
                <Radio.Group
                  value={formData.IsActive}
                  onChange={(e) =>
                    setFormData({ ...formData, IsActive: e.target.value })
                  }
                >
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>InActive</Radio>
                </Radio.Group>
              </Col>
            </Row>

            <Divider
              type="horizontal"
              style={{ marginBottom: 5, marginTop: 5 }}
            />

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              // onClick={onSubmit}
              onClick={async () => {
                if (
                  _.includes([null, ""], formData.ShortCode) ||
                  _.includes([null, ""], formData.TableName) ||
                  _.includes([null, ""], formData.SecCode) ||
                  _.includes([null, ""], formData.Icon) ||
                  _.includes([null, ""], formData.SittingCapacity)
                ) {
                  notification.error({
                    message: "Required Fields are Empty",
                    description: (
                      <span>
                        Input's with (<span style={{ color: "red" }}> * </span>)
                        Can't be Empty
                      </span>
                    ),
                    duration: 3,
                  });
                } else {
                  onSubmit();
                }
              }}
              loading={btnLoading}
              disabled={btnLoading}
            >
              Save
            </Button>

            <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              onClick={onReset}
              loading={btnLoading}
            >
              Reset
            </Button>

            <Button
              type="primary"
              icon={<Icon component={RollbackOutlined} />}
              style={{ marginRight: 5 }}
              onClick={props.onBackPress}
              loading={btnLoading}
            >
              Back
            </Button>

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
                <SectionMasterCardNew
                  title={
                    isShowModal.entryMode === "A"
                      ? "Add Section"
                      : "Edit Section"
                  }
                  formData={isShowModal.formData}
                  onBackPress={() => {
                    setIsShowModal();
                  }}
                  entryMode={isShowModal.formData ? "E" : "A"}
                  onSavePress={(val) => {
                    fetchSectionMaster(CompCode).then((res) => {
                      setSectionData(res);
                    });
                  }}
                />
              </Modal>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TableMasterNewCard;
