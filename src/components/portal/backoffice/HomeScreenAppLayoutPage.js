import React, { Fragment, useEffect, useState } from "react";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Button,
  Divider,
  Card,
  Table,
  Badge,
  Typography,
  Avatar,
} from "antd";
import { PlusCircleOutlined, UserOutlined } from "@ant-design/icons";
import {
  fetchHomeScreenAppLayoutDtl,
  fetchHomeScreenAppLayout,
} from "../../../services/homescreen-app-layout";
import HomeScreenAppLayoutCard from "./HomeScreenAppLayout/HomeScreenAppLayoutCard";
import HomeScreenAppLayoutDtlCard from "./HomeScreenAppLayout/HomeScreenAppLayoutDtlCard";
import { toast } from "react-toastify";
const { Title } = Typography;
const HomeScreenAppLayoutPage = () => {
  const dispatch = useDispatch();
  //useState
  const [layoutData, setLayoutData] = useState([]);
  const [layoutDtlData, setLayoutDtlData] = useState([]);
  const [editedData, setEditedData] = useState();
  const [editedDtlData, setEditedDtlData] = useState();
  const currTran = useSelector((state) => state.currentTran);
  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(setFormCaption(53));

    fetchHomeScreenAppLayout(CompCode).then((res) => {
      setLayoutData(res);
    });
    fetchHomeScreenAppLayoutDtl(CompCode).then((res) => {
      setLayoutDtlData(res);
    });
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {
    if (currTran.isLoading === false) {
      fetchHomeScreenAppLayout(CompCode).then((res) => {
        setLayoutData(res);
      });
      fetchHomeScreenAppLayoutDtl(CompCode).then((res) => {
        setLayoutDtlData(res);
      });
    }
  }, [currTran.isLoading]);

  const NestedTable = () => {
    const expandedRowRender = (val, val2, val3) => {
      // console.log(val,layoutDtlData)
      //   console.log(layoutDtlData.filter((ii) => ii.LayoutId === val.LayoutId));
      const columns = [
        {
          key: "key",
          title: "Title",
          dataIndex: "PromoTitle",
          align: "center",
        },
        {
          title: "Promo Image",
          dataIndex: "PromoImageUri",
          key: "PromoImageUri",
          width: 10,
          render: (text, record) => {
            return record.PromoImageUri && record.PromoImageUri.length > 0 ? (
              <Avatar
                shape="square"
                src={
                  record.pathType === "C"
                    ? `${FileUploadPath.value1}/${record.PromoImageUri}`
                    : record.PromoImageUri
                }
              />
            ) : (
              <Avatar shape="square" icon={<UserOutlined />} />
            );
          },
        },
        {
          key: "IsActive",
          title: "Status",
          dataIndex: "IsActive",
          render: (text, record) =>
            record.IsActive === true ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            ),
          align: "center",
        },
        {
          title: "",
          dataIndex: "",
          key: "x",
          render: (text, record) => (
            <a href="#">
              <i
                className="fa fa-pencil-square-o"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(40, 167, 69)",
                }}
                onClick={() => {
                  setEditedDtlData({ entryMode: "E", formData: record });
                }}
              ></i>
            </a>
          ),
        },
      ];

      //let kkk = [...layoutDtlData.filter()]

      return (
        <div style={{ margin: 15, marginLeft: 10 }}>
          <Table
            bordered={false}
            showHeader={false}
            columns={columns}
            dataSource={layoutDtlData.filter(
              (ii) => ii.LayoutId === val.LayoutId
            )}
            pagination={false}
          />
        </div>
      );
    };

    const columns = [
      {
        title: "",
        dataIndex: "",
        key: "y",
        width: 10,
        render: (text, record) => (
          <a href="#">
            <i
              className="fa fa-plus-circle"
              style={{
                width: 35,
                fontSize: 16,
                padding: 11,
                color: "rgb(24,144,255)",
              }}
              onClick={() => {
                setEditedDtlData({ entryMode: "E", formData: record });
              }}
            ></i>
          </a>
        ),
      },
      {
        key: "key",
        title: "Layout No.",
        dataIndex: "key",
        align: "center",
      },

      {
        key: "LayoutTitle",
        title: "Layout Title",
        dataIndex: "LayoutTitle",
        align: "center",
      },
      {
        key: "IsActive",
        title: "Status",
        dataIndex: "IsActive",
        render: (text, record) =>
          record.IsActive === true ? (
            <Badge status="success" />
          ) : (
            <Badge status="error" />
          ),
        align: "center",
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (text, record) => (
          <a href="#">
            <i
              className="fa fa-pencil-square-o"
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
        ),
      },
    ];

    return (
      <Row gutter={[8, 8]}>
        {!editedData && !editedDtlData && (
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <CardHeaderExtra title="HomeScreen App Layout" />
            <Card bodyStyle={{ padding: "10px 10px" }}>
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      setEditedData({ entryMode: "A" });
                    }}
                  >
                    Add New Layout
                  </Button>
                </Col>
                <Col span={24}>
                  {layoutData && layoutData.length > 0 && (
                    <Table
                      columns={columns}
                      expandable={{
                        expandedRowRender,
                      }}
                      dataSource={layoutData}
                      bordered={false}
                      pagination={false}
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
              <Card bodyStyle={{ padding: "10px 10px" }}>
                <HomeScreenAppLayoutCard
                  onBackPress={() => setEditedData()}
                  formData={editedData.formData}
                />
              </Card>
            </Col>
          )}
        {editedDtlData &&
          (editedDtlData.entryMode === "E" ||
            editedDtlData.entryMode === "A") && (
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card bodyStyle={{ padding: "10px 10px" }}>
                <HomeScreenAppLayoutDtlCard
                  onBackPress={() => setEditedDtlData()}
                  formData={editedDtlData.formData}
                />
              </Card>
            </Col>
          )}
      </Row>
    );
  };
  return <NestedTable />;
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
    </Row>
  );
};

export default HomeScreenAppLayoutPage;
