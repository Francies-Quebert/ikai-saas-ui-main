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
  InputNumber,
  Checkbox,
  Spin,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import BrandMaster from "../../../../models/brandmaster";
import { InsUpdtBrandMaster } from "../../../../store/actions/brandmaster";

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
  const manufacturer = useSelector((state) => state.manufacturermaster);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const onReset = () => {
    form.resetFields();
  };
  const [isDefault, setIsDefault] = useState(
    props.formData ? props.formData.IsDefault : true
  );

  const initialValues = {
    MfrCode: props.formData ? props.formData.MfrCode : "",
    BrandCode: props.formData ? props.formData.BrandCode : "",
    BrandDesc: props.formData ? props.formData.BrandDesc : "",
    IsDefault: props.formData ? props.formData.IsDefault : true,
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };
  const onFinish = (values) => {
    setIsLoading(true);

    const val = new BrandMaster(
      values.MfrCode,
      null,
      values.BrandCode,
      values.BrandDesc,
      values.IsDefault,
      values.IsActive === "true" ? true : false
    );
    dispatch(InsUpdtBrandMaster(val));
    props.onSavePress(val.BrandCode);
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
                <Form.Item
                  name="MfrCode"
                  style={{ marginBottom: 5 }}
                  label="Manufacturer"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Manufacturer Code!",
                    },
                  ]}
                >
                  <Select disabled={props.formData ? true : false}>
                    {manufacturer.manufacturerMasters.map((ii) => {
                      return <Option value={ii.MfrCode}>{ii.MfrDesc}</Option>;
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="BrandCode"
                  style={{ marginBottom: 5 }}
                  label="Brand Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Brand Code",
                    },
                  ]}
                >
                  <Input disabled={props.formData ? true : false} />
                </Form.Item>

                <Form.Item
                  name="BrandDesc"
                  style={{ marginBottom: 5 }}
                  label="Brand Description"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="IsDefault"
                  style={{ marginBottom: 5 }}
                  label="Default"
                  valuePropName="checked"
                >
                  <Checkbox
                    onChange={(e) => {
                      setIsDefault(e.target.checked);
                    }}
                  />
                </Form.Item>
                <Form.Item
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

export default BrandMasterCard;
