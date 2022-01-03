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
  InputNumber,
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
import { InsUpdtUnitMaster } from "../../../../store/actions/unitmaster";
import UnitMaster from "../../../../models/unitmaster";
import { ValidationError } from "yup";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const UnitMasterCard = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const unitMasters = useSelector((state) => state.unitMaster.unitMaster);
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
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

  const initialValues = {
    UnitCode: props.formData ? props.formData.UnitCode : "",
    UnitDesc: props.formData ? props.formData.UnitDesc : "",
    ParentUnitCode: props.formData ? props.formData.ParentUnitCode : "",
    UnitMeasureToParent: props.formData
      ? props.formData.UnitMeasureToParent
      : "",
    AllowDecimal: props.formData ? props.formData.AllowDecimal : "N",
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new UnitMaster(
      values.UnitCode,
      values.UnitDesc,
      null,
      // values.ParentUnitCode ? values.ParentUnitCode : null,
      values.UnitMeasureToParent ? values.UnitMeasureToParent : null,
      values.AllowDecimal,
      values.IsActive === "true" ? true : false
    );
    // console.log(val, );
    dispatch(InsUpdtUnitMaster(val));
    props.onSavePress(values);
  };

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={0.37}>
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
                  name="UnitCode"
                  style={{ marginBottom: 5 }}
                  label="Unit Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Unit Code",
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
                  name="UnitDesc"
                  style={{ marginBottom: 5 }}
                  label="Unit Description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your unit description",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {/* <Form.Item
                  name="ParentUnitCode"
                  style={{ marginBottom: 5 }}
                  label="Parent Unit:"
                >
                  <Select
                    onChange={(cc) => {}}
                    allowClear
                    showSearch="children"
                  >
                    {unitMasters.length > 0 &&
                      unitMasters
                        .filter(
                          (kk) => kk.UnitCode !== form.getFieldValue("UnitCode")
                        )
                        .map((ii) => (
                          <Option key={ii.UnitCode} value={ii.UnitCode}>
                            {ii.UnitDesc}
                          </Option>
                        ))}
                  </Select>
                </Form.Item> */}

                <Form.Item
                  name="UnitMeasureToParent"
                  style={{ marginBottom: 5 }}
                  label="Unit Measure Parent:"
                >
                  <Input
                    // disabled={form.getFieldValue("ParentUnitCode") && form.getFieldValue("ParentUnitCode").length > 0 ? false : true}
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="AllowDecimal"
                  label="Allow Decimal"
                  style={{ marginBottom: 5 }}
                >
                  <Radio.Group>
                    <Radio value="Y">Yes</Radio>
                    <Radio value="N">No</Radio>
                  </Radio.Group>
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

export default UnitMasterCard;
