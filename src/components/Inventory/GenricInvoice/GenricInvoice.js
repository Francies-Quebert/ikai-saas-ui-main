import React, { useEffect, useState } from "react";
import fileDownload from "js-file-download";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useDispatch, useSelector } from "react-redux";
import GenricInvoiceCard from "./GenricInvoiceCard";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import { Button, DatePicker, Drawer, Select } from "antd";
import moment from "moment";
import { getDataCustomers } from "../../../services/user-master";
import _ from "lodash";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import INVAllTranDocViewComponent from "../../sales/CommonComponent/INVAllTranDocViewComponent";
import GenericInvoiceViewComponent from "./Component/GenericInvoiceViewComponent";
import { fetchReceiptAndPaymentReferenceHelp } from "../../../services/receipts-payments";
import {
  deleteServiceInvoice,
  getGenericInvoicePdf,
} from "../../../services/inventory";
import { PrintPdfOrFromElectron } from "../../../shared/utility";
const { RangePicker } = DatePicker;
const { Option } = Select;
const GenricInvoice = () => {
  const [entryType, setEntryType] = useState();
  const dispatch = useDispatch();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    dispatch(setFormCaption(117));
    dispatch(fetchUserMasters("U"));
    // getDataCustomers(CompCode).then((res) => {
    //   setCustomerData(res);
    // });
    fetchReceiptAndPaymentReferenceHelp(CompCode).then((res) => {
      if (res.length > 0) {
        setCustomerData(res.filter((i) => i.DataSetType === "PARTY"));
      }
    });
    return () => {};
  }, []);
  const [DateRange, setDateRange] = useState([moment(), moment()]);
  const [custId, setCustId] = useState("ALL");
  const [DrawerShow, setDrawerShow] = useState({
    data: null,
    visible: false,
  });
  const [PrintStatus, setPrintStatus] = useState(false);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  
  const [InvoiceId, setInvoiceId] = useState();
  const [customerData, setCustomerData] = useState([]);
  const l_loginUserName = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const l_ConfigDateFormat = useSelector(
    (state) =>
      state.AppMain.appconfigs.find((i) => i.configCode === "DTFORMAT").value1
  );
  const [inputParam, setInputParam] = useState({
    TranType: "INV",
    FromDate: moment().format("YYYY-MM-DD"),
    ToDate: moment().format("YYYY-MM-DD"),
    RefCode: "ALL",
    CurrentUserName: l_loginUserName,
  });
  return (
    <div>
      {!entryType && (
        <>
          <div
            className="genric-invoice-data"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 5,
            }}
          >
            <div style={{ display: "flex", fontFamily: "Cairo" }}>
              <div className="generic-inv-rng-pick">Select Date Range</div>
              <RangePicker
                size="small"
                style={{ marginRight: 5 }}
                onChange={(val, aa) => {
                  // console.log(val);
                  setDateRange(val !== null ? [...val] : [null, null]);
                }}
                defaultValue={DateRange}
                format={l_ConfigDateFormat}
              />
            </div>
            <div style={{ display: "flex", fontFamily: "Cairo" }}>
              <div className="generic-inv-rng-pick">Select Customer</div>
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
                  customerData.map((item) => {
                    return (
                      <Select.Option key={item.RefId} value={item.RefId}>
                        {`${item.RefName} ${
                          item.AddInfo !== null ? `(${item.AddInfo})` : ""
                        }`}
                      </Select.Option>
                    );
                  })}
                <Option value={"ALL"} key={"ALL"}>
                  All
                </Option>
              </Select>
            </div>
            <div>
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
                    TranType: "INV",
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
            <div
              style={{
                textAlign: "right",
                flex: 1,
              }}
            >
              <Button
                icon={<PlusOutlined />}
                size="small"
                type="primary"
                onClick={() => {
                  setEntryType({ EntryMode: "A" });
                }}
              >
                Add Generic Invoice
              </Button>
            </div>
          </div>
          <div className="genric-invoice-data">
            <INVAllTranDocViewComponent
              viewParam={inputParam}
              onViewClick={(data) => {
                // console.log(data, "sad");
                setDrawerShow({
                  visible: data.visible,
                  data: data.TranId,
                });
              }}
              // onDownloadPdf={(record) => {
              //   //   getSalesReport(record.TranId, "PDF").then((res) => {
              //   //     if (res) {
              //   //       fileDownload(res.data, `${record.TranNo}.pdf`);
              //   //     }
              //   //   });
              // }}
              isAllowDelete={true}
              isEdit={true}
              refrehPage={() => {
                let tData = inputParam;
                setInputParam({ ...tData });
              }}
              onEditPress={(data) => {
                if (data && data.TranId) {
                  setInvoiceId(data.TranId);
                  setEntryType({ EntryMode: "E", data: data.TranId });
                } else {
                  setInvoiceId();
                  setEntryType();
                }
              }}
              onDeletePress={(data) => {
                deleteServiceInvoice(CompCode, data.TranId).then((res) => {
                  setInputParam({ ...inputParam, TranType: "INV" });
                });
              }}
            />
          </div>
        </>
      )}

      {entryType &&
        (entryType.EntryMode === "A" ||
          (entryType.EntryMode === "E" && entryType.data)) && (
          <GenricInvoiceCard
            entryType={entryType}
            onBackPress={() => {
              setEntryType();
            }}
            VoucherId={InvoiceId}
          />
        )}
      <Drawer
        placement="right"
        closable={true}
        width={window.innerWidth > 800 ? "60%" : "100%"}
        bodyStyle={{ padding: 0 }}
        destroyOnClose={true}
        onClose={() => {
          setDrawerShow({
            data: null,
            visible: false,
          });
        }}
        visible={DrawerShow.visible}
      >
        <GenericInvoiceViewComponent
          data={DrawerShow.data}
          onClose={() => {
            setDrawerShow({
              data: null,
              visible: false,
            });
          }}
          PrintStatus={PrintStatus}
          onPrintClick={() => {
            setPrintStatus(true);
            let dataType = "pdf";
            if (window.electron) {
              dataType = "html";
            }
            getGenericInvoicePdf(CompCode, DrawerShow.VoucherId, dataType).then(
              (res) => {
                if (res) {
                  PrintPdfOrFromElectron(res, `${DrawerShow.data}`, dataType);
                  setPrintStatus(false);
                }
              }
            );
          }}
        />
      </Drawer>
    </div>
  );
};

export default GenricInvoice;
