import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Select,
  Table,
  Row,
  Col,
  Card,
  Modal,
  Badge,
  Popconfirm,
  Tooltip,
  Checkbox,
  Typography,
} from "antd";
import {
  SearchOutlined,
  PlusCircleOutlined,
  RetweetOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import CardHeader from "../../common/CardHeader";
import { setFormCaption } from "../../../store/actions/currentTran";
import ConfigTableQRComp from "./ConfigTableQR/ConfigTableQRComp";
import { fetchBranchMaster } from "../../../store/actions/branchmaster";
import {
  fetchConfigureTableQR,
  UpdtConfigureTableQR,
} from "../../../services/configure-table-qr";
import swal from "sweetalert";
import QRCode from "qrcode.react";

const { Option } = Select;

const { Text } = Typography;

const ConfigTableQRCode = (props) => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const branchMaster = useSelector((state) => state.branchMaster.branchMaster);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inActiveData, setInActiveData] = useState(false);
  // const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const defBranch = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH").value1
  );
  const SelfOrderPath = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((ii) => ii.configCode === "SELF_ORDER_PATH")
        .value1
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [ss, setSS] = useState({
    comp: CompCode,
    branch: defBranch,
    department: "DINEIN",
  });

  const onConfirm = (values) => {
    const data = {
      CompCode: values.CompCode,
      BranchCode: values.BranchCode,
      DeptType: values.DeptType,
      TableSecCode: values.TableSecCode,
      TableCode: values.TableCode,
      TableName: values.TableName,
      SecretKey: values.SecretKey,
      IsActive: false,
      updt_usr: l_loginUser,
    };
    console.log(data,"dsf")
    UpdtConfigureTableQR(CompCode,data).then((res) => {
      if (res.data.message === "successful") {
        swal("Data saved successfully   !!!", {
          icon: "success",
        });
        fetchData();
      } else if (res.data.message === "unsuccessful") {
        swal(
          `${
            res.data.data.code === "ER_DUP_ENTRY"
              ? "Duplicate Entry"
              : "Something Went Wrong Try Again Later...."
          }`,
          {
            icon: "error",
          }
        );
      }
    });
  };

  const fetchData = () => {
    setLoading(true);
    if (ss.branch || ss.department) {
      fetchConfigureTableQR(CompCode, ss.branch, ss.department).then((res) => {
        if (res.length > 0) {
          setData(res);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };

  const downloadQR = (data) => {
    const canvas = document.getElementById(data.TableCode);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${data.TableCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const QRGen = (props) => {
    let link = `${SelfOrderPath}?compCode=${props.data.CompCode}&tableName=${props.data.TableName}&branchCode=${props.data.BranchCode}&deptCode=${props.data.DeptType}&secCode=${props.data.TableSecCode}&tableNo=${props.data.TableCode}`;
    return (
      <div key={props.data.TableCode} style={{ display: "none" }}>
        <QRCode
          id={props.data.TableCode}
          value={link}
          size={290}
          level={"H"}
          includeMargin={true}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Department",
      dataIndex: "DeptType",
      align: "center",
      width: "15%",
      render: (record, text) => {
        return (
          <>
            <Text>{record === "DINEIN" ? "Dine-In" : record}</Text>
          </>
        );
      },
    },
    {
      title: "Table Section",
      dataIndex: "TableSecCode",
      align: "center",
      width: "15%",
    },
    {
      title: "Table Code",
      dataIndex: "TableCode",
      align: "center",
      width: "15%",
    },
    {
      title: "Table Name",
      dataIndex: "TableName",
      align: "center",
      width: "15%",
    },
    {
      title: "Secret Key",
      dataIndex: "SecretKey",
      align: "center",
    },
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
      width: "5%",
      align: "center",
      render: (record) => {
        return (
          <>
            {record.IsActive && (
              <>
                <QRGen data={record} />
                <a
                  onClick={() => {
                    downloadQR(record);
                  }}
                  style={{ marginRight: 5 }}
                >
                  <Tooltip
                    title="Click To Download QR Code"
                    placement="topRight"
                  >
                    <i
                      className="fa fa-download color-style"
                      // style={{ color: "#fb8a2d" }}
                      aria-hidden="true"
                    />
                  </Tooltip>
                </a>
                 <Popconfirm
                  title="Are you sure to change status?"
                  onConfirm={() => onConfirm(record)}
                  // onCancel={onCancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined className="color-style" />
                </Popconfirm>
              </>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(setFormCaption(87));
    dispatch(fetchBranchMaster());
    fetchData();
  }, []);

  return (
    <>
      <Row>
        <Col span={24}>
          <CardHeader title={currTran.formTitle} />
          <Card bordered={true} bodyStyle={{ padding: 8, margin: 3 }}>
            <Row style={{ marginBottom: 5 }}>
              <label style={{ margin: 6 }}>Branch:</label>
              <Select
                allowClear={true}
                value={ss.branch}
                showSearch
                style={{ width: 250, marginRight: 5 }}
                placeholder="Select Branch"
                onChange={(val) => {
                  setSS({ ...ss, branch: val });
                }}
                disabled={data.length > 0}
              >
                {branchMaster.length > 0 &&
                  branchMaster.map((i) => {
                    return (
                      <Option key={i.BranchCode} value={i.BranchCode}>
                        {i.BranchName}
                      </Option>
                    );
                  })}
              </Select>
              <label style={{ margin: 6 }}>Department:</label>
              <Select
                onChange={(val) => {
                  setSS({ ...ss, department: val });
                }}
                value={ss.department}
                disabled={data.length > 0}
                allowClear={true}
                showSearch
                style={{ width: 200, marginRight: 5 }}
                placeholder="Select Department"
              >
                <Option key="DINEIN" value="DINEIN">
                  Dine In
                </Option>
                {/* <Option key="DELIVERY" value="DELIVERY">
                  Delivery
                </Option>
                <Option key="PICKUP" value="PICKUP">
                  Pick Up
                </Option>
                <Option key="ONLINE" value="ONLINE">
                  Online Orders
                </Option>
                <Option key="2" value="0">
                  All
                </Option> */}
              </Select>
              <Button
                icon={<SearchOutlined />}
                type="primary"
                style={{ marginRight: 5 }}
                onClick={() => {
                  fetchData();
                }}
                disabled={!ss.branch || !ss.department || data.length > 0}
              >
                Show
              </Button>
              <Button
                icon={<RetweetOutlined />}
                type="primary"
                style={{ marginRight: 5 }}
                onClick={() => {
                  setSS({ comp: 1, branch: null, department: null });
                  setData([]);
                  setInActiveData(false);
                }}
              >
                Reset
              </Button>
            </Row>

            <Row>
              <Col span={24} style={{ margin: "0px 0px 5px" }}>
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setModal(true);
                  }}
                  disabled={!ss.branch || !ss.department}
                >
                  Add
                </Button>
                <Checkbox
                  disabled={!ss.branch || !ss.department}
                  onChange={(e) => {
                    setInActiveData(e.target.checked);
                  }}
                >
                  Show InActive Records
                </Checkbox>
              </Col>
              <Col span={24}>
                {data && (
                  <Table
                    loading={loading}
                    columns={columns}
                    bordered
                    dataSource={
                      inActiveData
                        ? data.filter((i) => i.IsActive === false)
                        : data.filter((i) => i.IsActive)
                    }
                    pagination={data.length > 25 ? true : false}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        visible={modal}
        width={"50%"}
        title={"Add New Data"}
        onCancel={() => setModal(false)}
        footer={null}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
      >
        <ConfigTableQRComp
          data={ss}
          onBackPress={() => {
            setModal(false);
          }}
          onSavePress={(val) => {
            if (val) {
              fetchData();
            }
          }}
        />
      </Modal>
    </>
  );
};

export default ConfigTableQRCode;
