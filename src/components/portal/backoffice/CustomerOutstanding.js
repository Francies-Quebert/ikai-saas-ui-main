import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Typography,
  Button,
  Empty,
  Table,
  Spin,
  Select,
  Skeleton,
} from "antd";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { setFormCaption } from "../../../store/actions/currentTran";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import { getCustOutstandingData } from "../../../services/cust-outstanding";
import { useHistory } from "react-router-dom";

const CustomerOutstanding = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const { Text } = Typography;
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState();
  const currentTran = useSelector((state) => state.currentTran);
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  let history = useHistory();
  useEffect(() => {
    dispatch(setFormCaption(77));
    dispatch(fetchUserMasters("U"));
    fnSetDefault();
  }, []);

  const fnSetDefault = () => {
    setIsLoading(true);
    try {
      getCustOutstandingData(CompCode, null).then((res) => {
        setData(res);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer Name",
      key: "Customer",
      width: "8%",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>
              {record.Name} ({record.mobile})
            </Text>
          </>
        );
      },
    },
    {
      title: "Unbilled Amount",
      width: "5%",
      align: "right",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseFloat(record.UnBilledAmount).toFixed(2)}</Text>
          </>
        );
      },
    },
    {
      title: "Billed Amount",
      width: "5%",
      align: "right",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseFloat(record.BilledAmount).toFixed(2)}</Text>
          </>
        );
      },
    },
    {
      title: "Balance Deposit",
      width: "5%",
      align: "right",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseFloat(record.BalanceDeposit).toFixed(2)}</Text>
          </>
        );
      },
    },
    {
      title: "OutStanding Amount",
      width: "5%",
      align: "right",
      render: (value, record, index) => {
        // let OutStanding

        return (
          <>
            {parseFloat(record.OutStanding) > 0 ? (
              <Text style={{ color: "green", fontWeight: 600 }}>
                {Math.abs(parseFloat(record.OutStanding)).toFixed(2)}
              </Text>
            ) : (
              <Text type="danger" style={{ fontWeight: 600 }}>
                {Math.abs(parseFloat(record.OutStanding)).toFixed(2)}
              </Text>
            )}
          </>
        );
      },
    },

    {
      title: "",
      width: "8%",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Button
              type="primary"
              icon={<FileOutlined />}
              onClick={() => {
                history.push(
                  `${process.env.PUBLIC_URL}/administrator-panel/billSettlement?CustId=${record.CustId}`
                );
              }}
            >
              Settlement
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        {!isLoading && (
          <>
            {/* <CardHeader title={currentTran.formTitle} /> */}
            <Card bodyStyle={{ padding: 10 }}>
              <Select
                allowClear={true}
                showSearch
                // disabled={data.length > 0}
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
                htmlType="submit"
                // disabled={data.length > 0}
                icon={<SearchOutlined />}
                style={{ marginRight: 10, marginBottom: 5 }}
                onClick={() => {
                  setIsLoading(true);
                  getCustOutstandingData(
                    CompCode,
                    selectedUserId ? selectedUserId : null
                  ).then((res) => {
                    setData(res);
                  });
                  setIsLoading(false);
                }}
              >
                Search
              </Button>

              <Button
                type="primary"
                icon={<RetweetOutlined />}
                style={{ marginRight: 10, marginBottom: 5 }}
                onClick={() => {
                  setData([]);
                  setSelectedUserId();
                  fnSetDefault();
                }}
              >
                Reset
              </Button>

              <Card bodyStyle={{ marginTop: 10, padding: 0 }} bordered={false}>
                {data.length === 0 && <Empty />}
                {data.length > 0 && (
                  <Table
                    columns={columns}
                    bordered={true}
                    dataSource={data}
                    pagination={{ pageSize: 20 }}
                  />
                )}
              </Card>
            </Card>
          </>
        )}
      </Spin>
    </div>
  );
};

export default CustomerOutstanding;
