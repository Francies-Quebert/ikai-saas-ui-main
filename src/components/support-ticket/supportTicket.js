import React, { Fragment, useEffect, useState } from "react";
// import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { Tabs, Table, Typography, Card, Button } from "antd";
import { setFormCaption } from "../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSupportPendingTicket,
  fetchSupportTicket,
} from "../../store/actions/supportTicket";
import { fetchUserMasters } from "../../store/actions/usermaster";
import { toast } from "react-toastify";
import moment from "moment";
import SupportDetailCard from "./SupportComponents/SupportDetailCardNew";
import SupportResolvedCard from "./SupportComponents/SupportResolvedCardNew";
import CustomDataTable from "../common/CustomDataTable";
import ColumnProperties from "../../models/columnProperties";
import ColumnPropertiesAnt from "../../models/columnPropertiesAnt";
import { hasRight } from "../../shared/utility";
import SupportticketAddCard from "./SupportComponents/SupportticketAdd";
import CustomerSelectionComponent from "../dashboard/Restaurant/components/SubComponents/CustomerSelectionComponent";
import { FileOutlined } from "@ant-design/icons";

const SupportTicket = () => {
  const dispatch = useDispatch();
  const { Text } = Typography;
  const supportTickets = useSelector((state) => state.supportTicket);
  const currTran = useSelector((state) => state.currentTran);
  const supportStatus = useSelector(
    (state) => state.AppMain.otherMasterSupportStatus
  );
  const l_ConfigDateTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTTMFORMAT")
  );
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const userMaster = useSelector((state) => state.userMaster);

  const { TabPane } = Tabs;
  const [myData, setMyData] = useState([]);
  const [editedData, setEditedData] = useState();
  const [foreColor, setForeColor] = useState();
  const [backColor, setBackColor] = useState();
  useEffect(() => {
    dispatch(setFormCaption(28));
    dispatch(fetchSupportPendingTicket());
    dispatch(fetchSupportTicket());
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      dispatch(fetchSupportPendingTicket());
      dispatch(fetchSupportTicket());
    }
  }, [currTran.lastSavedData]);

  const columns = [
    // new ColumnPropertiesAnt("TicketNo", "Ticket No", true, false, 90),
    {
      title: "Ticket No",
      dataIndex: "TicketNo",
      align: "center",
      width: 90,
    },
    {
      title: "Ticket Date Time",
      dataIndex: "crt_dttm",
      width: "15%",
      align: "center",
      render: (text, record) => {
        return (
          <Text>
            {record.crt_dttm === null
              ? " "
              : moment(record.crt_dttm).format(l_ConfigDateTimeFormat.value1)}
          </Text>
        );
      },
    },
    // new ColumnPropertiesAnt("name", "Name", true, false),
    // new ColumnPropertiesAnt("mobile", "Mobile", true, false, 100),
    // new ColumnPropertiesAnt("HelpType", "Help Type", true, false, 90),
    // new ColumnPropertiesAnt("HelpTitle", "Help Title", false, false, 150),
    // new ColumnPropertiesAnt("StatusDesc", "Status", false, false, 100),
    // new ColumnPropertiesAnt("orderNo", "Order No", true, false, 90),
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      width: 100,
      align: "center",
    },
    {
      title: "Help Type",
      dataIndex: "HelpType",
      align: "center",
      width: 90,
    },
    {
      title: "Help Title",
      dataIndex: "HelpTitle",
      width: 150,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "StatusDesc",
      width: 100,
      align: "center",
    },
    {
      title: "Order No",
      dataIndex: "orderNo",
      width: 90,
      align: "center",
    },
    {
      title: "Modified Date Time",
      dataIndex: "updt_dttm",
      width:  150,
      align: "center",
      render: (text, record) => {
        return (
          <Text>
            {record.updt_dttm === null
              ? ""
              : moment(record.updt_dttm).format(l_ConfigDateTimeFormat.value1)}
          </Text>
        );
      },
    },
    {
      title: "",
      dataIndex: "x",
      key: "x",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <Button
              style={{ marginTop: 5, marginBottom: 5 }}
              // size="small"
              type="primary"
              icon={<FileOutlined />}
              onClick={() => {
                setEditedData({ entryMode: "E", formData: record });
                const color = supportStatus.find(
                  (sup) => sup.ShortCode === record.statusCode
                );
                setForeColor(color.SysOption2);
                setBackColor(color.SysOption1);
              }}
            >
              View
            </Button>
            {/* <a
              onClick={() => {
                setEditedData({ entryMode: "E", formData: record });
                const color = supportStatus.find(
                  (sup) => sup.ShortCode === record.statusCode
                );
                setForeColor(color.SysOption2);
                setBackColor(color.SysOption1);
              }}
            >
              <i
                className="fa fa-file"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(40, 167, 69)",
                }}
              ></i>
            </a> */}
          </>
        );
      },
    },
    ,
  ];
  return (
    <Fragment>
      <Card bodyStyle={{ padding: 10 }}>
        {!editedData && (
          <>
            <SupportResolvedCard
              onSearchClick={(fromDate, toDate) => {
                dispatch(
                  fetchSupportTicket(
                    moment(fromDate).format("YYYY-MM-DD"),
                    moment(toDate).format("YYYY-MM-DD")
                  )
                );
              }}
              onRefreshClick={() => {
                dispatch(fetchSupportPendingTicket());
                dispatch(fetchSupportTicket());
              }}
              onAddClick={() => {
                setEditedData({ entryMode: "A" });
              }}
            />
            {supportTickets.supportTicket && (
              <Card bodyStyle={{ marginTop: 10, padding: 0 }} bordered={false}>
                <Table
                  dataSource={supportTickets.supportTicket}
                  columns={columns}
                  size="small"
                  bordered={true}
                  pagination={{ pageSize: 25 }}
                />
              </Card>
              // <CustomDataTable
              //   AllowViewDetail={true}
              //   onViewPress={(e) => {
              //     setEditedData({ entryMode: "E", formData: e });
              //     const color = supportStatus.find(
              //       (sup) => sup.ShortCode === e.statusCode
              //     );
              //     setForeColor(color.SysOption2);
              //     setBackColor(color.SysOption1);
              //   }}
              //   columnProperties={columnProperties}
              //   myData={supportTickets.supportTicket}
              //   isInvisibleAdd={true}
              //   AllowEdit={false}
              //   pageDefaultSize={15}
              // />
            )}
          </>
        )}

        {editedData && editedData.entryMode === "A" && (
          <SupportticketAddCard onBackPress={() => setEditedData()} />
        )}

        {editedData && editedData.entryMode === "E" && editedData.formData && (
          <SupportDetailCard
            data={editedData.formData}
            statusBackColor={backColor}
            statusForeColor={foreColor}
            onBackPress={() => {
              setEditedData();
            }}
            editDisabled={hasRight(currTran.moduleRights, "EDIT")}
          />
        )}

        {/* {!editedData && (
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <HomeOutlined />
                  Pending Support Tickets
                </span>
              }
              key="1"
            >
              <Card>
                {supportTickets.pendingSupportTickets &&
                  supportStatus &&
                  supportTickets.pendingSupportTickets.map((item) => {
                    const ttt = supportStatus.find(
                      (sup) => sup.ShortCode === item.statusCode
                    );
                    return (
                      <SupportTicketComponent
                        key={item.TicketNo}
                        ticketNo={item.TicketNo}
                        helpType={item.HelpType}
                        helpTitle={item.HelpTitle}
                        helpDesc={item.HelpDesc}
                        name={item.name}
                        mobile={item.mobile}
                        orderNo={item.orderNo}
                        crt_dttm={moment(item.crt_dttm).format("DD/MM/YYYY")}
                        statusDesc={item.StatusDesc}
                        customHelpText={item.CustomHelpText}
                        statusBackColor={ttt.SysOption1}
                        statusForeColor={ttt.SysOption2}
                        editDisabled={hasRight(currTran.moduleRights, "EDIT")}
                        onViewDetailClicked={() => {
                          setEditedData({ entryMode: "E", formData: item });
                          setForeColor(ttt.SysOption2);
                          setBackColor(ttt.SysOption1);
                        }}
                      />
                    );
                  })}
                {supportTickets.pendingSupportTickets.length === 0 && (
                  <Card bodyStyle={{ height: 300 }}>
                    <Empty />
                  </Card>
                )}
              </Card>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <UnorderedListOutlined />
                  Resolved Support Tickets
                </span>
              }
              key="2"
            >
              <SupportResolvedCard
                onSearchClick={(fromDate, toDate) =>
                  dispatch(
                    fetchSupportTicket(
                      moment(fromDate).format("YYYY-MM-DD"),
                      moment(toDate).format("YYYY-MM-DD")
                    )
                  )
                }
              />
              {supportTickets.supportTicket && (
                <CustomDataTable
                  AllowViewDetail={true}
                  onViewPress={(e) => {
                    setEditedData({ entryMode: "E", formData: e });
                    const color = supportStatus.find(
                      (sup) => sup.ShortCode === e.statusCode
                    );
                    setForeColor(color.SysOption2);
                    setBackColor(color.SysOption1);
                  }}
                  columnProperties={columnProperties}
                  myData={supportTickets.supportTicket}
                  isInvisibleAdd={true}
                  AllowEdit={false}
                  pageDefaultSize={15}
                />
              )}
            </TabPane>
          </Tabs>
        )} */}
      </Card>
    </Fragment>
  );
};

