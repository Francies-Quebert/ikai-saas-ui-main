import React, { useEffect, useState } from "react";
import Icon, {
  SaveOutlined,
  RetweetOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Form, Button, Select, Card, Radio, Modal, Input, Divider } from "antd";
import { fetchSectionMaster } from "../../../../services/section-master";
import { useDispatch, useSelector } from "react-redux";
import { fetchTablesMaster } from "../../../../store/actions/tablesmaster";
import swal from "sweetalert";
import { InsConfigureTableQR } from "../../../../services/configure-table-qr";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const ConfigTableQRComp = (props) => {
  const [form] = Form.useForm();
  const [secData, setSecData] = useState([]);
  const [section, setSection] = useState();
  const tablesMaster = useSelector((state) => state.tablesMaster.tablesMaster);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  // const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const dispatch = useDispatch();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(fetchTablesMaster());
    fetchSectionMaster(CompCode).then((res) => {
      setSecData(res);
    });
  }, []);

  const initialValues = {
    CompCode: CompCode,
    BranchCode: props.data ? props.data.branch : "",
    DeptType: props.data ? props.data.department : "",
    TableSecCode: null,
    TableCode: null,
    TableName: null,
    SecretKey: null,
    IsActive: true,
  };

  const onFinish = (values) => {
    const data = {
      CompCode: CompCode,
      BranchCode: props.data ? props.data.branch : "",
      DeptType: props.data ? props.data.department : "",
      TableSecCode: values.TableSecCode,
      TableCode: values.TableCode,
      TableName:
        tablesMaster.length > 0 &&
        tablesMaster.find((i) => i.ShortCode === values.TableCode).TableName,
      SecretKey: values.SecretKey,
      IsActive: values.IsActive,
      updt_usr: l_loginUser,
    };
    swal("Are you sure you want to save", {
      buttons: ["Cancel", "Yes!"],
    }).then((val) => {
      if (val) {
        InsConfigureTableQR(CompCode, data).then((res) => {
          if (res.data.message === "successful") {
            swal("Data saved successfully   !!!", {
              icon: "success",
            });
            props.onSavePress(data);
            props.onBackPress();
            form.resetFields();
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

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Card>
        <Form
          labelAlign="left"
          name="userbody"
          {...formItemLayout}
          initialValues={initialValues}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="TableSecCode"
            style={{ marginBottom: 5 }}
            label="Section"
            rules={[{ required: true, message: "Please Select Section" }]}
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder="Please Select Section"
              onChange={(val) => {
                setSection(val);
              }}
            >
              {secData.length > 0 &&
                secData
                  .filter((i) => i.IsActive)
                  .map((item) => {
                    return (
                      <Select.Option key={item.SecCode} value={item.SecCode}>
                        {item.SecDesc}
                      </Select.Option>
                    );
                  })}
            </Select>
          </Form.Item>
          <Form.Item
            name="TableCode"
            style={{ marginBottom: 5 }}
            label="Table Code "
            rules={[{ required: true, message: "Please Select Table!" }]}
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder="Please Select Table"
            >
              {tablesMaster.length > 0 &&
                tablesMaster
                  .filter((i) => i.SecCode === section && i.IsActive)
                  .map((item) => {
                    return (
                      <Select.Option
                        key={item.ShortCode}
                        value={item.ShortCode}
                      >
                        {item.TableName}
                      </Select.Option>
                    );
                  })}
            </Select>
          </Form.Item>
          <Form.Item
            name="SecretKey"
            style={{ marginBottom: 5 }}
            label="Secret Key"
            rules={[{ required: true, message: "Please Enter Secret Key!" }]}
          >
            <Input placeholder={"Please Enter Secret Key!"} />
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

export default ConfigTableQRComp;
