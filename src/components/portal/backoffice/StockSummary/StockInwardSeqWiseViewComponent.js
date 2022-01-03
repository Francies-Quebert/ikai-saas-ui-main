import React, { useState, useEffect } from "react";
import { Table, Tooltip, Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import PurchaseTranView from "../../../Inventory/TranViewableComponents/PurchaseTranView";
import SaleViewTran from "../../../Inventory/TranViewableComponents/SaleViewTran";
import AdjustmentViewTran from "../../../Inventory/TranViewableComponents/AdjustmentViewTran";
import AdjustmentNewViewTran from "../../../Inventory/TranViewableComponents/AdjustmentNewViewTran";
import StockReprocessingViewTran from "../../../Inventory/TranViewableComponents/StockReprocessingViewTran";
import PurchaseNonInward from "../../../purchases/NewPurchase/PurchaseNonInward";

const StockInwardSeqWiseViewComponent = (props) => {
  const [stockDtlData, setStockDtlData] = useState();
  const l_ConfigDateTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "DTTMFORMAT")
  );
  const l_ConfigMaintainInventorySeqWise = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "INV_TYPE")
  );
  const l_ConfigClientCode = useSelector((state) =>
    state.AppMain.appconfigs.find((cur) => cur.configCode === "CLIENT_CODE")
  );
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
    type: "",
  });

  useEffect(() => {
    if (props.data) {
      // console.log(props.data,"sssyyy")
      setStockDtlData(props.data);
    } else {
      setStockDtlData();
    }
  }, [props.data]);

  const columnsNested = [
    {
      title: "",
      width: 5,
      render: (text, record) => {
        return (
          <>
            <Tooltip title="View">
              <EyeOutlined
                className="custom-day-book-icon"
                onClick={() => {
                  if (record.DType === "PUR") {
                    setDrawer({
                      visible: true,
                      data: record.TranNo,
                      type: "PUR",
                    });
                    // getStockSummaryPurchasePdf(record.TranNo, "PDF").then(
                    //   (res) => {
                    //     if (res) {
                    //       fileDownload(
                    //         res.data,
                    //         `${record.DType}-${record.TranNo}.pdf`
                    //       );
                    //     }
                    //   }
                    // );
                  } else if (record.DType === "SALE") {
                    setDrawer({
                      visible: true,
                      data: record.TranNo,
                      type: "SALE",
                    });
                    // getStockSummarySalesPdf(record.TranNo, "PDF").then(
                    //   (res) => {
                    //     if (res) {
                    //       fileDownload(
                    //         res.data,
                    //         `${record.DType}-${record.TranNo}.pdf`
                    //       );
                    //     }
                    //   }
                    // );
                  } else if (record.DType === "ADJS") {
                    setDrawer({
                      visible: true,
                      data: record.TranNo,
                      type: "ADJS",
                    });
                  } else if (record.DType === "REPRO") {
                    setDrawer({
                      visible: true,
                      data: record.TranNo,
                      type: "REPRO",
                    });
                  } else if (record.DType === "STOCKOUT") {
                    setDrawer({
                      visible: true,
                      data: record.TranNo,
                      type: "ADJS",
                    });
                  }
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
    { title: "Tran Type", dataIndex: "TranType", width: 100 },
    {
      title: "Tran Qty",
      dataIndex: "Qty",
      width: 80,
      align: "right",
      render: (txt, record, idx) => {
        let l_tmpRunningTotal = 0;
        stockDtlData.AddInfo.TranDetailWise.forEach((ee, ridx) => {
          if (ridx <= idx) {
            l_tmpRunningTotal +=
              parseFloat(ee.Qty) * (ee.Nature === "-" ? -1 : 1);
          }
        });

        return (
          <Tooltip
            title={`Running qty is "${l_tmpRunningTotal.toFixed(2)}"`}
            key={idx}
            color={"cyan"}
          >
            <span
              style={{
                fontWeight: 500,
                color: `${record.Nature === "+" ? "green" : "red"}`,
              }}
            >
              {parseFloat(Math.abs(record.Qty)).toFixed(2)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Running Qty",
      dataIndex: "Qty",
      width: 80,
      align: "right",
      render: (txt, record, idx) => {
        let l_tmpRunningTotal = 0;
        stockDtlData.AddInfo.TranDetailWise.forEach((ee, ridx) => {
          if (ridx <= idx) {
            l_tmpRunningTotal +=
              parseFloat(ee.Qty) * (ee.Nature === "-" ? -1 : 1);
          }
        });
        return (
          <span className="text-blue-500 font-semibold">
            {l_tmpRunningTotal.toFixed(2)}{" "}
          </span>
        );
      },
    },
    {
      title: "Tran Value",
      dataIndex: "Amount",
      width: 90,
      align: "right",
      render: (txt, record, idx) => {
        let l_tmpRunningTotal = 0;
        stockDtlData.AddInfo.TranDetailWise.forEach((ee, ridx) => {
          if (ridx <= idx) {
            l_tmpRunningTotal +=
              parseFloat(ee.Amount) * (ee.Nature === "-" ? -1 : 1);
          }
        });

        return (
          <Tooltip
            title={`Running amount is "${l_tmpRunningTotal.toFixed(2)}"`}
            color={"purple"}
            key={idx}
          >
            <span
              style={{
                fontWeight: 500,
                color: `${record.Nature === "+" ? "green" : "red"}`,
              }}
            >
              {parseFloat(
                Math.abs(
                  record.Amount /
                    props.ConfigStockSummaryValueDivisibleByN.value1
                )
              ).toFixed(2)}
            </span>
          </Tooltip>
        );
      },
    },
    { title: "Tran Ref.", dataIndex: "TranReference", width: 100 },
    {
      title: "Created By",
      dataIndex: "CreatedBy",
      width: 100,
    },
    {
      title: `Created on`,
      dataIndex: "CreatedOn",
      width: 150,
      render: (txt, record) => {
        return (
          <span>
            {moment(record.CreatedOn).format(l_ConfigDateTimeFormat.value1)}
          </span>
        );
      },
    },
  ];

  const NestedTable = () => {
    const expandedRowRender = (val, val2, val3) => {
      return (
        <div style={{ margin: 15, marginLeft: 10 }}>
          <Table
            bordered={true}
            showHeader={true}
            columns={columnsNested}
            dataSource={
              stockDtlData && stockDtlData.AddInfo
                ? stockDtlData.AddInfo.TranDetailWise.filter(
                    (i) => i.InwardSeq === val.InwardSeq
                  )
                : null
            }
            pagination={false}
          />
        </div>
      );
    };

    const columns = [
      {
        title: "Source",
        dataIndex: "InwardSource",
        width: 50,
      },
      {
        title: "ISEQ",
        dataIndex: "InwardSeq",
        width: 50,
      },
      {
        title: "CS",
        dataIndex: "CurrStockQty",
        width: 80,
        align: "right",
        render: (txt, record) => {
          return (
            <span
              style={{
                fontWeight: 500,
              }}
            >
              {parseFloat(Math.abs(record.CurrStockQty)).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "CS Value",
        dataIndex: "CurrStockVal",
        align: "right",
        width: 80,
        render: (txt, record) => {
          return (
            <span
              style={{
                fontWeight: 500,
              }}
            >
              {parseFloat(
                Math.abs(record.CurrStockVal) /
                  props.ConfigStockSummaryValueDivisibleByN.value1
              ).toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Created By",
        dataIndex: "CreatedBy",
        width: 70,
      },
      {
        title: "Created on",
        dataIndex: "CreatedOn",
        width: 100,
        render: (txt, record) => {
          return (
            <span>
              {moment(record.CreatedOn).format(l_ConfigDateTimeFormat.value1)}
            </span>
          );
        },
      },
    ];

    return (
      <>
        <div
          style={{
            backgroundColor: "var(--app-theme-color)",
            fontSize: 14,
            width: "100%",
            color: "#FFF",
            padding: "3px 0px 3px 8px",
            fontWeight: "600",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {stockDtlData
            ? `# ${stockDtlData.ItemCode} (${stockDtlData.ItemName})`
            : `#`}
        </div>
        {l_ConfigMaintainInventorySeqWise.value1 === "Y" && (
          <Table
            size="small"
            columns={columns}
            expandable={{
              expandedRowRender,
            }}
            dataSource={
              stockDtlData && stockDtlData.AddInfo
                ? stockDtlData.AddInfo.InwardWise
                : null
            }
            bordered={true}
            pagination={false}
          />
        )}
        {l_ConfigMaintainInventorySeqWise.value1 === "N" && (
          <Table
            // size="small"
            bordered={true}
            showHeader={true}
            columns={columnsNested}
            dataSource={
              stockDtlData && stockDtlData.AddInfo
                ? stockDtlData.AddInfo.TranDetailWise
                : null
            }
            pagination={false}
          />
        )}
      </>
    );
  };

  return (
    <>
      <NestedTable />
      {drawer.visible && drawer.data && (
        <>
          <Drawer
            placement="right"
            closable={true}
            width={"50%"}
            bodyStyle={{ padding: 0 }}
            onClose={() => {
              setDrawer({ visible: false, data: null });
            }}
            visible={drawer.visible}
          >
            {drawer.type === "PUR" ? (
              l_ConfigMaintainInventorySeqWise.value1 === "Y" ? (
                <PurchaseTranView
                  VoucherId={drawer.data}
                  onClose={() => {
                    setDrawer({ visible: false, data: null });
                  }}
                />
              ) : (
                <PurchaseNonInward
                  VoucherId={drawer.data}
                  isShowFreeQty={
                    props.isShowFreeQty ? props.isShowFreeQty : false
                  }
                  onClose={() => {
                    setDrawer({ visible: false, data: null });
                  }}
                />
              )
            ) : drawer.type === "SALE" ? (
              <SaleViewTran
                VoucherId={drawer.data}
                onClose={() => {
                  setDrawer({ visible: false, data: null });
                }}
              />
            ) : drawer.type === "ADJS" ? (
              l_ConfigMaintainInventorySeqWise.value1 === "Y" ? (
                <AdjustmentViewTran
                  VoucherId={drawer.data}
                  onClose={() => {
                    setDrawer({ visible: false, data: null });
                  }}
                />
              ) : (
                <AdjustmentNewViewTran
                  VoucherId={drawer.data}
                  onClose={() => {
                    setDrawer({ visible: false, data: null });
                  }}
                />
              )
            ) : drawer.type === "REPRO" ? (
              <StockReprocessingViewTran
                VoucherId={drawer.data}
                onClose={() => {
                  setDrawer({ visible: false, data: null });
                }}
              />
            ) : (
              ""
            )}
          </Drawer>
        </>
      )}
    </>
  );
};

export default StockInwardSeqWiseViewComponent;
