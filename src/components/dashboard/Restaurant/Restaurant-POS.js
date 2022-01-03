import React, { Fragment, useEffect, useState } from "react";
import { setFormCaption } from "../../../store/actions/currentTran";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Spin,
  Row,
  Col,
  Card,
  Select,
  Radio,
  Divider,
  Typography,
  Badge,
  Empty,
  Tag,
  Modal,
} from "antd";
import Ledends from "./components/Legends";
import RestaurantPOSTran from "./components/RestaurantPOSTran";
import {
  RetweetOutlined,
  GlobalOutlined,
  ForkOutlined,
  AuditOutlined,
  DeploymentUnitOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  fetchTableList,
  fetchPOSRestaurantMenuRates,
  fetchPOSRestaurantUserFavoriteMenus,
  fetchPOSRestaurantMenuAddOnDtl,
  fetchPOSRestaurantMenuAddOns,
  fetchPOSRestaurantMenuVariationRates,
  fetchPOSRestaurantTableStatus,
  saveTableStatus,
  restaurantPOSTableMergeOpration,
} from "../../../services/restaurant-pos";
import AppLoader from "../../common/AppLoader";
import { useLocation, Link } from "react-router-dom";
import swal from "sweetalert";
import Countdown from "antd/lib/statistic/Countdown";
import CountdownCustom from "./components/SubComponents/CountdownCustom";
import OrderDetailsComponent from "../../Restaurant/components/OrderDetailsComponent";
import BillsDetailsComponent from "../../Restaurant/components/BillsDetailsComponent";

const { Title, Text } = Typography;

