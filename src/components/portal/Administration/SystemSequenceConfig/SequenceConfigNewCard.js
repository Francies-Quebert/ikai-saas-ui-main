import React, { Fragment, useEffect, useState } from "react";
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
  InputNumber,
  Alert,
  Switch,
  Checkbox,
} from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import { fetchOtherMasterSequence } from "../../../../store/actions/appMain";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SequenceConfigNewCard = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { Option } = Select;
  const SystemSequence = useSelector((state) => state.AppMain.otherMasterSEQ);

  useEffect(() => {
    dispatch(fetchOtherMasterSequence("SEQ"));
  }, []);

  return (
    <div>
      <Row>
        <Col flex={1}>
          <Form
            labelAlign="left"
            name="userbody"
            {...formItemLayout}
            form={form}
          >
            <div>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="ResetOn"
                    style={{ marginBottom: 5 }}
                    label="Reset On :"
                  >
                    <Select
                      id="Test"
                      showSearch
                      allowClear={true}
                      style={{ width: "200%", marginLeft: 183 }}
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
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item name="PaddingChar" style={{ marginBottom: 5 }}>
                    <Input
                      addonBefore="LastGenNo"
                      style={{ marginLeft: 332 }}
                      maxLength={1}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div>
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                    name="Preffix"
                    label="Sequence:"
                    style={{ marginBottom: 5 }}
                  >
                    <Input
                      addonBefore="Prefix"
                      placeholder="Enter preffix"
                      style={{ marginLeft: 181 }}
                      maxLength={10}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item name="Value" style={{ marginBottom: 5 }}>
                    <InputNumber
                      placeholder="Enter value"
                      style={{ marginLeft: 118, width: "100%" }}
                      min={0}
                      max={20}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item name="Suffix" style={{ marginBottom: 5 }}>
                    <Input
                      addonBefore="Sufix"
                      placeholder="Enter Suffix"
                      style={{ marginLeft: -34 }}
                      maxLength={10}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div>
              <Form.Item label="Padding:">
                <Form.Item
                  width={100}
                  name="Enable Padding"
                  style={{
                    marginBottom: 5,
                    display: "inline-block",
                    width: "calc(36% - 8px)",
                  }}
                  valuePropName="checked"
                  colon={false}
                >
                  <Checkbox>Enable Padding</Checkbox>
                </Form.Item>
                <Form.Item
                  name="PaddingLength"
                  style={{
                    marginBottom: 5,
                    display: "inline-block",
                    width: "calc(33% - 4px)",
                    marginRight: 3,
                  }}
                >
                  <Input addonBefore="Padding Length" min={0} max={9} />
                </Form.Item>
                <Form.Item
                  name="PaddingChar"
                  style={{
                    marginBottom: 5,
                    display: "inline-block",
                    width: "calc(33% - 8px)",
                  }}
                >
                  <Input addonBefore="Padding Character" maxLength={1} />
                </Form.Item>
              </Form.Item>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default SequenceConfigNewCard;
