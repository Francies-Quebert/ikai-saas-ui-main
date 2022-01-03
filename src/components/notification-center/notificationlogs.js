import React, { Fragment, useEffect, useState } from "react";
import { setFormCaption } from "../../store/actions/currentTran";
import AntDataTable from "../common/AntDataTable";
import ColumnPropertiesAnt from "../../models/columnPropertiesAnt";
import { useSelector, useDispatch } from "react-redux";
import { Card, Divider, Empty, Row, Col, Typography } from "antd";
import moment from "moment";
import CardHeader from "../common/CardHeader";
import NotificationLogCard from "./notificationComponent/notificationLogCard";
import { fetchNotificationLog } from "../../services/notification-center";
import { fetchConfig } from "../../store/actions/config";
import { getConfig } from "../../shared/utility";

const Notificationlogs = () => {
  const dispatch = useDispatch();
  const [logDtl, setlogDtl] = useState([]);
  const currentTran = useSelector((state) => state.currentTran);
  const config = useSelector((state) => state.AppMain.appconfigs);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const { Text } = Typography;
  useEffect(() => {
    dispatch(setFormCaption(39));
    dispatch(fetchConfig);
  }, []);

  const filterData = () => {
    let temp = [...new Set(logDtl.map((data) => data.StatusDesc))];
    let filteredData = [];
    for (const key in temp) {
      filteredData.push({
        text: temp[key],
        value: temp[key],
      });
    }
    return filteredData;
  };

  const columns = [
    new ColumnPropertiesAnt("key", "Tran.Id", true, true, "5%"),
    new ColumnPropertiesAnt("Title", "Title", false, false, "25%"),
    {
      title: "Tran Type",
      dataIndex: "NotificationType",
      width: "8%",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "StatusDesc",
      width: "",
      align: "center",
      filters: filterData(),
      onFilter: (value, record) => record.StatusDesc.indexOf(value) === 0,
    },
    {
      title: "Sent Date Time",
      dataIndex: "SendDTTM",
      width: "20%",
      align: "center",
      render: (text, record) => {
        return (
          <Text>
            {record.SendDTTM === null
              ? " "
              : moment(record.SendDTTM).format(
                  getConfig(config, "DTTMFORMAT").value1
                )}
          </Text>
        );
      },
    },
    {
      title: "ScheduledOn",
      dataIndex: "ScheduleOn",
      width: "20%",
      align: "center",
      render: (text, record) => {
        return (
          <Text>
            {record.ScheduleOn === null
              ? " "
              : moment(record.ScheduleOn).format(
                  getConfig(config, "DTTMFORMAT").value1
                )}
          </Text>
        );
      },
    },
    {
      title: "Created Date ",
      dataIndex: "crt_dttm",
      width: "20%",
      align: "center",
      render: (text, record) => {
        return (
          <Text>
            {record.crt_dttm === null
              ? ""
              : moment(record.crt_dttm).format(
                  getConfig(config, "DTTMFORMAT").value1
                )}
          </Text>
        );
      },
    },
  ];

  return (
    <div>
      <CardHeader title={currentTran.formTitle} />
      <Card bodyStyle={{ padding: "10px 10px" }}>
        <NotificationLogCard
          onReset={() => {
            setlogDtl([]);
          }}
          onSearchClick={(notifyMode, notifyType, fromDate, toDate) => {
            fetchNotificationLog(
              CompCode,
              notifyMode,
              notifyType,
              moment(fromDate).format("YYYY-MM-DD"),
              moment(toDate).format("YYYY-MM-DD")
            ).then((res) => setlogDtl(res));
          }}
        />
        <Divider style={{ margin: "9px 0px" }} />
        <Row>
          <Col style={{ border: "1px solid #f0f0f0" }} span={24}>
            {logDtl.length > 0 && (
              <AntDataTable
                columns={columns}
                data={logDtl}
                bordered={true}
                pagination={{ pageSize: 15 }}
              />
            )}
            {logDtl.length <= 0 && <Empty />}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Notificationlogs;
