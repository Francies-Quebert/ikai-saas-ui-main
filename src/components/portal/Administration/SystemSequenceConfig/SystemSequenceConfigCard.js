import React, { Fragment, useEffect, useState } from "react";
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
  Alert,
  Switch,
  Checkbox,
} from "antd";
import { Divider } from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import { InsUpdtSystemSequenceConfigMaster } from "../../../../store/actions/sys-sequence-config";
import SysSequenceConfig from "../../../../models/sys-sequence-config";
import { useDispatch, useSelector } from "react-redux";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import SequenceConfigNewCard from "./SequenceConfigNewCard";
import { fetchGetSequenceTrans } from "../../../../services/system-sequence";
import { fetchOtherMasterSequence } from "../../../../store/actions/appMain";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SystemConfigCard = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { Option } = Select;
  const dispatch = useDispatch();
  const [configType, setConfigType] = useState(
    props.formData ? props.formData.ConfigType : ""
  );
  const currentTran = useSelector((state) => state.currentTran);
  const [tranTypes, setTranTypes] = useState([]);
  const SystemSequence = useSelector((state) => state.AppMain.otherMasterSEQ);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    Id: props.formData ? props.formData.Id : 0,
    TranType: props.formData ? props.formData.TranType : "",
    ConfigType: props.formData ? props.formData.ConfigType : "",
    ResetOn: props.formData ? props.formData.ResetOn : "",
    Preffix: props.formData ? props.formData.Preffix : "",
    Suffix: props.formData ? props.formData.Suffix : "",
    Value: props.formData ? props.formData.Value : "",
    LastGenNo: props.formData ? props.formData.LastGenNo : "",
    EnablePadding: props.formData
      ? props.formData.EnablePadding === "Y"
        ? true
        : false
      : false,
    PaddingLength: props.formData ? props.formData.PaddingLength : "",
    PaddingChar: props.formData ? props.formData.PaddingChar : "",
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };
  const [checked, setchecked] = useState(
    props.formData
      ? props.formData.EnablePadding === "Y"
        ? true
        : false
      : false
  );

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new SysSequenceConfig(
      values.Id ? values.Id : initialValues.Id,
      values.TranType,
      values.ConfigType,
      values.ResetOn,
      values.Preffix,
      values.Suffix,
      values.Value,
      values.LastGenNo,
      checked ? "Y" : "N",
      values.PaddingLength === "" ? null : values.PaddingLength,
      values.PaddingChar,
      values.TranDesc ? values.TranDesc : null,
      values.IsActive === "true" ? true : false,
      values.ConfigTypeDesc ? values.ConfigTypeDesc : null
    );
    console.log(val,"sa")
    dispatch(
      InsUpdtSystemSequenceConfigMaster(props.formData ? "U" : "I", val)
      
    );
  };

  useEffect(() => {
    fetchGetSequenceTrans(CompCode).then((res) => {
      setTranTypes(res);
      
    });
    dispatch(fetchOtherMasterSequence("SEQ"));
  }, []);

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
      {props.formData ? (
        <CardHeader title={"Edit" + " " + currentTran.formTitle} />
      ) : (
        <CardHeader title={"Add" + " " + currentTran.formTitle} />
      )}
      <Row>
        <Col flex={1}>
          <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
            <Form
              labelAlign="left"
              name="userbody"
              {...formItemLayout}
              onFinish={onFinish}
              initialValues={initialValues}
              form={form}
            >
              <Form.Item
                name="TranType"
                style={{ marginBottom: 5 }}
                label="Transaction Type :"
              >
                <Select
                  id="Test"
                  disabled={props.formData ? true : false}
                  showSearch
                  allowClear={true}
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  placeholder="Select Code"
                >
                  {tranTypes.map((row, l_index) => {
                    return (
                      <Option key={l_index} value={row.TranCode}>
                        {row.TranDesc}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="ConfigType"
                style={{ marginBottom: 5 }}
                label="Sequence Gen Mode :"
              >
                <Select
                  id="Test"
                  showSearch
                  allowClear={true}
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  placeholder="Select Code"
                  onChange={(e) => {
                    setConfigType(e);
                  }}
                >
                  <Option value="A">Automatic</Option>
                  <Option value="M">Manual</Option>
                </Select>
              </Form.Item>
              {configType === "A" && (
                <>
                  <Form.Item label="Reset On:" style={{ marginBottom: 5 }}>
                    <Form.Item
                      name="ResetOn"
                      style={{
                        marginBottom: 5,
                        display: "inline-block",
                        width: "calc(66% - 4px)",
                        marginRight: 3,
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Please Select Reset On",
                        },
                      ]}
                    >
                      <Select
                        id="Test"
                        showSearch
                        allowClear={true}
                        optionFilterProp="children"
                        placeholder="Select Code"
                      >
                        {SystemSequence &&
                          SystemSequence.map((h, l_index) => {
                            return (
                              <Option key={l_index} value={h.ShortCode}>
                                {h.MasterDesc}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="LastGenNo"
                      style={{
                        marginBottom: 5,
                        display: "inline-block",
                        width: "calc(34% - 4px)",
                        marginRight: 3,
                      }}
                    >
                      <Input
                        disabled={true}
                        addonBefore="LastGenNo"
                        min={0}
                        max={9}
                      />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item label="Sequence :" style={{ marginBottom: 5 }}>
                    <Form.Item
                      name="Preffix"
                      style={{
                        marginBottom: 5,
                        display: "inline-block",
                        width: "calc(33% - 4px)",
                        marginRight: 3,
                      }}
                    >
                      <Input addonBefore=" Prefix" min={0} max={9} />
                    </Form.Item>
                    <Form.Item
                      name="Value"
                      style={{
                        marginBottom: 5,
                        display: "inline-block",
                        width: "calc(33% - 4px)",
                        marginRight: 3,
                      }}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        addonBefore="Value"
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      name="Suffix"
                      style={{
                        marginBottom: 5,
                        display: "inline-block",
                        width: "calc(35% - 8px)",
                      }}
                    >
                      <Input addonBefore="Sufix" maxLength={1} />
                    </Form.Item>
                  </Form.Item>

                  <Form.Item label="Padding:" style={{ marginBottom: 5 }}>
                    <Form.Item
                      width={100}
                      name="EnablePadding"
                      style={{
                        marginBottom: 5,
                        display: "inline-block",
                        width: "calc(34% - 8px)",
                      }}
                      valuePropName="checked"
                      colon={false}
                    >
                      <Checkbox
                        onChange={(e) => {
                          setchecked(e.target.checked);
                          // if (e.target.checked) {
                          //   setchecked("Y");
                          // } else {
                          //   setchecked("N");
                          // }
                        }}
                      >
                        Enable
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name="PaddingLength"
                      style={{
                        marginBottom: 5,
                        display: "inline-block",
                        width: "calc(33% - 4px)",
                        marginRight: 3,
                      }}
                      rules={
                        checked
                          ? [
                              {
                                required: true,
                                message: "Please Enter Padding Length",
                              },
                            ]
                          : []
                      }
                    >
                      <Input
                        addonBefore=" Padding Length"
                        disabled={!checked}
                        min={0}
                        maxLength={1}
                      />
                    </Form.Item>
                    <Form.Item
                      name="PaddingChar"
                      style={{
                        marginBottom: 5,
                        display: "inline-block",
                        width: "calc(35% - 8px)",
                      }}
                      rules={
                        checked
                          ? [
                              {
                                required: true,
                                message: "Please Enter Padding Character",
                              },
                            ]
                          : []
                      }
                    >
                      <Input
                        addonBefore=" Padding Character"
                        disabled={!checked}
                        maxLength={1}
                        rules={[
                          {
                            required: true,
                            message: "Please Enter",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Form.Item>
                </>
              )}
              <Form.Item
                name="IsActive"
                label="Status :"
                style={{ marginBottom: 5 }}
              >
                <Radio.Group>
                  <Radio value="true">Active</Radio>
                  <Radio value="false">InActive</Radio>
                </Radio.Group>
              </Form.Item>
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
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SystemConfigCard;