export const columnProperties = [
  new ColumnProperties("TicketNo", true, "Ticket No", true, 100),
  new ColumnProperties("orderNo", true, "Order No", true, 90),
  new ColumnProperties("name", true, "Customer Name", true),
  new ColumnProperties("mobile", true, "Customer Contact No", true, 175),
  new ColumnProperties("HelpType", true, "Help Type", true, 145),
  new ColumnProperties("HelpTitle", true, "Help Title", true, 200),
  new ColumnProperties("HelpDesc", false, "HelpDesc", true, 150),
  new ColumnProperties(
    "CustomHelpText",
    false,
    "Customer Help Text",
    true,
    200
  ),
  new ColumnProperties("statusCode", false, "Status Code", true, 350),
  new ColumnProperties("StatusDesc", false, "Status Desc", true, 350),
  new ColumnProperties("Remark", false, "Remark", true, 350),
  new ColumnProperties("crt_usrId", false, "crt_usrId", true),
  new ColumnProperties("crt_dttm", false, "crt_dttm", true),
  new ColumnProperties("updt_dttm", false, "updt_dttm", true, 350),
  new ColumnProperties("updt_usrId", false, "updt_usrId", true, 350),
  new ColumnProperties("StatusCodeComponent", true, "Status", false, 150),
];

export default SupportTicket;
