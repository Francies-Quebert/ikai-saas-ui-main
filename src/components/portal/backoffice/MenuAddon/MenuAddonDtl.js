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
  Switch,
  Divider,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { reInitialize } from "../../../../store/actions/currentTran";
import AddonDtl from "../../../../models/menu-addon-dtl";
import { InsUpdtMenuAddonDtl } from "../../../../services/menu-addon";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const MenuAddonDtl = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);

  //initial values
  const initialValues = {
    Id: props.formData ? props.formData.Id : 0,
    AddOnCode: props.formData ? props.formData.AddOnCode : "",
    ItemName: props.formData ? props.formData.ItemName : "",
    Rate: props.formData ? props.formData.Rate : "",
    AddInfo: props.formData ? props.formData.AddInfo : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  //On Reset
  const onReset = () => {
    form.resetFields();
  };

  //Onfinish
  const onFinish = (values) => {
    setIsLoading(true);
    const val = new AddonDtl(
      values.Id ? values.Id : initialValues.Id ? initialValues.Id : 0,
      values.AddOnCode ? values.AddOnCode : initialValues.AddOnCode,
      values.ItemName,
      values.Rate,
      values.AddInfo,
      values.IsActive
    );
    dispatch(InsUpdtMenuAddonDtl(val));
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
          <Col flex={0.37}>
            <CardHeader title="Menu AddOn Detail Form" />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                labelAlign="left"
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="ItemName"
                  style={{ marginBottom: 5 }}
                  label="Item Name "
                  rules={[
                    {
                      required: true,
                      message: "Please input item name !",
                    },
                  ]}
                >
                  <Input placeholder="Please input item name !" />
                </Form.Item>
                <Form.Item
                  name="Rate"
                  style={{ marginBottom: 5 }}
                  label="Rate"
                  rules={[{ required: true, message: " Please input rate !" }]}
                >
                  <Input type="number" placeholder="Please input rate!" />
                </Form.Item>
                <Form.Item
                  name="AddInfo"
                  style={{ marginBottom: 5 }}
                  label="Add Info"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input info !",
                  //   },
                  // ]}
                >
                  <Input placeholder="Please input info !" />
                </Form.Item>
                <Form.Item
                  name="IsActive"
                  label="Status"
                  style={{ marginBottom: 5 }}
                  rules={[{ required: true, message: "Please select Status!" }]}
                >
                  <Radio.Group>
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>InActive</Radio>
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

export default MenuAddonDtl;
