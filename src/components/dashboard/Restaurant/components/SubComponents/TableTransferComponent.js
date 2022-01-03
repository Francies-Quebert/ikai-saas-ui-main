import { Button, Divider, Radio, Skeleton, Tag } from "antd";
import React, { useEffect, useState } from "react";
import {
  fetchPOSRestaurantTableStatus,
  saveTableStatus,
  updtKOTViewTableStatus,
  uptRestaurantKOTHdrTableNo,
  uptRestaurantTableStatusArr,
} from "../../../../../services/restaurant-pos";
import { useSelector } from "react-redux";
import _ from "lodash";
import {
  RollbackOutlined,
  FileAddOutlined,
  CaretLeftOutlined,
  SwapOutlined,
} from "@ant-design/icons";
const TableTransferComponent = (props) => {
  const [TableData, setTableData] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const [tableStatus, setTableStatus] = useState();
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    initialLoad().then((res) => {
      setTableData(props.tableList.children);
      setTableStatus(res);
      setIsLoading(false);
    });

    // console.log(props);
  }, []);
  const [kotId, setKoTId] = useState([]);
  const initialLoad = () => {
    setIsLoading(true);
    return new Promise(function (resolve, reject) {
      try {
        fetchPOSRestaurantTableStatus(CompCode).then((res) => {
          if (props.selectedMenu) {
            const uniqueKOT = [
              ...new Set(props.selectedMenu.map((obj) => obj.KOTId)),
            ];
            setKoTId(uniqueKOT);
          }
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  return (
    <div style={{ padding: "5px 15px" }}>
      {IsLoading ? (
        <Skeleton />
      ) : (
        <>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, padding: "3px 0px" }}>
              Current Table :
              <span
                style={{
                  fontSize: 15,
                }}
                className="color-style"
              >
                {" "}
                {props.FromTable.TableCode}
              </span>
            </div>
          </div>
          <div>
            <span style={{ color: "red" }}>*</span>
            <span style={{ fontWeight: 500 }}>
              {" "}
              Note: Please Select a Destination Table
            </span>
          </div>
          {TableData.length > 0 &&
            TableData.filter(
              (fi) =>
                fi.TableCode !== props.FromTable.TableCode &&
                _.includes(["BLANK"], fi.TableStatus)
            ).map((tbl, idx) => {
              let legend = tableStatus.find(
                (ii) => ii.TableStatusCode === tbl.TableStatus
              );
              // console.log(tbl, legend, "fffff");
              return (
                <Button
                  style={{
                    // backgroundColor: legend.TableColor,
                    height: 64,
                    minWidth: 64,
                    marginRight: 8,
                    marginBottom: 8,
                    position: "relative",
                    background: "#f4f6ff",
                  }}
                  key={idx}
                  type="dashed"
                  onClick={() => {
                    // console.log(tbl, "selected tabel");
                    setSelectedTable([tbl]);
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: 2,
                    }}
                  >
                    <Radio
                      checked={
                        selectedTable &&
                        selectedTable.find(
                          (mm) => mm.TableCode === tbl.TableCode
                        )
                          ? true
                          : false
                      }
                    />
                  </div>
                  {tbl.TableName}
                </Button>
              );
            })}
          {/* <div>
            From: <span>{props.FromTable.TableCode}</span>
            <SwapOutlined />
            To{" "}
            {selectedTable.length > 0 ? (
              <span>{selectedTable[0].TableCode}</span>
            ) : (
              "please select a table"
            )}
          </div> */}
          <Divider style={{ margin: 0 }} />
          <div style={{ textAlign: "end" }}>
            <Button
              disabled={selectedTable.length <= 0}
              style={{ marginRight: 5 }}
              type="primary"
              onClick={async () => {
                let tempData = [];
                await kotId.map((kt) => {
                  tempData.push({
                    KOIId: kt,
                    TableNo: selectedTable[0].TableCode,
                    UpdtUsr: props.loginUser,
                  });
                });
                // console.log(tempData, "temp data");
                uptRestaurantKOTHdrTableNo(CompCode, tempData).then(
                  async (res) => {
                    let tableStatus = [
                      {
                        CompCode: CompCode,
                        BranchCode: BranchConfigs.value1,
                        DeptCode: "DINEIN",
                        TableSec: props.FromTable.SecCode,
                        ParentTableCodes: null,
                        ...props.FromTable,
                        Remark: "",
                        SysOption1: null,
                        SysOption2: null,
                        SysOption3: null,
                        SysOption4: null,
                        SysOption5: null,
                        IsActive: true,
                        UpdtUsr: props.loginUser,
                        Status: "BLANK",
                      },
                      {
                        CompCode: CompCode,
                        BranchCode: BranchConfigs.value1,
                        DeptCode: "DINEIN",
                        TableSec: selectedTable[0].SecCode,
                        ParentTableCodes: null,
                        ...selectedTable[0],
                        Remark: "",
                        SysOption1: `${
                          props.customerForm.customer.userId
                            ? props.customerForm.customer.userId
                            : ""
                        }${
                          props.customerForm.customer.address &&
                          props.customerForm.customer.address.length > 0
                            ? "~" + props.customerForm.customer.address[0]
                            : ""
                        }`,
                        SysOption2:
                          props.selectedNoOfPerson &&
                          props.selectedNoOfPerson !== ""
                            ? props.selectedNoOfPerson
                            : 0,
                        SysOption3: props.selectedCaptain
                          ? props.selectedCaptain
                          : null,
                        SysOption4: `${props.discount.reason}~${props.discount.type}~${props.discount.discountAmount}~${props.discount.couponCode}`,
                        SysOption5: null,
                        IsActive: true,
                        UpdtUsr: props.loginUser,
                        Status: "RUNKOT",
                      },
                    ];
                    await saveTableStatus(CompCode, {
                      data: tableStatus[0],
                    }).then(async (tablres) => {
                      saveTableStatus(CompCode, { data: tableStatus[1] }).then(
                        async (tablres2) => {
                          props.onSavePress(selectedTable[0]);
                        }
                      );
                    });
                  }
                );
              }}
              icon={<FileAddOutlined />}
            >
              Save
            </Button>
            <Button
              style={{ margin: "5px 0px" }}
              type="primary"
              onClick={() => {
                props.onBackPress();
              }}
              icon={<RollbackOutlined />}
            >
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TableTransferComponent;
