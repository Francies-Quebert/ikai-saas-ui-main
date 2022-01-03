import React, { useState } from "react";
import { EditTwoTone, SaveOutlined, SaveTwoTone } from "@ant-design/icons";
import {
  Modal,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Table,
  Typography,
  Input,
  Form,
} from "antd";

const Text = { Typography };

export const HotKeyForm = (props) => {
  const [form, setForm] = useState(props.data);
  return (
    <>
      <Row>
        <Col flex={1}>
          <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> Event Name :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Input
                    defaultValue={form.EventName}
                    placeholder="Please Enter Event Name"
                    onChange={(e) => {
                      setForm({
                        ...form,
                        EventName: e.target.value,
                        isDirty: true,
                      });
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> Event Hotkey :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Input
                    placeholder="Please Enter Hotkey"
                    defaultValue={form.HotKey}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        HotKey: e.target.value,
                        isDirty: true,
                      });
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> Order By :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Input
                    type="number"
                    placeholder="Please Enter OrderBy"
                    defaultValue={form.OrderBy}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        OrderBy: e.target.value,
                        isDirty: true,
                      });
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Divider style={{ marginBottom: 5, marginTop: 5 }} />
            <div
              style={{
                padding: "5px 15px",
                textAlign: "end",
                marginTop: 5,
              }}
            >
              <Button
                style={{ marginRight: 7 }}
                onClick={() => {
                  props.onCancel();
                }}
              >
                Cancel
              </Button>
              <Button
                icon={<SaveOutlined />}
                type="primary"
                onClick={() => {
                  props.onSetClick(form);
                  props.onCancel();
                }}
              >
                Set
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const ChangeKeyBoardHotKeys = (props) => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(props.data);

  const columns = [
    {
      title: "Sr.No.",
      width: 10,
      dataIndex: "EventSrNo",
      align: "center",
      //   render: (value, record) => {
      //     return <Text>{parseInt(value)}</Text>;
      //   },
    },
    {
      title: "EventName",
      width: 10,
      dataIndex: "EventName",
      align: "center",
    },
    {
      title: "Hot Key",
      width: 10,
      dataIndex: "HotKey",
      align: "center",
    },
    {
      title: "OrderBy",
      width: 10,
      dataIndex: "OrderBy",
      align: "center",
    },
    {
      width: "10%",
      align: "center",
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => {
        return (
          <>
            <a style={{ marginRight: 10 }} onClick={() => setShowForm(record)}>
              <EditTwoTone />
            </a>
          </>
        );
      },
    },
  ];

  const handleEdit = (record) => {
    const newData = [...data];
    newData[newData.findIndex((ii) => ii.key === record.key)] = record;
    setData([...newData]);
  };

  return (
    <div>
      <Row>
        <Col flex={1}>
          <Card bordered={true} bodyStyle={{ padding: 5 }}>
            <Table
              bordered={true}
              dataSource={data}
              pagination={false}
              columns={columns}
            />
            <Divider style={{ marginBottom: 5, marginTop: 5 }} />
            <div
              style={{
                padding: "5px 15px",
                textAlign: "end",
                marginTop: 5,
              }}
            >
              <Button
                style={{ marginRight: 7 }}
                onClick={() => {
                  props.onBackPress();
                }}
              >
                Cancel
              </Button>
              <Button
                icon={<SaveOutlined />}
                type="primary"
                onClick={() => {
                  props.onSavePress(data);
                }}
              >
                Save
              </Button>
            </div>
            <Modal
              title={
                <span
                  className="color-style"
                  style={{ textDecoration: "underline" }}
                >
                  Edit HotKey Config
                </span>
              }
              footer={false}
              bodyStyle={{ padding: 0 }}
              destroyOnClose={true}
              width={750}
              closeIcon={null}
              visible={showForm}
              onCancel={() => {
                setShowForm(false);
              }}
            >
              <HotKeyForm
                data={showForm}
                onCancel={() => {
                  setShowForm(false);
                }}
                onSetClick={(values) => {
                  handleEdit(values);
                }}
              />
            </Modal>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChangeKeyBoardHotKeys;
