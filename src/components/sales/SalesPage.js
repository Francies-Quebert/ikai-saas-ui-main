import React, { useState, useEffect } from "react";
import { Button, DatePicker, Drawer, Select, Modal, Col } from "antd";
import SalesCard from "./SalesCard";
import { setFormCaption } from "../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import {
  PlusOutlined,
  SearchOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import { getSalesReport, invDeletSalesInvoice } from "../../services/inventory";
import { getDataCustomers } from "../../services/user-master";
import INVAllTranDocViewComponent from "./CommonComponent/INVAllTranDocViewComponent";
import SaleViewTran from "../Inventory/TranViewableComponents/SaleViewTran";
import fileDownload from "js-file-download";
import {
  hasRightToBeUsedNext,
  PrintPdfOrFromElectron,
} from "../../shared/utility";
import ReportsMain from "../portal/Reports/ReportsMain";
import ViewRecentTranData from "./CommonComponent/ViewRecentTranData";
const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesPage = () => {
  const dispatch = useDispatch();
  const [EntryMode, setEntryMode] = useState();
  const [DateRange, setDateRange] = useState([moment(), moment()]);
  const [custId, setCustId] = useState("ALL");
  const [customerData, setCustomerData] = useState([]);
  const [salesDrawer, setSalesDrawer] = useState({
    visible: false,
    data: null,
  });
  const [showModal, setShowModal] = useState(false);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const keyboardHotkeyConfig = useSelector((state) =>
    state.AppMain.keyboardHotKeyConfig.filter(
      (flt) => flt.CompName === "RestaurantPOSTran"
    )
  );
  const showBatch = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "ENABLE_BATCH")
  );
  const currTran = useSelector((state) => state.currentTran.moduleRights);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_loginUserName = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  const [inputParam, setInputParam] = useState({
    TranType: "SALE",
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    RefCode: custId,
    CurrentUserName: l_loginUserName,
  });

  useEffect(() => {
    dispatch(setFormCaption(90));
    getDataCustomers(CompCode).then((res) => {
      setCustomerData(res);
    });
  }, []);

  const hdrData = {
    InvoiceId: 1,
    VoucherNo: "SL-10354",
    currentTime: "12/08/2021 11:17:09",
    amountPaid: 4000,
    Amount: 4000,
    customerName: "Atul More",
  };

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
                    TranType: "SALE",
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
                icon={<SnippetsOutlined />}
                size="small"
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => {
                  setShowModal(true);
                  // setEntryMode("A");
                }}
                // disabled={!hasRightToBeUsedNext(currTran, "ADD")}
              >
                Show Reports
              </Button>
              <Button
                icon={<PlusOutlined />}
                size="small"
                type="primary"
                onClick={() => {
                  setEntryMode("A");
                }}
                disabled={!hasRightToBeUsedNext(currTran, "ADD")}
              >
                Create Sales Invoice
              </Button>
            </div>
          </div>

          <INVAllTranDocViewComponent
            viewParam={inputParam}
            onViewClick={(data) => {
              setSalesDrawer({
                visible: data.visible,
                data: data.TranId,
              });
            }}
            onDownloadPdf={(record) => {
              let dataType = "pdf";
              if (window.electron) {
                dataType = "html";
              }
              getSalesReport(CompCode, record.TranId, dataType).then((res) => {
                if (res) {
                  PrintPdfOrFromElectron(
                    res,
                    `${record.TranNo}.${dataType}`,
                    dataType
                  );
                }
              });
            }}
            isAllowDelete={true}
            onDeletePress={(data) => {
              invDeletSalesInvoice(CompCode, data.TranId, l_loginUserName).then(
                (res) => {
                  setInputParam({ ...inputParam, TranType: "SALE" });
                }
              );
            }}
          />
        </>
      )}
      {/* <Col
        style={{
          display: "flex",
          flexFlow: "row wrap",
          minWidth: "100%",
          height: 245,
        }}
      >
        <Col
          span={12}
          style={{
            // minWidth: "33.33%",
            // maxWidth: "33.33%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            paddingBottom: 5,
            paddingRight: 3,
          }}
        >
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
                <div
                  className="style-2"
                  style={{
                    overflow: "auto",
                    borderRight: "1px solid var(--app-theme-color)",
                    fontFamily: "Cairo",
                    height: "100%",
                  }}
                >
                  <div className="sales-recent-box-shadow">
                    <ViewRecentTranData
                      key={1}
                      hdrData={hdrData}
                      stlmntData={{ VoucherNo: hdrData.VoucherNo }}
                    />{" "}
                    <ViewRecentTranData
                      key={1}
                      hdrData={hdrData}
                      stlmntData={{ VoucherNo: hdrData.VoucherNo }}
                    />{" "}
                    <ViewRecentTranData
                      key={1}
                      hdrData={hdrData}
                      stlmntData={{ VoucherNo: hdrData.VoucherNo }}
                    />{" "}
                    <ViewRecentTranData
                      key={1}
                      hdrData={hdrData}
                      stlmntData={{ VoucherNo: hdrData.VoucherNo }}
                    />{" "}
                    <ViewRecentTranData
                      key={1}
                      hdrData={hdrData}
                      stlmntData={{ VoucherNo: hdrData.VoucherNo }}
                    />{" "}
                    <ViewRecentTranData
                      key={1}
                      hdrData={hdrData}
                      stlmntData={{ VoucherNo: hdrData.VoucherNo }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Col> */}

      <>
        <Drawer
          placement="right"
          closable={true}
          width={"50%"}
          bodyStyle={{ padding: 0 }}
          onClose={() => {
            setSalesDrawer({ visible: false, data: null });
          }}
          visible={salesDrawer.visible}
        >
          <SaleViewTran
            VoucherId={salesDrawer.data}
            onClose={() => {
              setSalesDrawer({ visible: false, data: null });
            }}
            onDownloadPdf={(data) => {
              let dataType = "pdf";

              if (window.electron) {
                dataType = "html";
              }
              if (data.SaleHdr.VoucherId) {
                getSalesReport(CompCode, data.SaleHdr.VoucherId, dataType).then(
                  (res) => {
                    if (res) {
                      if (window.electron) {
                        window.electron.ipcRenderer.send("store-data", {
                          pdf: res.data,
                          name: `${data.SaleHdr.VoucherNo}.${dataType}`,
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
                          `${data.SaleHdr.VoucherNo}.${dataType}`
                        );
                      }
                    }
                  }
                );
              }
            }}
          />
        </Drawer>
      </>
      {/* )} */}
      <Modal
        // title={"Customer"}
        visible={showModal}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        style={{ top: 20 }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal(false);
        }}
        width={"95%"}
      >
        <ReportsMain
          //reportGroups={["Registers"]}
          // reportIds={[28,29,13]}
          // reportId={"28"}
          // reportGroup={"Registers"}
          isModal={true}
        />
      </Modal>
      {EntryMode === "A" && (
        <>
          <SalesCard
            onBackPress={() => {
              setEntryMode();
            }}
            showBatch={showBatch.value1}
            entryMode={EntryMode}
            // onSaveClick={(searchData, ItemTableData, voucherSummary) => {
            //   InvSaveSaleInvoice(SaleInvoiceHdr, SaleInvoiceDtl).then(
            //       (res) => {
            //         reInitializeForm();

            //       }
            //     );
            // }}
          />
          {/* {keyboardHotkeyConfig.length > 0 && (
            
            <ViewHotKeysComponent
              keyboardKey={keyboardHotkeyConfig}
              title={`Sales Screen (Hotkey Config)`}
              RefreshKeyConfig={() => {
                // onRefreshKeyConfig("dine-in-default");
              }}
            />
          )} */}
        </>
      )}
    </div>
  );
};

export default SalesPage;
