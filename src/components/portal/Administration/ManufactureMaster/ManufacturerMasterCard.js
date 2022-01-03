import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Radio, Button, Row, Col, Card, Input, Spin } from "antd";
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
// import { InsUpdtManufacturerMaster } from "../../../../store/actions/manufactureMaster";
import ManufacturerMaster from "../../../../models/manufacturermaster";
import swal from "sweetalert";
import {
  InsUpdtManufacturerMaster,
  fetchMNFRMasterCard,
} from "../../../../services/manufacturer-master";
import { fetchSequenceNextVal } from "../../../../shared/utility";
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const ManufacturerMasterCard = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [iCode, setICode] = useState(
    props.formData ? props.formData.MfrCode : 0
  );
  const [iCodeDisable, setICodeDisable] = useState(
    props.formData ? true : false
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [mfrCode, setMfrcode] = useState(
    props.formData ? props.formData.MfrCode : ""
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    MfrCode: props.formData ? props.formData.MfrCode : iCode,
    MfrDesc: props.formData ? props.formData.MfrDesc : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const mapData = (data) => {
    data.map(async (i) => {
      await form.setFieldsValue({
        MfrCode: i.MfrCode,
        MfrDesc: i.MfrDesc,
        IsActive: i.IsActive,
      });
    });
    setICodeDisable(true);
  };

  const onFinish = (values) => {
    const data = {
      InsUpdtType: props.formData ? "U" : "I",
      MfrCode: values.MfrCode,
      MfrDesc: values.MfrDesc,
      IsActive: values.IsActive,
      UpdtUsr: l_loginUser,
    };
    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtManufacturerMaster(CompCode, data).then((res) => {
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

  useEffect(() => {
    if (props.entryMode === "A") {
      fetchSequenceNextVal(CompCode,"MNFR", l_loginUser).then((seqNextVal) => {
        if (seqNextVal.length > 0) {
          form.setFieldsValue({
            MfrCode: seqNextVal[0].NextVal,
          });
          if (seqNextVal[0].NextVal) {
            setICodeDisable(true);
            setICode(seqNextVal[0].NextVal);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    fetchMNFRMasterCard(CompCode, iCode).then((resp) => {
      try {
        if (resp.length > 0) {
          if (props.entryMode === "A") {
            swal(
              "Are you sure you want to edit this item?",
              `This Manufacturer code: ${iCode} already exist`,
              {
                buttons: ["Cancel", "Yes!"],
              }
            ).then(async (val) => {
              if (val) {
                // await mapData(resp);
                setIsLoading(false);
              } else {
                props.onBackPress();
              }
            });
          } else {
            // mapData(resp);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  }, [iCode]);

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col flex={1}>
            <CardHeader
              title={props.title ? props.title : currentTran.formTitle}
            />
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
                  name="MfrCode"
                  style={{ marginBottom: 5 }}
                  label="Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your manufacturer code !",
                    },
                  ]}
                >
                  <Input
                    disabled={iCodeDisable}
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="MfrDesc"
                  style={{ marginBottom: 5 }}
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your manufacturer descriptions!",
                    },
                  ]}
                >
                  <Input />
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

export default ManufacturerMasterCard;
