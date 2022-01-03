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
// import { InsUpdtTaxMaster } from "../../../../store/actions/taxMaster";
import TaxMaster from "../../../../models/tax-master";
import swal from "sweetalert";
import { InsUpdtTaxMaster } from "../../../../services/taxMaster";

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

const TaxMasterCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  //   const categoryMaster = useSelector((state) => state.categoryMaster);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    TaxCode: props.formData ? props.formData.TaxCode : "",
    TaxName: props.formData ? props.formData.TaxName : "",
    TaxType: props.formData ? props.formData.TaxType : "",
    TranType: props.formData ? props.formData.TranType : "",
    TaxPer: props.formData ? props.formData.TaxPer : "",
    IGSTPer: props.formData ? props.formData.IGSTPer : "",
    CGSTPer: props.formData ? props.formData.CGSTPer : "",
    SGSTPer: props.formData ? props.formData.SGSTPer : "",
    UTSTPer: props.formData ? props.formData.UTSTPer : "",
    CESSPer: props.formData ? props.formData.CESSPer : "",
    SURCHARGPer: props.formData ? props.formData.SURCHARGPer : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onFinish = (values) => {
    // setIsLoading(true);

    // const val = new TaxMaster(
    //   values.TaxCode,
    //   values.TaxName,
    //   values.TaxType,
    //   values.TranType,
    //   values.TaxPer,
    //   values.IGSTPer,
    //   values.CGSTPer,
    //   values.SGSTPer,
    //   values.UTSTPer,
    //   values.CESSPer,
    //   values.SURCHARGPer,
    //   values.IsActive
    // );

    // // console.log(val, isDefault);
    // dispatch(InsUpdtTaxMaster(val));

    const val = {
      TaxCode: values.TaxCode,
      TaxName: values.TaxName,
      TaxType: values.TaxType,
      TranType: values.TranType,
      TaxPer: values.TaxPer,
      IGSTPer: values.IGSTPer,
      CGSTPer: values.CGSTPer,
      SGSTPer: values.SGSTPer,
      UTSTPer: values.UTSTPer,
      CESSPer: values.CESSPer,
      SURCHARGPer: values.SURCHARGPer,
      IsActive: values.IsActive,
      updt_usrId: l_loginUser,
      CompCode: CompCode,
    };
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((resp) => {
      if (resp) {
        // dispatch(InsUpdtHsnsacMaster(val));
        InsUpdtTaxMaster(val).then((res) => {
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
                  justify="center"
                  name="TaxCode"
                  style={{ marginBottom: 5 }}
                  label="Tax Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input Tax Code",
                    },
                  ]}
                >
                  <Input disabled={props.formData ? true : false} />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="TaxName"
                  style={{ marginBottom: 5 }}
                  label="Tax Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Tax Name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="TaxType"
                  style={{ marginBottom: 5 }}
                  label="Tax Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select your Tax Type",
                    },
                  ]}
                >
                  <Select allowClear showSearch optionFilterProp="children">
                    <Option value="G">GST</Option>
                    <Option value="V">VAT</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="TranType"
                  style={{ marginBottom: 5 }}
                  label="Tran Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select your Tran Type",
                    },
                  ]}
                >
                  <Select allowClear showSearch optionFilterProp="children">
                    <Option value="I">Inward</Option>
                    <Option value="O">Outward</Option>
                    <Option value="B">Both</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  justify="center"
                  name="TaxPer"
                  style={{ marginBottom: 5 }}
                  label="Tax &#37;"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Tax Percentage",
                    },
                  ]}
                >
                  <Input precision={3} max={100} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="IGSTPer"
                  style={{ marginBottom: 5 }}
                  label="IGST &#37;"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter IGST Percentage",
                    },
                  ]}
                >
                  <InputNumber
                    precision={3}
                    max={100}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="CGSTPer"
                  style={{ marginBottom: 5 }}
                  label="CGST &#37;"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter CGST Percentage",
                    },
                  ]}
                >
                  <InputNumber
                    precision={3}
                    max={100}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="SGSTPer"
                  style={{ marginBottom: 5 }}
                  label="SGST &#37;"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter SGST Percentage",
                    },
                  ]}
                >
                  <InputNumber
                    precision={3}
                    max={100}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="UTSTPer"
                  style={{ marginBottom: 5 }}
                  label="UTST &#37;"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter UGST Percentage",
                    },
                  ]}
                >
                  <InputNumber
                    precision={3}
                    max={100}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="CESSPer"
                  style={{ marginBottom: 5 }}
                  label="CESS &#37;"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter CESS Percentage",
                    },
                  ]}
                >
                  <InputNumber
                    precision={3}
                    max={100}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="SURCHARGPer"
                  style={{ marginBottom: 5 }}
                  label="SURCHARG &#37;"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter SURCHARGE Percentage",
                    },
                  ]}
                >
                  <InputNumber
                    precision={3}
                    max={100}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  justify="center"
                  name="IsActive"
                  label="Status"
                  style={{ marginBottom: 5 }}
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

export default TaxMasterCard;
