import React, { useState, useEffect } from "react";
import { Menu, notification, Spin } from "antd";
import { AppstoreOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import ReportDisplayCard from "./ReportDisplayCard";
const { SubMenu } = Menu;

const ReportsMain = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const reportModule = useSelector((state) =>
    state.AppMain.userAccess.filter((aa) => aa.ModType === "report")
  );
  const [ModuleGroup, setModuleGroup] = useState([]);
  const [selectedReport, setSelectedReport] = useState();
  const [pageLoding, setPageLoading] = useState(false);
  const [displayType, setDisplayType] = useState("TABL");
  const [modal, setModal] = useState(false);
  const [DataLoading, setDataLoading] = useState(false);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    setPageLoading(true);
    // setTimeout(() => {
    initialPageLoad(props.reportGroups, props.reportIds)
      .then((res) => {
        setModuleGroup(res);
        if (props.reportId) {
          res.map((grp) => {
            grp.reports.map((row) => {
              if (props.reportId === row.ModuleSysOption1) {
                setDataLoading(true);
                setTimeout(() => {
                  setSelectedReport(row);
                  setDataLoading(false);
                }, 500);
              }
            });
          });
        }
      })
      .catch((err) => {
        console.error("in error", err);
        notification.error({
          message: "Error Occured",
          description: "Error While Fetching Data",
        });
      })
      .finally(() => {
        // console.log("in finally");
        setPageLoading(false);
      });
    // }, 2000);
    return () => {};
  }, []);

  // useEffect(() => {
  //   if (ModuleGroup && ModuleGroup.length > 0 && props.reportId) {
  //     ModuleGroup.forEach((grp) =>
  //       grp.reports.forEach((row) => {
  //         if (props.reportId === row.ModuleSysOption1) {
  //           setDataLoading(true);
  //           setTimeout(() => {
  //             setSelectedReport(row);
  //             setDataLoading(false);
  //           }, 500);
  //         }
  //       })
  //     );
  //   }
  // }, [ModuleGroup]);

  const initialPageLoad = (reportGroups, reportIds) => {
    return new Promise(async function (resolve, reject) {
      try {
        // console.log("inside if",reportGroups,reportIds);
        let tempData = [];
        reportModule
          .filter(
            (ll) =>
              (reportGroups
                ? reportGroups.find((lk) => lk === ll.ModGroupDesc)
                : true) &&
              (reportIds
                ? reportIds.find((lk) => lk === parseInt(ll.ModuleSysOption1))
                : true)
          )
          .forEach((row) => {
            let findIndex = tempData.findIndex(
              (aa) => aa.ModGroupDesc === row.ModGroupDesc
            );
            if (findIndex < 0) {
              tempData.push({
                key: row.ModGroupDesc, //tempData.length + 1,
                ModGroupDesc: row.ModGroupDesc,
                reports: [{ ...row }],
              });
            } else {
              tempData[findIndex].reports.push({ ...row });
            }
          });
        // console.log(tempData, "tempData");
        resolve(tempData);
      } catch (error) {
        console.error("in error", error);
        notification.error({
          message: "Error Occured",
          description: "Error While Fetching Data",
        });
        reject(error);
      }
    });
  };
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(246, 246, 246, 0.6)",
        // position: "relative",
      }}
    >
      {pageLoding || !reportModule ? (
        <LoadingOutlined />
      ) : (
        <>
          {" "}
          {/* {!props.hideSideBar && ( */}
            <div
              style={{
                width: isCollapsed ? 50 : 350,
                height: "auto",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid var(--app-theme-color-rbga)",
              }}
            >
              <div
                className="style-2"
                style={{
                  height: "calc(100vh - 70px)",
                  overflow: "auto",
                }}
              >
                <Menu
                  mode="inline"
                  inlineCollapsed={isCollapsed}
                  defaultSelectedKeys={
                    props.reportId ? [props.reportId] : undefined
                  }
                  defaultOpenKeys={
                    props.reportGroup ? [props.reportGroup] : undefined
                  }
                >
                  {ModuleGroup.map((mg) => {
                    return (
                      <SubMenu
                        key={mg.key}
                        icon={<AppstoreOutlined />}
                        title={mg.ModGroupDesc}
                      >
                        {mg.reports.map((rr) => {
                          return (
                            <Menu.Item
                              onClick={() => {
                                // console.log(rr.ModuleSysOption1);
                                setDataLoading(true);
                                setTimeout(() => {
                                  setSelectedReport(rr);
                                  setDataLoading(false);
                                }, 500);
                              }}
                              key={rr.ModuleSysOption1}
                            >
                              {rr.ModuleName}
                            </Menu.Item>
                          );
                        })}
                      </SubMenu>
                    );
                  })}
                </Menu>
              </div>
            </div>
          {/* )} */}
          <div
            style={{
              //  zIndex: 5,
              // paddingLeft: 55,
              paddingLeft: 5,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              // height: "calc(100vh - 58px)",
            }}
          >
            {/* {selectedReport ? ( */}
            {DataLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "15px 0px",
                  height: "100%",
                }}
              >
                <Spin
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  size="large"
                />
              </div>
            ) : (
              <ReportDisplayCard
                isModal={props.isModal}
                selectedReport={selectedReport}
                displayType={displayType}
                modal={modal}
                // onCloseModal={() => {
                //   setModal(false);
                // }}
                onClosePress={() => {
                  setSelectedReport();
                }}
                onCollapsePress={() => {
                  setIsCollapsed(!isCollapsed);
                }}
                isCollapsed={isCollapsed}
              />
            )}
            {/* ) : (
              "No Report Selected"
            )} */}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsMain;
