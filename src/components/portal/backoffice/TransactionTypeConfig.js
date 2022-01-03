import React, { useState, useEffect } from "react";
import {
  Badge,
  Table,
  Row,
  Col,
  Card,
  Select,
  Button,
  Divider,
  Modal,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  RetweetOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import CardHeader from "../../common/CardHeader";
import { setFormCaption } from "../../../store/actions/currentTran";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import {
  fetchTransactionTypeConfig,
  fetchTransactionTypeMaster,
  DeleteTransactionTypeConfig,
} from "../../../services/transaction-type-master";
import TransactionTypeConfigComp from "./TransactionTypeConfig/TransactionTypeConfigComp";

const TransactionTypeConfig = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const [tranType, setTranType] = useState([]);
  const [branch, setBranch] = useState();
  const [tranCode, setTranCode] = useState();
  const [rowData, setRowData] = useState();
  const [modal, setModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const currentTran = useSelector((state) => state.currentTran);
  const branchMaster = useSelector((state) => state.branchMaster.branchMaster);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(setFormCaption(93));
    dispatch(fetchBranchMaster());
    fetchTransactionTypeMaster(CompCode).then((res) => {
      setTranType(res);
    });
  }, []);
  //console.log(tranType);

  const onConfirm = (value) => {
    let data = {
      CompCode: CompCode,
      BranchCode: value.BranchCode,
      TranTypeCode: value.TranTypeCode,
      ConfigCode: value.ConfigCode,
    };
    if (data) {
      DeleteTransactionTypeConfig(CompCode, data).then((res) => {
        if (res.data.message === "successful") {
          fetchTransactionTypeConfig(CompCode, branch, tranCode).then((res) => {
            setTableData(res);
          });
        }
      });
    }
  };

  const columns = [
    {
      title: "Config Code",
      dataIndex: "ConfigCode",
      align: "center",
      width: 300,
    },
    {
      title: "Config Description",
      dataIndex: "ConfigDesc",
      align: "center",
      width: 600,
    },
    {
      title: "IsActive",
      dataIndex: "IsActive",
      align: "center",
      width: 200,
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
      dataIndex: "Action",
      align: "center",
      render(txt, record) {
        //console.log(txt, record, "dada");
        return (
          <>
            <Tooltip title="Click Here To Edit Data" placement="top">
              <i
                className="fa fa-pencil color-style"
                onClick={() => {
                  setModal(true);
                  setRowData(record);
                }}
              ></i>
            </Tooltip>
            <Popconfirm
              title="Are you sure to change status?"
              onConfirm={() => onConfirm(record)}
              // onCancel={onCancel}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined
                className="color-style"
                style={{ marginLeft: 10 }}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      <CardHeader title={currentTran.formTitle} />
      <Card bordered={true} bodyStyle={{ padding: 0 }}>
        <Row>
          <Col xs={2} sm={4} md={6} lg={8} xl={24}>
            <label style={{ margin: 12 }}>Branch :</label>
            <Select
              allowClear={true}
              value={branch}
              style={{ width: 200 }}
              disabled={tableData.length > 0}
              placeholder="Select Branch"
              onChange={(val) => {
                setBranch(val);
              }}
            >
              {branchMaster.length > 0 &&
                branchMaster
                  .filter((i) => i.IsActive)
                  .map((i) => {
                    return (
                      <Option key={i.BranchCode} value={i.BranchCode}>
                        {i.BranchName}
                      </Option>
                    );
                  })}
            </Select>
            <label style={{ margin: 10 }}>Transaction Type:</label>
            <Select
              style={{ width: 200 }}
              value={tranCode}
              disabled={tableData.length > 0}
              placeholder="Select Transaction Type"
              onChange={(val) => {
                setTranCode(val);
                //console.log(val);
              }}
            >
              {tranType.length > 0 &&
                tranType
                  .filter((a) => a.IsActive)
                  .map((a) => {
                    return (
                      <Option key={a.TranTypeCode} value={a.TranTypeCode}>
                        {a.TranTypeName}
                      </Option>
                    );
                  })}
            </Select>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ marginLeft: 5 }}
              disabled={!branch || !tranCode}
              onClick={() => {
                fetchTransactionTypeConfig(CompCode, branch, tranCode).then(
                  (res) => {
                    setTableData(res);
                    // console.log(res, "data");
                  }
                );
              }}
            >
              Show
            </Button>
            <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginLeft: 5, marginRight: 5 }}
              onClick={() => {
                setBranch();
                setTranCode();
                setTableData([]);
              }}
            >
              Reset
            </Button>
          </Col>
          <Divider
            type="horizontal"
            style={{ marginBottom: 5, marginTop: 3 }}
          />
          <Row>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              style={{ marginLeft: 10 }}
              disabled={!branch || !tranCode}
              onClick={() => {
                setModal(true);
                setRowData();
              }}
            >
              Add New Data
            </Button>
          </Row>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              bordered={true}
              dataSource={tableData}
              columns={columns}
              style={{ margin: 10 }}
              pagination={false}
            />
            <Divider
              type="horizontal"
              style={{ marginBottom: 5, marginTop: 3 }}
            />
          </Col>
        </Row>
      </Card>
      <Modal
        visible={modal}
        width={"50%"}
        title={"Add Data"}
        onCancel={() => setModal(false)}
        footer={null}
        bodyStyle={{ padding: 0 }}
        destroyOnClose={true}
      >
        <TransactionTypeConfigComp
          branch={branch}
          tranType={tranCode}
          data={rowData}
          onBackPress={() => {
            setModal(false);
          }}
          onSave={(data) => {
            if (data) {
              fetchTransactionTypeConfig(CompCode, branch, tranCode).then(
                (res) => {
                  setTableData(res);
                  setModal(false);
                  //console.log(res, "data");
                }
              );
            }
          }}
        />
      </Modal>
    </>
  );
};

export default TransactionTypeConfig;
