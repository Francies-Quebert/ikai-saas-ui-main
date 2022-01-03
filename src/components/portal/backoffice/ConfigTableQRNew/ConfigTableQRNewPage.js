import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Row,
  Col,
  Card,
  Modal,
  Badge,
  Popconfirm,
  Tooltip,
  Checkbox,
} from "antd";
import Icon, {
  SearchOutlined,
  PlusCircleOutlined,
  RetweetOutlined,
  SettingOutlined,
  QrcodeOutlined,
  VerticalAlignBottomOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CardHeader from "../../../common/CardHeader";
import {
  fetchConfigureTableQR,
  UpdtConfigureTableQR,
} from "../../../../services/configure-table-qr";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchMasterData } from "../../../../services/branch-master";
import { setFormCaption } from "../../../../store/actions/currentTran";
import ConfigTableQRCard from "./Components/ConfigTableQRCard";
import QRCode from "qrcode.react";
import swal from "sweetalert";
const { Option } = Select;

const ConfigTableQRNewPage = (props) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [branch, setBranch] = useState();
  const [loading, setLoading] = useState(false);
  const [inActiveData, setInActiveData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const defBranch = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH").value1
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const SelfOrderPath = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((ii) => ii.configCode === "SELF_ORDER_PATH")
        .value1
  );
  //   const currTran = useSelector((state) => state.currTran);
  const [defValue, setDefValue] = useState({
    compCode: CompCode,
    branch: defBranch,
    department: "DINEIN",
  });

  const onConfirm = (values) => {
    // console.log(values,"values")
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
    console.log(data, "sadf");
    UpdtConfigureTableQR(CompCode, data).then((res) => {
      if (res.data.message === "successful") {
        swal("Data saved successfully   !!!", {
          icon: "success",
        });
        fetchData(data);
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
    if (defValue.branch || defValue.department) {
      fetchConfigureTableQR(
        CompCode,
        defValue.branch,
        defValue.department
      ).then((res) => {
        if (res.length > 0) {
          setData(res);
          setSearchedData(res);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };

  const downloadQR = (xx) => {
    const canvas = document.getElementById(xx.TableCode);
    console.log(xx.TableCode);
    // console.log(xx.TableCode)
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${xx.TableCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const QRGen = (aa) => {
    let xx = aa.data;
    let link = `${SelfOrderPath}?compCode=${xx.CompCode}&tableName=${xx.TableName}&branchCode=${xx.BranchCode}&deptCode=${xx.DeptType}&secCode=${xx.TableSecCode}&tableNo=${xx.TableCode}`;
    return (
      <div key={xx.TableCode} style={{ display: "none" }}>
        <QRCode
          id={xx.TableCode}
          value={link}
          size={290}
          level={"H"}
          includeMargin={true}
        />
      </div>
    );
  };

  
  useEffect(() => {
    dispatch(setFormCaption(87));
    fetchBranchMasterData(CompCode).then((res) => {
      setBranch(res);
    });
    fetchData();
  }, []);

  return (
    <>
      <Modal
        visible={modal}
        width={"50%"}
        title={"Add New Data"}
        onCancel={() => setModal(false)}
        footer={null}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
      >
        <ConfigTableQRCard
          data={defValue}
          onBackPress={() => {
            setModal(false);
          }}
          // formData={editedData.formData}
          onSavePress={(val) => {
            if (val) {
              fetchData();
            }
          }}
        />
      </Modal>
      <>
        <Row>
          <Col span={24}>
            <CardHeader title={"Config"} />
            <Card bordered={true} bodyStyle={{ padding: 8, margin: 3 }}>
              <Row style={{ marginBottom: 5 }}>
                <label style={{ margin: 6 }}>Branch:</label>
                <Select
                  allowClear={true}
                  value={defValue.branch}
                  showSearch
                  style={{ width: 250, marginRight: 5 }}
                  placeholder="Select Branch"
                  onChange={(val) => {
                    setDefValue({ ...defValue, branch: val });
                  }}
                  disabled={data.length > 0}
                >
                  {branch &&
                    branch
                      .filter((i) => i.IsActive === true)
                      .map((h) => {
                        return (
                          <Option key={h.BranchCode} value={h.BranchCode}>
                            {h.BranchName}
                          </Option>
                        );
                      })}
                </Select>
                <label style={{ margin: 6 }}>Department:</label>
                <Select
                  onChange={(val) => {
                    setDefValue({ ...defValue, department: val });
                  }}
                  value={defValue.department}
                  disabled={data.length > 0}
                  allowClear={true}
                  showSearch
                  style={{ width: 200, marginRight: 5 }}
                  placeholder="Select Department"
                >
                  <Option key="DINEIN" value="DINEIN">
                    Dine In
                  </Option>
                </Select>
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    fetchData();
                    console.log("sad");
                  }}
                  disabled={
                    !defValue.branch || !defValue.department || data.length > 0
                  }
                >
                  Show
                </Button>
                <Button
                  icon={<RetweetOutlined />}
                  type="primary"
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    setDefValue({ comp: 1, branch: null, department: null });
                    setData([]);
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
                    disabled={!defValue.branch || !defValue.department}
                  >
                    Add
                  </Button>
                  <Checkbox
                    disabled={!defValue.branch || !defValue.department}
                    onChange={(e) => {
                      setInActiveData(e.target.checked);
                    }}
                  >
                    Show InActive Records
                  </Checkbox>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Col>
          <Row>
            {searchedData &&
              searchedData
                .filter((aa) => (inActiveData ? true : aa.IsActive === true))
                .map((xx, ii) => {
                  // inActiveData
                  //   ? data.filter((i) => i.IsActive === false)
                  //   : data.filter((i) => i.IsActive);
                  return (
                    <Card
                      key={ii}
                      style={{
                        width: 285,
                        borderRadius: "15px",
                        position: "relative",
                        margin: 5,
                      }}
                      bodyStyle={{ padding: 5 }}
                    >
                      <Row style={{ display: "flex" }}>
                        <Col
                          style={{
                            flex: 0.3,
                            justifyContent: "center",
                            fontSize: 35,
                            flex: 0.2,
                          }}
                        >
                          <QrcodeOutlined />
                        </Col>

                        <Col style={{ flex: 1 }}>
                          <Row
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <h4 style={{ margin: 0 }}>{xx.TableSecCode}</h4>
                          </Row>
                          <Row
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <h4 style={{ margin: 0 }}>{xx.TableCode}</h4>
                          </Row>
                        </Col>
                        <Col
                          style={{
                            color: "var(--app-theme-color)",
                            flex: 0.3,
                            justifyContent: "center",
                          }}
                        >
                          <QRGen data={xx} />
                          <Button
                            shape="circle"
                            type="link"
                            // disabled={hasRight(currTran.moduleRights, "EDIT")}
                            icon={
                              <Icon component={VerticalAlignBottomOutlined} />
                            }
                            style={{
                              position: "relative",
                              right: 0,
                              bottom: 1,
                            }}
                            onClick={() => {
                              downloadQR(xx);
                            }}
                          ></Button>
                          {/* <QRGen data={xx} />
                        <a
                          onClick={() => {
                            downloadQR(xx);
                            console.log(xx, "sad");
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
                        </a> */}

                          <Popconfirm
                            title="Are you sure to change status?"
                            onConfirm={() => {
                              onConfirm(xx);
                              // console.log(data,"fsd")
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              shape="circle"
                              type="link"
                              icon={<Icon component={DeleteOutlined} />}
                              // disabled={hasRight(currTran.moduleRights, "EDIT")}
                              style={{
                                position: "relative",
                                right: 0,
                                bottom: 7,
                              }}
                              onClick={() => {}}
                            ></Button>
                          </Popconfirm>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
          </Row>
        </Col>
      </>
    </>
  );
};

export default ConfigTableQRNewPage;
