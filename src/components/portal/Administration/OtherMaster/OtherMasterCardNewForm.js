import React, { useState, useEffect } from "react";
import {
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Select,
  Divider,
  message,
  notification,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import {
  RetweetOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { InsUpdtOtherMasterCard } from "../../../../services/othermaster";
import { useFormContext } from "react-hook-form";

const lableColSpan = 6;
const InputColSpan = 12;

const OtherMasterCardNewForm = (props) => {
  const initialValues = {
    Id: null,
    MasterType: props.trnType,
    ShortCode: null,
    MasterDesc: null,
    Status: true,
    SysOption1: null,
    SysOption2: null,
    SysOption3: null,
    SysOption4: null,
    SysOption5: null,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const currentTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setIsLoading(true);

    try {
      if (props.formData) {
        setFormValues({
          Id: props.formData.Id,
          MasterType: props.formData.MasterType,
          ShortCode: props.formData.ShortCode,
          MasterDesc: props.formData.MasterDesc,
          Status: props.formData.IsActive,
          SysOption1: props.formData.SysOption1,
          SysOption2: props.formData.SysOption2,
          SysOption3: props.formData.SysOption3,
          SysOption4: props.formData.SysOption4,
          SysOption5: props.formData.SysOption5,
        });
      } else {
        setFormValues({
          Id: 0,
          MasterType: props.trnType,
          ShortCode: null,
          MasterDesc: null,
          Status: true,
          SysOption1: null,
          SysOption2: null,
          SysOption3: null,
          SysOption4: null,
          SysOption5: null,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onFinish = () => {
    if (formValues) {
      setIsLoading(true);
      const val = {
        InsUpdtType: props.formData ? "U" : "I",
        Id: formValues.Id,
        MasterType: formValues.MasterType,
        ShortCode: formValues.ShortCode,
        MasterDesc: formValues.MasterDesc,
        updt_usr: "hariomshah",
        IsActive: formValues.Status,
        SysOption1: formValues.SysOption1,
        SysOption2: formValues.SysOption2,
        SysOption3: formValues.SysOption3,
        SysOption4: formValues.SysOption4,
        SysOption5: formValues.SysOption5,
      };

      InsUpdtOtherMasterCard(CompCode, val).then((res) => {
        notification.success({
          message: "Succesfull",
          description: "Data saved Successfully, ",
        });
        setIsLoading(false);
        props.onBackPress();
      });
    }
  };

  return (
    <Col span={16}>
      <CardHeader title={props.title ? props.title : currentTran.formTitle} />
      <Card bodyStyle={{ padding: "7px 12px" }}>
        <Row style={{ marginBottom: 5 }}>
          <Col span={lableColSpan}>
            <span style={{ color: "red" }}>*</span> Code :
          </Col>
          <Col span={InputColSpan} >
            <Input
              onInput={(e) => {
                e.target.value = ("" + e.target.value).toUpperCase();
              }}
              placeholder="Please Enter Values"
              allowClear
              // style={{ textTransform: "uppercase" }}
              maxLength={10}
              disabled={props.formData ? true : false}
              value={formValues.ShortCode}
              onChange={(e) => {
                if (e) {
                  setFormValues({ ...formValues, ShortCode: e.target.value });
                } else {
                  setFormValues({ ...formValues, ShortCode: null });
                }
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 7 }}>
          <Col span={lableColSpan}>
            <span style={{ color: "red" }}>*</span> Description :
          </Col>
          <Col span={InputColSpan}>
            <Input.TextArea
              rows={4}
              placeholder="Please Enter Values"
              allowClear
              value={formValues.MasterDesc}
              onChange={(e) => {
                if (e) {
                  setFormValues({ ...formValues, MasterDesc: e.target.value });
                } else {
                  setFormValues({ ...formValues, MasterDesc: null });
                }
              }}
            />
          </Col>
        </Row>
        {!props.customLabelSysOption1 ||
          (props.customLabelSysOption1 !== "" && (
            <Row style={{ marginBottom: 7 }}>
              <Col span={lableColSpan}>
                {props.customLabelSysOption1
                  ? props.customLabelSysOption1
                  : "SysOption1"}
                :
              </Col>
              <Col span={InputColSpan}>
                {props.trnType === "INC" || props.trnType === "EXPS" ? (
                  <Select
                    placeholder="Please Select"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    optionFilterProp="children"
                    showSearch
                    allowClear
                    style={{ width: "100%" }}
                    value={formValues.SysOption1}
                    onChange={(val) => {
                      if (val) {
                        setFormValues({
                          ...formValues,
                          SysOption1: val,
                        });
                      } else {
                        setFormValues({ ...formValues, SysOption1: null });
                      }
                    }}
                  >
                    <Select.Option value={"D"}>
                      Direct{" "}
                      {props.trnType === "INC"
                        ? "Income"
                        : props.trnType === "EXPS"
                        ? "Expense"
                        : ""}
                    </Select.Option>
                    <Select.Option value={"I"}>
                      In-Direct{" "}
                      {props.trnType === "INC"
                        ? "Income"
                        : props.trnType === "EXPS"
                        ? "Expense"
                        : ""}
                    </Select.Option>
                  </Select>
                ) : (
                  <Input
                    placeholder="Please Enter Values"
                    allowClear
                    value={formValues.SysOption1}
                    onChange={(e) => {
                      if (e) {
                        setFormValues({
                          ...formValues,
                          SysOption1: e.target.value,
                        });
                      } else {
                        setFormValues({ ...formValues, SysOption1: null });
                      }
                    }}
                  />
                )}
              </Col>
            </Row>
          ))}
        {!props.customLabelSysOption2 ||
          (props.customLabelSysOption2 !== "" && (
            <Row style={{ marginBottom: 7 }}>
              <Col span={lableColSpan}>
                {props.customLabelSysOption2
                  ? props.customLabelSysOption2
                  : "SysOption2"}
                :
              </Col>
              <Col span={InputColSpan}>
                <Input
                  placeholder="Please Enter Values"
                  allowClear
                  value={formValues.SysOption2}
                  onChange={(e) => {
                    if (e) {
                      setFormValues({
                        ...formValues,
                        SysOption2: e.target.value,
                      });
                    } else {
                      setFormValues({ ...formValues, SysOption2: null });
                    }
                  }}
                />
              </Col>
            </Row>
          ))}
        {!props.customLabelSysOption3 ||
          (props.customLabelSysOption3 !== "" && (
            <Row style={{ marginBottom: 7 }}>
              <Col span={lableColSpan}>
                {props.customLabelSysOption3
                  ? props.customLabelSysOption3
                  : "SysOption3"}
                :
              </Col>
              <Col span={InputColSpan}>
                <Input
                  placeholder="Please Enter Values"
                  allowClear
                  value={formValues.SysOption3}
                  onChange={(e) => {
                    if (e) {
                      setFormValues({
                        ...formValues,
                        SysOption3: e.target.value,
                      });
                    } else {
                      setFormValues({ ...formValues, SysOption3: null });
                    }
                  }}
                />
              </Col>
            </Row>
          ))}
        {!props.customLabelSysOption4 ||
          (props.customLabelSysOption4 !== "" && (
            <Row style={{ marginBottom: 7 }}>
              <Col span={lableColSpan}>
                {props.customLabelSysOption4
                  ? props.customLabelSysOption4
                  : "SysOption4"}
                :
              </Col>
              <Col span={InputColSpan}>
                <Input
                  placeholder="Please Enter Values"
                  allowClear
                  value={formValues.SysOption4}
                  onChange={(e) => {
                    if (e) {
                      setFormValues({
                        ...formValues,
                        SysOption4: e.target.value,
                      });
                    } else {
                      setFormValues({ ...formValues, SysOption4: null });
                    }
                  }}
                />
              </Col>
            </Row>
          ))}
        {!props.customLabelSysOption5 ||
          (props.customLabelSysOption5 !== "" && (
            <Row style={{ marginBottom: 7 }}>
              <Col span={lableColSpan}>
                {props.customLabelSysOption5
                  ? props.customLabelSysOption5
                  : "SysOption5"}
                :
              </Col>
              <Col span={InputColSpan}>
                <Input
                  placeholder="Please Enter Values"
                  allowClear
                  value={formValues.SysOption5}
                  onChange={(e) => {
                    if (e) {
                      setFormValues({
                        ...formValues,
                        SysOption5: e.target.value,
                      });
                    } else {
                      setFormValues({ ...formValues, SysOption5: null });
                    }
                  }}
                />
              </Col>
            </Row>
          ))}
        <Row style={{ marginBottom: 7 }}>
          <Col span={lableColSpan}>Status :</Col>
          <Col span={InputColSpan}>
            <Radio.Group
              onChange={(e) => {
                if (e) {
                  setFormValues({
                    ...formValues,
                    Status: e.target.value,
                  });
                } else {
                  setFormValues({ ...formValues, Status: null });
                }
              }}
              value={formValues.Status}
            >
              <Radio value={true}>Active</Radio>
              <Radio value={false}>In-Active</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Divider style={{ marginBottom: 5, marginTop: 5 }} />
        <Row style={{ marginBottom: 7 }}>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            loading={isLoading}
            onClick={() => {
              if (
                !_.includes([null, undefined, ""], formValues.ShortCode) &&
                !_.includes([null, undefined, ""], formValues.MasterDesc)
              ) {
                onFinish();
              } else {
                message.error("Required fields cannot be empty");
              }
            }}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
          <Button
            style={{ marginRight: 5 }}
            type="primary"
            onClick={() => {}}
            icon={<RetweetOutlined />}
          >
            Reset
          </Button>
          <Button
            style={{ marginRight: 5 }}
            onClick={() => {
              props.onBackPress();
            }}
            icon={<RollbackOutlined />}
          >
            Back
          </Button>
        </Row>
      </Card>
    </Col>
  );
};

export default OtherMasterCardNewForm;
