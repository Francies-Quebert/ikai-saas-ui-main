import { PrinterOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Dropdown, Tag, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { fetchDataRestaurantPOS_ResentKOTs } from "../../../services/restaurant-pos";
import { useSelector } from "react-redux";
import moment from "moment";
import { getOtherMater } from "../../../services/sendPromoMaster";
import {
  getInvoicePdf,
  getKotPdf,
} from "../../../services/service-managment/service-management";
import fileDownload from "js-file-download";
const OrderDetailsComponent = () => {
  const [displayData, setDisplayData] = useState([]);
  const BranchConfigs = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "R_BRANCH")
  );

  const DTFORMAT = useSelector((state) =>
    state.AppMain.appconfigs.find((ii) => ii.configCode === "DTTMFORMAT")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [kotColor, setKotColor] = useState([]);
  const loginInfo = useSelector((state) => state.LoginReducer.userData);
  useEffect(() => {
    fetchDataRestaurantPOS_ResentKOTs(
      CompCode,
      BranchConfigs.value1,
      loginInfo.username
    ).then((res) => {
      getOtherMater(CompCode, "KOTSTS").then((col) => {
        setKotColor(col);
      });
      // console.log(res, "kot");
      setDisplayData(res);
    });
  }, []);
  const data = [
    {
      KOTNo: 475,
      DateTime: "05-10-2020 05:00 PM",
      status: "RUNNING",
      orderType: "DINE IN / AC - 14",
      UserName: "Atul More",
      ReceiptNo: "RCPT-28420",
    },
    {
      KOTNo: 476,
      DateTime: "05-10-2020 05:00 PM",
      status: "RUNNING",
      orderType: "DINE IN / AC - 14",
      UserName: "Atul More",
      ReceiptNo: "RCPT-28420",
    },
    {
      KOTNo: 477,
      DateTime: "05-10-2020 05:00 PM",
      status: "RUNNING",
      orderType: "DINE IN / AC - 14",
      UserName: "Atul More",
      ReceiptNo: "RCPT-28420",
    },
    {
      KOTNo: 478,
      DateTime: "05-10-2020 05:00 PM",
      status: "RUNNING",
      orderType: "DINE IN / AC - 14",
      UserName: "Atul More",
      ReceiptNo: "RCPT-28420",
    },
    {
      KOTNo: 479,
      DateTime: "05-10-2020 05:00 PM",
      status: "RUNNING",
      orderType: "DINE IN / AC - 14",
      UserName: "Atul More",
      ReceiptNo: "RCPT-28420",
    },
    {
      KOTNo: 480,
      DateTime: "05-10-2020 05:00 PM",
      status: "RUNNING",
      orderType: "DINE IN / AC - 14",
      UserName: "Atul More",
      ReceiptNo: "RCPT-28420",
    },
  ];
  // console.log("shhshs")
  const menu = (
    <Menu>
      {/* <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.alipay.com/"
        >
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.taobao.com/"
        >
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.tmall.com/"
        >
          3rd menu item
        </a>
      </Menu.Item> */}
    </Menu>
  );
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
          color: "#FFF",
          fontWeight: 600,
          padding: "2px 8px",
          fontFamily: "Cairo",
          borderRadius: "4px 0px 4px",
          height: 26,
        }}
        className="background-color-header bg-color-style"
      >
        Recent KOT's
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
              key={dd.KOTNo}
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
                      }}
                      color={
                        kotColor.length > 0
                          ? kotColor.find(
                              (ii) => ii.ShortCode === dd.KOT_Status
                            ).SysOption2
                          : process.env.REACT_APP_PRIMARY_COLOR
                      }
                    >
                      {dd.KOTStatusDesc}
                    </Tag>
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      KOT No:
                    </span>{" "}
                    #{dd.KotId}/ {moment(dd.KOT_DATE).format(DTFORMAT.value1)}
                  </div>
                  {/* <div
                    style={{
                      width: 20,
                      textAlign: "end",
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
                      if (window.electron) {
                        dataType = "html";
                      }
                      getKotPdf(CompCode, true, dd.KotId, dataType).then(
                        (res) => {
                          if (res) {
                            if (window.electron) {
                              window.electron.ipcRenderer.send("store-data", {
                                pdf: res.data,
                                name: `${dd.KotId}.${dataType}`,
                                type: dataType,
                              });
                              window.electron.ipcRenderer.on(
                                "data-stored",
                                (event, arg) => {
                                  console.log("data stored", arg);
                                }
                              );
                            } else {
                              fileDownload(res.data, `${dd.KotId}.${dataType}`);
                            }
                          }
                        }
                      );
                      // console.log("print", dd);
                    }}
                  >
                    <PrinterOutlined />
                  </div>
                  {/* </div> */}
                  <div
                    style={{
                      width: 20,
                      textAlign: "end",
                      // color: "#000",
                      // fontWeight: "600",
                    }}
                  >
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
                        className="print-icon-custom"
                      >
                        <SettingOutlined />
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "1px 5px 5px",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 0.5 }}>
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      No Of Dishes
                    </span>
                    : {dd.NoOfDishes}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "end",
                    }}
                  >
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      Quantity
                    </span>
                    : {dd.TotalQty}
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
                      color: "#000",
                      fontWeight: "600",
                    }}
                  >
                    {dd.OrderType}
                    {dd.TableNo !== null ? ` / ${dd.TableNo}` : ""}
                  </div>
                </div>
                {/* <div style={{ display: "flex" }}> */}
                {/* <div style={{ flex: 1 }}>
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      User Name
                    </span>
                    : {dd.UserName}
                  </div> */}
                {/* <div
                style={{
                  flex: 1,
                  textAlign: "end",
                  color: "#000",
                  fontWeight: "600",
                }}
              >
               <span style={{ color: "#000", fontWeight: "600" }}>Receipt No</span>: {dd.ReceiptNo}
              </div> */}
                {/* </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetailsComponent;
