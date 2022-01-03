import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  EditTwoTone,
  FileAddOutlined,
  FundViewOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Input,
  Radio,
  Divider,
  Button,
  Switch,
  Select,
  Table,
  Badge,
} from "antd";
import AppRouteCard from "./AppRoute/AppRouteCard";
import CardHeader from "../../common/CardHeader";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import { getAppRouteHdr } from "../../../services/app-route";
import { hasRight } from "../../../shared/utility";

const AppRoutePage = () => {
  const dispatch = useDispatch();
  const [AppRouteData, setAppRouteData] = useState([]);
  const [loading, setLoading] = useState();
  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [editedData, setEditedData] = useState();

  useEffect(() => {
    setLoading(true);
    dispatch(setFormCaption(130));
    InitialFetch();
  }, []);

  const InitialFetch = () => {
    getAppRouteHdr(CompCode).then((res) => {
      setAppRouteData(res);
      // console.log(res)
      setLoading(false);
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "",
      align: "center",
      render: (text, recor, idx) => {
        return idx + 1;
      },
    },
    {
      title: "Route Name",
      dataIndex: "RouteName",
    },
    { title: "Route Slug", dataIndex: "RouteSlug" },
    {
      title: "Status",
      align: "center",
      width: "5%",
      render: (value, record) => {
        return (
          <>
            {record.IsActive ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            )}
          </>
        );
      },
    },
    {
      title: "",
      align: "center",
      width: "5%",
      render: (value, record) => {
        return (
          <>
            <a
              href="#"
              className={`edit-btn ${
                hasRight(currTran.moduleRights, "EDIT")
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={hasRight(currTran.moduleRights, "EDIT")}
              style={{ marginRight: 10 }}
            >
              <span
                onClick={() => {
                  setEditedData({ entryMode: "E", formData: record });
                }}
              >
                <EditTwoTone />
              </span>
            </a>
          </>
        );
      },
    },
  ];

  return (
    <>
      {!editedData && <CardHeader title={currTran.formTitle} />}
      <Card bodyStyle={{ padding: 5 }}>
        {editedData && (
          <AppRouteCard
            RouteId={editedData.formData && editedData.formData.RouteId}
            data={editedData.formData}
            onSavePress={() => {
              setLoading(true);
              setEditedData();
              InitialFetch();
            }}
            onBackPress={() => {
              setEditedData();
            }}
          />
        )}
        {!editedData && AppRouteData && (
          <>
            <Row style={{ marginBottom: 5 }}>
              <Button
                loading={loading}
                style={{ marginRight: 10 }}
                type="primary"
                name="add"
                onClick={() => {
                  setEditedData({ entryMode: "A" });
                }}
                icon={<PlusCircleOutlined />}
                disabled={hasRight(currTran.moduleRights, "ADD")}
              >
                Add
              </Button>
            </Row>
            <Row>
              <Table
                loading={loading}
                bordered
                style={{ flex: 1 }}
                columns={columns}
                className="custom-pagination"
                dataSource={AppRouteData}
                pagination={
                  (AppRouteData > 15 ? true : false,
                  {
                    pageSize: 15,
                    size: "small",
                  })
                }
              />
            </Row>
          </>
        )}
      </Card>
    </>
  );
};

export default AppRoutePage;
