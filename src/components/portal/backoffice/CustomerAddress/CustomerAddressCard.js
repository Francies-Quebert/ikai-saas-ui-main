import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Input, Checkbox, Spin } from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CustomerAddress from "../../../../models/customer-address";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import { InsUpdtCustomerAddress } from "../../../../services/customer-address";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const CustomerAddressCard = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(
    props.formData ? props.formData.IsDefault : true
  );

  //useSelector
  const currentTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  
  //initial value
  const initialValues = {
    AddressId: props.formData ? props.formData.AddressId : 0,
    UserType: "U",
    UserId: props.formData
      ? props.formData.UserId
      : props.userId
      ? props.userId
      : null,
    add1: props.formData ? props.formData.add1 : "",
    add2: props.formData ? props.formData.add2 : "",
    add3: props.formData ? props.formData.add3 : "",
    AddressTag: props.formData ? props.formData.AddressTag : "",
    City: props.formData ? props.formData.City : "",
    PinCode: props.formData ? props.formData.PinCode : "",
    IsDefault: props.formData ? parseInt(props.formData.IsDefault) : false,
    MarkDeleted: props.formData ? props.formData.MarkDeleted : "N",
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new CustomerAddress(
      values.AddressId ? values.AddressId : initialValues.AddressId,
      values.UserType ? values.UserType : initialValues.UserType,
      values.UserId ? values.UserId : initialValues.UserId,
      values.add1,
      values.add2,
      values.add3,
      values.AddressTag,
      values.City,
      values.PinCode,
      values.IsDefault,
      values.MarkDeleted ? values.MarkDeleted : initialValues.MarkDeleted
    );
    // console.log(val, "jeey");
    dispatch(InsUpdtCustomerAddress(val));
    props.onSaveAddress();
  };

  //useEffect
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
                  name="add1"
                  style={{ marginBottom: 5 }}
                  label="Flat / House No."
                  rules={[
                    {
                      required: true,
                      message: "Please enter flat / house no. , Building name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="add2"
                  style={{ marginBottom: 5 }}
                  label="Locality"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="add3"
                  style={{ marginBottom: 5 }}
                  label="Landmark"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="City"
                  style={{ marginBottom: 5 }}
                  label="City"
                  rules={[{ required: true, message: "Please enter city." }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="PinCode"
                  style={{ marginBottom: 5 }}
                  label="Pincode"
                  rules={[{ required: true, message: "Please enter pincode." }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="AddressTag"
                  style={{ marginBottom: 5 }}
                  label="Address Tag"
                  rules={[
                    {
                      required: true,
                      message: "Please enter address preference.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="IsDefault"
                  style={{ marginBottom: 5 }}
                  label=" "
                  valuePropName="checked"
                  colon={false}
                >
                  <Checkbox
                    onChange={(e) => {
                      setIsDefault(e.target.checked);
                    }}
                  >
                    Set as default address
                  </Checkbox>
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
      </Spin>
    </div>
  );
};

export default CustomerAddressCard;
