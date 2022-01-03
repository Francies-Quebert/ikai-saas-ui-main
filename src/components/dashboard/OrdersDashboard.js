import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../common/breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../store/actions/currentTran";
import {
  Home,
  Activity,
  User,
  Menu,
  Check,
  ArrowDown,
  CheckCircle,
  Circle
} from "react-feather";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import OrdersDashboardHome from "./OrdersDashboard/OrdersDashboardHome";
import OrdersDashboarUpcomingSchedule from "./OrdersDashboard/OrdersDashboardUpcomingSchedule";
import OrdersDashboardOrder from "./OrdersDashboard/OrdersDashboardOrders";
const OrdersDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFormCaption(2));
  }, []);

  return (
    <Fragment>
      <div className="row theme-tab">
        <Tabs className="col-sm-12">
          <TabList className="tabs tab-title m-b-5">
            <Tab className="current">
              <Home />
              Home
            </Tab>
            <Tab>
              <Activity />
              Upcoming Schedules
            </Tab>
            <Tab>
              <Menu />
              Orders
            </Tab>
          </TabList>
          <div className="tab-content-cls">
            <TabPanel>
              <OrdersDashboardHome />
            </TabPanel>
            <TabPanel>
              <OrdersDashboarUpcomingSchedule />
            </TabPanel>
            <TabPanel>
              <OrdersDashboardOrder />
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </Fragment>
  );
};

export default OrdersDashboard;
