import React from "react";
import { Col, notification, Empty } from "antd";
import { useSelector } from "react-redux";
import _ from "lodash";
import ViewRecentTranData from "./CommonComponent/ViewRecentTranData";
import LastScannedItemDtl from "./CommonComponent/LastScannedItemDtl";
import { getSalesReport } from "../../services/inventory";
import fileDownload from "js-file-download";
const SalesRecentTransactionComponent = (props) => {
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  // const [reprintLoading, setReprintLoading] = useState(false);
  return (
    <div
      className="card-sales"
      style={{
        height: "100%",
        display: "flex",
        flexFlow: "column",
        padding: 0,
        paddingBottom: 0,
        margin: "0px",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexFlow: "row wrap",
          // height: "calc(100% - 25px)",
          height: "100%",
        }}
      >
        <div
          style={{
            minWidth: "55%",
            maxWidth: "55%",
            height: "100%",
          }}
        >
          {/* <div
            className="card-sales-inner"
            style={{
              padding: "2px 8px 0px",
              fontSize: 15,
              fontWeight: 600,
              height: 25,
            }}
          >
            Recent Transaction
          </div> */}
          <div
            className="style-2"
            style={{
              overflow: "auto",
              borderRight: "1px solid var(--app-theme-color)",
              fontFamily: "Cairo",
              height: "100%",
              // height: "calc(100% - 25px)",
            }}
          >
            {props.recentTran && props.recentTran.length > 0 ? (
              <div className="sales-recent-box-shadow">
                {props.recentTran.map((aa, idx) => {
                  return (
                    <ViewRecentTranData
                      key={idx}
                      onReprintClick={() => {
                        let dataType = "pdf";

                        if (window.electron) {
                          dataType = "html";
                        }
                        // setReprintLoading(true);

                        if (props.TranType === "SALE") {
                          getSalesReport(
                            CompCode,
                            aa.stlmntData.InvoiceId,
                            dataType
                          )
                            .then((res) => {
                              if (res) {
                                if (window.electron) {
                                  window.electron.ipcRenderer.send(
                                    "store-data",
                                    {
                                      pdf: res.data,
                                      name: `${aa.stlmntData.VoucherNo}.${dataType}`,
                                      type: dataType,
                                    }
                                  );
                                  window.electron.ipcRenderer.on(
                                    "data-stored",
                                    (event, arg) => {
                                      console.log("data stored", arg);
                                    }
                                  );
                                } else {
                                  fileDownload(
                                    res.data,
                                    `${aa.stlmntData.VoucherNo}.${dataType}`
                                  );
                                }
                              }
                            })
                            .catch((err) => {
                              notification.error({
                                message: "Error Occured",
                                description: err,
                              });
                              // setReprintLoading(false);
                            });
                        }
                      }}
                      // reprintLoading={reprintLoading}
                      key={aa.stlmntData.VoucherNo}
                      hdrData={aa.hdrData}
                      dtlData={aa.dtlData}
                      stlmntData={aa.stlmntData}
                    />
                  );
                })}
              </div>
            ) : (
              <Empty
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                description={<span>No Recent Transaction</span>}
              />
            )}
          </div>
        </div>
        <div style={{ width: "45%", height: "100%" }}>
          <LastScannedItemDtl lastScanned={props.lastScanned} />
        </div>
      </div>
      {/* <div
        style={{ height: "calc(100% - 55px)" }}
        className="border-bottom-style-color"
      >
        <div
          style={{
            display: "flex",
            //   height: "calc(100% - 25px)",
            flexFlow: "row wrap",
            padding: 5,
          }}
        >
       
        </div>
      </div> */}
      {/* <div
        className="sales-item-input-label"
        style={{
          fontSize: 15,
          display: "flex",
          justifyContent: "space-between",
          padding: "2px 8px",
        }}
      >
        <div className="color-style">Total Paid</div>
        <div
          className="sales-summary-value border-color-style"
          style={{ fontWeight: 600, height: 25 }}
        >
          {_.truncate(`${currency.value1} ${props.totalPaid}`, { length: 15 })}
        </div>
      </div> */}
    </div>
  );
};

export default SalesRecentTransactionComponent;
