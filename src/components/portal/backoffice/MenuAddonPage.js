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
  fetchMenuAddonHdr,
  fetchMenuAddonDtl,
} from "../../../services/menu-addon";
import MenuAddonHdrCard from "./MenuAddon/MenuAddonHdr";
import { hasRight } from "../../../shared/utility";
import MenuAddonDtlCard from "./MenuAddon/MenuAddonDtl";
import { toast } from "react-toastify";
const { Title } = Typography;

const MenuAddonPage = () => {
  const dispatch = useDispatch();
  //useState
  const [addonHdrData, setAddonHdrData] = useState([]);
  const [addonDtlData, setAddonDtlData] = useState([]);
  const [editedHdrData, setEditedHdrData] = useState();
  const [editedDtlData, setEditedDtlData] = useState();
  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(setFormCaption(60));

    fetchMenuAddonHdr(CompCode).then((res) => {
      setAddonHdrData(res);
    });
    fetchMenuAddonDtl(CompCode).then((res) => {
      setAddonDtlData(res);
    });
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  useEffect(() => {
    if (currTran.isLoading === false) {
      fetchMenuAddonHdr(CompCode).then((res) => {
        setAddonHdrData(res);
        fetchMenuAddonDtl(CompCode).then((res) => {
          setAddonDtlData(res);
        });
      });
    }
  }, [currTran.isLoading]);

  const NestedTable = () => {
    const expandedRowRender = (val, val2, val3) => {
      const columns = [
        {
          key: "ItemName",
          title: "Item Name",
          dataIndex: "ItemName",
          align: "center",
          width: "25%",
        },
        {
          title: "Item Rate",
          dataIndex: "Rate",
          key: "Rate",
          width: "10%",
        },
        {
          title: "Info",
          dataIndex: "AddInfo",
          key: "AddInfo",
          width: "50%",
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
          render: (text, record) => {
            // console.log(record);
            return (
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
            );
          },
        },
      ];

      //let kkk = [...layoutDtlData.filter()]

      return (
        <div style={{ margin: 15, marginLeft: 10 }}>
          <Table
            bordered={false}
            showHeader={true}
            columns={columns}
            dataSource={addonDtlData.filter(
              (ii) => ii.AddOnCode === val.AddOnCode
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
        render: (text, record) => {
          return (
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
                  setEditedDtlData({ entryMode: "A", formData: record });
                }}
              ></i>
            </a>
          );
        },
      },
      {
        key: "key",
        title: "AddOn Code",
        dataIndex: "key",
        align: "center",
      },

      {
        key: "AddOnName",
        title: "AddOn Name",
        dataIndex: "AddOnName",
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
                setEditedHdrData({ entryMode: "E", formData: record });
              }}
            ></i>
          </a>
        ),
      },
    ];

    return (
      <Row gutter={[8, 8]}>
        {!editedHdrData && !editedDtlData && (
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <CardHeaderExtra title={currTran.formTitle} />
            <Card bodyStyle={{ padding: "10px 10px" }}>
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      setEditedHdrData({ entryMode: "A" });
                    }}
                    disabled={hasRight(currTran.moduleRights, "ADD")}
                  >
                    Add New AddOn
                  </Button>
                </Col>
                <Col span={24}>
                  {addonHdrData && addonHdrData.length > 0 && (
                    <Table
                      columns={columns}
                      expandable={{
                        expandedRowRender,
                      }}
                      dataSource={addonHdrData}
                      bordered={false}
                      pagination={false}
                    />
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        )}
        {editedHdrData &&
          (editedHdrData.entryMode === "E" ||
            editedHdrData.entryMode === "A") && (
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card bodyStyle={{ padding: "10px 10px" }}>
                <MenuAddonHdrCard
                  onBackPress={() => setEditedHdrData()}
                  formData={editedHdrData.formData}
                />
              </Card>
            </Col>
          )}
        {editedDtlData &&
          (editedDtlData.entryMode === "E" ||
            editedDtlData.entryMode === "A") && (
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card bodyStyle={{ padding: "10px 10px" }}>
                <MenuAddonDtlCard
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

export default MenuAddonPage;
