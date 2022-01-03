import React, { useEffect, useState } from "react";
import {
  Card,
  Divider,
  Row,
  Col,
  Button,
  Modal,
  Table,
  Popconfirm,
  Typography,
} from "antd";
import { useSelector } from "react-redux";
// import Logo from "../../../../../assets/images/res-logo.png";
import icon_delivery from "../../../../../assets/images/icon/delivery.png";
import icon_DineIn from "../../../../../assets/images/icon/DineIn.png";
import icon_merchant from "../../../../../assets/images/icon/merchant.png";
import icon_Online from "../../../../../assets/images/icon/Online.png";
import icon_pickup from "../../../../../assets/images/icon/pickup.png";
import {
  getKOTDtlData,
  updtKOTStatus,
  updtKOTItemStatus,
  updtRestaurantKOTStatus,
} from "../../../../../services/kot-view";
import moment from "moment";
import AppLoader from "../../../../common/AppLoader";
import {
  CheckCircleOutlined,
  DeleteTwoTone,
  RollbackOutlined,
  SaveOutlined,
  StopOutlined,
} from "@ant-design/icons";
import swal from "sweetalert";
import { updtKOTViewTableStatus } from "../../../../../services/restaurant-pos";

const ViewDtlComponent = (props) => {
  const [dtlData, setDtlData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalQty, setTotalQty] = useState(0);
  const [readyModal, setReadyModal] = useState(false);
  const l_ConfigDTTMFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTTMFORMAT")
  );
  const [reRender, setReRender] = useState(false);
  const [saveDisable, setSaveDisable] = useState(false);
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const { Text } = Typography;
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setIsLoading(true);
    if (props.data) {
      getKOTDtlData(CompCode, props.data.KOTId).then((res) => {
        // let tempkeys = [];
        let tempQty = 0;
        res
          .filter((i) => i.ItemStatus !== "CNL")
          .forEach((i) => {
            tempQty += i.Qty;
            // tempkeys.push(i.key);
          });
        setTotalQty(tempQty);
        // setSelectedKey(tempkeys);
        setDtlData(res);
        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    // if (reRender) {
    //   getKOTDtlData(props.data.KOTId).then((res) => {
    //     let tempQty = 0;
    //     res.forEach((i) => {
    //       tempQty += i.Qty;
    //     });
    //     setTotalQty(tempQty);
    //     setDtlData(res);
    //     setIsLoading(false);
    //   });
    // }
    setReRender(false);
  }, [reRender]);

  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      setSaveDisable(selectedRows.length <= 0 ? true : false);
      record.IsChecked = selected ? "Y" : "N";
      setDtlData([
        ...dtlData.filter((ii) => parseInt(ii.key) !== parseInt(record.key)),
        record,
      ]);
    },

    onSelectAll: (selected, selectedRows, changeRows) => {
      setSaveDisable(selectedRows.length <= 0 ? true : false);
      let tempData = [];
      dtlData.forEach((row) => {
        tempData.push({
          ...row,
          IsChecked:
            selected && row.ItemStatus !== "RDY" && row.ItemStatus !== "CNL"
              ? "Y"
              : "N",
        });
      });
      setDtlData(tempData);
    },

    selectedRowKeys: dtlData
      .filter((dd) => dd.IsDeleted === "N" && dd.IsChecked === "Y")
      .map((a) => parseInt(a.key)),

    getCheckboxProps: (record) => ({
      disabled:
        record.ItemStatus === "RDY" || record.ItemStatus === "CNL"
          ? true
          : false,
    }),
  };

  const Kotcolumns = [
    {
      title: "Item Name",
      align: "left",
      render: (value, record, index) => {
        return (
          <>
            {record.ItemStatus === "CNL" ? (
              <span style={{ color: "Red" }}>
                <strike>{record.MenuDisplayName}</strike>
              </span>
            ) : record.ItemStatus === "RDY" ? (
              <span style={{ color: "green" }}>{record.MenuDisplayName}</span>
            ) : record.ItemStatus === "PND" ? (
              <span className="color-style">{record.MenuDisplayName}</span>
            ) : (
              <span>{record.MenuDisplayName}</span>
            )}
          </>
        );
      },
    },
    {
      width: 100,
      title: "Quantity",
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <span>{record.Qty}</span>
          </>
        );
      },
    },
    {
      align: "center",
      dataIndex: "",
      key: "x",
      width: "5%",
      render: (text, record) => {
        // console.log(record, "data");
        return (
          <>
            <Popconfirm
              title="Are you sure delete ?"
              onConfirm={() => {
                record.IsDeleted = "Y";
                setDtlData([
                  ...dtlData.filter(
                    (ii) => parseInt(ii.key) !== parseInt(record.key)
                  ),
                  record,
                ]);
              }}
              okText="Yes"
              cancelText="No"
            >
              <a>
                <DeleteTwoTone />
              </a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <>
      {isLoading && <AppLoader />}
      {!isLoading && (
        <>
          <Card
            style={{ width: "100%", height: "100%" }}
            bodyStyle={{
              width: "100%",
              height: "100%",
              minHeight: 300,
              padding: "5px 6px 12px",
              position: "relative",
              fontFamily: `Montserrat, sans-serif`,
              fontSize: 13,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "35%",
                top: "35%",
                //   bottom: "50%",
                opacity: 0.2,
              }}
            >
              <img
                src={
                  props.data.OrderType === "PICKUP"
                    ? icon_pickup
                    : props.data.OrderType === "DELIVERY"
                    ? icon_delivery
                    : props.data.OrderType === "ONLINE"
                    ? icon_Online
                    : props.data.OrderType === "MERCHANT"
                    ? icon_merchant
                    : props.data.OrderType === "SELFORDER"
                    ? ""
                    : icon_DineIn
                }
                height="auto"
                width="90px"
              />
            </div>
            <>
              <div
                style={{
                  top: 6,
                  fontWeight: 600,
                  // flex: 1,
                  padding: 5,
                  height: 30,
                  border: "1px solid #cecece",
                  fontSize: 12,
                  background: "cadetblue",
                  color: "#fff",
                  // textAlign: "center",
                }}
              >
                {props.data.DeptCode}
              </div>
              <div style={{ height: "16px" }}>
                <div style={{ display: "flex" }}>
                  <span
                    style={{
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    KOT Id : {`${props.data.KOTId}`}
                  </span>
                  <span style={{ flex: 1, textAlign: "end" }}>
                    {`${moment(props.data.KOT_Date).format(
                      l_ConfigDTTMFormat.value1
                    )}
              `}
                  </span>
                </div>
              </div>
              <Divider style={{ margin: "5px 0px" }} />

              <div
                className="table-KOT"
                id="style-1"
                style={{ overflow: "hidden auto", flex: 1 }}
              >
                <table
                  style={{
                    width: "100%",
                    flex: 1,
                    overflowY: "auto",
                    msOverflowY: "auto",
                    fontSize: 12,
                  }}
                >
                  <tbody>
                    {dtlData.length > 0 &&
                      dtlData
                        .sort((a, b) =>
                          parseInt(a.key) > parseInt(b.key) ? 1 : -1
                        )
                        .map((i) => {
                          return (
                            <tr
                              key={i.Id}
                              style={{ borderBottom: "1px dashed #cecece" }}
                            >
                              <td>
                                {i.ItemStatus === "RDY" ? (
                                  <span
                                    style={{
                                      color: "lightgreen",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {i.MenuDisplayName}
                                  </span>
                                ) : i.ItemStatus === "CNL" ? (
                                  <strike style={{ color: "red" }}>
                                    <span style={{ color: "red" }}>
                                      {i.MenuDisplayName}
                                    </span>
                                  </strike>
                                ) : i.ItemStatus === "PND" ? (
                                  <span className="color-style">
                                    {i.MenuDisplayName}
                                  </span>
                                ) : (
                                  <span>{i.MenuDisplayName}</span>
                                )}

                                {i.ItemStatus === "RDY" ? (
                                  <span
                                    style={{
                                      color: "lightgreen",
                                      fontSize: 11,
                                    }}
                                  >
                                    {i.MenuDisplayDesc}
                                  </span>
                                ) : i.ItemStatus === "CNL" ? (
                                  <strike style={{ color: "red" }}>
                                    <span
                                      style={{ color: "red", fontSize: 11 }}
                                    >
                                      {i.MenuDisplayDesc}
                                    </span>
                                  </strike>
                                ) : i.ItemStatus === "PND" ? (
                                  <span
                                    style={{ fontSize: 11 }}
                                    className="color-style"
                                  >
                                    {i.MenuDisplayDesc}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 11 }}>
                                    {i.MenuDisplayDesc}
                                  </span>
                                )}

                                {/* {i.MenuDisplayDesc && (
                                  <>
                                    <br />
                                    <span style={{ fontSize: 11 }}>
                                      {i.MenuDisplayDesc}
                                    </span>{" "}
                                  </>
                                )} */}
                                <br />
                                <span
                                  style={{ fontStyle: "italic", fontSize: 11 }}
                                >
                                  {i.CookingRemark}
                                </span>
                              </td>
                              <td>
                                {i.ItemStatus === "RDY" ? (
                                  <span
                                    style={{
                                      color: "lightgreen",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {i.Qty}
                                  </span>
                                ) : i.ItemStatus === "CNL" ? (
                                  <strike style={{ color: "red" }}>
                                    <span style={{ color: "red" }}>
                                      {i.Qty}
                                    </span>
                                  </strike>
                                ) : i.ItemStatus === "PND" ? (
                                  <span className="color-style">{i.Qty}</span>
                                ) : (
                                  <span>{i.Qty}</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
              <div>
                <table
                  style={{
                    width: "100%",
                  }}
                >
                  <tbody>
                    <tr
                      style={{
                        borderTop: "2px dashed #cecece",
                        fontWeight: "600",
                      }}
                    >
                      <td width="130">Total</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>
                        {totalQty}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  // height: "20%",
                  display: "flex",
                  alignItems: "flex-end",
                  // paddingBottom: 7,
                  position: "relative",
                  top: 15,
                }}
              >
                {props.data.isShowAccept === "Y" && (
                  <Button
                    type="primary"
                    style={{ flex: 1, margin: "0px 3px" }}
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      swal("Are you sure you want to Accept the order?", {
                        buttons: ["Cancel", "Yes!"],
                      }).then((val) => {
                        if (val) {
                          let pData = {
                            KOTId: props.data.KOTId,
                            KOTStatus: "PND",
                            KOTRemark: "",
                            UpdtUsr: loginInfo.username,
                          };
                          updtKOTStatus(CompCode, pData).then((res) => {
                            if (res.message && res.message === "successful") {
                              let tblData = {
                                CompCode: props.data.CompCode,
                                BranchCode: props.data.BranchCode,
                                DeptCode: props.data.DeptCode,
                                TableCode: props.data.TableNo,
                                Status: "RUNKOT",
                                UpdtUsr: loginInfo.username,
                              };
                              updtKOTViewTableStatus(CompCode, tblData).then(
                                (tblsts) => {
                                  props.refresh();
                                }
                              );
                            }
                          });
                        }
                      });
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Accept</span>
                  </Button>
                )}
                {props.data.isShowCancel === "Y" && (
                  <Button
                    type="primary"
                    style={{ flex: 1, margin: "0px 3px" }}
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      swal("Are you sure you want to Cancel the order?", {
                        buttons: ["Cancel", "Yes!"],
                      }).then((val) => {
                        if (val) {
                          let pData = {
                            KOTId: props.data.KOTId,
                            KOTStatus: "CNL",
                            KOTRemark: "",
                            UpdtUsr: loginInfo.username,
                          };
                          updtKOTStatus(CompCode, pData).then((res) => {
                            if (res.message && res.message === "successful") {
                              props.refresh();
                            }
                          });
                        }
                      });
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Cancel</span>
                  </Button>
                )}
                {props.data.IsShowReady === "Y" && (
                  <Button
                    type="primary"
                    style={{ flex: 1, margin: "0px 3px" }}
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      setReadyModal(true);
                      // swal("Are you sure you want to do this?", {
                      //   buttons: ["Cancel", "Yes!"],
                      // }).then((val) => {
                      //   if (val) {
                      //     let data = {
                      //       KOTId: props.data.KOTId,
                      //       KOTStatus: "RDY",
                      //       KOTRemark: "",
                      //       UpdtUsr: loginInfo.username,
                      //     };
                      //     updtKOTStatus(data).then((res) => {
                      //       if (res.message && res.message === "successful") {
                      //         let kotData = {
                      //           KOTId: [props.data.KOTId],
                      //           KOTStatus: "RDY",
                      //           KOTRemark: "",
                      //           UpdtUsr: loginInfo.username,
                      //         };
                      //         if (props.data.OrderType === "DINEIN") {
                      //           let tableData = {
                      //             BranchCode: props.data.BranchCode,
                      //             CompCode: props.data.CompCode,
                      //             DeptCode: props.data.DeptCode,
                      //             TableCode: props.data.TableNo,
                      //             Status: "RUNNING",
                      //             UpdtUsr: loginInfo.username,
                      //           };
                      //           // console.log(props.data.TableNo);
                      //           updtKOTViewTableStatus(tableData)
                      //             .then(res)
                      //             .catch((err) => console.log(err));
                      //         }
                      //         uptRestarantPosKOTdtlStatus(kotData)
                      //           .then((res) => props.refresh())
                      //           .catch((err) => console.log(err));
                      //       }
                      //     });
                      //   }
                      // });
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Ready</span>
                  </Button>
                )}
                {props.data.IsShowCancel === "Y" && (
                  <Button
                    type="danger"
                    style={{ flex: 1, margin: "0px 3px" }}
                    icon={<StopOutlined />}
                    // disabled={}
                    onClick={() => {
                      swal(
                        "Are you sure you want to cancel please give a Remark?",
                        {
                          buttons: ["Cancel", "Yes!"],
                          content: "input",
                        }
                      ).then((val) => {
                        if (val) {
                          let pData = {
                            KOTId: props.data.KOTId,
                            KOTStatus: "CNL",
                            KOTRemark: val,
                            UpdtUsr: loginInfo.username,
                          };
                          updtKOTStatus(CompCode, pData).then((res) => {
                            if (res.message && res.message === "successful") {
                              props.refresh();
                            }
                          });
                        }
                      });
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Cancel</span>
                  </Button>
                )}
              </div>
            </>

            <Modal
              closable={true}
              visible={readyModal}
              onCancel={() => {
                setReadyModal(false);
              }}
              footer={null}
              width={800}
              bodyStyle={{ padding: 0 }}
              destroyOnClose={true}
              title={
                <span
                  style={{ textDecoration: "underline" }}
                  className="color-style"
                >
                  KOT View
                </span>
              }
            >
              <Table
                columns={Kotcolumns}
                bordered={true}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                dataSource={dtlData
                  .sort((a, b) => (parseInt(a.key) > parseInt(b.key) ? 1 : -1))
                  .filter((id) => id.IsDeleted !== "Y")}
                pagination={false}
              />
              <Divider style={{ marginBottom: 5, marginTop: 5 }} />
              <Button
                type="primary"
                style={{ flex: 1, margin: "3px 3px" }}
                icon={<SaveOutlined />}
                disabled={saveDisable}
                onClick={() => {
                  swal("Are you sure you want save changes", {
                    buttons: ["No", "Yes!"],
                  }).then(async (val) => {
                    if (val) {
                      dtlData.forEach(async (row) => {
                        if (row.IsChecked === "Y" && row.IsDeleted === "N") {
                          let pdata = {
                            ItemId: row.Id,
                            KOTId: row.KOTId,
                            ItemStatus: "RDY",
                            UpdtUsr: loginInfo.username,
                          };
                          await updtKOTItemStatus(CompCode, pdata).then(
                            (res) => {
                              if (res.message && res.message === "successful") {
                                setReRender(true);
                                setReadyModal(false);
                                return updtRestaurantKOTStatus(
                                  CompCode,
                                  props.data.KOTId,
                                  loginInfo.username
                                ).then((res) => {
                                  if (
                                    res.message &&
                                    res.message === "successful"
                                  ) {
                                    props.refresh();
                                  }
                                });
                              }
                            }
                          );
                        } else if (row.IsDeleted === "Y") {
                          let pdata = {
                            ItemId: row.Id,
                            KOTId: row.KOTId,
                            ItemStatus: "CNL",
                            UpdtUsr: loginInfo.username,
                          };
                          await updtKOTItemStatus(CompCode, pdata).then(
                            (res) => {
                              if (res.message && res.message === "successful") {
                                setReRender(true);
                                setReadyModal(false);
                                return updtRestaurantKOTStatus(
                                  CompCode,
                                  props.data.KOTId,
                                  loginInfo.username
                                ).then((res) => {
                                  if (
                                    res.message &&
                                    res.message === "successful"
                                  ) {
                                    props.refresh();
                                  }
                                });
                              }
                            }
                          );
                        }
                      });
                    }

                    // props.refresh();
                  });
                }}
              >
                <span style={{ fontWeight: "600" }}>Save</span>
              </Button>
              <Button
                type="primary"
                style={{ flex: 1, margin: "3px 3px" }}
                icon={<RollbackOutlined />}
                onClick={() => {
                  setReadyModal(false);
                }}
              >
                <span style={{ fontWeight: "600" }}>Back</span>
              </Button>
            </Modal>
          </Card>
        </>
      )}
    </>
  );
};

export default ViewDtlComponent;