const RestaurantPOS = (props) => {
  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const appConfigs = useSelector((state) => state.AppMain.appconfigs);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [tablesList, setTablesList] = useState();
  const [menuRates, setMenuRates] = useState();
  const [menuVariationRates, setMenuVariationRates] = useState();
  const [favMenus, setFavMenus] = useState();
  const [menuAddOnDtl, setMenuAddOnDtl] = useState();
  const [menuAddOn, setMenuAddOn] = useState();
  const [tableStatus, setTableStatus] = useState();
  // const [entryMode, setEntryMode] = useState({
  //   EntryType: "DINEIN",
  //   TableInfo: { TableCode: "T1", TableName: "Table 1", SecCode:"0" },
  // });
  const [entryMode, setEntryMode] = useState();
  const [mergeTable, setMergeTable] = useState(false);
  const [selectedMergeTable, setSelectedMergeTable] = useState([]);
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const [AutoRefresh, setAutoRefresh] = useState(false);
  const [IntervalId, setIntervalId] = useState();
  const R_DINEIN = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_DINEIN")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [showTemporaryTable, setShowTemporaryTable] = useState(false);

  useEffect(() => {
    dispatch(setFormCaption(57));
    setIsLoading(true);
    Promise.all([
      fetchTableList(CompCode, BranchConfigs.value1).then((res) => {
        // console.log(res, "table list");
        setTablesList(res);
      }),
      fetchPOSRestaurantMenuRates(CompCode).then((res) => {
        // console.log("menuRates list", res);
        setMenuRates(res);
      }),
      fetchPOSRestaurantUserFavoriteMenus(
        CompCode,
        loginInfo.userType,
        loginInfo.userId
      ).then((res) => {
        // console.log("favMenus list", res);
        setFavMenus(res);
      }),
      fetchPOSRestaurantMenuAddOnDtl(CompCode).then((res) => {
        // console.log("menuAddOnDtl list", tempData);
        setMenuAddOnDtl(res);
      }),
      fetchPOSRestaurantMenuAddOns(CompCode).then((res) => {
        //  console.log("menuAddOn list", res);

        setMenuAddOn(res);
      }),
      fetchPOSRestaurantMenuVariationRates(CompCode).then((res) => {
        //console.log("menuVariationRates list", res);
        setMenuVariationRates(res);
      }),
      fetchPOSRestaurantTableStatus(CompCode).then((res) => {
        // console.log("tablestatus list", res);
        setTableStatus(res);
      }),
    ])
      .then(() => {
        setIsLoading(false);
        setAutoRefresh(true);
      })
      .catch((err) => {
        console.error(err, "initial Load Error");
        setIsLoading(false);
      });
    return () => {
      clearInterval(IntervalId);
    };
  }, []);

  // useEffect(() => {
  //   let tempIntervalId;
  //   let refreshSeconds = parseInt(R_DINEIN.value2);

  //   if (AutoRefresh && !entryMode) {
  //     tempIntervalId = setInterval(() => {
  //       if (refreshSeconds >= 1) {
  //         refreshSeconds = refreshSeconds - 1;
  //       } else {
  //         setIsLoading(true);
  //         Promise.all([
  //           fetchTableList(BranchConfigs.value1).then((res) => {
  //             // console.log(res, "table list");
  //             setTablesList(res);
  //           }),
  //           fetchPOSRestaurantMenuRates().then((res) => {
  //             // console.log("menuRates list", res);
  //             setMenuRates(res);
  //           }),
  //           fetchPOSRestaurantUserFavoriteMenus(
  //             loginInfo.userType,
  //             loginInfo.userId
  //           ).then((res) => {
  //             // console.log("favMenus list", res);
  //             setFavMenus(res);
  //           }),
  //           fetchPOSRestaurantMenuAddOnDtl().then((res) => {
  //             // console.log("menuAddOnDtl list", tempData);
  //             setMenuAddOnDtl(res);
  //           }),
  //           fetchPOSRestaurantMenuAddOns().then((res) => {
  //             //  console.log("menuAddOn list", res);

  //             setMenuAddOn(res);
  //           }),
  //           fetchPOSRestaurantMenuVariationRates().then((res) => {
  //             //console.log("menuVariationRates list", res);
  //             setMenuVariationRates(res);
  //           }),
  //           fetchPOSRestaurantTableStatus().then((res) => {
  //             // console.log("tablestatus list", res);
  //             setTableStatus(res);
  //           }),
  //         ])
  //           .then(() => {
  //             setIsLoading(false);
  //             refreshSeconds = parseInt(R_DINEIN.value2);
  //             // setIntervalId();
  //             // clearInterval(tempIntervalId);

  //             // setAutoRefresh(false);
  //             // setAutoRefresh(true);
  //           })
  //           .catch((err) => {
  //             setIsLoading(false);
  //           });
  //       }
  //     }, 1000);
  //     setIntervalId(tempIntervalId);
  //   } else {
  //     clearInterval(IntervalId);
  //     setIntervalId();
  //   }
  //   return () => {
  //     clearInterval(tempIntervalId);
  //   };
  // }, [AutoRefresh]);

  return (
    <Fragment>
      <Modal
        maskClosable={false}
        visible={false}
        title={"Bill Settlement"}
        onCancel={() => {}}
        footer={false}
        bodyStyle={{ padding: 0 }}
        destroyOnClose={true}
        width={750}
        closeIcon={null}
        closable={false}
      ></Modal>
      {isLoading && <AppLoader />}
      {entryMode && (
        <RestaurantPOSTran
          EntryMode={entryMode}
          data={{
            TablesList: tablesList,
            MenuRates: menuRates,
            MenuVariationRates: menuVariationRates,
            FavMenus: favMenus,
            MenuAddOnDtl: menuAddOnDtl,
            MenuAddOn: menuAddOn,
          }}
          CompName="RestaurantPOSTran"
          CompType="dine-in-default"
          onBackPress={() => {
            setEntryMode();
            setIsLoading(true);
            setAutoRefresh(true);
            fetchTableList(CompCode, BranchConfigs.value1).then((res) => {
              setTablesList(res);
              setIsLoading(false);
            });
          }}
          appConfigs={appConfigs}
          routeSplitTable={(tCode) => {
            setEntryMode({
              EntryType: "DINEIN",
              TableInfo: tCode,
            });
            // fetchTableList(BranchConfigs.value1).then((res) => {
            //   setTablesList(res);
            //   setIsLoading(false);
            //   console.log(
            //     res.find((aa) => aa.TableCode === tCode.TableCode),
            //     "on save reponse split table"
            //   );
            //   setEntryMode({
            //     EntryType: "DINEIN",
            //     TableInfo: res.find(
            //       (aa) => aa.TableCode === tCode.TableCode
            //     ),
            //   });
            // });
          }}
        />
      )}

      {!isLoading && !entryMode && (
        <div style={{ background: "#ffffff", padding: 7, height: "100%" }}>
          <Row>
            <Col span={24}>
              <Row>
                <Col flex="1 1 200px">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Title level={4} style={{ margin: 0, marginLeft: 10 }}>
                      Table View
                    </Title>
                    {/* <Button
                  type="primary"
                  style={{ margin: 5 }}
                  //   size={"large"}
                >
                  Pickup
                </Button> */}
                  </div>
                </Col>
                <Col
                  flex="0 1 500px"
                  style={{ display: "flex", flexDirection: "row-reverse" }}
                >
                  {/* <Button
                      type="primary"
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        setEntryMode({
                          EntryType: "PICKUP",
                        });
                      }}
                    >
                      Pickup
                    </Button> */}
                  <Link to="/dashboard/KotDeliveryPickUp">
                    <Button
                      icon={<GlobalOutlined />}
                      type="primary"
                      style={{ marginRight: 5 }}
                    >
                      Delivery &amp; Pick Up Orders
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setIsLoading(true);
                      setSelectedMergeTable([]);
                      setMergeTable();
                      fetchTableList(CompCode, BranchConfigs.value1).then(
                        (res) => {
                          setTablesList(res);
                          setIsLoading(false);
                        }
                      );
                    }}
                    icon={<RetweetOutlined />}
                    type="primary"
                    style={{ marginRight: 5 }}
                  >
                    Refresh
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      padding: "0px 5px",
                      alignItems: "center",
                      height: 32,
                      marginRight: 4,
                      // border: "1px solid #001529",
                      // borderRadius: 4,
                      fontSize: 10,
                    }}
                  >
                    Auto Refresh{" "}
                    {AutoRefresh ? (
                      <>
                        {" "}
                        in
                        <span style={{ color: "#000000d9" }}>
                          &nbsp;
                          <CountdownCustom
                            onFinish={() => {
                              let refreshSeconds = parseInt(R_DINEIN.value2);
                              setIsLoading(true);
                              Promise.all([
                                fetchTableList(
                                  CompCode,
                                  BranchConfigs.value1
                                ).then((res) => {
                                  // console.log(res, "table list");
                                  setTablesList(res);
                                }),
                                fetchPOSRestaurantMenuRates(CompCode).then(
                                  (res) => {
                                    // console.log("menuRates list", res);
                                    setMenuRates(res);
                                  }
                                ),
                                fetchPOSRestaurantUserFavoriteMenus(
                                  CompCode,
                                  loginInfo.userType,
                                  loginInfo.userId
                                ).then((res) => {
                                  // console.log("favMenus list", res);
                                  setFavMenus(res);
                                }),
                                fetchPOSRestaurantMenuAddOnDtl(CompCode).then(
                                  (res) => {
                                    // console.log("menuAddOnDtl list", tempData);
                                    setMenuAddOnDtl(res);
                                  }
                                ),
                                fetchPOSRestaurantMenuAddOns(CompCode).then(
                                  (res) => {
                                    //  console.log("menuAddOn list", res);

                                    setMenuAddOn(res);
                                  }
                                ),
                                fetchPOSRestaurantMenuVariationRates(
                                  CompCode
                                ).then((res) => {
                                  //console.log("menuVariationRates list", res);
                                  setMenuVariationRates(res);
                                }),
                                fetchPOSRestaurantTableStatus(CompCode).then(
                                  (res) => {
                                    // console.log("tablestatus list", res);
                                    setTableStatus(res);
                                  }
                                ),
                              ])
                                .then(() => {
                                  setIsLoading(false);
                                  refreshSeconds = parseInt(R_DINEIN.value2);
                                  // setIntervalId();
                                  // clearInterval(tempIntervalId);

                                  // setAutoRefresh(false);
                                  // setAutoRefresh(true);
                                })
                                .catch((err) => {
                                  console.error(err, "initial Load Error");
                                  setIsLoading(false);
                                });
                            }}
                            value={parseInt(R_DINEIN.value2)}
                          />
                        </span>
                      </>
                    ) : (
                      "Paused"
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
            <Divider style={{ margin: 5 }} />
            <Col span={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {appConfigs.find((ii) => ii.configCode === "TBL_RSV").value1 ===
                  "Y" && (
                  <Button
                    icon={<AuditOutlined />}
                    type="primary"
                    style={{ marginRight: 5 }}
                  >
                    Reserve Table
                  </Button>
                )}

                {/* <Button type="primary" style={{ marginRight: 5 }}>
                  Split Table
                </Button> */}
                {appConfigs.find((ii) => ii.configCode === "TBL_MERGE")
                  .value1 === "Y" &&
                  !mergeTable && (
                    <Button
                      icon={<DeploymentUnitOutlined />}
                      type="primary"
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        setMergeTable(true);
                        setAutoRefresh(false);
                      }}
                    >
                      Merge Table
                    </Button>
                  )}
                {appConfigs.find((ii) => ii.configCode === "TBL_ADD").value1 ===
                  "Y" && (
                  <Button
                    icon={<HistoryOutlined />}
                    type="primary"
                    style={{ marginRight: 5 }}
                  >
                    Temporary Table
                  </Button>
                )}

                {mergeTable && (
                  <div
                    style={{
                      backgroundColor: "#ececec",
                      padding: "2px 4px",
                      display: "flex",
                    }}
                  >
                    <Button
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        setSelectedMergeTable([]);
                        setMergeTable();
                        setAutoRefresh(true);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={async () => {
                        if (selectedMergeTable.length > 0) {
                          let tempTableCode = "";
                          await selectedMergeTable.forEach(
                            (selMrgTbl, index) => {
                              // saveTableStatus(SelData);if
                              tempTableCode += `'${selMrgTbl.TableCode}'${
                                selectedMergeTable.length - 1 === index
                                  ? ""
                                  : ","
                              }`;
                            }
                          );
                          return swal("Input a Table Name:", {
                            content: {
                              element: "input",
                              attributes: {
                                defaultValue: "MRG~",
                              },
                            },
                          }).then((value) => {
                            if (value !== "" && value !== null) {
                              let SelData = {
                                CompCode: CompCode,
                                BranchCode: BranchConfigs.value1,
                                DeptCode: "DINEIN",
                                TableSec: selectedMergeTable[0].SecCode,
                                TableCodes: tempTableCode,
                                MergeTableName: value,
                                UpdtUsr: loginInfo.username,
                              };
                              restaurantPOSTableMergeOpration(
                                CompCode,
                                SelData
                              ).then((res) => {
                                fetchTableList(
                                  CompCode,
                                  BranchConfigs.value1
                                ).then((res) => {
                                  setSelectedMergeTable([]);
                                  setMergeTable();
                                  setAutoRefresh(true);
                                  setTablesList(res);
                                  setIsLoading(false);
                                });
                              });
                            }
                          });
                        }
                      }}
                    >
                      Merge Selected Tables
                    </Button>
                  </div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  alignItems: "center",
                }}
              >
                {tableStatus &&
                  tableStatus.map((legend) => {
                    return (
                      <Ledends
                        key={legend.TableStatusCode}
                        title={legend.TableStatusName}
                        color={legend.TableColor}
                      />
                    );
                  })}
              </div>
            </Col>
            <Divider style={{ margin: 5 }} />
            <Row style={{ height: "calc(100vh - 180px)", width: "100%" }}>
              <Col flex={"1 1 0%"}>
                {tablesList &&
                  tablesList.length > 0 &&
                  tablesList.map((item, l_index) => {
                    return (
                      <div key={l_index}>
                        <Title level={4}>{item.SecDesc}</Title>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          {item.children &&
                            item.children.map((tbl, idx) => {
                              let legend = tableStatus.find(
                                (ii) => ii.TableStatusCode === tbl.TableStatus
                              );
                              // console.log(tbl, legend, "fffff");
                              return (
                                <Button
                                  style={{
                                    backgroundColor: legend.TableColor,
                                    height: 64,
                                    minWidth: tbl.TableType == "MRG" ? 128 : 64,
                                    marginRight: 8,
                                    marginBottom: 8,
                                    position: "relative",
                                    background:
                                      tbl.TableType === "SPLT"
                                        ? `repeating-linear-gradient(
                                    45deg,
                                    ${legend.TableColor},
                                    #fff 10px,
                                    ${legend.TableColor} 10px,
                                    #fff 20px
                                  )`
                                        : legend.TableColor,
                                  }}
                                  key={idx}
                                  type="dashed"
                                  onClick={() => {
                                    if (!mergeTable) {
                                      setEntryMode({
                                        EntryType: "DINEIN",
                                        TableInfo: tbl,
                                      });

                                      setAutoRefresh(false);
                                    } else {
                                      if (
                                        selectedMergeTable.find(
                                          (mm) => mm.TableCode === tbl.TableCode
                                        )
                                      ) {
                                        setSelectedMergeTable(
                                          selectedMergeTable.filter(
                                            (mm) =>
                                              mm.TableCode !== tbl.TableCode
                                          )
                                        );
                                      } else {
                                        if (selectedMergeTable.length > 0) {
                                          if (
                                            selectedMergeTable.filter(
                                              (ff) => ff.SecCode === tbl.SecCode
                                            ).length > 0
                                          ) {
                                            setSelectedMergeTable([
                                              ...selectedMergeTable,
                                              tbl,
                                            ]);
                                          }
                                        } else {
                                          setSelectedMergeTable([
                                            ...selectedMergeTable,
                                            tbl,
                                          ]);
                                        }
                                      }
                                    }
                                  }}
                                >
                                  {tbl.TableType == "MRG" && (
                                    <Tag
                                      style={{
                                        position: "absolute",
                                        top: -6,
                                        left: -6,
                                        margin: 0,
                                        fontSize: 10,
                                      }}
                                    >
                                      Table Merged
                                    </Tag>
                                  )}
                                  {mergeTable &&
                                    tbl.TableType === "REG" &&
                                    tbl.TableStatus === "BLANK" && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          top: 2,
                                          left: 2,
                                        }}
                                      >
                                        <Radio
                                          checked={selectedMergeTable.find(
                                            (mm) =>
                                              mm.TableCode === tbl.TableCode
                                          )}
                                        />
                                      </div>
                                    )}
                                  {tbl.TableName}
                                </Button>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
              </Col>
              <Col flex="0 0 300px" style={{ height: "100%" }}>
                <Card
                  style={{ height: "50%" }}
                  // className="style-2"
                  bodyStyle={{ padding: 0, height: "100%" }}
                >
                  <OrderDetailsComponent />
                </Card>
                <Card
                  style={{ height: "50%" }}
                  bodyStyle={{ padding: 0, height: "100%" }}
                >
                  <BillsDetailsComponent />
                </Card>
              </Col>
            </Row>
          </Row>
        </div>
      )}
    </Fragment>
  );
};

export default RestaurantPOS;
