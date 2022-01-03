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
import HomeScreenAppLayout from "../../../../models/homescreen-app-layout";
import { InsUpdtHomeScreenAppLayout } from "../../../../store/actions/homescreen-app-layout";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const HomeScreenAppLayoutCard = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const [aa, aaa] = useState(
    props.formData ? (props.formData.AutoPlay === "Y" ? true : false) : false
  );
  const currentTran = useSelector((state) => state.currentTran);

  const initialValues = {
    LayoutId: props.formData ? props.formData.LayoutId : 0,
    LayoutTitle: props.formData ? props.formData.LayoutTitle : "",
    LayoutType: props.formData ? props.formData.LayoutType : "",
    FrameHeight: props.formData ? props.formData.FrameHeight : "",
    AutoPlay: props.formData
      ? props.formData.AutoPlay === "Y"
        ? true
        : false
      : false,
    AutoPlayDuration: props.formData ? props.formData.AutoPlayDuration : "",
    CmptHeight: props.formData ? props.formData.CmptHeight : "",
    CmptWidth: props.formData ? props.formData.CmptWidth : "",
    CmptShowTitle: props.formData
      ? props.formData.CmptShowTitle === "Y"
        ? true
        : false
      : false,
    OrderBy: props.formData ? props.formData.OrderBy : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    setIsLoading(true);

    const val = new HomeScreenAppLayout(
      values.LayoutId ? values.LayoutId : initialValues.LayoutId,
      values.LayoutTitle,
      values.LayoutType,
      values.FrameHeight,
      values.AutoPlay === true ? "Y" : "N",
      values.AutoPlayDuration,
      values.CmptHeight,
      values.CmptWidth,
      values.CmptShowTitle === true ? "Y" : "N",
      values.OrderBy,
      values.IsActive === true ? true : false
    );
    // console.log(val, "jeey");
    dispatch(InsUpdtHomeScreenAppLayout(val));
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
            <CardHeader title="App Layout Form" />
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
                  name="LayoutTitle"
                  style={{ marginBottom: 5 }}
                  label="Layout Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input layout title!",
                    },
                  ]}
                >
                  <Input placeholder="Please input layout title!" />
                </Form.Item>
                <Form.Item
                  name="LayoutType"
                  style={{ marginBottom: 5 }}
                  label="Layout Type "
                  rules={[
                    { required: true, message: " Please input layout type!" },
                  ]}
                >
                  <Input placeholder="Please input layout type!" />
                </Form.Item>
                <Form.Item
                  name="FrameHeight"
                  style={{ marginBottom: 5 }}
                  label="Frame Height"
                  rules={[
                    { required: true, message: " Please input frame height!" },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Please input frame height!"
                  />
                </Form.Item>
                <Form.Item
                  name="AutoPlay"
                  style={{ marginBottom: 5 }}
                  label="AutoPlay"
                  valuePropName="checked"
                >
                  <Switch
                    key="Autoplay"
                    onChange={(e) => {
                      aaa(e);
                    }}
                  />
                </Form.Item>
                {aa && (
                  <Form.Item
                    name="AutoPlayDuration"
                    style={{ marginBottom: 5 }}
                    label="AutoPlay Duration"
                  >
                    <Input placeholder="Please input duration in seconds" />
                  </Form.Item>
                )}

                <Form.Item
                  name="CmptHeight"
                  style={{ marginBottom: 5 }}
                  label="Component Height"
                >
                  <Input placeholder="Please input component height" />
                </Form.Item>
                <Form.Item
                  name="CmptWidth"
                  style={{ marginBottom: 5 }}
                  label="Component Width "
                >
                  <Input placeholder="Please input component width" />
                </Form.Item>
                <Form.Item
                  name="CmptShowTitle"
                  style={{ marginBottom: 5 }}
                  label="Component Show Title"
                  valuePropName="checked"
                >
                  <Switch key="CmptShowTitle" />
                </Form.Item>
                <Form.Item
                  name="OrderBy"
                  style={{ marginBottom: 5 }}
                  label="Order By"
                >
                  <Input type="number" placeholder="Please input order by" />
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

export default HomeScreenAppLayoutCard;
