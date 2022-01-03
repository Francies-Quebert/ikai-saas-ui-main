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
  Upload,
  message,
  Divider,
  Select,
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
import { UploadImageFirebase } from "../../../../shared/utility";
import { reInitialize } from "../../../../store/actions/currentTran";
import { fetchDeptMaster } from "../../../../store/actions/deptmaster";
import {
  InsUpdtSectionMaster,
  fetchSectionMaster,
  InsUpdtSecMaster,
} from "../../../../services/section-master";
import SectionMaster from "../../../../models/section-master";
import swal from "sweetalert";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SectionMasterCard = (props) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [imageLoading, setImageLoading] = useState(false);
  const [url, setUrl] = useState(props.formData ? props.formData.ImageURL : "");
  const branch = useSelector((state) => state.branchMaster.branchMaster);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const initialValues = {
    SecCode: props.formData ? props.formData.SecCode : "",
    BranchCode: props.formData ? props.formData.BranchCode : null,
    SecDesc: props.formData ? props.formData.SecDesc : "",
    ImageURL: props.formData ? props.formData.ImageURL : "",
    IsActive: props.formData ? props.formData.IsActive : true,
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    // setIsLoading(true);
    // const val = new SectionMaster(
    //   values.SecCode,
    //   values.BranchCode,
    //   values.SecDesc,
    //   url,
    //   values.IsActive === true ? true : false
    // );
    // // console.log(val);
    // dispatch(InsUpdtSectionMaster(val));

    const data = {
      SecCode: values.SecCode,
      BranchCode: values.BranchCode,
      SecDesc: values.SecDesc,
      ImageURL: values.ImageURL,
      IsActive: values.IsActive,
      updt_usr: l_loginUser,
    };

    swal("Are you sure you want to save this item", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtSecMaster(data).then((res) => {
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
          <Col flex={0.37}>
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
                  name="BranchCode"
                  style={{ marginBottom: 5 }}
                  label="Branch Code :"
                  rules={[
                    {
                      required: true,
                      message: "Please select your branch code!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear={true}
                    optionFilterProp="children"
                    placeholder="Select Branch Code"
                    disabled={props.formData ? true : false}
                  >
                    {branch &&
                      branch.map((h) => {
                        return (
                          <Option key={h.BranchCode} value={h.BranchCode}>
                            {h.BranchName}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="SecCode"
                  style={{ marginBottom: 5 }}
                  label="Section Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your section code!",
                    },
                  ]}
                >
                  <Input
                    disabled={props.formData ? true : false}
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                    placeholder="Please input section code!"
                  />
                </Form.Item>
                <Form.Item
                  name="SecDesc"
                  style={{ marginBottom: 5 }}
                  label="Section Description"
                >
                  <Input placeholder="Please input section description!" />
                </Form.Item>
                <Form.Item
                  name="ImageURL"
                  style={{ marginBottom: 5 }}
                  label="Section Image"
                  valuePropName="upload"
                >
                  <Upload
                    style={{ width: "128px", height: "128px" }}
                    beforeUpload={(file) => {
                      return new Promise(function (resolve, reject) {
                        if (file.size / 1024 <= 3000) {
                          return resolve(true);
                        } else {
                          message.error("Image must smaller than 3MB!");
                          return reject(false);
                        }
                      });
                    }}
                    action={(file) => {
                      setImageLoading(true);
                      return new Promise(function (resolve, reject) {
                        UploadImageFirebase(`Section Images`, file).then(
                          (res) => {
                            setUrl(res.url);
                            setImageLoading(false);
                          }
                        );
                      });
                    }}
                    listType="picture-card"
                    multiple={false}
                  >
                    {url ? (
                      <img src={url} style={{ width: "100%" }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
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

export default SectionMasterCard;
