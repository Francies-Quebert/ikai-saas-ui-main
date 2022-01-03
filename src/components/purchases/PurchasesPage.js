import React, { useState, useEffect } from "react";
import { Button, DatePicker, Drawer, Table, Select } from "antd";
import PurchaseCard from "./PurchaseCard";
// import PurchaseCard from "./PurchaseNewCard";
import { setFormCaption } from "../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import ViewHotKeysComponent from "../common/ViewHotKeysComponent";
import INVAllTranDocViewComponent from "../sales/CommonComponent/INVAllTranDocViewComponent";
import PurchaseTranView from "../Inventory/TranViewableComponents/PurchaseTranView";
import { getDataSuppliers } from "../../services/supplier-master-comp";
import {
  getPurchaseReport,
  invDeletePurchaseInvoice,
} from "../../services/inventory";
import fileDownload from "js-file-download";
import { hasRightToBeUsedNext } from "../../shared/utility";
const { Option } = Select;

const { RangePicker } = DatePicker;
const PurchasesPage = () => {
  const dispatch = useDispatch();
  const [EntryMode, setEntryMode] = useState();
  const [DateRange, setDateRange] = useState([moment(), moment()]);
  const [suppId, setSuppId] = useState("ALL");
  const [supplierData, setSupplierData] = useState([]);
  const keyboardHotkeyConfig = useSelector((state) =>
    state.AppMain.keyboardHotKeyConfig.filter(
      (flt) => flt.CompName === "RestaurantPOSTran"
    )
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [tranId, setTranId] = useState();
  const showBatch = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "ENABLE_BATCH")
  );
  const [purchaseDrawer, setPurchaseDrawer] = useState({
    visible: false,
    data: null,
  });
  const l_loginUserName = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );

  const currTran = useSelector((state) => state.currentTran.moduleRights);
  const [inputParam, setInputParam] = useState({
    TranType: "PUR",
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    RefCode: suppId,
    CurrentUserName: l_loginUserName,
  });

  useEffect(() => {
    dispatch(setFormCaption(92));
    getDataSuppliers(CompCode).then((res) => {
      setSupplierData(res);
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ padding: "0px 8px 4px 0px", color: "#000" }}>
                Select Date Range :
              </div>{" "}
              <RangePicker
                size="small"
                style={{ marginRight: 5 }}
                onChange={(val, aa) => {
                  setDateRange(val !== null ? [...val] : [null, null]);
                }}
                defaultValue={DateRange}
                format={l_ConfigDateFormat.value1}
              />
              <div
                style={{
                  padding: "0px 8px 0px 0px",
                  color: "#000",
                  alignSelf: "center",
                }}
              >
                Select Supplier :
              </div>
              <Select
                size="small"
                allowClear
                showSearch
                showArrow
                placeholder="Select Supplier"
                style={{ width: 200, marginRight: 5 }}
                onChange={(val) => {
                  setSuppId(val);
                }}
                value={suppId}
              >
                {supplierData.length > 0 &&
                  supplierData.map((cc) => {
                    return (
                      <Option value={cc.PartyId} key={cc.PartyId}>
                        {cc.SupName} ({cc.SupTypeCode})
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
                icon={<SearchOutlined />}
                onClick={() => {
                  setInputParam({
                    TranType: "PUR",
                    FromDate: moment(DateRange[0]).format("YYYY-MM-DD"),
                    ToDate: moment(DateRange[1]).format("YYYY-MM-DD"),
                    RefCode: suppId,
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
                Create Purchase Invoice
              </Button>
            </div>
          </div>
          <INVAllTranDocViewComponent
            viewParam={inputParam}
            isEdit={true}
            onEditPress={(data) => {
              if (data && data.TranId) {
                setTranId(data.TranId);
                setEntryMode("E");
              } else {
                setTranId();
                setEntryMode();
              }
            }}
            isAllowDelete={true}
            onDeletePress={(data) => {
              invDeletePurchaseInvoice(CompCode, data.TranId, l_loginUser).then(
                (res) => {
                  setInputParam({ ...inputParam, TranType: "PUR" });
                }
              );
            }}
            onViewClick={(data) => {
              setPurchaseDrawer({
                visible: data.visible,
                data: data.TranId,
              });
            }}
            onDownloadPdf={(record) => {
              let dataType = "pdf";
              if (window.electron) {
                dataType = "html";
              }
              getPurchaseReport(CompCode, record.TranId, dataType).then(
                (res) => {
                  if (res) {
                    let fileName = res.TranNo;
                    if (window.electron) {
                      window.electron.ipcRenderer.send("store-data", {
                        pdf: res.data,
                        name: `${fileName}.${dataType}`,
                        type: dataType,
                      });
                      window.electron.ipcRenderer.on(
                        "data-stored",
                        (event, arg) => {
                          console.log("data stored", arg);
                        }
                      );
                    } else {
                      fileDownload(res.data, `${fileName}.${dataType}`);
                    }
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
          width={"60%"}
          bodyStyle={{ padding: 0 }}
          onClose={() => {
            setPurchaseDrawer({ visible: false, data: null });
          }}
          visible={purchaseDrawer.visible}
        >
          <PurchaseTranView
            VoucherId={purchaseDrawer.data}
            onClose={() => {
              setPurchaseDrawer({ visible: false, data: null });
            }}
          />
        </Drawer>
      </>

      {EntryMode && (
        <>
          <PurchaseCard
            onBackPress={() => {
              setEntryMode();
              setTranId();
            }}
            entryMode={EntryMode}
            showBatch={showBatch.value1}
            VoucherId={tranId}
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

export default PurchasesPage;
