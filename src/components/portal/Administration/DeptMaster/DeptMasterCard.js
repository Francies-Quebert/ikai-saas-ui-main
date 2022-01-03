import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Radio, Button, Row, Col, Card, Input, Spin, Select, Switch } from "antd";
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
import { InsUpdtDeptMaster } from "../../../../store/actions/deptmaster";
import DeptMaster from "../../../../models/deptmaster";
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const { Option } = Select;

const DeptMasterCard = (props) => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [isLoading, setIsLoading] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [branchCode, setBranchCode] = useState(props.formData ? props.formData.BranchCode : "");
  const [deptCode, setCompCode] = useState(
    props.formData ? props.formData.DeptCode : ""
  );
  const branchmaster = useSelector((state) => state.branchMaster.branchMaster);

  const onReset = () => {
    form.resetFields();
  };

  const initialValues = {
    BranchCode: props.formData ? props.formData.BranchCode : "",
    DeptCode: props.formData ? props.formData.DeptCode : "",
    DeptName: props.formData ? props.formData.DeptName : "",
    EnablePurchase: props.formData
      ? props.formData.EnablePurchase === "Y"
        ? true
        : false
      : false,
    EnablePurchaseRertun: props.formData
      ? props.formData.EnablePurchaseRertun === "Y"
        ? true
        : false
      : false,
    EnableSale: props.formData
      ? props.formData.EnableSale === "Y"
        ? true
        : false
      : false,
    EnableSaleReturn: props.formData
      ? props.formData.EnableSaleReturn === "Y"
        ? true
        : false
      : false,
    EnableTransferIN: props.formData
      ? props.formData.EnableTransferIN === "Y"
        ? true
        : false
      : false,
    EnableTransferOUT: props.formData
      ? props.formData.EnableTransferOUT === "Y"
        ? true
        : false
      : false,

    EnableAdjustments: props.formData
      ? props.formData.EnableAdjustments === "Y"
        ? true
        : false
      : false,
    IsActive: props.formData ? props.formData.IsActive.toString() : "true",
  };



  const onFinish = (values) => {
    setIsLoading(true);

    const val = new DeptMaster(
      values.BranchCode,
      values.DeptCode,
      values.DeptName,
      values.EnablePurchase === true ? "Y" : "N",
      values.EnablePurchaseReturn === true ? "Y" : "N",
      values.EnableSale === true ? "Y" : "N",
      values.EnableSaleReturn === true ? "Y" : "N",
      values.EnableTransferIN === true ? "Y" : "N",
      values.EnableTransferOUT === true ? "Y" : "N",
      values.EnableAdjustments === true ? "Y" : "N",
      values.IsActive === "true" ? true : false
    );

    // console.log(val, "Card");
    dispatch(InsUpdtDeptMaster(props.formData ? "U" : "I", val));
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
            <CardHeader title={currentTran.formTitle} />
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
                  label="Branch Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your branch code!",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    disabled={branchCode ? true : false}
                  >
                    {branchmaster.length > 0 &&
                      branchmaster.map((ii) => {
                        return (
                          <Option key={ii.BranchCode} value={ii.BranchCode}>
                            {ii.BranchName}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="DeptCode"
                  style={{ marginBottom: 5 }}
                  label="Department Code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your department code !",
                    },
                  ]}
                >
                  <Input
                    disabled={deptCode ? true : false}
                    maxLength={10}
                    onInput={(e) => {
                      e.target.value = ("" + e.target.value).toUpperCase();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="DeptName"
                  style={{ marginBottom: 5 }}
                  label="Department Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your department name !",
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
                    <Radio value="true">Active</Radio>
                    <Radio value="false">InActive</Radio>
                  </Radio.Group>
                </Form.Item>

                <Divider orientation="left">Additional Config</Divider>

                <Form.Item
                  name="EnablePurchase"
                  style={{ marginBottom: 5 }}
                  label="Purchase"
                  valuePropName="checked"
                >
                  <Switch key="EnablePurchase" checkedChildren={"Yes"}
                    unCheckedChildren={"No"} />
                </Form.Item>
                <Form.Item
                  name="EnablePurchaseReturn"
                  style={{ marginBottom: 5 }}
                  label="Purchase Return"
                  valuePropName="checked"
                >
                  <Switch key="EnablePurchaseReturn" checkedChildren={"Yes"}
                    unCheckedChildren={"No"} />
                </Form.Item>

                <Form.Item
                  name="EnableSale"
                  style={{ marginBottom: 5 }}
                  label="Sale"
                  valuePropName="checked"
                >
                  <Switch key="EnableSale" checkedChildren={"Yes"}
                    unCheckedChildren={"No"} />
                </Form.Item>
                <Form.Item
                  name="EnableSaleReturn"
                  style={{ marginBottom: 5 }}
                  label="Sale Return"
                  valuePropName="checked"
                >
                  <Switch key="EnableSaleReturn" checkedChildren={"Yes"}
                    unCheckedChildren={"No"} />
                </Form.Item>
                <Form.Item
                  name="EnableTransferIN"
                  style={{ marginBottom: 5 }}
                  label="Transfer In"
                  valuePropName="checked"
                >
                  <Switch key="EnableTransferIN" checkedChildren={"Yes"}
                    unCheckedChildren={"No"} />
                </Form.Item>
                <Form.Item
                  name="EnableTransferOut"
                  style={{ marginBottom: 5 }}
                  label="Transfer Out"
                  valuePropName="checked"
                >
                  <Switch key="EnableTransferOut" checkedChildren={"Yes"}
                    unCheckedChildren={"No"} />
                </Form.Item>
                <Form.Item
                  name="EnableAdjustments"
                  style={{ marginBottom: 5 }}
                  label="Adjustments"
                  valuePropName="checked"
                >
                  <Switch key="EnableAdjustments" checkedChildren={"Yes"}
                    unCheckedChildren={"No"} />
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
    </div >
  );
};

export default DeptMasterCard;
