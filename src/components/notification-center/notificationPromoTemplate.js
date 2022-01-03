import React, { useState, useEffect } from "react";
import { Row, Col, Tabs, Button, Divider, Card, Typography, Badge } from "antd";
import CardHeader from "../common/CardHeader";
import { PlusCircleOutlined, SendOutlined } from "@ant-design/icons";
import { Table } from "antd";
import NotificationPromoForm from "./notificationComponent/notificationPromoForm";
import NotificationSendForm from "./notificationComponent/NotificationSendForm";
import { fetchNotificationPromoTemplate } from "../../store/actions/notificationCenter";
import ColumnPropertiesAnt from "../../models/columnPropertiesAnt.js";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setFormCaption } from "../../store/actions/currentTran";
import { hasRight } from "../../shared/utility";

const { Text } = Typography;
const { Title } = Typography;
const NotificationPromoTemplate = () => {
  const dispatch = useDispatch();
  const [editedData, setEditedData] = useState();
  const notificationCenter = useSelector((state) => state.notificationCenter);
  const currTran = useSelector((state) => state.currentTran);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
    },
  };
  useEffect(() => {
    dispatch(setFormCaption(40));
    dispatch(fetchNotificationPromoTemplate());
  }, []);

  useEffect(() => {
    if (currTran.isSuccess === true) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  const columns = [
    {
      title: "",
      dataIndex: "send",
      render: (text, record) =>
        //   <Popconfirm title="Sure to Edit?">
        record.IsEnabled === "Y" ? (
          <a href="#">
            <i
              className="fa fa-paper-plane"
              style={{
                width: 35,
                fontSize: 16,
                padding: 11,
                color: "rgb(40, 167, 69)",
              }}
              onClick={() => {
                setEditedData({ entryMode: "S", formData: record });
              }}
            ></i>
          </a>
        ) : null,
      //   </Popconfirm>
      align: "center",
      width: 60,
    },
    new ColumnPropertiesAnt("Id", "Id", true, true, 80),
    new ColumnPropertiesAnt("title", "Template Name", true, true),
    {
      title: "IsEnabled",
      dataIndex: "IsEnabled",
      render: (text, record) =>
        //   <Popconfirm title="Sure to Edit?">
        record.IsEnabled === "Y" ? (
          <Badge status="success" />
        ) : (
          <Badge status="error" />
        ),
      //   </Popconfirm>
      align: "center",
    },
    {
      dataIndex: "NotificationType",
      key: "NotificationType",
      title: "Notification Type",
      render: (text, record) =>
        record.NotificationType === "E"
          ? "E-Mail"
          : record.NotificationType === "P"
          ? "Notification"
          : "SMS",
      filtered: true,
      sorter: (a, b) => a.key - b.key,
      width: 300,
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "edit",
      render: (text, record) => (
        //   <Popconfirm title="Sure to Edit?">
        <a href="#">
          <i
            className="fa fa-pencil"
            style={{
              width: 35,
              fontSize: 16,
              padding: 11,
              color: "rgb(40, 167, 69)",
            }}
            onClick={() => {
              setEditedData({ entryMode: "E", formData: record });
            }}
          ></i>
        </a>
        //   </Popconfirm>
      ),
      align: "center",
    },
  ];

  return (
    <Row gutter={[8, 8]}>
      {!editedData && (
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <CardHeader
            title="Notification Promo Template"
            // onQuickSend={() => {
            //   setEditedData({ entryMode: "QS" });
            // }}
          />
          <Card bodyStyle={{ padding: "10px 10px" }}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Button
                  type="primary"
                  disabled={hasRight(currTran.moduleRights, "ADD")}
                  icon={<PlusCircleOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    setEditedData({ entryMode: "A" });
                  }}
                >
                  Add
                </Button>
                <Button
                  icon={<SendOutlined />}
                  disabled={hasRight(currTran.moduleRights, "QCKSND")}
                  onClick={() => {
                    setEditedData({ entryMode: "QS" });
                  }}
                  type="primary"
                  // size="small"
                >
                  Quick Send
                </Button>
              </Col>
              <Col span={24}>
                {notificationCenter &&
                  notificationCenter.notificationPromoTemp.length > 0 && (
                    <Table
                      bordered={true}
                      // rowSelection={{
                      //   type: "radio",
                      //   ...rowSelection,
                      // }}
                      columns={columns}
                      // scroll={{ x: 1300 }}
                      size="middle"
                      dataSource={notificationCenter.notificationPromoTemp}
                    />
                  )}
              </Col>
            </Row>
          </Card>
        </Col>
      )}
      {editedData &&
        (editedData.entryMode === "E" || editedData.entryMode === "A") && (
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <CardHeader title="Notification Promo Form" />
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Row>
                <Col
                  style={{
                    backgroundColor: "#fafafa",
                    color: "rgba(0, 0, 0, 0.85)",
                    border: "1px solid #f0f0f0",
                    padding: "8px 16px",
                  }}
                  xl={4}
                  lg={4}
                  md={6}
                  sm={24}
                  xs={24}
                >
                  Data Keywords
                </Col>
                <Col
                  style={{
                    color: "rgba(0, 0, 0, 0.65)",
                    border: "1px solid #f0f0f0",
                    padding: "8px 16px",
                  }}
                  xl={20}
                  lg={20}
                  md={18}
                  sm={24}
                  xs={24}
                >
                  <Text code copyable>{`<<VAR1>>`}</Text>
                  <Text code copyable>{`<<VAR2>>`}</Text>
                  <Text code copyable>{`<<VAR3>>`}</Text>
                  <Text code copyable>{`<<VAR4>>`}</Text>
                  <Text code copyable>{`<<VAR5>>`}</Text>
                </Col>
              </Row>
            </Col>
            <Card bodyStyle={{ padding: "10px 10px" }}>
              <NotificationPromoForm
                onBackPress={() => setEditedData()}
                formData={editedData.formData}
              />
            </Card>
          </Col>
        )}
      {editedData &&
        (editedData.entryMode === "S" || editedData.entryMode === "QS") && (
          <>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <CardHeader title="Send Notification" />
              {/* <Card> */}
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Row>
                  <Col
                    style={{
                      backgroundColor: "#fafafa",
                      color: "rgba(0, 0, 0, 0.85)",
                      border: "1px solid #f0f0f0",
                      padding: "8px 16px",
                    }}
                    xl={4}
                    lg={4}
                    md={6}
                    sm={24}
                    xs={24}
                  >
                    Data Keywords
                  </Col>
                  <Col
                    style={{
                      color: "rgba(0, 0, 0, 0.65)",
                      border: "1px solid #f0f0f0",
                      padding: "8px 16px",
                    }}
                    xl={20}
                    lg={20}
                    md={18}
                    sm={24}
                    xs={24}
                  >
                    <Text code copyable>{`<<VAR1>>`}</Text>
                    <Text code copyable>{`<<VAR2>>`}</Text>
                    <Text code copyable>{`<<VAR3>>`}</Text>
                    <Text code copyable>{`<<VAR4>>`}</Text>
                    <Text code copyable>{`<<VAR5>>`}</Text>
                  </Col>
                </Row>
              </Col>
              <NotificationSendForm
                onBackPress={() => setEditedData()}
                formData={editedData.formData}
                entryMode={editedData.entryMode}
              />
              {/* </Card> */}
            </Col>
          </>
        )}
    </Row>
  );
};

const CardHeaderExtra = (props) => {
  return (
    <Row
      style={{
        padding: "8px 24px",
        fontSize: 15,
        background: "#FFFFFF",
        border: "1px solid #f0f0f0",
      }}
    >
      <Col span={15} style={{}}>
        <Title level={4} style={{ margin: 0 }}>
          {props.title}
        </Title>
      </Col>
      <Col span={9} style={{ textAlign: "end", paddingTop: 4 }}>
        <Button
          icon={<SendOutlined />}
          onClick={props.onQuickSend}
          type="primary"
          size="small"
        >
          Quick Send
        </Button>
      </Col>
    </Row>
  );
};

export default NotificationPromoTemplate;
