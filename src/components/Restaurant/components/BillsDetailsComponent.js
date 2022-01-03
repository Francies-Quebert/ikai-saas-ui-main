import { SettingOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Dropdown, Tag, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { fetchDataRestaurantPOS_ResentBills } from "../../../services/restaurant-pos";
import { useSelector } from "react-redux";
import moment from "moment";
import { getOtherMater } from "../../../services/sendPromoMaster";
import _ from "lodash";
import { getRestaurantInvoicePdf } from "../../../services/restaurant-pos";
import fileDownload from "js-file-download";

const BillsDetailsComponent = (props) => {
  const [displayData, setDisplayData] = useState([]);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );

  const DTFORMAT = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "DTTMFORMAT")
  );
  const [kotColor, setKotColor] = useState([]);
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const Currency = useSelector((app) => app.configCode === "CURRENCY");
  useEffect(() => {
    fetchDataRestaurantPOS_ResentBills(
      CompCode,
      BranchConfigs.value1,
      loginInfo.username
    ).then((res) => {
      setDisplayData(res);
    });
  }, []);

  const menu = <Menu></Menu>;
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <div
        style={{
          margin: "auto",
          fontSize: 14,
          //backgroundColor: process.env.REACT_APP_PRIMARY_COLOR,
          //border: `1px solid ${process.env.REACT_APP_PRIMARY_COLOR}`,
          color: "#FFF",
          fontWeight: 600,
          padding: "2px 8px",
          fontFamily: "Cairo",
          borderRadius: "4px 0px 4px",
          height: 26,
        }}
        className="background-color-header bg-color-style border-style"
      >
        Recent Bill's
      </div>
      <div
        style={{
          overflowY: "auto",
          height: "calc(100% - 26px)",
          //border: `1px solid ${process.env.REACT_APP_PRIMARY_COLOR}`,
        }}
        className="style-2 border-style"
      >
        {displayData.map((dd) => {
          return (
            <div
              key={dd.InvoiceId}
              style={{
                backgroundColor: "#f7f7f7",
                margin: "2px 5px",
                fontSize: 10,
                //   padding: 5,

                position: "relative",
                borderRadius: "0px 4px",
              }}
              className="border-style"
            >
              {/* <Tag
                style={{
                  fontSize: 9,
                  lineHeight: "12px",
                  position: "absolute",
                  top: 6,
                  left: 0,
                }}
                color="#f50"
              >
                {dd.status}
              </Tag> */}
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <Tag
                      style={{
                        fontSize: 9,
                        lineHeight: "12px",
                        //   position: "absolute",
                        //   top: 6,
                        //   left: 0,
                        // color:
                        //   dd.PaymentStatus === "PARTIALY PAID"
                        //     ? "#000"
                        //     : "#FFF",
                      }}
                      color={
                        dd.PaymentStatus === "PAID"
                          ? "#7cd992"
                          : dd.PaymentStatus === "UNPAID"
                          ? "#eb6060"
                          : "#1d59dc"
                      }
                    >
                      {dd.PaymentStatus}
                    </Tag>
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      Invoice:
                    </span>{" "}
                    #{dd.InvoiceId}/{" "}
                    {moment(dd.InvoiceDate).format(DTFORMAT.value1)}
                  </div>
                  {/* <div
                    style={{
                      flex: 0.1,
                      textAlign: "end",
                      // color: "#000",
                      // fontWeight: "600",
                    }}
                  > */}
                  <div
                    style={{
                      borderLeft: "1px solid #d9d9d9",
                      borderBottom: "1px solid #d9d9d9",
                      borderRight: "1px solid #d9d9d9",
                      background: "#f7f7f7",
                      // padding: "2.4px 0",
                      width: 20,
                      textAlign: "center",
                      cursor: "pointer",
                      marginLeft: "auto",
                      borderRadius: 2,
                      marginRight: 2,
                    }}
                    className="print-icon-custom"
                    onClick={() => {
                      let dataType = "pdf";
                      console.log(window.electron);
                      if (window.electron) {
                        dataType = "html";
                      }
                      getRestaurantInvoicePdf(
                        CompCode,
                        true,
                        dd.InvoiceId,
                        dataType
                      ).then((res) => {
                        if (res) {
                          if (window.electron) {
                            window.electron.ipcRenderer.send("store-data", {
                              pdf: res.data,
                              name: `${dd.InvoiceNo}.${dataType}`,
                              type: dataType,
                            });
                            window.electron.ipcRenderer.on(
                              "data-stored",
                              (event, arg) => {
                                console.log("data stored", arg);
                              }
                            );
                          } else {
                            fileDownload(
                              res.data,
                              `${dd.InvoiceNo}.${dataType}`
                            );
                          }
                        }
                      });
                      // console.log("print", dd);
                    }}
                  >
                    <PrinterOutlined />
                  </div>
                  <Dropdown overlay={menu} placement="bottomRight" arrow>
                    <div
                      style={{
                        borderLeft: "1px solid #d9d9d9",
                        borderBottom: "1px solid #d9d9d9",
                        background: "#f7f7f7",
                        // padding: "2.4px 0",
                        width: 20,
                        textAlign: "center",
                        cursor: "pointer",
                        marginLeft: "auto",
                        borderRadius: 2,
                      }}
                    >
                      <SettingOutlined />
                    </div>
                  </Dropdown>
                </div>
              </div>
              {/* </div> */}
              <div
                style={{
                  padding: "1px 5px 5px",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      Invoice Amount
                    </span>
                    : {Currency.value1}
                    {dd.InvoiceAmount}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "end",
                    }}
                  >
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      Settlement Amount
                    </span>
                    : {Currency.value1}
                    {dd.SettlementAmount}
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    {" "}
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      User Name
                    </span>
                    : {dd.UserName}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "end",
                    }}
                  >
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      Order Type
                    </span>
                    : {dd.OrderType}
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      Customer
                    </span>
                    :{" "}
                    {dd.CustName !== null
                      ? `${dd.CustName} / ${dd.CustMobileNo}`
                      : "N/A"}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "end",
                    }}
                  >
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      Department
                    </span>
                    : {dd.Dept}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BillsDetailsComponent;
