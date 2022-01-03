import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Tabs, Button, Divider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotificationTranEventMapp } from "../../../services/notification-center";
import { Typography } from "antd";
import NotificationDtlTable from "./notificationDtlTable";

const { Text } = Typography;
const { TabPane } = Tabs;

const NotificationTeanEventCard = (props) => {
  const [tranHeader, setTranHeader] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  // console.log(props,"sssssss");
  useEffect(() => {
    fetchNotificationTranEventMapp(CompCode, props.EventCode).then((res) => {
      setTranHeader(res);
    });
  }, [props.EventCode]);

  const keyValue = (val) => {
    var str = val;
    var str_array = str.split(",");
    var keyValues = [];
    for (const key in str_array) {
      keyValues.push(<Text code copyable>{`<<${str_array[key]}>>`}</Text>);
    }
    return keyValues;
  };
  return (
    <div>
      <Tabs tabPosition={"top"} size="small">
        {tranHeader.length > 0 &&
          tranHeader.map((item) => {
            return (
              <TabPane
                tab={item.NotificationTranDesc}
                key={item.NotificationTranId}
              >
                <Row gutter={[0, 8]}>
                  <Col
                    style={{
                      backgroundColor: "#fafafa",
                      color: "rgba(0, 0, 0, 0.85)",
                      border: "1px solid #f0f0f0",
                      padding: "8px 16px",
                    }}
                    xs={24}
                    sm={24}
                    md={6}
                    lg={4}
                    xl={4}
                  >
                    Fetch data source
                  </Col>
                  <Col
                    style={{
                      color: "rgba(0, 0, 0, 0.65)",
                      border: "1px solid #f0f0f0",
                      padding: "8px 16px",
                    }}
                    xs={24}
                    sm={24}
                    md={18}
                    lg={20}
                    xl={20}
                  >
                    {`${item.fetchDataSource} (${item.OutputKeys})`}
                  </Col>
                </Row>
                <Row>
                  <Col
                    style={{
                      backgroundColor: "#fafafa",
                      color: "rgba(0, 0, 0, 0.85)",
                      border: "1px solid #f0f0f0",
                      padding: "8px 16px",
                    }}
                    xs={24}
                    sm={24}
                    md={6}
                    lg={4}
                    xl={4}
                  >
                    Data Keywords
                  </Col>
                  <Col
                    style={{
                      color: "rgba(0, 0, 0, 0.65)",
                      border: "1px solid #f0f0f0",
                      padding: "8px 16px",
                    }}
                    xs={24}
                    sm={24}
                    md={18}
                    lg={20}
                    xl={20}
                  >
                    {keyValue(item.KeyValuesHelp)}
                  </Col>
                </Row>
                <NotificationDtlTable tranId={item.NotificationTranId} />
              </TabPane>
            );
          })}
      </Tabs>
    </div>
  );
};

const DataDisplayed = (props) => {
  return <></>;
};

export default NotificationTeanEventCard;
