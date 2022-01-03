import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, DatePicker, Drawer, Select, Modal } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import { getDataCustomers } from "../../../services/user-master";
import { setFormCaption } from "../../../store/actions/currentTran";
import INVAllTranDocViewComponent from "../../sales/CommonComponent/INVAllTranDocViewComponent";
import SaleReturnNewCard from "./Components/SaleReturnNewCard";
import SaleViewTran from "../TranViewableComponents/SaleViewTran";
import {
  getSalesReport,
  getSalesReturnReport,
} from "../../../services/inventory";
import fileDownload from "js-file-download";
import SalesReturnViewTran from "../TranViewableComponents/SalesReturnViewTran";
const { RangePicker } = DatePicker;
const { Option } = Select;

const SaleReturnNew = () => {
  const dispatch = useDispatch();
  const searchRef = useRef();
  const l_loginUserName = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const [EntryMode, setEntryMode] = useState();
  const [DateRange, setDateRange] = useState([moment(), moment()]);
  const [refCode, setRefCode] = useState("ALL");
  const [drawer, setDrawer] = useState({ visible: false, data: null });
  const [customerData, setCustomerData] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [inputParam, setInputParam] = useState({
    TranType: "SALERTN",
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    RefCode: refCode,
    CurrentUserName: l_loginUserName,
  });

  useEffect(() => {
    dispatch(setFormCaption(115));
    getDataCustomers(CompCode).then((res) => {
      setCustomerData(res);
    });
  }, []);

  return (
    <>
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
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ padding: "0px 8px 4px 0px", color: "#000" }}>
                  Select Date Range :
                </div>
                <RangePicker
                  size="small"
                  style={{ marginRight: 5 }}
                  onChange={(val, aa) => {
                    setDateRange(val !== null ? [...val] : [null, null]);
                  }}
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
                    setRefCode(val);
                  }}
                  value={refCode}
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
                  icon={<SearchOutlined />}
                  // ref={searchRef}
                  disabled={
                    !DateRange[0] ||
                    !DateRange[1] | _.includes(["", undefined], refCode)
                  }
                  onClick={() => {
                    setInputParam({
                      TranType: "SALERTN",
                      FromDate: moment(DateRange[0]).format("YYYY-MM-DD"),
                      ToDate: moment(DateRange[1]).format("YYYY-MM-DD"),
                      RefCode: refCode,
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
                >
                  Create New Sale-Return
                </Button>
              </div>
            </div>

            <INVAllTranDocViewComponent
              viewParam={inputParam}
              isEdit={false}
              onEditPress={async (data) => {}}
              onViewClick={(data) => {
                setDrawer({
                  visible: data.visible,
                  data: data.TranId,
                });
              }}
              onDownloadPdf={(record) => {}}
            />
          </>
        )}

        {EntryMode && (
          <>
            <SaleReturnNewCard
              onBackPress={() => {
                setEntryMode();
              }}
              entryMode={"A"}
              // showBatch={showBatch.value1}
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
            <SalesReturnViewTran
              VoucherId={drawer.data}
              onClose={() => {
                setDrawer({ visible: false, data: null });
              }}
              onDownloadPdf={(data) => {
                let dataType = "pdf";

                if (window.electron) {
                  dataType = "html";
                }
                getSalesReturnReport(
                  CompCode,
                  data.SaleReturnHdr.VoucherId,
                  dataType
                ).then((res) => {
                  if (res) {
                    if (window.electron) {
                      window.electron.ipcRenderer.send("store-data", {
                        pdf: res.data,
                        name: `${data.SaleReturnHdr.VoucherNo}.${dataType}`,
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
                        `${data.SaleReturnHdr.VoucherNo}.${dataType}`
                      );
                    }
                  }
                });
              }}
            />
          </Drawer>
        </>
      </div>
    </>
  );
};

export default SaleReturnNew;
