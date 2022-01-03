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
  Input,
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
import { getServiceSchedules } from "../../services/service-managment/service-management";
import AppLoader from "../common/AppLoader";
import ServiceSchedulesTable from "./ServiceSchedules/ServiceSchedulesTable";
import ScheduleCard from "./ServiceSchedules/ScheduleCard";
import moment from "moment";
import { fetchUserMasters } from "../../store/actions/usermaster";

const ServiceSchedules = () => {
  const dispatch = useDispatch();
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const orderStatus = useSelector(
    (state) => state.AppMain.otherMasterOrderStatus
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const { Option } = Select;
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [schedulesData, setSchedulesData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [AddOrder, setAddOrder] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState();

  const customer = useSelector((state) => state.userMaster.customerMasters);
  useEffect(() => {
    dispatch(setFormCaption(70));
    fnSetDefault();
  }, []);

  const fnSetDefault = () => {
    setIsLoading(true);
    // try {
    setFromDate();
    setToDate();
    setOrderId(null);
    setSelectedUserId(null);
    setSchedulesData([]);
    getServiceSchedules(CompCode, null, null, null, null).then((res) => {
      dispatch(fetchUserMasters("U"));
      setSchedulesData(res);
      setIsLoading(false);
    });
    // } catch (err) {
    //   console.error(err);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const refreshSaved = (pOrderId) => {
    setIsLoading(true);
    // try {
    setFromDate();
    setToDate();
    setSchedulesData([]);
    setOrderId(pOrderId);
    getServiceSchedules(
      CompCode,
      null,
      null,
      pOrderId ? pOrderId : null,
      null
    ).then((res) => {
      setSchedulesData(res);
      setIsLoading(false);
    });
    // } catch (err) {
    //   console.error(err);
    // } finally {
    //   setIsLoading(false);
    // }
  };
  return (
    <div>
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
          style={{
            marginRight: 10,
            width: "calc(17% - 8px)",
            marginBottom: 5,
          }}
          format={l_ConfigDateFormat.value1}
          value={toDate}
          onChange={(evt) => {
            setToDate(evt);
          }}
          placeholder="Select To Date"
        />
        <Input
          allowClear
          type="number"
          style={{ marginRight: 10, width: "calc(17% - 8px)" }}
          value={orderId}
          placeholder="Input orderid"
          onChange={(e) => {
            setOrderId(e.target.value);
          }}
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
          disabled={!fromDate && !toDate && !orderId && !selectedUserId}
          icon={<SearchOutlined />}
          style={{ marginRight: 5, marginBottom: 5 }}
          onClick={() => {
            console.log(CompCode, fromDate, toDate, selectedUserId);
            setSchedulesData([]);
            getServiceSchedules(
              CompCode,
              _.isUndefined(fromDate) ? null : fromDate.format("YYYY-MM-DD"),
              _.isUndefined(toDate) ? null : toDate.format("YYYY-MM-DD"),
              _.isUndefined(orderId) ? null : orderId,
              selectedUserId ? selectedUserId : null
            ).then((res) => {
              setSchedulesData(res);
            });
          }}
        >
          Search
        </Button>
        <Button
          type="primary"
          // htmlType="submit"
          icon={<RetweetOutlined />}
          style={{ marginRight: 5, marginBottom: 5 }}
          onClick={fnSetDefault}
        >
          Reset
        </Button>
        <Button
          type="primary"
          // htmlType="submit"
          icon={<PlusCircleOutlined />}
          style={{ marginRight: 5, marginBottom: 5 }}
          onClick={() => {
            setAddOrder(true);
          }}
        >
          Create New Schedules
        </Button>{" "}
        <Button
          type="primary"
          icon={<RedoOutlined style={{ transform: "rotate(240deg)" }} />}
          style={{ marginRight: 5, marginBottom: 5 }}
          onClick={() => {
            fnSetDefault();
          }}
        >
          Refresh
        </Button>
        <Modal
          // style={{ margin: "0px 15px" }}
          bodyStyle={{ padding: "0px 0px", height: "auto" }}
          width="75%"
          onCancel={() => {
            setAddOrder(false);
          }}
          visible={AddOrder}
          footer={null}
          destroyOnClose={true}
        >
          <ScheduleCard OnScheduleBack={() => setAddOrder(false)} />
        </Modal>
        {/* <Spin spinning={isLoading} indicator={antIcon}> */}
        {isLoading === true && <AppLoader />}
        {isLoading !== true && (
          <Card bodyStyle={{ marginTop: 10, padding: 0 }} bordered={false}>
            {schedulesData.length === 0 && <Empty />}
            {schedulesData.length > 0 && schedulesData.length > 0 && (
              <ServiceSchedulesTable
                dateFormat={l_ConfigDateFormat}
                data={schedulesData}
                orderColor={orderStatus}
                ActionCompleted={(val) => {
                  if (val) {
                    setIsLoading(true);
                    getServiceSchedules(
                      CompCode,
                      fromDate ? fromDate.format("YYYY-MM-DD") : null,
                      toDate ? toDate.format("YYYY-MM-DD") : null,
                      orderId ? orderId : null,
                      selectedUserId ? selectedUserId : null
                    ).then((res) => {
                      setSchedulesData([]);
                      setSchedulesData(res);
                      setIsLoading(false);
                    });
                  }
                }}
                onOTPsend={() => {
                  setSchedulesData([]);
                  getServiceSchedules(
                    CompCode,
                    fromDate
                      ? fromDate.format("YYYY-MM-DD")
                      : moment().format("YYYY-MM-DD"),
                    toDate
                      ? toDate.format("YYYY-MM-DD")
                      : moment().format("YYYY-MM-DD"),
                    orderId ? orderId : null,
                    selectedUserId ? selectedUserId : null
                  ).then((res) => {
                    setSchedulesData(res);
                  });
                }}
                refreshSaved={(pOrderId) => refreshSaved(pOrderId)}
              />
            )}
          </Card>
        )}
        {/* </Spin> */}
      </Card>
    </div>
  );
};

export default ServiceSchedules;
