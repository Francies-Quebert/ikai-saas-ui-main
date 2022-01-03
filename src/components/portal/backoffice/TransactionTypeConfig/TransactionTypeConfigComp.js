import React, { useState, useEffect } from "react";
import {
  Radio,
  Input,
  Form,
  Row,
  Col,
  Card,
  Select,
  Button,
  Divider,
  Modal,
} from "antd";
import Icon, {
  SaveOutlined,
  RetweetOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchMaster } from "../../../../store/actions/branchmaster";
import {
  fetchTransactionTypeMaster,
  InsUpdtTransactionTypeConfig,
} from "../../../../services/transaction-type-master";
import swal from "sweetalert";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const TransactionTypeConfigComp = (props) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [tranType, setTranType] = useState([]);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchTransactionTypeMaster(CompCode).then((res) => {
      setTranType(res);
    });
    //console.log(props.branch, props.tranType);
  }, []);

  const onFinish = (values) => {
    let data = {
      CompCode: CompCode,
      BranchCode: props.branch,
      TranTypeCode: props.tranType,
      ConfigCode: values.ConfigCode,
      ConfigDesc: values.ConfigDescription,
      SysOption1: null,
      SysOption2: null,
      SysOption3: null,
      SysOption4: null,
      SysOption5: null,
      IsActive: values.IsActive,
      UpdtUsr: l_loginUser,
    };
    swal("Are you sure you want to save this ..!", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsUpdtTransactionTypeConfig(CompCode, data).then((res) => {
          if (res.data.message === "successful") {
            // fnDefault();
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            // setItemcode();
            form.resetFields();
            props.onSave(data);
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

  const initialValues = {
    CompCode: CompCode,
    BranchCode: props.branch ? props.branch : null,
    TransactionType: props.tranType ? props.tranType : null,
    ConfigCode: props.data ? props.data.ConfigCode : null,
    ConfigDescription: props.data ? props.data.ConfigDesc : null,
    IsActive: true,
  };
  const onReset = (val) => {
    form.resetFields();
  };

  return (
    <>
      <Card>
        <Form
          labelAlign="left"
          name="userbody"
          {...formItemLayout}
          form={form}
          onFinish={onFinish}
          initialValues={initialValues}
        >
          {/* <Form.Item
            name="BranchCode"
            style={{ marginBottom: 5 }}
            label="Branch"
            rules={[{ required: true, message: "Please Select Branch" }]}
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder="Please Select Branch"
            >
              {branchMaster.length > 0 &&
                branchMaster
                  .filter((i) => i.IsActive)
                  .map((i) => {
                    return (
                      <Option key={i.BranchCode} value={i.BranchCode}>
                        {i.BranchName}
                      </Option>
                    );
                  })}
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            name="TransactionType"
            style={{ marginBottom: 5 }}
            label="Transaction Type"
            rules={[{ required: true, message: "Please Select Branch" }]}
          >
            <Select
              allowClear
              showSearch 
              optionFilterProp="children"
              placeholder="Please Select Transaction Type"
            >
              {tranType.length > 0 &&
                tranType
                  .filter((a) => a.IsActive)
                  .map((a) => {
                    return (
                      <Option key={a.TranTypeCode} value={a.TranTypeCode}>
                        {a.TranTypeName}
                      </Option>
                    );
                  })}
            </Select>
          </Form.Item> */}
          <Form.Item
            name="ConfigCode"
            style={{ marginBottom: 5 }}
            label="Config Code"
            rules={[{ required: true, message: "Please Enter Config Code" }]}
          >
            <Input disabled={props.data ? true : false} />
          </Form.Item>
          <Form.Item
            name="ConfigDescription"
            style={{ marginBottom: 5 }}
            label="Config Description"
            rules={[
              { required: true, message: "Please Enter Config Description" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="IsActive"
            label="Status"
            style={{ marginBottom: 5 }}
            rules={[{ required: true, message: "Please Select Status" }]}
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
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default TransactionTypeConfigComp;
