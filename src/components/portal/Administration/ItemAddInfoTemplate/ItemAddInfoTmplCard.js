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
  message,
} from "antd";
import { Divider } from "antd";
import { toast } from "react-toastify";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import ItemAddInfoDtlTable, { getIsEditing } from "./ItemAddInfoDtlTable";
import ItemAddInfoHdr from "../../../../models/item-add-info-tmpl-hdr";
import { reInitialize } from "../../../../store/actions/currentTran";
import { InsUpdtItemAddInfoTemplHdr } from "../../../../store/actions/ItemAddInfoTemplate";
import { InsUpdtItemInfoTemplate } from "../../../../services/item-add-info-template";
import swal from "sweetalert";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const ItemAddInfoTmplCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const setAddInfoTemplate = useSelector(
    (state) => state.itemAddInfoTemplate.templDtl
  );
  const l_LoginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [status, setStatus] = useState(
    props.formData ? props.formData.IsActive : true
  );
  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    TempId: props.formData ? props.formData.TempId : 0,
    TemplateName: props.formData ? props.formData.TemplateName : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onFinish = (values) => {
    if (getIsEditing()) {
      message.error("Please save your data");
      return false;
    }
    // console.log(props.formData.TempId, values);
    const data = {
      Hdr: {
        InsUpdtType: props.formData ? "U" : "I",
        TempId: initialValues.TempId,
        TemplateName: values.TemplateName,
        IsActive: values.IsActive,
        updt_usrId: l_LoginUser,
      },
      Dtl: setAddInfoTemplate,
    };
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((resp) => {
      if (resp) {
        InsUpdtItemInfoTemplate(data).then((res) => {
          if (res.data.message === "successful") {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onBackPress();
            props.onSavePress(...res.data.data);
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

    // setIsLoading(true);
    // const val = new ItemAddInfoHdr(tempId, values.TemplateName, status);
    // dispatch(
    //   InsUpdtItemAddInfoTemplHdr(
    //     props.formData ? "U" : "I",
    //     val,
    //     setAddInfoTemplate
    //   )
    // );
    // props.onSavePress(values);
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
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col span={24}>
            <CardHeader
              title={props.title ? props.title : currentTran.formTitle}
            />
            <Card bordered={true} bodyStyle={{ padding: 5 }}>
              <Form
                labelAlign="left"
                form={form}
                initialValues={initialValues}
                name="userbody"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Row gutter={[8, 0]}>
                  <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                    <Form.Item
                      name="TemplateName"
                      style={{ marginBottom: 5 }}
                      label="Template Name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your template name",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                    <Form.Item
                      name="IsActive"
                      style={{ marginBottom: 5 }}
                      label="Active"
                      rules={[
                        {
                          required: true,
                          message: "Please input your status",
                        },
                      ]}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider style={{ marginBottom: 5, marginTop: 5 }} />
                <div>
                  <ItemAddInfoDtlTable TempId={initialValues.TempId} />
                </div>

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

export default ItemAddInfoTmplCard;
