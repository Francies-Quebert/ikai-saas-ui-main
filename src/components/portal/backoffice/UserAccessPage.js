import React, { Fragment, useEffect, useState } from "react";
import AntDataTable from "../../common/AntDataTable";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import {
  Button,
  Spin,
  Row,
  Col,
  Card,
  Select,
  Radio,
  Switch,
  Empty,
  Table,
} from "antd";
import _ from "lodash";
import CardHeader from "../../common/CardHeader";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import ColumnPropertiesAnt from "../../../models/columnPropertiesAnt.js";
import {
  fetchUserAccess,
  fetchUserGroup,
  InsUpdtUserAccess,
} from "../../../store/actions/usermaster";
import {
  getUserAccess,
  getUserRightMapp,
} from "../../../services/ser-user-access";

import { LoadingOutlined } from "@ant-design/icons";
import PrinterOutlined from "@ant-design/icons/PrinterOutlined";
import RollbackOutlined from "@ant-design/icons/RollbackOutlined";
import { SaveOutlined, RetweetOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import jsreport from "jsreport-browser-client-dist";

const { Option } = Select;

const UserAccessPage = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const userMaster = useSelector((state) => state.userMaster);
  //   const userAccess = useSelector((state) => state.userMaster.userAccess);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const currTran = useSelector((state) => state.currentTran);
  const dispatch = useDispatch();
  const [accessType, setAccessType] = useState();
  const [selectedUserId, setSelectedUserId] = useState();
  const [userAccess, setUserAccess] = useState([]);
  const [selectedUserGroup, setSelectedUserGroup] = useState();
  useEffect(() => {
    dispatch(setFormCaption(props.trnType === "G" ? 30 : 29));
    // dispatch(fetchUserMasters(props.trnType));
    dispatch(fetchUserMasters("A"));
    dispatch(fetchUserMasters("G"));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      onReset();
    }
  }, [currTran.lastSavedData]);

  const filterData = (pModType) => {
    let temp = [
      ...new Set(
        userAccess
          .filter((ll) => ll.ModType === pModType)
          .map((data) => data.ModGroupDesc)
      ),
    ];
    let filteredData = [];
    for (const key in temp) {
      filteredData.push({
        text: temp[key],
        value: temp[key],
      });
    }
    return filteredData;
  };

  const onReset = () => {
    setUserAccess([]);
    setAccessType();
    setSelectedUserId();
    setSelectedUserGroup();
  };
  const columns = [
    {
      title: "Module Group",
      dataIndex: "ModGroupDesc",
      key: "ModGroupDesc",
      width: 150,
      ellipsis: true,
      filters: filterData("form"),
      onFilter: (value, record) => record.ModGroupDesc.indexOf(value) === 0,
    },
    // new ColumnPropertiesAnt("ModGroupDesc", "Module Group", true, true, 200),
    new ColumnPropertiesAnt("ModuleName", "Module", false, true, 200),
    {
      title: "Access Rights",
      dataIndex: "Rights",
      // width:100,
      render: (text, record, index) => {
        // console.log(text, record, index)
        let hh = _.split(record.Rights, ",");

        return (
          <span>
            {hh &&
              hh.map((right) => {
                let vals = _.split(right, "#");
                return (
                  <Switch
                    key={vals[1]}
                    checkedChildren={vals[2]}
                    disabled={accessType === "G"}
                    unCheckedChildren={vals[2]}
                    defaultChecked={vals[0] === "Y" ? true : false}
                    onChange={(checked) => {
                      record.isDirty = true;
                      let rowIndex = userAccess.findIndex(
                        (row) => row.key === record.key
                      );
                      // console.log(
                      //   rowIndex,
                      //   "extracted value",
                      //   userAccess[rowIndex].rights
                      // );
                      userAccess[rowIndex].Rights.split(",").map((item) => {
                        if (item.includes(vals[1])) {
                          // console.log(item);
                          let tmp = _.replace(
                            userAccess[rowIndex].Rights,
                            item,
                            (checked === true ? "Y" : "N") +
                              "#" +
                              vals[1] +
                              "#" +
                              vals[2]
                          );
                          userAccess[rowIndex].Rights = tmp;
                          // console.log('ds + new value',userAccess,tmp);
                        }
                      });
                    }}
                  />
                );
              })}
          </span>
        );
      },
    },
  ];

  const columnsReport = [
    {
      title: "Report Group",
      dataIndex: "ModGroupDesc",
      key: "ModGroupDesc",
      width: 200,
      ellipsis: true,
      filters: filterData("report"),
      onFilter: (value, record) => record.ModGroupDesc.indexOf(value) === 0,
    },
    // new ColumnPropertiesAnt("ModGroupDesc", "Module Group", true, true, 200),
    new ColumnPropertiesAnt("ModuleName", "Report Name", false, true),
    {
      title: "Allowed",
      dataIndex: "Rights",
      width: 100,
      render: (text, record, index) => {
        // console.log(text, record, index)
        let hh = _.split(record.Rights, ",");

        return (
          <span>
            {hh &&
              hh.map((right) => {
                let vals = _.split(right, "#");

                return (
                  <Switch
                    key={vals[1]}
                    // checkedChildren={vals[2]}
                    disabled={accessType === "G"}
                    // unCheckedChildren={vals[2]}
                    defaultChecked={vals[0] === "Y" ? true : false}
                    onChange={(checked) => {
                      record.isDirty = true;
                      let rowIndex = userAccess.findIndex(
                        (row) => row.key === record.key
                      );

                      userAccess[rowIndex].Rights.split(",").map((item) => {
                        if (item.includes(vals[1])) {
                          // console.log(item);
                          let tmp = _.replace(
                            userAccess[rowIndex].Rights,
                            item,
                            (checked === true ? "Y" : "N") +
                              "#" +
                              vals[1] +
                              "#" +
                              vals[2]
                          );
                          userAccess[rowIndex].Rights = tmp;
                          // console.log('ds + new value',userAccess,tmp);
                        }
                      });
                    }}
                  />
                );
              })}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col span={24}>
            <CardHeader
              title={props.trnType === "G" ? "User Access" : "User Role Access"}
            />
            <Card bordered={true} bodyStyle={{ padding: 8, margin: 3 }}>
              <Select
                allowClear={true}
                showSearch
                disabled={!_.isUndefined(accessType)}
                style={{ width: 300, marginRight: 10 }}
                placeholder={`Select ${
                  props.trnType === "G" ? "User Group" : "User"
                }`}
                optionFilterProp="children"
                value={selectedUserId}
                onChange={(value) => setSelectedUserId(value)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {props.trnType === "A" &&
                  userMaster.userMasters.length > 0 &&
                  userMaster.userMasters.map((item) => {
                    return (
                      <Option
                        key={item.userId}
                        value={item.userId}
                      >{`${item.Name} (${item.mobile})`}</Option>
                    );
                  })}

                {props.trnType === "G" &&
                  userMaster.userGroupMaster.length > 0 &&
                  userMaster.userGroupMaster.map((item) => {
                    return (
                      <Option
                        key={item.userId}
                        value={item.userId}
                      >{`${item.Name}`}</Option>
                    );
                  })}
              </Select>
              <Button
                type="primary"
                disabled={!_.isUndefined(accessType)}
                onClick={() => {
                  //   dispatch(fetchUserAccess(3));

                  //   getUserAccess(selectedUserId).then((data) =>
                  //     setUserAccess(data)
                  //   );
                  setUserAccess([]);
                  getUserRightMapp(CompCode, selectedUserId).then(
                    (userData) => {
                      //If Preveous right exists then
                      if (userData) {
                        setAccessType(userData.UserAccessType);
                        setSelectedUserGroup(userData.UserGroupAccessId);
                        getUserAccess(
                          CompCode,
                          userData.UserAccessType === "I"
                            ? selectedUserId
                            : userData.UserGroupAccessId
                        ).then((data) => {
                          // console.log("user Access Data", data);
                          setUserAccess(data);
                        });
                      } else {
                        //for new record
                        setAccessType("I");
                        setSelectedUserGroup("");
                        getUserAccess(CompCode, selectedUserId).then((data) =>
                          setUserAccess(data)
                        );
                      }
                    }
                  );
                }}
              >
                Show
              </Button>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card bordered={true} bodyStyle={{ padding: 8, margin: 3 }}>
              <Card
                key="1"
                bordered={true}
                bodyStyle={{ padding: 8, margin: 3 }}
              >
                <Radio.Group
                  onChange={(e) => {
                    setAccessType(e.target.value);
                    setUserAccess([]);
                  }}
                  value={accessType}
                  disabled={userAccess.length === 0 && !selectedUserId}
                >
                  <Radio value={"I"}>Induvidual</Radio>
                  {props.trnType !== "G" && (
                    <Radio value={"G"}>Role / Group Wise</Radio>
                  )}
                </Radio.Group>
                {props.trnType !== "G" && (
                  <Select
                    showSearch
                    allowClear={true}
                    disabled={accessType === "I"}
                    value={selectedUserGroup}
                    onChange={(value) => {
                      setSelectedUserGroup(value);
                    }}
                    style={{ width: 300, marginRight: 10 }}
                    placeholder={`Select Role / Group`}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {userMaster.userGroupMaster.length > 0 &&
                      userMaster.userGroupMaster.map((item) => {
                        return (
                          <Option
                            key={item.userId}
                            value={item.userId}
                          >{`${item.Name}`}</Option>
                        );
                      })}
                  </Select>
                )}
                <Button
                  type="primary"
                  disabled={accessType === "G" && !selectedUserGroup}
                  onClick={() => {
                    setUserAccess([]);
                    getUserAccess(
                      CompCode,
                      accessType === "I" ? selectedUserId : selectedUserGroup
                    ).then((data) => setUserAccess(data));
                  }}
                  disabled={userAccess.length === 0 && !selectedUserId}
                >
                  Show Rights
                </Button>
              </Card>
              <Card
                key="2"
                bordered={true}
                bodyStyle={{ padding: 5, margin: 3, height: "100%" }}
              >
                <Row>
                  <Col span={14}>
                    <div
                      style={{
                        background: "var(--app-theme-color)",
                        color: "#FFF",
                        padding: "5px 10px",
                        margin: "0px 1px",
                        fontWeight: "600",
                      }}
                    >
                      Module's Rights
                    </div>
                    {userAccess.length > 0 ? (
                      <Table
                        dataSource={userAccess.filter(
                          (ll) => ll.ModType === "form"
                        )}
                        size={"small"}
                        columns={columns}
                        bordered
                        pagination={false}
                        scroll={{ x: "max-content", y: "380px" }}
                      />
                    ) : (
                      <Empty />
                    )}
                  </Col>
                  <Col span={10}>
                    {" "}
                    <div
                      style={{
                        background: "var(--app-theme-color)",
                        color: "#FFF",
                        padding: "5px 10px",
                        fontWeight: "600",
                        margin: "0px 1px",
                      }}
                    >
                      Report's Rights
                    </div>
                    {userAccess.length > 0 ? (
                      <Table
                        dataSource={userAccess.filter(
                          (ll) => ll.ModType === "report"
                        )}
                        size={"small"}
                        columns={columnsReport}
                        bordered
                        pagination={false}
                        scroll={{ x: "max-content", y: "380px" }}
                        // pagination={{ pageSize: 15 }}
                      />
                    ) : (
                      <Empty />
                    )}
                  </Col>
                </Row>
              </Card>
              <Card
                key="3"
                bordered={true}
                bodyStyle={{ padding: 8, margin: 3 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    dispatch(
                      InsUpdtUserAccess(
                        props.trnType,
                        selectedUserId,
                        accessType,
                        selectedUserGroup,
                        userAccess
                      )
                    );
                  }}
                >
                  Save
                </Button>

                <Button
                  type="primary"
                  icon={<RetweetOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => onReset()}
                >
                  Reset
                </Button>

                <Button
                  type="primary"
                  icon={<Icon component={PrinterOutlined} />}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    jsreport.serverUrl =
                      "https://hariom23shah.jsreportonline.net";
                    let reportRequest = {
                      template: { shortid: "ryloQeQ4_I" },
                      options: { reports: { save: true } },
                      //   data: {
                      //     invoiceNumber: "2019-3514C",
                      //     data: "14.7.2019",
                      //     company: {
                      //       address: "U Sluncove 603 Prague",
                      //       email: "jan.blaha@jsreport.net",
                      //       phone: "776271022",
                      //     },
                      //     total: "295",
                      //     items: [
                      //       {
                      //         product: {
                      //           name: "Hariom Shah",
                      //           price: "295",
                      //         },
                      //         cost: 295,
                      //         quantity: 1,
                      //       },
                      //     ],
                      //   },
                    };
                    const electron = window.require("electron");
                    const ipcRenderer = electron.ipcRenderer;

                    jsreport.headers["Authorization"] =
                      "Basic " + btoa("hariom23shah@gmail.com:Hariom@123");
                    // jsreport.download("myReport.pdf", reportRequest);

                    jsreport.renderAsync(reportRequest).then((res) => {
                      // ipcRenderer.send("channel1", res);

                      const gg = res.toDataURI();
                      ipcRenderer.send("channel1", gg);
                    });

                    // jsreport.render(reportPreview, reportRequest);
                    // jsreport.download('myReport.pdf', reportRequest);

                    // jsreport.renderAsync(reportRequest).then(function (res) {
                    //   var html =
                    //     "<html>" +
                    //     "<style>html,body {padding:0;margin:0;} iframe {width:100%;height:100%;border:0}</style>" +
                    //     "<body>" +
                    //     '<iframe type="application/pdf" src="' +
                    //     res.toDataURI() +
                    //     '"></iframe>' +
                    //     "</body></html>";
                    //   var a = window.open("about:blank", "Report");
                    //   a.document.write(html);
                    //   a.document.close();
                    // });
                  }}
                >
                  Print
                </Button>
              </Card>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default UserAccessPage;
