import React, { useState, useEffect } from "react";
import { Button, DatePicker, Drawer, Select, Modal } from "antd";
import { setFormCaption } from "../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import {
  PlusOutlined,
  SearchOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import { getDataCustomers } from "../../services/user-master";
import SalesOrderCard from "./Components/SalesOrderCard";
import {
  hasRightToBeUsedNext,
  PrintPdfOrFromElectron,
} from "../../shared/utility";
import INVAllTranDocViewComponent from "../sales/CommonComponent/INVAllTranDocViewComponent";
import SaleOrderViewTran from "./TranViewableComponent/SaleOrderViewTran";
import { getSalesOrderReport } from "../../services/inventory";
import fileDownload from "js-file-download";

const SalesOrderPage = () => {
  const dispatch = useDispatch();
  const { RangePicker } = DatePicker;
  const { Option } = Select;

  const [custId, setCustId] = useState("ALL");
  const [EntryMode, setEntryMode] = useState();
  const [DateRange, setDateRange] = useState([moment(), moment()]);
  const [customerData, setCustomerData] = useState([]);
  const [drawer, setDrawer] = useState({ visible: false, data: null });

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_loginUserName = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const currTran = useSelector((state) => state.currentTran.moduleRights);
  const showBatch = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "ENABLE_BATCH")
  );

  const [inputParam, setInputParam] = useState({
    TranType: "SALEORDER",
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    RefCode: custId,
    CurrentUserName: l_loginUserName,
  });
  useEffect(() => {
    dispatch(setFormCaption(127));
    getDataCustomers(CompCode).then((res) => {
      setCustomerData(res);
    });
  }, []);

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
      }}
    >
      {!EntryMode && (
        <>
          <div
            className="card-sales"
            style={{
              // backgroundColor: "#FFF",
              // padding: "5px 10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex" }}>
              <div
                style={{
                  padding: "0px 8px 0px 0px",
                  color: "#000",
                  alignSelf: "center",
                }}
              >
                Select Date Range :
              </div>
              <RangePicker
                size="small"
                style={{ marginRight: 5 }}
                format={l_ConfigDateFormat.value1}
                onChange={(val, aa) => {
                  // console.log(val);
                  setDateRange(val !== null ? [...val] : [null, null]);
                }}
                format={l_ConfigDateFormat.value1}
                defaultValue={DateRange}
              />
              <div
                style={{
                  padding: "0px 8px 0px 0px",
                  color: "#000",
                  alignSelf: "center",
                }}
              >
                Select Customer :
              </div>
              <Select
                size="small"
                allowClear
                showSearch
                showArrow
                placeholder="Select Customer"
                style={{ width: 200, marginRight: 5 }}
                onChange={(val) => {
                  setCustId(val);
                }}
                value={custId}
              >
                {customerData.length > 0 &&
                  customerData.map((cc) => {
                    return (
                      <Option value={cc.UserId} key={cc.UserId}>
                        {cc.Name} ({cc.mobile})
                      </Option>
                    );
                  })}
                <Option value={"ALL"} key={"ALL"}>
                  All
                </Option>
              </Select>
              <Button
                type="primary"
                size="small"
                style={{ alignSelf: "center" }}
                icon={<SearchOutlined />}
                disabled={
                  !DateRange[0] ||
                  !DateRange[1] | _.includes(["", undefined], custId)
                }
                onClick={() => {
                  setInputParam({
                    TranType: "SALEORDER",
                    FromDate: moment(DateRange[0]).format("YYYY-MM-DD"),
                    ToDate: moment(DateRange[1]).format("YYYY-MM-DD"),
                    RefCode: custId,
                    CurrentUserName: l_loginUserName,
                  });
                }}
              >
                Search
              </Button>
            </div>
            <div style={{ display: "flex", padding: "0px 3px" }}>
              <Button
                icon={<PlusOutlined />}
                size="small"
                type="primary"
                onClick={() => {
                  setEntryMode("A");
                }}
                disabled={!hasRightToBeUsedNext(currTran, "ADD")}
              >
                Create Sales Order
              </Button>
            </div>
          </div>

          <INVAllTranDocViewComponent
            viewParam={inputParam}
            onViewClick={(data) => {
              setDrawer({
                visible: data.visible,
                data: data.TranId,
              });
            }}
            onDownloadPdf={(record) => {
              let dataType = "pdf";
              if (window.electron) {
                dataType = "html";
              }
              getSalesOrderReport(CompCode, record.TranId, dataType).then(
                (res) => {
                  if (res) {
                    PrintPdfOrFromElectron(
                      res,
                      `${record.TranNo}.${dataType}`,
                      dataType
                    );
                  }
                }
              );
            }}
          />
        </>
      )}

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
          <SaleOrderViewTran
            VoucherId={drawer.data}
            onClose={() => {
              setDrawer({ visible: false, data: null });
            }}
            onDownloadPdf={(data) => {
              let dataType = "pdf";

              if (window.electron) {
                dataType = "html";
              }
              getSalesOrderReport(
                CompCode,
                data.SaleOrderHdr.VoucherId,
                dataType
              ).then((res) => {
                if (res) {
                  if (window.electron) {
                    window.electron.ipcRenderer.send("store-data", {
                      pdf: res.data,
                      name: `${data.SaleOrderHdr.VoucherNo}.${dataType}`,
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
                      `${data.SaleOrderHdr.VoucherNo}.${dataType}`
                    );
                  }
                }
              });
            }}
          />
        </Drawer>
      </>

      {EntryMode === "A" && (
        <>
          <SalesOrderCard
            onBackPress={() => {
              setEntryMode();
            }}
            showBatch={showBatch.value1}
            entryMode={EntryMode}
          />
        </>
      )}
    </div>
  );
};

export default SalesOrderPage;
