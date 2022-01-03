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
import AddonHdr from "../../../../models/menu-addon-hdr";
import { InsUpdtMenuAddonHdr } from "../../../../services/menu-addon";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const MenuAddonHdr = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);

  //initial values
  const initialValues = {
    AddOnCode: props.formData ? props.formData.AddOnCode : "",
    AddOnName: props.formData ? props.formData.AddOnName : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  //On Reset
  const onReset = () => {
    form.resetFields();
  };

  //Onfinish
  const onFinish = (values) => {
    setIsLoading(true);

    const val = new AddonHdr(
      values.AddOnCode,
      values.AddOnName,
      values.IsActive
    );

    dispatch(InsUpdtMenuAddonHdr(val));
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
            <CardHeader title="Menu AddOn Form" />
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
                  name="AddOnCode"
                  style={{ marginBottom: 5 }}
                  label="AddOn Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input addon code !",
                    },
                  ]}
                >
                  <Input
                    maxLength="10"
                    placeholder="Please input addon code !"
                  />
                </Form.Item>
                <Form.Item
                  name="AddOnName"
                  style={{ marginBottom: 5 }}
                  label="AddOn Name"
                  rules={[
                    {
                      required: true,
                      message: " Please input addon name !",
                    },
                  ]}
                >
                  <Input
                    maxLength="100"
                    placeholder="Please input addon name!"
                  />
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

export default MenuAddonHdr;
