import React, { useState, useEffect } from "react";
import { Row, Col, Badge, Button, Divider, Empty } from "antd";
import AntDataTable from "../../common/AntDataTable";
import ColumnPropertiesAnt from "../../../models/columnPropertiesAnt";
import { PlusCircleOutlined } from "@ant-design/icons";
import { fetchNotificationTranDtl } from "../../../services/notification-center";
import NotificationFormCard from "./notificationFormCard";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const NotificationDtlTable = (props) => {
  const [notificationDtl, setNotificationDtl] = useState([]);
  const [editedData, setEditedData] = useState();

  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    if (currTran.lastSavedData) {
      fetchNotificationTranDtl(CompCode, props.tranId).then((res) => {
        setNotificationDtl(res);
      });
      // toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {
    fetchNotificationTranDtl(CompCode, props.tranId).then((res) => {
      setNotificationDtl(res);
    });
  }, []);

  const columns = [
    new ColumnPropertiesAnt("PkId", "Id", false, true, 80),
    new ColumnPropertiesAnt(
      "NotificationTypeDesc",
      "Notification Type",
      true,
      true
    ),
    new ColumnPropertiesAnt("title", "Title", false, true),
    new ColumnPropertiesAnt("DeliveryType", "Delivery Type", false, true),
    new ColumnPropertiesAnt("WaitInSeconds", "Wait In Seconds", false, true),
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
    <>
      {editedData && (
        <Row style={{ marginBottom: 8 }}>
          <Divider style={{ margin: "9px 0px 14px 0px" }} />
          <Col span={24}>
            <NotificationFormCard
              onBackPress={() => setEditedData()}
              formData={editedData.formData}
              tranId={props.tranId}
            />
          </Col>
        </Row>
      )}
      {!editedData && (
        <>
          <Row style={{ marginBottom: 8 }}>
            <Divider style={{ margin: "9px 0px" }} />
            <Col span={24}>
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setEditedData({ entryMode: "A" });
                }}
              >
                Add
              </Button>
            </Col>
          </Row>
          <Row>
            <Col style={{ border: "1px solid #f0f0f0" }} span={24}>
              {notificationDtl.length > 0 && (
                <AntDataTable columns={columns} data={notificationDtl} />
              )}
              {notificationDtl.length <= 0 && <Empty />}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default NotificationDtlTable;
