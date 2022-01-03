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
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtHsnsacMaster } from "../../../../store/actions/hsnsacMaster";
import HSNSACmaster from "../../../../models/hasnsac-master";
import { getTaxMaster } from "../../../../services/taxMaster";
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

const HsnsacMasterCard = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const [taxMaster, setTaxMaster] = useState([]);
  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    getTaxMaster().then((res) => {
      setTaxMaster([]);
      setTaxMaster(res);
    });
  }, []);

  const initialValues = {
    hsnsaccode: props.formData ? props.formData.hsnsaccode : "",
    hsnsacdesc: props.formData ? props.formData.hsnsacdesc : "",
    DefTaxCode: props.formData ? props.formData.DefTaxCode : "",
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new HSNSACmaster(
      values.hsnsaccode,
      values.hsnsacdesc,
      values.DefTaxCode,
      values.IsActive === "true" ? true : false
    );

    // console.log(val, isDefault);
    dispatch(InsUpdtHsnsacMaster(val));
    props.onSavePress(val.hsnsaccode);
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
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col span={24}>
            <CardHeader title={currentTran.formTitle} />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                form={form}
                initialValues={initialValues}
                name="userbody"
                labelAlign="left"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  // justify="center"
                  name="hsnsaccode"
                  style={{ marginBottom: 5 }}
                  label="Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Code",
                    },
                  ]}
                >
                  <Input disabled={props.formData ? true : false} />
                </Form.Item>
                <Form.Item
                  // justify="center"
                  name="hsnsacdesc"
                  style={{ marginBottom: 5 }}
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Description!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  // justify="center"
                  name="DefTaxCode"
                  style={{ marginBottom: 5 }}
                  label="Default Tax Code"
                >
                  <Select allowClear showSearch optionFilterProp="children">
                    {taxMaster.length > 0 &&
                      taxMaster.map((ii) => {
                        return (
                          <Option key={ii.TaxCode} value={ii.TaxCode}>
                            {ii.TaxName}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>

                <Form.Item
                  // justify="center"
                  name="IsActive"
                  label="Status"
                  style={{ marginBottom: 5 }}
                >
                  <Radio.Group>
                    <Radio value="true">Active</Radio>
                    <Radio value="false">InActive</Radio>
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
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default HsnsacMasterCard;
