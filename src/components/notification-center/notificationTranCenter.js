import React, { Fragment, useEffect, useState } from "react";
import { setFormCaption } from "../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import { Card, Tabs, Empty } from "antd";
import { fetchNotificationTranEvents } from "../../store/actions/notificationCenter";
import NotificationTranEventCard from "../notification-center/notificationComponent/notificationTranEventCard";
import  CardHeader  from "../common/CardHeader";

const { TabPane } = Tabs;
const NotificationTranCenter = () => {
  const dispatch = useDispatch();
  const NotificationTranEvents = useSelector(
    (state) => state.notificationCenter
  );
  useEffect(() => {
    dispatch(setFormCaption(37));
    dispatch(fetchNotificationTranEvents());
  }, []);
  return (
    <div>
      <CardHeader title="Notification Center" />
      <Card bodyStyle={{ padding: "10px 10px" }}>
        <Tabs tabPosition={"left"} tabBarStyle={{ textAlign: "left" }}>
          {NotificationTranEvents.notificationTranEvents.length > 0 &&
            NotificationTranEvents.notificationTranEvents.map((item) => {
              return (
                <TabPane
                  tab={item.EventDesc}
                  key={item.EventCode}
                  forceRender={true}
                  // style={{textAlign:'left'}}
                >
                  <NotificationTranEventCard EventCode={item.EventCode} />
                </TabPane>
              );
            })}
        </Tabs>
      </Card>
    </div>
  );
};
export default NotificationTranCenter;
