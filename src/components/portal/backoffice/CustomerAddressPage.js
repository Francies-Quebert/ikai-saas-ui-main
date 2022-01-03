import React, { useEffect, useState } from "react";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import {
  Button,
  Spin,
  Row,
  Col,
  Card,
  Select,
  Table,
  Typography,
  Empty,
  Checkbox,
  Modal,
  Divider,
} from "antd";
import _ from "lodash";
import CardHeader from "../../common/CardHeader";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import {
  LoadingOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  RetweetOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import {
  getCustomerAddress,
  InsUpdtCustomerAddress,
} from "../../../services/customer-address";
import CustomerAddressCard from "./CustomerAddress/CustomerAddressCard";

const CustomerAddressPage = (props) => {
  const { Option } = Select;
  const { Text } = Typography;
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const dispatch = useDispatch();

  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [entryData, setEntryData] = useState();
  const [selectedUserId, setSelectedUserId] = useState();
  const [customerAddress, setCustomerAddress] = useState([]);
  const [addressModal, setAddressModal] = useState(false);

  //useSelector
  const currTran = useSelector((state) => state.currentTran);
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  //useEffect
  useEffect(() => {
    dispatch(setFormCaption(71));
    dispatch(fetchUserMasters("U"));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      // onReset();
      setIsLoading(true);
      setCustomerAddress([]);
      getCustomerAddress(CompCode, "U", selectedUserId).then((data) =>
        setCustomerAddress(data)
      );
      setIsLoading(false);
    }
  }, [currTran.lastSavedData]);

  const onReset = () => {
    setSelectedUserId();
    setCustomerAddress([]);
  };
  const closeAddressModal = () => {
    setAddressModal(false);
    setEntryData();
  };

  const columns = [
    {
      title: "Sr.No",
      key: "key",
      width: "8%",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseInt(record.key) + 1}</Text>
          </>
        );
      },
    },
    {
      title: "Address",
      key: "key",
      align: "center",

      render: (value, record, index) => {
        return (
          <>
            <Text>
              {record.add1},{record.add2},{record.add3}
            </Text>
          </>
        );
      },
    },
    {
      title: "City",
      key: "key",
      width: "10%",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{record.City}</Text>
          </>
        );
      },
    },
    {
      title: "Pincode",
      key: "key",
      width: "10%",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{record.PinCode}</Text>
          </>
        );
      },
    },
    {
      title: "Address Tag",
      key: "key",
      width: "12%",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{record.AddressTag}</Text>
          </>
        );
      },
    },
    {
      title: "IsDefault",
      key: "key",
      width: "10%",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Checkbox
              checked={
                record.IsDefault && parseInt(record.IsDefault) === 1
                  ? true
                  : false
              }
            />
          </>
        );
      },
    },
    {
      title: "",
      key: "x",
      width: "8%",
      align: "center",
      render: (value, record) => {
        return (
          <>
            <a
              style={{ marginRight: 10 }}
              onClick={() => {
                setEntryData({ formData: record });
                setAddressModal(true);
              }}
            >
              <EditTwoTone />
            </a>
            <a
              onClick={() => {
                record.MarkDeleted = "Y";
                setCustomerAddress(
                  customerAddress.filter((ii) => ii.key !== record.key)
                );
                let data = { ...record, IsDefault: parseInt(record.IsDefault) };
                dispatch(InsUpdtCustomerAddress(data));
              }}
            >
              <DeleteTwoTone />
            </a>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col span={24}>
            <CardHeader title={currTran.formTitle} />
            <Card
              bordered={true}
              bodyStyle={{
                padding: "0px 0px 5px 0px",
                borderRight: "1px solid #F0F0F0",
              }}
            >
              <Card bordered={false} bodyStyle={{ padding: "5px 12px" }}>
                <Select
                  allowClear={true}
                  showSearch
                  disabled={customerAddress.length > 0}
                  style={{ width: 300, marginRight: 10 }}
                  placeholder={"Select Customer"}
                  value={selectedUserId}
                  onChange={(value) => setSelectedUserId(value)}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .indexOf(input.toString().toLowerCase()) >= 0
                  }
                >
                  {customer.length > 0 &&
                    customer.map((item) => {
                      return (
                        <Option
                          key={item.userId}
                          value={item.userId}
                        >{`${item.Name} (${item.mobile})`}</Option>
                      );
                    })}
                </Select>
                <Button
                  type="primary"
                  disabled={!selectedUserId || customerAddress.length > 0}
                  style={{ marginRight: 10 }}
                  icon={<SearchOutlined />}
                  onClick={() => {
                    setIsLoading(true);
                    setCustomerAddress([]);
                    getCustomerAddress(
                      CompCode,
                      "U",
                      selectedUserId
                    ).then((data) => setCustomerAddress(data));
                    setIsLoading(false);
                  }}
                >
                  Show
                </Button>

                <Button
                  type="primary"
                  icon={<RetweetOutlined />}
                  style={{ marginRight: 10 }}
                  onClick={() => onReset()}
                >
                  Reset
                </Button>
              </Card>
              <Divider
                type="horizontal"
                style={{ marginBottom: 5, marginTop: 5 }}
              />
              <Card bordered={false} bodyStyle={{ padding: "0px 10px" }}>
                <Button
                  type="primary"
                  disabled={!selectedUserId}
                  icon={<PlusCircleOutlined />}
                  onClick={() => {
                    setAddressModal(true);
                  }}
                  style={{ marginBottom: 5 }}
                >
                  Add New Address
                </Button>
                {customerAddress.length > 0 ? (
                  <Table
                    bordered={true}
                    dataSource={customerAddress}
                    columns={columns}
                    pagination={false}
                  />
                ) : (
                  <Empty />
                )}
                <Modal
                  closable={true}
                  visible={addressModal}
                  onCancel={closeAddressModal}
                  footer={null}
                  bodyStyle={{ padding: "0px 0px" }}
                  destroyOnClose={true}
                >
                  <CustomerAddressCard
                    onBackPress={() => {
                      setAddressModal(false);
                      setEntryData();
                    }}
                    formData={entryData && entryData.formData}
                    userId={selectedUserId}
                  />
                </Modal>
              </Card>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default CustomerAddressPage;
