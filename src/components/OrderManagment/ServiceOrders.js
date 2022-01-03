import React, { Fragment, useState, useEffect } from "react";
import { setFormCaption } from "../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  DatePicker,
  Button,
  Empty,
  Table,
  Modal,
  Spin,
  Select,
} from "antd";
import _ from "lodash";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { getServiceOrders } from "../../services/service-managment/service-management";
import AppLoader from "../common/AppLoader";
import ServiceOrderTable from "./ServiceOrder/ServiceOrderTable";
import OrderBookingCardNew from "../dashboard/OrderBookingMain/OrderBookingCardNew";
import moment from "moment";
import { RefreshCcw } from "react-feather";
import { getCustomerAddress } from "../../services/customer-address";
import { fetchUserMasters } from "../../store/actions/usermaster";

const ServiceOrders = (props) => {
  const dispatch = useDispatch();

  const { Option } = Select;
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const orderStatus = useSelector(
    (state) => state.AppMain.otherMasterOrderStatus
  );
  // const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [ordersData, setOrdersData] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [AddOrder, setAddOrder] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  useEffect(() => {
    // dispatch(fetchUserLoginLogsMasters());
    // console.log(l_ConfigDateFormat);
    dispatch(setFormCaption(69));
    // console.log(orderStatus);
    fnSetDefault();
  }, []);

  const fnSetDefault = () => {
    setIsLoading(true);
    // try {
    setFromDate();
    setToDate();
    setOrdersData([]);
    setSelectedUserId(null);
    getServiceOrders(CompCode, null, null, null).then((res) => {
      setOrdersData(res);

      dispatch(fetchUserMasters("U"));
      setIsLoading(false);
    });
    // } catch (err) {
    //   console.error(err);
    // } finally {
    //   setIsLoading(false);
    // }
  };
  // console.log(ordersData);
  return (
    <div>
      {/* {isLoading && <AppLoader />} */}
      <Modal
        bodyStyle={{ padding: "0px 0px" }}
        width="auto"
        onCancel={() => {
          setAddOrder(false);
        }}
        style={{ margin: "0px 15px" }}
        visible={AddOrder}
        footer={null}
        destroyOnClose={true}
      >
        <OrderBookingCardNew
          finishClick={() => {
            setAddOrder(false);
            fnSetDefault();
          }}
        />
      </Modal>
      {/* {!isLoading && ( */}
      <Card bodyStyle={{ padding: 10 }}>
        <DatePicker
          style={{ marginRight: 10, width: "calc(17% - 8px)" }}
          value={fromDate}
          format={l_ConfigDateFormat.value1}
          onChange={(evt) => {
            setFromDate(evt);
          }}
          placeholder="Select From Date"
        />

        <DatePicker
          style={{ marginRight: 10, width: "calc(17% - 8px)" }}
          format={l_ConfigDateFormat.value1}
          value={toDate}
          onChange={(evt) => {
            setToDate(evt);
          }}
          placeholder="Select To Date"
        />
        <Select
          allowClear={true}
          showSearch
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
          disabled={(!fromDate || !toDate) && !selectedUserId}
          icon={<SearchOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => {
            setOrdersData([]);
            getServiceOrders(
              CompCode,
              _.isUndefined(fromDate) ? null : fromDate.format("YYYY-MM-DD"),
              _.isUndefined(toDate) ? null : toDate.format("YYYY-MM-DD"),
              selectedUserId ? selectedUserId : null
            ).then((res) => {
              setOrdersData(res);
            });
          }}
        >
          Search
        </Button>

        <Button
          type="primary"
          // htmlType="submit"
          icon={<RetweetOutlined />}
          style={{ marginRight: 5 }}
          onClick={fnSetDefault}
        >
          Reset
        </Button>
        <Button
          type="primary"
          // htmlType="submit"
          icon={<PlusCircleOutlined />}
          style={{ marginRight: 5 }}
          onClick={() => {
            setAddOrder(true);
          }}
        >
          Create New Order
        </Button>
        <Button
          type="primary"
          icon={<RedoOutlined style={{ transform: "rotate(240deg)" }} />}
          style={{ marginRight: 5 }}
          onClick={() => {
            fnSetDefault();
          }}
        >
          Refresh
        </Button>
        {isLoading === true && <AppLoader />}
        {isLoading !== true && (
          <Card bodyStyle={{ marginTop: 10, padding: 0 }} bordered={false}>
            {ordersData.length === 0 && <Empty />}
            {ordersData.length > 0 && orderStatus.length > 0 && (
              <ServiceOrderTable
                dateFormat={l_ConfigDateFormat}
                data={ordersData}
                orderColor={orderStatus}
                ActionCompleted={(val) => {
                  if (val) {
                    setIsLoading(true);
                    setOrdersData([]);
                    getServiceOrders(
                      CompCode,
                      fromDate ? fromDate.format("YYYY-MM-DD") : null,
                      toDate ? toDate.format("YYYY-MM-DD") : null,
                      selectedUserId ? selectedUserId : null
                    ).then((res) => {
                      setOrdersData(res);
                      setIsLoading(false);
                    });
                  }
                }}
              />
            )}
          </Card>
        )}
      </Card>
      {/* )} */}
    </div>
  );
};

export default ServiceOrders;
