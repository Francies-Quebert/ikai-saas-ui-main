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
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import { Divider } from "antd";
// import { InsUpdtClassMaster } from "../../../../store/actions/ClassMaster";
import { useDispatch, useSelector } from "react-redux";
import ClassMaster from "../../../../models/ClassMaster";
import { reInitialize } from "../../../../store/actions/currentTran";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { InsUpdtClassMaster } from "../../../../services/class-master";
import { useHotkeys } from "react-hotkeys-hook";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const ClassMasterCard = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const initialValues = {
    ClassId: props.formData ? props.formData.ClassId : 0,
    ClassCode: props.formData ? props.formData.ClassCode : "",
    ClassName: props.formData ? props.formData.ClassName : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onReset = () => {
    form.resetFields();
  };

  useHotkeys("ctrl+s", (e) => {
    e.preventDefault();
    form.submit();
  });

  const onFinish = (values) => {
    // setIsLoading(true);
    // const val = new ClassMaster(
    //   values.ClassId ? values.ClassId : initialValues.ClassId,
    //   values.ClassCode,
    //   values.ClassName,
    //   values.IsActive
    // );
    // dispatch(InsUpdtClassMaster(props.formData ? "U" : "I", val));
    // props.onSavePress(values);
    const data = {
      InsUpdtType: props.formData ? "U" : "I",
      ClassId: values.ClassId,
      ClassCode: values.ClassCode.toUpperCase(),
      ClassName: values.ClassName,
      IsActive: values.IsActive,
      updt_usr: l_loginUser,
    };

    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtClassMaster(CompCode, data).then((res) => {
          if (res.data.message === "successful") {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress(values);
            props.onBackPress();
          } else if (res.data.message === "unsuccessful") {
            swal(
              `${
                res.data.data.code === "ER_DUP_ENTRY"
                  ? "Duplicate Entry"
                  : "Something Went Wrong Try Again Later...."
              }`,
              {
                icon: "error",
              }
            );
          }
        });
      }
    });
  };

  // useEffect(() => {
  //   if (currentTran.isSuccess) {
  //     form.resetFields();
  //     dispatch(reInitialize());
  //     props.onBackPress();
  //   } else if (currentTran.error) {
  //     toast.error(currentTran.error);
  //   }
  //   setIsLoading(false);
  // }, [currentTran.error, currentTran.isSuccess]);

  return (
    <div>
      <CardHeader title={props.title ? props.title : currentTran.formTitle} />
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
                name="ClassCode"
                style={{ marginBottom: 5 }}
                label="Class Code :"
                rules={[{ required: true, message: "Please Enter Class Code" }]}
              >
                <Input
                  disabled={props.formData ? true : false}
                  maxLength={10}
                  style={{ textTransform: "uppercase" }}
                />
              </Form.Item>
              <Form.Item
                name="ClassName"
                style={{ marginBottom: 5 }}
                label="Class Name :"
                rules={[
                  { required: true, message: " Class Name is required!" },
                ]}
              >
                <Input maxLength={100} />
              </Form.Item>

              <Form.Item
                name="IsActive"
                label="Status :"
                style={{ marginBottom: 5 }}
                // rules={[{ required: true, message: "Please select Status!" }]}
              >
                <Radio.Group>
                  <Radio value={true}>Active</Radio>
                  <Radio value={false}>InActive</Radio>
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

export default ClassMasterCard;
