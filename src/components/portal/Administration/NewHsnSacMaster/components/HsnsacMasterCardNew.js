import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Col,
  Row,
  Input,
  Button,
  Divider,
  Radio,
  Select,
  Tooltip,
  notification,
} from "antd";
import CardHeader from "../../../../common/CardHeader";
import Icon, {
  EditOutlined,
  FileAddOutlined,
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { fetchTaxMasterData } from "../../../../../services/taxMaster";
import TaxMasterNewCard from "../../NewTaxMaster/components/TaxMasterNewCard";
import Modal from "antd/lib/modal/Modal";
import swal from "sweetalert";
import { InsUpdtHsnsacMaster } from "../../../../../services/hsnsac";
const { Option } = Select;

const HsnsacMasterCardNew = (props) => {
  const dispatch = useDispatch();
  const initialValues = {
    hsnsaccode: props.formData ? props.formData.hsnsaccode : null,
    hsnsacdesc: props.formData ? props.formData.hsnsacdesc : null,
    DefTaxCode: props.formData ? props.formData.DefTaxCode : null,
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  //useState
  const [formData, setFormData] = useState(initialValues);
  const [taxMaster, setTaxMaster] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState({
    TaxCode: !props.formData ? true : false,
  });
  const [btnLoading, setbtnLoading] = useState(false);

  //useSelector
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const currTran = useSelector((state) => state.currentTran);
  const UserAccess = useSelector((state) => state.AppMain.userAccess);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  //useEffect
  useEffect(() => {
    setIsLoading(true);
    fetchTaxMasterData(CompCode).then((res) => {
      setTaxMaster(res);

      setIsLoading(false);
    });
  }, []);

  //ResetField
  const onReset = () => {
    setFormData(initialValues);
  };

  const onSubmit = () => {
    setbtnLoading(true);
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      const HData = {
        InsUpdtType: props.formData ? "U" : "I",
        hsnsaccode: formData.hsnsaccode,
        hsnsacdesc: formData.hsnsacdesc,
        DefTaxCode: formData.DefTaxCode,
        IsActive: formData.IsActive,
        updt_usrId: l_loginUser,
        CompCode: CompCode,
      };
      setbtnLoading(false);
      // console.log(HData, "jg");
      if (val) {
        InsUpdtHsnsacMaster(HData)
          .then((res) => {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress(HData);
            props.onBackPress();
          })
          .catch((er) => {
            swal("Something went wrong   !!!", {
              icon: "error",
            });
          })
          .finally(() => {
            setbtnLoading(false);
          });
      }
    });
  };
  return (
    <>
      <Row>
        <Col flex={1}>
          <CardHeader title={props.title ? props.title : currTran.formTitle} />
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
                <span style={{ color: "red" }}>*</span> Code :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Input
                  value={formData.hsnsaccode}
                  maxLength={10}
                  placeholder="Please enter Code"
                  disabled={props.formData ? true : false}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      hsnsaccode: e.target.value,
                    });
                  }}
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
                <span style={{ color: "red" }}>*</span> Description :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Input
                  value={formData.hsnsacdesc}
                  placeholder="Please enter your Description!"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      hsnsacdesc: e.target.value,
                    });
                  }}
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
                <span style={{ color: "red" }}>*</span> Default Tax Code :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Row style={{ marginBottom: 5, flex: 2 }}>
                    <Select
                      value={formData.DefTaxCode}
                      showSearch
                      allowClear={true}
                      style={{ width: "100%", textTransform: "uppercase" }}
                      optionFilterProp="children"
                      placeholder="Select  Code"
                      // disabled={props.formData}
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
                      onChange={(data) => {
                        setFormData({ ...formData, DefTaxCode: data });
                        if (data) {
                          setBtnDisable({
                            TaxCode: false,
                          });
                        } else {
                          setBtnDisable({
                            TaxCode: true,
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
                  </Row>
                  <Tooltip title="Add New Tax">
                    <Button
                      icon={<FileAddOutlined />}
                      style={{ margin: "3px 3px" }}
                      type="primary"
                      size="small"
                      shape="circle"
                      disabled={
                        // hasRight(currTran.moduleRights, "ADD")
                        UserAccess.find((i) => i.ModuleId === 41).Rights.find(
                          (i) => i.RightCode === "ADD"
                        ).RightVal === "N"
                          ? true
                          : false
                      }
                      disabled={formData.DefTaxCode !== null}
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
                        // hasRight(currTran.moduleRights, "EDIT")
                        UserAccess.find((i) => i.ModuleId === 41).Rights.find(
                          (i) => i.RightCode === "EDIT"
                        ).RightVal === "N" || btnDisable.TaxCode
                          ? true
                          : false
                      }
                      onClick={() => {
                        // console.log(formData, "hh");
                        setIsShowModal({
                          modalType: "TAX",
                          entryMode: "E",
                          formData: taxMaster.find(
                            (i) => i.TaxCode === formData.DefTaxCode
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
                <span style={{ color: "red" }}>*</span> Status :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <Radio.Group
                  defaultValue={true}
                  value={formData.IsActive}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      IsActive: e.target.value,
                    });
                  }}
                >
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>InActive</Radio>
                </Radio.Group>
              </Col>
            </Row>

            <Divider style={{ marginBottom: 5, marginTop: 5 }} />

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              onClick={async () => {
                if (
                  _.includes([null, ""], formData.hsnsaccode) ||
                  _.includes([null, ""], formData.hsnsacdesc)
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
              value="reset"
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
            >
              Back
            </Button>
            {/* {isShowModal && ( */}
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
              <TaxMasterNewCard
                title="TAX Master"
                formData={isShowModal ? isShowModal.formData : null}
                onBackPress={() => {
                  setIsShowModal();
                }}
                onSavePress={(val) => {
                  fetchTaxMasterData(CompCode).then((res) => {
                    setTaxMaster(res);
                  });
                }}
              />
            </Modal>
            {/* )} */}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default HsnsacMasterCardNew;
