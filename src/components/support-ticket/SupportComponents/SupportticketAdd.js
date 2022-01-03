import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Form,
  Radio,
  Alert,
  Button,
  Row,
  Col,
  Card,
  Input,
  Spin,
  Select,
  Checkbox,
  Modal,
  Cascader,
  Switch,
} from "antd";
import { setSelectedPatient } from "../../../store/actions/currentOrder";
import { toast } from "react-toastify";
import { saveHelpCenterTran } from "../../../store/actions/help";
import HelpCenterTran from "../../../models/helpcenter_tran";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import UserMasterCardNew from "../../portal/backoffice/UserMaster/UserMasterCardNew";
import CardHeader from "../../common/CardHeader";
import {
  reInitialize,
  setFormCaption,
} from "../../../store/actions/currentTran";

import { Divider } from "antd";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  FileAddOutlined,
  RetweetOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import CustomerSelectionComponent from "../../dashboard/Restaurant/components/SubComponents/CustomerSelectionComponent";
import { getUserByMobile } from "../../../services/user-master";
import { hasRightToBeUsedNext } from "../../../shared/utility";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SupportTicketAddCard = (props) => {
  const { Option } = Select;
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [error, seterror] = useState(false);
  const [form] = Form.useForm();
  const [isShowCustomerModal, setIsShowCustomerModal] = useState(false);
  const currentTran = useSelector((state) => state.currentTran);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const userMaster = useSelector((state) => state.userMaster);
  const appMain = useSelector((state) => state.AppMain);
  
  // const currentTran = useSelector((state) => state.currentTran);
  const initialValues = {
    CustMobNo: "",
    userId: null,
    OrderNo: "",
    HelpDescription: "",
  };

  useEffect(() => {
    form.resetFields();
    dispatch(fetchUserMasters("U"));
  }, []);
  useEffect(() => {
    if (currentTran.isSuccess) {
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);

  const onReset = () => {
    setSelectedCustomer();
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      setIsLoading(true);
      dispatch(
        saveHelpCenterTran(
          "A",
          null,
          values.userId > 0 ? "U" : null,
          values.userId,
          values.CustMobNo,
          values.OrderNo.length > 0 ? values.OrderNo : null,
          values.HelpDescription,
          "PND"
        )
      );
      dispatch(reInitialize());
      props.onBackPress();
    } catch (err) {}
  };
  return (
    <div>
      <CardHeader title="Add Support Ticket" />
      <Row>
        <Col flex={1}>
          <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
            <Form
              form={form}
              name="userbody"
              labelAlign="left"
              initialValues={initialValues}
              {...formItemLayout}
              onFinish={onFinish}
            >
              <Form.Item
                name="CustMobNo"
                style={{ marginBottom: 5 }}
                label="Mobile No:"
                rules={[
                  { required: true, message: "Please input mobile number!" },
                ]}
              >
                <Input
                  maxLength={10}
                  placeholder="Mobile Number"
                  addonBefore={"+91"}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: 5, height: 40 }}
                label="Customer Name:"
              >
                <div style={{ display: "flex" }}>
                  <Form.Item
                    name="userId"
                    style={{ flex: 1 }}
                    // label="Customer Name:"
                  >
                    <Select
                      showSearch
                      allowClear={true}
                      style={{ width: "100%" }}
                      placeholder="Select a Customer"
                      onChange={(item, data) => {
                        // console.log(item, data.data);
                        form.setFieldsValue({
                          CustMobNo: data ? data.data : null,
                        });
                      }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .indexOf(input.toString().toLowerCase()) >= 0
                      }
                      loading={userMaster.isLoading}
                    >
                      {userMaster.customerMasters.length > 0 &&
                        userMaster.customerMasters.map((item) => {
                          return (
                            <Option
                              key={item.userId}
                              value={item.userId}
                              data={item.mobile}
                            >
                              {item.Name} ({item.mobile})
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                  <div
                    style={{
                      marginLeft: 8,
                    }}
                  >
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<FileAddOutlined />}
                      size={"medium"}
                      onClick={() => {
                        setIsShowCustomerModal(true);
                      }}
                      disabled={hasRightToBeUsedNext(currentTran.moduleRights,"ADD")}
                      // disabled={
                      //   appMain.userMenu
                      //     .filter((ii) => ii.ModGroupId === 8)[0]
                      //     .children.filter((iii) => iii.Id === 5)[0]
                      //     .Rights.filter(
                      //       (rit) =>
                      //         rit.RightCode === "ADD" && rit.RightVal === "Y"
                      //     ).length <= 0
                      // }
                    />
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                name="OrderNo"
                style={{ marginBottom: 5 }}
                label="Order No :"
              >
                <Input
                  maxLength={10}
                  onInput={(e) => {
                    e.target.value = ("" + e.target.value).toUpperCase();
                  }}
                />
              </Form.Item>
              <Form.Item
                name="HelpDescription"
                style={{ marginBottom: 5 }}
                label="Description :"
                rules={[
                  {
                    required: true,
                    message: "Please Enter description",
                  },
                ]}
              >
                <Input.TextArea rows={6} maxLength={10} />
              </Form.Item>

              <Divider
                style={{ marginBottom: 5, marginTop: 5, paddingBottom: 10 }}
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
              <Modal
                visible={isShowCustomerModal}
                onCancel={() => {
                  setIsShowCustomerModal(false);
                }}
                footer={null}
                bodyStyle={{ padding: 0 }}
                closable={false}
                width={750}
                destroyOnClose={true}
              >
                <CustomerSelectionComponent
                  onCustomerSet={(values) => {
                    dispatch(fetchUserMasters("U"));
                    getUserByMobile("U", values.customer.mobileNo).then(
                      (res) => {
                        form.setFieldsValue({
                          CustMobNo: res[0].mobile,
                          userId: res[0].UserId,
                        });
                      }
                    );
                    setIsShowCustomerModal(false);
                  }}
                  data={{ customer: { userId: null } }}
                  onBackPress={() => setIsShowCustomerModal(false)}
                />
                {/* <UserMasterCardNew
                  trnType="U"
                  onBackPress={() => {
                    setIsShowCustomerModal(false);
                  }}
                  showUserCredentials={false}
                  onBackPress={() => setIsShowCustomerModal(false)}
                /> */}
              </Modal>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupportTicketAddCard;
