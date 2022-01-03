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
  Checkbox,
  Spin,
} from "antd";
import CardHeader from "../../../common/CardHeader";
import CKEditors from "react-ckeditor-component";
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
import { InsUpdtFAQMasterPortal } from "../../../../store/actions/helpmaster";
import FAQMaster from "../../../../models/faqmaster-portal";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const FAQMasterCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const {TextArea} = Input;
  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    Id: props.formData ? props.formData.Id : 0,
    Question: props.formData ? props.formData.Question : "",
    Answer: props.formData ? props.formData.Answer : "",
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };

  const onFinish = (values) => {
    setIsLoading(true);
    const val = new FAQMaster(
      values.Id ? values.Id : initialValues.Id,
      values.Question,
      values.Answer,
      values.IsActive === "true" ? true : false
    );
    // console.log(val);
    dispatch(InsUpdtFAQMasterPortal(props.formData ? "U" : "I", val));
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
      {" "}
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={0.37}>
            <CardHeader title={currentTran.formTitle} />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Form
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item
                  name="Question"
                  style={{ marginBottom: 5 }}
                  label="FAQ Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your faq title!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="Answer"
                  label="Faq Description"
                >
                  <TextArea rows={5}/>
                </Form.Item>

                <Form.Item
                  name="IsActive"
                  label="Status"
                  style={{ marginBottom: 5 }}
                  rules={[{ required: true, message: "Please select Status!" }]}
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

export default FAQMasterCard;
