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
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const TableMasterCard = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const dispatch = useDispatch();
  const currentTran = useSelector((state) => state.currentTran);
  const { Option } = Select;
  // const department = useSelector((state) => state.deptMaster);

  useEffect(() => {
    fetchSectionMaster(CompCode).then((res) => setSectionData(res));
  }, []);

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    ShortCode: props.formData ? props.formData.ShortCode : "",
    TableName: props.formData ? props.formData.TableName : "",
    SecCode: props.formData ? props.formData.SecCode : "",
    Icon: props.formData ? props.formData.Icon : "",
    SittingCapacity: props.formData ? props.formData.SittingCapacity : "",
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new TablesMaster(
      values.ShortCode,
      values.TableName,
      values.SecCode,
      values.Icon ? values.Icon : null,
      values.SittingCapacity ? values.SittingCapacity : null,
      values.IsActive === "true" ? true : false
    );
    dispatch(InsUpdtTablesMaster(props.formData ? "U" : "I", val));
  };

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
              <Form.Item
                name="SecCode"
                style={{ marginBottom: 5 }}
                label="Section Code"
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
                >
                  {sectionData.map((h) => {
                    return (
                      <Option key={h.SecCode} value={h.SecCode}>
                        {h.SecDesc}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="ShortCode"
                style={{ marginBottom: 5 }}
                label="TableShort Code :"
                rules={[
                  {
                    required: true,
                    message: "Please input your code!",
                  },
                ]}
              >
                <Input
                  disabled={props.formData ? true : false}
                  maxLength={10}
                  onInput={(e) => {
                    e.target.value = ("" + e.target.value).toUpperCase();
                  }}
                />
              </Form.Item>
              <Form.Item
                name="TableName"
                style={{ marginBottom: 5 }}
                label="Table Name :"
                rules={[
                  {
                    required: true,
                    message: "Please input Tablename!",
                  },
                ]}
              >
                <Input maxLength={100} />
              </Form.Item>
              <Form.Item name="Icon" style={{ marginBottom: 5 }} label="Icon :">
                <Input />
              </Form.Item>
              <Form.Item
                name="SittingCapacity"
                style={{ marginBottom: 5 }}
                label="Sitting Capacity :"
              >
                <InputNumber min={0} max={100} />
              </Form.Item>
              <Form.Item
                name="IsActive"
                label="Status :"
                style={{ marginBottom: 5 }}
                // rules={[{ required: true, message: "Please select Status!" }]}
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

export default TableMasterCard;
